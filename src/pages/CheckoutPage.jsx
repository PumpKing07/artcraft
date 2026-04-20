import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronRight, CheckCircle2, CreditCard, Truck, Store, Tag, Lock, ArrowLeft, ChevronDown } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback.jsx";
import { useCart } from "../context/cart-context.jsx";
import { createOrder } from "../api/api.js";

export function CheckoutPage() {
  const navigate = useNavigate();
  const { cartItems, cartItemCount, setCartItems } = useCart();
  const [step, setStep] = useState("form");
  const [delivery, setDelivery] = useState("courier");
  const [payment, setPayment] = useState("card");
  const [promo, setPromo] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    address: "",
    comment: "",
  });
  const [errors, setErrors] = useState({});
  const [orderOpen, setOrderOpen] = useState(true);
  const [completedOrder, setCompletedOrder] = useState(null);
  const [orderError, setOrderError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = delivery === "pickup" ? 0 : subtotal > 5000 ? 0 : 350;
  const discount = promoApplied ? Math.round(subtotal * 0.1) : 0;
  const total = subtotal + shipping - discount;

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Введите имя";
    if (!form.email.trim() || !/^[^@]+@[^@]+\.[^@]+$/.test(form.email)) e.email = "Введите корректный email";
    if (!form.phone.trim() || form.phone.replace(/\D/g, "").length < 10) e.phone = "Введите корректный телефон";
    if (delivery === "courier") {
      if (!form.city.trim()) e.city = "Введите город";
      if (!form.address.trim()) e.address = "Введите адрес";
    }
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }
    setErrors({});

    setOrderError("");
    setSubmitting(true);
    try {
      const payload = {
        customer_name: form.name,
        customer_email: form.email,
        customer_phone: form.phone,
        payment_method: payment,
        delivery_method: delivery,
        subtotal_amount: subtotal,
        shipping_amount: shipping,
        discount_amount: discount,
        total_amount: total,
        items: cartItems.map((item) => ({
          item_type: "product",
          product_id: item.id,
          course_id: null,
          title_snapshot: item.name,
          unit_price: item.price,
          quantity: item.quantity,
          line_total: item.price * item.quantity,
        })),
      };

      const data = await createOrder(payload);
      const order = data?.order;
      if (!order) throw new Error("Ответ сервера не содержит заказ");

      setCompletedOrder({
        orderNumber: order.order_number,
        email: form.email,
        delivery,
        payment,
        total: Number(order.total_amount),
      });
      setStep("success");
      setCartItems([]);
    } catch (err) {
      setOrderError(err.message || "Ошибка при оформлении заказа");
    } finally {
      setSubmitting(false);
    }
  };

  const applyPromo = () => {
    if (promo.trim().toUpperCase() === "ARTCRAFT10") {
      setPromoApplied(true);
      setPromoError("");
      return;
    }
    setPromoError("Промокод не найден");
    setPromoApplied(false);
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  if (cartItems.length === 0 && step === "form") {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
            <Store className="w-12 h-12 text-muted-foreground" />
          </div>
          <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: "var(--font-heading)" }}>Корзина пуста</h2>
          <p className="text-muted-foreground mb-8">Добавьте товары, чтобы оформить заказ</p>
          <Link to="/shop" className="px-8 py-4 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all hover:scale-105 inline-block">Перейти в магазин</Link>
        </div>
      </div>
    );
  }

  if (step === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 py-16">
        <div className="text-center max-w-lg">
          <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8" style={{ background: "linear-gradient(135deg, #E07A5F22, #3D898B22)" }}>
            <CheckCircle2 className="w-14 h-14 text-secondary" />
          </div>
          <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: "var(--font-heading)" }}>Заказ оформлен!</h1>
          <p className="text-muted-foreground text-lg mb-2">Ваш заказ <span className="font-semibold text-foreground">{completedOrder?.orderNumber}</span> успешно принят.</p>
          <p className="text-muted-foreground mb-8">Подтверждение отправлено на <span className="font-medium text-foreground">{completedOrder?.email || "ваш email"}</span>. Мы свяжемся с вами в ближайшее время.</p>
          <div className="bg-card rounded-3xl p-6 shadow-sm mb-8 text-left space-y-3">
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Способ доставки</span><span className="font-medium">{completedOrder?.delivery === "courier" ? "Курьером" : "Самовывоз"}</span></div>
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Оплата</span><span className="font-medium">{completedOrder?.payment === "card" ? "Банковская карта" : "Наличными"}</span></div>
            <div className="flex justify-between text-sm border-t border-border pt-3"><span className="font-semibold">Итого оплачено</span><span className="font-bold text-primary text-lg">{(completedOrder?.total ?? 0).toLocaleString("ru-RU")} ₽</span></div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/" className="px-8 py-4 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all hover:scale-105 inline-block">На главную</Link>
            <Link to="/shop" className="px-8 py-4 border-2 border-border rounded-full hover:border-primary hover:text-primary transition-all inline-block">В магазин</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="bg-muted/30 px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center gap-2 text-sm">
          <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">Главная</Link>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <Link to="/cart" className="text-muted-foreground hover:text-primary transition-colors">Корзина</Link>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">Оформление заказа</span>
        </div>
      </div>

      <div className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-10">
            <button onClick={() => navigate("/cart")} className="p-2 rounded-full hover:bg-muted transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-4xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>Оформление заказа</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-card rounded-3xl p-6 shadow-sm">
                <h2 className="text-xl font-bold mb-5" style={{ fontFamily: "var(--font-heading)" }}>Контактные данные</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Имя и фамилия *" error={errors.name}><input value={form.name} onChange={(e) => handleChange("name", e.target.value)} placeholder="Анна Иванова" className={inputCls(Boolean(errors.name))} /></Field>
                  <Field label="Email *" error={errors.email}><input type="email" value={form.email} onChange={(e) => handleChange("email", e.target.value)} placeholder="anna@example.com" className={inputCls(Boolean(errors.email))} /></Field>
                  <Field label="Телефон *" error={errors.phone} className="sm:col-span-2"><input type="tel" value={form.phone} onChange={(e) => handleChange("phone", e.target.value)} placeholder="+7 (900) 000-00-00" className={inputCls(Boolean(errors.phone))} /></Field>
                </div>
              </div>

              <div className="bg-card rounded-3xl p-6 shadow-sm">
                <h2 className="text-xl font-bold mb-5" style={{ fontFamily: "var(--font-heading)" }}>Способ доставки</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                  <DeliveryOption active={delivery === "courier"} onClick={() => setDelivery("courier")} icon={<Truck className="w-5 h-5" />} title="Курьером" desc="1-3 рабочих дня" badge={subtotal > 5000 ? "Бесплатно" : "350 ₽"} free={subtotal > 5000} />
                  <DeliveryOption active={delivery === "pickup"} onClick={() => setDelivery("pickup")} icon={<Store className="w-5 h-5" />} title="Самовывоз" desc="ул. Творческая, д. 1" badge="Бесплатно" free />
                </div>
                {delivery === "courier" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Город *" error={errors.city}><input value={form.city} onChange={(e) => handleChange("city", e.target.value)} placeholder="Москва" className={inputCls(Boolean(errors.city))} /></Field>
                    <Field label="Адрес *" error={errors.address}><input value={form.address} onChange={(e) => handleChange("address", e.target.value)} placeholder="ул. Пушкина, д. 10, кв. 5" className={inputCls(Boolean(errors.address))} /></Field>
                  </div>
                )}
                {delivery === "pickup" && (
                  <div className="bg-secondary/10 rounded-2xl p-4 text-sm text-muted-foreground flex gap-3">
                    <Store className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-medium text-foreground mb-1">Студия ArtCraft</div>
                      <div>г. Москва, ул. Творческая, д. 1 · Пн-Пт 10:00-20:00, Сб-Вс 11:00-18:00</div>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-card rounded-3xl p-6 shadow-sm">
                <h2 className="text-xl font-bold mb-5" style={{ fontFamily: "var(--font-heading)" }}>Способ оплаты</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                  <PaymentOption active={payment === "card"} onClick={() => setPayment("card")} icon={<CreditCard className="w-5 h-5" />} title="Банковская карта" desc="Visa, Mastercard, МИР" />
                  <PaymentOption active={payment === "cash"} onClick={() => setPayment("cash")} icon={<Store className="w-5 h-5" />} title="Наличными" desc="При получении" />
                </div>
                {payment === "card" && (
                  <div className="space-y-4">
                    <Field label="Номер карты">
                      <input placeholder="0000 0000 0000 0000" className={inputCls(false)} maxLength={19} onChange={(e) => { const v = e.target.value.replace(/\D/g, "").slice(0, 16); e.target.value = v.replace(/(.{4})/g, "$1 ").trim(); }} />
                    </Field>
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="Срок действия"><input placeholder="MM / ГГ" className={inputCls(false)} maxLength={7} /></Field>
                      <Field label="CVV"><input placeholder="•••" className={inputCls(false)} type="password" maxLength={3} /></Field>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground"><Lock className="w-4 h-4" />Данные защищены SSL-шифрованием</div>
                  </div>
                )}
              </div>

              <div className="bg-card rounded-3xl p-6 shadow-sm">
                <h2 className="text-xl font-bold mb-5" style={{ fontFamily: "var(--font-heading)" }}>Комментарий к заказу</h2>
                <textarea value={form.comment} onChange={(e) => handleChange("comment", e.target.value)} placeholder="Пожелания к заказу или доставке..." rows={3} className="w-full px-4 py-3 rounded-2xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none text-sm" />
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-3xl p-6 sticky top-24 space-y-5">
                <button onClick={() => setOrderOpen((o) => !o)} className="w-full flex items-center justify-between">
                  <h2 className="text-xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>Ваш заказ</h2>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">{cartItemCount} шт.<ChevronDown className={`w-4 h-4 transition-transform ${orderOpen ? "rotate-180" : ""}`} /></div>
                </button>
                {orderOpen && (
                  <div className="space-y-3">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex gap-3 items-start">
                        <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0"><ImageWithFallback src={item.image} alt={item.name} className="w-full h-full object-cover" /></div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium line-clamp-2 mb-0.5">{item.name}</div>
                          <div className="text-xs text-muted-foreground">{item.quantity} шт.</div>
                        </div>
                        <div className="text-sm font-semibold text-primary whitespace-nowrap">{(item.price * item.quantity).toLocaleString("ru-RU")} ₽</div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="border-t border-border/60" />
                <div>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input value={promo} onChange={(e) => { setPromo(e.target.value); setPromoError(""); }} placeholder="Промокод" disabled={promoApplied} className="w-full pl-9 pr-3 py-3 rounded-2xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-sm disabled:opacity-60" />
                    </div>
                    <button onClick={applyPromo} disabled={promoApplied || !promo.trim()} className="px-4 py-3 bg-secondary text-secondary-foreground rounded-2xl text-sm hover:bg-secondary/90 transition-all disabled:opacity-50">{promoApplied ? "✓" : "Применить"}</button>
                  </div>
                  {promoError && <p className="text-xs text-destructive mt-1.5 ml-1">{promoError}</p>}
                  {promoApplied && <p className="text-xs text-secondary mt-1.5 ml-1">Скидка 10% применена! (попробуйте ARTCRAFT10)</p>}
                  {!promoApplied && !promoError && <p className="text-xs text-muted-foreground mt-1.5 ml-1">Попробуйте: ARTCRAFT10</p>}
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Товары ({cartItemCount} шт.)</span><span className="font-medium">{subtotal.toLocaleString("ru-RU")} ₽</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Доставка</span><span className={`font-medium ${shipping === 0 ? "text-secondary" : ""}`}>{shipping === 0 ? "Бесплатно" : `${shipping} ₽`}</span></div>
                  {promoApplied && <div className="flex justify-between text-secondary"><span>Скидка (10%)</span><span className="font-medium">-{discount.toLocaleString("ru-RU")} ₽</span></div>}
                  <div className="border-t border-border pt-3 flex justify-between items-baseline"><span className="font-semibold">Итого</span><span className="text-3xl font-bold text-primary">{total.toLocaleString("ru-RU")} ₽</span></div>
                </div>
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="w-full bg-primary text-primary-foreground py-4 rounded-full hover:bg-primary/90 transition-all hover:scale-105 flex items-center justify-center gap-2 shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <Lock className="w-4 h-4" />
                  {submitting ? "Оформляем..." : "Подтвердить заказ"}
                </button>
                {orderError && <p className="text-xs text-destructive mt-3">{orderError}</p>}
                <p className="text-center text-xs text-muted-foreground">Нажимая кнопку, вы соглашаетесь с <span className="text-primary cursor-pointer hover:underline">условиями оферты</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const inputCls = (hasError) =>
  `w-full px-4 py-3 rounded-2xl border bg-background focus:outline-none focus:ring-2 transition-all text-sm ${
    hasError ? "border-destructive focus:ring-destructive/30" : "border-border focus:ring-primary/30 focus:border-primary"
  }`;

function Field({ label, error, children, className = "" }) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium mb-1.5">{label}</label>
      {children}
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
}

function DeliveryOption({ active, onClick, icon, title, desc, badge, free = false }) {
  return (
    <button onClick={onClick} className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${active ? "border-primary bg-primary/5" : "border-border hover:border-primary/40 bg-card"}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className={active ? "text-primary" : "text-muted-foreground"}>{icon}</span>
          <div>
            <div className="text-sm font-semibold">{title}</div>
            <div className="text-xs text-muted-foreground">{desc}</div>
          </div>
        </div>
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${free ? "bg-secondary/15 text-secondary" : "bg-muted text-muted-foreground"}`}>{badge}</span>
      </div>
    </button>
  );
}

function PaymentOption({ active, onClick, icon, title, desc }) {
  return (
    <button onClick={onClick} className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${active ? "border-primary bg-primary/5" : "border-border hover:border-primary/40 bg-card"}`}>
      <div className="flex items-center gap-2">
        <span className={active ? "text-primary" : "text-muted-foreground"}>{icon}</span>
        <div>
          <div className="text-sm font-semibold">{title}</div>
          <div className="text-xs text-muted-foreground">{desc}</div>
        </div>
      </div>
    </button>
  );
}

