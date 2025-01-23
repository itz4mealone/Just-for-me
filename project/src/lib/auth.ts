import { supabase } from './supabase';

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
}

export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: window.location.origin,
    },
  });
  return { data, error };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function getSession() {
  const { data: { session }, error } = await supabase.auth.getSession();
  return { session, error };
}

// Create initial users if they don't exist
export async function createInitialUsers() {
  const users = [
    { email: 'mybubble@example.com', password: 'LordIfIt\'sYourWillGetUsMarriedSoon' },
    { email: 'myheartbeat@example.com', password: 'LordIfIt\'sYourWillGetUsMarriedSoon' }
  ];

  for (const user of users) {
    const { data } = await supabase.auth.signInWithPassword(user);
    if (!data.user) {
      await signUp(user.email, user.password);
    }
  }
}