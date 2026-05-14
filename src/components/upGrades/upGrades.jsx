import React from "react";
import { SHOP_UPGRADES } from "../../constants/upgrades";
import "./upGrades.css";

export default function UpgradesList({ money, level, purchasedUpgrades = [], onBuy }) {
  // Защита: если конфиг вдруг не загрузился или не массив
  if (!Array.isArray(SHOP_UPGRADES)) return null;

  return (
    <div className="upgrades-container">
      <h2>Магазин улучшений</h2>
      
      {SHOP_UPGRADES.map((item) => {
        // Проверяем, куплен ли этот конкретный ID
        const isBought = purchasedUpgrades.includes(item.id);
        const isLocked = level < item.minLevel;
        const canAfford = money >= item.cost;

        return (
          <div 
            key={item.id} 
            className={`upgrade-item ${isLocked ? "locked" : "unlocked"} ${isBought ? "purchased" : ""}`}
          >
            <div className="upgrade-item-info">
              <div className="upgrade-item-name">
                {isLocked ? `🔒 Уровень ${item.minLevel}` : item.name}
              </div>
              <div className="upgrade-item-description">{item.description}</div>
            </div>

            {!isBought && !isLocked && (
              <button 
                onClick={() => onBuy(item)}
                disabled={!canAfford}
                className="upgrade-item-button"
              >
                {item.cost} ₽
              </button>
            )}
            
            {isBought && <span className="upgrade-item-badge">ВЛАДЕЕТЕ</span>}
          </div>
        );
      })}
    </div>
  );
}