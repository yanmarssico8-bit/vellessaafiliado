-- ==============================================================================
-- RESTAURAÇÃO COMPLETA VELLESSA AFILIADOS (PRODUÇÃO 100% LIMPA E DEFINITIVA)
-- ==============================================================================
-- Cole este script inteiro no SQL Editor do seu novo projeto Supabase e clique em RUN.
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. TABELA PROFILES
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id TEXT,
  role TEXT DEFAULT 'affiliate',
  name TEXT,
  first_name TEXT,
  email TEXT UNIQUE,
  phone TEXT,
  instagram TEXT,
  affiliate_code TEXT,
  level TEXT DEFAULT 'Iniciante',
  commission_rate NUMERIC DEFAULT 0.5,
  avatar_url TEXT,
  status TEXT DEFAULT 'active',
  traffic_experience TEXT,
  traffic_investment TEXT,
  traffic_willingness TEXT,
  traffic_budget TEXT,
  onboarding_completed BOOLEAN DEFAULT TRUE,
  onboarding_answers JSONB,
  pix_key TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all read profiles" ON public.profiles;
CREATE POLICY "Allow all read profiles" ON public.profiles FOR SELECT TO authenticated, anon USING (true);

DROP POLICY IF EXISTS "Allow all insert profiles" ON public.profiles;
CREATE POLICY "Allow all insert profiles" ON public.profiles FOR INSERT TO authenticated, anon WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all update profiles" ON public.profiles;
CREATE POLICY "Allow all update profiles" ON public.profiles FOR UPDATE TO authenticated, anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all delete profiles" ON public.profiles;
CREATE POLICY "Allow all delete profiles" ON public.profiles FOR DELETE TO authenticated, anon USING (true);

