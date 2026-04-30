import Pokupatel from "../pokupatel/pokupatel";
export default function Window({ currentCustomer }) {
  const windowClass = !currentCustomer ? 'window hidden' : 'window';

  
  return (
    <div className={windowClass}>
      {currentCustomer ? (
        <>
          <Pokupatel data={currentCustomer} />
          <p className="dialog-bubble">{currentCustomer.phrase}</p>
          <p>Заказ: <strong>{currentCustomer.order.name}</strong>, Цена:{currentCustomer.order.price} </p>
        </>
      ) : (
        <p>Ожидание следующего клиента...</p>
      )}
    </div>
  );
}