import type { AxiosInstance } from 'axios';
import axios from 'axios';
import type {
    ICreateSignerPayload,
    ICreateSignerResponse,
    ISignerListResponse,
    IUpdateSignerPayload,
} from '../types';
import { formatAxiosError, handleAssinafyResponse } from '../utils';

export class SignerResource {
    constructor(
        private axiosInstance: AxiosInstance,
        private accountId: string,
    ) { }

    /**
     * Cria um signatário na conta.
     */
    async create(signerData: ICreateSignerPayload): Promise<ICreateSignerResponse> {
        try {
            const response = await this.axiosInstance.post<ICreateSignerResponse>(
                `/accounts/${this.accountId}/signers`,
                signerData,
            );

            return handleAssinafyResponse<ICreateSignerResponse>(response.data);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const errorMessage = formatAxiosError(error);
                throw new Error(`Falha ao criar signatário: ${errorMessage}`);
            }
            throw error;
        }
    }

    /**
     * Lista os signatários da conta.
     */
    async list(search?: string): Promise<ISignerListResponse> {
        try {
            const params: Record<string, string> = {};
            if (search) {
                params.search = search;
            }

            const response = await this.axiosInstance.get<ISignerListResponse>(
                `/accounts/${this.accountId}/signers`,
                { params },
            );

            return handleAssinafyResponse<ISignerListResponse>(response.data);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const errorMessage = formatAxiosError(error);
                throw new Error(`Falha ao listar signatários: ${errorMessage}`);
            }
            throw error;
        }
    }

    /**
     * Atualiza um signatário na conta.
     * Importante: Um signatário só pode ser atualizado se não estiver associado a nenhum documento ativo.
     */
    async update(signerId: string, signerData: IUpdateSignerPayload): Promise<ICreateSignerResponse> {
        try {
            if (!signerId) {
                throw new Error('Signer ID is required for updating');
            }

            const response = await this.axiosInstance.put<ICreateSignerResponse>(
                `/accounts/${this.accountId}/signers/${signerId}`,
                signerData,
            );

            return handleAssinafyResponse<ICreateSignerResponse>(response.data);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const errorMessage = formatAxiosError(error);
                throw new Error(`Falha ao atualizar signatário: ${errorMessage}`);
            }
            throw error;
        }
    }

    /**
     * Deleta um signatário da conta.
     */
    async delete(signerId: string): Promise<void> {
        try {
            if (!signerId) {
                throw new Error('Signer ID is required for deletion');
            }

            const response = await this.axiosInstance.delete(`/accounts/${this.accountId}/signers/${signerId}`);

            if (response.status !== 200) {
                throw new Error(`Failed to delete signer: HTTP ${response.status}`);
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const errorMessage = formatAxiosError(error);
                throw new Error(`Falha ao deletar signatário: ${errorMessage}`);
            }
            throw error;
        }
    }
}
