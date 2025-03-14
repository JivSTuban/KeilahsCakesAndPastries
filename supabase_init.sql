-- Enable Row Level Security
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create tables
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  slug VARCHAR NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cakes (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  description TEXT NOT NULL,
  price INTEGER NOT NULL,
  category_id INTEGER REFERENCES categories(id),
  image_path TEXT NOT NULL,
  is_popular BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS testimonials (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  message TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  image_path TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type VARCHAR NOT NULL,
  data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id)
);

CREATE TABLE IF NOT EXISTS feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name VARCHAR NOT NULL,
  message TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  status VARCHAR DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS featured_orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  customer_testimonial TEXT,
  order_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_feedback_updated_at
  BEFORE UPDATE ON feedback
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_featured_orders_updated_at
  BEFORE UPDATE ON featured_orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Set up Row Level Security policies
-- Events RLS
CREATE POLICY "Enable read access for authenticated users" ON events
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert access for all users" ON events
  FOR INSERT WITH CHECK (true);

-- Feedback RLS
CREATE POLICY "Enable read access for all users" ON feedback
  FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON feedback
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for authenticated users" ON feedback
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Featured Orders RLS
CREATE POLICY "Enable read access for all users" ON featured_orders
  FOR SELECT USING (true);

CREATE POLICY "Enable insert/update/delete for authenticated users" ON featured_orders
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Categories RLS
CREATE POLICY "Enable read access for all users" ON categories
  FOR SELECT USING (true);

CREATE POLICY "Enable insert/update/delete for authenticated users" ON categories
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Cakes RLS
CREATE POLICY "Enable read access for all users" ON cakes
  FOR SELECT USING (true);

CREATE POLICY "Enable insert/update/delete for authenticated users" ON cakes
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Testimonials RLS
CREATE POLICY "Enable read access for all users" ON testimonials
  FOR SELECT USING (true);

CREATE POLICY "Enable insert/update/delete for authenticated users" ON testimonials
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Enable RLS on all tables
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE featured_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE cakes ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Create indexes for better performance
CREATE INDEX events_type_idx ON events(event_type);
CREATE INDEX events_created_at_idx ON events(created_at);
CREATE INDEX feedback_status_idx ON feedback(status);
CREATE INDEX feedback_created_at_idx ON feedback(created_at);
CREATE INDEX featured_orders_created_at_idx ON featured_orders(created_at);
CREATE INDEX categories_slug_idx ON categories(slug);
CREATE INDEX cakes_category_id_idx ON cakes(category_id);
CREATE INDEX cakes_is_popular_idx ON cakes(is_popular);
CREATE INDEX testimonials_rating_idx ON testimonials(rating);

-- Insert sample admin user (replace with actual admin email and password)
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@keilahspastries.com',
  crypt('admin123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW()
) ON CONFLICT DO NOTHING;
