import './market.css';

export default function Market({ money, setMoney, ingredients, setIngredients }) {
  const prices = { chicken: 50, vegetables: 30, sauce: 20 };
  const MAX_CAPACITY = 50; // Тот же лимит, что и в ProductsBar

  const buyIngredient = (type) => {
    const price = Number(prices[type]);
    const currentMoney = Number(money);
    const currentAmount = Number(ingredients[type]) || 0;

    // 1. Проверяем, есть ли место на складе
    if (currentAmount >= MAX_CAPACITY) {
      alert(`Склад для ${type} переполнен! Максимум — ${MAX_CAPACITY}`);
      return;
    }

    // 2. Проверяем деньги
    if (currentMoney >= price) {
      setMoney((prev) => Number(prev) - price);
      setIngredients((prev) => ({
        ...prev,
        [type]: (Number(prev[type]) || 0) + 1 
      }));
    } else {
      alert("Недостаточно денег!");
    }
  };

  return (
    <div className="market">
      <h3>Рынок</h3>
      <div className="market-buttons-container">
        {Object.keys(prices).map((type) => {
          const isFull = (ingredients[type] || 0) >= MAX_CAPACITY;
          
          return (
            <button 
              key={type} 
              onClick={() => buyIngredient(type)}
              disabled={isFull}
              className={`market-btn ${isFull ? 'full' : ''}`}
            >
              {isFull ? `Склад ${type} полон` : `Купить ${type} — ${prices[type]} 💰`}
            </button>
          );
        })}
      </div>
    </div>
  );
}