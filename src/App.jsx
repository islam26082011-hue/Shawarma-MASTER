import React, { useState, useEffect } from 'react';
import { auth } from './services/firebase'; 
import Auth from './components/auth/auth'; 
import Game from './Game'; 

function App() {
  const [user, setUser] = useState(null); // Стейт для хранения залогиненного юзера
  const [loading, setLoading] = useState(true); // Пока Firebase проверяет вход, покажем загрузку

  useEffect(() => {
    // Эта функция — «слушатель». Она сама поймет, если юзер уже логинился ранее
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser); // Если юзер есть — сохраняем его в стейт
      setLoading(false); // Проверка закончена
    });
    return () => unsubscribe(); // Чистим за собой
  }, []);

  if (loading) return <div>Загрузка повара...</div>; // Чтобы экран не мигал при перезагрузке

  return (
    <div className="App">
      {/* Условный рендеринг: если user не null — рендерим Game, иначе Auth */}
      {user ? <Game user={user} /> : <Auth setUser={setUser} />}
    </div>
  );
}

export default App;