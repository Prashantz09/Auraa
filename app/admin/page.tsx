// import { redirect } from "next/navigation";
// import { isAdmin } from "../lib/isAdmin";
// import AdminClient from "./AdminClient";
// import { prisma } from "../lib/prisma";

// export default async function AdminPage() {
//   const admin = await isAdmin();
//   const videos = await prisma.video.findMany({
//     orderBy: { createdAt: "desc" },
//   });

//   if (!admin) redirect("/");

//   return (
//     <div className="p-10">
//       <h1 className="text-3xl font-bold mb-6">Auraa Tech Admin Dashboard</h1>

//       <AdminClient />
//     </div>
//   );
// }
"use client";
import { useState, useEffect } from "react";
import AddVideoForm from "./AdminClient";

export default function VideoAdmin() {
  const [videos, setVideos] = useState<any[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchVideos = async () => {
    const res = await fetch("/api/video");
    const data = await res.json();
    if (data.success) setVideos(data.data);
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this video?")) return;
    setLoading(true);
    const res = await fetch("/api/video", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    const data = await res.json();
    if (data.success) fetchVideos();
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6 space-y-12">
      <AddVideoForm
        fetchVideos={fetchVideos}
        editVideo={selectedVideo}
        clearEdit={() => setSelectedVideo(null)}
      />
      <div className="max-w-3xl mx-auto p-6 backdrop-blur-sm bg-white/10 border border-white/20 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold mt-10 mb-4 text-white underline">
          All Videos
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {videos.map((v) => (
            <div
              key={v.id}
              className="bg-white/10 backdrop-blur-sm p-4 rounded-xl shadow-lg"
            >
              <img
                src={v.imageUrl}
                className="rounded-md mb-2 w-full h-40 object-cover"
              />
              <h3 className="font-bold text-white">{v.title}</h3>
              <p className="text-white/70 text-sm mb-2">{v.description}</p>
              <div className="flex space-x-2">
                <button
                  onClick={() => setSelectedVideo(v)}
                  className="px-3 py-1 bg-green-500 rounded hover:bg-green-600 text-white text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(v.id)}
                  disabled={loading}
                  className="px-3 py-1 bg-red-500 rounded hover:bg-red-600 text-white text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
