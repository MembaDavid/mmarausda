import React, { useState } from "react";

("use client");

const randomNames = [
  "Alice",
  "Bob",
  "Charlie",
  "Diana",
  "Eve",
  "Frank",
  "Grace",
  "Heidi",
];

function getRandomName() {
  return randomNames[Math.floor(Math.random() * randomNames.length)];
}

function getRandomId() {
  return Math.floor(Math.random() * 10000);
}

export default function AdminPage() {
  const [users, setUsers] = useState<{ id: number; name: string }[]>([]);

  const addRandomUser = () => {
    setUsers((prev) => [...prev, { id: getRandomId(), name: getRandomName() }]);
  };

  const removeUser = (id: number) => {
    setUsers((prev) => prev.filter((user) => user.id !== id));
  };

  return (
    <main style={{ padding: 32 }}>
      <h1>Admin Panel</h1>
      <button onClick={addRandomUser}>Add Random User</button>
      <ul>
        {users.map((user) => (
          <li key={user.id} style={{ margin: "8px 0" }}>
            {user.name} (ID: {user.id})
            <button
              style={{ marginLeft: 12 }}
              onClick={() => removeUser(user.id)}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
      {users.length === 0 && <p>No users added yet.</p>}
    </main>
  );
}
