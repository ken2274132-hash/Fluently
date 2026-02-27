'use client';

import { useEffect, useRef, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { usePathname } from 'next/navigation';

export function usePresenceTracking() {
  const visitIdRef = useRef<string | null>(null);
  const pathname = usePathname();
  const supabase = createClient();

  const startVisit = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // End any existing active visit first
      if (visitIdRef.current) {
        await supabase.rpc('end_user_visit', { visit_id: visitIdRef.current });
      }

      // Start new visit
      const { data, error } = await supabase
        .from('user_visits')
        .insert({
          user_id: user.id,
          page_path: pathname,
          is_active: true,
          user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null
        })
        .select('id')
        .single();

      if (!error && data) {
        visitIdRef.current = data.id;
      }
    } catch (err) {
      console.error('Error starting visit:', err);
    }
  }, [supabase, pathname]);

  const endVisit = useCallback(async () => {
    if (!visitIdRef.current) return;

    try {
      await supabase.rpc('end_user_visit', { visit_id: visitIdRef.current });
      visitIdRef.current = null;
    } catch (err) {
      console.error('Error ending visit:', err);
    }
  }, [supabase]);

  const updateVisitPath = useCallback(async () => {
    if (!visitIdRef.current) {
      await startVisit();
      return;
    }

    try {
      await supabase
        .from('user_visits')
        .update({ page_path: pathname })
        .eq('id', visitIdRef.current);
    } catch (err) {
      console.error('Error updating visit path:', err);
    }
  }, [supabase, pathname, startVisit]);

  useEffect(() => {
    startVisit();

    // Heartbeat to keep visit active
    const heartbeat = setInterval(async () => {
      if (!visitIdRef.current) return;

      try {
        await supabase
          .from('user_visits')
          .update({ is_active: true })
          .eq('id', visitIdRef.current);
      } catch (err) {
        // Silent fail for heartbeat
      }
    }, 60000); // Every minute

    // Handle page visibility changes
    const handleVisibilityChange = () => {
      if (document.hidden) {
        endVisit();
      } else {
        startVisit();
      }
    };

    // Handle before unload
    const handleBeforeUnload = () => {
      if (visitIdRef.current) {
        // Use sendBeacon for reliable delivery on page close
        const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/end_user_visit`;
        navigator.sendBeacon(url, JSON.stringify({ visit_id: visitIdRef.current }));
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      clearInterval(heartbeat);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      endVisit();
    };
  }, [startVisit, endVisit]);

  // Update path when pathname changes
  useEffect(() => {
    if (visitIdRef.current) {
      updateVisitPath();
    }
  }, [pathname, updateVisitPath]);

  return { endVisit };
}
