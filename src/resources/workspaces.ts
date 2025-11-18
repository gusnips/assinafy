import type { AxiosInstance } from 'axios';
import axios from 'axios';
import type {
    ICreateWorkspacePayload,
    IWorkspaceResponse,
    IWorkspaceListResponse,
    IUpdateWorkspacePayload,
} from '../types';
import { formatAxiosError, handleAssinafyResponse } from '../utils';

export class WorkspaceResource {
    constructor(private axiosInstance: AxiosInstance) { }

    /**
     * Cria um novo workspace.
     */
    async create(workspaceData: ICreateWorkspacePayload): Promise<IWorkspaceResponse> {
        try {
            const response = await this.axiosInstance.post<IWorkspaceResponse>(
                '/accounts',
                workspaceData,
            );

            return handleAssinafyResponse<IWorkspaceResponse>(response.data);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const errorMessage = formatAxiosError(error);
                throw new Error(`Falha ao criar workspace: ${errorMessage}`);
            }
            throw error;
        }
    }

    /**
     * Lista os workspaces do usuário.
     * Os registros são ordenados de acordo com a última interação, com os mais recentes primeiro.
     */
    async list(): Promise<IWorkspaceListResponse> {
        try {
            const response = await this.axiosInstance.get<IWorkspaceListResponse>('/accounts');

            return handleAssinafyResponse<IWorkspaceListResponse>(response.data);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const errorMessage = formatAxiosError(error);
                throw new Error(`Falha ao listar workspaces: ${errorMessage}`);
            }
            throw error;
        }
    }

    /**
     * Busca os dados de um workspace específico.
     */
    async get(accountId: string): Promise<IWorkspaceResponse> {
        try {
            if (!accountId) {
                throw new Error('Account ID is required for getting workspace');
            }

            const response = await this.axiosInstance.get<IWorkspaceResponse>(`/accounts/${accountId}`);

            return handleAssinafyResponse<IWorkspaceResponse>(response.data);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const errorMessage = formatAxiosError(error);
                throw new Error(`Falha ao buscar workspace: ${errorMessage}`);
            }
            throw error;
        }
    }

    /**
     * Atualiza um workspace.
     */
    async update(accountId: string, workspaceData: IUpdateWorkspacePayload): Promise<IWorkspaceResponse> {
        try {
            if (!accountId) {
                throw new Error('Account ID is required for updating workspace');
            }

            const response = await this.axiosInstance.put<IWorkspaceResponse>(
                `/accounts/${accountId}`,
                workspaceData,
            );

            return handleAssinafyResponse<IWorkspaceResponse>(response.data);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const errorMessage = formatAxiosError(error);
                throw new Error(`Falha ao atualizar workspace: ${errorMessage}`);
            }
            throw error;
        }
    }

    /**
     * Deleta um workspace.
     */
    async delete(accountId: string): Promise<void> {
        try {
            if (!accountId) {
                throw new Error('Account ID is required for deleting workspace');
            }

            const response = await this.axiosInstance.delete(`/accounts/${accountId}`);

            if (response.status !== 200) {
                throw new Error(`Failed to delete workspace: HTTP ${response.status}`);
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const errorMessage = formatAxiosError(error);
                throw new Error(`Falha ao deletar workspace: ${errorMessage}`);
            }
            throw error;
        }
    }
}
