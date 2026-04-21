import { useEffect, useState } from 'react';

import { logout } from '../../auth/services/auth-api';
import { TaskForm } from '../components/task-form';
import { TasksFilters, type TasksFiltersValue } from '../components/tasks-filters';
import { TaskItem } from '../components/task-item';
import { TaskToast } from '../components/task-toast';
import {
  createTask,
  deleteTask,
  listTasks,
  updateTask,
  type Task,
  type UpsertTaskPayload,
} from '../services/tasks-api';

type ToastState = {
  type: 'loading' | 'success' | 'error';
  message: string;
};

const PAGE_SIZE = 10;

const DEFAULT_FILTERS: TasksFiltersValue = {
  q: '',
  status: 'TODOS',
  prioridade: 'TODAS',
  sort: '-data_criacao',
};

export function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filters, setFilters] = useState<TasksFiltersValue>(DEFAULT_FILTERS);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [totalItens, setTotalItens] = useState(0);
  const [reloadToken, setReloadToken] = useState(0);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadTasks() {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const response = await listTasks({
          q: filters.q,
          status: filters.status === 'TODOS' ? undefined : filters.status,
          prioridade: filters.prioridade === 'TODAS' ? undefined : filters.prioridade,
          sort: filters.sort,
          page: currentPage,
          limit: PAGE_SIZE,
        });

        if (!isMounted) {
          return;
        }

        setTasks(response.dados);
        setTotalPaginas(response.meta.total_paginas);
        setTotalItens(response.meta.total_itens);

        if (currentPage > response.meta.total_paginas) {
          setCurrentPage(response.meta.total_paginas);
        }
      } catch {
        if (!isMounted) {
          return;
        }

        setErrorMessage('Nao foi possivel carregar as tarefas.');
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadTasks();

    return () => {
      isMounted = false;
    };
  }, [currentPage, filters, reloadToken]);

  function refreshCurrentPage() {
    setReloadToken((current) => current + 1);
  }

  function refreshFirstPage() {
    if (currentPage === 1) {
      refreshCurrentPage();
      return;
    }

    setCurrentPage(1);
  }

  async function runMutation(
    loadingMessage: string,
    successMessage: string,
    errorToastMessage: string,
    action: () => Promise<void>,
  ) {
    setIsRefreshing(true);
    setErrorMessage('');
    setToast({ type: 'loading', message: loadingMessage });

    try {
      await action();
      setToast({ type: 'success', message: successMessage });
    } catch {
      setToast({ type: 'error', message: errorToastMessage });
    } finally {
      setIsRefreshing(false);
    }
  }

  function handleApplyFilters(nextFilters: TasksFiltersValue) {
    setFilters(nextFilters);
    setCurrentPage(1);
  }

  async function handleCreate(payload: UpsertTaskPayload) {
    setIsSubmitting(true);

    await runMutation(
      'Criando tarefa...',
      'Tarefa criada com sucesso.',
      'Nao foi possivel criar a tarefa.',
      async () => {
        await createTask(payload);
        refreshFirstPage();
      },
    );

    setIsSubmitting(false);
  }

  async function handleUpdate(payload: UpsertTaskPayload) {
    if (!editingTask) {
      return;
    }

    setIsSubmitting(true);

    await runMutation(
      'Atualizando tarefa...',
      'Tarefa atualizada com sucesso.',
      'Nao foi possivel atualizar a tarefa.',
      async () => {
        await updateTask(editingTask.id, payload);
        setEditingTask(null);
        refreshCurrentPage();
      },
    );

    setIsSubmitting(false);
  }

  async function handleConcluir(task: Task) {
    if (task.status === 'CONCLUIDA') {
      return;
    }

    setActiveTaskId(task.id);

    await runMutation(
      'Concluindo tarefa...',
      'Tarefa concluida com sucesso.',
      'Nao foi possivel concluir a tarefa.',
      async () => {
        await updateTask(task.id, { status: 'CONCLUIDA' });
        refreshCurrentPage();
      },
    );

    setActiveTaskId(null);
  }

  async function handleExcluir(task: Task) {
    setActiveTaskId(task.id);

    await runMutation(
      'Excluindo tarefa...',
      'Tarefa excluida com sucesso.',
      'Nao foi possivel excluir a tarefa.',
      async () => {
        await deleteTask(task.id);

        if (editingTask?.id === task.id) {
          setEditingTask(null);
        }

        refreshCurrentPage();
      },
    );

    setActiveTaskId(null);
  }

  return (
    <main className="page" aria-labelledby="tasks-title">
      <header className="page-header">
        <h1 id="tasks-title">Minhas tarefas</h1>
        <button type="button" onClick={logout}>
          Sair
        </button>
      </header>

      <section className="card" aria-labelledby="task-form-title" aria-busy={isSubmitting || isRefreshing}>
        <h2 id="task-form-title">{editingTask ? 'Editar tarefa' : 'Nova tarefa'}</h2>
        <TaskForm
          initialTask={editingTask}
          isSubmitting={isSubmitting}
          submitLabel={editingTask ? 'Salvar alteracoes' : 'Criar tarefa'}
          onSubmit={editingTask ? handleUpdate : handleCreate}
          onCancel={editingTask ? () => setEditingTask(null) : undefined}
        />
      </section>

      <section className="card" aria-labelledby="filters-title">
        <h2 id="filters-title">Organizar listagem</h2>
        <TasksFilters value={filters} isBusy={isLoading || isRefreshing} onApply={handleApplyFilters} />
      </section>

      {errorMessage ? <p role="alert">{errorMessage}</p> : null}
      {toast ? (
        <TaskToast type={toast.type} message={toast.message} onDismiss={() => setToast(null)} />
      ) : null}

      <section className="card" aria-labelledby="tasks-list-title" aria-busy={isLoading}>
        <h2 id="tasks-list-title">Lista de tarefas</h2>
        <p>
          Exibindo pagina {currentPage} de {totalPaginas} ({totalItens} tarefa(s)).
        </p>

        {isLoading ? <p>Carregando tarefas...</p> : null}

        {!isLoading && tasks.length === 0 ? <p>Nenhuma tarefa encontrada para os filtros atuais.</p> : null}

        {!isLoading && tasks.length > 0 ? (
          <ul className="tasks-list">
            {tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                isBusy={activeTaskId === task.id}
                onConcluir={handleConcluir}
                onEditar={setEditingTask}
                onExcluir={handleExcluir}
              />
            ))}
          </ul>
        ) : null}

        <nav className="pagination" aria-label="Paginacao de tarefas">
          <button
            type="button"
            onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
            disabled={isLoading || currentPage === 1}
          >
            Anterior
          </button>
          <button
            type="button"
            onClick={() => setCurrentPage((page) => Math.min(totalPaginas, page + 1))}
            disabled={isLoading || currentPage >= totalPaginas}
          >
            Proxima
          </button>
        </nav>
      </section>
    </main>
  );
}
