import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ChevronRight, Star, ShoppingCart, Check, Truck, Shield, RotateCcw, Minus, Plus, ArrowLeft } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback.jsx";
import { ProductCard } from "../components/ProductCard.jsx";
import { useCart } from "../context/cart-context.jsx";
import { getProducts } from "../api/api.js";

export function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
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

  const product = useMemo(() => products.find((p) => p.id === id), [products, id]);
  const productCategory = product?.category || "Материалы";
  const relatedProducts = useMemo(
    () =>
      product
        ? products
            .filter((p) => (p.category || "Материалы") === productCategory && p.id !== product.id)
            .slice(0, 3)
        : [],
    [products, productCategory, product]
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Загрузка...</div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-destructive text-center max-w-md">{loadError}</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="mb-4 text-2xl font-bold">Товар не найден</h2>
          <Link to="/shop">
            <button className="px-6 py-3 bg-primary text-primary-foreground rounded-full">
              Вернуться в магазин
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem({ id: product.id, name: product.name, image: product.image, price: product.price, category: productCategory }, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };
  const features = [
    "Высокое качество материалов",
    "Подходит для профессионалов и начинающих",
    "Длительный срок службы",
    "Экологически безопасные материалы",
  ];
  const specifications = [
    { label: "Категория", value: productCategory },
    { label: "Бренд", value: product.brand },
    { label: "Рейтинг", value: `${product.rating} из 5` },
    { label: "Наличие", value: product.inStock ? "В наличии" : "Нет в наличии" },
  ];

  return (
    <div className="min-h-screen">
      <button
        onClick={() => navigate("/shop")}
        className="ml-6 mt-6 mb-2 inline-flex items-center gap-2 px-4 py-2.5 bg-card border border-border rounded-full hover:bg-muted transition-all hover:scale-105 shadow-sm text-sm font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="hidden sm:inline">Назад</span>
      </button>
      <div className="bg-muted/30 px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center gap-2 text-sm">
          <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">Главная</Link>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <Link to="/shop" className="text-muted-foreground hover:text-primary transition-colors">Магазин</Link>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <span className="text-foreground font-medium truncate">{product.name}</span>
        </div>
      </div>

      <div className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
            <div className="relative">
              <div className="sticky top-24">
                <div className="rounded-3xl overflow-hidden shadow-xl">
                  <ImageWithFallback src={product.image} alt={product.name} className="w-full aspect-square object-cover" />
                </div>
                {product.oldPrice && (
                  <div className="absolute top-6 left-6 bg-destructive text-destructive-foreground px-4 py-2 rounded-full font-semibold">
                    -{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
                  </div>
                )}
              </div>
            </div>

            <div>
              <div className="text-sm text-primary mb-2">{product.brand}</div>
              <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: "var(--font-heading)" }}>{product.name}</h1>
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-5 h-5 ${i < Math.floor(product.rating) ? "fill-amber-400 text-amber-400" : "text-muted"}`} />
                    ))}
                  </div>
                  <span className="font-semibold">{product.rating}</span>
                </div>
                <span className="text-muted-foreground">{product.reviewCount} отзывов</span>
              </div>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">{product.description}</p>

              <div className="bg-muted/50 rounded-2xl p-6 mb-8">
                <div className="flex items-baseline gap-4 mb-2">
                  <div className="text-4xl font-bold text-primary">{product.price.toLocaleString("ru-RU")} ₽</div>
                  {product.oldPrice && <div className="text-xl text-muted-foreground line-through">{product.oldPrice.toLocaleString("ru-RU")} ₽</div>}
                </div>
                {product.oldPrice && <div className="text-sm text-secondary font-medium">Экономия {(product.oldPrice - product.price).toLocaleString("ru-RU")} ₽</div>}
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-3">Количество</label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3 bg-muted rounded-full p-1">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 rounded-full hover:bg-background transition-colors flex items-center justify-center"><Minus className="w-4 h-4" /></button>
                    <span className="w-12 text-center font-semibold">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 rounded-full hover:bg-background transition-colors flex items-center justify-center"><Plus className="w-4 h-4" /></button>
                  </div>
                  <div className="text-sm text-muted-foreground">Итого: {(product.price * quantity).toLocaleString("ru-RU")} ₽</div>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="w-full bg-primary text-primary-foreground py-4 rounded-full hover:bg-primary/90 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 shadow-lg"
                >
                  {addedToCart ? (
                    <>
                      <Check className="w-5 h-5" />
                      Добавлено в корзину
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5" />
                      {product.inStock ? "Добавить в корзину" : "Нет в наличии"}
                    </>
                  )}
                </button>
                <Link to="/cart">
                  <button className="w-full border-2 border-primary text-primary py-4 rounded-full hover:bg-primary/5 transition-all">Перейти в корзину</button>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl">
                  <Truck className="w-6 h-6 text-primary flex-shrink-0" />
                  <div className="text-sm"><div className="font-medium">Быстрая доставка</div><div className="text-muted-foreground">2-3 дня</div></div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl">
                  <Shield className="w-6 h-6 text-primary flex-shrink-0" />
                  <div className="text-sm"><div className="font-medium">Гарантия</div><div className="text-muted-foreground">Качества</div></div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl">
                  <RotateCcw className="w-6 h-6 text-primary flex-shrink-0" />
                  <div className="text-sm"><div className="font-medium">Возврат</div><div className="text-muted-foreground">14 дней</div></div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
            <div className="bg-card rounded-3xl p-8">
              <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: "var(--font-heading)" }}>Описание</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>{product.name} - это профессиональный инструмент для творчества, который подойдёт как начинающим художникам, так и опытным мастерам.</p>
                <p>Изделие выполнено из высококачественных материалов, что обеспечивает долговечность и комфорт в использовании. Продукт прошёл строгий контроль качества и соответствует всем стандартам.</p>
                <h3 className="font-semibold text-foreground pt-4">Особенности:</h3>
                <ul className="space-y-2">
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-card rounded-3xl p-8">
              <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: "var(--font-heading)" }}>Характеристики</h2>
              <div className="space-y-4">
                {specifications.map((spec, index) => (
                  <div key={index} className="flex justify-between items-center py-3 border-b border-border last:border-0">
                    <span className="text-muted-foreground">{spec.label}</span>
                    <span className="font-medium">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {relatedProducts.length > 0 && (
            <section>
              <h2 className="text-3xl font-bold mb-8" style={{ fontFamily: "var(--font-heading)" }}>Похожие товары</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedProducts.map((item) => (
                  <Link key={item.id} to={`/shop/${item.id}`}>
                    <ProductCard {...item} />
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

