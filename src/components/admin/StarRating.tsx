"use client";

import { Star } from "lucide-react";

interface StarRatingProps {
  value: number;
  onChange?: (v: number) => void;
  size?: number;
  readOnly?: boolean;
}

export function StarRating({ value, onChange, size = 18, readOnly }: StarRatingProps) {
  return (
    <div className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = n <= value;
        return (
          <button
            key={n}
            type="button"
            disabled={readOnly}
            onClick={() => onChange?.(n)}
            className="transition-transform hover:scale-110 disabled:cursor-default disabled:hover:scale-100"
            aria-label={`${n} etoile${n > 1 ? "s" : ""}`}
            style={{
              color: filled ? "var(--color-copper)" : "var(--text-muted)",
              opacity: filled ? 1 : 0.3,
            }}
          >
            <Star width={size} height={size} fill={filled ? "currentColor" : "none"} />
          </button>
        );
      })}
    </div>
  );
}
