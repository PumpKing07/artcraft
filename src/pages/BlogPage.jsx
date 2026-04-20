import { ArrowRight, ChevronRight, Clock, User } from "lucide-react";
import { Link } from "react-router-dom";
import { blogCategories, blogPosts } from "../data/blog-posts.js";

export function BlogPage() {
  const featured = blogPosts[0];
  const rest = blogPosts.slice(1);

  return (
    <main className="min-h-screen">
      <div className="bg-muted/30 px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center gap-2 text-sm">
          <Link to="/" className="text-muted-foreground hover:text-primary">Главная</Link>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">Блог</span>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-6 py-12">
        <h1 className="font-heading mb-4 text-5xl font-bold">Блог ArtCraft</h1>
        <p className="mb-8 text-lg text-muted-foreground">Истории успеха, советы экспертов и вдохновение для творчества</p>

        <div className="mb-10 flex flex-wrap gap-2">
          {blogCategories.map((cat) => (
            <span key={cat} className="rounded-full border border-border bg-card px-4 py-2 text-sm">{cat}</span>
          ))}
        </div>

        <article className="mb-12 grid overflow-hidden rounded-3xl bg-gradient-to-br from-primary/5 to-secondary/5 shadow-xl lg:grid-cols-2">
          <img src={featured.image} alt={featured.title} className="h-full min-h-72 w-full object-cover" />
          <div className="p-8">
            <div className="mb-2 text-sm text-primary">{featured.category}</div>
            <h2 className="mb-4 text-3xl font-bold">{featured.title}</h2>
            <p className="mb-4 text-muted-foreground">{featured.content}</p>
            <div className="mb-6 flex gap-4 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1"><User className="h-4 w-4" />{featured.author}</span>
              <span className="inline-flex items-center gap-1"><Clock className="h-4 w-4" />{featured.readTime}</span>
            </div>
            <button className="inline-flex items-center gap-2 text-primary">
              Читать далее <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </article>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((post) => (
            <article key={post.id} className="overflow-hidden rounded-3xl bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
              <img src={post.image} alt={post.title} className="h-52 w-full object-cover" />
              <div className="p-6">
                <div className="mb-2 text-xs text-primary">{post.category}</div>
                <h3 className="mb-3 text-xl font-bold">{post.title}</h3>
                <p className="mb-4 line-clamp-3 text-sm text-muted-foreground">{post.excerpt}</p>
                <div className="text-xs text-muted-foreground">{post.date} · {post.readTime}</div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}

