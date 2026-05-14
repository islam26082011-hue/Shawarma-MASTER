import React, { useState } from 'react';
import { auth } from '../../services/firebase.js'; 
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import './auth.css';

const Auth = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); 
  const [isRegister, setIsRegister] = useState(true); 

  const handleAuth = async () => {
    try {
      if (isRegister) {
        
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        setUser(userCredential.user); 
      } else {
        
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        setUser(userCredential.user);
      }
    } catch (error) {
      alert(error.message); 
    }
  };

  return (
    <div className="auth-container">
      <h2>{isRegister ? 'Регистрация' : 'Вход'}</h2>
      <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Пароль" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleAuth}>{isRegister ? 'Создать акк' : 'Войти'}</button>
      <p className="toggle-text" onClick={() => setIsRegister(!isRegister)}>
        {isRegister ? 'Уже есть аккаунт? Войти' : 'Нет аккаунта? Регистрация'}
      </p>
    </div>
  );
};

export default Auth;