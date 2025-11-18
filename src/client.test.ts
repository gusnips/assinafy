import { describe, test, expect } from 'bun:test';
import { AssinafyClient } from './client';

describe('AssinafyClient', () => {
    test('should throw error when token is missing', () => {
        expect(() => {
            new AssinafyClient({ token: '', accountId: 'test-account' });
        }).toThrow('O Token da API da Assinafy é obrigatório.');
    });

    test('should create client with valid options', () => {
        const client = new AssinafyClient({
            token: 'test-token',
            accountId: 'test-account',
        });

        expect(client).toBeDefined();
        expect(client.documents).toBeDefined();
        expect(client.signers).toBeDefined();
    });

    test('should use custom baseUrl when provided', () => {
        const customUrl = 'https://custom-api.example.com/';
        const client = new AssinafyClient({
            token: 'test-token',
            accountId: 'test-account',
            baseUrl: customUrl,
        });

        expect(client).toBeDefined();
    });
});
