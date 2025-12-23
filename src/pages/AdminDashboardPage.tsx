import React, { useState, useEffect } from 'react';
import { withAdminAuth } from '../middleware/adminAuth';
import { supabase } from '../lib/supabase';
import {
  Users,
  Shield,
  UserX,
  Search,
  CheckCircle,
  XCircle,
  Loader,
  Image as ImageIcon,
  CreditCard,
  MessageCircle,
  Clock,
  AlertCircle,
  Calendar,
  TrendingUp,
  RefreshCw
} from 'lucide-react';

interface UserWithSubscription {
  id: string;
  email: string;
  name: string;
  created_at: string;
  subscription: {
    id: string;
    plan: string;
    status: string;
    images_generated: number;
    storage_used: number;
    image_limit: number;
    current_period_start: string;
    current_period_end: string;
    created_at: string;
  } | null;
}

interface SupportTicket {
  id: string;
  subject: string;
  status: string;
  priority: string;
  created_at: string;
  profiles: {
    name: string;
    email: string;
  };
}

const AdminDashboardPage = () => {
  const [users, setUsers] = useState<UserWithSubscription[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'users' | 'tickets'>('users');
  const [stats, setStats] = useState({
    totalUsers: 0,
    premiumUsers: 0,
    totalImagesGenerated: 0,
    monthlyRevenue: 0,
    openTickets: 0,
    totalTickets: 0
  });

  useEffect(() => {
    fetchAllData();
    
    // Set up real-time subscriptions for live updates
    const profilesChannel = supabase
      .channel('admin-profiles-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'profiles' 
      }, (payload) => {
        console.log('Profile change detected:', payload);
        fetchAllData();
      })
      .subscribe();

    const subscriptionsChannel = supabase
      .channel('admin-subscriptions-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'subscriptions' 
      }, (payload) => {
        console.log('Subscription change detected:', payload);
        fetchAllData();
      })
      .subscribe();

    const ticketsChannel = supabase
      .channel('admin-tickets-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'support_tickets' 
      }, (payload) => {
        console.log('Ticket change detected:', payload);
        fetchTickets();
      })
      .subscribe();

    return () => {
      profilesChannel.unsubscribe();
      subscriptionsChannel.unsubscribe();
      ticketsChannel.unsubscribe();
    };
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Fetching admin dashboard data...');

      // Fetch users and subscriptions in parallel
      const [usersResponse, subscriptionsResponse] = await Promise.all([
        supabase
          .from('profiles')
          .select('id, email, name, created_at')
          .order('created_at', { ascending: false }),
        supabase
          .from('subscriptions')
          .select('*')
          .order('created_at', { ascending: false })
      ]);

      if (usersResponse.error) {
        console.error('Error fetching users:', usersResponse.error);
        throw usersResponse.error;
      }

      if (subscriptionsResponse.error) {
        console.error('Error fetching subscriptions:', subscriptionsResponse.error);
        throw subscriptionsResponse.error;
      }

      const usersData = usersResponse.data || [];
      const subscriptionsData = subscriptionsResponse.data || [];

      console.log('Fetched users:', usersData.length);
      console.log('Fetched subscriptions:', subscriptionsData.length);

      // Combine users with their subscriptions
      const usersWithSubscriptions: UserWithSubscription[] = usersData.map(user => {
        const subscription = subscriptionsData.find(sub => sub.user_id === user.id);
        return {
          ...user,
          subscription: subscription || null
        };
      });

      console.log('Combined users with subscriptions:', usersWithSubscriptions);

      setUsers(usersWithSubscriptions);
      
      // Calculate real-time stats
      const activeSubscriptions = usersWithSubscriptions.filter(user => 
        user.subscription?.plan === 'premium' && 
        user.subscription?.status === 'active'
      );

      const totalImages = usersWithSubscriptions.reduce((sum, user) => 
        sum + (user.subscription?.images_generated || 0), 0
      );

      // Calculate revenue based on actual subscription types
      let monthlyRevenue = 0;
      activeSubscriptions.forEach(user => {
        if (user.subscription?.image_limit === 10) {
          monthlyRevenue += 2; // Basic plan
        } else if (user.subscription?.image_limit === 60) {
          monthlyRevenue += 10; // Monthly plan
        } else if (user.subscription?.image_limit === 650) {
          monthlyRevenue += 100; // Yearly plan
        }
      });

      const newStats = {
        totalUsers: usersWithSubscriptions.length,
        premiumUsers: activeSubscriptions.length,
        totalImagesGenerated: totalImages,
        monthlyRevenue,
        openTickets: stats.openTickets, // Keep existing ticket stats
        totalTickets: stats.totalTickets
      };

      console.log('Calculated stats:', newStats);
      setStats(prev => ({ ...prev, ...newStats }));

      // Also fetch tickets
      await fetchTickets();

    } catch (err: any) {
      console.error('Error in fetchAllData:', err);
      setError(`Failed to fetch data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchTickets = async () => {
    try {
      const { data: tickets, error: ticketsError } = await supabase
        .from('support_tickets')
        .select(`
          id,
          subject,
          status,
          priority,
          created_at,
          profiles!support_tickets_user_id_fkey (
            name,
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (ticketsError) {
        console.error('Error fetching tickets:', ticketsError);
        throw ticketsError;
      }

      setTickets(tickets || []);
      
      const openTickets = tickets?.filter(ticket => ticket.status !== 'closed').length || 0;
      
      setStats(prev => ({
        ...prev,
        openTickets,
        totalTickets: tickets?.length || 0
      }));

    } catch (err: any) {
      console.error('Error fetching tickets:', err);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;

    try {
      setUpdating(userId);
      
      console.log('Deleting user:', userId);

      // Delete user profile (this will cascade to subscriptions due to foreign key)
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (error) {
        console.error('Error deleting user:', error);
        throw error;
      }

      console.log('User deleted successfully');
      
      // Refresh data immediately
      await fetchAllData();

    } catch (err: any) {
      console.error('Error in handleDeleteUser:', err);
      setError(`Failed to delete user: ${err.message}`);
    } finally {
      setUpdating(null);
    }
  };

  const handleUpdateSubscription = async (userId: string, plan: 'free' | 'premium', type: 'basic' | 'monthly' | 'yearly' | null) => {
    try {
      setUpdating(userId);
      setError(null);

      console.log('Updating subscription for user:', userId, 'Plan:', plan, 'Type:', type);

      const imageLimit = type === 'basic' ? 10 : type === 'monthly' ? 60 : type === 'yearly' ? 650 : 0;
      const periodEnd = type === 'yearly'
        ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
        : type === 'monthly'
        ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        : type === 'basic'
        ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
        : null;

      const subscriptionData = {
        user_id: userId,
        plan,
        status: plan === 'free' ? 'canceled' : 'active',
        current_period_start: new Date().toISOString(),
        current_period_end: periodEnd,
        image_limit: imageLimit,
        storage_used: 0,
        images_generated: 0 // Reset when changing plans
      };

      console.log('Subscription data to upsert:', subscriptionData);

      // Use upsert to handle both insert and update cases
      const { data, error: upsertError } = await supabase
        .from('subscriptions')
        .upsert(subscriptionData, {
          onConflict: 'user_id',
          ignoreDuplicates: false
        })
        .select();

      if (upsertError) {
        console.error('Error upserting subscription:', upsertError);
        throw upsertError;
      }

      console.log('Subscription updated successfully:', data);

      // Force immediate refresh of all data
      await fetchAllData();

    } catch (err: any) {
      console.error('Error in handleUpdateSubscription:', err);
      setError(`Failed to update subscription: ${err.message}`);
    } finally {
      setUpdating(null);
    }
  };

  const updateTicketStatus = async (ticketId: string, status: string) => {
    try {
      console.log('Updating ticket status:', ticketId, status);

      const { error } = await supabase
        .from('support_tickets')
        .update({ status })
        .eq('id', ticketId);

      if (error) {
        console.error('Error updating ticket:', error);
        throw error;
      }
      
      await fetchTickets();
    } catch (err: any) {
      console.error('Error in updateTicketStatus:', err);
      setError(`Failed to update ticket: ${err.message}`);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPlanType = (subscription: UserWithSubscription['subscription']) => {
    if (!subscription || subscription.plan !== 'premium' || subscription.status !== 'active') {
      return 'Free';
    }
    if (subscription.image_limit === 10) return 'Basic';
    if (subscription.image_limit === 60) return 'Monthly Premium';
    if (subscription.image_limit === 650) return 'Yearly Premium';
    return 'Premium';
  };

  const getPlanBadgeColor = (subscription: UserWithSubscription['subscription']) => {
    if (!subscription || subscription.plan !== 'premium' || subscription.status !== 'active') {
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
    if (subscription.image_limit === 10) {
      return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
    }
    if (subscription.image_limit === 60) {
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
    }
    if (subscription.image_limit === 650) {
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
    }
    return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400';
  };

  const getUsagePercentage = (used: number, limit: number) => {
    if (limit === 0) return 0;
    return Math.min((used / limit) * 100, 100);
  };

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const isExpiringSoon = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const daysUntilExpiry = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 7 && daysUntilExpiry > 0;
  };

  const isExpired = (endDate: string) => {
    return new Date(endDate) < new Date();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'in_progress':
        return <AlertCircle className="h-4 w-4 text-blue-500" />;
      case 'closed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'high':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const filteredUsers = users.filter(user =>
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTickets = tickets.filter(ticket =>
    ticket.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.profiles?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.profiles?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage users, subscriptions, and support tickets</p>
          </div>
          <button
            onClick={fetchAllData}
            disabled={loading}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh Data
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400">Total Users</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.totalUsers}
              </h3>
            </div>
            <Users className="h-8 w-8 text-indigo-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400">Premium Users</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.premiumUsers}
              </h3>
            </div>
            <Shield className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400">Images Generated</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.totalImagesGenerated}
              </h3>
            </div>
            <ImageIcon className="h-8 w-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400">Total Revenue</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                ${stats.monthlyRevenue}
              </h3>
            </div>
            <CreditCard className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400">Open Tickets</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.openTickets}
              </h3>
            </div>
            <MessageCircle className="h-8 w-8 text-orange-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400">Total Tickets</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.totalTickets}
              </h3>
            </div>
            <MessageCircle className="h-8 w-8 text-gray-500" />
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <p className="text-red-700 dark:text-red-400">{error}</p>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-500 hover:text-red-700"
            >
              <XCircle className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('users')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'users'
                  ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              User Management ({filteredUsers.length})
            </button>
            <button
              onClick={() => setActiveTab('tickets')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'tickets'
                  ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Support Tickets ({filteredTickets.length})
            </button>
          </nav>
        </div>

        <div className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {activeTab === 'users' ? 'User Management' : 'Support Tickets'}
            </h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full lg:w-64 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
              />
            </div>
          </div>

          {activeTab === 'users' ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[200px]">
                      User
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[150px]">
                      Plan & Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[180px]">
                      Image Usage
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[120px]">
                      Storage Used
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[200px]">
                      Subscription Dates
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[250px]">
                      Plan Management
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[80px]">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-8 text-center">
                        <div className="flex flex-col items-center">
                          <Loader className="h-8 w-8 animate-spin text-indigo-500 mb-2" />
                          <p className="text-gray-500 dark:text-gray-400">Loading user data...</p>
                        </div>
                      </td>
                    </tr>
                  ) : filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                        No users found
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="px-4 py-4">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                              <span className="text-indigo-600 dark:text-indigo-400 font-medium">
                                {user.name?.[0] || user.email?.[0]}
                              </span>
                            </div>
                            <div className="ml-3 min-w-0 flex-1">
                              <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                {user.name}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                {user.email}
                              </div>
                              <div className="text-xs text-gray-400 dark:text-gray-500">
                                Joined: {formatDate(user.created_at)}
                              </div>
                            </div>
                          </div>
                        </td>
                        
                        <td className="px-4 py-4">
                          <div className="space-y-1">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPlanBadgeColor(user.subscription)}`}>
                              {getPlanType(user.subscription)}
                            </span>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              Status: {user.subscription?.status || 'inactive'}
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-4">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-900 dark:text-white font-medium">
                                {user.subscription?.images_generated || 0} / {user.subscription?.image_limit || 0}
                              </span>
                              <span className="text-xs text-gray-500">
                                {user.subscription?.image_limit ? 
                                  `${Math.round(getUsagePercentage(user.subscription.images_generated || 0, user.subscription.image_limit))}%` 
                                  : '0%'
                                }
                              </span>
                            </div>
                            <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                              <div
                                className={`h-2 rounded-full transition-all duration-300 ${
                                  getUsageColor(getUsagePercentage(user.subscription?.images_generated || 0, user.subscription?.image_limit || 0))
                                }`}
                                style={{
                                  width: `${getUsagePercentage(user.subscription?.images_generated || 0, user.subscription?.image_limit || 0)}%`
                                }}
                              />
                            </div>
                            {user.subscription?.image_limit && getUsagePercentage(user.subscription.images_generated || 0, user.subscription.image_limit) >= 90 && (
                              <div className="flex items-center text-xs text-red-600 dark:text-red-400">
                                <AlertCircle className="h-3 w-3 mr-1" />
                                Near limit
                              </div>
                            )}
                          </div>
                        </td>

                        <td className="px-4 py-4">
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {formatBytes(user.subscription?.storage_used || 0)}
                          </span>
                        </td>

                        <td className="px-4 py-4">
                          {user.subscription && user.subscription.plan === 'premium' && user.subscription.status === 'active' ? (
                            <div className="space-y-1 text-xs">
                              <div className="flex items-center text-gray-600 dark:text-gray-400">
                                <Calendar className="h-3 w-3 mr-1" />
                                <span>Started: {formatDate(user.subscription.current_period_start)}</span>
                              </div>
                              <div className={`flex items-center ${
                                isExpired(user.subscription.current_period_end) 
                                  ? 'text-red-600 dark:text-red-400' 
                                  : isExpiringSoon(user.subscription.current_period_end)
                                  ? 'text-yellow-600 dark:text-yellow-400'
                                  : 'text-gray-600 dark:text-gray-400'
                              }`}>
                                <TrendingUp className="h-3 w-3 mr-1" />
                                <span>
                                  Expires: {formatDate(user.subscription.current_period_end)}
                                  {isExpired(user.subscription.current_period_end) && ' (Expired)'}
                                  {isExpiringSoon(user.subscription.current_period_end) && ' (Soon)'}
                                </span>
                              </div>
                              <div className="text-gray-500 dark:text-gray-500">
                                Duration: {user.subscription.image_limit === 650 ? '1 Year' : user.subscription.image_limit === 60 ? '1 Month' : '1 Year'}
                              </div>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400 dark:text-gray-500">No active subscription</span>
                          )}
                        </td>

                        <td className="px-4 py-4">
                          <div className="space-y-2">
                            <button
                              onClick={() => handleUpdateSubscription(user.id, 'premium', 'basic')}
                              disabled={updating === user.id}
                              className={`w-full px-3 py-2 rounded-lg text-xs font-medium transition ${
                                user.subscription?.plan === 'premium' && user.subscription?.status === 'active' && user.subscription?.image_limit === 10
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 cursor-default'
                                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 hover:bg-green-100 hover:text-green-800 dark:hover:bg-green-900/20 dark:hover:text-green-400 disabled:opacity-50'
                              }`}
                            >
                              {updating === user.id ? (
                                <div className="flex items-center justify-center">
                                  <Loader className="h-3 w-3 animate-spin mr-1" />
                                  Updating...
                                </div>
                              ) : (
                                <>
                                  Basic Plan (10 images) - $2
                                  {user.subscription?.plan === 'premium' && user.subscription?.status === 'active' && user.subscription?.image_limit === 10 && (
                                    <span className="block text-xs text-green-600 dark:text-green-400 mt-1">✓ Active</span>
                                  )}
                                </>
                              )}
                            </button>
                            <button
                              onClick={() => handleUpdateSubscription(user.id, 'premium', 'monthly')}
                              disabled={updating === user.id}
                              className={`w-full px-3 py-2 rounded-lg text-xs font-medium transition ${
                                user.subscription?.plan === 'premium' && user.subscription?.status === 'active' && user.subscription?.image_limit === 60
                                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 cursor-default'
                                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 hover:bg-blue-100 hover:text-blue-800 dark:hover:bg-blue-900/20 dark:hover:text-blue-400 disabled:opacity-50'
                              }`}
                            >
                              {updating === user.id ? (
                                <div className="flex items-center justify-center">
                                  <Loader className="h-3 w-3 animate-spin mr-1" />
                                  Updating...
                                </div>
                              ) : (
                                <>
                                  Monthly Plan (60 images) - $10
                                  {user.subscription?.plan === 'premium' && user.subscription?.status === 'active' && user.subscription?.image_limit === 60 && (
                                    <span className="block text-xs text-blue-600 dark:text-blue-400 mt-1">✓ Active</span>
                                  )}
                                </>
                              )}
                            </button>
                            <button
                              onClick={() => handleUpdateSubscription(user.id, 'premium', 'yearly')}
                              disabled={updating === user.id}
                              className={`w-full px-3 py-2 rounded-lg text-xs font-medium transition ${
                                user.subscription?.plan === 'premium' && user.subscription?.status === 'active' && user.subscription?.image_limit === 650
                                  ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400 cursor-default'
                                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 hover:bg-purple-100 hover:text-purple-800 dark:hover:bg-purple-900/20 dark:hover:text-purple-400 disabled:opacity-50'
                              }`}
                            >
                              {updating === user.id ? (
                                <div className="flex items-center justify-center">
                                  <Loader className="h-3 w-3 animate-spin mr-1" />
                                  Updating...
                                </div>
                              ) : (
                                <>
                                  Yearly Plan (650 images) - $100
                                  {user.subscription?.plan === 'premium' && user.subscription?.status === 'active' && user.subscription?.image_limit === 650 && (
                                    <span className="block text-xs text-purple-600 dark:text-purple-400 mt-1">✓ Active</span>
                                  )}
                                </>
                              )}
                            </button>
                            <button
                              onClick={() => handleUpdateSubscription(user.id, 'free', null)}
                              disabled={updating === user.id}
                              className={`w-full px-3 py-2 rounded-lg text-xs font-medium transition ${
                                user.subscription?.plan === 'free' || !user.subscription || user.subscription?.status !== 'active'
                                  ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 cursor-default'
                                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 hover:bg-red-100 hover:text-red-800 dark:hover:bg-red-900/20 dark:hover:text-red-400 disabled:opacity-50'
                              }`}
                            >
                              {updating === user.id ? (
                                <div className="flex items-center justify-center">
                                  <Loader className="h-3 w-3 animate-spin mr-1" />
                                  Updating...
                                </div>
                              ) : (
                                <>
                                  Deactivate Premium
                                  {(user.subscription?.plan === 'free' || !user.subscription || user.subscription?.status !== 'active') && (
                                    <span className="block text-xs text-red-600 dark:text-red-400 mt-1">✓ Free Plan</span>
                                  )}
                                </>
                              )}
                            </button>
                          </div>
                        </td>

                        <td className="px-4 py-4 text-right">
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            disabled={updating === user.id}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition text-sm disabled:opacity-50"
                          >
                            {updating === user.id ? 'Deleting...' : 'Delete'}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Ticket
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Priority
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredTickets.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                        No tickets found
                      </td>
                    </tr>
                  ) : (
                    filteredTickets.map((ticket) => (
                      <tr key={ticket.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            {getStatusIcon(ticket.status)}
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {ticket.subject}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">
                            {ticket.profiles?.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {ticket.profiles?.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                            {ticket.priority}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={ticket.status}
                            onChange={(e) => updateTicketStatus(ticket.id, e.target.value)}
                            className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          >
                            <option value="open">Open</option>
                            <option value="in_progress">In Progress</option>
                            <option value="closed">Closed</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {formatDateTime(ticket.created_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <a
                            href={`/support`}
                            className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 transition"
                          >
                            View
                          </a>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default withAdminAuth(AdminDashboardPage);