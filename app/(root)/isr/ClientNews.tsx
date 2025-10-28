"use client";

import useSWR from "swr";

export default function ClientNews({ fallbackData }: { fallbackData: any }) {
  const fetcher = async (url: string) => {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch client data");
    return res.json();
  };

  const { data, error, isLoading, isValidating } = useSWR(
    "/api/news",
    fetcher,
    {
      fallbackData,
      refreshInterval: 30000, // refresh every 30s
      revalidateOnFocus: true,
    }
  );

  if (isLoading) return <p>Loading…</p>;
  if (error)
    return (
      <p style={{ color: "red" }}>
        ❌ Client fetch failed — showing cached ISR data
      </p>
    );

  return (
    <div>
      {data?.map((item: any) => (
        <div
          key={item.id}
          style={{
            marginBottom: "10px",
            background: isValidating ? "#fffbe6" : "#e8f5e9",
            padding: "8px",
            borderRadius: "6px",
          }}
        >
          <strong>{item.title}</strong>
          <br />
          <small>Updated at: {item.time}</small>
        </div>
      ))}
    </div>
  );
}
