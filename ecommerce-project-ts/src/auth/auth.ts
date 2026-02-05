import type { User } from "../types";

// type Role = "admin" | "user"
export type Role = keyof typeof ROLES;

/*
typeof ROLES[Role] is like ROLES["admin"] | ROLES["user"], which is a union of the arrays of permissions for each role
and results in readonly ["view:products", "create:products", "update:products", "delete:products"] | readonly ["view:products"]
then we index into that with [number] to get the individual permissions, which results in "view:products" | "create:products" | "update:products" | "delete:products" | "view:products"

[number] obtiene el tipo de los elementos de los arrays. En TypeScript, [number] en un tipo de array obtiene el tipo union de todos sus elementos.
type Permission = "view:products" | "create:products" | "update:products" | "delete:products"
Este patrón es muy útil porque si agregas nuevos permisos a ROLES, el tipo Permission se actualiza automáticamente sin necesidad de mantener una definición separada.
*/
type Permission = typeof ROLES[Role][number];

const ROLES = {
    admin: [
        "view:products",
        "create:products",
        "update:products",
        "delete:products"
    ],
    user: [
        "view:products",
    ]
} as const;
/*
Gracias a "as const", TypeScript infiere que los arrays son de tipo readonly y que sus elementos son literales de cadena, lo que permite que el tipo Permission sea un union de esos literales en lugar de simplemente string.
{
    readonly admin: readonly ["view:products", "create:products", "update:products", "delete:products"];
    readonly user: readonly ["view:products"];
}
1. Hace inmutable el objeto ROLES y todas sus propiedades
2. Preserva los tipos literales. En lugar de string[], obtiene tuplas con los valores exactos
3. Hace que no puedas modificar ROLES después de definirlo
Si no usáramos "as const", TypeScript inferiría los tipos de los arrays como string[], lo que haría que el tipo Permission fuera simplemente string, perdiendo la especificidad de los permisos.
{
    admin: string[];
    user: string[];
}
*/

export function hasPermission(
    user: Pick<User, 'id' | 'role'>,
    permission: Permission
): boolean {
    return (ROLES[user.role] as readonly Permission[]).includes(permission);
}