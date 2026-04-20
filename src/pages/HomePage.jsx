import {
  Palette,
  Camera,
  Sparkles,
  PenTool,
  Package,
  Award,
  Clock,
  MessageCircle,
  ChevronRight,
  Quote,
  ShoppingBag,
  Calendar,
  MapPin,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CourseCard } from "../components/CourseCard.jsx";
import { CategoryCard } from "../components/CategoryCard.jsx";
import { ProductCard } from "../components/ProductCard.jsx";
import { masterclasses } from "../data/masterclasses.js";
import { ImageWithFallback } from "../components/figma/ImageWithFallback.jsx";
import { getCourses, getProducts } from "../api/api.js";

export function HomePage() {
  const [trendingCourses, setTrendingCourses] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const upcomingMasterclasses = masterclasses.slice(0, 3);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all([getCourses(), getProducts()])
      .then(([courses, products]) => {
        if (cancelled) return;
        setTrendingCourses(courses.slice(0, 4));
        setFeaturedProducts(products.filter((p) => p.oldPrice).slice(0, 3));
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU", { day: "numeric", month: "long" });
  };

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#FEF7F0] via-[#FFF9F5] to-[#F5E9E0] px-6 py-20">
        <div className="absolute right-10 top-10 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-10 left-10 h-96 w-96 rounded-full bg-secondary/10 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div>
              <h1 className="font-heading mb-6 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
                Раскрой свой <br />
                <span className="text-primary">творческий</span> потенциал
              </h1>
              <p className="mb-8 text-xl leading-relaxed text-muted-foreground">
                Более 100 онлайн мастер-классов по рисованию, лепке, дизайну и фотографии. Учитесь в удобном темпе с доступом навсегда.
              </p>

              <div className="mb-8 flex flex-wrap gap-6">
                <div className="flex items-center gap-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Package className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold">100+</div>
                    <div className="text-sm text-muted-foreground">Мастер-классов</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary/10">
                    <Clock className="h-6 w-6 text-secondary" />
                  </div>
                  <div>
                    <div className="font-semibold">Навсегда</div>
                    <div className="text-sm text-muted-foreground">Доступ к урокам</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <MessageCircle className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold">24/7</div>
                    <div className="text-sm text-muted-foreground">Поддержка</div>
                  </div>
                </div>
              </div>

              <Link
                to="/catalog"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-lg text-primary-foreground shadow-lg transition-all hover:scale-105 hover:bg-primary/90 hover:shadow-xl"
              >
                Перейти в каталог
                <ChevronRight className="h-5 w-5" />
              </Link>
            </div>

            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <img
                    src="https://images.unsplash.com/photo-1749746766518-7d52a30c87cb?w=400"
                    alt="Творчество"
                    className="h-64 w-full rounded-3xl object-cover shadow-2xl"
                    width={400}
                    height={256}
                  />
                  <img
                    src="https://images.unsplash.com/photo-1657584905470-ac4ef76ee2b4?w=400"
                    alt="Digital art"
                    className="h-48 w-full rounded-3xl object-cover shadow-2xl"
                    width={400}
                    height={192}
                  />
                </div>
                <div className="mt-12 space-y-4">
                  <img
                    src="https://images.unsplash.com/photo-1760764541302-e3955fbc6b2b?w=400"
                    alt="Керамика"
                    className="h-48 w-full rounded-3xl object-cover shadow-2xl"
                    width={400}
                    height={192}
                  />
                  <img
                    src="https://images.unsplash.com/photo-1705254613735-1abb457f8a60?w=400"
                    alt="Живопись"
                    className="h-64 w-full rounded-3xl object-cover shadow-2xl"
                    width={400}
                    height={256}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Популярные направления */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="font-heading mb-4 text-3xl font-bold sm:text-4xl">Популярные направления</h2>
            <p className="text-lg text-muted-foreground">Выберите категорию, которая вам интересна</p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-5">
            <CategoryCard icon={Palette} title="Рисование" count={24} color="#E07A5F" />
            <CategoryCard icon={Sparkles} title="Digital-арт" count={18} color="#3D898B" />
            <CategoryCard icon={Package} title="Керамика" count={12} color="#F4A261" />
            <CategoryCard icon={PenTool} title="Каллиграфия" count={15} color="#E76F51" />
            <CategoryCard icon={Camera} title="Фотография" count={20} color="#2A9D8F" />
          </div>
        </div>
      </section>

      {/* Сейчас в тренде */}
      <section className="bg-muted/30 px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h2 className="font-heading mb-4 text-3xl font-bold sm:text-4xl">Сейчас в тренде</h2>
              <p className="text-lg text-muted-foreground">Самые популярные мастер-классы этого месяца</p>
            </div>
            <Link to="/catalog" className="inline-flex items-center gap-2 text-primary transition-colors hover:text-primary/80">
              Смотреть все
              <ChevronRight className="h-5 w-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {trendingCourses.map((course) => (
              <CourseCard key={course.id} {...course} />
            ))}
          </div>
        </div>
      </section>

      {/* Преимущества */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="font-heading text-3xl font-bold sm:text-4xl">Почему выбирают ArtCraft</h2>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <Feature icon={Award} title="Сертификат после обучения" text="Получите официальный сертификат о прохождении курса, который можно добавить в портфолио" variant="primary" />
            <Feature icon={Clock} title="Пожизненный доступ" text="Смотрите уроки в любое удобное время без ограничений. Доступ остаётся навсегда" variant="secondary" />
            <Feature icon={MessageCircle} title="Поддержка в чате" text="Задавайте вопросы преподавателям и получайте обратную связь по вашим работам" variant="primary" />
          </div>
        </div>
      </section>

      {/* Товары для творчества */}
      <section className="bg-gradient-to-br from-secondary/5 to-primary/5 px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <ShoppingBag className="h-8 w-8 text-primary" />
                <h2 className="font-heading text-3xl font-bold sm:text-4xl">Товары для творчества</h2>
              </div>
              <p className="text-lg text-muted-foreground">Качественные материалы для ваших проектов со скидками до 30%</p>
            </div>
            <Link to="/shop" className="inline-flex items-center gap-2 text-primary transition-colors hover:text-primary/80">
              Смотреть все товары
              <ChevronRight className="h-5 w-5" />
            </Link>
          </div>

          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            {featuredProducts.map((product) => (
              <Link key={product.id} to={`/shop/${product.id}`}>
                <ProductCard {...product} />
              </Link>
            ))}
          </div>

          <div className="text-center">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-primary-foreground transition-all hover:scale-105 hover:bg-primary/90"
            >
              <ShoppingBag className="h-5 w-5" />
              Перейти в магазин
            </Link>
          </div>
        </div>
      </section>

      {/* Отзывы */}
      <section className="bg-gradient-to-br from-primary/5 to-secondary/5 px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="font-heading mb-4 text-3xl font-bold sm:text-4xl">Отзывы реальных учеников</h2>
            <p className="text-lg text-muted-foreground">Истории успеха наших студентов</p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <Testimonial
              text="«Всегда мечтала научиться рисовать акварелью, но боялась начать. Курс Анны Соколовой полностью изменил мой взгляд на творчество. Теперь рисую каждый день!»"
              name="Екатерина Новикова"
              meta="Прошла 3 курса"
              gradient="from-primary to-secondary"
            />
            <Testimonial
              text="«Digital-иллюстрация казалась мне сложной, но преподаватель объясняет всё так понятно! За месяц создал своё первое портфолио и получил заказы.»"
              name="Андрей Лебедев"
              meta="Digital-художник"
              gradient="from-secondary to-primary"
            />
            <Testimonial
              text="«Лепка из полимерной глины стала моим любимым хобби. Уроки структурированы идеально, а результаты превзошли все ожидания. Спасибо!»"
              name="Мария Соловьёва"
              meta="Создаю украшения"
              gradient="from-primary to-secondary"
            />
          </div>
        </div>
      </section>

      {/* Будущие мастер-классы */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-8 h-8 text-primary" />
                <h2 className="text-4xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>
                  Ближайшие мастер-классы
                </h2>
              </div>
              <p className="text-lg text-muted-foreground">Практические занятия с профессиональными преподавателями</p>
            </div>
            <Link to="/schedule" className="text-primary hover:text-primary/80 transition-colors flex items-center gap-2">
              Смотреть расписание
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {upcomingMasterclasses.map((mc) => (
              <div
                key={mc.id}
                className="bg-card rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className="relative h-48 overflow-hidden">
                  <ImageWithFallback
                    src={mc.image}
                    alt={mc.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        mc.format === "Онлайн" ? "bg-secondary text-white" : "bg-primary text-primary-foreground"
                      }`}
                    >
                      {mc.format}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="text-xs text-primary font-medium mb-2">{mc.category}</div>
                  <h3 className="text-xl font-bold mb-3 line-clamp-2">{mc.title}</h3>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4 text-primary flex-shrink-0" />
                      <span>
                        {formatDate(mc.date)} • {mc.time}
                      </span>
                    </div>
                    {mc.address && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                        <span className="line-clamp-1">{mc.address}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm text-muted-foreground">{mc.instructor}</div>
                    <div className="text-2xl font-bold text-primary">{mc.price.toLocaleString("ru-RU")} ₽</div>
                  </div>

                  <Link to="/schedule">
                    <button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded-full transition-all duration-200 hover:scale-[1.02]">
                      Расписание
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link to="/schedule">
              <button className="px-8 py-4 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all hover:scale-105 inline-flex items-center gap-2 shadow-lg">
                <Calendar className="w-5 h-5" />
                Смотреть полное расписание
              </button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function Feature({ icon: Icon, title, text, variant }) {
  const gradient = variant === "secondary" ? "from-secondary to-secondary/50" : "from-primary to-primary/50";
  return (
    <div className="text-center">
      <div className={`mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br ${gradient} transition-transform hover:rotate-6`}>
        <Icon className="h-10 w-10 text-white" />
      </div>
      <h3 className="mb-3 text-xl font-semibold">{title}</h3>
      <p className="text-muted-foreground">{text}</p>
    </div>
  );
}

function Testimonial({ text, name, meta, gradient }) {
  return (
    <article className="rounded-3xl bg-card p-8 shadow-lg transition-shadow hover:shadow-xl">
      <Quote className="mb-4 h-10 w-10 text-primary" />
      <p className="mb-6 leading-relaxed text-muted-foreground">{text}</p>
      <div className="flex items-center gap-4">
        <div className={`h-12 w-12 rounded-full bg-gradient-to-br ${gradient}`} />
        <div>
          <div className="font-semibold">{name}</div>
          <div className="text-sm text-muted-foreground">{meta}</div>
        </div>
      </div>
    </article>
  );
}

