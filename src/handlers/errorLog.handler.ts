export const logError = (
    endpoint: string,
    method: string,
    error: Error
  ): void => {
    const timestamp = new Date().toISOString();
    const icon = "❌";
  
    console.error(
      `${icon} [${timestamp}] [${method}] [ERROR] at ${endpoint}:\nMessage: ${error.message}`
    );
  
    if (error.stack) {
      console.error("Stack trace:\n", error.stack);
    }
  };
  