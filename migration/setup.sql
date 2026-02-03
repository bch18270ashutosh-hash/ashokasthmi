-- Create Products Table
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  image TEXT,
  mrp NUMERIC NOT NULL,
  price NUMERIC NOT NULL,
  stock INTEGER DEFAULT 0,
  description TEXT,
  variants JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Public products are viewable by everyone" 
ON products FOR SELECT USING (true);

-- Allow authenticated users (Admin) to manage products
CREATE POLICY "Admins can manage products" 
ON products FOR ALL USING (auth.role() = 'authenticated');

-- Create a bucket for product images
-- Note: You need to go to Storage in Supabase and create a public bucket named 'product-images'
