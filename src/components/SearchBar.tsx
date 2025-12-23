import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, UserPlus, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useSocialStore } from '../stores/socialStore';
import { useAuth } from '../context/AuthContext';

interface SearchResult {
  id: string;
  name: string;
  username: string;
  avatar_url: string | null;
}

const SearchBar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { friends, sendFriendRequest } = useSocialStore();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const searchUsers = async () => {
      if (!query.trim() || !user) {
        setResults([]);
        return;
      }

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('profiles')
          .select('id, name, username, avatar_url')
          .or(`name.ilike.%${query}%,username.ilike.%${query}%`)
          .neq('id', user.id)
          .limit(5);

        if (error) throw error;
        setResults(data || []);
      } catch (err) {
        console.error('Error searching users:', err);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(searchUsers, 300);
    return () => clearTimeout(debounce);
  }, [query, user]);

  const isFriend = (userId: string) => {
    return friends.some(
      friend =>
        (friend.user_id === userId || friend.friend_id === userId) &&
        friend.status === 'accepted'
    );
  };

  const hasPendingRequest = (userId: string) => {
    return friends.some(
      friend =>
        (friend.user_id === userId || friend.friend_id === userId) &&
        friend.status === 'pending'
    );
  };

  const handleFriendRequest = async (userId: string) => {
    await sendFriendRequest(userId);
  };

  if (!user) return null;

  return (
    <div ref={searchRef} className="relative">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search users..."
          className="w-64 px-4 py-2 pl-10 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
      </div>

      {isOpen && (query.trim() || results.length > 0) && (
        <div className="absolute mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          {loading ? (
            <div className="p-4 text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
            </div>
          ) : results.length > 0 ? (
            <div className="py-2">
              {results.map((result) => (
                <div
                  key={result.id}
                  className="px-4 py-2 hover:bg-gray-50 flex items-center justify-between"
                >
                  <div
                    className="flex items-center cursor-pointer"
                    onClick={() => {
                      navigate(`/profile/${result.id}`);
                      setIsOpen(false);
                      setQuery('');
                    }}
                  >
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex-shrink-0">
                      {result.avatar_url ? (
                        <img
                          src={result.avatar_url}
                          alt={result.name}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                          <span className="text-indigo-600 font-medium">
                            {result.name.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="ml-3">
                      <p className="font-medium text-gray-900">{result.name}</p>
                      <p className="text-sm text-gray-500">@{result.username}</p>
                    </div>
                  </div>

                  {!isFriend(result.id) && (
                    <button
                      onClick={() => handleFriendRequest(result.id)}
                      disabled={hasPendingRequest(result.id)}
                      className="ml-2 p-2 text-indigo-600 hover:text-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      title={hasPendingRequest(result.id) ? 'Friend request pending' : 'Send friend request'}
                    >
                      {hasPendingRequest(result.id) ? (
                        <Clock className="h-5 w-5" />
                      ) : (
                        <UserPlus className="h-5 w-5" />
                      )}
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : query.trim() ? (
            <div className="p-4 text-center text-gray-500">
              No users found
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default SearchBar