import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req) {
  const { post_id, type, ip } = await req.json();
  if (!post_id || !type || !ip) {
    return NextResponse.json({ error: "필수 값 누락" }, { status: 400 });
  }
  // 중복 체크
  const { data: exist } = await supabase
    .from("post_likes")
    .select("id")
    .eq("post_id", post_id)
    .eq("ip", ip)
    .eq("type", type)
    .single();
  if (exist) {
    return NextResponse.json({ error: "이미 누르셨습니다." }, { status: 409 });
  }
  // insert
  await supabase.from("post_likes").insert([{ post_id, ip, type }]);
  // posts 테이블 카운트 증가
  const field = type === "like" ? "likes" : "dislikes";
  const { data: post } = await supabase.from("posts").select(field).eq("id", post_id).single();
  const newCount = (post?.[field] ?? 0) + 1;
  await supabase.from("posts").update({ [field]: newCount }).eq("id", post_id);
  return NextResponse.json({ success: true, newCount });
} 