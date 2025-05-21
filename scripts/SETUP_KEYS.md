# Setting Up Your Environment Variables

To make the news fetching script work, you need to add the following environment variables to your `.env` file:

## Required Keys

1. **SUPABASE_SERVICE_ROLE_KEY**: This is the most important key for bypassing Row Level Security policies.

2. **NEXT_PUBLIC_SUPABASE_URL**: Your Supabase project URL (should already be set).

3. **NEXT_PUBLIC_SUPABASE_ANON_KEY**: Your Supabase anonymous key (should already be set).

4. **NEWS_API_KEY**: Your News API key.

5. **OPENAI_API_KEY**: Your OpenAI API key.

## How to Get Your Supabase Service Role Key

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to Project Settings
4. Go to API tab
5. Find "Project API keys" section
6. Copy the "service_role key" (this is different from the anon/public key)

## Adding Keys to Your .env File

Add these lines to your `.env` file:

```
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
NEWS_API_KEY=your_news_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
```

## Security Warning

The service role key has admin privileges to your database. It bypasses all Row Level Security policies. Keep it secure and never expose it in client-side code or commit it to a public repository.
