import { describe, test, expect, beforeEach } from 'bun:test';
import { SignerResource } from './signers';
import type { AxiosInstance } from 'axios';

describe('SignerResource', () => {
    let mockAxios: AxiosInstance;
    let signerResource: SignerResource;

    beforeEach(() => {
        mockAxios = {
            post: async () => ({ data: { status: 200, data: { id: '123' } } }),
            get: async () => ({ data: { status: 200, data: [] } }),
            put: async () => ({ data: { status: 200, data: { id: '123' } } }),
            delete: async () => ({ status: 200 }),
        } as unknown as AxiosInstance;

        signerResource = new SignerResource(mockAxios, 'test-account');
    });

    test('should throw error when updating without signer ID', async () => {
        await expect(signerResource.update('', { full_name: 'Test' })).rejects.toThrow(
            'Signer ID is required for updating',
        );
    });

    test('should throw error when deleting without signer ID', async () => {
        await expect(signerResource.delete('')).rejects.toThrow('Signer ID is required for deletion');
    });
});
