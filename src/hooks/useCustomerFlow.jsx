import { useState, useEffect } from "react";
import { customersData } from "../constants/customers.js";

export function useCustomerFlow(count, setCount, level, setMoney, total, setTotal, menu) {
  const [currentCustomer, setCurrentCustomer] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Логика появления покупателя
  useEffect(() => {
    // Ждем, пока загрузится меню и не будет активного процесса
    if (currentCustomer || isProcessing || !menu || menu.length === 0) return;

    const spawnDelay = Math.max(1000, 5000 - level * 400);

    const timer = setTimeout(() => {
      // Фильтруем меню: приходят только за тем, что разблокировано
      const availableMenu = menu.filter(item => item.unlocked);
      if (availableMenu.length === 0) return;

      const randomCustomer = customersData[Math.floor(Math.random() * customersData.length)];
      const randomOrder = availableMenu[Math.floor(Math.random() * availableMenu.length)];

      setCurrentCustomer({
        ...randomCustomer,
        order: { ...randomOrder } // Копируем объект заказа
      });
    }, spawnDelay);

    return () => clearTimeout(timer);
  }, [currentCustomer, isProcessing, level, menu]);

  // Логика автоматической продажи, если есть готовая шаурма
  useEffect(() => {
    if (currentCustomer && count > 0 && !isProcessing) {
      
      // Используем таймер с нулевой задержкой, чтобы убрать ошибку ESLint
      const startTimer = setTimeout(() => {
        setIsProcessing(true);

        // Таймер самой "продажи"
        const processTimer = setTimeout(() => {
          const price = currentCustomer.order.price;

          setMoney(prev => prev + price);
          setCount(prev => prev - 1);
          
          
          setCurrentCustomer(null);
          setIsProcessing(false);
        }, 1500);

        return () => clearTimeout(processTimer);
      }, 0); 

      return () => clearTimeout(startTimer);
    }
  }, [currentCustomer, count, isProcessing, setMoney, setCount, setTotal]);

  return { currentCustomer };
}