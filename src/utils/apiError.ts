import { isAxiosError } from 'axios';

export function extractApiErrorMessage(error: unknown, fallback: string): string {
  if (isAxiosError(error)) {
    const responseData = error.response?.data as unknown;

    if (typeof responseData === 'object' && responseData !== null) {
      const messageValue = (responseData as Record<string, unknown>).message;
      const errorValue = (responseData as Record<string, unknown>).error;

      if (typeof messageValue === 'string' && messageValue.trim().length > 0) {
        return messageValue;
      }

      if (Array.isArray(messageValue)) {
        return messageValue.filter((item) => typeof item === 'string').join(', ');
      }

      if (typeof errorValue === 'string' && errorValue.trim().length > 0) {
        return errorValue;
      }

      if (Array.isArray(errorValue)) {
        return errorValue.filter((item) => typeof item === 'string').join(', ');
      }
    }

    if (typeof error.message === 'string' && error.message.trim().length > 0) {
      return error.message;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}
