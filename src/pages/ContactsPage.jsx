export function ContactsPage() {
  return (
    <main className="px-6 py-14">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-heading text-4xl font-bold">Контакты</h1>
        <p className="mt-3 text-muted-foreground">Свяжитесь с нами удобным способом.</p>
        <div className="mt-8 rounded-3xl bg-card p-8 shadow-sm">
          <div className="mb-4">
            <div className="text-sm text-muted-foreground">Email</div>
            <a href="mailto:hello@artcraft.ru" className="text-lg font-semibold text-primary">hello@artcraft.ru</a>
          </div>
          <div className="mb-4">
            <div className="text-sm text-muted-foreground">Телефон</div>
            <a href="tel:+78001234567" className="text-lg font-semibold text-primary">+7 (800) 123-45-67</a>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Адрес</div>
            <div className="text-lg font-semibold">г. Москва, ул. Творческая, д. 1</div>
          </div>
        </div>
      </div>
    </main>
  );
}

