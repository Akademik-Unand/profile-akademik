function scopeKey(unitId) {
  return unitId === null || unitId === undefined ? 'main' : `unit:${Number(unitId)}`;
}
module.exports = { scopeKey };
