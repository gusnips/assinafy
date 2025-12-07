# Assinafy

TypeScript SDK for the Assinafy API - A digital signature platform for Brazil.

## Installation

```bash
npm install assinafy
# or
bun add assinafy
```

## Usage

```typescript
import { AssinafyClient } from 'assinafy';

const client = new AssinafyClient({
  token: 'your-api-token',
  accountId: 'your-account-id'
});

// Upload a document
const document = await client.documents.upload(pdfBuffer, 'contract.pdf');

// Create a signer
const signer = await client.signers.create({
  full_name: 'John Doe',
  email: 'john@example.com'
});

// Create assignment
await client.documents.createAssignment(document.id, {
  method: 'virtual',
  signerIds: [signer.id]
});

// Get document details
const details = await client.documents.details(document.id);

// Download signed document
const signedPdf = await client.documents.download(document.id, 'certificated');
```

## API Reference

### Client Initialization

```typescript
const client = new AssinafyClient({
  token: string;       // Required: Your Assinafy API token
  accountId?: string;  // Optional: Default account ID for all operations
  baseUrl?: string;    // Optional: Custom API base URL
});
```

### Multi-Account Support

All methods that require an account ID accept an optional `accountId` parameter to override the default:

```typescript
// Using default account ID
const client = new AssinafyClient({
  token: 'your-token',
  accountId: 'default-account'
});
await client.documents.upload(buffer, 'file.pdf');

// Override for specific calls
await client.documents.upload(buffer, 'file.pdf', 'other-account');
await client.signers.list(undefined, 'other-account');

// Without default account ID (must provide per-call)
const client = new AssinafyClient({ token: 'your-token' });
await client.documents.upload(buffer, 'file.pdf', 'account-123'); // required
```

### Documents

- `upload(buffer: Buffer, fileName: string, accountId?: string)` - Upload a PDF document
- `list(accountId?: string)` - List all documents
- `details(documentId: string)` - Get document details
- `download(documentId: string, artifactName?)` - Download document artifact
- `delete(documentId: string)` - Delete a document
- `createAssignment(documentId: string, data)` - Create signing assignment
- `resendSignerEmail(documentId, assignmentId, signerId)` - Resend email to signer

### Signers

- `create(data: ICreateSignerPayload, accountId?: string)` - Create a new signer
- `list(search?: string, accountId?: string)` - List signers with optional search
- `update(signerId: string, data: IUpdateSignerPayload, accountId?: string)` - Update a signer (only if not associated with active documents)
- `delete(signerId: string, accountId?: string)` - Delete a signer

### Workspaces

- `create(data: ICreateWorkspacePayload)` - Create a new workspace
- `list()` - List all workspaces (ordered by last interaction)
- `get(accountId: string)` - Get workspace details
- `update(accountId: string, data: IUpdateWorkspacePayload)` - Update a workspace
- `delete(accountId: string)` - Delete a workspace

## Development

```bash
# Install dependencies
bun install

# Run tests
bun test

# Build
bun run build

# Lint
bun run lint
```

## License

MIT
