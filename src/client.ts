import axios, { type AxiosInstance } from 'axios';
import type {
    AssinafyClientOptions,
    IDocumentUploadResponse,
    IDocumentDetailsResponse,
    IDocumentListResponse,
    ICreateSignerPayload,
    ICreateSignerResponse,
    ISignerListResponse,
    IUpdateSignerPayload,
    ICreateAssignmentPayload,
    ICreateAssignmentResponse,
    IResendEmailResponse,
    ICreateWorkspacePayload,
    IWorkspaceResponse,
    IWorkspaceListResponse,
    IUpdateWorkspacePayload,
} from './types';
import { DocumentResource } from './resources/documents';
import { SignerResource } from './resources/signers';
import { WorkspaceResource } from './resources/workspaces';

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
    private defaultAccountId?: string;
    public readonly documents: DocumentResource;
    public readonly signers: SignerResource;
    public readonly workspaces: WorkspaceResource;

    constructor(options: AssinafyClientOptions) {
        if (!options.token) {
            throw new Error('O Token da API da Assinafy é obrigatório.');
        }

        this.defaultAccountId = options.accountId;
        this.axiosInstance = axios.create({
            baseURL: options.baseUrl ?? ASSINAFY_API_URL,
            headers: {
                Authorization: `Bearer ${options.token}`,
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        });

        this.documents = new DocumentResource(this.axiosInstance, this.defaultAccountId);
        this.signers = new SignerResource(this.axiosInstance, this.defaultAccountId);
        this.workspaces = new WorkspaceResource(this.axiosInstance);
    }

    /**
     * Realiza o upload de um documento PDF para a plataforma.
     */
    async uploadDocument(pdfBuffer: Buffer, fileName: string, accountId?: string): Promise<IDocumentUploadResponse> {
        return this.documents.upload(pdfBuffer, fileName, accountId);
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
    async listDocuments(accountId?: string): Promise<IDocumentListResponse> {
        return this.documents.list(accountId);
    }

    /**
     * Cria um signatário na conta Assinafy.
     */
    async createSigner(signerData: ICreateSignerPayload, accountId?: string): Promise<ICreateSignerResponse> {
        return this.signers.create(signerData, accountId);
    }

    /**
     * Lista os signatários da conta.
     */
    async listSigners(search?: string, accountId?: string): Promise<ISignerListResponse> {
        return this.signers.list(search, accountId);
    }

    /**
     * Atualiza um signatário na conta.
     */
    async updateSigner(signerId: string, signerData: IUpdateSignerPayload, accountId?: string): Promise<ICreateSignerResponse> {
        return this.signers.update(signerId, signerData, accountId);
    }

    /**
     * Deleta um signatário da conta.
     */
    async deleteSigner(signerId: string, accountId?: string): Promise<void> {
        return this.signers.delete(signerId, accountId);
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

    /**
     * Cria um novo workspace.
     */
    async createWorkspace(workspaceData: ICreateWorkspacePayload): Promise<IWorkspaceResponse> {
        return this.workspaces.create(workspaceData);
    }

    /**
     * Lista os workspaces do usuário.
     */
    async listWorkspaces(): Promise<IWorkspaceListResponse> {
        return this.workspaces.list();
    }

    /**
     * Busca os dados de um workspace específico.
     */
    async getWorkspace(accountId: string): Promise<IWorkspaceResponse> {
        return this.workspaces.get(accountId);
    }

    /**
     * Atualiza um workspace.
     */
    async updateWorkspace(accountId: string, workspaceData: IUpdateWorkspacePayload): Promise<IWorkspaceResponse> {
        return this.workspaces.update(accountId, workspaceData);
    }

    /**
     * Deleta um workspace.
     */
    async deleteWorkspace(accountId: string): Promise<void> {
        return this.workspaces.delete(accountId);
    }
}
