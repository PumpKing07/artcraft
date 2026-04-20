import { useState } from "react";
import { Star, ShoppingCart, Check } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback.jsx";
import { useCart } from "../context/cart-context.jsx";

export function ProductCard({
  id,
  name,
  description,
  image,
  price,
  oldPrice,
  rating,
  reviewCount,
  inStock,
  brand,
  category,
}) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const discount = oldPrice ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!inStock || added) return;
    addItem({ id, name, image, price, category });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="group bg-card rounded-[20px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="relative aspect-square overflow-hidden">
        <ImageWithFallback
          src={image}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {discount > 0 && (
          <div className="absolute left-3 top-3 rounded-full bg-destructive px-3 py-1 text-sm font-semibold text-destructive-foreground">
            -{discount}%
          </div>
        )}
        {!inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
            <span className="rounded-full bg-white px-4 py-2 font-semibold text-foreground">Нет в наличии</span>
          </div>
        )}
      </div>
      <div className="p-5">
        <div className="text-xs text-muted-foreground mb-2">{brand}</div>
        <h3 className="text-lg font-medium mb-2 line-clamp-2 min-h-[56px] group-hover:text-primary transition-colors">
          {name}
        </h3>
        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{description}</p>
        <p className="text-xs text-muted-foreground mb-3">
          Характеристика: {category || "Материалы"} · {inStock ? "в наличии" : "нет в наличии"}
        </p>
        <div className="mb-4 flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span className="text-sm font-medium">{rating}</span>
          </div>
          <span className="text-xs text-muted-foreground">({reviewCount} отзывов)</span>
        </div>
        <div className="flex items-end justify-between mb-4">
          <div>
            <div className="text-2xl font-semibold text-primary">{price.toLocaleString("ru-RU")} ₽</div>
            {oldPrice && <div className="text-sm text-muted-foreground line-through">{oldPrice.toLocaleString("ru-RU")} ₽</div>}
          </div>
        </div>
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!inStock}
          className={`w-full py-3 rounded-full transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 ${
            added
              ? "bg-secondary text-secondary-foreground"
              : "bg-primary hover:bg-primary/90 text-primary-foreground"
          }`}
        >
          {added ? (
            <>
              <Check className="w-4 h-4" />
              Добавлено!
            </>
          ) : (
            <>
              <ShoppingCart className="w-4 h-4" />
              {inStock ? "В корзину" : "Недоступно"}
            </>
          )}
        </button>
      </div>
    </div>
  );
}

