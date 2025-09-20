import { NavigateFunction } from 'react-router-dom';

export interface ErrorDetails {
  errorCode?: string;
  errorMessage?: string;
  error?: string;
}

export const redirectToError = (
  navigate: NavigateFunction,
  details: ErrorDetails = {}
) => {
  const {
    errorCode = '500',
    errorMessage = 'Something went wrong',
    error = 'An unexpected error occurred',
  } = details;

  navigate('/error', {
    state: {
      errorCode,
      errorMessage,
      error,
    },
    replace: true,
  });
};

export const handleApiError = (
  navigate: NavigateFunction,
  error: any,
  fallbackMessage = 'An error occurred'
) => {
  let errorCode = '500';
  let errorMessage = 'Server Error';
  let errorDetails = fallbackMessage;

  if (error?.response) {
    // HTTP error response
    errorCode = error.response.status?.toString() || '500';
    errorMessage = getErrorMessageByCode(errorCode);
    errorDetails = error.response.data?.message || error.message || fallbackMessage;
  } else if (error?.message) {
    // Network or other error
    errorDetails = error.message;
  }

  redirectToError(navigate, {
    errorCode,
    errorMessage,
    error: errorDetails,
  });
};

const getErrorMessageByCode = (code: string): string => {
  switch (code) {
    case '400':
      return 'Bad Request';
    case '401':
      return 'Unauthorized';
    case '403':
      return 'Forbidden';
    case '404':
      return 'Not Found';
    case '500':
      return 'Server Error';
    case '502':
      return 'Bad Gateway';
    case '503':
      return 'Service Unavailable';
    default:
      return 'Error';
  }
};

export default {
  redirectToError,
  handleApiError,
};