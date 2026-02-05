import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const supabase = await createClient();

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Clear avatar_url from user metadata
    const { error: updateError } = await supabase.auth.updateUser({
      data: {
        avatar_url: null,
      }
    });

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    // Also clear from profiles table
    await supabase
      .from('profiles')
      .update({ avatar_url: null })
      .eq('id', user.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error clearing avatar:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