-- 2. TABELA PLATFORM_SETTINGS (AULAS, MÓDULOS E CONFIGURAÇÕES)
CREATE TABLE IF NOT EXISTS public.platform_settings (
  key TEXT PRIMARY KEY,
  value JSONB,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all read platform_settings" ON public.platform_settings;
CREATE POLICY "Allow all read platform_settings" ON public.platform_settings FOR SELECT TO authenticated, anon USING (true);

DROP POLICY IF EXISTS "Allow all write platform_settings" ON public.platform_settings;
CREATE POLICY "Allow all write platform_settings" ON public.platform_settings FOR ALL TO authenticated, anon USING (true) WITH CHECK (true);

-- 3. TABELAS DE CRIATIVOS, MATERIAIS E PASTAS
CREATE TABLE IF NOT EXISTS public.folders (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  color TEXT DEFAULT 'gold',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.folders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all folders" ON public.folders FOR ALL TO authenticated, anon USING (true) WITH CHECK (true);

CREATE TABLE IF NOT EXISTS public.creatives (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  format TEXT NOT NULL,
  image TEXT,
  text TEXT,
  folder_id TEXT,
  file_url TEXT,
  external_download_url TEXT,
  file_type TEXT,
  file_size TEXT,
  storage_type TEXT DEFAULT 'external',
  storage_path TEXT,
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.creatives ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all creatives" ON public.creatives FOR ALL TO authenticated, anon USING (true) WITH CHECK (true);

CREATE TABLE IF NOT EXISTS public.materials (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  kind TEXT NOT NULL,
  size TEXT NOT NULL,
  file_url TEXT,
  raw_file_name TEXT,
  source_type TEXT DEFAULT 'upload',
  mime_type TEXT,
  folder_id TEXT,
  files JSONB,
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all materials" ON public.materials FOR ALL TO authenticated, anon USING (true) WITH CHECK (true);

CREATE TABLE IF NOT EXISTS public.affiliate_links (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  url TEXT NOT NULL,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.affiliate_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all affiliate_links" ON public.affiliate_links FOR ALL TO authenticated, anon USING (true) WITH CHECK (true);

-- 4. RESTAURAÇÃO DOS 15 AFILIADOS CADASTRADOS (DADOS REAIS PRESERVADOS)
INSERT INTO public.profiles (id, email, name, first_name, phone, role, created_at, onboarding_completed)
VALUES
  ('0e9d1be7-d88a-4751-b831-d51c46fbf6b1', 'salvos@gmail.com', 'Yan stest', 'Yan', '(13) 98222-5046', 'affiliate', '2026-11-19 10:59:50+00', true),
  ('de914b29-3f1b-4c35-8b90-c59141bc8c1c', 'sohmartins15@gmail.com', 'Teste w', 'Teste', null, 'affiliate', '2026-11-06 01:03:38+00', true),
  ('31972112-9e78-4927-ace3-1756dddd8240', 'auustoyander@gmail.com', 'Yan teste', 'Yan', '(13) 98839-1402', 'affiliate', '2026-11-09 18:55:12+00', true),
  ('94f4c434-36b6-4ddf-a6ff-56e9f2b320bd', 'dbrunoduran123@gmail.com', 'Bruno Franco Guiser', 'Bruno', '(69) 99393-3713', 'affiliate', '2026-11-09 22:38:21+00', true),
  ('c9cdcb52-dc13-4c6e-9b5e-5e68efcb857f', 'contato.gustavogg@outlook.com', 'Gustavo', 'Gustavo', '(67) 98129-5543', 'affiliate', '2026-11-09 22:47:04+00', true),
  ('b81a2e19-9d7b-41b8-b2ff-a8cd4b0a67a9', 'harrisonvaladares10@gmail.com', 'Harrison Valadares', 'Harrison', '(21) 97419-8235', 'affiliate', '2026-11-10 00:09:55+00', true),
  ('d2bf8498-c3f4-4590-868d-6c368d9d3011', 'andersondesouzaviana33@gmail.com', 'Anderson de Souza', 'Anderson', '(22) 99855-7479', 'affiliate', '2026-11-10 01:05:08+00', true),
  ('24e29882-3251-478b-9f68-059041cc26fb', 'wilton997979562@gmail.com', 'Wilton pereira de Santana', 'Wilton', '(21) 97728-2745', 'affiliate', '2026-11-10 08:28:08+00', true),
  ('0c8d30c1-1a1f-46c4-8012-4e9d9f4d924d', 'johannabarreto051@gmail.com', 'johanna barreto', 'johanna', '(54) 98164-3776', 'affiliate', '2026-11-11 21:56:01+00', true),
  ('d8729dd4-80d8-424d-913e-7bf9f4e9a29d', 'so971517@gmail.com', 'Saulo Oliveira', 'Saulo', '(81) 99212-2656', 'affiliate', '2026-11-11 22:21:50+00', true),
  ('abb63998-b794-4488-812d-20a6a3a7238c', 'fortunatoalex17@gmail.com', 'Alex', 'Alex', '(35) 99140-4554', 'affiliate', '2026-11-19 01:21:32+00', true),
  ('de895566-c248-4011-899a-03406fc172b2', 'rafanatalli44@gmail.com', 'Rafael', 'Rafael', '(28) 99931-2821', 'affiliate', '2026-11-20 19:31:39+00', true),
  ('06cbba9c-52e9-4c09-9bdc-02bcf67a58de', 'augustoyander@gmail.com', 'Yan Marssico', 'Yan', '(13) 98839-1402', 'admin', '2026-11-05 22:39:19+00', true),
  ('dcfa4355-b18d-4e78-b924-f431391ff964', 'yandarssico@gmail.com', 'Yan', 'Yan', '(13) 98222-5046', 'admin', '2026-11-19 20:26:52+00', true),
  ('eccd6e12-de2e-4bc1-880b-f83e9dd5263f', 'marssico@gmail.com', 'Yan', 'Yan', '(13) 98222-5046', 'admin', '2026-11-09 21:32:41+00', true)
ON CONFLICT (email) DO UPDATE SET
  name = EXCLUDED.name,
  first_name = EXCLUDED.first_name,
  phone = EXCLUDED.phone,
  role = EXCLUDED.role;

-- 5. RESTAURAÇÃO DOS 6 MÓDULOS DE AULAS (COM CAPAS LOCAIS SEGURAS)
INSERT INTO public.platform_settings (key, value, updated_at)
VALUES (
  'academy_modules_v1',
  '[
    {
      "id": "mod-1795052744275",
      "cover": "/covers/Pagamento_na_Entrega_2_sem_modulo.png",
      "title": "Logzz - Como vender com pagamento na entrega",
      "subtitle": "",
      "lessons": [
        {
          "id": "l-1795052783437",
          "done": false,
          "title": "O que é a Logzz",
          "duration": "10:00",
          "materials": [],
          "video_url": "https://drive.google.com/file/d/1ctGCno_yeHkNZjpFQv3oq08rTrVwyAOu/view?usp=drive_link",
          "description": ""
        },
        {
          "id": "l-1795052990205",
          "done": false,
          "title": "Como fazer um pedido na Logzz",
          "duration": "8:00",
          "materials": [],
          "video_url": "https://drive.google.com/file/d/1t_NPr_Ym000tfwXu1CaJrIWUE5T4JQqs/view?usp=drive_link",
          "description": ""
        },
        {
          "id": "l-1795110119641",
          "done": false,
          "title": "Mais sobre a Logzz",
          "duration": "10:00",
          "materials": [],
          "video_url": "https://drive.google.com/file/d/19QjoK_XlnApg9qisZw7n6a2MBRNjQa2R/view?usp=drive_link",
          "contentType": "video",
          "description": ""
        }
      ]
    },
    {
      "id": "mod-1793736300497",
      "cover": "/covers/Trafego_Pago_sem_modulo.png",
      "title": "Trafego Pago",
      "subtitle": "",
      "lessons": [
        {
          "id": "l-1795046017569",
          "done": false,
          "title": "Primeiros Passos - Trafego Pago",
          "duration": "10:00",
          "video_url": "https://drive.google.com/file/d/1Zi9RPjxeEwuiXxDAZLZ0N1aXHKKusg4n/view?usp=drive_link",
          "description": ""
        },
        {
          "id": "l-1795047354904",
          "done": false,
          "title": "Como criar publico no Meta ADS",
          "duration": "10:00",
          "materials": [],
          "video_url": "https://drive.google.com/file/d/1rGRN0_G7S7ZhK5cD8GQD2QQp4GdtJVbl/view?usp=drive_link",
          "description": ""
        },
        {
          "id": "l-1795047785154",
          "done": false,
          "title": "Como subir a campanha (campanha e conjunto)",
          "duration": "10:00",
          "materials": [],
          "video_url": "https://drive.google.com/file/d/1b1wtBkt3ADTJhSwb-KchfcuBoz-sL7yK/view?usp=drive_link",
          "description": ""
        },
        {
          "id": "l-1795049083397",
          "done": false,
          "title": "Como subir a campanha (o anúncio)",
          "duration": "6:00",
          "materials": [],
          "video_url": "https://drive.google.com/file/d/1y16RdhsnxAK_zgAWEngYxkY-x_FDCqTE/view?usp=drive_link",
          "description": ""
        },
        {
          "id": "l-1795049127335",
          "done": false,
          "title": "Como configurar o pixel",
          "duration": "6:58",
          "materials": [],
          "video_url": "https://drive.google.com/file/d/18Nt-dKzrTJHQkCleoeMJvSrpl8RcaTxp/view?usp=drive_link",
          "description": ""
        }
      ]
    },
    {
      "id": "mod-1795049180873",
      "cover": "/covers/Criativos_com_IA_sem_modulo.png",
      "title": "Criativos com IA",
      "subtitle": "",
      "lessons": [
        {
          "id": "l-1795049208053",
          "done": false,
          "title": "Criativos com IA - Aula 1",
          "duration": "10:00",
          "materials": [],
          "video_url": "https://drive.google.com/file/d/1qWtrh2VEWzinHT4HmCqK-JYOaIGxPjdp/view?usp=drive_link",
          "description": ""
        }
      ]
    },
    {
      "id": "mod-1795110397916",
      "cover": "/covers/Configuracao_de_Pagina_no_Facebook_e_Posters.png",
      "title": "Configuração de Página no Facebook e Posters",
      "subtitle": "",
      "lessons": [
        {
          "id": "l-1795110438046",
          "done": false,
          "title": "Como moderar a sua página",
          "duration": "10:00",
          "materials": [],
          "video_url": "https://drive.google.com/file/d/13O9IFGfB07xg6MxNS1nxfnxOPKHFQLbU/view?usp=drive_link",
          "contentType": "video",
          "description": ""
        },
        {
          "id": "l-1795110470191",
          "done": false,
          "title": "Dark Post (comentários no criativo)",
          "duration": "10:00",
          "materials": [],
          "video_url": "https://drive.google.com/file/d/1q3i6phJxXwRYuht91cXm4CJNaZcYgrES/view?usp=drive_link",
          "contentType": "video",
          "description": ""
        }
      ]
    },
    {
      "id": "mod-1795054686728",
      "cover": "/covers/Venda_com_Automacao_Bot_sem_modulo.png",
      "title": "Venda com Automações - Facilite seu dia a dia!",
      "subtitle": "",
      "lessons": [
        {
          "id": "l-1795054797148",
          "done": false,
          "title": "Automação com o ZapData",
          "duration": "10:00",
          "materials": [],
          "video_url": "https://drive.google.com/file/d/1XrRvzdCZWVnRE6E_KYqsjYU16a7YtIz3/view?usp=drive_link",
          "description": ""
        },
        {
          "id": "l-1795054831787",
          "done": false,
          "title": "Instalando a automação",
          "duration": "10:00",
          "materials": [],
          "video_url": "https://drive.google.com/file/d/1mAkx8I-pLTJTuon0hOoAmSEy67hGlC6U/view?usp=drive_link",
          "description": ""
        }
      ]
    },
    {
      "id": "mod-1795089247916",
      "cover": "/covers/Grupo_Exclusivo_de_Afiliados_Vellessa.png",
      "title": "Grupo Exclusivo Whatsapp",
      "subtitle": "",
      "lessons": [
        {
          "id": "l-1795089304376",
          "done": false,
          "title": "Entre no Grupo",
          "duration": "Link / Ferramenta",
          "materials": [],
          "video_url": "",
          "contentUrl": "https://chat.whatsapp.com/JHD6nniNchYLhQmRnLDZ86?s=cl&p=a&iam=2",
          "contentType": "link",
          "description": "Clique no Link e acesse o Grupo"
        }
      ]
    }
  ]'::jsonb,
  NOW()
)
ON CONFLICT (key) DO UPDATE SET
  value = EXCLUDED.value,
  updated_at = NOW();
