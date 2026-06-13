import { useState, useEffect, useRef, useCallback } from "react";
import { customersData } from "../constants/customers.js";

export function useCustomerFlow(
  count,
  setCount,
  level,
  setMoney,
  setTotal,
  menu,
  moneyMultiplier = 1,
) {
  const [currentCustomer, setCurrentCustomer] = useState(null); // Кто сейчас стоит у кассы
  const [isSelling, setIsSelling] = useState(false);           // Идет ли сейчас процесс анимации/продажи

  const spawnTimerRef = useRef(null);   // Таймер ожидания нового клиента
  const sellTimerRef = useRef(null);    // Таймер процесса продажи (0.7 секунды)
  const currentCustomerRef = useRef(null); 
  const isSellingRef = useRef(false);
  const shawarmaReadyRef = useRef(false); // Лежит ли готовая шаурма на прилавке

  useEffect(() => { 
    currentCustomerRef.current = currentCustomer;
  }, [currentCustomer]);

  useEffect(() => {
    isSellingRef.current = isSelling;
  }, [isSelling]);

  const markShawarmaReady = useCallback(() => {
    shawarmaReadyRef.current = true;
  }, []);

  // Спавн покупателя
  useEffect(() => {
    if (currentCustomer) return; // Если у кассы УЖЕ кто-то стоит — нового не зовем
    if (isSelling) return;       // Если мы прямо сейчас рассчитываем клиента — не отвлекаемся
    if (!menu || menu.length === 0) return; // Если меню пустое — торговать нечем
  
    // Отсекаем заблокированные блюда. К нам приходят только за тем, что мы умеем готовить!
    const availableMenu = menu.filter(item => item.unlocked);
    if (availableMenu.length === 0) return;
  
    // Формула скорости: чем выше уровень игрока (level), тем БЫСТРЕЕ прибежит клиент.
    // Но не быстрее, чем за 1 секунду (Math.max(1000, ...))
    const spawnDelay = Math.max(1000, 5000 - level * 400);
  
    spawnTimerRef.current = setTimeout(() => {
      // Выбираем случайного визуала для покупателя (из базы данных покупателей)
      const randomCustomer = customersData[Math.floor(Math.random() * customersData.length)];
      // Выбираем случайное блюдо из тех, что у нас открыты
      const randomOrder = availableMenu[Math.floor(Math.random() * availableMenu.length)];
      
      // Сажаем покупателя за кассу и прикрепляем к нему его заказ!
      setCurrentCustomer({ ...randomCustomer, order: randomOrder });
    }, spawnDelay);
  
    return () => clearTimeout(spawnTimerRef.current); // Если игрок вышел, отменяем таймер
  }, [currentCustomer, isSelling, level, menu]);
  // Продажа
  useEffect(() => {
    if (count <= 0) return;
    if (!shawarmaReadyRef.current) return;
    if (isSellingRef.current) return;
    if (!currentCustomerRef.current) return;

    shawarmaReadyRef.current = false;
    setIsSelling(true);
    isSellingRef.current = true;

    const customer = currentCustomerRef.current;

    sellTimerRef.current = setTimeout(() => {
      setMoney(prev => prev + Math.round(customer.order.price * moneyMultiplier));
      setTotal(prev => prev + 1);
      setCount(0);
      setCurrentCustomer(null);
      setIsSelling(false);
      isSellingRef.current = false;
    }, 700);

    return () => clearTimeout(sellTimerRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, setCount, setMoney, setTotal, moneyMultiplier]);

  return { currentCustomer, isSelling, markShawarmaReady };
}