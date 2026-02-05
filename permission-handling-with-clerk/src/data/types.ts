export type Role = "admin" | "moderator" | "user";

export type User = {
  id: string;
  roles: Role[];
  blockedBy: string[];
}

export type Comment = {
    id: number;
    content: string;
    authorId: string; // ID del usuario que escribió el comentario
}

export type Todo = {
    id: string;
    title: string;
    userId: string;
    completed: boolean;
    invitedUsers: string[];
}