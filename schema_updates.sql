-- Add profiles table for user roles
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  role VARCHAR DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create trigger for profiles updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create posts table
CREATE TABLE IF NOT EXISTS posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create trigger for posts updated_at
CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Rename cakes table to menu_items and update structure
ALTER TABLE cakes RENAME TO menu_items;
ALTER TABLE menu_items RENAME COLUMN image_path TO image_url;
ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS category VARCHAR NOT NULL;
ALTER TABLE menu_items DROP CONSTRAINT IF EXISTS menu_items_category_id_fkey;
ALTER TABLE menu_items DROP COLUMN IF EXISTS category_id;

-- Update featured_orders table
ALTER TABLE featured_orders DROP COLUMN IF EXISTS title;
ALTER TABLE featured_orders DROP COLUMN IF EXISTS description;
ALTER TABLE featured_orders DROP COLUMN IF EXISTS image_url;
ALTER TABLE featured_orders DROP COLUMN IF EXISTS customer_testimonial;
ALTER TABLE featured_orders DROP COLUMN IF EXISTS order_date;
ALTER TABLE featured_orders ADD COLUMN IF NOT EXISTS menu_item_id INTEGER REFERENCES menu_items(id);

-- Update RLS policies
CREATE POLICY "Enable read access for all users" ON posts
  FOR SELECT USING (true);

CREATE POLICY "Enable insert/update/delete for admin users" ON posts
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  ));

-- Update existing policies for admin roles
DROP POLICY IF EXISTS "Enable insert/update/delete for authenticated users" ON featured_orders;
CREATE POLICY "Enable insert/update/delete for admin users" ON featured_orders
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  ));

-- Enable RLS on new tables
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX posts_created_at_idx ON posts(created_at);
CREATE INDEX profiles_role_idx ON profiles(role);
CREATE INDEX menu_items_category_idx ON menu_items(category);

-- Update admin user with admin role
INSERT INTO profiles (id, role)
SELECT id, 'admin'
FROM auth.users
WHERE email = 'admin@keilahspastries.com'
ON CONFLICT (id) DO UPDATE SET role = 'admin';
