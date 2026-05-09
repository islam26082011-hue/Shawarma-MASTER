import { useState, useEffect, useRef, useCallback } from "react";
import { customersData } from "../constants/customers.js";

export function useCustomerFlow(
  count,
  setCount,
  level,
  setMoney,
  setTotal,
  menu
) {
  const [currentCustomer, setCurrentCustomer] = useState(null);
  const [isSelling, setIsSelling] = useState(false);

  const spawnTimerRef = useRef(null);
  const sellTimerRef = useRef(null);

  // Ref-копии актуальных значений — чтобы таймер продажи
  // всегда читал свежие данные, даже если deps изменились
  const currentCustomerRef = useRef(null);
  const isSellingRef = useRef(false);
  const shawarmaReadyRef = useRef(false);

  // Синхронизируем refs со state
  currentCustomerRef.current = currentCustomer;
  isSellingRef.current = isSelling;

  const markShawarmaReady = useCallback(() => {
    shawarmaReadyRef.current = true;
  }, []);

  // =========================
  // СПАВН ПОКУПАТЕЛЯ
  // =========================
  useEffect(() => {
    if (currentCustomer) return;
    if (isSelling) return;
    if (!menu || menu.length === 0) return;

    const availableMenu = menu.filter(item => item.unlocked);
    if (availableMenu.length === 0) return;

    const spawnDelay = Math.max(1000, 5000 - level * 400);

    spawnTimerRef.current = setTimeout(() => {
      const randomCustomer =
        customersData[Math.floor(Math.random() * customersData.length)];
      const randomOrder =
        availableMenu[Math.floor(Math.random() * availableMenu.length)];

      setCurrentCustomer({ ...randomCustomer, order: randomOrder });
    }, spawnDelay);

    return () => clearTimeout(spawnTimerRef.current);
  }, [currentCustomer, isSelling, level, menu]);

  // =========================
  // ПРОДАЖА
  // =========================
  // Следим ТОЛЬКО за count и shawarmaReadyRef.
  // isSelling намеренно НЕ в deps — чтобы React не перезапускал
  // этот эффект (и не отменял таймер) когда мы сами ставим isSelling=true.
  useEffect(() => {
    if (count <= 0) return;
    if (!shawarmaReadyRef.current) return;

    // Читаем актуальное значение через ref, не через замыкание
    if (isSellingRef.current) return;
    if (!currentCustomerRef.current) return;

    shawarmaReadyRef.current = false;
    setIsSelling(true);
    isSellingRef.current = true;

    // Захватываем покупателя через ref — он не протухнет
    const customer = currentCustomerRef.current;

    sellTimerRef.current = setTimeout(() => {
      setMoney(prev => prev + customer.order.price);
      setTotal(prev => prev + 1);
      setCount(0);
      setCurrentCustomer(null);
      setIsSelling(false);
      isSellingRef.current = false;
    }, 700);

    // Cleanup НЕ отменяет таймер — он должен завершиться.
    // Отменяем только если компонент размонтируется.
    return () => {
      clearTimeout(sellTimerRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, setCount, setMoney, setTotal]);

  return {
    currentCustomer,
    isSelling,
    markShawarmaReady,
  };
}