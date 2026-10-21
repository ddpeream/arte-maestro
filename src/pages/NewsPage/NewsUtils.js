import { useEffect, useState } from "react";

function starPoints(points = 14, inner = 38, outer = 50) {
  const result = [];

  for (let index = 0; index < points * 2; index += 1) {
    const angle = (Math.PI * index) / points - Math.PI / 2;

    const radius = index % 2 ? inner : outer;

    result.push(
      `${(50 + Math.cos(angle) * radius).toFixed(1)}% ${(
        50 +
        Math.sin(angle) * radius
      ).toFixed(1)}%`,
    );
  }

  return result.join(",");
}

function zigPoints(points = 20) {
  const top = [];
  const bottom = [];

  for (let index = 0; index <= points; index += 1) {
    const x = `${((index / points) * 100).toFixed(2)}%`;

    top.push(`${x} ${index % 2 ? "8px" : "0"}`);

    bottom.push(`${x} ${index % 2 ? "calc(100% - 8px)" : "100%"}`);
  }

  return top.concat(bottom.reverse()).join(",");
}

export const STAR_POINTS = starPoints();
export const RECEIPT_ZIG = zigPoints();

function pad(value) {
  return String(value).padStart(2, "0");
}

export function useCountdown(targetDate) {
  const [remaining, setRemaining] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  useEffect(() => {
    const target = new Date(targetDate).getTime();

    const updateCountdown = () => {
      const difference = Math.max(0, target - Date.now());

      setRemaining({
        days: pad(Math.floor(difference / 86400000)),
        hours: pad(Math.floor((difference % 86400000) / 3600000)),
        minutes: pad(Math.floor((difference % 3600000) / 60000)),
        seconds: pad(Math.floor((difference % 60000) / 1000)),
      });
    };

    updateCountdown();

    const interval = window.setInterval(updateCountdown, 1000);

    return () => {
      window.clearInterval(interval);
    };
  }, [targetDate]);

  return remaining;
}
