-- Table for discussion topics/questions
CREATE TABLE discussion_topics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table for answers/replies
CREATE TABLE discussion_replies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  topic_id UUID REFERENCES discussion_topics(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  author_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE discussion_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE discussion_replies ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read topics and replies
CREATE POLICY "Allow anyone to read topics" 
  ON discussion_topics FOR SELECT USING (true);

CREATE POLICY "Allow anyone to read replies" 
  ON discussion_replies FOR SELECT USING (true);

-- Allow anyone to create topics
CREATE POLICY "Allow anyone to create topics" 
  ON discussion_topics FOR INSERT WITH CHECK (true);

-- Allow anyone to create replies
CREATE POLICY "Allow anyone to create replies" 
  ON discussion_replies FOR INSERT WITH CHECK (true);

-- Add upvotes column to discussion_topics
ALTER TABLE discussion_topics ADD COLUMN upvotes INTEGER DEFAULT 0;

-- Add upvotes column to discussion_replies
ALTER TABLE discussion_replies ADD COLUMN upvotes INTEGER DEFAULT 0;

-- Create a table to track upvotes (to prevent duplicate votes)
CREATE TABLE upvote_tracking (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content_type TEXT NOT NULL, -- 'topic' or 'reply'
  content_id UUID NOT NULL,  
  identifier TEXT NOT NULL, -- could be IP address, cookie ID, or browser fingerprint
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add a unique constraint to prevent duplicate votes
ALTER TABLE upvote_tracking 
  ADD CONSTRAINT unique_upvote 
  UNIQUE (content_type, content_id, identifier);

-- Enable RLS for upvote tracking
ALTER TABLE upvote_tracking ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read upvote tracking
CREATE POLICY "Allow anyone to read upvote tracking" 
  ON upvote_tracking FOR SELECT USING (true);

-- Allow anyone to insert upvote tracking
CREATE POLICY "Allow anyone to insert upvote tracking" 
  ON upvote_tracking FOR INSERT WITH CHECK (true);