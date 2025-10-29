// app/components/UserFormClient.tsx
"use client";

import React from "react";

type Props = {
  createUserAction: (formData: FormData) => Promise<void>;
};

export default function UserFormClient({ createUserAction }: Props) {
  return (
    <form
      action={createUserAction}
      className="mb-4 space-y-2 border p-4 rounded bg-gray-50"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
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
          name="country"
          placeholder="Country"
          className="border p-2 w-full"
        />
        <input
          name="address"
          placeholder="Address"
          className="border p-2 w-full md:col-span-2"
        />
        <input
          name="avatar"
          placeholder="Avatar URL"
          className="border p-2 w-full md:col-span-2"
        />
      </div>

      <div className="pt-2">
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add User
        </button>
      </div>
    </form>
  );
}
