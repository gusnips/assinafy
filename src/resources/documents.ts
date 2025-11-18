import type { AxiosInstance } from 'axios';
import axios from 'axios';
import type {
    IDocumentUploadResponse,
    IDocumentListResponse,
    IDocumentDetailsResponse,
    ICreateAssignmentPayload,
    ICreateAssignmentResponse,
    IResendEmailResponse,
} from '../types';
import { formatAxiosError, handleAssinafyResponse } from '../utils';

export class DocumentResource {
    constructor(
        private axiosInstance: AxiosInstance,
        private accountId: string,
    ) { }

    /**
     * Realiza o upload de um documento PDF para a plataforma.
     */
    async upload(pdfBuffer: Buffer, fileName: string): Promise<IDocumentUploadResponse> {
        try {
            const formData = new FormData();
            const blob = new Blob([pdfBuffer], { type: 'application/pdf' });
            formData.append('file', blob, fileName);

            const response = await this.axiosInstance.post<IDocumentUploadResponse>(
                `/accounts/${this.accountId}/documents`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                },
            );

            const documentData = handleAssinafyResponse<IDocumentUploadResponse>(response.data);

            if (!documentData?.id) {
                throw new Error(`Upload response missing document ID. Response: ${JSON.stringify(documentData)}`);
            }

            return documentData;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const errorMessage = formatAxiosError(error);
                throw new Error(`Falha no upload do documento: ${errorMessage}`);
            }
            throw error;
        }
    }

    /**
     * Lista os documentos da conta.
     */
    async list(): Promise<IDocumentListResponse> {
        const response = await this.axiosInstance.get<IDocumentListResponse>(
            `/accounts/${this.accountId}/documents`,
        );
        return response.data;
    }

    /**
     * Busca os detalhes de um documento específico.
     */
    async details(documentId: string): Promise<IDocumentDetailsResponse> {
        try {
            if (!documentId) {
                throw new Error('Document ID is required for getting details');
            }

            const response = await this.axiosInstance.get<IDocumentDetailsResponse>(`/documents/${documentId}`);
            return handleAssinafyResponse<IDocumentDetailsResponse>(response.data);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const errorMessage = formatAxiosError(error);
                throw new Error(`Falha ao buscar detalhes do documento: ${errorMessage}`);
            }
            throw error;
        }
    }

    /**
     * Baixa um artefato específico de um documento.
     */
    async download(
        documentId: string,
        artifactName: 'original' | 'certificated' | 'certificate-page' | 'bundle' = 'certificated',
    ): Promise<Buffer> {
        try {
            if (!documentId) {
                throw new Error('Document ID is required for downloading');
            }

            const response = await this.axiosInstance.get<ArrayBuffer>(
                `/documents/${documentId}/download/${artifactName}`,
                {
                    responseType: 'arraybuffer',
                },
            );

            return Buffer.from(response.data);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const errorMessage = formatAxiosError(error);
                throw new Error(`Falha ao baixar documento: ${errorMessage}`);
            }
            throw error;
        }
    }

    /**
     * Deleta um documento da plataforma.
     */
    async delete(documentId: string): Promise<void> {
        try {
            if (!documentId) {
                throw new Error('Document ID is required for deletion');
            }

            const response = await this.axiosInstance.delete(`/documents/${documentId}`);

            if (response.status !== 200) {
                throw new Error(`Failed to delete document: HTTP ${response.status}`);
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const errorMessage = formatAxiosError(error);
                throw new Error(`Falha ao deletar documento: ${errorMessage}`);
            }
            throw error;
        }
    }

    /**
     * Cria uma atribuição/assignment para um documento.
     */
    async createAssignment(
        documentId: string,
        assignmentData: ICreateAssignmentPayload,
    ): Promise<ICreateAssignmentResponse> {
        try {
            if (!documentId) {
                throw new Error('Document ID is required for creating assignment');
            }

            const response = await this.axiosInstance.post<ICreateAssignmentResponse>(
                `/documents/${documentId}/assignments`,
                assignmentData,
            );

            return handleAssinafyResponse<ICreateAssignmentResponse>(response.data);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const errorMessage = formatAxiosError(error);
                throw new Error(`Falha ao criar assignment: ${errorMessage}`);
            }
            throw error;
        }
    }

    /**
     * Reenvia o email de assinatura para um signatário específico.
     */
    async resendSignerEmail(
        documentId: string,
        assignmentId: string,
        signerId: string,
    ): Promise<IResendEmailResponse> {
        try {
            if (!documentId || !assignmentId || !signerId) {
                throw new Error('Document ID, assignment ID, and signer ID are all required for resending email');
            }

            const response = await this.axiosInstance.put<IResendEmailResponse>(
                `/documents/${documentId}/assignments/${assignmentId}/signers/${signerId}/resend`,
            );

            return handleAssinafyResponse<IResendEmailResponse>(response.data);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const errorMessage = formatAxiosError(error);
                throw new Error(`Falha ao reenviar email: ${errorMessage}`);
            }
            throw error;
        }
    }
}
