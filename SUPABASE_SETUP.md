Action	Method (v2)                   	        Minimal call signature
Sign-up	supabase.auth.signUp	                  { email, password }
Sign-in (pwd)	supabase.auth.signInWithPassword	{ email password }
Sign-out	supabase.auth.signOut                   ()	no args
These are the new explicit functions introduced in supabase-js v2