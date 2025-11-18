import axios, { type AxiosInstance } from 'axios';
import type {
    AssinafyClientOptions,
    IDocumentUploadResponse,
    IDocumentDetailsResponse,
    IDocumentListResponse,
    ICreateSignerPayload,
    ICreateSignerResponse,
    ISignerListResponse,
    ICreateAssignmentPayload,
    ICreateAssignmentResponse,
    IResendEmailResponse,
} from './types';
import { DocumentResource } from './resources/documents';
import { SignerResource } from './resources/signers';

const ASSINAFY_API_URL = 'https://api.assinafy.com.br/v1/';

/**
 * Cliente principal da API Assinafy
 * 
 * @example
 * ```typescript
 * const client = new AssinafyClient({
 *   token: 'your-api-token',
 *   accountId: 'your-account-id'
 * });
 * 
 * const document = await client.uploadDocument(pdfBuffer, 'contract.pdf');
 * ```
 */
export class AssinafyClient {
    private axiosInstance: AxiosInstance;
    private accountId: string;
    public readonly documents: DocumentResource;
    public readonly signers: SignerResource;

    constructor(options: AssinafyClientOptions) {
        if (!options.token) {
            throw new Error('O Token da API da Assinafy é obrigatório.');
        }

        this.accountId = options.accountId;
        this.axiosInstance = axios.create({
            baseURL: options.baseUrl ?? ASSINAFY_API_URL,
            headers: {
                Authorization: `Bearer ${options.token}`,
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        });

        this.documents = new DocumentResource(this.axiosInstance, this.accountId);
        this.signers = new SignerResource(this.axiosInstance, this.accountId);
    }

    /**
     * Realiza o upload de um documento PDF para a plataforma.
     */
    async uploadDocument(pdfBuffer: Buffer, fileName: string): Promise<IDocumentUploadResponse> {
        return this.documents.upload(pdfBuffer, fileName);
    }

    /**
     * Busca os detalhes de um documento específico.
     */
    async getDocumentDetails(documentId: string): Promise<IDocumentDetailsResponse> {
        return this.documents.details(documentId);
    }

    /**
     * Baixa um artefato específico de um documento.
     */
    async downloadDocument(
        documentId: string,
        artifactName: 'original' | 'certificated' | 'certificate-page' | 'bundle' = 'certificated',
    ): Promise<Buffer> {
        return this.documents.download(documentId, artifactName);
    }

    /**
     * Deleta um documento da plataforma.
     */
    async deleteDocument(documentId: string): Promise<void> {
        return this.documents.delete(documentId);
    }

    /**
     * Lista os documentos da conta.
     */
    async listDocuments(): Promise<IDocumentListResponse> {
        return this.documents.list();
    }

    /**
     * Cria um signatário na conta Assinafy.
     */
    async createSigner(signerData: ICreateSignerPayload): Promise<ICreateSignerResponse> {
        return this.signers.create(signerData);
    }

    /**
     * Lista os signatários da conta.
     */
    async listSigners(search?: string): Promise<ISignerListResponse> {
        return this.signers.list(search);
    }

    /**
     * Cria uma atribuição/assignment para um documento.
     */
    async createAssignment(
        documentId: string,
        assignmentData: ICreateAssignmentPayload,
    ): Promise<ICreateAssignmentResponse> {
        return this.documents.createAssignment(documentId, assignmentData);
    }

    /**
     * Reenvia o email de assinatura para um signatário específico.
     */
    async resendSignerEmail(
        documentId: string,
        assignmentId: string,
        signerId: string,
    ): Promise<IResendEmailResponse> {
        return this.documents.resendSignerEmail(documentId, assignmentId, signerId);
    }
}
