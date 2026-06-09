import s from "./TabLevel.module.css";

export default function TabLevel({ money, total, level, currentReq, canLevelUp, onLevelUp }) {
  if (!currentReq) {
    return (
      <div className={s.tab}>
        <div className={s.maxCard}>
          <span style={{ fontSize: 64 }}>🏆</span>
          <h2>ШАУРМА-КОРОЛЬ</h2>
          <p>Все рецепты открыты, империя построена.</p>
        </div>
      </div>
    );
  }

  const moneyPct = Math.min((money / currentReq.money) * 100, 100);
  const countPct = Math.min((total / currentReq.count) * 100, 100);

  return (
    <div className={s.tab}>
      <div className={s.header}>
        <div className={s.badge}>{level}</div>
        <div className={s.headerInfo}>
          <span className={s.levelTitle}>{currentReq.title}</span>
          <span className={s.levelArrow}>→ Уровень {level + 1}</span>
        </div>
      </div>

      <div className={s.reqs}>
        <div className={s.reqRow}>
          <div className={s.reqMeta}>
            <span>💰 Деньги</span>
            <span className={money >= currentReq.money ? s.met : s.unmet}>
              {money.toLocaleString()} / {currentReq.money.toLocaleString()}
            </span>
          </div>
          <div className={s.track}>
            <div className={`${s.fill} ${s.fillMoney}`} style={{ width: `${moneyPct}%` }} />
          </div>
        </div>

        <div className={s.reqRow}>
          <div className={s.reqMeta}>
            <span>🌯 Продано</span>
            <span className={total >= currentReq.count ? s.met : s.unmet}>
              {total} / {currentReq.count}
            </span>
          </div>
          <div className={s.track}>
            <div className={`${s.fill} ${s.fillCount}`} style={{ width: `${countPct}%` }} />
          </div>
        </div>
      </div>

      {canLevelUp && (
        <div className={s.rewardHint}>🎁 {currentReq.reward}</div>
      )}

      <button
        className={`${s.btn} ${canLevelUp ? s.ready : s.notReady}`}
        onClick={onLevelUp}
        disabled={!canLevelUp}
      >
        {canLevelUp ? "ПОВЫСИТЬ УРОВЕНЬ ✨" : "Ещё не готов"}
      </button>
    </div>
  );
}
