import React from "react";
import { SHOP_UPGRADES } from "../../constants/upgrades";
import "./MenuTable.css";

export default function MenuTable({ menu, upgrades }) {
  // Базовые цены (из menu.js)
  const basePrices = {
    1: 220, // Классика
    2: 200, // Сырная
    3: 300, // Острая
    4: 150, // Вего
    5: 390  // XXL
  };

  return (
    <div className="menu-table-container">
      <h2>Прайс-лист заведения</h2>
      
      <table>
        <thead>
          <tr>
            <th>Блюдо</th>
            <th>База</th>
            <th>Апгрейды</th>
            <th>Итого</th>
          </tr>
        </thead>
        <tbody>
          {menu.map((item) => {
            const basePrice = basePrices[item.id] || item.price;
            const upgradeBonus = item.price - basePrice;

            return (
              <tr key={item.id} className={item.unlocked ? "unlocked" : "locked"}>
                <td className="dish-name">
                  {item.unlocked ? item.name : "🔒 Заблокировано"}
                </td>
                <td>{basePrice} сом</td>
                <td className="upgrade-bonus">
                  {upgradeBonus > 0 ? `+${upgradeBonus}` : "—"}
                </td>
                <td className="total-price">
                  {item.unlocked ? `${item.price} сом` : "???"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      
      <div className="disclaimer">
        * Цены обновляются автоматически при покупке соусов и ингредиентов в магазине.
      </div>
    </div>
  );
}