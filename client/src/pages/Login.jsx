import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setErr('');
    setIsLoading(true);
    try {
      await login(email, password);
      window.location.href = '/Dashboard';
    } catch (e) { 
      setErr(e.message || 'Error al iniciar sesión'); 
    } finally {
      setIsLoading(false);
    }
  }

  const styles = {
    container: {
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    },
    card: {
      background: 'white',
      borderRadius: '20px',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
      overflow: 'hidden',
      width: '100%',
      maxWidth: '400px'
    },
    header: {
      textAlign: 'center',
      padding: '40px 30px 20px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white'
    },
    icon: {
      width: '60px',
      height: '60px',
      background: 'rgba(255, 255, 255, 0.2)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 20px',
      fontSize: '24px'
    },
    title: {
      fontSize: '28px',
      fontWeight: '600',
      marginBottom: '8px'
    },
    subtitle: {
      opacity: '0.9',
      fontSize: '16px'
    },
    form: {
      padding: '30px'
    },
    formGroup: {
      marginBottom: '20px'
    },
    label: {
      display: 'block',
      fontSize: '14px',
      fontWeight: '500',
      color: '#333',
      marginBottom: '8px'
    },
    inputWrapper: {
      position: 'relative'
    },
    input: {
      width: '100%',
      padding: '15px 20px',
      border: '2px solid #e1e5e9',
      borderRadius: '12px',
      fontSize: '16px',
      background: '#f8f9fa',
      transition: 'all 0.3s ease',
      boxSizing: 'border-box'
    },
    inputFocus: {
      outline: 'none',
      borderColor: '#667eea',
      background: 'white',
      boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)'
    },
    passwordToggle: {
      position: 'absolute',
      right: '15px',
      top: '50%',
      transform: 'translateY(-50%)',
      background: 'none',
      border: 'none',
      color: '#6b7280',
      cursor: 'pointer',
      fontSize: '18px',
      padding: '5px'
    },
    button: {
      width: '100%',
      padding: '15px 20px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    buttonDisabled: {
      opacity: '0.7',
      cursor: 'not-allowed'
    },
    spinner: {
      width: '20px',
      height: '20px',
      border: '2px solid transparent',
      borderTop: '2px solid white',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      marginRight: '10px'
    },
    alert: {
      padding: '12px 16px',
      borderRadius: '10px',
      marginTop: '15px',
      fontSize: '14px',
      display: 'flex',
      alignItems: 'center',
      background: '#fef2f2',
      color: '#dc2626',
      border: '1px solid #fecaca'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.icon}>🔒</div>
          <h1 style={styles.title}>Iniciar sesión</h1>
          <p style={styles.subtitle}>Accede a tu cuenta</p>
        </div>
        <div style={styles.form}>
          <form onSubmit={onSubmit}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Email</label>
              <input
                style={styles.input}
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Contraseña</label>
              <div style={styles.inputWrapper}>
                <input
                  style={styles.input}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  style={styles.passwordToggle}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>
            <button
              type="submit"
              style={{
                ...styles.button,
                ...(isLoading ? styles.buttonDisabled : {})
              }}
              disabled={isLoading}
            >
              {isLoading && <div style={styles.spinner}></div>}
              {isLoading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
          {err && (
            <div style={styles.alert}>
              <div style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: '#dc2626',
                marginRight: '8px'
              }}></div>
              {err}
            </div>
          )}
        </div>
      </div>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}