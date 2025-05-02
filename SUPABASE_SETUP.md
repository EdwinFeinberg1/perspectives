# Supabase Setup Guide

This guide will help you set up Supabase to store emails from the sign-up form.

## 1. Create a Supabase Account

1. Go to [Supabase](https://supabase.com/) and sign up for an account if you don't have one.
2. Create a new project.
3. Note your project's URL and anon key from the API settings.

## 2. Set Up Environment Variables

Create a `.env.local` file in the root of your project with the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Replace `your_supabase_url` and `your_supabase_anon_key` with the values from your Supabase project.

## 3. Create a Table in Supabase

1. Go to the SQL Editor in your Supabase dashboard.
2. Run the following SQL query to create a table for storing emails:

```sql
CREATE TABLE signups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

3. Create an RLS (Row Level Security) policy to secure your table:

```sql
-- Enable RLS
ALTER TABLE signups ENABLE ROW LEVEL SECURITY;

-- Create policy to allow inserts from anyone
CREATE POLICY "Allow inserts for everyone" ON signups FOR INSERT WITH CHECK (true);

-- Create policy to allow reading only for authenticated users
CREATE POLICY "Allow select for authenticated users only" ON signups FOR SELECT USING (auth.role() = 'authenticated');
```

## 4. Restart Your Next.js Application

After setting up the environment variables, restart your Next.js application:

```bash
npm run dev
```

Now, when users submit their emails through the sign-up form, the emails will be stored in your Supabase database.

## 5. Testing the Integration

1. Fill out the form with a test email and submit.
2. Check your Supabase dashboard to verify that the email was stored correctly in the `signups` table.

## Troubleshooting

If you encounter any issues:

1. Check your browser console for error messages.
2. Verify that your Supabase credentials are correctly set in the `.env.local` file.
3. Make sure the `signups` table exists in your Supabase database.
4. Check that the RLS policies are configured correctly.
