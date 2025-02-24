import { useState } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  
  const favoriteDishes = [
    { id: '1', name: 'Butter Chicken' },
    { id: '2', name: 'Masala Dosa' },
    { id: '3', name: 'Biryani' }
  ];
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/4">
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="p-6 text-center">
                <div className="h-24 w-24 rounded-full bg-primary-200 flex items-center justify-center text-primary-800 font-bold text-3xl mx-auto">
                  {user?.username?.charAt(0).toUpperCase() || 'U'}
                </div>
                <h2 className="mt-4 text-xl font-semibold text-gray-900">{user?.username || 'User'}</h2>
                <p className="text-gray-600">{user?.email || 'user@example.com'}</p>
              </div>
              
              <div className="border-t border-gray-200">
                <nav className="flex flex-col">
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`px-4 py-3 text-left ${
                      activeTab === 'profile'
                        ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-500'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    Profile Information
                  </button>
                  <button
                    onClick={() => setActiveTab('favorites')}
                    className={`px-4 py-3 text-left ${
                      activeTab === 'favorites'
                        ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-500'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    Favorite Dishes
                  </button>
                </nav>
              </div>
            </div>
          </div>
          
          <div className="w-full md:w-3/4">
            <div className="bg-white shadow rounded-lg">
              {activeTab === 'profile' && (
                <div className="p-6">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-6">Profile Information</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Username
                      </label>
                      <input
                        type="text"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        value={user?.username || ''}
                        readOnly
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        value={user?.email || ''}
                        readOnly
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Role
                      </label>
                      <input
                        type="text"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        value={user?.role || 'user'}
                        readOnly
                      />
                    </div>
                  </div>
                </div>
              )}
              
              {/* Favorite Dishes */}
              {activeTab === 'favorites' && (
                <div className="p-6">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-6">Favorite Dishes</h2>
                  
                  {favoriteDishes.length > 0 ? (
                    <ul className="divide-y divide-gray-200">
                      {favoriteDishes.map((dish) => (
                        <li key={dish.id} className="py-4 flex justify-between items-center">
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">{dish.name}</h3>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">You haven't added any favorite dishes yet.</p>
                      <button
                        type="button"
                        className="mt-4 btn btn-primary"
                      >
                        Explore Dishes
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
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

export default ProfilePage;