/**
 * Global auth handler for handling unauthenticated responses
 * This allows the API service to trigger logout without circular dependencies
 */

type UnauthenticatedHandler = () => void | Promise<void>;

class AuthHandler {
  private handler: UnauthenticatedHandler | null = null;

  setUnauthenticatedHandler(handler: UnauthenticatedHandler) {
    this.handler = handler;
  }

  async handleUnauthenticated() {
    if (this.handler) {
      try {
        await this.handler();
      } catch (error) {
        console.error('Error in unauthenticated handler:', error);
      }
    }
  }
}

export const authHandler = new AuthHandler();
