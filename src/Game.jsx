//Game.jsx - главный компонент игры. Он отвечает за хранение всего состояния игры,
// синхронизацию с базой данных, отображение уведомлений и навигацию между вкладками.
// Внутри него используются кастомные хуки для управления потоком клиентов, сохранением прогресса
// и эффектами от апгрейдов. Также он содержит логику для покупки апгрейдов, повышения уровня и
// свайп-навигации. Визуально он состоит из топ-бара с деньгами и уровнем, основного контента с
// разными вкладками и нижней навигации.

// Импорты
import { useState, useRef, useCallback } from "react";
import { menuData } from "./constants/menu.js";
import { LEVEL_REQUIREMENTS } from "./constants/upgrades.js";
import { useCustomerFlow } from "./hooks/useCustomerFlow.jsx"; // этот хук отвечает за генерацию клиента, со случайным заказом и фразой, а также за логику продажи шаурмы и получения денег
import { useGameSync } from "./hooks/useGameSync.js"; // этот хук отвечает за загрузку и сохранение прогресса в firebase, а также за отображение статуса сохранения
import { useApprentice } from "./hooks/useApprentice.js"; // этот хук отвечает за эффект от апгрейда "помощник", который автоматически продаёт шаурму каждые 10 секунд, если есть клиенты в очереди
import TabCook from "./components/TabCook.jsx"; //главный компонент, это вкладка готовки, где происходит основной геймплей.
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
  //добавление поля priceBonus для хранения бонусов от апгрейдов
  return menuData.map((item) => ({ ...item, priceBonus: 0 }));
}

