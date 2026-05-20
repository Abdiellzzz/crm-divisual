-- Tabla de perfiles
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de empresas
CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  industry TEXT,
  website TEXT,
  city TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de contactos
CREATE TABLE IF NOT EXISTS contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company_id UUID REFERENCES companies(id),
  status TEXT DEFAULT 'lead' CHECK (status IN ('lead', 'prospect', 'customer')),
  score INTEGER DEFAULT 0 CHECK (score >= 0 AND score <= 100),
  owner_id UUID REFERENCES auth.users(id),
  value BIGINT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de deals
CREATE TABLE IF NOT EXISTS deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  amount BIGINT NOT NULL,
  currency TEXT DEFAULT 'USD',
  stage TEXT DEFAULT 'prospection',
  probability INTEGER DEFAULT 50 CHECK (probability >= 0 AND probability <= 100),
  expected_close_date DATE,
  type TEXT,
  contact_id UUID REFERENCES contacts(id),
  company_id UUID REFERENCES companies(id),
  owner_id UUID REFERENCES auth.users(id),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de actividades
CREATE TABLE IF NOT EXISTS activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT DEFAULT 'email' CHECK (type IN ('meeting', 'call', 'email', 'deadline', 'deal_created')),
  title TEXT NOT NULL,
  description TEXT,
  contact_id UUID REFERENCES contacts(id),
  deal_id UUID REFERENCES deals(id),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS para profiles
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Políticas de RLS para companies
CREATE POLICY "Users can view companies"
  ON companies FOR SELECT
  USING (true);

CREATE POLICY "Users can create companies"
  ON companies FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own companies"
  ON companies FOR UPDATE
  USING (auth.uid() = created_by);

-- Políticas de RLS para contacts
CREATE POLICY "Users can view contacts"
  ON contacts FOR SELECT
  USING (true);

CREATE POLICY "Users can create contacts"
  ON contacts FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update their own contacts"
  ON contacts FOR UPDATE
  USING (auth.uid() = owner_id);

-- Políticas de RLS para deals
CREATE POLICY "Users can view deals"
  ON deals FOR SELECT
  USING (true);

CREATE POLICY "Users can create deals"
  ON deals FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update their own deals"
  ON deals FOR UPDATE
  USING (auth.uid() = owner_id);

-- Políticas de RLS para activities
CREATE POLICY "Users can view activities"
  ON activities FOR SELECT
  USING (true);

CREATE POLICY "Users can create activities"
  ON activities FOR INSERT
  WITH CHECK (auth.uid() = created_by);
