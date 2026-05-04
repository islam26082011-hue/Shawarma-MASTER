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
    <div className="market" style={{ 
      marginTop: '20px', 
      border: '1px solid #bc13fe', 
      padding: '15px',
      borderRadius: '12px',
      background: 'rgba(188, 19, 254, 0.05)' 
    }}>
      <h3 style={{ color: '#bc13fe', marginTop: 0 }}>Рынок</h3>
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        {Object.keys(prices).map((type) => {
          const isFull = (ingredients[type] || 0) >= MAX_CAPACITY;
          
          return (
            <button 
              key={type} 
              onClick={() => buyIngredient(type)}
              disabled={isFull} // Кнопка выключается, если склад полон
              className={`market-btn ${isFull ? 'full' : ''}`}
              style={{
                padding: '8px 12px',
                cursor: isFull ? 'not-allowed' : 'pointer',
                opacity: isFull ? 0.5 : 1,
                border: '1px solid #bc13fe',
                borderRadius: '8px',
                background: isFull ? '#ccc' : 'transparent',
                color: isFull ? '#666' : 'black'
              }}
            >
              {isFull ? `Склад ${type} полон` : `Купить ${type} — ${prices[type]} 💰`}
            </button>
          );
        })}
      </div>
    </div>
  );
}