import type { Role, Todo, User, Comment } from "./data/types";

type PermissionCheck<Key extends keyof Permissions> = 
    | boolean 
    | ((user: User, data: Permissions[Key]["dataType"]) => boolean);

type RolesWithPermissions = {
    [R in Role]: Partial<{
        [Key in keyof Permissions]: Partial<{
            [Action in Permissions[Key]["action"]]: PermissionCheck<Key>
        }>
    }>
}

type Permissions = {
    comments: {
        action: "view" | "create" | "update",
        dataType: Comment
    },
    todos: {
        // TODO Can do something like Pick<Todo, "userId"> to get just the rows we use
        action: "view" | "create" | "update" | "delete",
        dataType: Todo
    }
}
const ROLES = {
    admin: {
        todos: {
            view: true,
            create: true,
            update: true,
            delete: true
        },
        comments: {
            view: true,
            create: true,
            update: true
        }
    },
    moderator: {
        comments: {
            view: true,
            create: true,
            update: true
        },
        todos: {
            view: true,
            create: true,
            update: true,
            delete: (_, todo) => todo.completed
        }
    },
    user: {
        todos: {
            view: (user, todo) => !user.blockedBy.includes(todo.userId),
            create: true,
            update: (user, todo) => todo.userId === user.id || todo.invitedUsers.includes(user.id),
            delete: (user, todo) => (todo.userId === user.id || todo.invitedUsers.includes(user.id)) && todo.completed
        },
        comments: {
            view: (user, comment) => !user.blockedBy.includes(comment.authorId),
            create: true,
            update: (user, comment) => comment.authorId === user.id
        }
    } 
} as const satisfies RolesWithPermissions;

// When passing data you are checking for permissions on a specific resource, when not passing data you are checking for general permissions on that resource (e.g. can the user create a todo in general, without checking a specific todo)
export function hasPermission<Resource extends keyof Permissions>(
    user: User,
    resource: Resource,
    action: Permissions[Resource]["action"],
    data?: Permissions[Resource]["dataType"]
){
    return user.roles.some(role => {
        const permission = (ROLES as RolesWithPermissions)[role][resource]?.[action];
        if(permission === null || permission === undefined) return false;

        if(typeof permission === "boolean") return permission;
        return data != null && permission(user, data);
    })
}

