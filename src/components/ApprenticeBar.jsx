import { useState, useEffect } from "react";
import s from "./ApprenticeBar.module.css";

const INTERVAL_MS = 15000;

export default function ApprenticeBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let elapsed = 0;
    const t = setInterval(() => {
      elapsed += 50;
      setProgress((elapsed % INTERVAL_MS) / INTERVAL_MS);
    }, 50);
    return () => clearInterval(t);
  }, []);

  const timeLeft = Math.ceil((1 - progress) * (INTERVAL_MS / 1000));

  return (
    <div className={s.bar}>
      <span>👨‍🍳</span>
      <div className={s.track}>
        <div className={s.fill} style={{ width: `${progress * 100}%` }} />
      </div>
      <span className={s.info}>+500с / {timeLeft}с</span>
    </div>
  );
}
