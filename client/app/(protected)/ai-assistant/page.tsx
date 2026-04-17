"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2, RefreshCw } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { $api } from "@/lib/api/api";

export default function AIChatEntryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasStartedRef = useRef(false);
  const [error, setError] = useState<string | null>(null);

  const { mutateAsync: createConversation, isPending } = $api.useMutation(
    "post",
    "/api/chats/conversations/create/",
  );

  const handleCreateConversation = useCallback(async () => {
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;
    setError(null);

    try {
      const response = await createConversation({
        body: {
          title: "Cuoc tro chuyen moi",
        },
      });

      const query = searchParams.toString();
      const targetPath = query
        ? `/ai-assistant/${response.id}?${query}`
        : `/ai-assistant/${response.id}`;
      router.replace(targetPath);
    } catch {
      setError("Khong the tao cuoc tro chuyen moi. Vui long thu lai.");
      hasStartedRef.current = false;
    }
  }, [createConversation, router, searchParams]);

  useEffect(() => {
    handleCreateConversation();
  }, [handleCreateConversation]);

  return (
    <div className="h-[calc(100vh-56px)] w-full flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-xl border border-border/50 bg-card p-6 text-center shadow-card space-y-4">
        {isPending ? (
          <>
            <div className="mx-auto h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Loader2 className="h-5 w-5 text-primary animate-spin" />
            </div>
            <p className="text-sm text-muted-foreground">
              Dang tao cuoc tro chuyen moi...
            </p>
          </>
        ) : error ? (
          <>
            <p className="text-sm text-destructive">{error}</p>
            <button
              onClick={handleCreateConversation}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm text-primary-foreground hover:opacity-90 transition"
            >
              <RefreshCw className="h-4 w-4" /> Thu lai
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
}
