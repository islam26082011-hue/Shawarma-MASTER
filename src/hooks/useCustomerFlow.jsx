import { useState, useEffect } from "react";
import { customersData } from "../constants/customers.js";
import { menuData } from "../constants/menu.js";

export function useCustomerFlow(count, setCount, level, setMoney, total, setTotal) {
  const [currentCustomer, setCurrentCustomer] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const spawnDelay = Math.max(200, 5000 - level * 500);

  // 1. Появление покупателя
  useEffect(() => {
    if (currentCustomer || isProcessing) return;

    const timer = setTimeout(() => {
      const randomCustomer =
        customersData[Math.floor(Math.random() * customersData.length)];
      const randomOrder = menuData[Math.floor(Math.random() * menuData.length)];

      setCurrentCustomer({
        ...randomCustomer,
        order: randomOrder,
      });
    }, spawnDelay);

    return () => clearTimeout(timer);
  }, [currentCustomer, isProcessing, spawnDelay]);

  // 2. Логика продажи (исправленная)
  useEffect(() => {
    // Если есть покупатель и есть товар, и мы еще не в процессе...
    if (currentCustomer && count > 0 && !isProcessing) {
      
      // Оборачиваем в таймер, чтобы вынести обновление стейта из основного потока рендера
      const processTimer = setTimeout(() => {
        setIsProcessing(true);

        // Имитируем время на покупку (1 секунда)
        setTimeout(() => {
          setMoney((prev) => prev + currentCustomer.order.price);
          // Уменьшаем текущий запас на 1 (или на количество в заказе)
          setCount((prev) => prev - 1); 
          
          setCurrentCustomer(null);
          setIsProcessing(false);
        }, 1000);
      }, 0); 

      return () => clearTimeout(processTimer);
    }
  }, [currentCustomer, count, isProcessing, setCount, setMoney, setTotal]);

  return { currentCustomer };
}