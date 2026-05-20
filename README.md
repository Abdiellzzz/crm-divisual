# APEX CRM - Sistema de Gestión de Relaciones con Clientes

Sistema CRM premium construido con Next.js 14, TypeScript, Tailwind CSS y Supabase.

## Características

- ✅ **Autenticación con Supabase** - Login/Signup con email y contraseña
- ✅ **Dashboard en Tiempo Real** - KPIs, gráficos y métricas dinámicas
- ✅ **Gestión de Contactos** - CRUD completo con búsqueda y filtros
- ✅ **Pipeline Kanban** - Drag & drop para mover deals entre etapas
- ✅ **Detalle de Contactos** - Perfil completo con timeline de actividades
- ✅ **Diseño Premium** - Tema oscuro con acentos dorados (APEX)
- ✅ **Responsive** - Optimizado para desktop

## Requisitos

- Node.js 18+
- npm o yarn
- Cuenta de Supabase

## Instalación

1. **Clonar el repositorio**
```bash
git clone <repo-url>
cd "CRM PROYECTO"
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
Copiar `.env.local.example` a `.env.local` y llenar con tus credenciales de Supabase:

```bash
cp .env.local.example .env.local
```

Editar `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=tu-url-supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
SUPABASE_ACCESS_TOKEN=tu-token-acceso
```

4. **Crear tablas en Supabase**

En Supabase SQL Editor, ejecutar:

```sql
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
```

5. **Iniciar la aplicación**
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## Estructura del Proyecto

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Rutas de autenticación
│   ├── (dashboard)/       # Rutas protegidas del dashboard
│   └── layout.tsx         # Layout root
├── components/            # Componentes React
│   ├── dashboard/         # Componentes del dashboard
│   ├── pipeline/          # Componentes del Kanban
│   ├── layout/            # Componentes de layout
│   └── ui/                # Componentes UI reutilizables
├── hooks/                 # Custom React hooks
│   ├── useAuth.ts        # Autenticación
│   ├── useContacts.ts    # Gestión de contactos
│   └── useDeals.ts       # Gestión de deals
├── lib/
│   ├── supabase.ts       # Cliente de Supabase
│   └── types.ts          # Tipos TypeScript
└── styles/
    └── globals.css       # Estilos globales
```

## Paleta de Colores (APEX CRM)

- **Fondo**: #080808 (--apex-bg)
- **Superficie 1**: #111111 (--apex-s1)
- **Superficie 2**: #1A1A1A (--apex-s2)
- **Oro**: #FAC51C (--apex-gold)
- **Texto**: #F5F5F5 (--apex-txt)
- **Texto secundario**: #A0A0A0 (--apex-txt2)

## Próximas Características

- [ ] Importar/Exportar contactos
- [ ] Reportes avanzados
- [ ] Integración con email
- [ ] Notificaciones en tiempo real
- [ ] Aplicación móvil
- [ ] Multi-usuario con permisos

## Licencia

MIT

## Soporte

Para reportar bugs o sugerencias, abrir un issue en el repositorio.
