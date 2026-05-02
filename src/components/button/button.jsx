import "./button.css";
export default function Button({
  isCooking,
  setIsCooking,
  cookingTime,
  setCount,
  setTotal,
  ingredients,
  setIngredients,
  activeRecipe, // Получаем рецепт текущего заказа
  style,
}) {
  function handleStartCooking() {
    if (isCooking || !activeRecipe) return;

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
      setCount((prev) => prev + 1);
      setTotal((prev) => prev + 1);
      setIsCooking(false);
    }, cookingTime);
  }

  return (
    <div
      className={`btn-container ${isCooking ? "is-loading" : ""}`}
      style={style}
    >
      {/* Тот самый SVG прогресс-бар вокруг кнопки */}
      <svg className="progress-svg" width="120" height="120">
        <circle
          className="progress-circle"
          cx="60"
          cy="60"
          r="54"
          style={{
            // Передаем время анимации в CSS
            animationDuration: isCooking ? `${cookingTime}ms` : "0s",
          }}
        />
      </svg>

      <button
        className="btn"
        onClick={handleStartCooking}
        disabled={isCooking || !activeRecipe}
      >
        {/* Если заказа нет, кнопка станет неактивной, если есть — покажет эмодзи */}
        {isCooking ? "..." : activeRecipe ? "🌯" : "💤"}
      </button>
    </div>
  );
}
