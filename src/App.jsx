import { useState } from "react";
import Button from "./components/button/button.jsx";
import Market from "./components/market/marlet.jsx";
import MoneyCounter from "./components/money_counter/MoneyCounter.jsx";
import ShawarmaCounter from "./components/shawarma_counter/ShawarmaCounter.jsx";
import Window from "./components/window/window.jsx";
import ProductsBar from "./components/products_bar/ProductsBar.jsx";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <MoneyCounter />
      <ShawarmaCounter count={count} />
      <Button setCount={setCount} count={count} />
      <Market />
      <Window />
      <ProductsBar />
    </>
  );
}

export default App;
