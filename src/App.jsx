import { useState } from "react";
import { useCustomerFlow } from "./hooks/useCustomerFlow"; // Импортируем нашу логику

import Market from "./components/market/market.jsx";
import Button from "./components/button/button.jsx";
import MoneyCounter from "./components/money_counter/MoneyCounter.jsx";
import ShawarmaCounter from "./components/shawarma_counter/ShawarmaCounter.jsx";
import Window from "./components/window/window.jsx";
import ProductsBar from "./components/products_bar/ProductsBar.jsx";

function App() {
  const [count, setCount] = useState(0);
  const [level, setLevel] = useState(1);
  const [money, setMoney] = useState(0);
  const [isCooking, setIsCooking] = useState(false);
  const cookingTime = 10000;

  const { currentCustomer } = useCustomerFlow(count, setCount, level, setMoney);

  return (
    <>
      <MoneyCounter money={money} />
      <ShawarmaCounter count={count} />

      <button onClick={() => setLevel((prev) => prev + 1)}>
        Уровень: {level}
      </button>

      <Button
        isCooking={isCooking}
        setCount={setCount}
        count={count}
        setIsCooking={setIsCooking}
        cookingTime={cookingTime}
        style={{ "--cooking-time": `${cookingTime}ms` }}
      />

      <Market />

      <Window currentCustomer={currentCustomer} hidden={!currentCustomer} />

      <ProductsBar />
    </>
  );
}

export default App;
