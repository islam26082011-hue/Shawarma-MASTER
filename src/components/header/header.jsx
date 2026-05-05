import { useState } from "react"; // 1. Добавляем useState
import MoneyCounter from "../money_counter/MoneyCounter";
import ShawarmaCounter from "../shawarma_counter/ShawarmaCounter";
import LevelUpPanel from "../LevelUpPanel/LevelUpPanel";
import s from "./header.module.css";

export default function Header({ 
  user, money, total, level, currentReq, canLevelUp, onLevelUp 
}) {
  const [isOpen, setIsOpen] = useState(false); // Состояние бургера

  return (
    <header className={s.header}>
      <div className={s.leftSection}>
        {/* Бургер-иконка */}
        <button className={s.burgerBtn} onClick={() => setIsOpen(prev => !prev)}>
          {isOpen ? "✕" : "☰"} 
        </button>

        <div className={s.userInfo}>
          <p className={s.userId}>ID ПОВАРА: {user.uid.slice(0, 8)}</p>
          
          {/* Панель уровней, которая выпадает */}
          {isOpen && (
            <div className={s.dropdown}>
              <LevelUpPanel
                money={money}
                total={total}
                level={level}
                currentReq={currentReq}
                canLevelUp={canLevelUp}
                onLevelUp={onLevelUp}
              />
            </div>
          )}
        </div>
      </div>

      <div className={s.rightSection}>
        <MoneyCounter money={money} />
        <ShawarmaCounter count={total} />
      </div>
    </header>
  );
}