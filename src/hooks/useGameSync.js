import { useEffect, useRef } from "react";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../services/firebase"; // Путь к твоему конфигу firebase

export function useGameSync(
  user, money, level, count, total, ingredients, upgrades, cookingTime, menu,
  setMoney, setLevel, setCount, setTotal, setIngredients, setUpgrades, setCookingTime, setMenu
) {
  const isInitialLoad = useRef(true);

  // 1. Загрузка данных при входе
  useEffect(() => {
    if (!user) return;

    const loadData = async () => {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        
        // Установка базовых стейтов
        setMoney(data.money || 0);
        setLevel(data.level || 1);
        // count намеренно сбрасываем в 0: шаурма на руках не переживает перезагрузку.
        // Это предотвращает баг, когда count=1 из Firebase сразу триггерит продажу
        // при появлении первого покупателя, вызывая мгновенный isSelling=true.
        setCount(0);
        setTotal(data.total || 0);
        setIngredients(data.ingredients || { chicken: 0, vegetables: 0, sauce: 0 });
        setUpgrades(data.upgrades || []);
        setCookingTime(data.cookingTime || 10000);

        // Проверка меню для СТАРОГО игрока
        if (!data.menu || data.menu.length === 0) {
          const fallbackMenu = [
            { id: 1, name: "Классическая шаурма", price: 150, recipe: { chicken: 1, vegetables: 1, sauce: 1 }, unlocked: true },
            { id: 2, name: "Сырная шаурма", price: 180, recipe: { chicken: 1, vegetables: 0, sauce: 2 }, unlocked: true },
            { id: 3, name: "Острая (Диабло)", price: 200, recipe: { chicken: 1, vegetables: 1, sauce: 2 }, unlocked: true },
            { id: 4, name: "Вегетарианская", price: 130, recipe: { chicken: 0, vegetables: 3, sauce: 1 }, unlocked: true },
            { id: 5, name: "Царская (XXL)", price: 350, recipe: { chicken: 3, vegetables: 2, sauce: 2 }, unlocked: true }
          ];

          await updateDoc(docRef, { menu: fallbackMenu });
          setMenu(fallbackMenu);
        } else {
          setMenu(data.menu);
        }
      } else {
        // Логика для НОВОГО игрока
        const initialMenu = [
          { id: 1, name: "Классическая шаурма", price: 150, recipe: { chicken: 1, vegetables: 1, sauce: 1 }, unlocked: true },
          { id: 2, name: "Сырная шаурма", price: 180, recipe: { chicken: 1, vegetables: 0, sauce: 2 }, unlocked: true },
          { id: 3, name: "Острая (Диабло)", price: 200, recipe: { chicken: 1, vegetables: 1, sauce: 2 }, unlocked: true },
          { id: 4, name: "Вегетарианская", price: 130, recipe: { chicken: 0, vegetables: 3, sauce: 1 }, unlocked: true },
          { id: 5, name: "Царская (XXL)", price: 350, recipe: { chicken: 3, vegetables: 2, sauce: 2 }, unlocked: true }
        ];

        await setDoc(docRef, {
          money: 0,
          level: 1,
          count: 0,
          total: 0,
          ingredients: { chicken: 5, vegetables: 5, sauce: 5 },
          upgrades: [],
          cookingTime: 10000,
          menu: initialMenu
        });
        setMenu(initialMenu);
      }
      isInitialLoad.current = false;
    };

    loadData();
  }, [user]);

  // 2. Сохранение данных при изменениях (Debounce)
  useEffect(() => {
    if (isInitialLoad.current || !user) return;

    const timer = setTimeout(async () => {
      const docRef = doc(db, "users", user.uid);
      await updateDoc(docRef, {
        money, level, count, total, ingredients, upgrades, cookingTime, menu
      });
      console.log("Данные Shawarma Master синхронизированы");
    }, 2000);

    return () => clearTimeout(timer);
  }, [money, level, count, total, ingredients, upgrades, cookingTime, menu, user]);
}