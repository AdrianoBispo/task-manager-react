import { http } from '../../../services/http';

export type TaskStatus = 'PENDENTE' | 'EM_ANDAMENTO' | 'CONCLUIDA';
export type TaskPrioridade = 'BAIXA' | 'MEDIA' | 'ALTA';
export type TaskSort = 'data_criacao' | '-data_criacao' | 'data_vencimento' | '-data_vencimento';

export type Task = {
  id: string;
  id_usuario: string;
  titulo: string;
  descricao: string | null;
  status: TaskStatus;
  prioridade: TaskPrioridade;
  data_vencimento: string | null;
  data_criacao: string;
  data_atualizacao: string;
  data_conclusao: string | null;
};

type ListTasksResponse = {
  dados: Task[];
  meta: {
    total_itens: number;
    total_paginas: number;
    pagina_atual: number;
    itens_por_pagina: number;
  };
};

export type UpsertTaskPayload = {
  titulo: string;
  descricao?: string | null;
  status?: TaskStatus;
  prioridade?: TaskPrioridade;
  data_vencimento?: string | null;
};

export async function listTasks(params?: {
  q?: string;
  status?: TaskStatus;
  prioridade?: TaskPrioridade;
  sort?: TaskSort;
  page?: number;
  limit?: number;
}): Promise<ListTasksResponse> {
  const query = params?.q?.trim();

  const response = await http.get<ListTasksResponse>('/api/tasks', {
    params: {
      page: params?.page ?? 1,
      limit: params?.limit ?? 10,
      sort: params?.sort ?? '-data_criacao',
      ...(query ? { q: query } : {}),
      ...(params?.status ? { status: params.status } : {}),
      ...(params?.prioridade ? { prioridade: params.prioridade } : {}),
    },
  });

  return response.data;
}

export async function createTask(payload: UpsertTaskPayload): Promise<Task> {
  const response = await http.post<Task>('/api/tasks', payload);

  return response.data;
}

export async function updateTask(taskId: string, payload: Partial<UpsertTaskPayload>): Promise<Task> {
  const response = await http.patch<Task>(`/api/tasks/${taskId}`, payload);

  return response.data;
}

export async function deleteTask(taskId: string): Promise<void> {
  await http.delete(`/api/tasks/${taskId}`);
}
