import { Suspense } from "react";
import { AdminProductsClient } from "./AdminProductsClient";

export const dynamic = "force-dynamic";

export default function AdminProductsPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Админка — Товары</h1>
        <p className="text-sm text-muted-foreground mt-1">Управляйте каталогом: добавляйте, редактируйте и удаляйте товары.</p>
      </div>
      <Suspense fallback={<div className="text-sm text-muted-foreground">Загрузка админки…</div>}>
        <AdminProductsClient />
      </Suspense>
    </div>
  );
}
