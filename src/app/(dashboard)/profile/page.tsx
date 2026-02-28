'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Globe,
  Calendar,
  Save,
  Loader2,
  Check
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/components/providers/AuthProvider';

const languages = [
  'English', 'Spanish', 'French', 'German', 'Portuguese',
  'Chinese', 'Japanese', 'Korean', 'Arabic', 'Hindi', 'Other',
];

const levels = [
  { value: 'beginner', label: 'Beginner', description: 'Just starting to learn' },
  { value: 'elementary', label: 'Elementary', description: 'Can understand basic phrases' },
  { value: 'intermediate', label: 'Intermediate', description: 'Can hold basic conversations' },
  { value: 'upper-intermediate', label: 'Upper Intermediate', description: 'Can discuss complex topics' },
  { value: 'advanced', label: 'Advanced', description: 'Near-native fluency' },
];

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    nativeLanguage: 'Spanish',
    englishLevel: 'intermediate',
    learningGoal: '',
  });
  const supabase = useMemo(() => createClient(), []);
  const { refreshProfile } = useAuth();

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        setFormData({
          name: profile?.full_name || user.user_metadata?.full_name || '',
          email: user.email || '',
          nativeLanguage: profile?.native_language || 'Spanish',
          englishLevel: profile?.english_level || 'intermediate',
          learningGoal: profile?.learning_goal || '',
        });
      }
    }
    loadProfile();
  }, [supabase]);

  const handleSave = async () => {
    setIsLoading(true);
    setSaveError('');

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        setSaveError('You must be logged in to save your profile.');
        setIsLoading(false);
        return;
      }

      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          email: user.email || '',
          full_name: formData.name,
          native_language: formData.nativeLanguage,
          english_level: formData.englishLevel,
          learning_goal: formData.learningGoal,
        }, {
          onConflict: 'id'
        });

      if (error) {
        setSaveError(error.message || 'Failed to save profile. Please try again.');
        setIsLoading(false);
        return;
      }

      // Update auth user metadata (fire and forget)
      supabase.auth.updateUser({
        data: { full_name: formData.name }
      }).catch(() => {});

      // Refresh profile in context
      refreshProfile().catch(() => {});

      setIsSaved(true);
      setIsLoading(false);
      setTimeout(() => setIsSaved(false), 2000);
    } catch {
      setSaveError('An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  const memberSince = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-2 text-zinc-900 dark:text-white">Profile</h1>
        <p className="text-zinc-600 dark:text-zinc-400">Manage your personal information</p>
      </motion.div>

      <div className="space-y-6">
        {/* Avatar Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800/50 p-6 shadow-sm"
        >
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-3xl font-bold text-white shadow-lg shadow-indigo-500/20">
              {formData.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">{formData.name || 'User'}</h2>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm">{formData.email}</p>
              <p className="text-xs text-zinc-500 mt-2 flex items-center gap-1">
                <Calendar size={12} />
                Member since {memberSince}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Personal Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800/50 overflow-hidden shadow-sm"
        >
          <div className="p-4 border-b border-zinc-200 dark:border-zinc-800/50">
            <h2 className="font-semibold text-zinc-900 dark:text-white">Personal Information</h2>
          </div>
          <div className="p-4 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-zinc-900 dark:text-white">Full name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50 text-zinc-900 dark:text-white placeholder-zinc-500 focus:border-indigo-500/50 focus:outline-none transition-colors"
                    placeholder="Your name"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-zinc-900 dark:text-white">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                  <input
                    type="email"
                    value={formData.email}
                    disabled
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-800/30 border border-zinc-200 dark:border-zinc-700/30 text-zinc-500 dark:text-zinc-400 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Language Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800/50 overflow-hidden shadow-sm"
        >
          <div className="p-4 border-b border-zinc-200 dark:border-zinc-800/50 flex items-center gap-3">
            <Globe size={20} className="text-indigo-500 dark:text-indigo-400" />
            <h2 className="font-semibold text-zinc-900 dark:text-white">Language Settings</h2>
          </div>
          <div className="p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-zinc-900 dark:text-white">Native language</label>
              <select
                value={formData.nativeLanguage}
                onChange={(e) => setFormData({ ...formData, nativeLanguage: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50 text-zinc-900 dark:text-white focus:border-indigo-500/50 focus:outline-none transition-colors"
              >
                {languages.map((lang) => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-3 text-zinc-900 dark:text-white">English level</label>
              <div className="space-y-2">
                {levels.map((level) => (
                  <label
                    key={level.value}
                    className={`flex items-center p-4 rounded-xl border cursor-pointer transition-all ${
                      formData.englishLevel === level.value
                        ? 'border-indigo-500/50 bg-indigo-500/10'
                        : 'border-zinc-200 dark:border-zinc-800/50 hover:border-zinc-300 dark:hover:border-zinc-700/50 hover:bg-zinc-50 dark:hover:bg-zinc-800/30'
                    }`}
                  >
                    <input
                      type="radio"
                      name="level"
                      value={level.value}
                      checked={formData.englishLevel === level.value}
                      onChange={(e) => setFormData({ ...formData, englishLevel: e.target.value })}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                      formData.englishLevel === level.value ? 'border-indigo-500' : 'border-zinc-400 dark:border-zinc-600'
                    }`}>
                      {formData.englishLevel === level.value && (
                        <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-sm text-zinc-900 dark:text-white">{level.label}</div>
                      <div className="text-xs text-zinc-500">{level.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Learning Goal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800/50 overflow-hidden shadow-sm"
        >
          <div className="p-4 border-b border-zinc-200 dark:border-zinc-800/50">
            <h2 className="font-semibold text-zinc-900 dark:text-white">Learning Goal</h2>
          </div>
          <div className="p-4">
            <label className="block text-sm font-medium mb-2 text-zinc-900 dark:text-white">
              What do you want to achieve with English?
            </label>
            <textarea
              value={formData.learningGoal}
              onChange={(e) => setFormData({ ...formData, learningGoal: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50 text-zinc-900 dark:text-white placeholder-zinc-500 focus:border-indigo-500/50 focus:outline-none transition-colors min-h-[120px] resize-none"
              placeholder="Describe your learning goals..."
            />
            <p className="text-xs text-zinc-500 mt-2">
              This helps our AI personalize your learning experience.
            </p>
          </div>
        </motion.div>

        {/* Save Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col items-end gap-3"
        >
          {saveError && (
            <div className="w-full p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 text-sm">
              <strong>Error:</strong> {saveError}
            </div>
          )}
          <button
            type="button"
            onClick={handleSave}
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium hover:from-indigo-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : isSaved ? (
              <>
                <Check size={18} />
                <span>Saved!</span>
              </>
            ) : (
              <>
                <Save size={18} />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </motion.div>
      </div>
    </div>
  );
}
