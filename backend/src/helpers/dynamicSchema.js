const Joi = require('joi');
const AppError = require('../utils/AppError');
const { sanitizeHtml } = require('./sanitizeHtml');

const FIELD_TYPES = ['text', 'textarea', 'richtext', 'number', 'boolean', 'date', 'datetime', 'select', 'multiselect', 'media', 'url', 'email', 'repeater'];
const RESERVED_KEYS = new Set(['__proto__', 'prototype', 'constructor', 'id', 'unitId', 'contentTypeId', 'schemaVersion', 'slug', 'title', 'status', 'createdAt', 'updatedAt', 'publishedAt']);
const KEY_RE = /^[a-z][a-zA-Z0-9_]{1,49}$/;
const MAX_FIELDS = 50;
const MAX_REPEATER_DEPTH = 1;

function fail(message) { throw new AppError(message, 422); }
function plainObject(value) { return value && typeof value === 'object' && !Array.isArray(value); }

function normalizeField(field, depth = 0) {
  if (!plainObject(field)) fail('Definisi field tidak valid');
  const key = String(field.key || '');
  if (!KEY_RE.test(key) || RESERVED_KEYS.has(key)) fail(`Key field tidak diizinkan: ${key || '(kosong)'}`);
  if (!FIELD_TYPES.includes(field.type)) fail(`Tipe field tidak didukung: ${field.type}`);
  const normalized = {
    key,
    label: String(field.label || key).slice(0, 120),
    type: field.type,
    required: Boolean(field.required),
    public: field.public !== false,
    searchable: Boolean(field.searchable),
    filterable: Boolean(field.filterable),
    sortable: Boolean(field.sortable),
  };
  if (field.helpText) normalized.helpText = String(field.helpText).slice(0, 300);
  if (field.min !== undefined) normalized.min = Number(field.min);
  if (field.max !== undefined) normalized.max = Number(field.max);
  if (['select', 'multiselect'].includes(field.type)) {
    if (!Array.isArray(field.options) || field.options.length > 100) fail(`Opsi field ${key} tidak valid`);
    normalized.options = field.options.map((option) => String(plainObject(option) ? option.value : option).slice(0, 120));
    if (new Set(normalized.options).size !== normalized.options.length) fail(`Opsi field ${key} harus unik`);
  }
  if (field.type === 'repeater') {
    if (depth >= MAX_REPEATER_DEPTH) fail('Repeater bertingkat tidak diizinkan');
    normalized.maxItems = Math.min(Math.max(Number(field.maxItems) || 20, 1), 100);
    normalized.fields = normalizeSchema({ fields: field.fields }, depth + 1).fields;
  }
  return normalized;
}

function normalizeSchema(schema, depth = 0) {
  if (!plainObject(schema) || !Array.isArray(schema.fields)) fail('Schema harus memiliki daftar fields');
  if (!schema.fields.length || schema.fields.length > MAX_FIELDS) fail(`Schema harus memiliki 1-${MAX_FIELDS} field`);
  const fields = schema.fields.map((field) => normalizeField(field, depth));
  if (new Set(fields.map((field) => field.key)).size !== fields.length) fail('Key field harus unik');
  return { fields };
}

function fieldJoi(field) {
  let validator;
  switch (field.type) {
    case 'text': case 'textarea': case 'richtext': validator = Joi.string().max(field.max || (field.type === 'text' ? 500 : 50000)); break;
    case 'number': validator = Joi.number(); break;
    case 'boolean': validator = Joi.boolean(); break;
    case 'date': case 'datetime': validator = Joi.date().iso(); break;
    case 'select': validator = Joi.string().valid(...field.options); break;
    case 'multiselect': validator = Joi.array().items(Joi.string().valid(...field.options)).max(100); break;
    case 'media': validator = Joi.number().integer().positive(); break;
    case 'url': validator = Joi.string().uri({ scheme: ['http', 'https'] }).max(2048); break;
    case 'email': validator = Joi.string().email().max(320); break;
    case 'repeater': validator = Joi.array().items(Joi.object(Object.fromEntries(field.fields.map((item) => [item.key, fieldJoi(item)]))).unknown(false)).max(field.maxItems); break;
    default: fail(`Tipe field tidak didukung: ${field.type}`);
  }
  if (field.min !== undefined && typeof validator.min === 'function') validator = validator.min(field.min);
  return field.required ? validator.required() : validator.allow(null).optional();
}

function validateEntryData(schema, data) {
  const normalized = normalizeSchema(schema);
  const validator = Joi.object(Object.fromEntries(normalized.fields.map((field) => [field.key, fieldJoi(field)]))).unknown(false);
  const { error, value } = validator.validate(data, { abortEarly: false, convert: true });
  if (error) throw new AppError('Data entri tidak sesuai schema', 422, error.details.map((d) => ({ field: d.path.join('.'), message: d.message })));
  const byKey = Object.fromEntries(normalized.fields.map((field) => [field.key, field]));
  Object.keys(value).forEach((key) => {
    if (byKey[key].type === 'richtext' && typeof value[key] === 'string') value[key] = sanitizeHtml(value[key]);
    if (byKey[key].type === 'repeater' && Array.isArray(value[key])) value[key] = value[key].map((row) => validateEntryData({ fields: byKey[key].fields }, row));
  });
  return value;
}

function assertCompatibleSchema(previous, next) {
  if (!previous) return;
  const oldFields = new Map(normalizeSchema(previous).fields.map((field) => [field.key, field]));
  const newFields = new Map(normalizeSchema(next).fields.map((field) => [field.key, field]));
  oldFields.forEach((field, key) => {
    const candidate = newFields.get(key);
    if (!candidate) fail(`Field ${key} tidak boleh dihapus; nonaktifkan dari tampilan publik`);
    if (candidate.type !== field.type) fail(`Tipe field ${key} tidak boleh diubah`);
    if (!field.required && candidate.required) fail(`Field ${key} tidak boleh dijadikan wajib pada schema aktif`);
  });
}

function publicData(schema, data) {
  const fields = normalizeSchema(schema).fields;
  return Object.fromEntries(fields.filter((field) => field.public).filter((field) => Object.prototype.hasOwnProperty.call(data || {}, field.key)).map((field) => [field.key, data[field.key]]));
}

module.exports = { FIELD_TYPES, normalizeSchema, validateEntryData, assertCompatibleSchema, publicData };
