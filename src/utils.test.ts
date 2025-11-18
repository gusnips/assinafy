import { describe, test, expect } from 'bun:test';
import { formatAxiosError, handleAssinafyResponse } from './utils';
import type { AxiosError } from 'axios';

describe('formatAxiosError', () => {
    test('should format basic error message', () => {
        const error = {
            message: 'Network Error',
            config: { method: 'get', url: '/test' },
        } as AxiosError;

        const result = formatAxiosError(error);
        expect(result).toContain('GET');
        expect(result).toContain('/test');
        expect(result).toContain('Network Error');
    });
});

describe('handleAssinafyResponse', () => {
    test('should return data for successful response', () => {
        const response = {
            status: 200,
            data: { id: '123', name: 'Test' },
        };

        const result = handleAssinafyResponse(response);
        expect(result).toEqual({ id: '123', name: 'Test' });
    });

    test('should throw error for failed response', () => {
        const response = {
            status: 400,
            data: {},
            message: 'Bad Request',
        };

        expect(() => handleAssinafyResponse(response)).toThrow('Assinafy API Error');
    });
});
