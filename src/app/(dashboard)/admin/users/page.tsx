'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import {
  Search,
  MoreHorizontal,
  Mail,
  Crown,
  Shield,
  Ban,
  ChevronLeft,
  ChevronRight,
  UserPlus
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface User {
  id: string;
  email: string;
  full_name: string | null;
  role: 'user' | 'admin';
  subscription_tier: 'free' | 'pro' | 'team';
  created_at: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'free' | 'pro' | 'team'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const usersPerPage = 10;
  const supabase = createClient();

  useEffect(() => {
    async function fetchUsers() {
      let query = supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (filter !== 'all') {
        query = query.eq('subscription_tier', filter);
      }

      const { data } = await query;
      if (data) setUsers(data);
      setLoading(false);
    }
    fetchUsers();
  }, [supabase, filter]);

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    });
  };

  const handleMakeAdmin = async (userId: string) => {
    await supabase.from('profiles').update({ role: 'admin' }).eq('id', userId);
    setUsers(users.map(u => u.id === userId ? { ...u, role: 'admin' } : u));
    setSelectedUser(null);
  };

  const handleRemoveAdmin = async (userId: string) => {
    await supabase.from('profiles').update({ role: 'user' }).eq('id', userId);
    setUsers(users.map(u => u.id === userId ? { ...u, role: 'user' } : u));
    setSelectedUser(null);
  };

  if (loading) {
    return (
      <div className="p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-10 w-64 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
          <div className="h-12 bg-zinc-200/50 dark:bg-zinc-800/50 rounded-xl" />
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 bg-zinc-200/50 dark:bg-zinc-800/50 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <div className="px-2 py-1 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-medium">Admin</div>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold mb-2 text-zinc-900 dark:text-white">User Management</h1>
            <p className="text-zinc-600 dark:text-zinc-400">Manage and monitor all users on the platform.</p>
          </div>
          <button className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-500 text-white font-medium hover:bg-indigo-600 transition-colors">
            <UserPlus size={18} />
            Invite User
          </button>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800/50 text-zinc-900 dark:text-white placeholder-zinc-500 focus:border-indigo-500/50 focus:outline-none transition-colors"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'free', 'pro', 'team'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                filter === f ? 'bg-indigo-500 text-white' : 'bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800/50 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-2xl bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800/50 overflow-hidden shadow-sm">
        <div className="hidden sm:grid grid-cols-12 gap-4 p-4 border-b border-zinc-200 dark:border-zinc-800/50 text-sm font-medium text-zinc-500">
          <div className="col-span-4">User</div>
          <div className="col-span-2">Role</div>
          <div className="col-span-2">Plan</div>
          <div className="col-span-2">Joined</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        <div className="divide-y divide-zinc-200 dark:divide-zinc-800/50">
          {paginatedUsers.length > 0 ? (
            paginatedUsers.map((user) => (
              <div key={user.id} className="p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                <div className="sm:grid sm:grid-cols-12 sm:gap-4 sm:items-center flex flex-col gap-3">
                  <div className="col-span-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-medium shrink-0">
                      {user.full_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="font-medium truncate text-zinc-900 dark:text-white">{user.full_name || 'No name'}</div>
                      <div className="text-sm text-zinc-500 truncate">{user.email}</div>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium ${
                      user.role === 'admin' ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                    }`}>
                      {user.role === 'admin' && <Shield size={12} />}
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium ${
                      user.subscription_tier === 'pro' ? 'bg-indigo-500/20 text-indigo-600 dark:text-indigo-400' :
                      user.subscription_tier === 'team' ? 'bg-purple-500/20 text-purple-600 dark:text-purple-400' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-500'
                    }`}>
                      {user.subscription_tier === 'pro' && <Crown size={12} />}
                      {user.subscription_tier?.toUpperCase() || 'FREE'}
                    </span>
                  </div>
                  <div className="col-span-2 text-sm text-zinc-500 dark:text-zinc-400">{formatDate(user.created_at)}</div>
                  <div className="col-span-2 flex justify-end relative">
                    <button onClick={() => setSelectedUser(selectedUser === user.id ? null : user.id)} className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                      <MoreHorizontal size={18} className="text-zinc-500 dark:text-zinc-400" />
                    </button>
                    {selectedUser === user.id && (
                      <div className="absolute right-0 top-10 w-48 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl z-10 py-1 overflow-hidden">
                        <button className="w-full px-4 py-2.5 text-left text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                          <Mail size={16} className="text-zinc-500 dark:text-zinc-400" />Send Email
                        </button>
                        {user.role !== 'admin' ? (
                          <button onClick={() => handleMakeAdmin(user.id)} className="w-full px-4 py-2.5 text-left text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                            <Shield size={16} className="text-amber-500 dark:text-amber-400" />Make Admin
                          </button>
                        ) : (
                          <button onClick={() => handleRemoveAdmin(user.id)} className="w-full px-4 py-2.5 text-left text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                            <Shield size={16} className="text-zinc-500 dark:text-zinc-400" />Remove Admin
                          </button>
                        )}
                        <button className="w-full px-4 py-2.5 text-left text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors flex items-center gap-2 text-red-500 dark:text-red-400">
                          <Ban size={16} />Suspend User
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center">
              <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-800/50 flex items-center justify-center mx-auto mb-3">
                <Search size={20} className="text-zinc-500" />
              </div>
              <p className="text-sm text-zinc-500">No users found</p>
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="p-4 border-t border-zinc-200 dark:border-zinc-800/50 flex items-center justify-between">
            <div className="text-sm text-zinc-500">
              Showing {(currentPage - 1) * usersPerPage + 1} to {Math.min(currentPage * usersPerPage, filteredUsers.length)} of {filteredUsers.length}
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50">
                <ChevronLeft size={18} className="text-zinc-500 dark:text-zinc-400" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button key={page} onClick={() => setCurrentPage(page)} className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${currentPage === page ? 'bg-indigo-500 text-white' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}>
                  {page}
                </button>
              ))}
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50">
                <ChevronRight size={18} className="text-zinc-500 dark:text-zinc-400" />
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
