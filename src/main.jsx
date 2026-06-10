import React from 'react'
import ReactDOM from 'react-dom/client'
import Game from './Game'
import AuthScreen from './auth/AuthScreen'
import { useAuth } from './hooks/useAuth'
import './Game.css'

function App() {
  const { user, loading, error, login, register, logout } = useAuth();

  if (loading) {
    return (
      <div style={{
        height: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg)',
        fontSize: '32px',
      }}>
        🌯
      </div>
    );
  }

  if (!user) {
    return <AuthScreen login={login} register={register} error={error} />;
  }

  return <Game user={user} onLogout={logout} />;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
