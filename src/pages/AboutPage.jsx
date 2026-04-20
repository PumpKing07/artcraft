import { Award, ChevronRight, Heart, Target, Users } from "lucide-react";
import { Link } from "react-router-dom";

export function AboutPage() {
  const values = [
    { icon: Heart, title: "Страсть к творчеству", description: "Каждый человек обладает творческим потенциалом." },
    { icon: Award, title: "Качество образования", description: "Курсы создают практикующие специалисты." },
    { icon: Users, title: "Сообщество", description: "Поддерживающее окружение и обмен опытом." },
    { icon: Target, title: "Индивидуальный подход", description: "Персональная обратная связь по работам." },
  ];

  return (
    <main className="min-h-screen">
      <div className="bg-muted/30 px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center gap-2 text-sm">
          <Link to="/" className="text-muted-foreground hover:text-primary">Главная</Link>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">О школе</span>
        </div>
      </div>

      <section className="bg-gradient-to-br from-primary/5 to-secondary/5 px-6 py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          <div>
            <h1 className="font-heading mb-6 text-5xl font-bold">О школе ArtCraft</h1>
            <p className="mb-4 text-xl text-muted-foreground">
              Мы создали платформу, где каждый может раскрыть творческий потенциал.
            </p>
            <p className="text-lg text-muted-foreground">
              С 2020 года помогли более <span className="font-bold text-primary">12,000 студентам</span>.
            </p>
          </div>
          <img
            src="/images/about/studio.jpg"
            alt="Наша студия"
            className="h-96 w-full rounded-3xl object-cover shadow-2xl"
          />
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-heading mb-12 text-center text-4xl font-bold">Наши ценности</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <article key={value.title} className="rounded-3xl bg-card p-8 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary">
                  <value.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="mb-3 text-xl font-bold">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

