import React from "react";

export default function LevelUpPanel({ money, total, currentReq, canLevelUp, onLevelUp, level }) {
  // Если достигнут макс. уровень (в конфиге больше нет данных)
  if (!currentReq) {
    return (
      <div className="level-panel max-level">
        <h3 style={{ color: "#bc13fe" }}>🏆 ВЫ — ШАУРМА-КОРОЛЬ!</h3>
        <p>Все рецепты открыты, империя построена.</p>
      </div>
    );
  }

  return (
    <div className="level-panel" style={{
      border: "1px solid #bc13fe",
      padding: "15px",
      borderRadius: "12px",
      background: "rgba(188, 19, 254, 0.05)",
      margin: "20px 0",
      textAlign: "center"
    }}>
      <h3 style={{ margin: "0 0 10px 0", fontSize: "14px" }}>
        ЦЕЛЬ: {currentReq.title} (Ур. {level} → {level + 1})
      </h3>

      <div className="req-list" style={{ marginBottom: "15px" }}>
        {/* Прогресс по деньгам */}
        <div style={{ color: money >= currentReq.money ? "#00ff00" : "#ff4d4d" }}>
          💰 Деньги: {money.toLocaleString()} / {currentReq.money.toLocaleString()}
        </div>
        
        {/* Прогресс по общему количеству (Total) */}
        <div style={{ color: total >= currentReq.count ? "#00ff00" : "#ff4d4d" }}>
          🌯 Всего сделано: {total} / {currentReq.count}
        </div>
      </div>

      <button
        onClick={onLevelUp}
        disabled={!canLevelUp}
        className={canLevelUp ? "neon-pulse" : ""}
        style={{
          width: "100%",
          padding: "12px",
          backgroundColor: canLevelUp ? "#bc13fe" : "#333",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: canLevelUp ? "pointer" : "not-allowed",
          fontWeight: "bold",
          transition: "0.3s"
        }}
      >
        {canLevelUp ? "ПОВЫСИТЬ УРОВЕНЬ ✨" : "НУЖНО БОЛЬШЕ РЕСУРСОВ"}
      </button>
      
      {canLevelUp && (
        <p style={{ fontSize: "10px", marginTop: "8px", color: "#bc13fe" }}>
          Награда: {currentReq.reward}
        </p>
      )}
    </div>
  );
}