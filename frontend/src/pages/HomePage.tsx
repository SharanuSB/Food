import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import DishCard from '../components/DishCard';
import Pagination from '../components/Pagination';
import { dishesAPI } from '../services/api';
import { Dish } from '../types';

const HomePage = () => {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDiet, setSelectedDiet] = useState<string>('all');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  
  // Manually set the total count to 255 since we know that's the size of our dataset
  useEffect(() => {
    setTotalItems(255); // Hardcoded total from the CSV file
  }, []);
  
  // Fetch paginated data based on current settings
  useEffect(() => {
    const fetchDishes = async () => {
      try {
        setLoading(true);
        // Use a larger limit to ensure we get enough data for the current page
        const response = await dishesAPI.getAll({ 
          page: 1,  // Always get from the beginning
          limit: 1000, // Request a large number to get most/all items
          sortBy: 'name',
          sortOrder: 'asc'
        });
        
        // Store all fetched dishes
        const allDishes = response.data;
        
        // Manually paginate on the client side
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        setDishes(allDishes.slice(startIndex, endIndex));
        
        // Update total count if we get more accurate information
        if (response.pagination && response.pagination.total > totalItems) {
          setTotalItems(response.pagination.total);
        }
        
        setError(null);
      } catch (err) {
        setError('Failed to fetch dishes. Please try again later.');
        console.error('Error fetching dishes:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDishes();
  }, [currentPage, itemsPerPage]);
  
  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Handle items per page change
  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
  };
  
  // Filter dishes based on selected filters
  const filteredDishes = dishes.filter(dish => {
    if (selectedDiet !== 'all' && dish.diet !== selectedDiet) return false;
    if (selectedRegion !== 'all' && dish.region !== selectedRegion) return false;
    return true;
  });
  
  // Get unique regions for filter from currently loaded dishes
  const regions = ['all', ...new Set(dishes.map(dish => dish.region))].filter(Boolean).sort();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Explore Indian Cuisine</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover authentic Indian dishes from various regions of India. 
            Find recipes based on your available ingredients or explore by region and flavor.
          </p>
        </div>
        
        <div className="bg-white shadow rounded-lg overflow-hidden mb-12">
          <div className="p-8 text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Don't know what to cook?
            </h2>
            <p className="text-gray-600 mb-6">
              Tell us what ingredients you have, and we'll suggest dishes you can make!
            </p>
            <Link
              to="/suggest"
              className="btn btn-primary inline-block"
            >
              Try Dish Suggester
            </Link>
          </div>
        </div>
        
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center">
              <h2 className="text-2xl font-semibold text-gray-900">Popular Dishes</h2>
              <span className="ml-3 inline-flex items-center rounded-full bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-800">
                {totalItems} total
              </span>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <div>
                <label htmlFor="diet-filter" className="block text-sm font-medium text-gray-700 mb-1">
                  Diet Type
                </label>
                <select
                  id="diet-filter"
                  value={selectedDiet}
                  onChange={(e) => setSelectedDiet(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                >
                  <option value="all">All</option>
                  <option value="vegetarian">Vegetarian</option>
                  <option value="non vegetarian">Non-Vegetarian</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="region-filter" className="block text-sm font-medium text-gray-700 mb-1">
                  Region
                </label>
                <select
                  id="region-filter"
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                >
                  {regions.map((region) => (
                    <option key={region} value={region}>
                      {region === 'all' ? 'All Regions' : region}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          {loading && dishes.length === 0 ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 p-4 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-red-800">{error}</p>
                </div>
              </div>
            </div>
          ) : filteredDishes.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No dishes found with the selected filters.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredDishes.map((dish) => (
                  <DishCard key={dish.id} dish={dish} />
                ))}
              </div>
              
              {loading && (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
                </div>
              )}
              
              {/* Pagination Component */}
              <Pagination
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
                onPageChange={handlePageChange}
                onItemsPerPageChange={handleItemsPerPageChange}
              />
            </>
          )}
        </div>
      </main>
      
      <footer className="bg-white mt-12 border-t border-gray-200">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Indian Cuisine Explorer. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;