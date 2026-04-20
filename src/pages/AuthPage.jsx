import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, Eye, EyeOff, Palette, ArrowLeft, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { useAuth } from "../context/auth-context.jsx";

export function AuthPage() {
  const navigate = useNavigate();
  const { login, register, resetPassword } = useAuth();
  const [mode, setMode] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", password: "", terms: false });
  const [forgotEmail, setForgotEmail] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    setError("");
  };

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setError("");
    setForm({ name: "", email: "", password: "", terms: false });
    setForgotEmail("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (mode === "login") {
      if (!form.email || !form.password) return setError("Заполните все поля");
      setLoading(true);
      const res = await login(form.email, form.password);
      setLoading(false);
      return res.success ? navigate("/account") : setError(res.error || "Ошибка входа");
    }
    if (!form.name || !form.email || !form.password) return setError("Заполните все поля");
    if (form.password.length < 6) return setError("Пароль должен быть не менее 6 символов");
    if (!form.terms) return setError("Необходимо принять условия использования");
    setLoading(true);
    const res = await register(form.name, form.email, form.password);
    setLoading(false);
    res.success ? navigate("/account") : setError(res.error || "Ошибка регистрации");
  };

  const handleForgot = async (e) => {
    e.preventDefault();
    setError("");
    if (!forgotEmail) return setError("Введите email");
    setLoading(true);
    const res = await resetPassword(forgotEmail);
    setLoading(false);
    res.success ? setMode("forgot-success") : setError(res.error || "Пользователь не найден");
  };

  const inputCls = "w-full pl-12 pr-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all text-sm";

  if (mode === "forgot-success") {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-6">
        <button onClick={() => navigate(-1)} className="fixed top-6 left-6 w-12 h-12 bg-card border border-border rounded-full flex items-center justify-center hover:bg-muted transition-all hover:scale-110 shadow-lg z-10">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="w-full max-w-md text-center">
          <div className="bg-card rounded-3xl p-10 shadow-xl">
            <div className="w-20 h-20 bg-secondary/15 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-secondary" />
            </div>
            <h2 className="text-2xl font-bold mb-3" style={{ fontFamily: "var(--font-heading)" }}>Письмо отправлено!</h2>
            <p className="text-muted-foreground mb-2">Мы отправили инструкции по восстановлению пароля на адрес:</p>
            <p className="font-semibold text-primary mb-8">{forgotEmail}</p>
            <p className="text-sm text-muted-foreground mb-8">Если письмо не пришло в течение нескольких минут, проверьте папку «Спам».</p>
            <button onClick={() => switchMode("login")} className="w-full bg-primary text-primary-foreground py-3 rounded-full hover:bg-primary/90 transition-all">Вернуться ко входу</button>
          </div>
        </div>
      </div>
    );
  }

  if (mode === "forgot") {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-6">
        <button onClick={() => switchMode("login")} className="fixed top-6 left-6 w-12 h-12 bg-card border border-border rounded-full flex items-center justify-center hover:bg-muted transition-all hover:scale-110 shadow-lg z-10">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="w-full max-w-md">
          <div className="bg-card rounded-3xl p-8 lg:p-10 shadow-xl">
            <Link to="/" className="flex items-center gap-2 mb-8 justify-center">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                <Palette className="w-7 h-7 text-white" />
              </div>
              <span className="text-3xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>ArtCraft</span>
            </Link>
            <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: "var(--font-heading)" }}>Восстановление пароля</h1>
            <p className="text-muted-foreground text-sm mb-8">Введите email, указанный при регистрации, и мы вышлем инструкции по сбросу пароля.</p>
            <form onSubmit={handleForgot} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input type="email" value={forgotEmail} onChange={(e) => { setForgotEmail(e.target.value); setError(""); }} placeholder="your@email.com" className={inputCls} required />
                </div>
              </div>
              {error && <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 rounded-xl px-4 py-3"><AlertCircle className="w-4 h-4 flex-shrink-0" />{error}</div>}
              <button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground py-4 rounded-full hover:bg-primary/90 transition-all hover:scale-[1.02] shadow-lg mt-2 flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:scale-100">
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading ? "Отправляем..." : "Отправить инструкции"}
              </button>
            </form>
            <div className="text-center mt-6">
              <button onClick={() => switchMode("login")} className="text-sm text-primary hover:text-primary/80 transition-colors">← Вернуться ко входу</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-6">
      <button onClick={() => navigate(-1)} className="fixed top-6 left-6 w-12 h-12 bg-card border border-border rounded-full flex items-center justify-center hover:bg-muted transition-all hover:scale-110 shadow-lg z-10">
        <ArrowLeft className="w-5 h-5" />
      </button>
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="order-2 lg:order-1">
          <div className="bg-card rounded-3xl p-8 lg:p-12 shadow-xl">
            <Link to="/" className="flex items-center gap-2 mb-8 justify-center lg:justify-start">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center"><Palette className="w-7 h-7 text-white" /></div>
              <span className="text-3xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>ArtCraft</span>
            </Link>
            <div className="flex gap-2 mb-8 bg-muted rounded-2xl p-1">
              <button onClick={() => switchMode("login")} className={`flex-1 py-3 rounded-xl transition-all text-sm font-medium ${mode === "login" ? "bg-primary text-primary-foreground shadow-lg" : "text-muted-foreground hover:text-foreground"}`}>Вход</button>
              <button onClick={() => switchMode("register")} className={`flex-1 py-3 rounded-xl transition-all text-sm font-medium ${mode === "register" ? "bg-primary text-primary-foreground shadow-lg" : "text-muted-foreground hover:text-foreground"}`}>Регистрация</button>
            </div>
            <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: "var(--font-heading)" }}>{mode === "login" ? "С возвращением!" : "Создайте аккаунт"}</h1>
            <p className="text-muted-foreground mb-8 text-sm">{mode === "login" ? "Войдите, чтобы продолжить обучение" : "Начните свой путь творческого развития"}</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "register" && <div><label className="block text-sm font-medium mb-2">Имя</label><div className="relative"><User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" /><input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Ваше имя" className={inputCls} /></div></div>}
              <div><label className="block text-sm font-medium mb-2">Email</label><div className="relative"><Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" /><input type="email" name="email" value={form.email} onChange={handleChange} placeholder="your@email.com" className={inputCls} /></div></div>
              <div>
                <label className="block text-sm font-medium mb-2">Пароль</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input type={showPassword ? "text" : "password"} name="password" value={form.password} onChange={handleChange} placeholder="••••••••" className={`${inputCls} pr-12`} />
                  <button type="button" onClick={() => setShowPassword((s) => !s)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">{showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button>
                </div>
              </div>
              {mode === "login" && <div className="text-right"><button type="button" onClick={() => switchMode("forgot")} className="text-sm text-primary hover:text-primary/80 transition-colors">Забыли пароль?</button></div>}
              {mode === "register" && <div className="flex items-start gap-2 pt-1"><input type="checkbox" id="terms" name="terms" checked={form.terms} onChange={handleChange} className="mt-1 rounded accent-primary" /><label htmlFor="terms" className="text-sm text-muted-foreground cursor-pointer">Я принимаю <span className="text-primary hover:text-primary/80">условия использования</span> и <span className="text-primary hover:text-primary/80">политику конфиденциальности</span></label></div>}
              {error && <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 rounded-xl px-4 py-3"><AlertCircle className="w-4 h-4 flex-shrink-0" />{error}</div>}
              <button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground py-4 rounded-full hover:bg-primary/90 transition-all hover:scale-[1.02] shadow-lg mt-2 flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:scale-100">{loading && <Loader2 className="w-4 h-4 animate-spin" />}{loading ? "Подождите..." : mode === "login" ? "Войти" : "Зарегистрироваться"}</button>
            </form>
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 border-t border-border" />
              <span className="text-sm text-muted-foreground">или</span>
              <div className="flex-1 border-t border-border" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button className="py-3 px-4 border border-border rounded-xl hover:bg-muted transition-colors flex items-center justify-center gap-2 text-sm">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Google
              </button>
              <button className="py-3 px-4 border border-border rounded-xl hover:bg-muted transition-colors flex items-center justify-center gap-2 text-sm">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M13.545 2.907a13.227 13.227 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.19 12.19 0 0 0-3.658 0 8.258 8.258 0 0 0-.412-.833.051.051 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.041.041 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032c.001.014.01.028.021.037a13.276 13.276 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019c.308-.42.582-.863.818-1.329a.05.05 0 0 0-.01-.059.051.051 0 0 0-.018-.011 8.875 8.875 0 0 1-1.248-.595.05.05 0 0 1-.02-.066.051.051 0 0 1 .015-.019c.084-.063.168-.129.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.052.052 0 0 1 .053.007c.08.066.164.132.248.195a.051.051 0 0 1-.004.085 8.254 8.254 0 0 1-1.249.594.05.05 0 0 0-.03.03.052.052 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.235 13.235 0 0 0 4.001-2.02.049.049 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.034.034 0 0 0-.02-.019Zm-8.198 7.307c-.789 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612Zm5.316 0c-.788 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612Z" /></svg>
                Discord
              </button>
            </div>
          </div>
        </div>
        <div className="order-1 lg:order-2">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl blur-3xl" />
            <div className="relative bg-gradient-to-br from-primary to-secondary rounded-3xl p-12 text-white">
              <h2 className="text-4xl font-bold mb-6" style={{ fontFamily: "var(--font-heading)" }}>Добро пожаловать в ArtCraft</h2>
              <p className="text-white/90 text-lg mb-8 leading-relaxed">Присоединяйтесь к тысячам творческих людей, которые уже развивают свои навыки с нашими курсами</p>
              <div className="space-y-6">
                {[{ title: "100+ курсов", desc: "Рисование, дизайн, фотография и многое другое" }, { title: "Пожизненный доступ", desc: "Учитесь в своём темпе, когда вам удобно" }, { title: "Сертификаты", desc: "Получите официальный документ о прохождении" }].map((item) => (
                  <div key={item.title} className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0"><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg></div>
                    <div><h3 className="font-semibold text-lg mb-1">{item.title}</h3><p className="text-white/80">{item.desc}</p></div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-4 mt-12 pt-8 border-t border-white/20">
                {[["12K+", "Студентов"], ["100+", "Курсов"], ["4.9", "Рейтинг"]].map(([n, l]) => (
                  <div key={l} className="text-center">
                    <div className="text-3xl font-bold mb-1">{n}</div>
                    <div className="text-sm text-white/80">{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

