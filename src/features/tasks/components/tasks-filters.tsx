import { useEffect, useState, type FormEvent } from 'react';

import type { TaskPrioridade, TaskSort, TaskStatus } from '../services/tasks-api';

export type TasksFiltersValue = {
  q: string;
  status: TaskStatus | 'TODOS';
  prioridade: TaskPrioridade | 'TODAS';
  sort: TaskSort;
};

type TasksFiltersProps = {
  value: TasksFiltersValue;
  isBusy?: boolean;
  onApply: (value: TasksFiltersValue) => void;
};

const DEFAULT_FILTERS: TasksFiltersValue = {
  q: '',
  status: 'TODOS',
  prioridade: 'TODAS',
  sort: '-data_criacao',
};

export function TasksFilters({ value, isBusy = false, onApply }: TasksFiltersProps) {
  const [draft, setDraft] = useState<TasksFiltersValue>(value);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    onApply({
      ...draft,
      q: draft.q.trim(),
    });
  }

  function handleClear() {
    setDraft(DEFAULT_FILTERS);
    onApply(DEFAULT_FILTERS);
  }

  return (
    <form className="filters" onSubmit={handleSubmit} aria-label="Filtros de tarefas">
      <fieldset disabled={isBusy}>
        <legend>Filtros e busca</legend>

        <label htmlFor="tasks-filter-q">Buscar por titulo ou descricao</label>
        <input
          id="tasks-filter-q"
          name="q"
          type="search"
          value={draft.q}
          onChange={(event) => setDraft((current) => ({ ...current, q: event.target.value }))}
          placeholder="Ex.: relatorio"
        />

        <label htmlFor="tasks-filter-status">Status</label>
        <select
          id="tasks-filter-status"
          name="status"
          value={draft.status}
          onChange={(event) =>
            setDraft((current) => ({
              ...current,
              status: event.target.value as TasksFiltersValue['status'],
            }))
          }
        >
          <option value="TODOS">Todos</option>
          <option value="PENDENTE">Pendente</option>
          <option value="EM_ANDAMENTO">Em andamento</option>
          <option value="CONCLUIDA">Concluida</option>
        </select>

        <label htmlFor="tasks-filter-prioridade">Prioridade</label>
        <select
          id="tasks-filter-prioridade"
          name="prioridade"
          value={draft.prioridade}
          onChange={(event) =>
            setDraft((current) => ({
              ...current,
              prioridade: event.target.value as TasksFiltersValue['prioridade'],
            }))
          }
        >
          <option value="TODAS">Todas</option>
          <option value="BAIXA">Baixa</option>
          <option value="MEDIA">Media</option>
          <option value="ALTA">Alta</option>
        </select>

        <label htmlFor="tasks-filter-sort">Ordenacao</label>
        <select
          id="tasks-filter-sort"
          name="sort"
          value={draft.sort}
          onChange={(event) =>
            setDraft((current) => ({
              ...current,
              sort: event.target.value as TaskSort,
            }))
          }
        >
          <option value="-data_criacao">Mais recentes</option>
          <option value="data_criacao">Mais antigas</option>
          <option value="data_vencimento">Vencimento crescente</option>
          <option value="-data_vencimento">Vencimento decrescente</option>
        </select>

        <div className="filters-actions">
          <button type="submit">Aplicar</button>
          <button type="button" onClick={handleClear}>
            Limpar
          </button>
        </div>
      </fieldset>
    </form>
  );
}
