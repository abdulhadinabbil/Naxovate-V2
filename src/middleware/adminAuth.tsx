import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const withAdminAuth = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  return function WithAdminAuthWrapper(props: P) {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = React.useState(true);

    useEffect(() => {
      if (!user) {
        navigate('/login');
        return;
      }

      const isAdmin = user.email === 'nabil4457@gmail.com';
      if (!isAdmin) {
        navigate('/');
        return;
      }

      setLoading(false);
    }, [user, navigate]);

    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500" />
        </div>
      );
    }

    if (user?.email !== 'nabil4457@gmail.com') {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
};