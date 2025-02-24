import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authAPI } from '../services/api';
import { AuthState, LoginCredentials, RegisterCredentials } from '../types';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Error message mapping function
const mapErrorMessage = (error: any): string => {
  // Check if error is an object with a response and data
  if (error.response && error.response.data) {
    const errorMessage = error.response.data.message;
    
    // Specific error mappings
    const errorMap: { [key: string]: string } = {
      // Login errors
      'Invalid credentials': 'Incorrect email or password. Please try again.',
      'User not found': 'No account found with this email address.',
      
      // Registration errors
      'User with this email already exists': 'This email is already registered.',
      'All fields are required': 'Please fill in all required fields.',
      'Password is too weak': 'Password is too weak. Please choose a stronger password.',
      'Invalid email format': 'Please enter a valid email address.',
      
      // Generic network or server errors
      'Network Error': 'Unable to connect. Please check your internet connection.',
      'Failed to register user': 'Registration failed. Please try again.',
      'Failed to login': 'Login failed. Please try again.',
    };

    // Check for exact match
    if (errorMap[errorMessage]) {
      return errorMap[errorMessage];
    }

    // Check for partial matches
    for (const [key, value] of Object.entries(errorMap)) {
      if (errorMessage.toLowerCase().includes(key.toLowerCase())) {
        return value;
      }
    }

    // Return the original error message if no match is found
    return errorMessage;
  }

  // Fallback for other types of errors
  if (error instanceof Error) {
    return error.message;
  }

  // Most generic fallback
  return 'An unexpected error occurred. Please try again.';
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState>(initialState);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (token && user) {
      setState({
        user: JSON.parse(user),
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } else {
      setState({
        ...initialState,
        isLoading: false,
      });
    }
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      setState({
        ...state,
        isLoading: true,
        error: null,
      });

      const { token, user } = await authAPI.login(credentials);
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      setState({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      setState({
        ...initialState,
        isLoading: false,
        error: mapErrorMessage(error),
      });
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    try {
      setState({
        ...state,
        isLoading: true,
        error: null,
      });

      const { token, user } = await authAPI.register(credentials);
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      setState({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      setState({
        ...initialState,
        isLoading: false,
        error: mapErrorMessage(error),
      });
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    setState({
      ...initialState,
      isLoading: false,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};