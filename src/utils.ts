import type { AxiosError } from 'axios';

/**
 * Helper function to format Axios errors for better logging
 */
export function formatAxiosError(error: AxiosError): string {
    const status = error.response?.status;
    const statusText = error.response?.statusText;
    const method = error.config?.method?.toUpperCase();
    const url = error.config?.url;
    const message = error.message;

    let errorDetails = `${method ?? 'REQUEST'} ${url ?? 'unknown'} failed: ${message}`;

    if (status) {
        errorDetails += ` (HTTP ${status}`;
        if (statusText) {
            errorDetails += ` ${statusText}`;
        }
        errorDetails += ')';
    }

    // Include response data if available and not too large
    if (error.response?.data) {
        try {
            const responseData =
                typeof error.response.data === 'string'
                    ? error.response.data
                    : JSON.stringify(error.response.data);
            if (responseData.length < 500) {
                errorDetails += ` - Response: ${responseData}`;
            }
        } catch {
            // Ignore JSON stringify errors
        }
    }

    return errorDetails;
}

/**
 * Helper function to handle Assinafy API responses consistently
 * Extracts the data from the response and handles errors
 */
export function handleAssinafyResponse<T>(response: unknown): T {
    const resp = response as { status?: number; data?: T; message?: string };

    // Check if response has the expected Assinafy format
    if (resp.status !== undefined && resp.data !== undefined) {
        // Check for successful status codes (200-299)
        if (resp.status >= 200 && resp.status < 300) {
            return resp.data;
        } else {
            // Handle error status with message from Assinafy
            const errorMessage = resp.message ?? `Request failed with status ${resp.status}`;
            throw new Error(`Assinafy API Error: ${errorMessage}`);
        }
    }

    // If it doesn't have the expected format, return as-is (fallback)
    return response as T;
}
