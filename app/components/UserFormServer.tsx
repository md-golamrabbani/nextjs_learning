"use client";

import React from "react";

export default function UserFormServer({
  createUserAction,
}: {
  createUserAction: (formData: FormData) => Promise<void>;
}) {
  return (
    <form
      action={createUserAction}
      className="mb-4 space-y-2 border p-4 rounded bg-gray-50"
    >
      <input
        name="name"
        placeholder="Name"
        className="border p-2 w-full"
        required
      />
      <input
        name="email"
        placeholder="Email"
        className="border p-2 w-full"
        required
      />
      <input name="phone" placeholder="Phone" className="border p-2 w-full" />
      <input
        name="address"
        placeholder="Address"
        className="border p-2 w-full"
      />
      <input
        name="country"
        placeholder="Country"
        className="border p-2 w-full"
      />
      <input
        name="avatar"
        placeholder="Avatar URL"
        className="border p-2 w-full"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Add User
      </button>
    </form>
  );
}
