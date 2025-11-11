export const PERMISSIONS = {
  ventas: {
    view: ["admin", "asistente", "readonly"],
    create: ["admin", "asistente"],
    edit: ["admin", "asistente"],
    delete: ["admin"],
  },
  compras: {
    view: ["admin", "asistente", "readonly"],
    create: ["admin", "asistente"],
    edit: ["admin", "asistente"],
    delete: ["admin"],
  },
  inventario: {
    view: ["admin", "asistente", "readonly"],
    create: ["admin", "asistente"],
    edit: ["admin", "asistente"],
    delete: ["admin"],
  },
  clientes: {
    view: ["admin", "asistente", "readonly"],
    create: ["admin", "asistente"],
    edit: ["admin", "asistente"],
    delete: ["admin"],
  },
  pyg: {
    view: ["admin", "readonly"],
  },
  integraciones: {
    view: ["admin"],
    edit: ["admin"],
    test: ["admin"],
  },
  usuarios: {
    view: ["admin"],
    create: ["admin"],
    edit: ["admin"],
    delete: ["admin"],
  },
  configuracion: {
    view: ["admin", "asistente"],
    edit: ["admin"],
  },
} as const;

export type Module = keyof typeof PERMISSIONS;
export type Action = "view" | "create" | "edit" | "delete" | "test";
export type Role = "admin" | "asistente" | "readonly";

export function hasPermission(
  userRole: string | undefined,
  module: Module,
  action: Action
): boolean {
  if (!userRole) return false;

  const modulePermissions = PERMISSIONS[module];
  if (!modulePermissions) return false;

  const actionPermissions = modulePermissions[action as keyof typeof modulePermissions];
  if (!actionPermissions) return false;

  return (actionPermissions as readonly string[]).includes(userRole);
}

export function canAccess(userRole: string | undefined, module: Module): boolean {
  return hasPermission(userRole, module, "view");
}
