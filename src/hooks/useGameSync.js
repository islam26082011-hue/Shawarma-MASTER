import { useEffect } from "react";
import { db } from "../services/firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

export function useGameSync(user, money, level, count, setMoney, setLevel, setCount, total, setTotal) {
  // Загрузка данных при входе
  useEffect(() => {
    if (!user?.uid) return;

    const fetchData = async () => {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setCount(data.count || 0);
        setLevel(data.level || 1);
        setMoney(data.money || 0);
        setTotal(data.total || 0)
      } else {
        await setDoc(docRef, { count: 0, level: 1, money: 0 });
      }
    };
    fetchData();
  },[user?.uid, setCount, setLevel, setMoney]); // Сработает один раз при логине

  // Авто-сохранение (Debounce)
  useEffect(() => {
    if (!user?.uid) return;

    const timeoutId = setTimeout(() => {
      const dataToSave = {
        money: Number(money),
        count: Number(count),
        level: Number(level),
        total: Number(total)
      };

      const docRef = doc(db, "users", user.uid);
      updateDoc(docRef, dataToSave)
        .then(() => console.log("Данные повара в облаке! ✨"))
        .catch((e) => console.error("Ошибка синхронизации:", e));
    }, 2000); 

    return () => clearTimeout(timeoutId);
  }, [money, count, level, user?.uid, setMoney, setCount, setLevel]);
}