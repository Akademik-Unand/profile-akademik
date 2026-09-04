const path = require('path');
const fs = require('fs/promises');
const sharp = require('sharp');
const { Media, MediaFolder, Unit } = require('../models');
const AppError = require('../utils/AppError');
const buildQueryOptions = require('../helpers/buildQueryOptions');
const { applyUnitScope, applyListUnitFilter, assertUnitAccess, resolveCreateUnitId } = require('../helpers/unitScope');
const env = require('../config/env');
const { ensureDir } = require('../middlewares/upload');
const logger = require('../utils/logger');

function publicUrl(filename, sub = '') {
  const prefix = env.publicUploadUrl.replace(/\/$/, '');
  return sub ? `${prefix}/${sub}/${filename}` : `${prefix}/${filename}`;
}

async function listAdmin(query, currentUser) {
  const extraWhere = applyListUnitFilter(applyUnitScope({}, currentUser), query, currentUser);
  if (query.folderId) extraWhere.folderId = Number(query.folderId);
  if (query.mimeType) extraWhere.mimeType = query.mimeType;

  const { where, order, limit, offset, page } = buildQueryOptions(query, {
    searchableFields: ['filename', 'altText'],
    sortableFields: ['filename', 'createdAt', 'sizeBytes'],
    extraWhere,
  });

  const { rows, count } = await Media.findAndCountAll({
    where,
    order,
    limit,
    offset,
    include: [
      { model: MediaFolder, as: 'folder', attributes: ['id', 'name'] },
      { model: Unit, as: 'unit', attributes: ['id', 'name', 'slug'] },
    ],
  });
  return { items: rows, page, limit, total: count };
}

async function listFolders(query, currentUser) {
  const extraWhere = applyListUnitFilter(applyUnitScope({}, currentUser), query, currentUser);
  const items = await MediaFolder.findAll({ where: extraWhere, order: [['name', 'ASC']] });
  return { items };
}

async function getById(id, currentUser) {
  const media = await Media.findByPk(id);
  if (!media) throw new AppError('Media tidak ditemukan', 404);
  assertUnitAccess(currentUser, media.unitId);
  return media;
}

async function createFolder(payload, currentUser) {
  const unitId = resolveCreateUnitId(currentUser, payload.unitId);
  const folder = await MediaFolder.create({ unitId, name: payload.name });
  logger.info({ folderId: folder.id, unitId }, 'Media folder created');
  return folder;
}

async function removeFolder(id, currentUser) {
  const folder = await MediaFolder.findByPk(id);
  if (!folder) throw new AppError('Folder tidak ditemukan', 404);
  assertUnitAccess(currentUser, folder.unitId);
  await folder.destroy();
}

async function createFromUpload(file, body, currentUser) {
  if (!file) throw new AppError('File wajib diunggah', 422);
  const unitId = resolveCreateUnitId(currentUser, body.unitId);
  if (body.folderId) {
    const folder = await MediaFolder.findByPk(Number(body.folderId));
    if (!folder || folder.unitId !== unitId) {
      throw new AppError('Folder tidak valid', 422);
    }
  }

  let width = null;
  let height = null;
  let thumbnailUrl = null;

  if (file.mimetype.startsWith('image/')) {
    const image = sharp(file.path);
    const meta = await image.metadata();
    width = meta.width || null;
    height = meta.height || null;
    const thumbDir = path.join(env.uploadDir, 'thumbs');
    ensureDir(thumbDir);
    const thumbName = `thumb-${file.filename}`;
    await image.resize({ width: 400, withoutEnlargement: true }).toFile(path.join(thumbDir, thumbName));
    thumbnailUrl = publicUrl(thumbName, 'thumbs');
  }

  const media = await Media.create({
    unitId,
    folderId: body.folderId ? Number(body.folderId) : null,
    filename: file.originalname,
    url: publicUrl(file.filename),
    thumbnailUrl,
    mimeType: file.mimetype,
    sizeBytes: file.size,
    width,
    height,
    altText: body.altText || null,
    uploadedBy: currentUser.id,
  });
  logger.info({ mediaId: media.id, unitId }, 'Media uploaded');
  return media;
}

async function update(id, payload, currentUser) {
  const media = await getById(id, currentUser);
  await media.update({
    altText: payload.altText !== undefined ? payload.altText : media.altText,
    folderId: payload.folderId !== undefined ? payload.folderId : media.folderId,
  });
  return media;
}

async function remove(id, currentUser) {
  const media = await getById(id, currentUser);
  const fileName = path.basename(media.url);
  const abs = path.join(env.uploadDir, fileName);
  try {
    await fs.unlink(abs);
  } catch {
    /* file may already be gone */
  }
  if (media.thumbnailUrl) {
    const thumb = path.basename(media.thumbnailUrl);
    try {
      await fs.unlink(path.join(env.uploadDir, 'thumbs', thumb));
    } catch {
      /* ignore */
    }
  }
  await media.destroy();
  logger.info({ mediaId: id }, 'Media deleted');
}

module.exports = {
  listAdmin,
  listFolders,
  getById,
  createFolder,
  removeFolder,
  createFromUpload,
  update,
  remove,
};
