import './ProductsBar.css';

export default function ProductsBar({ ingredients = {} }) {
  // Выносим список нужных ингредиентов, чтобы порядок всегда был одинаковым
  const ingredientTypes = ['chicken', 'vegetables', 'sauce'];

  return (
    <div className="products-bar">
      <h3>Склад ингредиентов</h3>
      
      {ingredientTypes.map((type) => {
        // Гарантируем, что значение всегда число, даже если данных в Firebase еще нет
        const amount = Number(ingredients?.[type]) || 0;

        return (
          <div key={type} className="ingredient-item">
            <div className="ingredient-header">
              <span className="ingredient-name">{type}</span>
              <span className={`ingredient-amount ${amount === 0 ? "empty" : ""}`}>
                {amount} / 50
              </span>
            </div>
            
            <progress 
              value={amount} 
              max={50}
            />
          </div>
        );
      })}
    </div>
  );
}