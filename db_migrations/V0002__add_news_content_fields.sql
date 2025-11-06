-- Add new fields to news table for admin editing
ALTER TABLE t_p58513026_news_portal_creation.news 
ADD COLUMN IF NOT EXISTS content TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS author VARCHAR(255) DEFAULT '',
ADD COLUMN IF NOT EXISTS source_url TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS video_url TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS priority INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS moderation_status VARCHAR(50) DEFAULT 'published',
ADD COLUMN IF NOT EXISTS published_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN IF NOT EXISTS seo_title VARCHAR(255) DEFAULT '',
ADD COLUMN IF NOT EXISTS seo_description TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS seo_keywords TEXT DEFAULT '';

-- Create table for news images (up to 20 images per article)
CREATE TABLE IF NOT EXISTS t_p58513026_news_portal_creation.news_images (
  id SERIAL PRIMARY KEY,
  news_id INTEGER NOT NULL REFERENCES t_p58513026_news_portal_creation.news(id),
  image_url TEXT NOT NULL,
  caption TEXT DEFAULT '',
  position INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create table for news links (up to 10 links per article)
CREATE TABLE IF NOT EXISTS t_p58513026_news_portal_creation.news_links (
  id SERIAL PRIMARY KEY,
  news_id INTEGER NOT NULL REFERENCES t_p58513026_news_portal_creation.news(id),
  title VARCHAR(255) NOT NULL,
  url TEXT NOT NULL,
  position INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create table for news tags
CREATE TABLE IF NOT EXISTS t_p58513026_news_portal_creation.news_tags (
  id SERIAL PRIMARY KEY,
  news_id INTEGER NOT NULL REFERENCES t_p58513026_news_portal_creation.news(id),
  tag VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_news_images_news_id ON t_p58513026_news_portal_creation.news_images(news_id);
CREATE INDEX IF NOT EXISTS idx_news_links_news_id ON t_p58513026_news_portal_creation.news_links(news_id);
CREATE INDEX IF NOT EXISTS idx_news_tags_news_id ON t_p58513026_news_portal_creation.news_tags(news_id);
CREATE INDEX IF NOT EXISTS idx_news_published_date ON t_p58513026_news_portal_creation.news(published_date);
CREATE INDEX IF NOT EXISTS idx_news_moderation_status ON t_p58513026_news_portal_creation.news(moderation_status);