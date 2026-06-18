import { SHOP_UPGRADES } from "../constants/upgrades.js"; //массив апгрейдов для магазина
// типа : {id, name, description, type, cost, minLevel, value}
import s from "./TabUpgrades.module.css"; 

const TYPE_ICON = { speed: "⚡", price: "💎", idle: "🤖", multiplier: "🚀" }; // иконки

export default function TabUpgrades({ money, level, purchasedUpgrades, onBuy }) { // Компонент вкладки апгрейдов. принимает деньги, уровень, список купленных апгрейдов и функцию покупки
  return ( 
    <div className={s.tab}> 
      <h2 className={s.title}>Улучшения</h2>

      {SHOP_UPGRADES.map(item => { // проходим по всем апгрейдам
        const isBought  = purchasedUpgrades.includes(item.id); // определяем, куплен ли апгрейд
        const isLocked  = level < item.minLevel; // определяем, заблокирован ли апгрейд по уровню
        const canAfford = money >= item.cost; // определяем, хватает ли денег на покупку

        let stateClass = s.available; // класс для стилизации карточки по состоянию
        if (isBought)   stateClass = s.bought; 
        else if (isLocked) stateClass = s.locked;
        else if (!canAfford) stateClass = s.cantAfford;

        return ( // возвращаем карточку апгрейда
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
