"use client";
import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/utils/supabase/client"; // your browser helper

export default function WhoAmIClient() {
  const [uid, setUid] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const s = supabaseBrowser();
    s.auth.getUser().then(({ data }) => {
      setUid(data.user?.id ?? null);
      setEmail(data.user?.email ?? null);
    });
  }, []);

  return (
    <div>
      <p>Client sees UID: {uid ?? "none"}</p>
      <p>Client sees Email: {email ?? "none"}</p>
    </div>
  );
}
