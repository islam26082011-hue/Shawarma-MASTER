export default function Market({ money, setMoney, ingredients, setIngredients }) {
  const prices = { chicken: 50, vegetables: 30, sauce: 20 };

  const buyIngredient = (type) => {
    if (money >= prices[type]) {
      setMoney((prev) => prev - prices[type]);
      setIngredients((prev) => ({ ...prev, [type]: prev[type] + 1 }));
    } else {
      alert("Недостаточно денег!");
    }
  };

  return (
    <div className="market">
      <h3>Рынок</h3>
      {Object.keys(prices).map((type) => (
        <button key={type} onClick={() => buyIngredient(type)}>
          Купить {type} - {prices[type]} 💰
        </button>
      ))}
    </div>
  );
}export default function Market() {
  return (
    <button>Открыть рынок</button>
  );
}
