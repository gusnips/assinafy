import { describe, test, expect, beforeEach } from 'bun:test';
import { WorkspaceResource } from './workspaces';
import type { AxiosInstance } from 'axios';

describe('WorkspaceResource', () => {
    let mockAxios: AxiosInstance;
    let workspaceResource: WorkspaceResource;

    beforeEach(() => {
        mockAxios = {
            post: async () => ({ data: { status: 200, data: { id: '123' } } }),
            get: async () => ({ data: { status: 200, data: [] } }),
            put: async () => ({ data: { status: 200, data: { id: '123' } } }),
            delete: async () => ({ status: 200 }),
        } as unknown as AxiosInstance;

        workspaceResource = new WorkspaceResource(mockAxios);
    });

    test('should throw error when getting workspace without account ID', async () => {
        await expect(workspaceResource.get('')).rejects.toThrow(
            'Account ID is required for getting workspace',
        );
    });

    test('should throw error when updating workspace without account ID', async () => {
        await expect(workspaceResource.update('', { name: 'Test' })).rejects.toThrow(
            'Account ID is required for updating workspace',
        );
    });

    test('should throw error when deleting workspace without account ID', async () => {
        await expect(workspaceResource.delete('')).rejects.toThrow(
            'Account ID is required for deleting workspace',
        );
    });
});
