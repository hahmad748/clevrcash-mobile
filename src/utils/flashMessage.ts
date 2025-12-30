import {showMessage, MessageOptions} from 'react-native-flash-message';

/**
 * Show a success flash message
 */
export function showSuccess(
  message: string,
  description?: string,
  options?: Partial<MessageOptions>,
): void {
  showMessage({
    message,
    description,
    type: 'success',
    duration: 3000,
    ...options,
  });
}

/**
 * Show an error flash message
 */
export function showError(
  message: string,
  description?: string,
  options?: Partial<MessageOptions>,
): void {
  showMessage({
    message,
    description,
    type: 'danger',
    duration: 4000,
    ...options,
  });
}

/**
 * Show an info flash message
 */
export function showInfo(
  message: string,
  description?: string,
  options?: Partial<MessageOptions>,
): void {
  showMessage({
    message,
    description,
    type: 'info',
    duration: 3000,
    ...options,
  });
}

/**
 * Show a warning flash message
 */
export function showWarning(
  message: string,
  description?: string,
  options?: Partial<MessageOptions>,
): void {
  showMessage({
    message,
    description,
    type: 'warning',
    duration: 3500,
    ...options,
  });
}

/**
 * Show a flash message with custom options
 */
export function showFlashMessage(
  message: string,
  type: 'success' | 'danger' | 'info' | 'warning' = 'info',
  options?: Partial<MessageOptions>,
): void {
  showMessage({
    message,
    type,
    duration: type === 'danger' ? 4000 : 3000,
    ...options,
  });
}
