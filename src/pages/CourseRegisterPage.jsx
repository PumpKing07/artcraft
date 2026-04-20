import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ChevronRight, Clock, Star, CheckCircle, ArrowLeft, BookOpen, Users } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback.jsx";
import { getCourses } from "../api/api.js";

export function CourseRegisterPage() {
  const { id } = useParams();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    experience: "",
    goal: "",
    comment: "",
  });
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
            <button className="px-6 py-3 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors">Вернуться в каталог</button>
          </Link>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-2xl w-full text-center">
          <div className="w-24 h-24 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-secondary" />
          </div>
          <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: "var(--font-heading)" }}>Заявка принята!</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Мы отправили подтверждение на <strong>{formData.email}</strong>. Ожидайте письмо с доступом к курсу и инструкциями по оплате.
          </p>
          <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-3xl p-6 mb-8 text-left flex gap-5">
            <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0"><ImageWithFallback src={course.image} alt={course.title} className="w-full h-full object-cover" /></div>
            <div>
              <div className="text-xs text-primary font-medium mb-1">{course.category}</div>
              <div className="font-bold text-lg mb-1">{course.title}</div>
              <div className="text-sm text-muted-foreground">{course.instructor} • {course.duration}</div>
              <div className="text-2xl font-bold text-primary mt-2">{course.price.toLocaleString("ru-RU")} ₽</div>
            </div>
          </div>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/catalog"><button className="px-8 py-4 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all hover:scale-105">Продолжить просмотр курсов</button></Link>
            <Link to="/"><button className="px-8 py-4 border-2 border-border rounded-full hover:bg-muted transition-colors">На главную</button></Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="bg-muted/30 py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-sm flex-wrap">
          <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">Главная</Link>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
          <Link to="/catalog" className="text-muted-foreground hover:text-primary transition-colors">Каталог</Link>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
          <Link to={`/catalog/${course.id}`} className="text-muted-foreground hover:text-primary transition-colors truncate max-w-xs">{course.title}</Link>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
          <span className="text-foreground font-medium">Запись на курс</span>
        </div>
      </div>

      <div className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <Link to={`/catalog/${course.id}`} className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8">
            <ArrowLeft className="w-5 h-5" />
            Вернуться к описанию курса
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div>
              <h1 className="text-4xl font-bold mb-6" style={{ fontFamily: "var(--font-heading)" }}>Запись на курс</h1>
              <div className="bg-card rounded-[20px] overflow-hidden shadow-lg mb-6">
                <div className="relative h-56">
                  <ImageWithFallback src={course.image} alt={course.title} className="w-full h-full object-cover" />
                  <div className="absolute top-4 left-4"><span className="px-4 py-2 rounded-full text-sm font-medium bg-primary text-primary-foreground">{course.level}</span></div>
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5"><Star className="w-4 h-4 fill-amber-400 text-amber-400" /><span className="font-semibold">{course.rating}</span></div>
                </div>
                <div className="p-6">
                  <div className="text-sm text-primary font-medium mb-1">{course.category}</div>
                  <h2 className="text-2xl font-bold mb-4">{course.title}</h2>
                  <div className="grid grid-cols-2 gap-4 mb-5">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground"><Clock className="w-4 h-4 text-primary" /><span>{course.duration}</span></div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground"><BookOpen className="w-4 h-4 text-primary" /><span>{course.lessons ?? 0} уроков</span></div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground"><Users className="w-4 h-4 text-primary" /><span>{course.students ?? "—"} учеников</span></div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground"><Star className="w-4 h-4 text-primary" /><span>{course.reviewCount ?? 0} отзывов</span></div>
                  </div>
                  <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl p-4 mb-4">
                    <div className="text-sm text-muted-foreground mb-1">Стоимость курса</div>
                    <div className="flex items-end gap-2">
                      <div className="text-4xl font-bold text-primary">{course.price.toLocaleString("ru-RU")} ₽</div>
                      {course.oldPrice && <div className="text-muted-foreground line-through mb-1 text-lg">{course.oldPrice.toLocaleString("ru-RU")} ₽</div>}
                    </div>
                  </div>
                  <div className="border-t border-border pt-4">
                    <div className="text-sm text-muted-foreground mb-1">Преподаватель</div>
                    <div className="font-semibold text-lg">{course.instructor}</div>
                  </div>
                </div>
              </div>
              {course.description && <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-[20px] p-6"><h3 className="font-bold text-lg mb-3">О курсе</h3><p className="text-muted-foreground leading-relaxed">{course.description}</p></div>}
            </div>

            <div>
              <div className="bg-card rounded-[20px] p-8 shadow-lg sticky top-24">
                <h2 className="text-2xl font-bold mb-2">Форма записи</h2>
                <p className="text-muted-foreground text-sm mb-6">Заполните данные, и мы свяжемся с вами для подтверждения записи</p>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div><label htmlFor="firstName" className="block text-sm font-medium mb-2">Имя <span className="text-destructive">*</span></label><input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required className={inputCls} placeholder="Иван" /></div>
                    <div><label htmlFor="lastName" className="block text-sm font-medium mb-2">Фамилия <span className="text-destructive">*</span></label><input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required className={inputCls} placeholder="Иванов" /></div>
                  </div>
                  <div><label htmlFor="email" className="block text-sm font-medium mb-2">Email <span className="text-destructive">*</span></label><input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className={inputCls} placeholder="ivan@example.com" /></div>
                  <div><label htmlFor="phone" className="block text-sm font-medium mb-2">Телефон <span className="text-destructive">*</span></label><input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} required className={inputCls} placeholder="+7 (999) 123-45-67" /></div>
                  <div><label htmlFor="experience" className="block text-sm font-medium mb-2">Ваш уровень опыта</label><select id="experience" name="experience" value={formData.experience} onChange={handleChange} className={inputCls}><option value="">Выберите уровень</option><option value="beginner">Новичок — только начинаю</option><option value="intermediate">Средний — есть базовые навыки</option><option value="advanced">Продвинутый — хочу углубиться</option></select></div>
                  <div><label htmlFor="goal" className="block text-sm font-medium mb-2">Ваша цель в обучении</label><select id="goal" name="goal" value={formData.goal} onChange={handleChange} className={inputCls}><option value="">Выберите цель</option><option value="hobby">Хобби и самовыражение</option><option value="career">Смена профессии</option><option value="skill">Развитие навыка</option><option value="gift">Хочу сделать подарок близким</option></select></div>
                  <div><label htmlFor="comment" className="block text-sm font-medium mb-2">Пожелания или вопросы</label><textarea id="comment" name="comment" value={formData.comment} onChange={handleChange} rows={3} className={`${inputCls} resize-none`} placeholder="Есть ли у вас пожелания или вопросы к преподавателю?" /></div>
                  <div className="bg-muted/30 rounded-xl p-4 text-sm text-muted-foreground">Нажимая «Записаться на курс», вы соглашаетесь с <Link to="/terms" className="text-primary hover:underline">условиями использования</Link> и <Link to="/privacy" className="text-primary hover:underline">политикой конфиденциальности</Link></div>
                  <button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-4 rounded-full transition-all hover:scale-[1.02] shadow-lg font-medium text-lg">Записаться на курс</button>
                  <div className="text-center text-sm text-muted-foreground">После записи вы получите письмо с инструкциями по оплате и доступом</div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const inputCls = "w-full px-4 py-3 bg-input-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer";

