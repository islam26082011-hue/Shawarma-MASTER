import "./button.css";

export default function Button({
  isCooking,
  setIsCooking,
  cookingTime,
  setCount,
  ingredients,
  setIngredients,
  activeRecipe,
  style,
  isSelling,       // true только во время анимации отдачи (700ms)
  currentCustomer, // наличие покупателя
  onShawarmaReady, // колбэк: сообщает хуку что шаурма приготовлена в этой сессии
}) {
  function handleStartCooking() {
    // Блокировка:
    // 1. Если уже готовим
    // 2. Если идёт анимация отдачи
    // 3. Если нет покупателя
    // 4. Если нет рецепта
    if (isCooking || isSelling || !currentCustomer || !activeRecipe) return;

    // Проверяем, хватает ли продуктов
    const canCook = Object.keys(activeRecipe).every(
      (type) => (ingredients[type] || 0) >= activeRecipe[type]
    );

    if (!canCook) {
      alert("Недостаточно ингредиентов для этого рецепта!");
      return;
    }

    setIsCooking(true);

    // Списываем ингредиенты
    setIngredients((prev) => {
      const next = { ...prev };
      Object.keys(activeRecipe).forEach((type) => {
        next[type] = Number((next[type] - activeRecipe[type]).toFixed(1));
      });
      return next;
    });

    setTimeout(() => {
      // Сначала сообщаем хуку что шаурма приготовлена в этой сессии
      onShawarmaReady?.();
      setCount(1);
      setIsCooking(false);
    }, cookingTime);
  }

  // Кнопка заблокирована, если идет готовка, продажа или нет клиента
  const isDisabled = isCooking || isSelling || !currentCustomer;

  return (
    <div
      className={`btn-container ${isCooking ? "is-loading" : ""}`}
      style={style}
    >
      <svg className="progress-svg" width="120" height="120">
        <circle
          className="progress-circle"
          cx="60"
          cy="60"
          r="54"
          style={{
            animationDuration: isCooking ? `${cookingTime}ms` : "0s",
          }}
        />
      </svg>

      <button
        className="btn"
        onClick={handleStartCooking}
        disabled={isDisabled}
      >
        {/* 1. Если жарим — точки */}
        {isCooking
          ? "..."
          : /* 2. Если отдаём (анимация продажи) — галочка */
          isSelling
          ? "✅"
          : /* 3. Если клиент есть и у него есть рецепт — шаурма */
          activeRecipe
          ? "🌯"
          : /* 4. Во всех остальных случаях (ждём) — спим */
            "💤"}
      </button>
    </div>
  );
}
