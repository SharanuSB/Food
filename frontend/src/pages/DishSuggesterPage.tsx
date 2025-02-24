import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import DishCard from '../components/DishCard';
import { dishesAPI } from '../services/api';
import { Dish } from '../types';

const DishSuggesterPage = () => {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [suggestedDishes, setSuggestedDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(false);
  const [allIngredients, setAllIngredients] = useState<string[]>([]);
  const [filteredIngredients, setFilteredIngredients] = useState<string[]>([]);
  
  useEffect(() => {
    const fetchAllIngredients = async () => {
      try {
        const response = await dishesAPI.getAll({ page: 1, limit: 100 });
        const allDishes = response.data;
        
        const ingredientsList = allDishes.flatMap(dish => dish.ingredients);
            
        const uniqueIngredients = Array.from(new Set(
          ingredientsList.map(ingredient => ingredient.toLowerCase().trim())
        )).sort();
        
        setAllIngredients(uniqueIngredients);
      } catch (error) {
        console.error('Error fetching ingredients:', error);
      }
    };
    
    fetchAllIngredients();
  }, []);
  
  // Filter ingredients based on input
  useEffect(() => {
    if (inputValue.trim() === '') {
      setFilteredIngredients([]);
      return;
    }
    
    const filtered = allIngredients.filter(
      ingredient => 
        ingredient.toLowerCase().includes(inputValue.toLowerCase()) && 
        !ingredients.includes(ingredient)
    ).slice(0, 5); // Limit to 5 suggestions
    
    setFilteredIngredients(filtered);
  }, [inputValue, allIngredients, ingredients]);
  
  // Find dishes based on selected ingredients
  useEffect(() => {
    const findDishes = async () => {
      if (ingredients.length === 0) {
        setSuggestedDishes([]);
        return;
      }
      
      try {
        setLoading(true);
        const dishes = await dishesAPI.findByIngredients(ingredients);
        setSuggestedDishes(dishes);
      } catch (error) {
        console.error('Error finding dishes:', error);
      } finally {
        setLoading(false);
      }
    };
    
    findDishes();
  }, [ingredients]);
  
  const handleAddIngredient = (ingredient: string) => {
    if (
      !ingredients.includes(ingredient) && 
      ingredient.trim() !== ''
    ) {
      setIngredients([...ingredients, ingredient]);
      setInputValue('');
      setFilteredIngredients([]);
    }
  };
  
  const handleRemoveIngredient = (ingredient: string) => {
    setIngredients(ingredients.filter(item => item !== ingredient));
  };
  
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim() !== '') {
      e.preventDefault();
      if (filteredIngredients.length > 0) {
        handleAddIngredient(filteredIngredients[0]);
      } else {
        handleAddIngredient(inputValue.trim());
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dish Suggester</h1>
          <p className="mt-2 text-lg text-gray-600">
            Tell us what ingredients you have, and we'll suggest dishes you can make!
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Select your ingredients</h2>
          
          <div className="relative mb-4">
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="Type an ingredient..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleInputKeyDown}
            />
            
            {filteredIngredients.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white shadow-lg rounded-md border border-gray-200">
                {filteredIngredients.map((ingredient, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleAddIngredient(ingredient)}
                  >
                    {ingredient}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {ingredients.map((ingredient, index) => (
                <div
                  key={index}
                  className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium flex items-center"
                >
                  {ingredient}
                  <button
                    type="button"
                    className="ml-1.5 text-primary-600 hover:text-primary-800"
                    onClick={() => handleRemoveIngredient(ingredient)}
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          {ingredients.length > 0 ? (
            <p className="text-sm text-gray-600">
              Click on an ingredient chip to remove it.
            </p>
          ) : (
            <p className="text-sm text-gray-600">
              Start by typing an ingredient and pressing Enter.
            </p>
          )}
        </div>
        
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            {loading
              ? 'Finding dishes...'
              : ingredients.length === 0
              ? 'Add ingredients to see dish suggestions'
              : `Dishes you can make with ${ingredients.length} ingredient${ingredients.length === 1 ? '' : 's'}`}
          </h2>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
          ) : ingredients.length > 0 && suggestedDishes.length === 0 ? (
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">No dishes found</h3>
              <p className="mt-1 text-gray-500">
                We couldn't find any dishes that match all your ingredients. Try adding more ingredients or removing some.
              </p>
            </div>
          ) : ingredients.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {suggestedDishes.map((dish) => (
                <DishCard key={dish.id} dish={dish} />
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 p-8 rounded-lg border-2 border-dashed border-gray-300 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">Start by adding ingredients</h3>
              <p className="mt-1 text-gray-500">
                Add the ingredients you have, and we'll suggest dishes you can make!
              </p>
            </div>
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

export default DishSuggesterPage;