import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://bwucqwzlvjmibfkmikwj.supabase.co"; 
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3dWNxd3psdmptaWJma21pa3dqIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTA2MTU2MTIsImV4cCI6MjAwNjE5MTYxMn0.a14D72X9dFGHkmWfUC2-OeMhRiqEuTSEb5QErpjYm1w"; 
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
