// Импорты
import { useState, useRef, useCallback } from "react";
import { menuData } from "./constants/menu.js";
import { LEVEL_REQUIREMENTS } from "./constants/upgrades.js";
import { useCustomerFlow } from "./hooks/useCustomerFlow.jsx";
import { useGameSync } from "./hooks/useGameSync.js";
import { useApprentice } from "./hooks/useApprentice.js";
import TabCook from "./components/TabCook.jsx";
import TabMarket from "./components/TabMarket.jsx";
import TabUpgrades from "./components/TabUpgrades.jsx";
import TabMenuTable from "./components/TabMenuTable.jsx";
import TabLevel from "./components/TabLevel.jsx";
import {
  IconCook,
  IconShop,
  IconUpgrades,
  IconMenu,
  IconLevel,
} from "./components/NavIcons.jsx";
import moneyIcon from "./assets/icos/money.png";
import "./Game.css";
import s from "./Game.module.css";

function buildInitialMenuState() {
  return menuData.map((item) => ({ ...item, priceBonus: 0 }));
}

export default function Game({ user }) {
  const [money, setMoney] = useState(0);
  const [level, setLevel] = useState(1);
  const [count, setCount] = useState(0);
  const [total, setTotal] = useState(0);
  const [ingredients, setIngredients] = useState({
    chicken: 5,
    vegetables: 5,
    sauce: 5,
  });
  const [upgrades, setUpgrades] = useState([]);
  const [cookingTime, setCookingTime] = useState(10000);
  const [moneyMultiplier, setMoneyMultiplier] = useState(1);
  const [isCooking, setIsCooking] = useState(false);
  const [menu, setMenu] = useState(buildInitialMenuState);
  const [activeTab, setActiveTab] = useState(0);
  const [notification, setNotification] = useState(null);
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);

  // Меню с учётом бонусов от апгрейдов
  const effectiveMenu = menu.map((item) => ({
    ...item,
    price: item.price + (item.priceBonus || 0),
  }));

  useGameSync(
    user,
    money,
    level,
    count,
    total,
    ingredients,
    upgrades,
    cookingTime,
    menu,
    setMoney,
    setLevel,
    setCount,
    setTotal,
    setIngredients,
    setUpgrades,
    setCookingTime,
    setMenu
  );

  const { currentCustomer, isSelling, markShawarmaReady } = useCustomerFlow(
    count,
    setCount,
    level,
    setMoney,
    setTotal,
    effectiveMenu,
    moneyMultiplier
  );

  useApprentice(upgrades, moneyMultiplier, setMoney, setTotal);

  const showNotif = useCallback((msg, type = "success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 2000);
  }, []);

  // ── Покупка апгрейда ──────────────────────────────────────────
  const handleBuyUpgrade = useCallback(
    (upgrade) => {
      if (
        upgrades.includes(upgrade.id) ||
        money < upgrade.cost ||
        level < upgrade.minLevel
      )
        return;

      setMoney((p) => p - upgrade.cost);
      setUpgrades((p) => [...p, upgrade.id]);

      if (upgrade.type === "price") {
        setMenu((prev) =>
          prev.map((item) => {
            if (upgrade.id === "cheese_sauce" && item.id === 2)
              return {
                ...item,
                priceBonus: (item.priceBonus || 0) + upgrade.value,
              };
            if (["premium_meat", "molecular_kitchen"].includes(upgrade.id))
              return {
                ...item,
                priceBonus: (item.priceBonus || 0) + upgrade.value,
              };
            return item;
          })
        );
      }
      if (upgrade.type === "speed")
        setCookingTime((p) => Math.max(1000, p - upgrade.value));
      if (upgrade.type === "multiplier")
        setMoneyMultiplier((p) => p * upgrade.value);

      showNotif(`${upgrade.name} куплено!`);
    },
    [upgrades, money, level, showNotif]
  );

  // ── Повышение уровня ──────────────────────────────────────────
  const currentReq = LEVEL_REQUIREMENTS[level];
  const canLevelUp =
    !!currentReq && money >= currentReq.money && total >= currentReq.count;

  const handleLevelUp = useCallback(() => {
    if (!canLevelUp) return;
    setLevel((prev) => {
      const next = prev + 1;
      setMenu((prevMenu) =>
        prevMenu.map((item) =>
          item.unlocksAtLevel <= next ? { ...item, unlocked: true } : item
        )
      );
      showNotif(`🎉 Уровень ${next}! ${currentReq.reward}`);
      return next;
    });
  }, [canLevelUp, currentReq, showNotif]);

  // ── Свайп-навигация ───────────────────────────────────────────
  const TABS_COUNT = 5;

  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const onTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
      if (dx < 0) setActiveTab((t) => Math.min(t + 1, TABS_COUNT - 1));
      else setActiveTab((t) => Math.max(t - 1, 0));
    }
    touchStartX.current = null;
  };

  const tabs = [
    {
      icon: <IconCook />,
      label: "Готовка",
      badge: currentCustomer ? "!" : null,
    },
    { icon: <IconShop />, label: "Рынок" },
    {
      icon: <IconUpgrades />,
      label: "Апгрейды",
      badge: canLevelUp ? "🆙" : null,
    },
    { icon: <IconMenu />, label: "Меню" },
    { icon: <IconLevel />, label: "Уровень", badge: canLevelUp ? "!" : null },
  ];

  return (
    <div className={s.game}>
      {notification && (
        <div className={`${s.notification} ${s[notification.type]}`}>
          {notification.msg}
        </div>
      )}

      {/* Топ-бар */}
      <header className={s.topBar}>
        <div className={s.stat}>
          <span className={s.statVal}>
            <img src={moneyIcon} alt="" className={s.moneyIcon} />
            {money.toLocaleString()}
          </span>
          <span className={s.statLbl}>сом</span>
        </div>

        <div className={s.topCenter}>
          <span className={s.levelBadge}>ур. {level}</span>
        </div>

        <div className={`${s.stat} ${s.right}`}>
          <span className={s.statVal}>{total}</span>
          <span className={s.statLbl}>продано</span>
        </div>
      </header>

      {/* Контент */}
      <main
        className={s.content}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {activeTab === 0 && (
          <TabCook
            isCooking={isCooking}
            setIsCooking={setIsCooking}
            cookingTime={cookingTime}
            ingredients={ingredients}
            setIngredients={setIngredients}
            currentCustomer={currentCustomer}
            isSelling={isSelling}
            markShawarmaReady={markShawarmaReady}
            setCount={setCount}
            upgrades={upgrades}
          />
        )}
        {activeTab === 1 && (
          <TabMarket
            money={money}
            setMoney={setMoney}
            ingredients={ingredients}
            setIngredients={setIngredients}
          />
        )}
        {activeTab === 2 && (
          <TabUpgrades
            money={money}
            level={level}
            purchasedUpgrades={upgrades}
            onBuy={handleBuyUpgrade}
          />
        )}
        {activeTab === 3 && <TabMenuTable menu={effectiveMenu} />}
        {activeTab === 4 && (
          <TabLevel
            money={money}
            total={total}
            level={level}
            currentReq={currentReq}
            canLevelUp={canLevelUp}
            onLevelUp={handleLevelUp}
          />
        )}
      </main>

      {/* Нижняя навигация */}
      <nav className={s.nav}>
        {tabs.map((tab, i) => (
          <button
            key={i}
            className={`${s.navTab} ${activeTab === i ? s.active : ""}`}
            onClick={() => setActiveTab(i)}
          >
            <span className={s.navIcon}>{tab.icon}</span>
            <span className={s.navLabel}>{tab.label}</span>
            {tab.badge && <span className={s.navBadge}>{tab.badge}</span>}
          </button>
        ))}
      </nav>
    </div>
  );
}
