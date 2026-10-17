import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';

const SUPABASE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SUPABASE_URL) ||
  'https://qgthtmsiscbomdkpvytr.supabase.co';

const SUPABASE_ANON_KEY =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SUPABASE_ANON_KEY) ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFndGh0bXNpc2Nib21ka3B2eXRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIyMDgyOTIsImV4cCI6MjEwNzc4NDI5Mn0.ZaHeb3XT3S3HEjxuicJJgZCXHzrsnX_AenT5DFRhFK8';

export const STORAGE_BUCKET =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_STORAGE_BUCKET) ||
  'study-documents';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: window.localStorage
  }
});

