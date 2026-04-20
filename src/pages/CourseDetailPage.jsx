import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ChevronRight, Star, Check, Clock, Award, Play, BookOpen, Download, MessageCircle, ArrowLeft } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback.jsx";
import { CourseCard } from "../components/CourseCard.jsx";
import { getCourses } from "../api/api.js";

export function CourseDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [enrolled, setEnrolled] = useState(false);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setLoadError("");

    getCourses()
      .then((data) => {
        if (cancelled) return;
        setCourses(data);
      })
      .catch((err) => {
        if (cancelled) return;
        setLoadError(err.message || "Не удалось загрузить курсы");
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const course = useMemo(() => courses.find((c) => c.id === id), [courses, id]);
  const relatedCourses = useMemo(
    () => (course ? courses.filter((c) => c.category === course.category && c.id !== course.id).slice(0, 3) : []),
    [courses, course]
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

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="mb-4 text-2xl font-bold">Курс не найден</h2>
          <Link to="/catalog">
            <button className="px-6 py-3 bg-primary text-primary-foreground rounded-full">
              Вернуться в каталог
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const handleEnroll = () => setEnrolled(true);
  const curriculum = [
    { module: "Модуль 1: Основы", lessons: ["Введение в курс - 15 мин", "Необходимые материалы - 20 мин", "Базовые техники - 45 мин", "Практическое задание - 30 мин"] },
    { module: "Модуль 2: Продвинутые техники", lessons: ["Работа с цветом - 40 мин", "Композиция и перспектива - 50 мин", "Свет и тень - 45 мин", "Детализация - 35 мин"] },
    { module: "Модуль 3: Практика", lessons: ["Создание первой работы - 60 мин", "Анализ ошибок - 30 мин", "Финальный проект - 90 мин", "Получение сертификата - 15 мин"] },
  ];
  const benefits = [
    { icon: Clock, title: "Пожизненный доступ", description: "Учитесь в своём темпе" },
    { icon: Award, title: "Сертификат", description: "После прохождения курса" },
    { icon: MessageCircle, title: "Поддержка", description: "Чат с преподавателем" },
    { icon: Download, title: "Материалы", description: "Все файлы в формате PDF" },
  ];
  const instructor = {
    name: course.instructor,
    role: "Профессиональный художник",
    bio: "Более 10 лет опыта в преподавании и создании произведений искусства. Участник международных выставок.",
    students: "5,200+",
    courses: "12",
    rating: "4.9",
  };

  return (
    <div className="min-h-screen">
      <button
        onClick={() => navigate("/catalog")}
        className="ml-6 mt-6 mb-2 inline-flex items-center gap-2 px-4 py-2.5 bg-card border border-border rounded-full hover:bg-muted transition-all hover:scale-105 shadow-sm text-sm font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="hidden sm:inline">Назад</span>
      </button>

      <div className="bg-muted/30 px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center gap-2 text-sm">
          <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">Главная</Link>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <Link to="/catalog" className="text-muted-foreground hover:text-primary transition-colors">Каталог</Link>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <span className="text-foreground font-medium truncate">{course.title}</span>
        </div>
      </div>

      <div className="bg-gradient-to-br from-primary/10 to-secondary/10 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <div className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-4">{course.category}</div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4" style={{ fontFamily: "var(--font-heading)" }}>{course.title}</h1>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">{course.description}</p>
            <div className="flex flex-wrap items-center gap-6 mb-6">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-5 h-5 ${i < Math.floor(course.rating) ? "fill-amber-400 text-amber-400" : "text-muted"}`} />
                  ))}
                </div>
                <span className="font-semibold">{course.rating}</span>
                <span className="text-muted-foreground">({course.students} студентов)</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground"><Clock className="w-5 h-5" /><span>{course.duration}</span></div>
              <div className="flex items-center gap-2 text-muted-foreground"><BookOpen className="w-5 h-5" /><span>{course.lessons} уроков</span></div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-card rounded-2xl">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-xl font-bold">{instructor.name.charAt(0)}</div>
              <div>
                <div className="text-sm text-muted-foreground">Преподаватель</div>
                <div className="font-semibold text-lg">{instructor.name}</div>
              </div>
            </div>
          </div>

          <aside className="rounded-3xl bg-card p-8 shadow-xl">
            <div className="relative rounded-2xl overflow-hidden mb-6">
              <ImageWithFallback src={course.image} alt={course.title} className="w-full aspect-video object-cover" />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                  <Play className="w-8 h-8 text-primary ml-1" />
                </div>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline gap-3 mb-2">
                <div className="text-3xl font-bold text-primary">{course.price.toLocaleString("ru-RU")} ₽</div>
                {course.oldPrice && <div className="text-lg text-muted-foreground line-through">{course.oldPrice.toLocaleString("ru-RU")} ₽</div>}
              </div>
              {course.oldPrice && <div className="text-sm text-secondary font-medium">Скидка {Math.round(((course.oldPrice - course.price) / course.oldPrice) * 100)}%</div>}
            </div>

            <Link to={`/catalog/${course.id}/register`}>
              <button onClick={handleEnroll} className="w-full bg-primary text-primary-foreground py-4 rounded-full hover:bg-primary/90 transition-all hover:scale-[1.02] shadow-lg mb-4">
                {enrolled ? "Вы записаны" : "Записаться на курс"}
              </button>
            </Link>
            <div className="text-center text-sm text-muted-foreground mb-6">30 дней гарантии возврата денег</div>
          </aside>
        </div>
        </div>
      </div>

      <div className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8" style={{ fontFamily: "var(--font-heading)" }}>Что вы изучите</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "Основные техники и приёмы работы",
                "Работу с материалами и инструментами",
                "Создание композиции и работу с цветом",
                "Профессиональные секреты и лайфхаки",
                "Создание полноценных творческих работ",
                "Развитие собственного стиля",
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-3 p-4 bg-muted/50 rounded-xl">
                  <Check className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8" style={{ fontFamily: "var(--font-heading)" }}>Программа курса</h2>
            <div className="space-y-4">
              {curriculum.map((section, index) => (
                <details key={index} className="bg-card rounded-2xl overflow-hidden group">
                  <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center font-bold">{index + 1}</div>
                      <h3 className="font-semibold text-lg">{section.module}</h3>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-open:rotate-90 transition-transform" />
                  </summary>
                  <div className="px-6 pb-6 space-y-3">
                    {section.lessons.map((lesson, lessonIndex) => (
                      <div key={lessonIndex} className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl">
                        <Play className="w-4 h-4 text-primary flex-shrink-0" />
                        <span className="text-sm">{lesson}</span>
                      </div>
                    ))}
                  </div>
                </details>
              ))}
            </div>
          </section>

          <section className="mb-16 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-3xl p-8">
            <h2 className="text-3xl font-bold mb-8" style={{ fontFamily: "var(--font-heading)" }}>О преподавателе</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center">
                <div className="w-32 h-32 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-4xl font-bold mb-4">{instructor.name.charAt(0)}</div>
                <h3 className="text-xl font-bold mb-2">{instructor.name}</h3>
                <div className="text-primary font-medium mb-4">{instructor.role}</div>
                <div className="grid grid-cols-3 gap-4 w-full">
                  <div className="text-center"><div className="font-bold text-lg">{instructor.students}</div><div className="text-xs text-muted-foreground">Студентов</div></div>
                  <div className="text-center"><div className="font-bold text-lg">{instructor.courses}</div><div className="text-xs text-muted-foreground">Курсов</div></div>
                  <div className="text-center"><div className="font-bold text-lg">{instructor.rating}</div><div className="text-xs text-muted-foreground">Рейтинг</div></div>
                </div>
              </div>
              <div className="md:col-span-2">
                <p className="text-muted-foreground leading-relaxed mb-4">{instructor.bio}</p>
                <p className="text-muted-foreground leading-relaxed">Страстно увлечён преподаванием и помогает студентам раскрывать их творческий потенциал. Разработал уникальную методику обучения, которая позволяет добиться результатов даже тем, кто никогда раньше не занимался творчеством.</p>
              </div>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8" style={{ fontFamily: "var(--font-heading)" }}>Почему выбирают этот курс</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="bg-card rounded-2xl p-6 text-center hover:shadow-xl transition-all hover:-translate-y-2">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-4"><benefit.icon className="w-7 h-7 text-white" /></div>
                  <h3 className="font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </div>
              ))}
            </div>
          </section>

          {relatedCourses.length > 0 && (
            <section>
              <h2 className="text-3xl font-bold mb-8" style={{ fontFamily: "var(--font-heading)" }}>Похожие курсы</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedCourses.map((item) => (
                  <CourseCard key={item.id} {...item} />
                ))}
              </div>
            </section>
          )}
          </div>
      </div>
    </div>
  );
}

