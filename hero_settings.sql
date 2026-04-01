DROP TABLE IF EXISTS hero_settings CASCADE;

-- Create table for storing the homepage hero image setting
CREATE TABLE hero_settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  display_mode TEXT DEFAULT 'slideshow', -- 'single' or 'slideshow'
  image_url TEXT, -- Used for single picture mode
  images TEXT[] DEFAULT '{}', -- Used for slideshow mode
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT single_row CHECK (id = 1)
);

-- Create trigger for hero_settings updated_at
CREATE TRIGGER update_hero_settings_updated_at
  BEFORE UPDATE ON hero_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE hero_settings ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Enable read access for all users" ON hero_settings 
  FOR SELECT USING (true);

-- Allow admin write access
CREATE POLICY "Enable insert/update/delete for admin users" ON hero_settings
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  ));

-- Insert default hero image slideshow
INSERT INTO hero_settings (id, display_mode, image_url, images) 
VALUES (
  1, 
  'slideshow', 
  'https://res.cloudinary.com/denm8lsia/image/upload/v1740924619/CakeinCups/IMG_3122.JPG',
  ARRAY[
    'https://res.cloudinary.com/denm8lsia/image/upload/v1740924619/CakeinCups/IMG_3122.JPG',
    'https://res.cloudinary.com/denm8lsia/image/upload/v1740924619/BridalShowerCakes/IMG_2723.JPG'
  ]
) 
ON CONFLICT (id) DO UPDATE SET 
  display_mode = EXCLUDED.display_mode,
  image_url = EXCLUDED.image_url,
  images = EXCLUDED.images;
