import { useEffect, useRef } from "react";

/**
 * Стажёр — пассивный доход 500 сом каждые 15 секунд.
 * Активируется, когда в upgrades есть "apprentice".
 */
export function useApprentice(upgrades, moneyMultiplier, setMoney, setTotal) {
  const timerRef = useRef(null);

  useEffect(() => {
    if (!upgrades.includes("apprentice")) return;

    timerRef.current = setInterval(() => {
      const income = Math.round(500 * moneyMultiplier);
      setMoney(p => p + income);
      setTotal(p => p + 1);
    }, 15000);

    return () => clearInterval(timerRef.current);
  }, [upgrades, moneyMultiplier, setMoney, setTotal]);
}
