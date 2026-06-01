import React from "react";
import { useSevenStarsLore } from "./useSevenStarsLore";

export default function SevenStarsConstellation() {
  const { stars } = useSevenStarsLore();

  return (
    <div className="ss-constellation">
      {stars.map((star, i) => (
        <div
          key={star.id}
          className={`ss-star ss-star-${i + 1}`}
          title={`${star.name} – ${star.virtue}`}
        />
      ))}
      <svg className="ss-lines" viewBox="0 0 100 100" preserveAspectRatio="none">
        <polyline
          points="10,80 25,60 40,40 55,30 70,35 80,50 90,70"
          className="ss-line"
        />
      </svg>
    </div>
  );
}
