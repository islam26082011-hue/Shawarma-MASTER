import moneyIcon from "../../assets/icos/money.png"; // Импортируем как переменную
import s from "./MoneyCounter.module.css"

export default function MoneyCounter({ money }) {
  return (
    <div className="money-counter">
      <img src={moneyIcon} alt="money" /> 
      <span>{money}</span>
    </div>
  );}