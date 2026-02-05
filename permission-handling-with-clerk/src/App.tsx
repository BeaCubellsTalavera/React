import { type User, type Todo } from "./data/types";
import './App.css'
import { hasPermission } from "./auth";

const todos = [
  {
    id: "1",
    title: 'Buy groceries',
    userId: "1",
    completed: false,
    invitedUsers: [],
  },
  {
    id: "2",
    title: 'Learn Auth',
    userId: "1",
    completed: true,
    invitedUsers: [],
  },
  {
    id: "3",
    title: 'Build a project',
    userId: "2",
    completed: false,
    invitedUsers: ["1", "3"],
  },
  {
    id: "4",
    title: 'Master Auth',
    userId: "2",
    completed: false,
    invitedUsers: ["1", "3"],
  }
];

const user: User = {
  roles: ['moderator'],
  id: '1',
  blockedBy: []
}

function App() {

  return (
    <div className="container mx-auto px-4 my-6">
      <h1 className="text-2xl font-semibold mb-4">
        {user.id}: {user.roles.join(', ')}
      </h1>
      <h2>For all todos: </h2>
      <div className="flex gap-4 mb-4">
        <GeneralButtonCheck resource="todos" action="view" />
        <GeneralButtonCheck resource="todos" action="create" />
        <GeneralButtonCheck resource="todos" action="update" />
        <GeneralButtonCheck resource="todos" action="delete" />
      </div>
      <h2>For specific todos: </h2>
      <ul className='grid gap-4 grid-cols-2'>
        {todos.map((todo) => (
          <li key={todo.id}>
            {
              /*
              Es equivalenete a escribir:
              <Todo 
                id={1}
                title="Buy groceries"
                userId={1}
                completed={false}
                invitedUsers={[]}
              />
              */
            }
            <Todo {...todo} />
          </li>
        ))}
      </ul>
    </div>
  )
}

function Todo(todo: Todo) {
  const { title, userId, completed, invitedUsers } = todo;

  return (
    <>
      <div>
        {completed ? '✅' : '❌'} {title}
        <h3>
          User {userId}{" "}
          {invitedUsers.length > 0 && `( User: ${invitedUsers.join(', User ')} )`}
        </h3>
      </div>
      <div>
        <TodoButtonCheck action="view" todo={todo} />
        <TodoButtonCheck action="update" todo={todo} />
        <TodoButtonCheck action="delete" todo={todo} />
      </div>
    </>
  )
}

function GeneralButtonCheck({ resource, action }:
  { resource: "todos" | "comments", action: "view" | "create" | "update" | "delete" }) {
  return (
    <button style={{backgroundColor: hasPermission(user, resource, action) ? "green" : "red"}} disabled={!hasPermission(user, resource, action)}>
      {action}
    </button>
  )
}

function TodoButtonCheck({ todo, action }: { todo: Todo, action: "view" | "delete" | "update" | "create" }) {
  return (
    <button style={{backgroundColor: hasPermission(user, "todos", action, todo) ? "green" : "red"}} 
      disabled={!hasPermission(user, "todos", action, todo)}>
      {action}
    </button>
  )
}

export default App
