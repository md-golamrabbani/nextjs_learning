"use client";

import React, { useState } from "react";

interface UserFormProps {
  onSuccess: () => void; // Callback to refresh table
}

export default function UserForm({ onSuccess }: UserFormProps) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    country: "",
    avatar: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({
      name: "",
      email: "",
      phone: "",
      address: "",
      country: "",
      avatar: "",
    });
    onSuccess(); // Refresh table
  };

  return (
    <form className="mb-4 space-y-2 border p-4 rounded" onSubmit={handleSubmit}>
      <input
        name="name"
        placeholder="Name"
        value={form.name}
        onChange={handleChange}
        className="border p-2 w-full"
      />
      <input
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        className="border p-2 w-full"
      />
      <input
        name="phone"
        placeholder="Phone"
        value={form.phone}
        onChange={handleChange}
        className="border p-2 w-full"
      />
      <input
        name="address"
        placeholder="Address"
        value={form.address}
        onChange={handleChange}
        className="border p-2 w-full"
      />
      <input
        name="country"
        placeholder="Country"
        value={form.country}
        onChange={handleChange}
        className="border p-2 w-full"
      />
      <input
        name="avatar"
        placeholder="Avatar URL"
        value={form.avatar}
        onChange={handleChange}
        className="border p-2 w-full"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Add User
      </button>
    </form>
  );
}
