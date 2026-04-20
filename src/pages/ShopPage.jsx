import { useEffect, useMemo, useState } from "react";
import { ChevronRight, Search, Tag, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { productCategories } from "../data/products.js";
import { ProductCard } from "../components/ProductCard.jsx";
import { getProducts } from "../api/api.js";

export function ShopPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setLoadError("");

    getProducts()
      .then((data) => {
        if (cancelled) return;
        setProducts(data);
      })
      .catch((err) => {
        if (cancelled) return;
        setLoadError(err.message || "Не удалось загрузить товары");
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Все товары");
  const [sortBy, setSortBy] = useState("popularity");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 9;

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "Все товары" || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "popular") return b.reviewCount - a.reviewCount;
      return b.rating - a.rating;
    });
  }, [filteredProducts, sortBy]);

  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);
  const paginatedProducts = sortedProducts.slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage);
  const bestDeals = useMemo(() => products.filter((p) => p.oldPrice).slice(0, 3), [products]);

  return (
    <div className="min-h-screen">
      <div className="bg-muted/30 py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-sm">
          <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">Главная</Link>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
          <span className="text-foreground font-medium">Магазин товаров</span>
        </div>
      </div>

      <div className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h1 className="text-5xl font-bold mb-4" style={{ fontFamily: "var(--font-heading)" }}>Товары для творчества</h1>
            <p className="text-lg text-muted-foreground mb-6">Качественные материалы для ваших творческих проектов</p>
            <div className="relative max-w-xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input type="text" placeholder="Поиск товаров..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-card border border-border rounded-full text-base shadow-sm" />
            </div>
          </div>

          {bestDeals.length > 0 && !searchQuery && selectedCategory === "Все товары" && (
            <section className="mb-12 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-3xl p-8">
              <div className="flex items-center gap-2 mb-6">
                <Tag className="w-6 h-6 text-primary" />
                <h2 className="text-3xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>Выгодные предложения</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {bestDeals.map((product) => (
                  <Link key={product.id} to={`/shop/${product.id}`}>
                    <ProductCard {...product} />
                  </Link>
                ))}
              </div>
            </section>
          )}

          <div className="mb-8">
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {productCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    setSelectedCategory(category);
                    setCurrentPage(1);
                  }}
                  className={`px-6 py-3 rounded-full whitespace-nowrap transition-all ${
                    selectedCategory === category ? "bg-primary text-primary-foreground shadow-lg scale-105" : "bg-card border border-border hover:border-primary hover:scale-105"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center mb-6">
            <div className="text-sm text-muted-foreground">Найдено товаров: {sortedProducts.length}</div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">Сортировать:</span>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-4 py-2 bg-card border border-border rounded-xl text-sm">
                <option value="popularity">По популярности</option>
                <option value="price-asc">Сначала дешевые</option>
                <option value="price-desc">Сначала дорогие</option>
                <option value="rating">По рейтингу</option>
                <option value="popular">По отзывам</option>
              </select>
            </div>
          </div>

              {loading ? (
                <div className="text-center py-20 text-muted-foreground">Загрузка...</div>
              ) : loadError ? (
                <div className="text-center py-20 text-destructive">{loadError}</div>
              ) : paginatedProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {paginatedProducts.map((product) => (
                  <Link key={product.id} to={`/shop/${product.id}`}>
                    <ProductCard {...product} />
                  </Link>
                ))}
              </div>
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2">
                  <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-4 py-2 rounded-xl border border-border disabled:opacity-50">Назад</button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button key={page} onClick={() => setCurrentPage(page)} className={`w-10 h-10 rounded-xl ${currentPage === page ? "bg-primary text-primary-foreground" : "border border-border"}`}>{page}</button>
                  ))}
                  <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-4 py-2 rounded-xl border border-border disabled:opacity-50">Вперёд</button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <h3 className="text-xl font-semibold mb-2">Товары не найдены</h3>
              <p className="text-muted-foreground mb-6">Попробуйте изменить поисковый запрос или выбрать другую категорию</p>
            </div>
          )}

          <section className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Только качественные товары</h3>
              <p className="text-sm text-muted-foreground">Проверенные бренды и материалы от надёжных производителей</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Tag className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="font-semibold mb-2">Выгодные цены</h3>
              <p className="text-sm text-muted-foreground">Регулярные акции и специальные предложения для студентов курсов</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Быстрая доставка</h3>
              <p className="text-sm text-muted-foreground">Доставим заказ в течение 2-3 дней по всей России</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

