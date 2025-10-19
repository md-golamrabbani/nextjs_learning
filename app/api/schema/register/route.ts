import { NextResponse } from "next/server";

export async function GET() {
  const schema = {
    title: "User Registration",
    type: "object",
    required: ["username", "email", "password"],
    properties: {
      username: {
        type: "string",
        title: "Username",
        placeholder: "Enter your username",
        class: "sm:col-span-3",
        ui: { component: "input" },
        validation: {
          min: 3,
          message: "Username must be at least 3 characters",
        },
      },
      email: {
        type: "string",
        format: "email",
        title: "Email",
        placeholder: "you@example.com",
        class: "sm:col-span-3",
        ui: { component: "input" },
        validation: { email: true, message: "Invalid email address" },
      },
      password: {
        type: "string",
        title: "Password",
        placeholder: "••••••••",
        class: "col-span-full",
        ui: { component: "password" },
        validation: {
          min: 6,
          message: "Password must be at least 6 characters",
        },
      },
    },
    layout: {
      formClass: "mt-10 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6",
      actions: [{ type: "submit", label: "Register", class: "w-full" }],
    },
  };

  return NextResponse.json(schema);
}
