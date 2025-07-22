"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

async function getAiComment(ingredients) {
  const prompt = `다음 재료로 만든 음료 조합을 평가해줘. 한줄평을 한국어로 알려줘. 재료: ${ingredients}`;
  const res = await fetch("/api/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: prompt })
  });
  const data = await res.json();
  return data.result || "";
}

// 로그인 유저 정보 가져오기(간단 예시, 실제로는 세션/쿠키 등 활용 권장)
function getUserId() {
  if (typeof window !== "undefined") {
    return window.localStorage.getItem("user_id") || null;
  }
  return null;
}

export default function CreatePage() {
  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [tasteRating, setTasteRating] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    let aiComment = "";
    try {
      aiComment = await getAiComment(ingredients);
    } catch {
      aiComment = "AI 평가 실패";
    }
    const user_id = getUserId();
    const { error } = await supabase.from("posts").insert([
      {
        title,
        ingredients,
        image_url: imageUrl,
        taste_rating: tasteRating ? Number(tasteRating) : null,
        ai_comment: aiComment,
        likes: 0,
        dislikes: 0,
        user_id
      }
    ]);
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.push("/");
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-8 border rounded-2xl shadow-lg bg-white/90">
      <h2 className="text-3xl font-extrabold mb-6 text-blue-700">게시글 등록</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <label className="flex flex-col gap-1 font-semibold">
          제목
          <input
            type="text"
            placeholder="제목"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </label>
        <label className="flex flex-col gap-1 font-semibold">
          음료 구성
          <input
            type="text"
            placeholder="음료 구성 (예: 보드카, 오렌지 주스)"
            value={ingredients}
            onChange={e => setIngredients(e.target.value)}
            required
            className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </label>
        <label className="flex flex-col gap-1 font-semibold">
          비주얼(사진) URL
          <input
            type="url"
            placeholder="비주얼(사진) URL"
            value={imageUrl}
            onChange={e => setImageUrl(e.target.value)}
            className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </label>
        <label className="flex flex-col gap-1 font-semibold">
          맛 별점 (1~5)
          <input
            type="number"
            min={1}
            max={5}
            placeholder="맛 별점 (1~5)"
            value={tasteRating}
            onChange={e => setTasteRating(e.target.value)}
            required
            className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </label>
        {error && <div className="text-red-600 text-sm font-semibold">{error}</div>}
        <button
          type="submit"
          disabled={loading}
          className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-2 rounded-full font-bold hover:from-blue-600 hover:to-indigo-600 transition shadow"
        >
          {loading ? "등록 중..." : "등록하기"}
        </button>
      </form>
    </div>
  );
} 