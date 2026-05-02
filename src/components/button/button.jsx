import "./button.css";

export default function Button({ setCount, isCooking, setIsCooking, cookingTime, style, setTotal }) {
  
  function handleStartCooking(){
    if (isCooking) return;
    
    setIsCooking(true);
    setTimeout(() => {
      setCount((prev) => prev + 1);
      setTotal(prev => prev + 1)
      setIsCooking(false);
    }, cookingTime);
  }

  return (
    <div className={`btn-container ${isCooking ? "is-loading" : ""}`} style={style}>
      {/* SVG Круг прогресса */}
      <svg className="progress-svg" width="120" height="120">
        <circle 
          className="progress-circle" 
          cx="60" 
          cy="60" 
          r="54" /* Радиус чуть больше кнопки, чтобы идти снаружи */
        />
      </svg>

      <button 
        className="btn" 
        onClick={handleStartCooking}
        disabled={isCooking}
      >
        {isCooking ? "..." : "🌯"}
      </button>
    </div>
  );
}