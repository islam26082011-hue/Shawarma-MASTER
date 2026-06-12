import Game from './Game'
import AuthScreen from './auth/AuthScreen'
import { useAuth } from './hooks/useAuth'

export default function App() {
  const { user, loading, error, login, register } = useAuth();

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

  return <Game user={user} />;
}