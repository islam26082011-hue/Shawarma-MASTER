import { menuData } from "../constants/menu.js";
import s from "./TabMenuTable.module.css";

const BASE_PRICES = Object.fromEntries(menuData.map(item => [item.id, item.price]));

export default function TabMenuTable({ menu }) {
  return (
    <div className={s.tab}>
      <h2 className={s.title}>Прайс-лист</h2>

      {menu.map(item => {
        const base  = BASE_PRICES[item.id] ?? item.price;
        const bonus = item.price - base;

        return (
          <div key={item.id} className={`${s.row} ${item.unlocked ? "" : s.locked}`}>
            <div className={s.rowLeft}>
              <span className={s.emoji}>🌯</span>
              <div>
                <p className={s.itemName}>
                  {item.unlocked ? item.name : "🔒 Заблокировано"}
                </p>
                <p className={s.itemDesc}>
                  {item.unlocked ? item.description : `Уровень ${item.unlocksAtLevel}`}
                </p>
              </div>
            </div>

            <div className={s.rowRight}>
              {item.unlocked ? (
                <>
                  <span className={s.price}>{item.price} с</span>
                  {bonus > 0 && <span className={s.bonus}>+{bonus}</span>}
                </>
              ) : (
                <span className={s.priceLocked}>???</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
