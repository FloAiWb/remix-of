import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { LoginContent } from "@/components/auth/LoginContent";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[80vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}