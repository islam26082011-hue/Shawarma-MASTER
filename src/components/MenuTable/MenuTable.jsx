import React from "react";
import { SHOP_UPGRADES } from "../../constants/upgrades";

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
    <div style={{
      padding: "20px",
      background: "rgba(10, 10, 10, 0.9)",
      borderRadius: "15px",
      border: "1px solid #bc13fe",
      marginTop: "20px",
      fontFamily: "monospace"
    }}>
      <h2 style={{ color: "#bc13fe", fontSize: "18px", textTransform: "uppercase", marginBottom: "15px" }}>
        Прайс-лист заведения
      </h2>
      
      <table style={{ width: "100%", borderCollapse: "collapse", color: "#fff" }}>
        <thead>
          <tr style={{ borderBottom: "2px solid #bc13fe", textAlign: "left" }}>
            <th style={{ padding: "10px", color: "#bc13fe" }}>Блюдо</th>
            <th style={{ padding: "10px", color: "#bc13fe" }}>База</th>
            <th style={{ padding: "10px", color: "#bc13fe" }}>Апгрейды</th>
            <th style={{ padding: "10px", color: "#bc13fe" }}>Итого</th>
          </tr>
        </thead>
        <tbody>
          {menu.map((item) => {
            const basePrice = basePrices[item.id] || item.price;
            const upgradeBonus = item.price - basePrice;

            return (
              <tr key={item.id} style={{ 
                borderBottom: "1px solid #333", 
                opacity: item.unlocked ? 1 : 0.3,
                transition: "all 0.3s ease"
              }}>
                <td style={{ padding: "12px", fontWeight: "bold" }}>
                  {item.unlocked ? item.name : "🔒 Заблокировано"}
                </td>
                <td style={{ padding: "12px" }}>{basePrice} сом</td>
                <td style={{ padding: "12px", color: "#00ff88" }}>
                  {upgradeBonus > 0 ? `+${upgradeBonus}` : "—"}
                </td>
                <td style={{ padding: "12px", color: "#bc13fe", fontWeight: "bold", fontSize: "16px" }}>
                  {item.unlocked ? `${item.price} сом` : "???"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      
      <div style={{ marginTop: "15px", fontSize: "10px", color: "#666" }}>
        * Цены обновляются автоматически при покупке соусов и ингредиентов в магазине.
      </div>
    </div>
  );
}