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
import { Pencil, Plus, Trash } from "lucide-react";

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

  // Protect page: require login
  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/login?redirect=" + encodeURIComponent("/admin/products"));
    }
  }, [session, isPending, router]);

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
    if (session?.user) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user]);

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

  if (!session?.user) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Spinner className="h-4 w-4" /> Ожидание авторизации…
      </div>
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
            <DialogContent className="max-w-2xl">
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
                <div className="grid gap-2">
                  <Label>Изображения (каждое с новой строки или через запятую)</Label>
                  <Textarea
                    value={(form.images || []).join("\n")}
                    onChange={(e) => setForm((f) => ({ ...f, images: parseImages(e.target.value) }))}
                    placeholder={"https://.../image1.jpg\nhttps://.../image2.jpg"}
                    rows={4}
                  />
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
