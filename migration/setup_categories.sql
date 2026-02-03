-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public Read Access" ON categories
    FOR SELECT USING (true);

-- Admin full access
CREATE POLICY "Admin Full Access" ON categories
    FOR ALL USING (auth.role() = 'authenticated');
