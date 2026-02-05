'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Bell,
  Volume2,
  Globe,
  Palette,
  Shield,
  CreditCard,
  ChevronRight,
  Sun,
  Moon,
  Monitor,
  Check,
  X,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import { useTheme } from '@/components/providers/ThemeProvider';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

const settingsSections = [
  {
    title: 'Notifications',
    icon: Bell,
    settings: [
      { id: 'email_reminders', label: 'Email reminders', description: 'Get reminded to practice', default: true },
      { id: 'progress_updates', label: 'Progress updates', description: 'Weekly progress reports', default: true },
      { id: 'new_features', label: 'New features', description: 'Updates about new features', default: false },
    ]
  },
  {
    title: 'Audio & Voice',
    icon: Volume2,
    settings: [
      { id: 'auto_play', label: 'Auto-play responses', description: 'Automatically play AI responses', default: true },
      { id: 'voice_speed', label: 'Normal voice speed', description: 'AI speaks at normal pace', default: true },
    ]
  },
  {
    title: 'Language',
    icon: Globe,
    settings: [
      { id: 'native_lang', label: 'Show translations', description: 'Show translations in your native language', default: false },
    ]
  },
];

const themeOptions = [
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'system', label: 'System', icon: Monitor },
] as const;

export default function SettingsPage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [subscriptionTier, setSubscriptionTier] = useState('free');
  const [settings, setSettings] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    settingsSections.forEach(section => {
      section.settings.forEach(setting => {
        initial[setting.id] = setting.default;
      });
    });
    return initial;
  });
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const supabase = createClient();

  useEffect(() => {
    async function loadUserData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('subscription_tier')
          .eq('id', user.id)
          .single();

        if (profile) {
          setSubscriptionTier(profile.subscription_tier || 'free');
        }
      }
    }
    loadUserData();
  }, [supabase]);

  const toggleSetting = (id: string) => {
    setSettings(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleChangePassword = async () => {
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;

      setSuccess('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        setShowPasswordModal(false);
        setSuccess('');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update password');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') {
      setError('Please type DELETE to confirm');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Delete user data from profiles table
      await supabase.from('profiles').delete().eq('id', user.id);
      await supabase.from('sessions').delete().eq('user_id', user.id);

      // Sign out the user
      await supabase.auth.signOut();

      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete account');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-2 text-zinc-900 dark:text-white">Settings</h1>
        <p className="text-zinc-600 dark:text-zinc-400">Manage your account preferences</p>
      </motion.div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {settingsSections.map((section, sectionIndex) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: sectionIndex * 0.1 }}
            className="rounded-2xl bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800/50 overflow-hidden shadow-sm"
          >
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800/50 flex items-center gap-3">
              <section.icon size={20} className="text-indigo-500 dark:text-indigo-400" />
              <h2 className="font-semibold text-zinc-900 dark:text-white">{section.title}</h2>
            </div>
            <div className="divide-y divide-zinc-200 dark:divide-zinc-800/50">
              {section.settings.map((setting) => (
                <div key={setting.id} className="p-4 flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm text-zinc-900 dark:text-white">{setting.label}</div>
                    <div className="text-xs text-zinc-500">{setting.description}</div>
                  </div>
                  <button
                    onClick={() => toggleSetting(setting.id)}
                    className={`w-12 h-7 rounded-full transition-colors relative ${
                      settings[setting.id] ? 'bg-indigo-500' : 'bg-zinc-300 dark:bg-zinc-700'
                    }`}
                  >
                    <div
                      className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all ${
                        settings[setting.id] ? 'left-6' : 'left-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        ))}

        {/* Appearance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800/50 overflow-hidden shadow-sm"
        >
          <div className="p-4 border-b border-zinc-200 dark:border-zinc-800/50 flex items-center gap-3">
            <Palette size={20} className="text-indigo-500 dark:text-indigo-400" />
            <h2 className="font-semibold text-zinc-900 dark:text-white">Appearance</h2>
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="font-medium text-sm text-zinc-900 dark:text-white">Theme</div>
                <div className="text-xs text-zinc-500">Choose your preferred theme</div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {themeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setTheme(option.value)}
                  className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
                    theme === option.value
                      ? 'bg-indigo-500/10 border-indigo-500/50 text-zinc-900 dark:text-white'
                      : 'bg-zinc-100 dark:bg-zinc-800/30 border-zinc-200 dark:border-zinc-700/50 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-600'
                  }`}
                >
                  {theme === option.value && (
                    <div className="absolute top-2 right-2">
                      <Check size={14} className="text-indigo-500 dark:text-indigo-400" />
                    </div>
                  )}
                  <option.icon size={24} />
                  <span className="text-sm font-medium">{option.label}</span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Security */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800/50 overflow-hidden shadow-sm"
        >
          <div className="p-4 border-b border-zinc-200 dark:border-zinc-800/50 flex items-center gap-3">
            <Shield size={20} className="text-indigo-500 dark:text-indigo-400" />
            <h2 className="font-semibold text-zinc-900 dark:text-white">Security</h2>
          </div>
          <div className="divide-y divide-zinc-200 dark:divide-zinc-800/50">
            <button
              onClick={() => setShowPasswordModal(true)}
              className="w-full p-4 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors"
            >
              <div className="text-left">
                <div className="font-medium text-sm text-zinc-900 dark:text-white">Change password</div>
                <div className="text-xs text-zinc-500">Update your account password</div>
              </div>
              <ChevronRight size={18} className="text-zinc-400 dark:text-zinc-500" />
            </button>
            <button
              onClick={() => alert('Two-factor authentication coming soon!')}
              className="w-full p-4 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors"
            >
              <div className="text-left">
                <div className="font-medium text-sm text-zinc-900 dark:text-white">Two-factor authentication</div>
                <div className="text-xs text-zinc-500">Add an extra layer of security</div>
              </div>
              <ChevronRight size={18} className="text-zinc-400 dark:text-zinc-500" />
            </button>
          </div>
        </motion.div>

        {/* Billing */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-2xl bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800/50 overflow-hidden shadow-sm"
        >
          <div className="p-4 border-b border-zinc-200 dark:border-zinc-800/50 flex items-center gap-3">
            <CreditCard size={20} className="text-indigo-500 dark:text-indigo-400" />
            <h2 className="font-semibold text-zinc-900 dark:text-white">Billing</h2>
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="font-medium text-sm text-zinc-900 dark:text-white">Current plan</div>
                <div className="text-xs text-zinc-500">{subscriptionTier.charAt(0).toUpperCase() + subscriptionTier.slice(1)} plan</div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                subscriptionTier === 'pro'
                  ? 'bg-indigo-500/20 text-indigo-600 dark:text-indigo-400'
                  : subscriptionTier === 'team'
                  ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
              }`}>
                {subscriptionTier.toUpperCase()}
              </span>
            </div>
            {subscriptionTier === 'free' && (
              <Link
                href="/pricing"
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium hover:from-indigo-600 hover:to-purple-700 transition-all"
              >
                Upgrade to Pro
              </Link>
            )}
          </div>
        </motion.div>

        {/* Danger Zone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="rounded-2xl bg-white dark:bg-zinc-900/50 border border-red-200 dark:border-red-500/20 overflow-hidden shadow-sm"
        >
          <div className="p-4 border-b border-red-100 dark:border-zinc-800/50">
            <h2 className="font-semibold text-red-500 dark:text-red-400">Danger Zone</h2>
          </div>
          <div className="p-4">
            <button
              onClick={() => setShowDeleteModal(true)}
              className="px-4 py-2.5 rounded-xl text-sm font-medium text-red-500 dark:text-red-400 border border-red-300 dark:border-red-500/30 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
            >
              Delete Account
            </button>
            <p className="text-xs text-zinc-500 mt-3">
              This action cannot be undone. All your data will be permanently deleted.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Change Password Modal */}
      <AnimatePresence>
        {showPasswordModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowPasswordModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl max-w-md w-full overflow-hidden"
            >
              <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Change Password</h3>
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                >
                  <X size={20} className="text-zinc-500" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                {error && (
                  <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm flex items-center gap-2">
                    <AlertTriangle size={16} />
                    {error}
                  </div>
                )}
                {success && (
                  <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-sm flex items-center gap-2">
                    <Check size={16} />
                    {success}
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter current password"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter new password"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>
              <div className="p-6 border-t border-zinc-200 dark:border-zinc-800 flex gap-3">
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 px-4 py-3 rounded-xl text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleChangePassword}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-3 rounded-xl text-sm font-medium text-white bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Updating...
                    </>
                  ) : (
                    'Update Password'
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Account Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowDeleteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl max-w-md w-full overflow-hidden"
            >
              <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                    <AlertTriangle size={24} className="text-red-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Delete Account</h3>
                    <p className="text-sm text-zinc-500">This action cannot be undone</p>
                  </div>
                </div>
              </div>
              <div className="p-6 space-y-4">
                {error && (
                  <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
                    {error}
                  </div>
                )}
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  All your data including practice sessions, progress, and settings will be permanently deleted.
                </p>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Type <span className="font-bold text-red-500">DELETE</span> to confirm
                  </label>
                  <input
                    type="text"
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Type DELETE"
                  />
                </div>
              </div>
              <div className="p-6 border-t border-zinc-200 dark:border-zinc-800 flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeleteConfirmText('');
                    setError('');
                  }}
                  className="flex-1 px-4 py-3 rounded-xl text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={isSubmitting || deleteConfirmText !== 'DELETE'}
                  className="flex-1 px-4 py-3 rounded-xl text-sm font-medium text-white bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    'Delete Account'
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
