
'use client'
import { useState, useEffect } from "react";

interface User {
  _id: string;
  name: string;
  email: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const res = await fetch("/api/users");
    const data = await res.json();
    setUsers(data.users);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingUser ? "PUT" : "POST";
    const body = JSON.stringify(
        editingUser ? { id: editingUser._id, name, email } : { name, email }
    );

    await fetch("/api/users", {
      method,
      headers: { "Content-Type": "application/json" },
      body,
    });

    setName("");
    setEmail("");
    setEditingUser(null);
    fetchUsers();
  };

  const handleDelete = async (id: string) => {
    await fetch("/api/users", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchUsers();
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setName(user.name);
    setEmail(user.email);
  };

  return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">User Management</h1>
        <form onSubmit={handleSubmit} className="mb-4 flex gap-2">
          <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border p-2 rounded w-1/3"
              required
          />
          <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border p-2 rounded w-1/3"
              required
          />
          <button className="bg-blue-500 text-white px-4 py-2 rounded">
            {editingUser ? "Update User" : "Add User"}
          </button>
        </form>

        <table className="w-full border-collapse border border-gray-300">
          <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Actions</th>
          </tr>
          </thead>
          <tbody>
          {users.map((user) => (
              <tr key={user._id} className="border">
                <td className="border p-2">{user.name}</td>
                <td className="border p-2">{user.email}</td>
                <td className="border p-2 flex gap-2">
                  <button
                      onClick={() => handleEdit(user)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                      onClick={() => handleDelete(user._id)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
          ))}
          </tbody>
        </table>
      </div>
  );
}
