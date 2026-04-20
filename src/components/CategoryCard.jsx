export function CategoryCard({ icon: Icon, title, count, color }) {
  return (
    <div className="group bg-card rounded-[20px] p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer border border-border">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
        style={{ backgroundColor: `${color}20` }}
      >
        <Icon className="w-8 h-8" style={{ color }} />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm">{count} курсов</p>
    </div>
  );
}

