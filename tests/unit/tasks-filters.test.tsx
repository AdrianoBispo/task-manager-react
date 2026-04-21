import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { TasksFilters, type TasksFiltersValue } from '../../src/features/tasks/components/tasks-filters';

const baseValue: TasksFiltersValue = {
  q: '',
  status: 'TODOS',
  prioridade: 'TODAS',
  sort: '-data_criacao',
};

describe('TasksFilters', () => {
  it('applies combined search/filter values', async () => {
    const user = userEvent.setup();
    const onApply = vi.fn();

    render(<TasksFilters value={baseValue} onApply={onApply} />);

    await user.type(screen.getByLabelText('Buscar por titulo ou descricao'), 'relatorio');
    await user.selectOptions(screen.getByLabelText('Status'), 'PENDENTE');
    await user.selectOptions(screen.getByLabelText('Prioridade'), 'ALTA');
    await user.selectOptions(screen.getByLabelText('Ordenacao'), 'data_criacao');

    await user.click(screen.getByRole('button', { name: 'Aplicar' }));

    expect(onApply).toHaveBeenCalledWith({
      q: 'relatorio',
      status: 'PENDENTE',
      prioridade: 'ALTA',
      sort: 'data_criacao',
    });
  });

  it('clears filters to default values', async () => {
    const user = userEvent.setup();
    const onApply = vi.fn();

    render(
      <TasksFilters
        value={{
          q: 'atualizar docs',
          status: 'EM_ANDAMENTO',
          prioridade: 'MEDIA',
          sort: 'data_vencimento',
        }}
        onApply={onApply}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Limpar' }));

    expect(onApply).toHaveBeenCalledWith(baseValue);
  });
});
