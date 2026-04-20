import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User, Mail, Phone, FileText, Camera, Save, Lock, Bell,
  ShoppingBag, BookOpen, LogOut, ChevronRight, Star, Package,
  Clock, CheckCircle2, Loader2, Eye, EyeOff, AlertCircle, Palette,
} from "lucide-react";
import { useAuth } from "../context/auth-context.jsx";
import { ImageWithFallback } from "../components/figma/ImageWithFallback.jsx";
import { courses } from "../data/courses.js";

const mockOrders = [
  { id: "AC-10234", date: "10 апр 2026", status: "delivered", total: 7330, items: ["Набор кистей", "Акриловые краски"] },
  { id: "AC-10187", date: "2 апр 2026", status: "processing", total: 5690, items: ["Каллиграфический набор"] },
  { id: "AC-10055", date: "15 мар 2026", status: "delivered", total: 2490, items: ["Акварельные краски 24 цв."] },
];

const mockCourses = [
  { id: "1", progress: 65, completed: 16 },
  { id: "2", progress: 30, completed: 5 },
  { id: "3", progress: 100, completed: 10 },
];

const statusMeta = {
  delivered: { label: "Доставлен", color: "text-secondary bg-secondary/10" },
  processing: { label: "В обработке", color: "text-amber-600 bg-amber-50" },
  cancelled: { label: "Отменён", color: "text-destructive bg-destructive/10" },
};

