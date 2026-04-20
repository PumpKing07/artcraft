import { useState } from "react";

export function ImageWithFallback({ src, alt, className }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className={`flex items-center justify-center bg-muted ${className || ""}`}>
        <span className="text-xs text-muted-foreground">Image unavailable</span>
      </div>
    );
  }

  return <img src={src} alt={alt} className={className} onError={() => setFailed(true)} loading="lazy" />;
}

