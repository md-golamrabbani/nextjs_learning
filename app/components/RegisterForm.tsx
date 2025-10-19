"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Helper to build zod schema dynamically from server schema
const buildZodSchema = (schema: any) => {
  const shape: Record<string, any> = {};
  for (const [key, prop] of Object.entries<any>(schema.properties)) {
    let zodField = z.string();

    // required
    if (schema.required?.includes(key)) {
      zodField = zodField.min(1, `${prop.title} is required`);
    }

    // email validation
    if (prop.validation?.email) {
      zodField = zodField.email(prop.validation.message);
    }

    // min length
    if (prop.validation?.min) {
      zodField = zodField.min(
        prop.validation.min,
        prop.validation.message || `${prop.title} is too short`
      );
    }

    shape[key] = zodField;
  }
  return z.object(shape);
};

export default function RegisterForm() {
  const [schema, setSchema] = useState<any>(null);
  const [zodSchema, setZodSchema] = useState<any>(null);

  const form = useForm({
    resolver: zodResolver(zodSchema || z.object({})),
    defaultValues: {},
  });

  useEffect(() => {
    fetch("/api/schema/register")
      .then((res) => res.json())
      .then((data) => {
        setSchema(data);
        const built = buildZodSchema(data);
        setZodSchema(built);

        // set default values
        const defaults: Record<string, string> = {};
        Object.keys(data.properties).forEach((key) => (defaults[key] = ""));
        form.reset(defaults);
      });
  }, []);

  const onSubmit = async (values: Record<string, string>) => {
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const result = await res.json();
      alert(result.message || "Registered!");
    } catch (err) {
      console.error(err);
    }
  };

  if (!schema) return <div className="text-center mt-10">Loading...</div>;

  return (
    <Card className="max-w-2xl mx-auto mt-10 p-6 shadow-lg">
      <CardHeader>
        <h2 className="text-2xl font-bold text-center">{schema.title}</h2>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={schema.layout?.formClass || "grid grid-cols-1 gap-6"}
        >
          {Object.entries(schema.properties).map(
            ([key, prop]: [string, any]) => {
              const error = form.formState.errors[key];
              return (
                <div
                  key={key}
                  className={`${prop.class || "w-full"} flex flex-col`}
                >
                  <Label htmlFor={key} className="mb-1 font-medium">
                    {prop.title}{" "}
                    {schema.required?.includes(key) && (
                      <span className="text-red-500">*</span>
                    )}
                  </Label>

                  <Input
                    id={key}
                    type={
                      prop.ui?.component === "password"
                        ? "password"
                        : prop.format === "email"
                        ? "email"
                        : "text"
                    }
                    placeholder={prop.placeholder || ""}
                    {...form.register(key)}
                  />
                  {error && (
                    <span className="text-sm text-red-500 mt-1">
                      {(error as any).message}
                    </span>
                  )}
                </div>
              );
            }
          )}

          {schema.layout?.actions?.map((action: any, index: number) => (
            <div key={index} className="col-span-full mt-4">
              <Button
                type={action.type}
                className={action.class || "w-full"}
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting && action.type === "submit"
                  ? "Submitting..."
                  : action.label}
              </Button>
            </div>
          ))}
        </form>
      </CardContent>
    </Card>
  );
}
