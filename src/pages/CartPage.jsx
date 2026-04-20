import { ChevronRight, Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../context/cart-context.jsx";
import { ImageWithFallback } from "../components/figma/ImageWithFallback.jsx";

export function CartPage() {
  const { cartItems, cartItemCount, updateQuantity, removeItem } = useCart();
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 5000 ? 0 : 350;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen">
      <div className="bg-muted/30 py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-sm">
          <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">Главная</Link>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
          <span className="text-foreground font-medium">Корзина</span>
        </div>
      </div>

      <div className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl font-bold mb-12" style={{ fontFamily: "var(--font-heading)" }}>Корзина</h1>

          {cartItems.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="bg-card rounded-3xl p-6 shadow-sm hover:shadow-lg transition-shadow">
                    <div className="flex gap-6">
                      <div className="w-32 h-32 rounded-2xl overflow-hidden flex-shrink-0">
                        <ImageWithFallback src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <div className="text-xs text-muted-foreground mb-1">{item.category}</div>
                            <h3 className="text-lg font-semibold mb-2 line-clamp-2">{item.name}</h3>
                          </div>
                          <button onClick={() => removeItem(item.id)} className="p-2 hover:bg-destructive/10 rounded-full transition-colors group">
                            <Trash2 className="w-5 h-5 text-muted-foreground group-hover:text-destructive transition-colors" />
                          </button>
                        </div>

                        <div className="flex justify-between items-end">
                          <div className="flex items-center gap-3 bg-muted rounded-full p-1">
                            <button onClick={() => updateQuantity(item.id, -1)} className="w-8 h-8 rounded-full hover:bg-background transition-colors flex items-center justify-center">
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center font-medium">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, 1)} className="w-8 h-8 rounded-full hover:bg-background transition-colors flex items-center justify-center">
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-semibold text-primary">{(item.price * item.quantity).toLocaleString("ru-RU")} ₽</div>
                            {item.quantity > 1 && (
                              <div className="text-sm text-muted-foreground">
                                {item.price.toLocaleString("ru-RU")} ₽ × {item.quantity}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <Link to="/shop" className="block">
                  <button className="w-full py-4 border-2 border-dashed border-border rounded-3xl hover:border-primary hover:bg-primary/5 transition-all text-muted-foreground hover:text-primary flex items-center justify-center gap-2">
                    <ShoppingBag className="w-5 h-5" />
                    Продолжить покупки
                  </button>
                </Link>
              </div>

              <div className="lg:col-span-1">
                <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-3xl p-6 sticky top-24">
                  <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: "var(--font-heading)" }}>Итого</h2>
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Товары ({cartItemCount} шт)</span>
                      <span className="font-medium">{subtotal.toLocaleString("ru-RU")} ₽</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Доставка</span>
                      <span className={`font-medium ${shipping === 0 ? "text-secondary" : ""}`}>{shipping === 0 ? "Бесплатно" : `${shipping} ₽`}</span>
                    </div>
                    {subtotal < 5000 && (
                      <div className="text-xs text-muted-foreground bg-secondary/10 rounded-xl p-3">
                        Добавьте товаров на {(5000 - subtotal).toLocaleString("ru-RU")} ₽ для бесплатной доставки
                      </div>
                    )}
                    <div className="border-t border-border pt-4">
                      <div className="flex justify-between items-baseline">
                        <span className="font-semibold">Всего к оплате</span>
                        <span className="text-3xl font-bold text-primary">{total.toLocaleString("ru-RU")} ₽</span>
                      </div>
                    </div>
                  </div>
                  <Link to="/checkout" className="block mb-3">
                    <button className="w-full bg-primary text-primary-foreground py-4 rounded-full hover:bg-primary/90 transition-all hover:scale-105 flex items-center justify-center gap-2 shadow-lg">
                      Оформить заказ
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </Link>
                  <div className="text-center text-xs text-muted-foreground">Безопасная оплата защищена SSL</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="w-12 h-12 text-muted-foreground" />
              </div>
              <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: "var(--font-heading)" }}>Корзина пуста</h2>
              <p className="text-lg text-muted-foreground mb-8">Добавьте товары из магазина, чтобы начать покупки</p>
              <Link to="/shop">
                <button className="px-8 py-4 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all hover:scale-105 inline-flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5" />
                  Перейти в магазин
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

