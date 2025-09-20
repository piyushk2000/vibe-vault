import { useNavigate } from 'react-router-dom';
import { redirectToError, handleApiError, ErrorDetails } from '../utils/errorHandler';

export const useErrorHandler = () => {
  const navigate = useNavigate();

  const showError = (details: ErrorDetails = {}) => {
    redirectToError(navigate, details);
  };

  const handleError = (error: any, fallbackMessage?: string) => {
    handleApiError(navigate, error, fallbackMessage);
  };

  const show404 = (message = "The page you're looking for doesn't exist") => {
    showError({
      errorCode: '404',
      errorMessage: 'Page Not Found',
      error: message,
    });
  };

  const show401 = (message = "You need to be logged in to access this resource") => {
    showError({
      errorCode: '401',
      errorMessage: 'Unauthorized',
      error: message,
    });
  };

  const show403 = (message = "You don't have permission to access this resource") => {
    showError({
      errorCode: '403',
      errorMessage: 'Forbidden',
      error: message,
    });
  };

  const show500 = (message = "Something went wrong on our end") => {
    showError({
      errorCode: '500',
      errorMessage: 'Server Error',
      error: message,
    });
  };

  return {
    showError,
    handleError,
    show404,
    show401,
    show403,
    show500,
  };
};

export default useErrorHandler;