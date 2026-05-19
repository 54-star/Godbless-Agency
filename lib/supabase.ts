import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://cbqvuyjddyusdurvgrjt.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNicXZ1eWpkZHl1c2R1cnZncmp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxMzE3MzcsImV4cCI6MjA5NDcwNzczN30.q143CaBQe8_UGrBHkSrX5FhLsmczxyiaDJLiV1UD5es";

export const supabase = createClient(supabaseUrl, supabaseKey);