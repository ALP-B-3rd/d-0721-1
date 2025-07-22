"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

async function getUserIP() {
  try {
    const res = await fetch("https://api.ipify.org?format=json");
    const data = await res.json();
    return data.ip;
  } catch {
    return "unknown";
  }
}

export default function LoginPage() {
  const [mode, setMode] = useState("login"); // 'login' or 'signup'
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const ip = await getUserIP();
    const url = mode === "login" ? "/api/login" : "/api/signup";
    const body = mode === "login"
      ? { nickname, pw: password, ip }
      : { nickname, pw: password, profile_image: profileImage, ip };
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "오류가 발생했습니다.");
      return;
    }
    if (mode === "login") {
      setUser(data.user);
    } else {
      // 회원가입 성공 시 바로 로그인
      setMode("login");
      setError("회원가입이 완료되었습니다! 로그인 해주세요.");
    }
  };

  if (user) {
    return (
      <div className="max-w-md mx-auto mt-20 p-8 border rounded-2xl shadow-lg bg-white/90 text-center">
        <h2 className="text-3xl font-extrabold mb-4 text-blue-700">로그인 완료</h2>
        <img src={user.profile_image} alt="프로필" className="w-24 h-24 rounded-full mx-auto mb-2 border-4 border-blue-200 shadow" />
        <div className="mb-2 text-lg">닉네임: <b>{user.nickname}</b></div>
        <div className="text-green-600 font-semibold mb-4">환영합니다!</div>
        <button
          className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-2 px-6 rounded-full font-bold shadow hover:from-blue-600 hover:to-indigo-600 transition"
          onClick={() => router.push("/")}
        >
          게시글로 가기
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-8 border rounded-2xl shadow-lg bg-white/90">
      <h2 className="text-3xl font-extrabold mb-4 text-blue-700">{mode === "login" ? "로그인" : "회원가입"}</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <label className="flex flex-col gap-1 font-semibold">
          닉네임
          <input
            type="text"
            placeholder="닉네임"
            value={nickname}
            onChange={e => setNickname(e.target.value)}
            required
            className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </label>
        <label className="flex flex-col gap-1 font-semibold">
          비밀번호 (8자 이상)
          <input
            type="password"
            placeholder="비밀번호 (8자 이상)"
            value={password}
            onChange={e => setPassword(e.target.value)}
            minLength={8}
            required
            className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </label>
        {mode === "signup" && (
          <label className="flex flex-col gap-1 font-semibold">
            프로필 이미지 URL
            <input
              type="url"
              placeholder="프로필 이미지 URL"
              value={profileImage}
              onChange={e => setProfileImage(e.target.value)}
              required
              className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </label>
        )}
        {error && <div className="text-red-600 text-sm font-semibold">{error}</div>}
        <button
          type="submit"
          disabled={loading}
          className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-2 rounded-full font-bold hover:from-blue-600 hover:to-indigo-600 transition shadow"
        >
          {loading ? "처리 중..." : mode === "login" ? "로그인" : "회원가입"}
        </button>
      </form>
      <div className="mt-4 text-center">
        {mode === "login" ? (
          <button className="text-blue-600 underline font-semibold" onClick={() => setMode("signup")}>회원가입</button>
        ) : (
          <button className="text-blue-600 underline font-semibold" onClick={() => setMode("login")}>로그인으로 돌아가기</button>
        )}
      </div>
    </div>
  );
} 