export function AccountPage() {
  const navigate = useNavigate();
  const { user, logout, updateProfile } = useAuth();
  const fileRef = useRef(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    bio: user?.bio || "",
  });
  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });
  const [showPw, setShowPw] = useState({ current: false, next: false, confirm: false });
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
            <User className="w-12 h-12 text-muted-foreground" />
          </div>
          <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: "var(--font-heading)" }}>Вы не авторизованы</h2>
          <p className="text-muted-foreground mb-8">Войдите в аккаунт, чтобы управлять профилем и заказами</p>
          <Link to="/login" className="inline-block px-8 py-4 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all hover:scale-105">
            Войти / Зарегистрироваться
          </Link>
        </div>
      </div>
    );
  }

  const handleSaveProfile = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 700));
    updateProfile(profileForm);
    setSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => updateProfile({ avatar: ev.target?.result });
    reader.readAsDataURL(file);
  };

  const handleChangePassword = async () => {
    setPwError("");
    if (!pwForm.current || !pwForm.next || !pwForm.confirm) return setPwError("Заполните все поля");
    if (pwForm.next.length < 6) return setPwError("Новый пароль должен быть не менее 6 символов");
    if (pwForm.next !== pwForm.confirm) return setPwError("Пароли не совпадают");
    setPwLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setPwLoading(false);
    setPwSuccess(true);
    setPwForm({ current: "", next: "", confirm: "" });
    setTimeout(() => setPwSuccess(false), 4000);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const initials = user.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  const joinedDate = new Date(user.joinDate).toLocaleDateString("ru-RU", { year: "numeric", month: "long" });
  const tabs = [
    { key: "profile", label: "Профиль", icon: <User className="w-4 h-4" /> },
    { key: "courses", label: "Мои курсы", icon: <BookOpen className="w-4 h-4" /> },
    { key: "orders", label: "Заказы", icon: <ShoppingBag className="w-4 h-4" /> },
    { key: "settings", label: "Настройки", icon: <Lock className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen py-10 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-2 text-sm mb-8 text-muted-foreground">
          <Link to="/" className="hover:text-primary transition-colors">Главная</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground font-medium">Личный кабинет</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-card rounded-3xl p-6 shadow-sm text-center">
              <div className="relative inline-block mb-4">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-24 h-24 rounded-full object-cover ring-4 ring-primary/20" />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center ring-4 ring-primary/20">
                    <span className="text-white text-2xl font-bold">{initials}</span>
                  </div>
                )}
                <button onClick={() => fileRef.current?.click()} className="absolute bottom-0 right-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors">
                  <Camera className="w-4 h-4" />
                </button>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
              </div>
              <h2 className="font-bold text-lg mb-1">{user.name}</h2>
              <p className="text-sm text-muted-foreground mb-3">{user.email}</p>
              <div className="inline-flex items-center gap-1.5 text-xs bg-secondary/15 text-secondary px-3 py-1 rounded-full">
                <Palette className="w-3 h-3" />
                Студент ArtCraft
              </div>
              <div className="mt-4 pt-4 border-t border-border text-xs text-muted-foreground">Участник с {joinedDate}</div>
            </div>

            <div className="bg-card rounded-3xl p-3 shadow-sm">
              {tabs.map((tab) => (
                <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all text-left ${activeTab === tab.key ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
              <div className="border-t border-border mt-2 pt-2">
                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-all text-left">
                  <LogOut className="w-4 h-4" />
                  Выйти
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-3xl p-5 shadow-sm">
              <h3 className="text-sm font-semibold mb-4">Моя статистика</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Курсов куплено</span><span className="font-semibold">{mockCourses.length}</span></div>
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Завершено</span><span className="font-semibold">{mockCourses.filter((c) => c.progress === 100).length}</span></div>
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Заказов</span><span className="font-semibold">{mockOrders.length}</span></div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            {activeTab === "profile" && (
              <div className="bg-card rounded-3xl p-8 shadow-sm">
                <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: "var(--font-heading)" }}>Редактировать профиль</h2>
                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <FormField label="Имя и фамилия" icon={<User className="w-4 h-4" />}><input value={profileForm.name} onChange={(e) => setProfileForm((p) => ({ ...p, name: e.target.value }))} placeholder="Ваше имя" className={fieldInput} /></FormField>
                    <FormField label="Email" icon={<Mail className="w-4 h-4" />}><input value={user.email} disabled className={`${fieldInput} opacity-60 cursor-not-allowed`} /></FormField>
                    <FormField label="Телефон" icon={<Phone className="w-4 h-4" />} className="sm:col-span-2"><input value={profileForm.phone} onChange={(e) => setProfileForm((p) => ({ ...p, phone: e.target.value }))} placeholder="+7 (900) 000-00-00" className={fieldInput} /></FormField>
                  </div>
                  <FormField label="О себе" icon={<FileText className="w-4 h-4" />}><textarea value={profileForm.bio} onChange={(e) => setProfileForm((p) => ({ ...p, bio: e.target.value }))} placeholder="Расскажите немного о себе и своих творческих интересах..." rows={4} className="w-full px-4 py-3 bg-background border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-sm resize-none" /></FormField>
                  <div className="flex items-center gap-4 pt-2">
                    <button onClick={handleSaveProfile} disabled={saving} className="flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all hover:scale-105 disabled:opacity-70 disabled:hover:scale-100 shadow-lg">
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      {saving ? "Сохраняем..." : "Сохранить изменения"}
                    </button>
                    {saveSuccess && <div className="flex items-center gap-2 text-secondary text-sm"><CheckCircle2 className="w-4 h-4" />Профиль обновлён!</div>}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "courses" && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>Мои курсы</h2>
                {mockCourses.map((course) => {
                  const courseData = courses.find((c) => c.id === course.id);
                  if (!courseData) return null;
                  return (
                    <div key={course.id} className="bg-card rounded-3xl p-6 shadow-sm hover:shadow-lg transition-shadow">
                      <div className="flex gap-4 items-start">
                        <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0"><ImageWithFallback src={courseData.image} alt={courseData.title} className="w-full h-full object-cover" /></div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs text-primary mb-1">{courseData.category}</div>
                          <h3 className="font-semibold mb-3">{courseData.title}</h3>
                          <div className="flex items-center gap-3 mb-2"><div className="flex-1 bg-muted rounded-full h-2"><div className="h-2 rounded-full bg-gradient-to-r from-primary to-secondary transition-all" style={{ width: `${course.progress}%` }} /></div><span className="text-sm font-medium whitespace-nowrap">{course.progress}%</span></div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">{course.completed} из {courseData.lessons} уроков</span>
                            {course.progress === 100 ? <span className="flex items-center gap-1 text-xs text-secondary font-medium"><Star className="w-3 h-3 fill-current" /> Завершён</span> : <Link to={`/catalog/${course.id}`} className="text-xs text-primary hover:underline font-medium">Продолжить →</Link>}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div className="text-center pt-4"><Link to="/catalog" className="inline-flex items-center gap-2 px-6 py-3 border-2 border-dashed border-border rounded-full text-muted-foreground hover:border-primary hover:text-primary transition-all"><BookOpen className="w-4 h-4" />Найти новые курсы</Link></div>
              </div>
            )}

            {activeTab === "orders" && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>История заказов</h2>
                {mockOrders.map((order) => {
                  const meta = statusMeta[order.status];
                  return (
                    <div key={order.id} className="bg-card rounded-3xl p-6 shadow-sm hover:shadow-lg transition-shadow">
                      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1"><Package className="w-4 h-4 text-muted-foreground" /><span className="font-semibold">{order.id}</span><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${meta.color}`}>{meta.label}</span></div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground"><Clock className="w-3 h-3" />{order.date}</div>
                        </div>
                        <div className="text-xl font-bold text-primary">{order.total.toLocaleString("ru-RU")} ₽</div>
                      </div>
                      <div className="flex flex-wrap gap-2">{order.items.map((item, i) => <span key={i} className="text-xs bg-muted text-muted-foreground px-3 py-1 rounded-full">{item}</span>)}</div>
                    </div>
                  );
                })}
                <div className="text-center pt-4"><Link to="/shop" className="inline-flex items-center gap-2 px-6 py-3 border-2 border-dashed border-border rounded-full text-muted-foreground hover:border-primary hover:text-primary transition-all"><ShoppingBag className="w-4 h-4" />Перейти в магазин</Link></div>
              </div>
            )}

            {activeTab === "settings" && (
              <div className="space-y-6">
                <div className="bg-card rounded-3xl p-8 shadow-sm">
                  <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: "var(--font-heading)" }}>Изменить пароль</h2>
                  <div className="space-y-4">
                    {["current", "next", "confirm"].map((field) => (
                      <FormField key={field} label={field === "current" ? "Текущий пароль" : field === "next" ? "Новый пароль" : "Повторите новый пароль"} icon={<Lock className="w-4 h-4" />}>
                        <div className="relative">
                          <input type={showPw[field] ? "text" : "password"} value={pwForm[field]} onChange={(e) => { setPwForm((p) => ({ ...p, [field]: e.target.value })); setPwError(""); }} placeholder="••••••••" className={`${fieldInput} pr-12`} />
                          <button type="button" onClick={() => setShowPw((s) => ({ ...s, [field]: !s[field] }))} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">{showPw[field] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
                        </div>
                      </FormField>
                    ))}
                    {pwError && <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 rounded-xl px-4 py-3"><AlertCircle className="w-4 h-4 flex-shrink-0" />{pwError}</div>}
                    {pwSuccess && <div className="flex items-center gap-2 text-secondary text-sm bg-secondary/10 rounded-xl px-4 py-3"><CheckCircle2 className="w-4 h-4 flex-shrink-0" />Пароль успешно изменён!</div>}
                    <button onClick={handleChangePassword} disabled={pwLoading} className="flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all hover:scale-105 disabled:opacity-70 disabled:hover:scale-100 shadow-lg">
                      {pwLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                      {pwLoading ? "Сохраняем..." : "Изменить пароль"}
                    </button>
                  </div>
                </div>
                <div className="bg-card rounded-3xl p-8 shadow-sm">
                  <h2 className="text-xl font-bold mb-5" style={{ fontFamily: "var(--font-heading)" }}><span className="flex items-center gap-2"><Bell className="w-5 h-5" /> Уведомления</span></h2>
                  <div className="space-y-4">
                    {[{ label: "Новые курсы и мастер-классы", desc: "Получать уведомления об обновлениях каталога" }, { label: "Акции и скидки", desc: "Узнавать о специальных предложениях в магазине" }, { label: "Статус заказов", desc: "Уведомления об изменении статуса заказов" }].map((item, i) => (
                      <div key={i} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                        <div><div className="font-medium text-sm">{item.label}</div><div className="text-xs text-muted-foreground">{item.desc}</div></div>
                        <ToggleSwitch defaultChecked={i < 2} />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-destructive/5 border border-destructive/20 rounded-3xl p-8">
                  <h2 className="text-xl font-bold mb-2 text-destructive">Опасная зона</h2>
                  <p className="text-sm text-muted-foreground mb-5">Эти действия необратимы. Пожалуйста, будьте осторожны.</p>
                  <button onClick={handleLogout} className="flex items-center gap-2 px-6 py-3 border-2 border-destructive/40 text-destructive rounded-full hover:bg-destructive/10 transition-all text-sm">
                    <LogOut className="w-4 h-4" />
                    Выйти из аккаунта
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const fieldInput = "w-full px-4 py-3 bg-background border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-sm";

function FormField({ label, icon, children, className = "" }) {
  return (
    <div className={className}>
      <label className="flex items-center gap-1.5 text-sm font-medium mb-2 text-muted-foreground">
        {icon}
        {label}
      </label>
      {children}
    </div>
  );
}

function ToggleSwitch({ defaultChecked = false }) {
  const [on, setOn] = useState(defaultChecked);
  return (
    <button onClick={() => setOn((v) => !v)} className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0 ${on ? "bg-primary" : "bg-muted-foreground/30"}`}>
      <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${on ? "left-7" : "left-1"}`} />
    </button>
  );
}

