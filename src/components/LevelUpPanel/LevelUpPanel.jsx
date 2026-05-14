import React from "react";
import "./LevelUpPanel.css";

export default function LevelUpPanel({ money, total, currentReq, canLevelUp, onLevelUp, level }) {
  if (!currentReq) {
    return (
      <div className="level-panel max-level">
        <h3>🏆 ШАУРМА-КОРОЛЬ</h3>
        <p>Все рецепты открыты, империя построена.</p>
      </div>
    );
  }

  // Расчет процентов для прогресс-бара
  const moneyProgress = Math.min((money / currentReq.money) * 100, 100);
  const countProgress = Math.min((total / currentReq.count) * 100, 100);

  return (
    <div className={`level-panel ${canLevelUp ? "can-level-up" : ""}`}>
      <h3>
        Уровень {level} <span className="level-arrow">→</span> {level + 1}
      </h3> 
      <div className="requirements">
        
        {/* Прогресс Денег */}
        <div className="req-item">
          <div className={`req-label ${money >= currentReq.money ? "met" : "unmet"}`}>
            <span>Деньги</span>
            <span>{money.toLocaleString()} / {currentReq.money.toLocaleString()}</span>
          </div>
          <div className="req-bar">
            <div 
              className="req-bar-fill money" 
              style={{ width: `${moneyProgress}%` }} 
            />
          </div>
        </div>

        {/* Прогресс Количества */}
        <div className="req-item">
          <div className={`req-label ${total >= currentReq.count ? "met" : "unmet"}`}>
            <span>Продано шаурмы</span>
            <span>{total} / {currentReq.count}</span>
          </div>
          <div className="req-bar">
            <div 
              className="req-bar-fill count" 
              style={{ width: `${countProgress}%` }} 
            />
          </div>
        </div>
      </div>

      <button
        onClick={onLevelUp}
        disabled={!canLevelUp}
        className={`level-up-button ${canLevelUp ? "active" : ""}`}
      >
        {canLevelUp ? "УЛУЧШИТЬ ТОЧКУ ✨" : "НЕДОСТАТОЧНО РЕСУРСОВ"}
      </button>

      {canLevelUp && (
        <div className="level-bonus">
          🎁 Бонус: {currentReq.reward}
        </div>
      )}
    </div>
  );
}