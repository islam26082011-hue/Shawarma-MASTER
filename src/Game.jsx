import { useState } from "react";
import { useCustomerFlow } from "./hooks/useCustomerFlow";
import { useGameSync } from "./hooks/useGameSync";

// Компоненты UI
import Market from "./components/market/market.jsx";
import Button from "./components/button/button.jsx";
import MoneyCounter from "./components/money_counter/MoneyCounter.jsx";
import ShawarmaCounter from "./components/shawarma_counter/ShawarmaCounter.jsx";
import Window from "./components/window/window.jsx";
import ProductsBar from "./components/products_bar/ProductsBar.jsx";
import LevelUpPanel from "./components/LevelUpPanel/LevelUpPanel.jsx";
import UpgradesList from "./components/upGrades/upGrades.jsx";
import MenuTable from "./components/MenuTable/MenuTable.jsx"

// Константы
import { playerProgress } from "./constants/playerProgress.js";
import { LEVEL_REQUIREMENTS } from "./constants/upgrades.js";

export default function Game({ user }) {
  // --- Состояние игры ---
  const [upgrades, setUpgrades] = useState([]);
  const [count, setCount] = useState(0); // Готовая шаурма на руках
  const [level, setLevel] = useState(1);
  const [money, setMoney] = useState(0);
  const [total, setTotal] = useState(0); // Всего продано за все время
  const [ingredients, setIngredients] = useState(playerProgress.ingredients);
  const [isCooking, setIsCooking] = useState(false);
  const [cookingTime, setCookingTime] = useState(10000);
  const [menu, setMenu] = useState([]); // Меню загружается из Firebase

  // --- Синхронизация с Firebase ---
  useGameSync(
    user, money, level, count, total, ingredients, upgrades, cookingTime, menu,
    setMoney, setLevel, setCount, setTotal, setIngredients, setUpgrades, setCookingTime, setMenu
  );

  // --- Логика покупателей ---
  const { currentCustomer } = useCustomerFlow(
    count, setCount, level, setMoney, total, setTotal, menu
  );

  // --- Обработка апгрейдов ---
  const handleBuyUpgrade = (upgrade) => {
    const isBought = upgrades.includes(upgrade.id);
    const canAfford = money >= upgrade.cost;
    const isLevelMet = level >= upgrade.minLevel;

    if (!isBought && canAfford && isLevelMet) {
      setMoney((prev) => prev - upgrade.cost);
      setUpgrades((prev) => [...prev, upgrade.id]);

      // Если апгрейд влияет на цену блюд в меню
      if (upgrade.type === "price") {
        setMenu((prevMenu) =>
          prevMenu.map((item) => {
            // Специфический апгрейд: Сырный соус только для Сырной шаурмы (id: 2)
            if (upgrade.id === "cheese_sauce" && item.id === 2) {
              return { ...item, price: item.price + upgrade.value };
            }
            // Глобальный апгрейд: Мраморное мясо влияет на все позиции
            if (upgrade.id === "premium_meat" || upgrade.id === "molecular_kitchen") {
              return { ...item, price: item.price + upgrade.value };
            }
            return item;
          })
        );
      }

      // Если апгрейд влияет на скорость (уменьшает время готовки)
      if (upgrade.type === "speed") {
        setCookingTime((prev) => Math.max(1000, prev - upgrade.value));
      }
    }
  };

  // --- Логика уровней ---
  const currentReq = LEVEL_REQUIREMENTS[level];
  const canLevelUp = currentReq 
    ? money >= currentReq.money && total >= currentReq.count 
    : false;

  const handleLevelUp = () => {
    if (canLevelUp) {
      setLevel((p) => {
        const nextLevel = p + 1;
        // Разблокировка новых рецептов при достижении уровней
        if (nextLevel === 2) {
          setMenu(prev => prev.map(item => item.id === 2 ? { ...item, unlocked: true } : item));
        }
        if (nextLevel === 3) {
          setMenu(prev => prev.map(item => item.id === 3 ? { ...item, unlocked: true } : item));
        }
        return nextLevel;
      });
    }
  };

  return (
    <div className="game-screen" style={{ color: "#fff", fontFamily: "monospace" }}>
      <p style={{ fontSize: "10px", color: "#bc13fe", opacity: 0.7 }}>
        ID ПОВАРА: {user.uid.slice(0, 8)} | {user.email}
      </p>

      <MoneyCounter money={money} />
      <ShawarmaCounter count={total} />
      
      <LevelUpPanel
        money={money}
        total={total}
        level={level}
        currentReq={currentReq}
        canLevelUp={canLevelUp}
        onLevelUp={handleLevelUp}
      />

      <div style={{ display: "flex", gap: "20px", alignItems: "flex-start", marginTop: "20px" }}>
        <div style={{ flex: 1 }}>
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
          
          <Window currentCustomer={currentCustomer} hidden={!currentCustomer} />
          
          <Market
            money={money}
            setMoney={setMoney}
            ingredients={ingredients}
            setIngredients={setIngredients}
          />
          <MenuTable menu={menu} upgrades={upgrades} />
        </div>

        <div style={{ width: "300px" }}>
          <ProductsBar ingredients={ingredients} />
          <UpgradesList
            money={money}
            level={level}
            purchasedUpgrades={upgrades}
            onBuy={handleBuyUpgrade}
          />
        </div>
      </div>
    </div>
  );
}