import { courses as localCourses } from "../data/courses.js";
import { products as localProducts } from "../data/products.js";

const API_BASE = import.meta.env.VITE_API_URL || "";

const jsonError = (body) => {
  if (!body) return "Request failed";
  if (typeof body === "string") return body;
  if (body.error) return body.error;
  if (body.message) return body.message;
  return "Request failed";
};

const withBase = (path) => {
  if (!API_BASE) return path;
  return `${API_BASE}${path}`;
};

async function apiFetch(path, options = {}) {
  const timeoutMs = options.timeoutMs ?? 4000;
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeoutMs);

  let res;
  try {
    res = await fetch(withBase(path), {
      ...options,
      signal: controller.signal,
      headers: {
        ...(options.headers || {}),
        ...(options.body ? { "Content-Type": "application/json" } : {}),
      },
    });
  } catch (err) {
    if (err?.name === "AbortError") throw new Error(`Запрос истёк (${timeoutMs}мс)`);
    throw err;
  } finally {
    clearTimeout(t);
  }

  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!res.ok) throw new Error(jsonError(data) || `HTTP ${res.status}`);
  return data;
}

const mapCourse = (c) => ({
  id: c.id,
  title: c.title,
  description: c.description,
  category: c.category,
  level: c.level,
  format: c.format,
  instructor: c.instructor_name,
  duration: c.duration_label,
  price: Number(c.price),
  rating: Number(c.rating),
  lessons: Number(c.lessons_count ?? 0),
  students: Number(c.students_count ?? 0).toLocaleString("ru-RU"),
  reviewCount: Number(c.review_count ?? 0),
  image: c.image_url,
  oldPrice: c.old_price != null ? Number(c.old_price) : null,
});

const mapProduct = (p) => ({
  id: p.id,
  name: p.name,
  description: p.description,
  image: p.image_url,
  price: Number(p.price),
  oldPrice: p.old_price != null ? Number(p.old_price) : null,
  rating: Number(p.rating),
  reviewCount: Number(p.review_count ?? 0),
  inStock: Number(p.stock_qty ?? 0) > 0,
  brand: p.brand,
  category: p.category,
});

const mapLocalCourse = (c) => ({
  id: c.id,
  title: c.title,
  description: c.description,
  category: c.category,
  level: c.level,
  format: c.format,
  instructor: c.instructor,
  duration: c.duration,
  price: Number(c.price),
  rating: Number(c.rating),
  lessons: Number(c.lessons ?? 0),
  students: c.students ?? "0",
  reviewCount: Number(c.reviewCount ?? 0),
  image: c.image,
  oldPrice: c.oldPrice != null ? Number(c.oldPrice) : null,
});

const mapLocalProduct = (p) => ({
  id: p.id,
  name: p.name,
  description: p.description,
  image: p.image,
  price: Number(p.price),
  oldPrice: p.oldPrice != null ? Number(p.oldPrice) : null,
  rating: Number(p.rating),
  reviewCount: Number(p.reviewCount ?? 0),
  inStock: Boolean(p.inStock),
  brand: p.brand,
  category: p.category ?? "Материалы",
});

const CACHE_TTL_MS = 5 * 60 * 1000;
const cache = new Map();
const inflight = new Map();

function getCached(key) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.ts > CACHE_TTL_MS) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

function setCached(key, data) {
  cache.set(key, { data, ts: Date.now() });
}

function cachedRequest(key, loader) {
  const hit = getCached(key);
  if (hit) return Promise.resolve(hit);

  if (inflight.has(key)) return inflight.get(key);

  const promise = loader()
    .then((data) => {
      setCached(key, data);
      return data;
    })
    .finally(() => {
      inflight.delete(key);
    });

  inflight.set(key, promise);
  return promise;
}

export function invalidateCache(key) {
  if (key) cache.delete(key);
  else cache.clear();
}

export async function getCourses() {
  return cachedRequest("courses", async () => {
    try {
      const data = await apiFetch("/api/courses");
      return Array.isArray(data) ? data.map(mapCourse) : [];
    } catch (err) {
      console.warn("API /api/courses недоступен, используем локальные данные.", err);
      return localCourses.map(mapLocalCourse);
    }
  });
}

export async function getProducts() {
  return cachedRequest("products", async () => {
    try {
      const data = await apiFetch("/api/products");
      return Array.isArray(data) ? data.map(mapProduct) : [];
    } catch (err) {
      console.warn("API /api/products недоступен, используем локальные данные.", err);
      return localProducts.map(mapLocalProduct);
    }
  });
}

export async function createOrder(payload) {
  try {
    return await apiFetch("/api/orders", {
      method: "POST",
      body: JSON.stringify(payload),
      timeoutMs: 8000,
    });
  } catch (err) {
    console.warn("API /api/orders недоступен, оформляем локально.", err);
    return {
      ok: true,
      order: {
        id: "local-order",
        order_number: `LOCAL-${Math.floor(10000 + Math.random() * 90000)}`,
        total_amount: payload.total_amount,
      },
    };
  }
}
