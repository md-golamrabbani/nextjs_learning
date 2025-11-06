import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://xzgktdjpflyyjvswiwri.supabase.co";

const supabase = createClient(
  supabaseUrl,
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6Z2t0ZGpwZmx5eWp2c3dpd3JpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0MTI4NjQsImV4cCI6MjA3Nzk4ODg2NH0.bbyHImen3BQDsvRJNJAmwm0_Nw9NI_RcbbO56dR5D50"
);
