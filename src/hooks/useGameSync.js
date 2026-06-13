// импорты
import { useEffect, useRef, useCallback, useState } from "react";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import { menuData } from "../constants/menu.js";



function buildInitialMenu() { //объявляем функцию создания базового меню, где добавляем поле priceBonus
  return menuData.map(item => ({ ...item, priceBonus: 0 }));
}


function migrateMenu(savedMenu) { 
  // 1. Берем актуальный список блюд из файлов игры (menuData) и перебираем каждое блюдо
  return menuData.map(menuItem => {
    
    // 2. Ищем, есть ли это конкретное блюдо в старых сохранениях игрока (ищем по id)
    const saved = savedMenu.find(s => s.id === menuItem.id);
    
    // 3. Если игрок никогда не видел этого блюда (это новинка из обновления):
    // возвращаем стандартное блюдо, но принудительно добавляем ему бонус к цене = 0
    if (!saved) return { ...menuItem, priceBonus: 0 };
    
    // 4. Если игрок уже сталкивался с этим блюдом, мы «склеиваем» данные:
    return {
      ...menuItem, // Берем базовые данные блюда (картинку, название)
      
      // Если в сохранении написано, открыто оно или нет — берем из сохранения. 
      // Если в сохранении этого нет — берем стандартное значение из кода.
      unlocked: saved.unlocked ?? menuItem.unlocked,
      
      // Если в сохранении уже есть бонус к цене — берем его. Если нет — ставим 0.
      priceBonus: saved.priceBonus ?? 0,
    };
  });
}

// saveStatus: "idle" | "saving" | "saved"
export function useGameSync(
  user, money, level, count, total, ingredients, upgrades, cookingTime, menu,
  setMoney, setLevel, setCount, setTotal, setIngredients, setUpgrades, setCookingTime, setMenu
) {
  // FIX: используем два ref — isReady говорит debounce/интервалу, что данные загружены
  // isLoading говорит, что прямо сейчас идёт первичная загрузка
  const isReady = useRef(false);
  const [saveStatus, setSaveStatus] = useState("idle"); // для индикатора

  // Актуальные значения — всегда свежие, без stale closure
  const stateRef = useRef({});
  stateRef.current = { money, level, count, total, ingredients, upgrades, cookingTime, menu };

  // Внутренняя функция сохранения с обновлением статуса
  const performSave = useCallback(async (uid) => {
    const docRef = doc(db, "users", uid);
    setSaveStatus("saving");
    try {
      await updateDoc(docRef, { ...stateRef.current });
      setSaveStatus("saved");
      // Через 2.5s вернуть в idle
      setTimeout(() => setSaveStatus("idle"), 2500);
    } catch (e) {
      setSaveStatus("idle");
      console.error("Save failed:", e);
    }
  }, []);

  // Функция ручного сохранения — для кнопки "Сохранить"
  const saveNow = useCallback(async () => {
    if (!user) return;
    await performSave(user.uid);
  }, [user, performSave]);

  // 1. Загрузка данных при входе
  useEffect(() => {
    if (!user) return;

    // FIX: сбрасываем готовность при смене пользователя
    isReady.current = false;

    const loadData = async () => {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        // FIX: сначала все setState, потом isReady = true
        // Чтобы debounce-эффект не сработал с нулями во время загрузки
        setMoney(data.money ?? 0);
        setLevel(data.level ?? 1);
        setCount(0); // шаурма на руках не переживает перезагрузку
        setTotal(data.total ?? 0);
        setIngredients(data.ingredients ?? { chicken: 0, vegetables: 0, sauce: 0 });
        setUpgrades(data.upgrades ?? []);
        setCookingTime(data.cookingTime ?? 10000);

        const migratedMenu = migrateMenu(data.menu ?? []);
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

      // FIX: isReady = true ПОСЛЕ того как все setState отправлены.
      // React батчует setState — к следующему рендеру данные уже будут корректными.
      // Ставим через setTimeout(0) чтобы гарантировать что debounce-эффект
      // отработает уже с правильными данными, а не с нулями.
      setTimeout(() => {
        isReady.current = true;
      }, 0);
    };

    loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // 2. Автосохранение каждые 60 секунд
  useEffect(() => {
    if (!user) return;
    const interval = setInterval(() => {
      if (!isReady.current) return;
      performSave(user.uid);
    }, 60000);
    return () => clearInterval(interval);
  }, [user, performSave]);

  // 3. Debounce-сохранение при изменениях (2s)
  // FIX: проверяем isReady.current — не isInitialLoad (который мог быть false преждевременно)
  useEffect(() => {
    if (!isReady.current || !user) return;

    const timer = setTimeout(() => {
      if (!isReady.current) return; // доп. проверка внутри таймера
      performSave(user.uid);
    }, 2000);

    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [money, level, count, total, ingredients, upgrades, cookingTime, menu, user]);

  return { saveNow, saveStatus };
}
