// app/isr/page.tsx
import ClientNews from "./ClientNews";

export const revalidate = 10; // ISR every 10 seconds

async function getData() {
  try {
    const res = await fetch("http://localhost:3000/api/news", {
      next: { revalidate: 10 }, // ISR caching
    });

    if (!res.ok) throw new Error("Failed to fetch server data");

    const data = await res.json();
    return { data, fromCache: false, error: null };
  } catch (err) {
    console.error("ISR fetch error:", err);
    return { data: [], fromCache: true, error: "Server fetch failed" };
  }
}

export default async function NewsPage() {
  const result = await getData();

  return (
    <div style={{ fontFamily: "sans-serif", padding: "20px" }}>
      <h1>📰 Latest News (ISR + SWR)</h1>
      {result.error && (
        <p style={{ color: "red" }}>⚠️ {result.error} (showing cache)</p>
      )}
      <ClientNews fallbackData={result.data} />
    </div>
  );
}
