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

    test('should throw error when no account ID is available', async () => {
        const resourceWithoutAccount = new SignerResource(mockAxios);

        await expect(resourceWithoutAccount.create({ full_name: 'Test', email: 'test@test.com' })).rejects.toThrow(
            'Account ID is required. Provide it as a parameter or set a default in the client.',
        );
    });

    test('should use custom accountId when provided', async () => {
        let capturedUrl = '';
        const trackingAxios = {
            ...mockAxios,
            post: async (url: string) => {
                capturedUrl = url;
                return { data: { status: 200, data: { id: '123' } } };
            },
        } as unknown as AxiosInstance;

        const resource = new SignerResource(trackingAxios, 'default-account');
        await resource.create({ full_name: 'Test', email: 'test@test.com' }, 'custom-account');

        expect(capturedUrl).toBe('/accounts/custom-account/signers');
    });

    test('should use default accountId when custom not provided', async () => {
        let capturedUrl = '';
        const trackingAxios = {
            ...mockAxios,
            post: async (url: string) => {
                capturedUrl = url;
                return { data: { status: 200, data: { id: '123' } } };
            },
        } as unknown as AxiosInstance;

        const resource = new SignerResource(trackingAxios, 'default-account');
        await resource.create({ full_name: 'Test', email: 'test@test.com' });

        expect(capturedUrl).toBe('/accounts/default-account/signers');
    });
});
