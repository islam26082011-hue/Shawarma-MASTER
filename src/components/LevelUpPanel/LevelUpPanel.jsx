import React from "react";

export default function LevelUpPanel({ money, total, currentReq, canLevelUp, onLevelUp, level }) {
  if (!currentReq) {
    return (
      <div className="level-panel max-level" style={{ textAlign: 'center', padding: '20px', border: '2px solid #bc13fe', borderRadius: '15px', boxShadow: '0 0 15px #bc13fe' }}>
        <h3 style={{ color: "#bc13fe", textShadow: "0 0 10px #bc13fe" }}>🏆 ШАУРМА-КОРОЛЬ</h3>
        <p style={{ color: '#fff', fontSize: '14px' }}>Все рецепты открыты, империя построена.</p>
      </div>
    );
  }

  // Расчет процентов для прогресс-бара
  const moneyProgress = Math.min((money / currentReq.money) * 100, 100);
  const countProgress = Math.min((total / currentReq.count) * 100, 100);

  return (
    <div className="level-panel" style={{
      border: "1px solid #bc13fe",
      padding: "20px",
      borderRadius: "16px",
      background: "rgba(188, 19, 254, 0.05)",
      boxShadow: canLevelUp ? "0 0 20px rgba(188, 19, 254, 0.2)" : "none",
      margin: "20px 0",
      fontFamily: "'Inter', sans-serif" // Или твой Swiss font
    }}>
      <h3 style={{ margin: "0 0 15px 0", fontSize: "16px", color: "black", textTransform: "uppercase", letterSpacing: "1px" }}>
        Уровень {level} <span style={{ color: "#bc13fe" }}>→</span> {level + 1}
      </h3> 
      <div className="requirements" style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
        
        {/* Прогресс Денег */}
        <div className="req-item">
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '5px', color: money >= currentReq.money ? "#00ffcc" : "#aaa" }}>
            <span>Деньги</span>
            <span>{money.toLocaleString()} / {currentReq.money.toLocaleString()}</span>
          </div>
          <div style={{ width: '100%', height: '4px', background: '#333', borderRadius: '2px' }}>
            <div style={{ width: `${moneyProgress}%`, height: '100%', background: '#bc13fe', boxShadow: '0 0 8px #bc13fe', transition: '0.5s' }} />
          </div>
        </div>

        {/* Прогресс Количества */}
        <div className="req-item">
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '5px', color: total >= currentReq.count ? "#00ffcc" : "#aaa" }}>
            <span>Продано шаурмы</span>
            <span>{total} / {currentReq.count}</span>
          </div>
          <div style={{ width: '100%', height: '4px', background: '#333', borderRadius: '2px' }}>
            <div style={{ width: `${countProgress}%`, height: '100%', background: '#00ffcc', boxShadow: '0 0 8px #00ffcc', transition: '0.5s' }} />
          </div>
        </div>
      </div>

      <button
        onClick={onLevelUp}
        disabled={!canLevelUp}
        className={canLevelUp ? "neon-button-active" : ""}
        style={{
          width: "100%",
          padding: "14px",
          backgroundColor: canLevelUp ? "#bc13fe" : "transparent",
          color: canLevelUp ? "#fff" : "#555",
          border: canLevelUp ? "none" : "1px solid #333",
          borderRadius: "8px",
          cursor: canLevelUp ? "pointer" : "not-allowed",
          fontWeight: "bold",
          fontSize: "14px",
          transition: "0.3s all ease"
        }}
      >
        {canLevelUp ? "УЛУЧШИТЬ ТОЧКУ ✨" : "НЕДОСТАТОЧНО РЕСУРСОВ"}
      </button>

      {canLevelUp && (
        <div style={{ marginTop: '10px', color: '#00ffcc', fontSize: '11px', textAlign: 'center', animation: 'fadeIn 0.5s' }}>
          🎁 Бонус: {currentReq.reward}
        </div>
      )}
    </div>
  );
}