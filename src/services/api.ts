import {API_BASE_URL, API_TIMEOUT} from '../config/api';
import {getToken, removeToken, setToken} from './storage';
import type {ApiResponse} from '../types/api';

interface RequestOptions extends RequestInit {
  timeout?: number;
}

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestOptions = {},
  ): Promise<T> {
    const token = await getToken();
    const url = `${this.baseUrl}${endpoint}`;

    // Build headers - don't set Content-Type for FormData
    const isFormData = options.body instanceof FormData;
    const headers: HeadersInit = {
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      ...options.headers,
    };

    // Only set Content-Type for non-FormData requests
    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      options.timeout || API_TIMEOUT,
    );

    try {
      // Log request for debugging (only in dev)
      if (__DEV__) {
        console.log(`[API] ${options.method || 'GET'} ${url}`, {
          headers: Object.keys(headers),
          hasBody: !!options.body,
        });
      }

      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Log response for debugging (only in dev)
      if (__DEV__) {
        console.log(`[API] Response: ${response.status} ${response.statusText}`, {
          contentType: response.headers.get('content-type'),
          url,
        });
      }

      if (!response.ok) {
        // Check if response is HTML (404 page) instead of JSON
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('text/html')) {
          const htmlText = await response.text().catch(() => '');
          console.error(`[API] HTML response received (404): ${url}`, htmlText.substring(0, 200));
          throw new Error(
            `API endpoint not found (404): ${url}\n` +
            `Expected: ${this.baseUrl}${endpoint}\n` +
            `Please verify:\n` +
            `1. Laravel server is running on ${this.baseUrl}\n` +
            `2. Route exists in routes/api.php\n` +
            `3. API middleware is configured correctly`
          );
        }
        
        const error = await response.json().catch(() => ({
          success: false,
          message: `Request failed with status ${response.status}`,
          errors: {},
        }));
        throw new Error(error.message || `Request failed with status ${response.status}`);
      }

      const data = await response.json();
      return data as T;
    } catch (error: any) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      throw error;
    }
  }

  async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {...options, method: 'GET'});
  }

  async post<T>(
    endpoint: string,
    data?: any,
    options?: RequestOptions,
  ): Promise<T> {
    const body = data instanceof FormData ? data : (data ? JSON.stringify(data) : undefined);
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body,
    });
  }

  async put<T>(
    endpoint: string,
    data?: any,
    options?: RequestOptions,
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data instanceof FormData ? data : JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {...options, method: 'DELETE'});
  }
}

export const apiService = new ApiService();

