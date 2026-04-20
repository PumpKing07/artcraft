import { useState } from "react";
import { ChevronRight, Calendar, Clock, MapPin, Users, Filter, X, BookOpen, Monitor, Building2 } from "lucide-react";
import { Link } from "react-router-dom";
import { masterclasses } from "../data/masterclasses.js";
import { ImageWithFallback } from "../components/figma/ImageWithFallback.jsx";

export function SchedulePage() {
  const [selectedCategory, setSelectedCategory] = useState("Все");
  const [selectedFormat, setSelectedFormat] = useState("Все");
  const [view, setView] = useState("cards");
  const dayOrder = ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресенье"];
  const dayShort = { Понедельник: "Пн", Вторник: "Вт", Среда: "Ср", Четверг: "Чт", Пятница: "Пт", Суббота: "Сб", Воскресенье: "Вс" };
  const categories = ["Все", ...Array.from(new Set(masterclasses.map((mc) => mc.category)))];
  const formats = ["Все", "Онлайн", "Офлайн"];

  const filteredMasterclasses = masterclasses.filter((mc) => {
    const matchesCategory = selectedCategory === "Все" || mc.category === selectedCategory;
    const matchesFormat = selectedFormat === "Все" || mc.format === selectedFormat;
    return matchesCategory && matchesFormat;
  });

  const getDayOfWeek = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU", { weekday: "long" });
  };

  const getAvailabilityColor = (spotsLeft, totalSpots) => {
    const percentage = (spotsLeft / totalSpots) * 100;
    if (percentage > 50) return "text-secondary";
    if (percentage > 20) return "text-amber-500";
    return "text-destructive";
  };

  const getAvailabilityBg = (spotsLeft, totalSpots) => {
    const percentage = (spotsLeft / totalSpots) * 100;
    if (percentage > 50) return "bg-secondary/10 text-secondary";
    if (percentage > 20) return "bg-amber-50 text-amber-600";
    return "bg-red-50 text-red-500";
  };

  const groupedByDay = {};
  dayOrder.forEach((day) => {
    const dayItems = filteredMasterclasses.filter((mc) => mc.days.includes(day));
    if (dayItems.length > 0) groupedByDay[day] = dayItems;
  });

  return (
    <div className="min-h-screen">
      <div className="bg-muted/30 px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center gap-2 text-sm">
          <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">Главная</Link>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <span className="text-foreground font-medium">Расписание мастер-классов</span>
        </div>
      </div>

      <section className="py-12 px-6 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <h1 className="text-5xl font-bold mb-4" style={{ fontFamily: "var(--font-heading)" }}>Расписание мастер-классов</h1>
            <p className="text-lg text-muted-foreground max-w-2xl">Узнайте когда, где и по каким дням проходят наши занятия. Для записи на курс — перейдите в каталог.</p>
          </div>
          <Link to="/catalog">
            <button className="px-6 py-3 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all hover:scale-105 whitespace-nowrap">Записаться на курс →</button>
          </Link>
        </div>
      </section>

      <div className="bg-card border-b border-border px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-wrap gap-6">
          <div className="flex items-center gap-2 text-sm"><div className="w-2 h-2 rounded-full bg-secondary" /><span className="text-muted-foreground">{masterclasses.filter((m) => m.format === "Онлайн").length} онлайн-занятий</span></div>
          <div className="flex items-center gap-2 text-sm"><div className="w-2 h-2 rounded-full bg-primary" /><span className="text-muted-foreground">{masterclasses.filter((m) => m.format === "Офлайн").length} офлайн-занятий</span></div>
          <div className="flex items-center gap-2 text-sm"><div className="w-2 h-2 rounded-full bg-amber-400" /><span className="text-muted-foreground">{masterclasses.length} мастер-классов в апреле</span></div>
        </div>
      </div>

      <div className="py-10 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-4 mb-8 items-center justify-between">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2"><Filter className="w-5 h-5 text-muted-foreground" /><span className="font-medium text-sm">Фильтры:</span></div>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button key={category} onClick={() => setSelectedCategory(category)} className={`px-4 py-2 rounded-full text-sm transition-all ${selectedCategory === category ? "bg-primary text-primary-foreground shadow-md" : "bg-card hover:bg-muted border border-border"}`}>{category}</button>
                ))}
              </div>
              <div className="w-px h-6 bg-border hidden sm:block" />
              <div className="flex flex-wrap gap-2">
                {formats.map((format) => (
                  <button key={format} onClick={() => setSelectedFormat(format)} className={`px-4 py-2 rounded-full text-sm transition-all ${selectedFormat === format ? "bg-secondary text-white shadow-md" : "bg-card hover:bg-muted border border-border"}`}>{format}</button>
                ))}
              </div>
              {(selectedCategory !== "Все" || selectedFormat !== "Все") && (
                <button onClick={() => { setSelectedCategory("Все"); setSelectedFormat("Все"); }} className="px-3 py-2 rounded-full text-sm bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors flex items-center gap-1">
                  <X className="w-3 h-3" />
                  Сброс
                </button>
              )}
            </div>
            <div className="flex bg-muted rounded-xl p-1 gap-1">
              <button onClick={() => setView("cards")} className={`px-4 py-2 rounded-lg text-sm transition-all ${view === "cards" ? "bg-card shadow-sm font-medium" : "hover:bg-muted-foreground/10"}`}>Карточки</button>
              <button onClick={() => setView("table")} className={`px-4 py-2 rounded-lg text-sm transition-all ${view === "table" ? "bg-card shadow-sm font-medium" : "hover:bg-muted-foreground/10"}`}>По дням</button>
            </div>
          </div>

          {view === "cards" && (
            <>
              {filteredMasterclasses.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredMasterclasses.map((mc) => (
                    <div key={mc.id} className="bg-card rounded-[20px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group flex flex-col md:flex-row">
                      <div className="relative w-full md:w-52 flex-shrink-0 h-48 md:h-auto overflow-hidden">
                        <ImageWithFallback src={mc.image} alt={mc.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        <div className="absolute top-3 left-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${mc.format === "Онлайн" ? "bg-secondary text-white" : "bg-primary text-primary-foreground"}`}>{mc.format}</span>
                        </div>
                        <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm rounded-xl px-3 py-2 text-center shadow-sm">
                          <div className="text-xs text-muted-foreground capitalize">{getDayOfWeek(mc.date)}</div>
                          <div className="font-bold text-primary text-lg leading-none">{new Date(mc.date).getDate()}</div>
                          <div className="text-xs text-muted-foreground">{new Date(mc.date).toLocaleDateString("ru-RU", { month: "short" })}</div>
                        </div>
                      </div>
                      <div className="p-5 flex flex-col flex-1">
                        <div className="text-xs text-primary font-medium mb-1">{mc.category} • {mc.level}</div>
                        <h3 className="font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors">{mc.title}</h3>
                        <div className="space-y-2 mb-4 flex-1">
                          <div className="flex items-start gap-2">
                            <Calendar className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                            <div>
                              <div className="text-xs text-muted-foreground mb-1">Дни занятий</div>
                              <div className="flex gap-1 flex-wrap">
                                {mc.days.map((day) => <span key={day} className="px-2 py-0.5 bg-primary/10 text-primary rounded-md text-xs font-medium">{dayShort[day] ?? day}</span>)}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground"><Clock className="w-4 h-4 text-primary flex-shrink-0" /><span className="font-medium text-foreground">{mc.time}</span><span>•</span><span>{mc.duration}</span></div>
                          <div className="flex items-start gap-2 text-sm">
                            {mc.format === "Онлайн" ? <Monitor className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" /> : <Building2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />}
                            <div>
                              {mc.location && <div className="font-medium text-sm">{mc.location}</div>}
                              {mc.address && <div className="text-xs text-muted-foreground mt-0.5">{mc.address}</div>}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-sm"><Users className="w-4 h-4 text-primary flex-shrink-0" /><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getAvailabilityBg(mc.spotsLeft, mc.spots)}`}>Осталось {mc.spotsLeft} из {mc.spots} мест</span></div>
                        </div>
                        <div className="flex items-center justify-between pt-3 border-t border-border">
                          <div><div className="text-xs text-muted-foreground">Преподаватель</div><div className="text-sm font-semibold">{mc.instructor}</div></div>
                          <div className="text-right"><div className="text-2xl font-bold text-primary">{mc.price.toLocaleString("ru-RU")} ₽</div></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4"><Calendar className="w-10 h-10 text-muted-foreground" /></div>
                  <h3 className="text-xl font-semibold mb-2">Мастер-классы не найдены</h3>
                  <p className="text-muted-foreground mb-6">Попробуйте изменить параметры фильтрации</p>
                  <button onClick={() => { setSelectedCategory("Все"); setSelectedFormat("Все"); }} className="px-6 py-3 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors">Сбросить фильтры</button>
                </div>
              )}
            </>
          )}

          {view === "table" && (
            <div className="space-y-6">
              <div className="grid grid-cols-7 gap-2 mb-2 hidden md:grid">
                {dayOrder.map((day) => (
                  <div key={day} className={`text-center py-2 rounded-xl text-sm font-medium ${groupedByDay[day] ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                    {dayShort[day]}
                    {groupedByDay[day] && <div className="text-xs font-normal mt-0.5">{groupedByDay[day].length} занят.</div>}
                  </div>
                ))}
              </div>
              {Object.keys(groupedByDay).length > 0 ? (
                dayOrder.filter((day) => groupedByDay[day]).map((day) => (
                  <div key={day}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center"><span className="text-primary-foreground font-bold">{dayShort[day]}</span></div>
                      <div><div className="font-bold text-xl">{day}</div><div className="text-sm text-muted-foreground">{groupedByDay[day].length} {groupedByDay[day].length === 1 ? "занятие" : "занятия"}</div></div>
                    </div>
                    <div className="space-y-3 ml-0 md:ml-16">
                      {groupedByDay[day].map((mc) => (
                        <div key={mc.id} className="bg-card rounded-[20px] p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col sm:flex-row gap-4">
                          <div className="flex-shrink-0 text-center sm:text-left"><div className="text-3xl font-bold text-primary">{mc.time}</div><div className="text-xs text-muted-foreground">{mc.duration}</div></div>
                          <div className="w-px bg-border hidden sm:block" />
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap gap-2 mb-2 items-center">
                              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${mc.format === "Онлайн" ? "bg-secondary/10 text-secondary" : "bg-primary/10 text-primary"}`}>{mc.format}</span>
                              <span className="text-xs text-muted-foreground">{mc.category}</span>
                              <span className="text-xs text-muted-foreground">•</span>
                              <span className="text-xs text-muted-foreground">{mc.level}</span>
                            </div>
                            <h4 className="font-bold mb-2 truncate">{mc.title}</h4>
                            <div className="flex flex-col sm:flex-row gap-3 text-sm">
                              <div className="flex items-start gap-1.5 flex-1">
                                {mc.format === "Онлайн" ? <Monitor className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" /> : <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />}
                                <div>
                                  {mc.location && <div className="text-sm font-medium">{mc.location}</div>}
                                  {mc.address && <div className="text-xs text-muted-foreground">{mc.address}</div>}
                                </div>
                              </div>
                              <div className="text-right flex-shrink-0">
                                <div className="text-sm font-semibold">{mc.instructor}</div>
                                <div className={`text-xs mt-0.5 ${getAvailabilityColor(mc.spotsLeft, mc.spots)}`}>{mc.spotsLeft} мест свободно</div>
                              </div>
                            </div>
                          </div>
                          <div className="flex-shrink-0 flex flex-col items-center sm:items-end justify-center gap-2">
                            <div className="text-2xl font-bold text-primary">{mc.price.toLocaleString("ru-RU")} ₽</div>
                            <Link to="/catalog"><span className="text-xs text-primary underline underline-offset-2 hover:text-primary/80 transition-colors cursor-pointer">В каталог</span></Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-20">
                  <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4"><Calendar className="w-10 h-10 text-muted-foreground" /></div>
                  <h3 className="text-xl font-semibold mb-2">Занятия не найдены</h3>
                  <p className="text-muted-foreground mb-6">Попробуйте изменить параметры фильтрации</p>
                </div>
              )}
            </div>
          )}

          <div className="mt-16 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-[20px] p-8 text-center">
            <BookOpen className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-3" style={{ fontFamily: "var(--font-heading)" }}>Готовы начать творить?</h2>
            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">Выберите интересующий курс в нашем каталоге и нажмите «Записаться» — заполнение формы займёт не более 2 минут.</p>
            <Link to="/catalog">
              <button className="px-8 py-4 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all hover:scale-105 shadow-lg">Перейти в каталог курсов</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

