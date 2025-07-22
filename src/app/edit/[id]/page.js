"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

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

export default function EditPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [tasteRating, setTasteRating] = useState("");
  const [aiComment, setAiComment] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [initialIngredients, setInitialIngredients] = useState("");

  useEffect(() => {
    async function fetchPost() {
      setLoading(true);
      const { data, error } = await supabase.from("posts").select("*").eq("id", id).single();
      if (error || !data) {
        setError("게시글을 불러올 수 없습니다.");
        setLoading(false);
        return;
      }
      setTitle(data.title || "");
      setIngredients(data.ingredients || "");
      setInitialIngredients(data.ingredients || "");
      setImageUrl(data.image_url || "");
      setTasteRating(data.taste_rating ? String(data.taste_rating) : "");
      setAiComment(data.ai_comment || "");
      setLoading(false);
    }
    if (id) fetchPost();
  }, [id]);

  // ingredients가 바뀌면 AI 한줄평 자동 갱신
  useEffect(() => {
    if (ingredients && ingredients !== initialIngredients) {
      setAiLoading(true);
      getAiComment(ingredients).then(comment => {
        setAiComment(comment);
        setAiLoading(false);
      }).catch(() => {
        setAiComment("AI 평가 실패");
        setAiLoading(false);
      });
    }
  }, [ingredients, initialIngredients]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error } = await supabase.from("posts").update({
      title,
      ingredients,
      image_url: imageUrl,
      taste_rating: tasteRating ? Number(tasteRating) : null,
      ai_comment: aiComment
    }).eq("id", id);
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.push("/");
  };

  if (loading) {
    return <div className="max-w-lg mx-auto mt-10 text-center">불러오는 중...</div>;
  }
  if (error) {
    return <div className="max-w-lg mx-auto mt-10 text-center text-red-600">{error}</div>;
  }

  return (
    <div className="max-w-lg mx-auto mt-10 p-8 border rounded-2xl shadow-lg bg-white/90">
      <h2 className="text-3xl font-extrabold mb-6 text-blue-700">게시글 수정</h2>
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
        <div className="text-sm text-blue-700 min-h-[1.5em] font-semibold">
          {aiLoading ? "AI 한줄평 생성 중..." : `AI 한줄평: ${aiComment}`}
        </div>
        {error && <div className="text-red-600 text-sm font-semibold">{error}</div>}
        <button
          type="submit"
          disabled={loading}
          className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-2 rounded-full font-bold hover:from-blue-600 hover:to-indigo-600 transition shadow"
        >
          {loading ? "저장 중..." : "저장하기"}
        </button>
      </form>
    </div>
  );
} 