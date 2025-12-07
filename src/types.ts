/** Define a ação que um signatário deve realizar no documento. */
export type SignerAction = 'ASSINAR' | 'RECONHECER' | 'APROVAR' | 'TESTEMUNHA';

/** Define o tipo de autenticação que será exigida do signatário. */
export type AuthMode = 'email' | 'sms' | 'whatsapp' | 'pix';

/** Interface para representar um signatário a ser adicionado. */
export interface ISignerPayload {
    name: string;
    email?: string;
    phone?: string;
    action: SignerAction;
    auth_mode: AuthMode;
    skip_email?: boolean;
}

/** Interface para criar um signatário na conta. */
export interface ICreateSignerPayload {
    full_name: string;
    email: string;
}

/** Interface para atualizar um signatário na conta. */
export interface IUpdateSignerPayload {
    full_name?: string;
    email?: string;
}

/** Interface para a resposta de criação de signatário. */
export interface ICreateSignerResponse {
    resource: string;
    id: string;
    full_name: string;
    email: string;
}

/** Interface para um signatário na resposta de listagem. */
export interface ISignerListItem {
    id: string;
    full_name: string;
    email: string;
}

/** Interface para a resposta do endpoint de listagem de signatários. */
export interface ISignerListResponse {
    data: ISignerListItem[];
    meta?: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

/** Interface para criar uma atribuição/assignment. */
export interface ICreateAssignmentPayload {
    method: 'virtual';
    signerIds: string[];
    message?: string;
    expires_at?: string;
    copy_receivers?: string[];
}

/** Interface para a resposta de criação de assignment. */
export interface ICreateAssignmentResponse {
    id: string;
    expiration: string;
    signers: Array<{
        id: string;
        full_name: string;
        email: string;
    }>;
    method: string;
    items: Array<{
        id: string;
        page: null;
        signer: {
            id: string;
            full_name: string;
            email: string;
        };
        field: {
            id: string;
            name: string;
            type: string;
        };
        display_settings: unknown[];
        value: null;
        completed: boolean;
    }>;
}

/** Interface para a resposta de reenvio de email. */
export interface IResendEmailResponse {
    is_sent: boolean;
    document_id: string;
    signer_id: string;
}

/** Interface para representar um signatário em respostas da API. */
export interface ISignerResponse extends ISignerPayload {
    uuid: string;
    status: 'PENDENTE' | 'ASSINADO' | 'REJEITADO';
    sign_url: string;
}

/** Interface para a carga de dados (payload) recebida via Webhook. */
export interface IWebhookPayload {
    event: string;
    data: {
        document_uuid: string;
        [key: string]: unknown;
    };
}

/** Interface para a resposta de um único documento em uma listagem. */
export interface IDocumentListItem {
    uuid: string;
    name: string;
    status: 'EM_CONSTRUCAO' | 'AGUARDANDO_ASSINATURAS' | 'FINALIZADO' | 'CANCELADO';
    created_at: string;
}

/** Interface para a resposta do endpoint de listagem de documentos. */
export interface IDocumentListResponse {
    data: IDocumentListItem[];
    meta?: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

/** Interface para a resposta de upload de documento. */
export interface IDocumentUploadResponse {
    resource: string;
    id: string;
    account_id: string;
    template_id: string | null;
    name: string;
    status: string;
    assignment: unknown;
    artifacts: {
        original: string;
    };
    pages: Array<{
        id: string;
        number: number;
        height: number;
        width: number;
        download_url: string;
    }>;
    created_at: string;
    updated_at: string;
    is_closed: boolean;
    decline_reason: string | null;
    declined_by: string | null;
}

/** Interface para a resposta detalhada de um único documento. */
export interface IDocumentDetailsResponse {
    resource: string;
    id: string;
    account_id: string;
    name: string;
    status: 'uploaded' | 'pending' | 'completed' | 'rejected_by_signer' | 'expired';
    assignment: {
        id: string;
        sender_email: string;
        expiration: string;
        signers: Array<{
            id: string;
            full_name: string;
            email: string;
        }>;
        method: string;
        items: unknown[];
        summary: {
            signer_count: number;
            completed_count: number;
            signers: unknown[];
        };
    };
    download_url?: string;
    download_final_url?: string;
    artifacts?: {
        original: string;
        certificated?: string;
        'certificate-page'?: string;
        bundle?: string;
    };
    pages: unknown[];
    created_at: string;
    updated_at: string;
    is_closed: boolean;
    decline_reason?: string;
    activities?: Array<{
        id: number;
        event: string;
        message: string;
        origin: string;
        created_at: string;
    }>;
}

/** Interface para criar um workspace. */
export interface ICreateWorkspacePayload {
    name: string;
    primary_color?: string;
    secondary_color?: string;
}

/** Interface para atualizar um workspace. */
export interface IUpdateWorkspacePayload {
    name?: string;
    primary_color?: string | null;
    secondary_color?: string | null;
}

/** Interface para a resposta de um workspace. */
export interface IWorkspaceResponse {
    id: string;
    name: string;
    primary_color?: string;
    secondary_color?: string;
    created_at: string;
}

/** Interface para um workspace na resposta de listagem. */
export interface IWorkspaceListItem {
    id: string;
    name: string;
    is_delete_allowed: boolean;
    roles: string[];
    created_at: string;
}

/** Interface para a resposta do endpoint de listagem de workspaces. */
export interface IWorkspaceListResponse {
    data: IWorkspaceListItem[];
}

/** Client configuration options */
export interface AssinafyClientOptions {
    token: string;
    accountId?: string;
    baseUrl?: string;
}
