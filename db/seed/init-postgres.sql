-- PostgreSQL initialization script for Team Finder
-- This script is run when the database container starts

-- Create tables (if they don't exist)
CREATE TABLE IF NOT EXISTS posts (
    id VARCHAR(255) PRIMARY KEY,
    jam_id VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    author_id VARCHAR(255) NOT NULL,
    portfolio_links TEXT NOT NULL,
    description TEXT NOT NULL,
    size INTEGER NOT NULL,
    skills_possessed TEXT,
    skills_sought TEXT,
    preferred_tools TEXT,
    availability VARCHAR(50) NOT NULL,
    timezone_offsets TEXT NOT NULL,
    languages TEXT NOT NULL,
    query_count INTEGER DEFAULT 0,
    full_page_view_count INTEGER DEFAULT 0,
    report_count INTEGER DEFAULT 0,
    unable_to_contact_count INTEGER DEFAULT 0,
    created_at VARCHAR(50) NOT NULL,
    updated_at VARCHAR(50) NOT NULL,
    deleted_at VARCHAR(50)
);

CREATE INDEX IF NOT EXISTS idx_posts_jam_id ON posts(jam_id);
CREATE INDEX IF NOT EXISTS idx_posts_author_id ON posts(author_id);
CREATE INDEX IF NOT EXISTS idx_posts_deleted_at ON posts(deleted_at);

CREATE TABLE IF NOT EXISTS jams (
    jam_id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(500) NOT NULL,
    status VARCHAR(50) NOT NULL,
    start BIGINT NOT NULL,
    end BIGINT NOT NULL,
    styles TEXT NOT NULL,
    admin_ids TEXT NOT NULL,
    guild_id VARCHAR(255) NOT NULL,
    channel_id VARCHAR(255) NOT NULL,
    guild_invite_link VARCHAR(500),
    discord_enabled BOOLEAN DEFAULT true,
    admin_info TEXT,
    bg_image_url VARCHAR(1000),
    logo_large_url VARCHAR(1000),
    logo_stacked_url VARCHAR(1000),
    favicon_url VARCHAR(1000)
);

CREATE TABLE IF NOT EXISTS favourites (
    discord_id VARCHAR(255) PRIMARY KEY,
    post_ids TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_favourites_discord_id ON favourites(discord_id);

CREATE TABLE IF NOT EXISTS banned_users (
    discord_id VARCHAR(255) PRIMARY KEY,
    banning_admin_id VARCHAR(255) NOT NULL,
    banned_at VARCHAR(50)
);

CREATE INDEX IF NOT EXISTS idx_banned_users_discord_id ON banned_users(discord_id);

CREATE TABLE IF NOT EXISTS auth_tokens (
    id VARCHAR(255) PRIMARY KEY,
    jam_id VARCHAR(255) NOT NULL,
    discord_id VARCHAR(255) NOT NULL,
    access_token TEXT NOT NULL,
    token_type VARCHAR(50) NOT NULL,
    expiry BIGINT NOT NULL,
    refresh_token TEXT,
    created_at BIGINT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_auth_tokens_discord_id ON auth_tokens(discord_id);
CREATE INDEX IF NOT EXISTS idx_auth_tokens_jam_id ON auth_tokens(jam_id);
CREATE INDEX IF NOT EXISTS idx_auth_tokens_expiry ON auth_tokens(expiry);

CREATE TABLE IF NOT EXISTS analytics_common_events (
    id VARCHAR(255) PRIMARY KEY,
    login_count INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS analytics_view_events (
    query TEXT PRIMARY KEY,
    count INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS analytics_metric_counters (
    id VARCHAR(500) PRIMARY KEY,
    jam_id VARCHAR(255) NOT NULL,
    metric VARCHAR(100) NOT NULL,
    label VARCHAR(500) DEFAULT '',
    count BIGINT DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_analytics_metric_jam_id ON analytics_metric_counters(jam_id);
CREATE INDEX IF NOT EXISTS idx_analytics_metric_metric ON analytics_metric_counters(metric);

CREATE TABLE IF NOT EXISTS analytics_homepage_unique_views (
    id VARCHAR(500) PRIMARY KEY,
    jam_id VARCHAR(255) NOT NULL,
    viewer_key VARCHAR(255) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_analytics_homepage_unique_jam_id ON analytics_homepage_unique_views(jam_id);
