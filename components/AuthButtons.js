import { useState } from 'react';
import { supabase } from '../utils/supabase';
import { useAuth } from '../contexts/AuthContext';
import LoginForm from './LoginForm';

export default function AuthButtons() {
  const { user } = useAuth();
  const [showLoginForm, setShowLoginForm] = useState(false);

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google'
    });
    if (error) console.error('Erreur de connexion:', error);
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Erreur de déconnexion:', error);
  };

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">
          {user.email}
        </span>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Déconnexion
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {showLoginForm ? (
        <LoginForm />
      ) : (
        <div className="flex flex-col gap-4">
          <button
            onClick={() => setShowLoginForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Se connecter avec email
          </button>
          <button
            onClick={handleGoogleLogin}
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 flex items-center justify-center gap-2"
          >
            <img src="/google-icon.svg" alt="Google" className="w-5 h-5" />
            Se connecter avec Google
          </button>
        </div>
      )}
    </div>
  );
}
