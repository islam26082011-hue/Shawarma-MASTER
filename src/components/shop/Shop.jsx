import React from "react";
import { UPGRADES, BOOSTS } from "../../constants/upgrades";

export default function Shop({ money, setMoney, upgrades, setUpgrades }) {
  const handlePurchase = (item) => {
    if (money >= item.cost) {
      setMoney((prev) => prev - item.cost);
      setUpgrades((prev) => [...prev, item]);
    } if(money <= item.cost){
      alert("не хватает бабок")
    }
  };

  return (
    <div className="shop">
      <h3>Магазин</h3>
      <h4>Улучшения</h4>
      {UPGRADES.map((upgrade) => (
        <button key={upgrade.id} onClick={() => handlePurchase(upgrade)}>
          {upgrade.name} - {upgrade.cost} 💰
        </button>
      ))}
      <h4>Бусты</h4>
      {BOOSTS.map((boost) => (
        <button key={boost.id} onClick={() => handlePurchase(boost)}>
          {boost.name} - {boost.cost} 💰
        </button>
      ))}
    </div>
  );
}