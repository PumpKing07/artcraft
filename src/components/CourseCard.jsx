import { Star, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { ImageWithFallback } from "./figma/ImageWithFallback.jsx";

export function CourseCard({
  id,
  title,
  instructor,
  image,
  duration,
  price,
  rating,
  showEnroll = false,
}) {
  return (
    <div className="group bg-card rounded-[20px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <Link to={`/catalog/${id}`} className="block">
        <div className="relative overflow-hidden aspect-[4/3]">
          <ImageWithFallback
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="text-sm font-medium">{rating}</span>
          </div>
        </div>
      </Link>

      <div className="p-5">
        <Link to={`/catalog/${id}`}>
          <h3 className="text-xl font-medium mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
        </Link>
        <p className="text-muted-foreground text-sm mb-3">{instructor}</p>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1 text-muted-foreground text-sm">
            <Clock className="w-4 h-4" />
            <span>{duration}</span>
          </div>
          <span className="text-2xl font-semibold text-primary">{price.toLocaleString("ru-RU")} ₽</span>
        </div>

        {showEnroll ? (
          <Link to={`/catalog/${id}/register`} onClick={(e) => e.stopPropagation()}>
            <button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded-full transition-all duration-200 hover:scale-[1.02]">
              Записаться
            </button>
          </Link>
        ) : (
          <Link to={`/catalog/${id}`}>
            <button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded-full transition-all duration-200 hover:scale-[1.02]">
              Подробнее
            </button>
          </Link>
        )}
      </div>
    </div>
  );
}

