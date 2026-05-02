export default function ProductsBar({ ingredients }) {
  return (
    <div className="products-bar">
      {Object.entries(ingredients).map(([type, amount]) => (
        <div key={type}>
          <p>{type}: {amount}</p>
          <progress value={amount} max="10"></progress>
        </div>
      ))}
    </div>
  );
}