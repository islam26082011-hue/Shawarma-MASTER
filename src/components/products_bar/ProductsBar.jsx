export default function ProductsBar({ ingredients = {} }) {
  // Выносим список нужных ингредиентов, чтобы порядок всегда был одинаковым
  const ingredientTypes = ['chicken', 'vegetables', 'sauce'];

  return (
    <div
      className="products-bar"
      style={{ 
        padding: "15px", 
        background: "rgba(240, 240, 240, 0.1)", // Сделаем чуть прозрачнее для стиля
        borderRadius: "12px",
        border: "1px solid #bc13fe" // Тот самый фиолетовый из Game.jsx
      }}
    >
      <h3 style={{ color: "#bc13fe", marginTop: 0 }}>Склад ингредиентов</h3>
      
      {ingredientTypes.map((type) => {
        // Гарантируем, что значение всегда число, даже если данных в Firebase еще нет
        const amount = Number(ingredients?.[type]) || 0;

        return (
          <div key={type} style={{ marginBottom: "15px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
              <span style={{ fontWeight: "bold", textTransform: "capitalize", color: "black" }}>{type}</span>
              <span style={{ color: amount === 0 ? "red" : "black" }}>
                {amount} / 50
              </span>
            </div>
            
            <progress 
              value={amount} 
              max={50} 
              style={{ width: "100%", height: "10px"}}
            />
          </div>
        );
      })}
    </div>
  );
}