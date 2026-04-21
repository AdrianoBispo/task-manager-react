import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { register } from '../services/auth-api';

export function RegisterPage() {
  const navigate = useNavigate();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      await register({ nome, email, senha });
      navigate('/tasks', { replace: true });
    } catch {
      setErrorMessage('Nao foi possivel concluir o cadastro.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="page" aria-labelledby="register-title">
      <section className="card">
        <h1 id="register-title">Cadastro</h1>
        <p>Crie sua conta para começar a organizar tarefas.</p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="register-nome">Nome</label>
          <input
            id="register-nome"
            name="nome"
            type="text"
            autoComplete="name"
            autoFocus
            value={nome}
            onChange={(event) => setNome(event.target.value)}
            required
          />

          <label htmlFor="register-email">E-mail</label>
          <input
            id="register-email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <label htmlFor="register-senha">Senha</label>
          <input
            id="register-senha"
            name="senha"
            type="password"
            autoComplete="new-password"
            value={senha}
            onChange={(event) => setSenha(event.target.value)}
            required
          />

          {errorMessage ? <p role="alert" aria-live="assertive">{errorMessage}</p> : null}

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Criando conta...' : 'Criar conta'}
          </button>
        </form>

        <p>
          Ja possui conta? <Link to="/login">Entrar</Link>
        </p>
      </section>
    </main>
  );
}
