import type { Task } from '../services/tasks-api';

type TaskItemProps = {
  task: Task;
  isBusy: boolean;
  onConcluir: (task: Task) => Promise<void>;
  onEditar: (task: Task) => void;
  onExcluir: (task: Task) => Promise<void>;
};

function formatDate(dateISO: string | null): string {
  if (!dateISO) {
    return 'Sem vencimento';
  }

  return new Intl.DateTimeFormat('pt-BR').format(new Date(dateISO));
}

export function TaskItem({ task, isBusy, onConcluir, onEditar, onExcluir }: TaskItemProps) {
  return (
    <li className="task-item">
      <article aria-label={`Tarefa ${task.titulo}`}>
        <header>
          <h3>{task.titulo}</h3>
          <p>
            {task.status} | prioridade {task.prioridade}
          </p>
        </header>

        {task.descricao ? <p>{task.descricao}</p> : null}

        <small>Vencimento: {formatDate(task.data_vencimento)}</small>

        <div className="task-item-actions">
          <button
            type="button"
            onClick={() => onConcluir(task)}
            disabled={isBusy || task.status === 'CONCLUIDA'}
          >
            {task.status === 'CONCLUIDA' ? 'Concluida' : 'Concluir'}
          </button>
          <button type="button" onClick={() => onEditar(task)} disabled={isBusy}>
            Editar
          </button>
          <button type="button" onClick={() => onExcluir(task)} disabled={isBusy}>
            Excluir
          </button>
        </div>
      </article>
    </li>
  );
}
