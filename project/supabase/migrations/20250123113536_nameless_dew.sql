/*
  # Initial schema for romantic website

  1. New Tables
    - `photos`
      - `id` (uuid, primary key)
      - `url` (text)
      - `caption` (text)
      - `created_at` (timestamp)
    - `connection_items`
      - `id` (uuid, primary key)
      - `type` (text)
      - `title` (text)
      - `description` (text)
      - `link` (text, optional)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for public access (since this is a personal website)
*/

-- Photos table
CREATE TABLE IF NOT EXISTS photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  url text NOT NULL,
  caption text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public access to photos"
  ON photos
  FOR ALL
  USING (true);

-- Connection items table
CREATE TABLE IF NOT EXISTS connection_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  link text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE connection_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public access to connection items"
  ON connection_items
  FOR ALL
  USING (true);