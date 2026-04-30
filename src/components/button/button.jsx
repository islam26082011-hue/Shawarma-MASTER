import "./button.css";

export default function Button({ setCount, isCooking, setIsCooking, cookingTime, style }) {
  
  function handleStartCooking(){
    if (isCooking) return;
    
    setIsCooking(true);
    setTimeout(() => {
      setCount((prev) => prev + 1);
      setIsCooking(false);
    }, cookingTime);
  }

  return (
    <button 
      // Добавляем класс is-loading, если идет готовка
      className={`btn ${isCooking ? "is-loading" : ""}`} 
      onClick={handleStartCooking}
      disabled={isCooking}
      // Пробрасываем стиль с переменной --cooking-time дальше в HTML
      style={style} 
    >
      {isCooking ? "Готовим..." : "Готовить шаурму"}
    </button>
  );
}