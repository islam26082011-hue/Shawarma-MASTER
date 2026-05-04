import React from "react";
import { SHOP_UPGRADES } from "../../constants/upgrades"; // Импортируй свой конфиг

export default function UpgradesList({ money, level, purchasedUpgrades = [], onBuy }) {
  // Защита: если конфиг вдруг не загрузился или не массив
  if (!Array.isArray(SHOP_UPGRADES)) return null;

  return (
    <div className="upgrades-container" style={{ padding: "20px", maxWidth: "450px" }}>
      <h2 style={{ color: "#bc13fe", fontSize: "14px", textTransform: "uppercase" }}>Магазин улучшений</h2>
      
      {SHOP_UPGRADES.map((item) => {
        // Проверяем, куплен ли этот конкретный ID
        const isBought = purchasedUpgrades.includes(item.id);
        const isLocked = level < item.minLevel;
        const canAfford = money >= item.cost;

        return (
          <div key={item.id} style={{
            padding: "12px",
            marginBottom: "10px",
            borderRadius: "12px",
            background: isLocked ? "rgba(0,0,0,0.3)" : "rgba(188, 19, 254, 0.05)",
            border: `1px solid ${isBought ? "#bc13fe" : "#333"}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            opacity: isLocked ? 0.5 : 1
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ color: "#fff", fontWeight: "bold", fontSize: "14px" }}>
                {isLocked ? `🔒 Уровень ${item.minLevel}` : item.name}
              </div>
              <div style={{ fontSize: "11px", color: "#aaa" }}>{item.description}</div>
            </div>

            {!isBought && !isLocked && (
              <button 
                onClick={() => onBuy(item)}
                disabled={!canAfford}
                style={{
                  background: canAfford ? "#bc13fe" : "#222",
                  color: "#fff",
                  border: "none",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  cursor: canAfford ? "pointer" : "not-allowed",
                  fontWeight: "bold"
                }}
              >
                {item.cost} ₽
              </button>
            )}
            
            {isBought && <span style={{ color: "#bc13fe", fontWeight: "bold" }}>ВЛАДЕЕТЕ</span>}
          </div>
        );
      })}
    </div>
  );
}