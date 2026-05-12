import { useState, useEffect, useRef } from "react";
import { useCustomerFlow } from "./hooks/useCustomerFlow";
import { useGameSync } from "./hooks/useGameSync";

import Market from "./components/market/market.jsx";
import Button from "./components/button/button.jsx";
import Window from "./components/window/window.jsx";
import ProductsBar from "./components/products_bar/ProductsBar.jsx";
import LevelUpPanel from "./components/LevelUpPanel/LevelUpPanel.jsx";
import UpgradesList from "./components/upGrades/upGrades.jsx";
import MenuTable from "./components/MenuTable/MenuTable.jsx";
import Header from "./components/header/header.jsx";
import Apprentice from "./components/apprentice/Apprentice.jsx";

import { playerProgress } from "./constants/playerProgress.js";
import { LEVEL_REQUIREMENTS } from "./constants/upgrades.js";

export default function Game({ user }) {
  const [upgrades, setUpgrades] = useState([]);
  const [count, setCount] = useState(0);
  const [level, setLevel] = useState(1);
  const [money, setMoney] = useState(0);
  const [total, setTotal] = useState(0);
  const [ingredients, setIngredients] = useState(playerProgress.ingredients);
  const [isCooking, setIsCooking] = useState(false);
  const [cookingTime, setCookingTime] = useState(10000);
  const [menu, setMenu] = useState([]);

  // Множитель дохода (апгрейд marketing_campaign)
  const [moneyMultiplier, setMoneyMultiplier] = useState(1);

  // Стажёр: ref чтобы интервал не пересоздавался лишний раз
  const apprenticeRef = useRef(null);
  const superMixMasterRef = useRef(null);

  useGameSync(
    user, money, level, count, total, ingredients, upgrades, cookingTime, menu,
    setMoney, setLevel, setCount, setTotal, setIngredients, setUpgrades, setCookingTime, setMenu
  );

  // Пересчитываем множитель при загрузке апгрейдов из Firebase
  useEffect(() => {
    if (upgrades.includes("marketing_campaign")) {
      setMoneyMultiplier(2);
    }
  }, [upgrades]);

  // Стажёр: приносит 500 сом каждые 15 секунд
  useEffect(() => {
    const hasApprentice = upgrades.includes("apprentice");

    if (hasApprentice) {
      apprenticeRef.current = setInterval(() => {
        const apprenticeIncome = 500;
        setMoney(prev => prev + (apprenticeIncome * moneyMultiplier));
        setTotal(prev => prev + 1); // Считаем как одну продажу
      }, 15000); // 15 секунд
    }

    return () => {
      if (apprenticeRef.current) clearInterval(apprenticeRef.current);
    };
  }, [upgrades, moneyMultiplier]);

  // Мастер Super mix: автоматически производит Super mix за 500 каждые 3 секунды
  useEffect(() => {
    const hasSuperMixMaster = upgrades.includes("super_mix_master");

    if (hasSuperMixMaster) {
      superMixMasterRef.current = setInterval(() => {
        // Добавляем 500 сом каждые 3 секунды (цена Super mix)
        const superMixPrice = 500;
        setMoney(prev => prev + (superMixPrice * moneyMultiplier));
        setTotal(prev => prev + 1);
      }, 3000);
    }

    return () => {
      if (superMixMasterRef.current) clearInterval(superMixMasterRef.current);
    };
  }, [upgrades, moneyMultiplier]);

  // Меню с учётом priceBonus (апгрейды цен)
  // Покупатели платят по этой цене, прайс-лист показывает эту цену
  const effectiveMenu = menu.map(item => ({
    ...item,
    price: item.price + (item.priceBonus || 0),
  }));

  const { currentCustomer, isSelling, markShawarmaReady } = useCustomerFlow(
    count,
    setCount,
    level,
    setMoney,
    setTotal,
    effectiveMenu,    // передаём меню с реальными ценами
    moneyMultiplier,  // передаём множитель
  );

  // --- Апгрейды ---
  const handleBuyUpgrade = (upgrade) => {
    const isBought = upgrades.includes(upgrade.id);
    const canAfford = money >= upgrade.cost;
    const isLevelMet = level >= upgrade.minLevel;

    if (isBought || !canAfford || !isLevelMet) return;

    setMoney(prev => prev - upgrade.cost);
    setUpgrades(prev => [...prev, upgrade.id]);

    if (upgrade.type === "price") {
      // Сохраняем бонус отдельно (priceBonus), не трогаем базовую price из menu.js
      setMenu(prevMenu =>
        prevMenu.map(item => {
          if (upgrade.id === "cheese_sauce" && item.id === 2) {
            return { ...item, priceBonus: (item.priceBonus || 0) + upgrade.value };
          }
          if (upgrade.id === "premium_meat" || upgrade.id === "molecular_kitchen") {
            return { ...item, priceBonus: (item.priceBonus || 0) + upgrade.value };
          }
          return item;
        })
      );
    }

    if (upgrade.type === "speed") {
      setCookingTime(prev => Math.max(1000, prev - upgrade.value));
    }

    if (upgrade.type === "multiplier") {
      setMoneyMultiplier(prev => prev * upgrade.value);
    }

    // "idle" (apprentice) — обрабатывается через useEffect выше
  };

  // --- Уровни ---
  const currentReq = LEVEL_REQUIREMENTS[level];
  const canLevelUp = currentReq
    ? money >= currentReq.money && total >= currentReq.count
    : false;

  const handleLevelUp = () => {
    if (!canLevelUp) return;

    setLevel(prev => {
      const nextLevel = prev + 1;

      // Разблокируем рецепты по уровню
      setMenu(prevMenu =>
        prevMenu.map(item =>
          item.unlocksAtLevel <= nextLevel
            ? { ...item, unlocked: true }
            : item
        )
      );

      return nextLevel;
    });
  };

  return (
    <div className="game-screen" style={{ color: "#fff", fontFamily: "monospace" }}>
      <p style={{ fontSize: "10px", color: "#bc13fe", opacity: 0.7 }}>
        ID ПОВАРА: {user.uid.slice(0, 8)} | {user.email}
      </p>

      <Header
        user={user}
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
            setIsCooking={setIsCooking}
            isSelling={isSelling}
            count={count}
            setCount={setCount}
            cookingTime={cookingTime}
            ingredients={ingredients}
            setIngredients={setIngredients}
            currentCustomer={currentCustomer}
            activeRecipe={currentCustomer?.order?.recipe}
            onShawarmaReady={markShawarmaReady}
            style={{ "--cooking-time": `${cookingTime}ms` }}
          />

          <Window currentCustomer={currentCustomer} hidden={!currentCustomer} />

          <Market
            money={money}
            setMoney={setMoney}
            ingredients={ingredients}
            setIngredients={setIngredients}
          />

          {/* Прайс-лист показывает effectiveMenu (с бонусами апгрейдов) */}
          <MenuTable menu={effectiveMenu} upgrades={upgrades} />

          {/* Компонент Стажера с прогресс-баром */}
          <Apprentice hasApprentice={upgrades.includes("apprentice")} />
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
