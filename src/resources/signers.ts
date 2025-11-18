import type { AxiosInstance } from 'axios';
import axios from 'axios';
import type { ICreateSignerPayload, ICreateSignerResponse, ISignerListResponse } from '../types';
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
}
