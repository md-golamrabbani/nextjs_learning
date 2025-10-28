// app/api/news/route.ts
export async function GET() {
  // simulate random API failure
  const failChance = Math.random() < 0.3; // 30% chance of failure

  if (failChance) {
    return new Response(JSON.stringify({ error: "Random API failure" }), {
      status: 500,
    });
  }

  const randomId = Math.floor(Math.random() * 1000);
  const data = [
    {
      id: randomId,
      title: `Breaking News #${randomId}`,
      time: new Date().toLocaleTimeString(),
    },
  ];
  return Response.json(data);
}
