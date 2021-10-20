CREATE TABLE IF NOT EXISTS categories(
  id UUID DEFAULT uuid_generate_v4(),
  name VARCHAR(1000) NOT NULL,
  displayed_name TEXT,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS posts(
  id UUID DEFAULT uuid_generate_v4(),
  category_id UUID,
  title VARCHAR(1000),
  content TEXT,
  thumbnail_url TEXT,
  tags TEXT,
  is_published BOOLEAN DEFAULT true,
  is_highlighted BOOLEAN DEFAULT false,
  include_in_posts BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (id),
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

CREATE TABLE IF NOT EXISTS contacts(
  id UUID DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  url TEXT,
  icon_url TEXT,
  tags TEXT,
  PRIMARY KEY (id)
);
