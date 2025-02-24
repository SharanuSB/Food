import { createContext, useContext, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { dishesAPI } from '../services/api';
import { Dish } from '../types';

interface SearchContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: Dish[];
  loading: boolean;
  error: string | null;
  clearSearch: () => void;
  submitSearch: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider = ({ children }: { children: React.ReactNode }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const submitSearch = useCallback(() => {
    const trimmedQuery = searchQuery.trim();
    
    if (!trimmedQuery) return;

    const performSearch = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const results = await dishesAPI.searchByName(trimmedQuery);
        setSearchResults(results);

        // Navigate to search page
        if (location.pathname !== '/search') {
          navigate(`/search?q=${encodeURIComponent(trimmedQuery)}`);
        } else {
          navigate(`/search?q=${encodeURIComponent(trimmedQuery)}`, { replace: true });
        }
      } catch (err) {
        setError('Failed to perform search. Please try again.');
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    };

    performSearch();
  }, [searchQuery, location.pathname, navigate]);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setSearchResults([]);
    setLoading(false);
    setError(null);
    navigate('/');
  }, [navigate]);

  return (
    <SearchContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
        searchResults,
        loading,
        error,
        clearSearch,
        submitSearch
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = (): SearchContextType => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};