export default function Game({ user }) {
  // главный компонент игры, принимаем user, чтобы сохранять прогресс в базе
  //дефолтные состояния игры. Они перезапишутся, когда все полностью загрузится из firebase
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
  const [cookingStartedAt, setCookingStartedAt] = useState(null); // это для нормальной работы анимации процесса готовки, чтобы она не обрывалась при переключении вкладок или открытии меню апгрейдов
  const [menu, setMenu] = useState(buildInitialMenuState);
  const [activeTab, setActiveTab] = useState(0);
  const [notification, setNotification] = useState(null); // уведомление о покупке апгрейда, повышении уровня или сохранении прогресса(получаем из useGameSync )
  const touchStartX = useRef(null); // координата x для свайп-навигации
  const touchStartY = useRef(null); // координата y для свайп-навигации

  //меню, с учётом бонусов от апгрейдов
  const effectiveMenu = menu.map((item) => ({
    ...item,
    price: item.price + (item.priceBonus || 0),
  }));

  const { saveNow, saveStatus } = useGameSync(
    // объявляем хук, чтобы потом сохранятть прогресс.
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
    // объявляем хук, чтобы потом вызывать функции для продажи шаурмы и получения денег, а также для получения текущего клиента и его заказа
    count,
    setCount,
    level,
    setMoney,
    setTotal,
    effectiveMenu,
    moneyMultiplier
  );

  useApprentice(upgrades, moneyMultiplier, setMoney, setTotal); // объявляем хук, который будет автоматически продавать шаурму каждые 10 секунд, если есть апгрейд "помощник" и клиенты в очереди

  const showNotif = useCallback((msg, type = "success") => { // функция для отображения уведомлений. Она принимает сообщение и тип (по умолчанию "success"), устанавливает уведомление в состояние, а через 2 секунды убирает его
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 2000);
  }, []);

  const handleSaveAndExit = useCallback(async () => {
    //создание функции выхода из игры
    await saveNow(); //ждем, когда прогресс сохранится, чтобы не потерять данные
    window.close(); //заккрываем вкладку
    // Если браузер запретил закрытие — показываем сообщение
    setTimeout(() => {
      showNotif("💾 Сохранено. Можете закрыть вкладку.", "success");
    }, 300);
  }, [saveNow, showNotif]);

  // ── Покупка апгрейда ──────────────────────────────────────────
  const handleBuyUpgrade = useCallback(
    //создание функции покупки апгрейда, которая проверяет,
    //  достаточно ли денег, не куплен ли уже апгрейд и соответствует ли уровень требованиям.
    //  Если все ок, то покупаем апгрейд, применяем его эффект и показываем уведомление
    (upgrade) => {
      // upgrade - это объект с данными апгрейда, который приходит из компонента TabUpgrades при клике на кнопку покупки
      if (
        // если апгрейд уже куплен, или денег недостаточно, или уровень не соответствует требованиям, то ничего не делаем
        upgrades.includes(upgrade.id) ||
        money < upgrade.cost ||
        level < upgrade.minLevel
      )
        return;

      setMoney((p) => p - upgrade.cost); // отнимаем стоимость апгрейда от денег
      setUpgrades((p) => [...p, upgrade.id]); // добавляем апгрейд в список купленных апгрейдов

      if (upgrade.type === "price") {
        setMenu((prev) => 
          prev.map((item) => {
            // 1. Если апгрейд влияет на конкретное блюдо (например, по ID)
            // Для этого у апгрейда в SHOP_UPGRADES должно быть поле targetItemId
            if (upgrade.targetItemId && item.id === upgrade.targetItemId) {
              return {
                ...item,
                priceBonus: (item.priceBonus || 0) + upgrade.value,
              };
            }
      
            // 2. Если апгрейд улучшает ВСЁ мясо (проверяем наличие chicken в рецепте)
            if (upgrade.id === "premium_meat" || upgrade.id === "molecular_kitchen") {
              if (item.recipe && item.recipe.chicken > 0) {
                return {
                  ...item,
                  priceBonus: (item.priceBonus || 0) + upgrade.value,
                };
              }
            }
            
            // 3. Если это какой-то другой общий апгрейд соуса (проверяем наличие sauce в рецепте)
            if (upgrade.id === "cheese_sauce") {
              // Если ты хочешь, чтобы сырный соус апал Классическую (id: 1), оставь так:
              if (item.id === 1) { 
                return {
                  ...item,
                  priceBonus: (item.priceBonus || 0) + upgrade.value,
                };
              }
              
              // ИЛИ, если он должен апать все блюда, где есть соус:
              // if (item.recipe && item.recipe.sauce > 0) { ... }
            }
      
            return item; // остальные блюда возвращаем без изменений
          })
        );
      }
      if (upgrade.type === "speed") // а если апгрейд speed, то мы отнимаем от времени готовки значение апгрейда, но не даём ему стать меньше 1 секунды, чтобы игра оставалась играбельной
        setCookingTime((p) => Math.max(1000, p - upgrade.value));
      if (upgrade.type === "multiplier")
        setMoneyMultiplier((p) => p * upgrade.value); // если апгрейд multiplier, то мы умножаем текущий множитель денег на значение апгрейда, чтобы получать больше денег за каждую проданную шаурму

      showNotif(`${upgrade.name} куплено!`); // показываем уведомление о покупке апгрейда
    },
    [upgrades, money, level, showNotif]
  );

  // ── Повышение уровня ──────────────────────────────────────────
  const currentReq = LEVEL_REQUIREMENTS[level]; // currentReq - это объект с требованиями для повышения текущего уровня, который мы получаем из константы LEVEL_REQUIREMENTS по ключу текущего уровня. В этом объекте есть поля money (требуемое количество денег) и count (требуемое количество проданных шаурм), а также reward (награда за повышение уровня, которую мы показываем в уведомлении) и nextLevel (следующий уровень, который открывается после повышения)
  const canLevelUp =
    !!currentReq && money >= currentReq.money && total >= currentReq.count; // canLevelUp - это булево значение, которое показывает, можем ли мы повысить уровень. Мы можем повысить уровень, если есть требования для текущего уровня (currentReq не null) и если у нас достаточно денег и проданных шаурм для выполнения этих требований

  const handleLevelUp = useCallback(() => { //создаем функцию, которая отвечает за повышение уровня
    if (!canLevelUp) return; // обрываем функцию, если не можем повысить уровень
    setLevel((prev) => { // иначе повышаем уровень на единицу
      const next = prev + 1; // номер следующего уровня
      setMenu((prevMenu) => // открываем новую шаурму, если можем
        prevMenu.map((item) =>
          item.unlocksAtLevel <= next ? { ...item, unlocked: true } : item
        )
      );
      showNotif(`🎉 Уровень ${next}! ${currentReq.reward}`);
      return next; // показываем уведомление о повышении уровня с наградой из требований текущего уровня
    });
  }, [canLevelUp, currentReq, showNotif]);

  // ── Свайп-навигация ───────────────────────────────────────────
  const TABS_COUNT = 5; // константа с количеством вкладок, чтобы не хардкодить цифру 5 в функции обработки свайпа

  const onTouchStart = (e) => { // функция, для обработки клика по экрану
    touchStartX.current = e.touches[0].clientX; // сохраняем координату x начала касания в рефе
    touchStartY.current = e.touches[0].clientY; // сохраняем координату y начала касания в рефе
  };

  const onTouchEnd = (e) => { // функция для обработки окончания касания по экрану
    if (touchStartX.current === null) return; // если координата x начала = null, то обрываем выполнение фунции
    const dx = e.changedTouches[0].clientX - touchStartX.current; // иначе вычисляем смещение по x от начала до конца касания
    const dy = e.changedTouches[0].clientY - touchStartY.current; // и смешение по y от начала до конца касания
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
      if (dx < 0) setActiveTab((t) => Math.min(t + 1, TABS_COUNT - 1));    // если смещение по x больше, чем по y и больше 50 пикселей, то считаем это свайпом. Если dx < 0, то это свайп влево, и мы переключаемся на следующую вкладку, но не больше количества вкладок минус 1. Иначе это свайп вправо, и мы переключаемся на предыдущую вкладку, но не меньше 0
      else setActiveTab((t) => Math.max(t - 1, 0));
    }
    touchStartX.current = null; // сбрасываем координаты начала касания в null, чтобы не обрабатывать случайные касания
    touchStartY.current = null;
  };

  const tabs = [ // массив с данными, для нижней панели. каждый обхект - это вкладка. 
    {
      icon: <IconCook />, // иконка для вкладки готовки
      label: "Готовка", //название
      badge: currentCustomer ? "!" : null, //если есть текущий клиент, который ждёт шаурму, то показываем красный восклицательный знак на вкладке готовки, чтобы привлечь внимание игрока
    },
    { icon: <IconShop />, label: "Рынок" },
    {
      icon: <IconUpgrades />,
      label: "Апгрейды",
      badge: canLevelUp ? "🆙" : null, // это работает также, как и для кастомера, только тут маркет продуктов
    },
    { icon: <IconMenu />, label: "Меню" },
    { icon: <IconLevel />, label: "Уровень", badge: canLevelUp ? "!" : null }, // если можем повысить уровень, показываем восклицательный знак
  ];

  return (
    <div className={s.game}> // главный контейнер игры.
      {notification && (// если есть уведомление в состоянии, то показываем его в виде блока с классами для стилей и цветовой схемой в зависимости от типа уведомления (успех, ошибка и т.д.)
        <div className={`${s.notification} ${s[notification.type]}`}>
          {notification.msg} // само сообщение
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

        {/* FIX: индикатор сохранения + кнопка */}
        <div className={`${s.stat} ${s.right}`}>
          <div className={s.topRight}>
            <span
              className={`${s.saveIndicator} ${
                s[`saveIndicator_${saveStatus}`]
              }`}
              title={
                saveStatus === "saving"
                  ? "Сохранение..."
                  : saveStatus === "saved"
                  ? "Сохранено"
                  : ""
              }
            >
              {saveStatus === "saving" && <span className={s.saveSpinner} />}
              {saveStatus === "saved" && "✓"}
            </span>
            <button className={s.saveExitBtn} onClick={handleSaveAndExit}>
              💾 Выйти
            </button>
          </div>
        </div>
      </header>

      {/* Контент */}
      <main
        className={s.content}
        onTouchStart={onTouchStart} //передаем в пропсы начало и коненец движения пальца
        onTouchEnd={onTouchEnd}
      >
        <div style={{ display: activeTab === 0 ? "block" : "none" }}>
          <TabCook //компонент готовки
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
            cookingStartedAt={cookingStartedAt}
            setCookingStartedAt={setCookingStartedAt}
          />
        </div>
        <div style={{ display: activeTab === 1 ? "block" : "none" }}>
          <TabMarket
            money={money}
            setMoney={setMoney}
            ingredients={ingredients}
            setIngredients={setIngredients}
          />
        </div>
        <div style={{ display: activeTab === 2 ? "block" : "none" }}>
          <TabUpgrades
            money={money}
            level={level}
            purchasedUpgrades={upgrades}
            onBuy={handleBuyUpgrade}
          />
        </div>
        <div style={{ display: activeTab === 3 ? "block" : "none" }}>
          <TabMenuTable menu={effectiveMenu} />
        </div>
        <div style={{ display: activeTab === 4 ? "block" : "none" }}>
          <TabLevel
            money={money}
            total={total}
            level={level}
            currentReq={currentReq}
            canLevelUp={canLevelUp}
            onLevelUp={handleLevelUp}
          />
        </div>
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
