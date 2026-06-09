import { INGREDIENT_PRICES } from "../constants/prices.js";
import s from "./TabMarket.module.css";

const ICONS = { chicken: "🍗", vegetables: "🥬", sauce: "🧴" };
const NAMES = { chicken: "Мясо",  vegetables: "Овощи", sauce: "Соус" };
const MAX   = 50;

export default function TabMarket({ money, setMoney, ingredients, setIngredients }) {
  const buy = (type, qty = 1) => {
    const price = INGREDIENT_PRICES[type];
    const cur   = Number(ingredients[type]) || 0;
    const toBuy = Math.min(qty, MAX - cur);
    if (toBuy <= 0 || money < price * toBuy) return;
    setMoney(p => p - price * toBuy);
    setIngredients(p => ({ ...p, [type]: (Number(p[type]) || 0) + toBuy }));
  };

  return (
    <div className={s.tab}>
      <h2 className={s.title}>Рынок</h2>

      {Object.keys(INGREDIENT_PRICES).map(type => {
        const amount    = Number(ingredients?.[type]) || 0;
        const pct       = (amount / MAX) * 100;
        const isFull    = amount >= MAX;
        const price     = INGREDIENT_PRICES[type];
        const canAfford = money >= price;

        return (
          <div key={type} className={s.item}>
            <div className={s.itemLeft}>
              <span className={s.icon}>{ICONS[type]}</span>
              <div>
                <p className={s.name}>{NAMES[type]}</p>
                <div className={s.barWrap}>
                  <div className={s.bar}>
                    <div className={s.barFill} style={{ width: `${pct}%` }} />
                  </div>
                  <span className={s.count}>{amount}/{MAX}</span>
                </div>
              </div>
            </div>

            <div className={s.actions}>
              <button
                className={`${s.btn} ${isFull ? s.full : !canAfford ? s.broke : ""}`}
                onClick={() => buy(type, 1)}
                disabled={isFull || !canAfford}
              >
                +1 · {price} с
              </button>
              <button
                className={`${s.btn} ${isFull || money < price * 5 ? s.broke : ""}`}
                onClick={() => buy(type, 5)}
                disabled={isFull || money < price * 5}
              >
                +5 · {price * 5} с
              </button>
            </div>
          </div>
        );
      })}

      <div className={s.tip}>
        💰 Баланс: <strong>{money.toLocaleString()} с</strong>
      </div>
    </div>
  );
}
