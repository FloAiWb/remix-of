"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { useSession } from "@/lib/auth-client";
import { Pencil, Plus, Trash, Upload, X } from "lucide-react";

// ADMIN EMAIL - only this email can access admin panel
const ADMIN_EMAIL = "mixmarketplace161@gmail.com";

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  category: string;
  images: string[];
  material: string | null;
  featured: boolean;
  isNew: boolean;
  isBestseller: boolean;
  createdAt?: string;
  updatedAt?: string;
}

const emptyForm: Omit<Product, "id"> = {
  name: "",
  price: 0,
  description: "",
  category: "",
  images: [],
  material: null,
  featured: false,
  isNew: false,
  isBestseller: false,
};

export function AdminProductsClient() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<Omit<Product, "id">>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);

  // Check if user is admin
  const isAdmin = session?.user?.email === ADMIN_EMAIL;

  // Protect page: require login and admin email
  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/login?redirect=" + encodeURIComponent("/admin/products"));
    } else if (!isPending && session?.user && !isAdmin) {
      toast.error("Доступ запрещён. Только администратор может управлять товарами.");
      router.push("/");
    }
  }, [session, isPending, isAdmin, router]);

  const authHeaders = useMemo(() => {
    if (typeof window === "undefined") return {} as HeadersInit;
    const token = localStorage.getItem("bearer_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  }, []);

  const load = async () => {
    try {
      setLoading(true);
      const url = query.trim()
        ? `/api/products?limit=100&search=${encodeURIComponent(query.trim())}`
        : "/api/products?limit=100";
      const res = await fetch(url, { headers: { "Content-Type": "application/json", ...authHeaders } });
      if (!res.ok) throw new Error("Не удалось загрузить товары");
      const data: Product[] = await res.json();
      setItems(data);
    } catch (e: any) {
      toast.error(e.message || "Ошибка загрузки");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user && isAdmin) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user, isAdmin]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({
      name: p.name,
      price: p.price,
      description: p.description,
      category: p.category,
      images: p.images || [],
      material: p.material ?? null,
      featured: !!p.featured,
      isNew: !!p.isNew,
      isBestseller: !!p.isBestseller,
    });
    setOpen(true);
  };

  const parseImages = (text: string) =>
    text
      .split(/\n|,/) // newline or comma separated
      .map((s) => s.trim())
      .filter(Boolean);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setUploading(true);
      const uploadedUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const error = await res.json();
          throw new Error(error?.error || "Ошибка загрузки");
        }

        const data = await res.json();
        uploadedUrls.push(data.url);
      }

      // Add uploaded URLs to form
      setForm((f) => ({
        ...f,
        images: [...f.images, ...uploadedUrls],
      }));

      toast.success(`Загружено изображений: ${uploadedUrls.length}`);
    } catch (e: any) {
      toast.error(e.message || "Ошибка загрузки файлов");
    } finally {
      setUploading(false);
      // Reset input
      e.target.value = "";
    }
  };

  const removeImage = (index: number) => {
    setForm((f) => ({
      ...f,
      images: f.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      const body = {
        ...form,
        price: Math.floor(Number(form.price) || 0),
        images: form.images,
      };

      const isEdit = !!editing;
      const res = await fetch(
        isEdit ? `/api/products?id=${editing!.id}` : "/api/products",
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json", ...authHeaders },
          body: JSON.stringify(body),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || (isEdit ? "Не удалось обновить" : "Не удалось создать"));

      toast.success(isEdit ? "Товар обновлён" : "Товар создан");
      setOpen(false);
      setEditing(null);
      setForm(emptyForm);
      await load();
    } catch (e: any) {
      toast.error(e.message || "Ошибка сохранения");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (deletingId) return;
    try {
      setDeletingId(id);
      const res = await fetch(`/api/products?id=${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json", ...authHeaders },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Не удалось удалить");
      toast.success("Товар удалён");
      await load();
    } catch (e: any) {
      toast.error(e.message || "Ошибка удаления");
    } finally {
      setDeletingId(null);
    }
  };

  // Show loading state while checking auth
  if (isPending) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Spinner className="h-4 w-4" /> Проверка доступа…
      </div>
    );
  }

  // Show access denied if not admin
  if (!isAdmin) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <h2 className="text-xl font-semibold mb-2">Доступ запрещён</h2>
          <p className="text-sm text-muted-foreground">
            Только администратор ({ADMIN_EMAIL}) может управлять товарами.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Input
              placeholder="Поиск по названию/описанию…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full sm:w-80"
              onKeyDown={(e) => {
                if (e.key === "Enter") load();
              }}
            />
            <Button onClick={load} variant="secondary">Поиск</Button>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button onClick={openCreate}>
                <Plus className="h-4 w-4 mr-2" /> Добавить товар
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editing ? "Редактировать товар" : "Новый товар"}</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-2">
                <div className="grid gap-2">
                  <Label>Название</Label>
                  <Input
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="Браслет кожаный…"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Цена (₽)</Label>
                  <Input
                    type="number"
                    min={0}
                    value={form.price}
                    onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) }))}
                    placeholder="1990"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Описание</Label>
                  <Textarea
                    value={form.description}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    placeholder="Краткое описание товара"
                    rows={4}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Категория</Label>
                  <Input
                    value={form.category}
                    onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                    placeholder="Браслеты"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Материал (необязательно)</Label>
                  <Input
                    value={form.material ?? ""}
                    onChange={(e) => setForm((f) => ({ ...f, material: e.target.value || null }))}
                    placeholder="Кожа"
                  />
                </div>
                
                {/* Image Upload Section */}
                <div className="grid gap-3">
                  <Label>Изображения</Label>
                  
                  {/* Upload Button */}
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById("file-upload")?.click()}
                      disabled={uploading}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {uploading ? "Загрузка…" : "Загрузить изображения"}
                    </Button>
                    <input
                      id="file-upload"
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                    <span className="text-xs text-muted-foreground">
                      Макс. 5MB на файл
                    </span>
                  </div>

                  {/* Image Preview Grid */}
                  {form.images.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {form.images.map((url, idx) => (
                        <div key={idx} className="relative group rounded-lg border overflow-hidden aspect-square">
                          <img
                            src={url}
                            alt={`Preview ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-4 w-4" />
                          </button>
                          {idx === 0 && (
                            <Badge className="absolute bottom-1 left-1 text-xs">
                              Основная
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Manual URL Input (optional) */}
                  <details className="text-sm">
                    <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                      Или добавить URL вручную
                    </summary>
                    <Textarea
                      value={(form.images || []).join("\n")}
                      onChange={(e) => setForm((f) => ({ ...f, images: parseImages(e.target.value) }))}
                      placeholder={"https://.../image1.jpg\nhttps://.../image2.jpg"}
                      rows={3}
                      className="mt-2"
                    />
                  </details>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <label className="flex items-center justify-between rounded-md border p-3">
                    <span className="text-sm">Показывать на главной</span>
                    <Switch checked={form.featured} onCheckedChange={(v) => setForm((f) => ({ ...f, featured: v }))} />
                  </label>
                  <label className="flex items-center justify-between rounded-md border p-3">
                    <span className="text-sm">Новинка</span>
                    <Switch checked={form.isNew} onCheckedChange={(v) => setForm((f) => ({ ...f, isNew: v }))} />
                  </label>
                  <label className="flex items-center justify-between rounded-md border p-3">
                    <span className="text-sm">Хит продаж</span>
                    <Switch checked={form.isBestseller} onCheckedChange={(v) => setForm((f) => ({ ...f, isBestseller: v }))} />
                  </label>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>Отмена</Button>
                <Button onClick={handleSubmit} disabled={submitting}>
                  {submitting ? "Сохранение…" : editing ? "Сохранить" : "Создать"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 text-sm text-muted-foreground flex items-center gap-2">
              <Spinner className="h-4 w-4" /> Загрузка товаров…
            </div>
          ) : items.length === 0 ? (
            <div className="p-6 text-sm text-muted-foreground">Товары не найдены</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">ID</TableHead>
                    <TableHead>Название</TableHead>
                    <TableHead>Категория</TableHead>
                    <TableHead className="text-right">Цена</TableHead>
                    <TableHead>Флаги</TableHead>
                    <TableHead className="w-[140px] text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell>{p.id}</TableCell>
                      <TableCell>
                        <div className="font-medium line-clamp-1">{p.name}</div>
                        <div className="text-xs text-muted-foreground line-clamp-1">{p.description}</div>
                      </TableCell>
                      <TableCell>{p.category}</TableCell>
                      <TableCell className="text-right">{p.price.toLocaleString("ru-RU")} ₽</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {p.featured && <Badge variant="secondary">featured</Badge>}
                          {p.isNew && <Badge variant="secondary">new</Badge>}
                          {p.isBestseller && <Badge variant="secondary">bestseller</Badge>}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button size="icon" variant="outline" onClick={() => openEdit(p)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="destructive"
                            onClick={() => handleDelete(p.id)}
                            disabled={deletingId === p.id}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}