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
  token: string;      // Required: Your Assinafy API token
  accountId: string;  // Required: Your account ID
  baseUrl?: string;   // Optional: Custom API base URL
});
```

### Documents

- `upload(buffer: Buffer, fileName: string)` - Upload a PDF document
- `list()` - List all documents
- `details(documentId: string)` - Get document details
- `download(documentId: string, artifactName?)` - Download document artifact
- `delete(documentId: string)` - Delete a document
- `createAssignment(documentId: string, data)` - Create signing assignment
- `resendSignerEmail(documentId, assignmentId, signerId)` - Resend email to signer

### Signers

- `create(data: ICreateSignerPayload)` - Create a new signer
- `list(search?: string)` - List signers with optional search
- `update(signerId: string, data: IUpdateSignerPayload)` - Update a signer (only if not associated with active documents)
- `delete(signerId: string)` - Delete a signer

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
