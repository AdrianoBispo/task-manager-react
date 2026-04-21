import { useEffect, useState, type FormEvent } from 'react';

import type { Task, TaskPrioridade, TaskStatus, UpsertTaskPayload } from '../services/tasks-api';

type TaskFormProps = {
  initialTask?: Task | null;
  isSubmitting: boolean;
  submitLabel: string;
  onSubmit: (payload: UpsertTaskPayload) => Promise<void>;
  onCancel?: () => void;
};

function toDateInputValue(isoDate: string | null): string {
  if (!isoDate) {
    return '';
  }

  return isoDate.slice(0, 10);
}

function toIsoDate(value: string): string | null {
  if (!value) {
    return null;
  }

  return new Date(`${value}T00:00:00.000Z`).toISOString();
}

export function TaskForm({
  initialTask,
  isSubmitting,
  submitLabel,
  onSubmit,
  onCancel,
}: TaskFormProps) {
  const [titulo, setTitulo] = useState(initialTask?.titulo ?? '');
  const [descricao, setDescricao] = useState(initialTask?.descricao ?? '');
  const [status, setStatus] = useState<TaskStatus>(initialTask?.status ?? 'PENDENTE');
  const [prioridade, setPrioridade] = useState<TaskPrioridade>(initialTask?.prioridade ?? 'MEDIA');
  const [dataVencimento, setDataVencimento] = useState(
    toDateInputValue(initialTask?.data_vencimento ?? null),
  );

  useEffect(() => {
    setTitulo(initialTask?.titulo ?? '');
    setDescricao(initialTask?.descricao ?? '');
    setStatus(initialTask?.status ?? 'PENDENTE');
    setPrioridade(initialTask?.prioridade ?? 'MEDIA');
    setDataVencimento(toDateInputValue(initialTask?.data_vencimento ?? null));
  }, [initialTask]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    await onSubmit({
      titulo: titulo.trim(),
      descricao: descricao.trim() ? descricao.trim() : null,
      status,
      prioridade,
      data_vencimento: toIsoDate(dataVencimento),
    });

    if (!initialTask) {
      setTitulo('');
      setDescricao('');
      setStatus('PENDENTE');
      setPrioridade('MEDIA');
      setDataVencimento('');
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="task-titulo">Titulo</label>
      <input
        id="task-titulo"
        name="titulo"
        type="text"
        value={titulo}
        onChange={(event) => setTitulo(event.target.value)}
        required
        minLength={3}
        maxLength={100}
      />

      <label htmlFor="task-descricao">Descricao</label>
      <textarea
        id="task-descricao"
        name="descricao"
        value={descricao}
        onChange={(event) => setDescricao(event.target.value)}
      />

      <label htmlFor="task-status">Status</label>
      <select
        id="task-status"
        name="status"
        value={status}
        onChange={(event) => setStatus(event.target.value as TaskStatus)}
      >
        <option value="PENDENTE">Pendente</option>
        <option value="EM_ANDAMENTO">Em andamento</option>
        <option value="CONCLUIDA">Concluida</option>
      </select>

      <label htmlFor="task-prioridade">Prioridade</label>
      <select
        id="task-prioridade"
        name="prioridade"
        value={prioridade}
        onChange={(event) => setPrioridade(event.target.value as TaskPrioridade)}
      >
        <option value="BAIXA">Baixa</option>
        <option value="MEDIA">Media</option>
        <option value="ALTA">Alta</option>
      </select>

      <label htmlFor="task-data-vencimento">Data de vencimento</label>
      <input
        id="task-data-vencimento"
        name="data_vencimento"
        type="date"
        value={dataVencimento}
        onChange={(event) => setDataVencimento(event.target.value)}
      />

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Salvando...' : submitLabel}
      </button>

      {onCancel ? (
        <button type="button" onClick={onCancel} disabled={isSubmitting}>
          Cancelar
        </button>
      ) : null}
    </form>
  );
}
