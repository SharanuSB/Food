import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SearchProvider } from './context/SearchContext';
import PrivateRoute from './components/PrivateRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import DishDetailsPage from './pages/DishDetailsPage';
import SearchResultsPage from './pages/SearchResultsPage';
import DishSuggesterPage from './pages/DishSuggesterPage';
import ProfilePage from './pages/ProfilePage';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Protected Routes with Search Context */}
          <Route element={<PrivateRoute />}>
            <Route path="/" element={
              <SearchProvider>
                <HomePage />
              </SearchProvider>
            } />
            <Route path="/dishes/:id" element={
              <SearchProvider>
                <DishDetailsPage />
              </SearchProvider>
            } />
            <Route path="/search" element={
              <SearchProvider>
                <SearchResultsPage />
              </SearchProvider>
            } />
            <Route path="/suggest" element={
              <SearchProvider>
                <DishSuggesterPage />
              </SearchProvider>
            } />
            <Route path="/profile" element={
              <SearchProvider>
                <ProfilePage />
              </SearchProvider>
            } />
            {/* Add more protected routes here */}
            {/* <Route path="/dishes" element={
              <SearchProvider>
                <DishesPage />
              </SearchProvider>
            } /> */}
          </Route>
          
          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;