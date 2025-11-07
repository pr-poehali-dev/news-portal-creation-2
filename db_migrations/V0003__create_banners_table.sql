-- Create banners table for ad management
CREATE TABLE IF NOT EXISTS t_p58513026_news_portal_creation.banners (
    id SERIAL PRIMARY KEY,
    placement VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    media_type VARCHAR(20) NOT NULL,
    media_url TEXT,
    link_url TEXT,
    rsy_code TEXT,
    is_active BOOLEAN DEFAULT true,
    priority INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_banners_placement ON t_p58513026_news_portal_creation.banners(placement);
CREATE INDEX idx_banners_active ON t_p58513026_news_portal_creation.banners(is_active);

COMMENT ON TABLE t_p58513026_news_portal_creation.banners IS 'Advertising banners management';
COMMENT ON COLUMN t_p58513026_news_portal_creation.banners.placement IS 'Banner placement: header, sidebar, footer, article-top, article-bottom, between-news';
COMMENT ON COLUMN t_p58513026_news_portal_creation.banners.media_type IS 'Media type: image, video, rsy';
COMMENT ON COLUMN t_p58513026_news_portal_creation.banners.media_url IS 'URL to uploaded image or video';
COMMENT ON COLUMN t_p58513026_news_portal_creation.banners.link_url IS 'Click-through URL';
COMMENT ON COLUMN t_p58513026_news_portal_creation.banners.rsy_code IS 'RSY embed code';
