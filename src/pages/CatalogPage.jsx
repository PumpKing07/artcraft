import { useEffect, useMemo, useState } from "react";
import { ChevronRight, Search, X } from "lucide-react";
import { Link } from "react-router-dom";
import { categories, levels, formats } from "../data/courses.js";
import { CourseCard } from "../components/CourseCard.jsx";
import { getCourses } from "../api/api.js";

export function CatalogPage() {
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

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedLevels, setSelectedLevels] = useState([]);
  const [selectedFormats, setSelectedFormats] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [sortBy, setSortBy] = useState("popularity");
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 9;

  const toggleFilter = (filterArray, setFilter, value) => {
    if (filterArray.includes(value)) setFilter(filterArray.filter((item) => item !== value));
    else setFilter([...filterArray, value]);
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategories([]);
    setSelectedLevels([]);
    setSelectedFormats([]);
    setPriceRange([0, 10000]);
    setSortBy("popularity");
    setCurrentPage(1);
  };

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesSearch =
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategories.length === 0 || selectedCategories.includes(course.category);
      const matchesLevel =
        selectedLevels.length === 0 || selectedLevels.includes(course.level);
      const matchesFormat =
        selectedFormats.length === 0 || selectedFormats.includes(course.format);
      const matchesPrice = course.price >= priceRange[0] && course.price <= priceRange[1];
      return (
        matchesSearch && matchesCategory && matchesLevel && matchesFormat && matchesPrice
      );
    });
  }, [courses, searchQuery, selectedCategories, selectedLevels, selectedFormats, priceRange]);

  const sortedCourses = useMemo(() => {
    return [...filteredCourses].sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      return b.rating - a.rating;
    });
  }, [filteredCourses, sortBy]);

  const totalPages = Math.ceil(sortedCourses.length / coursesPerPage);
  const paginatedCourses = sortedCourses.slice((currentPage - 1) * coursesPerPage, currentPage * coursesPerPage);

  return (
    <div className="min-h-screen">
      <div className="bg-muted/30 py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-sm">
          <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">Главная</Link>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
          <span className="text-foreground font-medium">Каталог</span>
        </div>
      </div>

      <div className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h1 className="text-5xl font-bold mb-4" style={{ fontFamily: "var(--font-heading)" }}>Каталог творческих курсов</h1>
            <p className="text-lg text-muted-foreground">Найдено курсов: {sortedCourses.length}</p>
          </div>

          <div className="flex gap-8">
            <aside className="w-80 flex-shrink-0">
              <div className="bg-card rounded-3xl p-6 shadow-sm sticky top-24">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold">Фильтры</h3>
                  <button onClick={resetFilters} className="text-sm text-primary flex items-center gap-1"><X className="w-4 h-4" />Сбросить</button>
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Поиск</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Название или преподаватель"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-input-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    />
                  </div>
                </div>

                <FilterGroup title="Категория" items={categories} selected={selectedCategories} onToggle={(v) => toggleFilter(selectedCategories, setSelectedCategories, v)} />
                <FilterGroup title="Уровень подготовки" items={levels} selected={selectedLevels} onToggle={(v) => toggleFilter(selectedLevels, setSelectedLevels, v)} />
                <FilterGroup title="Формат обучения" items={formats} selected={selectedFormats} onToggle={(v) => toggleFilter(selectedFormats, setSelectedFormats, v)} />

                <div className="mb-2">
                  <label className="block text-sm font-medium mb-2">Цена: {priceRange[0]} - {priceRange[1]} ₽</label>
                  <input type="range" min="0" max="10000" step="100" value={priceRange[1]} onChange={(e) => setPriceRange([0, Number(e.target.value)])} className="w-full range-primary" />
                </div>
              </div>
            </aside>

            <div className="flex-1">
              <div className="flex justify-between items-center mb-6">
                <div className="text-sm text-muted-foreground">Показано {paginatedCourses.length} из {sortedCourses.length} курсов</div>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-4 py-2 bg-input-background border border-border rounded-xl text-sm">
                  <option value="popularity">По популярности</option>
                  <option value="price-asc">Сначала дешевые</option>
                  <option value="price-desc">Сначала дорогие</option>
                  <option value="rating">По рейтингу</option>
                </select>
              </div>

              {loading ? (
                <div className="text-center py-20 text-muted-foreground">Загрузка...</div>
              ) : loadError ? (
                <div className="text-center py-20 text-destructive">{loadError}</div>
              ) : paginatedCourses.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {paginatedCourses.map((course) => (
                      <CourseCard key={course.id} {...course} showEnroll />
                    ))}
                  </div>
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2">
                      <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-4 py-2 rounded-xl border border-border disabled:opacity-50">Назад</button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button key={page} onClick={() => setCurrentPage(page)} className={`w-10 h-10 rounded-xl ${currentPage === page ? "bg-primary text-white" : "border border-border"}`}>{page}</button>
                      ))}
                      <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-4 py-2 rounded-xl border border-border disabled:opacity-50">Вперёд</button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-20">
                  <h3 className="text-xl font-semibold mb-2">Курсы не найдены</h3>
                  <p className="text-muted-foreground mb-6">Попробуйте изменить параметры фильтрации</p>
                  <button onClick={resetFilters} className="px-6 py-3 bg-primary text-primary-foreground rounded-full">Сбросить фильтры</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterGroup({ title, items, selected, onToggle }) {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium mb-3">{title}</label>
      <div className="space-y-2">
        {items.map((item) => (
          <label key={item} className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={selected.includes(item)} onChange={() => onToggle(item)} />
            <span>{item}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

