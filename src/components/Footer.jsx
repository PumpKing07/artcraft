import { Facebook, Instagram, Youtube, Mail, Palette } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-20">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary">
                <Palette className="h-6 w-6 text-white" />
              </div>
              <span className="font-heading text-xl font-bold">ArtCraft</span>
            </div>
            <p className="mb-4 text-sm text-muted-foreground">
              Онлайн-платформа творческих мастер-классов и курсов для тех, кто хочет раскрыть свой потенциал.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-muted transition-colors hover:bg-primary hover:text-primary-foreground"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-muted transition-colors hover:bg-primary hover:text-primary-foreground"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-muted transition-colors hover:bg-primary hover:text-primary-foreground"
                aria-label="YouTube"
              >
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="mb-4 font-semibold">Навигация</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/" className="transition-colors hover:text-primary">
                  Главная
                </Link>
              </li>
              <li>
                <Link to="/catalog" className="transition-colors hover:text-primary">
                  Каталог курсов
                </Link>
              </li>
              <li>
                <Link to="/schedule" className="transition-colors hover:text-primary">
                  Расписание
                </Link>
              </li>
              <li>
                <Link to="/shop" className="transition-colors hover:text-primary">
                  Магазин товаров
                </Link>
              </li>
              <li>
                <Link to="/about" className="transition-colors hover:text-primary">
                  О школе
                </Link>
              </li>
              <li>
                <Link to="/blog" className="transition-colors hover:text-primary">
                  Блог
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold">Помощь</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="transition-colors hover:text-primary">
                  Часто задаваемые вопросы
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-primary">
                  Условия использования
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-primary">
                  Политика конфиденциальности
                </a>
              </li>
              <li>
                <Link to="/contacts" className="transition-colors hover:text-primary">
                  Контакты
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold">Подписка на новости</h4>
            <p className="mb-4 text-sm text-muted-foreground">Получайте информацию о новых курсах и акциях</p>
            <form className="flex gap-2" action="#" method="post">
              <label className="sr-only" htmlFor="newsletter-email">
                Email
              </label>
              <input
                id="newsletter-email"
                type="email"
                placeholder="Ваш email"
                className="min-w-0 flex-1 rounded-full border border-border bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="submit"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-colors hover:bg-primary/90"
                aria-label="Подписаться"
              >
                <Mail className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-border pt-6 text-center text-sm text-muted-foreground">
          © 2026 ArtCraft. Все права защищены.
        </div>
      </div>
    </footer>
  );
}

