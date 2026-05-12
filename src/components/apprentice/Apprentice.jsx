import React, { useState, useEffect } from "react";
import "./Apprentice.module.css";

export default function Apprentice({ hasApprentice }) {
  const [progress, setProgress] = useState(0);

  const INTERVAL_MS = 15000; // 15 секунд
  const MONEY_PER_CYCLE = 500;
  const UPDATE_FREQ = 50; // обновления прогресса 50 раз в секунду для плавности

  useEffect(() => {
    if (!hasApprentice) {
      setProgress(0);
      return;
    }

    let elapsed = 0;
    const timer = setInterval(() => {
      elapsed += UPDATE_FREQ;
      const newProgress = (elapsed % INTERVAL_MS) / INTERVAL_MS;
      setProgress(newProgress);
    }, UPDATE_FREQ);

    return () => clearInterval(timer);
  }, [hasApprentice]);

  if (!hasApprentice) return null;

  const progressPercent = Math.round(progress * 100);
  const timeLeft = Math.ceil((1 - progress) * (INTERVAL_MS / 1000));

  return (
    <div className="apprentice-container">
      <div className="apprentice-card">
        <div className="apprentice-header">
          <span className="apprentice-emoji">👨‍🍳</span>
          <h3>Стажер работает</h3>
        </div>

        <div className="progress-wrapper">
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          <div className="progress-text">
            <span className="time-left">{timeLeft}с</span>
            <span className="money-icon">💰 +{MONEY_PER_CYCLE}</span>
          </div>
        </div>

        <div className="apprentice-stats">
          <div className="stat">
            <span className="label">За цикл:</span>
            <span className="value">{MONEY_PER_CYCLE} сом</span>
          </div>
          <div className="stat">
            <span className="label">За час:</span>
            <span className="value">{Math.round(MONEY_PER_CYCLE * 3600 / INTERVAL_MS * 1000) / 1000} сом</span>
          </div>
        </div>

        <p className="apprentice-hint">✓ Стажер автоматически приносит тебе деньги</p>
      </div>
    </div>
  );
}
