import { useState } from "react";
import { useCustomerFlow } from "./hooks/useCustomerFlow";
import { useGameSync } from "./hooks/useGameSync";
import Market from "./components/market/market.jsx";
import Button from "./components/button/button.jsx";
import MoneyCounter from "./components/money_counter/MoneyCounter.jsx";
import ShawarmaCounter from "./components/shawarma_counter/ShawarmaCounter.jsx";
import Window from "./components/window/window.jsx";
import ProductsBar from "./components/products_bar/ProductsBar.jsx";
import LevelUpPanel from "./components/LevelUpPanel/LevelUpPanel.jsx";
import { LEVEL_REQUIREMENTS } from "./constants/upgrades.js";
import { playerProgress } from "./constants/playerProgress.js";

export default function Game({ user }) {
  const [count, setCount] = useState(0);
  const [level, setLevel] = useState(1);
  const [money, setMoney] = useState(0);
  const [total, setTotal] = useState(0);
  const [ingredients, setIngredients] = useState(playerProgress.ingredients);
  const [isCooking, setIsCooking] = useState(false);
  const cookingTime = 10000;

  // Вся магия Firebase теперь тут в одну строку
  useGameSync(
    user,
    money,
    level,
    count,
    setMoney,
    setLevel,
    setCount,
    total,
    setTotal
  );

  const currentReq = LEVEL_REQUIREMENTS[level];
  const { currentCustomer } = useCustomerFlow(
    count,
    setCount,
    level,
    setMoney,
    total,
    setTotal
  );

  const canLevelUp = currentReq
    ? money >= currentReq.money && count >= currentReq.count
    : false;

  return (
    <>
      <p style={{ fontSize: "10px", color: "#bc13fe" }}>Повар: {user.email}</p>
      <MoneyCounter money={money} />
      <ShawarmaCounter count={total} />
      <LevelUpPanel
        money={money}
        total={total}
        level={level}
        currentReq={currentReq}
        canLevelUp={canLevelUp}
        onLevelUp={() => setLevel((p) => p + 1)}
      />

      <Button
        isCooking={isCooking}
        setCount={setCount}
        setTotal={setTotal}
        setIsCooking={setIsCooking}
        cookingTime={cookingTime}
        ingredients={ingredients}
        setIngredients={setIngredients}
        currentCustomer={currentCustomer} 
        activeRecipe={currentCustomer?.order?.recipe}
        style={{ "--cooking-time": `${cookingTime}ms` }}
      />

      <Market
        money={money}
        setMoney={setMoney}
        ingredients={ingredients}
        setIngredients={setIngredients}
      />
      <Window currentCustomer={currentCustomer} hidden={!currentCustomer} />
      <ProductsBar ingredients={ingredients} />
    </>
  );
}
