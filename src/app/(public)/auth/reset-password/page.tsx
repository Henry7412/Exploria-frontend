import { Suspense } from "react";
import ResetPasswordClient from "./ResetPasswordClient";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<p className="text-center mt-20">Cargando...</p>}>
      <ResetPasswordClient />
    </Suspense>
  );
}
