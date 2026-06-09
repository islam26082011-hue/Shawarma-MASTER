import { useEffect, useRef } from "react";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import { menuData } from "../constants/menu.js";

// Строим начальное меню всегда из единственного источника правды — menu.js
function buildInitialMenu() {
  return menuData.map(item => ({ ...item, priceBonus: 0 }));
}

// Мигрируем сохранённое меню: базовые данные (цена, рецепт) — из menu.js,
// флаг unlocked и прибавки от апгрейдов (priceBonus) — из сохранения.
function migrateMenu(savedMenu) {
  return menuData.map(menuItem => {
    const saved = savedMenu.find(s => s.id === menuItem.id);
    if (!saved) return { ...menuItem, priceBonus: 0 };
    return {
      ...menuItem,
      unlocked: saved.unlocked ?? menuItem.unlocked,
      priceBonus: saved.priceBonus ?? 0,
    };
  });
}

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
        setMoney(data.money || 0);
        setLevel(data.level || 1);
        setCount(0); // шаурма на руках не переживает перезагрузку
        setTotal(data.total || 0);
        setIngredients(data.ingredients || { chicken: 0, vegetables: 0, sauce: 0 });
        setUpgrades(data.upgrades || []);
        setCookingTime(data.cookingTime || 10000);

        const migratedMenu = migrateMenu(data.menu || []);
        setMenu(migratedMenu);

        // Если меню изменилось после миграции — сохраняем обратно
        await updateDoc(docRef, { menu: migratedMenu });
      } else {
        // Новый игрок
        const initialMenu = buildInitialMenu();
        await setDoc(docRef, {
          money: 0,
          level: 1,
          count: 0,
          total: 0,
          ingredients: { chicken: 5, vegetables: 5, sauce: 5 },
          upgrades: [],
          cookingTime: 10000,
          menu: initialMenu,
        });
        setMenu(initialMenu);
        setIngredients({ chicken: 5, vegetables: 5, sauce: 5 });
      }

      isInitialLoad.current = false;
    };

    loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // 2. Сохранение при изменениях (debounce 2s)
  useEffect(() => {
    if (isInitialLoad.current || !user) return;

    const timer = setTimeout(async () => {
      const docRef = doc(db, "users", user.uid);
      await updateDoc(docRef, {
        money, level, count, total, ingredients, upgrades, cookingTime, menu,
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, [money, level, count, total, ingredients, upgrades, cookingTime, menu, user]);
}
