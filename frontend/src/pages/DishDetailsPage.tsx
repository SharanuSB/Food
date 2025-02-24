import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { dishesAPI } from '../services/api';
import { Dish } from '../types';

const DishDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [dish, setDish] = useState<Dish | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedDishes, setRelatedDishes] = useState<Dish[]>([]);

  useEffect(() => {
    const fetchAllDishes = async () => {
      if (!id) return;

      try {
        setLoading(true);
        
        // First get all dishes
        const response = await dishesAPI.getAll({ 
          page: 1,
          limit: 1000, // Request all dishes
          sortBy: 'name',
          sortOrder: 'asc'
        });
        
        const allDishes = response.data;
        
        // Find the current dish by ID
        const currentDish = allDishes.find(d => d.id === id);
        
        if (!currentDish) {
          setError('Dish not found. It may have been removed or the ID is incorrect.');
          setLoading(false);
          return;
        }
        
        setDish(currentDish);
        
        // Find related dishes from the same region or with similar flavor profile
        const related = allDishes.filter(d => 
          d.id !== id && 
          (d.region === currentDish.region || d.flavor_profile === currentDish.flavor_profile)
        ).slice(0, 3); // Limit to 3 related dishes
        
        setRelatedDishes(related);
        setError(null);
      } catch (err) {
        console.error('Error fetching dish details:', err);
        setError('Failed to load dish details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAllDishes();
  }, [id]);

  // Handle if dish isn't found or there's an error
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex justify-center items-center h-[calc(100vh-64px)]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  if (error || !dish) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="bg-red-50 p-4 rounded-md mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">{error || 'Dish not found'}</p>
              </div>
            </div>
          </div>
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center text-primary-600 hover:text-primary-700"
          >
            <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Calculate total time
  const totalTime = dish.prep_time + dish.cook_time;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center text-primary-600 hover:text-primary-700"
          >
            <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </button>
        </div>
        
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-gray-900">{dish.name}</h1>
              <span
                className={`inline-flex items-center rounded-full px-3 py-0.5 text-sm font-medium ${
                  dish.diet === 'vegetarian'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {dish.diet}
              </span>
            </div>
            <p className="mt-1 text-gray-500">
              {dish.state}, {dish.region} India
            </p>
          </div>
          
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">About this dish</h2>
                  <p className="text-gray-600">
                    {dish.name} is a {dish.flavor_profile} {dish.course} from {dish.state} in {dish.region} India. 
                    It's a {dish.diet} dish that takes about {totalTime} minutes to prepare from start to finish.
                  </p>
                </div>
                
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">Ingredients</h2>
                  <ul className="list-disc pl-5 space-y-1 text-gray-600">
                    {dish.ingredients.map((ingredient, index) => (
                      <li key={index}>{ingredient}</li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Preparation Details</h3>
                  
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                      <p className="text-sm text-gray-500">Prep Time</p>
                      <p className="text-2xl font-bold text-primary-600">{dish.prep_time} min</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                      <p className="text-sm text-gray-500">Cook Time</p>
                      <p className="text-2xl font-bold text-primary-600">{dish.cook_time} min</p>
                    </div>
                    <div className="col-span-2 bg-white p-3 rounded-lg shadow-sm">
                      <p className="text-sm text-gray-500">Total Time</p>
                      <p className="text-2xl font-bold text-primary-600">{totalTime} min</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Flavor Profile</h3>
                  <div className="bg-white p-3 rounded-lg shadow-sm text-center">
                    <span className="text-xl font-medium text-gray-800 capitalize">{dish.flavor_profile}</span>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Course</h3>
                  <div className="bg-white p-3 rounded-lg shadow-sm text-center">
                    <span className="text-xl font-medium text-gray-800 capitalize">{dish.course}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {relatedDishes.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">More dishes from {dish.region} India</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedDishes.map((relatedDish) => (
                <div key={relatedDish.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className={`h-2 ${relatedDish.diet === 'vegetarian' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <div className="p-4">
                    <Link to={`/dishes/${relatedDish.id}`} className="text-lg font-semibold text-gray-900 hover:text-primary-600">
                      {relatedDish.name}
                    </Link>
                    <p className="mt-2 text-sm text-gray-500">
                      {relatedDish.flavor_profile} • {relatedDish.course}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
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

export default DishDetailsPage;