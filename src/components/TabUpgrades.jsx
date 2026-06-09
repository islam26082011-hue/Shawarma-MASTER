import { SHOP_UPGRADES } from "../constants/upgrades.js";
import s from "./TabUpgrades.module.css";

const TYPE_ICON = { speed: "⚡", price: "💎", idle: "🤖", multiplier: "🚀" };

export default function TabUpgrades({ money, level, purchasedUpgrades, onBuy }) {
  return (
    <div className={s.tab}>
      <h2 className={s.title}>Улучшения</h2>

      {SHOP_UPGRADES.map(item => {
        const isBought  = purchasedUpgrades.includes(item.id);
        const isLocked  = level < item.minLevel;
        const canAfford = money >= item.cost;

        let stateClass = s.available;
        if (isBought)   stateClass = s.bought;
        else if (isLocked) stateClass = s.locked;
        else if (!canAfford) stateClass = s.cantAfford;

        return (
          <div key={item.id} className={`${s.card} ${stateClass}`}>
            <div className={s.cardLeft}>
              <span className={s.typeIcon}>{TYPE_ICON[item.type] ?? "✨"}</span>
              <div>
                <p className={s.name}>
                  {isLocked ? `🔒 Уровень ${item.minLevel}` : item.name}
                </p>
                <p className={s.desc}>{item.description}</p>
              </div>
            </div>

            <div className={s.cardRight}>
              {isBought ? (
                <span className={s.owned}>✓</span>
              ) : isLocked ? (
                <span className={s.lvl}>ур. {item.minLevel}</span>
              ) : (
                <button
                  className={`${s.buyBtn} ${canAfford ? "" : s.cant}`}
                  onClick={() => onBuy(item)}
                  disabled={!canAfford}
                >
                  {item.cost.toLocaleString()} с
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
