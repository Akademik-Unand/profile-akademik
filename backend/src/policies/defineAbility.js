const { AbilityBuilder, createMongoAbility } = require('@casl/ability');

const CMS_SUBJECTS = [
  'Page',
  'Post',
  'PostCategory',
  'Media',
  'MediaFolder',
  'Menu',
  'OrganizationMember',
  'Agenda',
  'Landing',
  'ContentType',
  'ContentEntry',
];

const SCOPED = new Set(CMS_SUBJECTS);

function applyGrant(can, grant, unitIds) {
  const action = grant.action;
  const subject = grant.subject;
  if (subject === 'Unit') {
    if (['read', 'update', 'delete', 'manage'].includes(action)) {
      can(action, 'Unit', { id: { $in: unitIds } });
    } else {
      can(action, 'Unit');
    }
    return;
  }
  if (SCOPED.has(subject) && ['update', 'delete', 'manage'].includes(action)) {
    can(action, subject, { unitId: { $in: unitIds } });
    return;
  }
  can(action, subject);
}

function applyDefaultAdminUnit(can, unitIds) {
  can('read', 'Unit', { id: { $in: unitIds } });
  can('update', 'Unit', { id: { $in: unitIds } });
  CMS_SUBJECTS.forEach((subject) => {
    can(['read', 'create'], subject);
    can(['update', 'delete', 'manage'], subject, { unitId: { $in: unitIds } });
  });
}

function defineAbility(user) {
  const { can, build } = new AbilityBuilder(createMongoAbility);

  if (!user) {
    return build();
  }

  if (user.role === 'superadmin') {
    can('manage', 'all');
    return build();
  }

  const unitIds = user.unitIds || [];

  if (Array.isArray(user.permissions) && user.permissions.length) {
    can('read', 'Unit', { id: { $in: unitIds } });
    user.permissions.forEach((grant) => applyGrant(can, grant, unitIds));
    return build();
  }

  applyDefaultAdminUnit(can, unitIds);
  return build();
}

module.exports = defineAbility;
module.exports.CMS_SUBJECTS = CMS_SUBJECTS;
