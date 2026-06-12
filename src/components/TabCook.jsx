import { useEffect, useRef, useState } from "react";
import customerSprite from "../assets/sprites/customer.png";
import ApprenticeBar from "./ApprenticeBar.jsx";
import s from "./TabCook.module.css";

const LABELS = { chicken: "🍗", vegetables: "🥬", sauce: "🧴" };

export default function TabCook({
  isCooking, setIsCooking, cookingTime,
  ingredients, setIngredients,
  currentCustomer, isSelling, markShawarmaReady,
  setCount, upgrades,
  cookingStartedAt, setCookingStartedAt,
}) {
  const circumference = 2 * Math.PI * 54;
  const rafRef = useRef(null);
  const [dashOffset, setDashOffset] = useState(circumference);

  function handleStartCooking() {
    if (isCooking || isSelling || !currentCustomer?.order?.recipe) return;
    const recipe = currentCustomer.order.recipe;
    const canCook = Object.keys(recipe).every(t => (ingredients[t] || 0) >= recipe[t]);
    if (!canCook) return;

    const now = Date.now();
    setCookingStartedAt(now);
    setIsCooking(true);
    setIngredients(prev => {
      const next = { ...prev };
      Object.keys(recipe).forEach(t => {
        next[t] = Number((next[t] - recipe[t]).toFixed(1));
      });
      return next;
    });
    setTimeout(() => {
      markShawarmaReady?.();
      setCount(1);
      setIsCooking(false);
      setCookingStartedAt(null);
    }, cookingTime);
  }

  // Прогресс через RAF — считаем от реального времени начала готовки
  useEffect(() => {
    if (!isCooking || !cookingStartedAt) {
      cancelAnimationFrame(rafRef.current);
      setDashOffset(circumference);
      return;
    }

    const tick = () => {
      const elapsed = Date.now() - cookingStartedAt;
      const progress = Math.min(elapsed / cookingTime, 1);
      setDashOffset(circumference * (1 - progress));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isCooking, cookingStartedAt, cookingTime, circumference]);

  const recipe = currentCustomer?.order?.recipe;
  const hasRecipe = !!recipe;
  const canCook = recipe
    ? Object.keys(recipe).every(t => (ingredients[t] || 0) >= recipe[t])
    : false;
  const isDisabled = isCooking || isSelling || !currentCustomer;
  const hasApprentice = upgrades?.includes("apprentice");

  return (
    <div className={s.tab}>
      {/* Клиент */}
      <div className={s.customerZone}>
        {currentCustomer ? (
          <div className={s.customerCard}>
            <img src={customerSprite} alt="покупатель" className={s.sprite} />
            <div className={s.customerInfo}>
              <p className={s.phrase}>"{currentCustomer.phrase}"</p>
              <div className={s.orderBadge}>
                <span className={s.orderName}>{currentCustomer.order.name}</span>
                <span className={s.orderPrice}>{currentCustomer.order.price} с</span>
              </div>
            </div>
          </div>
        ) : (
          <div className={s.noCustomer}>
            <span style={{ fontSize: 36 }}>⏳</span>
            <p>Ждём клиента...</p>
          </div>
        )}
      </div>

      {/* Кнопка готовки */}
      <div className={s.cookZone}>
        <div
          className={`${s.cookWrap} ${isCooking ? s.cooking : ""}`}
          style={{ "--cooking-time": `${cookingTime}ms` }}
          onClick={handleStartCooking}
        >
          <svg className={s.cookSvg} viewBox="0 0 120 120">
            <circle className={s.progressBg} cx="60" cy="60" r="54" />
            <circle
              className={s.progressFill}
              cx="60" cy="60" r="54"
              style={{
                strokeDasharray: circumference,
                strokeDashoffset: dashOffset,
              }}
            />
          </svg>
          <div className={`${s.cookInner} ${isDisabled && !isCooking ? s.disabled : ""}`}>
            {isCooking             ? <span className={`${s.emoji} ${s.spin}`}>⚙️</span>
            : isSelling            ? <span className={s.emoji}>✅</span>
            : hasRecipe && canCook  ? <span className={s.emoji}>🌯</span>
            : hasRecipe && !canCook ? <span className={s.emoji}>📦</span>
            :                        <span className={s.emoji}>💤</span>}
          </div>
        </div>
        <p className={s.hint}>
          {isCooking         ? "Готовим..."
          : isSelling        ? "Подаём клиенту"
          : !currentCustomer ? "Нет клиента"
          : !canCook         ? "Мало ингредиентов"
          :                    "Нажми чтобы приготовить"}
        </p>
      </div>

      {/* Ингредиенты */}
      <div className={s.ingredients}>
        {["chicken", "vegetables", "sauce"].map(type => {
          const amount = Number(ingredients?.[type]) || 0;
          const needed = recipe?.[type] || 0;
          const hasEnough = amount >= needed;
          return (
            <div key={type} className={`${s.chip} ${needed > 0 && !hasEnough ? s.short : ""}`}>
              <span>{LABELS[type]}</span>
              <span className={s.chipAmount}>{amount}</span>
              {needed > 0 && <span className={s.chipNeeded}>/{needed}</span>}
            </div>
          );
        })}
      </div>

      {hasApprentice && <ApprenticeBar />}
    </div>
  );
}