-- V1__initial_schema.sql
-- HobbyHeaven initial database schema

-- Enable pgcrypto for UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─────────────────────────────────────────────
-- USERS
-- ─────────────────────────────────────────────
CREATE TABLE users (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    username    VARCHAR(64) NOT NULL UNIQUE,
    email       VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255),           -- nullable when Keycloak auth is used
    role        VARCHAR(16) NOT NULL DEFAULT 'USER' CHECK (role IN ('ADMIN', 'USER')),
    oidc_subject VARCHAR(255) UNIQUE,     -- Keycloak subject ID
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─────────────────────────────────────────────
-- HOBBY TYPES
-- ─────────────────────────────────────────────
CREATE TABLE hobby_types (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    name        VARCHAR(64) NOT NULL UNIQUE,
    slug        VARCHAR(64) NOT NULL UNIQUE,
    description TEXT,
    icon        VARCHAR(64),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Seed crochet as the first hobby type
INSERT INTO hobby_types (name, slug, description, icon)
VALUES ('Crochet', 'crochet', 'Crochet patterns and projects', 'yarn');

-- ─────────────────────────────────────────────
-- CATEGORIES (scoped to hobby type)
-- ─────────────────────────────────────────────
CREATE TABLE categories (
    id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    name          VARCHAR(64) NOT NULL,
    slug          VARCHAR(64) NOT NULL,
    hobby_type_id UUID        NOT NULL REFERENCES hobby_types(id) ON DELETE CASCADE,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (slug, hobby_type_id)
);

-- Seed crochet categories
INSERT INTO categories (name, slug, hobby_type_id)
SELECT c.name, c.slug, ht.id
FROM (VALUES
    ('Amigurumi',    'amigurumi'),
    ('Garments',     'garments'),
    ('Accessories',  'accessories'),
    ('Home Decor',   'home-decor'),
    ('Toys',         'toys'),
    ('Bags',         'bags')
) AS c(name, slug)
CROSS JOIN hobby_types ht
WHERE ht.slug = 'crochet';

-- ─────────────────────────────────────────────
-- TAGS (global, free-form)
-- ─────────────────────────────────────────────
CREATE TABLE tags (
    id   UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(64) NOT NULL UNIQUE,
    slug VARCHAR(64) NOT NULL UNIQUE
);

-- ─────────────────────────────────────────────
-- PATTERNS
-- ─────────────────────────────────────────────
CREATE TABLE patterns (
    id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    title            VARCHAR(255) NOT NULL,
    description      TEXT,
    difficulty       VARCHAR(16) NOT NULL DEFAULT 'BEGINNER'
                        CHECK (difficulty IN ('BEGINNER','EASY','INTERMEDIATE','ADVANCED','EXPERT')),
    author           VARCHAR(255),
    source_url       TEXT,
    cover_image_path TEXT,
    hobby_type_id    UUID        NOT NULL REFERENCES hobby_types(id),
    metadata         JSONB       NOT NULL DEFAULT '{}',
    instructions     JSONB       NOT NULL DEFAULT '[]',
    created_by       UUID        REFERENCES users(id) ON DELETE SET NULL,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index JSONB metadata for fast filtering (e.g. yarn weight, hook size)
CREATE INDEX idx_patterns_metadata  ON patterns USING GIN (metadata);
CREATE INDEX idx_patterns_hobby     ON patterns (hobby_type_id);
CREATE INDEX idx_patterns_difficulty ON patterns (difficulty);

-- ─────────────────────────────────────────────
-- MATERIALS
-- ─────────────────────────────────────────────
CREATE TABLE materials (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    pattern_id  UUID        NOT NULL REFERENCES patterns(id) ON DELETE CASCADE,
    name        VARCHAR(128) NOT NULL,
    quantity    NUMERIC,
    unit        VARCHAR(32),
    notes       TEXT,
    sort_order  INT         NOT NULL DEFAULT 0
);

CREATE INDEX idx_materials_pattern ON materials (pattern_id);

-- ─────────────────────────────────────────────
-- PATTERN ↔ CATEGORY (many-to-many)
-- ─────────────────────────────────────────────
CREATE TABLE pattern_categories (
    pattern_id  UUID NOT NULL REFERENCES patterns(id)   ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    PRIMARY KEY (pattern_id, category_id)
);

-- ─────────────────────────────────────────────
-- PATTERN ↔ TAG (many-to-many)
-- ─────────────────────────────────────────────
CREATE TABLE pattern_tags (
    pattern_id UUID NOT NULL REFERENCES patterns(id) ON DELETE CASCADE,
    tag_id     UUID NOT NULL REFERENCES tags(id)     ON DELETE CASCADE,
    PRIMARY KEY (pattern_id, tag_id)
);

-- ─────────────────────────────────────────────
-- USER FAVOURITES
-- ─────────────────────────────────────────────
CREATE TABLE user_favourites (
    user_id    UUID        NOT NULL REFERENCES users(id)    ON DELETE CASCADE,
    pattern_id UUID        NOT NULL REFERENCES patterns(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, pattern_id)
);

-- ─────────────────────────────────────────────
-- USER PROGRESS
-- ─────────────────────────────────────────────
CREATE TABLE user_progress (
    id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id      UUID        NOT NULL REFERENCES users(id)    ON DELETE CASCADE,
    pattern_id   UUID        NOT NULL REFERENCES patterns(id) ON DELETE CASCADE,
    status       VARCHAR(16) NOT NULL DEFAULT 'WANT_TO_MAKE'
                    CHECK (status IN ('WANT_TO_MAKE','IN_PROGRESS','COMPLETED')),
    current_step INT         NOT NULL DEFAULT 0,
    notes        TEXT,
    started_at   TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    UNIQUE (user_id, pattern_id)
);

CREATE INDEX idx_progress_user ON user_progress (user_id);
