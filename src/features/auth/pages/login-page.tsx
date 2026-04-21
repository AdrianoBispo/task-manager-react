import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { login } from '../services/auth-api';

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      await login({ email, senha });
      navigate('/tasks', { replace: true });
    } catch {
      setErrorMessage('Nao foi possivel entrar com essas credenciais.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="page" aria-labelledby="login-title">
      <section className="card">
        <h1 id="login-title">Login</h1>
        <p>Acesse sua conta para gerenciar suas tarefas.</p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="login-email">E-mail</label>
          <input
            id="login-email"
            name="email"
            type="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <label htmlFor="login-senha">Senha</label>
          <input
            id="login-senha"
            name="senha"
            type="password"
            autoComplete="current-password"
            value={senha}
            onChange={(event) => setSenha(event.target.value)}
            required
          />

          {errorMessage ? <p role="alert" aria-live="assertive">{errorMessage}</p> : null}

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p>
          Ainda nao tem conta? <Link to="/cadastro">Criar cadastro</Link>
        </p>
      </section>
    </main>
  );
}
