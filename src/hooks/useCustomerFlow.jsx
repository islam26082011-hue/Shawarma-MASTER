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
  const [currentCustomer, setCurrentCustomer] = useState(null);
  const [isSelling, setIsSelling] = useState(false);

  const spawnTimerRef = useRef(null);
  const sellTimerRef = useRef(null);
  const currentCustomerRef = useRef(null);
  const isSellingRef = useRef(false);
  const shawarmaReadyRef = useRef(false);

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
    if (currentCustomer) return;
    if (isSelling) return;
    if (!menu || menu.length === 0) return;

    const availableMenu = menu.filter(item => item.unlocked);
    if (availableMenu.length === 0) return;

    const spawnDelay = Math.max(1000, 5000 - level * 400);

    spawnTimerRef.current = setTimeout(() => {
      const randomCustomer = customersData[Math.floor(Math.random() * customersData.length)];
      const randomOrder = availableMenu[Math.floor(Math.random() * availableMenu.length)];
      setCurrentCustomer({ ...randomCustomer, order: randomOrder });
    }, spawnDelay);

    return () => clearTimeout(spawnTimerRef.current);
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