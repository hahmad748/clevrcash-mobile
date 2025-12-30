import {API_BASE_URL, getAPIBaseURL, API_TIMEOUT} from '../config/api';
import {getToken, removeToken, setToken} from './storage';
import type {ApiResponse} from '../types/api';
import {navigationService} from './navigationService';
import {authHandler} from './authHandler';

interface RequestOptions extends RequestInit {
  timeout?: number;
}

class ApiService {
  private baseUrl: string | null = null;
  private baseUrlPromise: Promise<string> | null = null;
  private readonly defaultBaseUrl = API_BASE_URL;

  constructor() {
    // Initialize base URL asynchronously
    this.baseUrlPromise = getAPIBaseURL().then(url => {
      this.baseUrl = url;
      if (__DEV__) {
        console.log(`[API] Base URL initialized: ${url}`);
      }
      return url;
    }).catch(err => {
      console.error('[API] Failed to get base URL:', err);
      // Fallback to default
      this.baseUrl = this.defaultBaseUrl;
      return this.defaultBaseUrl;
    });
  }

  private async getBaseUrl(): Promise<string> {
    // Wait for initialization if not complete
    if (this.baseUrlPromise) {
      await this.baseUrlPromise;
      this.baseUrlPromise = null; // Clear after first use
    }
    return this.baseUrl || this.defaultBaseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestOptions = {},
  ): Promise<T> {
    // Always ensure base URL is initialized before making request
    const baseUrl = await this.getBaseUrl();
    
    const token = await getToken();
    const url = `${baseUrl}${endpoint}`;

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
          baseUrl,
          endpoint,
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
        // Handle 401 Unauthorized - User is not authenticated
        if (response.status === 401) {
          // Clear token immediately
          await removeToken();
          
          // Trigger logout handler (clears user state in AuthContext)
          await authHandler.handleUnauthenticated();
          
          // Navigate to Welcome screen
          navigationService.navigateToAuth();
          
          // Try to get error message from response
          const error = await response.json().catch(() => ({
            success: false,
            message: 'Session expired. Please login again.',
            errors: {},
          }));
          
          throw new Error(error.message || 'Session expired. Please login again.');
        }
        
        // Check if response is HTML (404 page) instead of JSON
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('text/html')) {
          const htmlText = await response.text().catch(() => '');
          console.error(`[API] HTML response received (404): ${url}`, htmlText.substring(0, 200));
          const currentBaseUrl = await this.getBaseUrl();
          throw new Error(
            `API endpoint not found (404): ${url}\n` +
            `Expected: ${currentBaseUrl}${endpoint}\n` +
            `Please verify:\n` +
            `1. Laravel server is running on ${currentBaseUrl.replace('/api/v1', '')}\n` +
            `2. Route exists in routes/api.php\n` +
            `3. API middleware is configured correctly\n` +
            `4. Device and server are on the same network (for real device)`
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
      
      // Enhanced error logging for network failures
      if (__DEV__) {
        if (error.message?.includes('Network request failed') || error.message?.includes('Failed to fetch')) {
          console.error(`[API] Network error for ${url}`, {
            baseUrl,
            endpoint,
            error: error.message,
            suggestion: 'Check if Laravel server is running and accessible from device',
          });
        }
      }
      
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

