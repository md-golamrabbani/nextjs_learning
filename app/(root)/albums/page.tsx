// "use cache";

import { cacheLife } from "next/dist/server/use-cache/cache-life";

interface Album {
  userId: number;
  id: number;
  title: string;
}

async function getAlbums(): Promise<Album[]> {
  // cacheLife("hours");
  const res = await fetch("https://jsonplaceholder.typicode.com/albums", {
    next: { revalidate: 60 }, // Revalidate every 60s (ISR)
  });

  if (!res.ok) {
    throw new Error("Failed to fetch albums");
  }

  return res.json();
}

export default async function AlbumsPage() {
  const albums = await getAlbums();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Albums</h1>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {albums.map((album) => (
          <li
            key={album.id}
            className="p-4 border rounded-lg shadow-sm hover:shadow-md transition"
          >
            <h2 className="font-semibold">#{album.id}</h2>
            <p className="text-gray-700">{album.title}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
