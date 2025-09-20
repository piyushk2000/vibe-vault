import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
import { updateConnectionLastMessage } from '../redux/connectionSlice';
import socketService from '../services/socket';

interface SocketContextType {
  socket: any;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { token } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (token) {
      // Connect socket
      socketService.connect(token);

      // Set up global listeners
      socketService.onMessageNotification((data) => {
        dispatch(updateConnectionLastMessage({
          connectionId: data.connectionId,
          message: data.message
        }));
      });

      socketService.onMatchNotification((matchData) => {
        // Handle match notifications globally
        console.log('New match:', matchData);
        // You could show a toast notification here
      });

      return () => {
        socketService.disconnect();
      };
    }
  }, [token, dispatch]);

  return (
    <SocketContext.Provider value={{ socket: socketService.getSocket() }}>
      {children}
    </SocketContext.Provider>
  );
};