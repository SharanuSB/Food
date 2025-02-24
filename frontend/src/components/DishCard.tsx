import { Link } from 'react-router-dom';
import { Dish } from '../types';

interface DishCardProps {
  dish: Dish;
}

const DishCard = ({ dish }: DishCardProps) => {
  return (
    <div className="card overflow-hidden transition-shadow hover:shadow-lg">
      <div className={`h-3 ${dish.diet === 'vegetarian' ? 'bg-green-500' : 'bg-red-500'}`}></div>
      <div className="p-4">
        <Link to={`/dishes/${dish.id}`}>
          <h3 className="text-lg font-semibold text-gray-900 hover:text-primary-600">{dish.name}</h3>
        </Link>
        
        <div className="mt-2 flex items-center text-sm text-gray-500">
          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
            dish.diet === 'vegetarian' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {dish.diet}
          </span>
          <span className="mx-2">•</span>
          <span className="capitalize">{dish.course}</span>
        </div>
        
        <div className="mt-2">
          <span className="text-sm font-medium text-gray-700">Prep time:</span>
          <span className="ml-1 text-sm text-gray-500">{dish.prep_time} min</span>
          <span className="mx-2 text-gray-300">|</span>
          <span className="text-sm font-medium text-gray-700">Cook time:</span>
          <span className="ml-1 text-sm text-gray-500">{dish.cook_time} min</span>
        </div>
        
        <div className="mt-2">
          <span className="text-sm font-medium text-gray-700">Flavor:</span>
          <span className="ml-1 text-sm text-gray-500 capitalize">{dish.flavor_profile}</span>
        </div>
        
        <div className="mt-2">
          <span className="text-sm font-medium text-gray-700">Origin:</span>
          <span className="ml-1 text-sm text-gray-500">{dish.state}, {dish.region} India</span>
        </div>
        
        <div className="mt-3">
          <span className="text-sm font-medium text-gray-700">Ingredients:</span>
          <div className="mt-1 flex flex-wrap gap-1">
            {dish.ingredients.slice(0, 5).map((ingredient, idx) => (
              <span
                key={idx}
                className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800"
              >
                {ingredient}
              </span>
            ))}
            {dish.ingredients.length > 5 && (
              <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                +{dish.ingredients.length - 5} more
              </span>
            )}
          </div>
        </div>
        
        <div className="mt-4">
          <Link
            to={`/dishes/${dish.id}`}
            className="text-sm font-medium text-primary-600 hover:text-primary-500"
          >
            View Details →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DishCard;