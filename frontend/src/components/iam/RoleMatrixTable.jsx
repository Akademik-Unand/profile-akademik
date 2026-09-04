import { Fragment } from 'react';
import { PERMISSION_GROUP_LABELS } from '../../helpers/permissionGroups';
import { roleLabel } from '../../constants/roles';

/**
 * Matriks checkbox permission per peran, dikelompokkan.
 */
export function RoleMatrixTable({ roles, groups, draft, onToggle, readOnly = false }) {
  if (!roles.length) return <p className="text-sm text-base-content/70">Belum ada peran untuk diatur.</p>;
  if (!Object.keys(groups).length) return <p className="text-sm text-base-content/70">Tidak ada permission.</p>;

  return (
    <div className="overflow-x-auto rounded-md border border-base-300">
      <table className="table">
        <thead>
          <tr>
            <th>Permission</th>
            {roles.map((role) => (
              <th key={role.name} className="text-center">
                {roleLabel(role.name) || role.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Object.entries(groups).map(([group, permissions]) => (
            <Fragment key={group}>
              <tr className="bg-base-200">
                <td colSpan={roles.length + 1} className="text-xs tracking-wide uppercase text-base-content/60">
                  {PERMISSION_GROUP_LABELS[group] || group}
                </td>
              </tr>
              {permissions.map((permission) => (
                <tr key={permission.id}>
                  <td>
                    <p className="text-sm">{permission.name}</p>
                    <p className="text-xs text-base-content/60">{permission.description}</p>
                  </td>
                  {roles.map((role) => (
                    <td key={`${role.name}-${permission.id}`} className="text-center">
                      {readOnly ? (
                        (draft[role.name] || []).includes(permission.id) ? 'Ya' : '—'
                      ) : (
                        <input
                          type="checkbox"
                          className="checkbox checkbox-sm"
                          checked={(draft[role.name] || []).includes(permission.id)}
                          onChange={() => onToggle(role.name, permission.id)}
                          aria-label={`${permission.name} ${role.name}`}
                        />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
