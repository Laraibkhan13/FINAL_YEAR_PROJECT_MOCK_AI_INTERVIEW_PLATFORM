"use client"
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter()
  useEffect(() => {
    router.push('/dashboard')
  })

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <Loader size={40} className="animate-spin" />
    </div>
  );
}
