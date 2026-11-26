-- ==============================================================================
-- CURA DEFINITIVA DE PASTAS: MATERIAIS & CRIATIVOS (VELLESSA AFILIADOS)
-- ==============================================================================
-- Instruções:
-- 1. Abra o painel do seu Supabase (https://supabase.com/dashboard)
-- 2. Selecione o projeto (knvwazfulbqwtabmapbg)
-- 3. No menu lateral esquerdo, clique no ícone "SQL Editor" (>_)
-- 4. Clique em "New Query", cole este script inteiro e clique em "RUN" (▶)
-- ==============================================================================

-- 1. TABELA DE PASTAS DE MATERIAIS
CREATE TABLE IF NOT EXISTS public.material_folders (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  color TEXT DEFAULT 'gold',
  drive_url TEXT,
  parent_id TEXT REFERENCES public.material_folders(id) ON DELETE CASCADE,
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices e RLS para material_folders
CREATE INDEX IF NOT EXISTS idx_material_folders_parent ON public.material_folders(parent_id);
CREATE INDEX IF NOT EXISTS idx_material_folders_order ON public.material_folders(order_index);

ALTER TABLE public.material_folders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all read material_folders" ON public.material_folders;
CREATE POLICY "Allow all read material_folders" ON public.material_folders
  FOR SELECT TO authenticated, anon USING (true);

DROP POLICY IF EXISTS "Allow all write material_folders" ON public.material_folders;
CREATE POLICY "Allow all write material_folders" ON public.material_folders
  FOR ALL TO authenticated, anon USING (true) WITH CHECK (true);


-- 2. TABELA DE PASTAS / COLEÇÕES DE CRIATIVOS
CREATE TABLE IF NOT EXISTS public.creative_folders (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  color TEXT DEFAULT 'gold',
  cover_image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_creative_folders_created ON public.creative_folders(created_at);

ALTER TABLE public.creative_folders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all read creative_folders" ON public.creative_folders;
CREATE POLICY "Allow all read creative_folders" ON public.creative_folders
  FOR SELECT TO authenticated, anon USING (true);

DROP POLICY IF EXISTS "Allow all write creative_folders" ON public.creative_folders;
CREATE POLICY "Allow all write creative_folders" ON public.creative_folders
  FOR ALL TO authenticated, anon USING (true) WITH CHECK (true);


-- 3. RECONEXÃO DAS PASTAS DE MATERIAIS (GARANTE QUE AS 3 PASTAS EXISTAM SEM SOBRESCREVER NOMES DO USUÁRIO)
INSERT INTO public.material_folders (id, name, description, color, drive_url, parent_id, order_index)
VALUES
  ('folder-1795308632878', 'Pasta 1', '', 'gold', NULL, NULL, 0),
  ('folder-1795312228533', 'Pasta 2', '', 'gold', NULL, NULL, 1),
  ('folder-1795313370711', 'Pasta 3', '', 'gold', NULL, NULL, 2)
ON CONFLICT (id) DO NOTHING;


-- 4. RECONEXÃO DAS PASTAS DE CRIATIVOS (GARANTE QUE AS 5 COLEÇÕES EXISTAM SEM SOBRESCREVER CAPAS OU NOMES)
INSERT INTO public.creative_folders (id, name, description, color, cover_image)
VALUES
  ('cfolder-1795306381722', 'Coleção 1', '', 'gold', NULL),
  ('cfolder-1795306537982', 'Coleção 2', '', 'gold', NULL),
  ('cfolder-1795306613944', 'Coleção 3', '', 'gold', NULL),
  ('cfolder-1795309074282', 'Coleção 4', '', 'gold', NULL),
  ('cfolder-1795312968408', 'Coleção 5', '', 'gold', NULL)
ON CONFLICT (id) DO NOTHING;


-- 5. RECARGA DO SCHEMA CACHE DO POSTGREST
NOTIFY pgrst, 'reload schema';

-- VERIFICAÇÃO FINAL
SELECT 'material_folders' as tabela, count(*) as total_registros FROM public.material_folders
UNION ALL
SELECT 'creative_folders' as tabela, count(*) as total_registros FROM public.creative_folders
UNION ALL
SELECT 'materials' as tabela, count(*) as total_registros FROM public.materials
UNION ALL
SELECT 'creatives' as tabela, count(*) as total_registros FROM public.creatives;
