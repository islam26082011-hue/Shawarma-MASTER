import Pokupatel from "../pokupatel/pokupatel";
import './window.css';

export default function Window({ currentCustomer }) {
  const windowClass = !currentCustomer ? 'window hidden' : 'window';

  
  return (
    <div className={windowClass}>
      {currentCustomer ? (
        <>
          <Pokupatel data={currentCustomer} />
          <p className="dialog-bubble">{currentCustomer.phrase}</p>
          <p className="order-info">Заказ: <strong>{currentCustomer.order.name}</strong>, Цена:{currentCustomer.order.price} </p>
        </>
      ) : (
        <p className="waiting-text">Ожидание следующего клиента...</p>
      )}
    </div>
  );
}