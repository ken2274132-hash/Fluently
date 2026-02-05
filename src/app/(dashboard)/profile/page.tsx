'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import {
  User,
  Mail,
  Globe,
  Calendar,
  Camera,
  Save,
  Loader2,
  Check,
  X,
  Upload
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

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
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageError, setImageError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    nativeLanguage: 'Spanish',
    englishLevel: 'intermediate',
    learningGoal: '',
  });
  const [userId, setUserId] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);

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
          learningGoal: profile?.learning_goal || 'I want to improve my English for work and be able to participate confidently in meetings.',
        });

        // Load avatar URL
        if (profile?.avatar_url) {
          setAvatarUrl(profile.avatar_url);
        } else if (user.user_metadata?.avatar_url) {
          setAvatarUrl(user.user_metadata.avatar_url);
        }
      }
    }
    loadProfile();
  }, [supabase]);

  const handleImageClick = () => {
    setShowImageModal(true);
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !userId) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setImageError('Please upload a valid image (JPEG, PNG, GIF, or WebP)');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setImageError('Image must be less than 5MB');
      return;
    }

    setImageError('');
    setIsUploadingImage(true);

    try {
      // Create a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        // If bucket doesn't exist, try to create it or use a fallback
        console.error('Upload error:', uploadError);

        // Storage bucket doesn't exist - show error instead of using data URL
        // Data URLs stored in cookies cause 431 errors
        setImageError('Image storage not configured. Please contact support or set up Supabase Storage bucket named "avatars".');
        setIsUploadingImage(false);
        return;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      setAvatarUrl(publicUrl);

      // Update profile with new avatar URL
      await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', userId);

      setShowImageModal(false);
    } catch (error) {
      console.error('Error uploading image:', error);
      setImageError('Failed to upload image. Please try again.');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleRemoveImage = async () => {
    if (!userId) return;

    setIsUploadingImage(true);
    try {
      // Update profile to remove avatar URL
      await supabase
        .from('profiles')
        .update({ avatar_url: null })
        .eq('id', userId);

      setAvatarUrl(null);
      setShowImageModal(false);
    } catch (error) {
      console.error('Error removing image:', error);
      setImageError('Failed to remove image. Please try again.');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    setSaveError('');

    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          email: user.email,
          full_name: formData.name,
          native_language: formData.nativeLanguage,
          english_level: formData.englishLevel,
          learning_goal: formData.learningGoal,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString(),
        });

      if (error) {
        console.error('Error saving profile:', error);
        setSaveError(error.message || 'Failed to save profile. Please try again.');
        setIsLoading(false);
        return;
      }

      // Update auth user metadata with name only (not avatar - stored in profiles table)
      await supabase.auth.updateUser({
        data: {
          full_name: formData.name,
        }
      });

      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    }

    setIsLoading(false);
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
            <div className="relative">
              {avatarUrl ? (
                <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-lg shadow-indigo-500/20">
                  <Image
                    src={avatarUrl}
                    alt="Profile avatar"
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                    unoptimized={avatarUrl.startsWith('data:')}
                  />
                </div>
              ) : (
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-3xl font-bold text-white shadow-lg shadow-indigo-500/20">
                  {formData.name?.[0]?.toUpperCase() || 'U'}
                </div>
              )}
              <button
                onClick={handleImageClick}
                className="absolute -bottom-1 -right-1 w-8 h-8 rounded-xl bg-indigo-500 flex items-center justify-center text-white hover:bg-indigo-600 transition-colors shadow-lg"
              >
                <Camera size={16} />
              </button>
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

      {/* Image Upload Modal */}
      {showImageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl"
          >
            <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800">
              <h3 className="font-semibold text-zinc-900 dark:text-white">Update Profile Picture</h3>
              <button
                onClick={() => setShowImageModal(false)}
                className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <X size={20} className="text-zinc-500" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Current Avatar Preview */}
              <div className="flex justify-center">
                {avatarUrl ? (
                  <div className="w-32 h-32 rounded-2xl overflow-hidden shadow-lg">
                    <Image
                      src={avatarUrl}
                      alt="Current avatar"
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                      unoptimized={avatarUrl.startsWith('data:')}
                    />
                  </div>
                ) : (
                  <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-4xl font-bold text-white shadow-lg">
                    {formData.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                )}
              </div>

              {/* Error Message */}
              {imageError && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 dark:text-red-400 text-sm text-center">
                  {imageError}
                </div>
              )}

              {/* Upload Button */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={handleFileSelect}
                className="hidden"
              />

              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingImage}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-medium hover:bg-indigo-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploadingImage ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Upload size={18} />
                    <span>Upload New Image</span>
                  </>
                )}
              </button>

              <p className="text-xs text-zinc-500 text-center">
                Supported formats: JPEG, PNG, GIF, WebP. Max size: 5MB
              </p>

              {/* Remove Button */}
              {avatarUrl && (
                <button
                  onClick={handleRemoveImage}
                  disabled={isUploadingImage}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <X size={18} />
                  <span>Remove Image</span>
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
