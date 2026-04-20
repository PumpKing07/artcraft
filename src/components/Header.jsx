import { useState, useRef, useEffect } from "react";
import { Search, ShoppingCart, Palette, User, LogOut, BookOpen, ShoppingBag, ChevronDown } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/cart-context.jsx";
import { useAuth } from "../context/auth-context.jsx";

export function Header() {
  const location = useLocation();
  const { cartItemCount } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropRef = useRef(null);

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setDropdownOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate("/");
  };

  const initials = user?.name ? user.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase() : "";

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center transform group-hover:rotate-12 transition-transform">
              <Palette className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>
              ArtCraft
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {[
              { to: "/", label: "Главная" },
              { to: "/catalog", label: "Каталог" },
              { to: "/schedule", label: "Расписание" },
              { to: "/shop", label: "Магазин" },
              { to: "/about", label: "О школе" },
              { to: "/blog", label: "Блог" },
              { to: "/contacts", label: "Контакты" },
            ].map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`transition-colors text-sm ${isActive(to) ? "text-primary font-medium" : "text-foreground hover:text-primary"}`}
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-muted rounded-full transition-colors" />

            <Link to="/cart" className="p-2 hover:bg-muted rounded-full transition-colors relative">
              <ShoppingCart className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center font-medium">
                  {cartItemCount > 9 ? "9+" : cartItemCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="relative" ref={dropRef}>
                <button
                  onClick={() => setDropdownOpen((o) => !o)}
                  className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full hover:bg-muted transition-all"
                >
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover ring-2 ring-primary/30" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                      <span className="text-white text-xs font-bold">{initials}</span>
                    </div>
                  )}
                  <span className="hidden sm:block text-sm font-medium max-w-[100px] truncate">{user.name.split(" ")[0]}</span>
                  <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-card border border-border rounded-2xl shadow-xl overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-border">
                      <div className="font-semibold text-sm truncate">{user.name}</div>
                      <div className="text-xs text-muted-foreground truncate">{user.email}</div>
                    </div>
                    <div className="p-2">
                      <DropLink to="/account" icon={<User className="w-4 h-4" />} label="Личный кабинет" onClick={() => setDropdownOpen(false)} />
                      <DropLink to="/account" icon={<BookOpen className="w-4 h-4" />} label="Мои курсы" onClick={() => setDropdownOpen(false)} />
                      <DropLink to="/account" icon={<ShoppingBag className="w-4 h-4" />} label="История заказов" onClick={() => setDropdownOpen(false)} />
                    </div>
                    <div className="p-2 border-t border-border">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-destructive hover:bg-destructive/10 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Выйти
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login">
                <button className="flex items-center gap-2 px-5 py-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors text-sm">
                  <User className="w-4 h-4" />
                  Войти
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

function DropLink({ to, icon, label, onClick }) {
  return (
    <Link to={to} onClick={onClick} className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm hover:bg-muted transition-colors">
      <span className="text-muted-foreground">{icon}</span>
      {label}
    </Link>
  );
}

