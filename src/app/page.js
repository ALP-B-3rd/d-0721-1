"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      const { data, error } = await supabase
        .from("posts")
        .select("*, user:users(nickname)")
        .order("created_at", { ascending: true });
      if (!error) setPosts(data || []);
      setLoading(false);
    }
    fetchPosts();
  }, []);

  async function handleLike(postId) {
    await supabase.from("posts").update({ likes: supabase.literal('likes + 1') }).eq("id", postId);
    setPosts(posts => posts.map(p => p.id === postId ? { ...p, likes: (p.likes ?? 0) + 1 } : p));
  }
  async function handleDislike(postId) {
    await supabase.from("posts").update({ dislikes: supabase.literal('dislikes + 1') }).eq("id", postId);
    setPosts(posts => posts.map(p => p.id === postId ? { ...p, dislikes: (p.dislikes ?? 0) + 1 } : p));
  }
  async function handleDelete(postId) {
    await supabase.from("posts").delete().eq("id", postId);
    setPosts(posts => posts.filter(p => p.id !== postId));
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-extrabold text-blue-700 tracking-tight">오늘의 한 잔</h1>
        <button
          className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-2 rounded-full font-bold shadow hover:from-blue-600 hover:to-indigo-600 transition"
          onClick={() => router.push("/create")}
        >
          + 게시글 등록
        </button>
      </div>
      {loading ? (
        <div className="text-center py-20 text-lg text-gray-500 animate-pulse">불러오는 중...</div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20 text-gray-400">아직 게시글이 없습니다.</div>
      ) : (
        <ul className="space-y-8">
          {posts.map(post => (
            <li key={post.id} className="bg-white/80 border border-gray-200 rounded-2xl shadow-lg p-6 flex flex-col sm:flex-row gap-6 hover:shadow-2xl transition">
              {post.image_url && (
                <img src={post.image_url} alt="비주얼" className="w-32 h-32 object-cover rounded-xl border border-gray-100 shadow-sm" />
              )}
              <div className="flex-1 flex flex-col gap-2">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl font-bold text-gray-800">{post.title}</span>
                  <span className="ml-2 text-xs text-gray-400">{new Date(post.created_at).toLocaleDateString()}</span>
                </div>
                <div className="text-gray-700 font-medium">구성: <span className="font-normal">{post.ingredients}</span></div>
                <div className="flex items-center gap-2">
                  <span className="text-yellow-500 font-bold">★ {post.taste_rating ?? "-"}</span>
                  <span className="text-xs text-gray-400">/ 5</span>
                </div>
                <div className="text-blue-700 text-sm italic">AI 한줄평: {post.ai_comment || "-"}</div>
                <div className="flex flex-wrap gap-2 items-center mt-2">
                  <button onClick={() => handleLike(post.id)} className="px-3 py-1 rounded-full bg-blue-50 hover:bg-blue-200 text-blue-700 font-semibold shadow-sm">👍 {post.likes ?? 0}</button>
                  <button onClick={() => handleDislike(post.id)} className="px-3 py-1 rounded-full bg-red-50 hover:bg-red-200 text-red-600 font-semibold shadow-sm">👎 {post.dislikes ?? 0}</button>
                  <button onClick={() => router.push(`/edit/${post.id}`)} className="px-3 py-1 rounded-full bg-yellow-50 hover:bg-yellow-200 text-yellow-700 font-semibold shadow-sm">수정</button>
                  {typeof window !== "undefined" && post.user_id === window.localStorage.getItem("user_id") && (
                    <button onClick={() => handleDelete(post.id)} className="px-3 py-1 rounded-full bg-red-100 hover:bg-red-300 text-red-700 font-semibold shadow-sm">삭제</button>
                  )}
                  <span className="ml-auto text-xs text-gray-400">작성자: {post.user?.nickname || "-"}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
