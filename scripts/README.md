# Faith Perspectives Pre-Generation

This directory contains scripts to pre-generate faith perspectives for news articles and store them in Supabase.

## Setup

1. Make sure your Supabase project is set up with:

   - `news` table containing news articles
   - `perspectives` table with the following schema:
     ```sql
     create table
       public.perspectives (
         id uuid default gen_random_uuid() not null,
         news_id text not null,
         faith text not null,
         perspective text not null,
         created_at timestamp with time zone default now() not null,
         primary key (id),
         unique (news_id, faith)
       );
     ```

2. Set the required environment variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   OPENAI_API_KEY=your-openai-api-key
   ```

## Running the Script

To generate perspectives for all news articles:

```bash
# From the project root
npx tsx scripts/generate-perspectives.ts
```

This script will:

1. Fetch all news articles from the Supabase `news` table
2. For each article, generate perspectives for all faiths listed in the article's `faiths` array
3. Skip any perspectives that have already been generated
4. Store each new perspective in the Supabase `perspectives` table

## Integration with the App

This script replaces the on-demand generation of perspectives. The app now:

1. Shows faith buttons on news cards
2. When a user clicks a faith button, they are navigated directly to `/share/[newsId]/[faith]`
3. The share page fetches the pre-generated perspective from Supabase

## Scheduling Perspective Generation

For production use, you might want to schedule this script to run regularly as new news articles are added.

Example using GitHub Actions:

```yaml
name: Generate Faith Perspectives

on:
  schedule:
    - cron: "0 */6 * * *" # Run every 6 hours
  workflow_dispatch: # Allow manual triggering

jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "18"
      - name: Install dependencies
        run: npm ci
      - name: Run generation script
        run: npx tsx scripts/generate-perspectives.ts
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
```
