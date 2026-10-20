# ImportGlow

Catálogo de perfumes y vapers con panel de administración, productos con variantes, stock e imágenes, y pedidos por WhatsApp.

## Stack

- Next.js 16
- Vercel
- Supabase Postgres, Auth y Storage

## Configuración local

1. Creá un proyecto de Supabase.
2. Ejecutá `supabase/migrations/202610200001_importglow.sql` y después `supabase/seed.sql` en el SQL Editor.
3. En Authentication > Users, creá el usuario administrador.
4. Copiá `.env.example` como `.env.local` y completá las cuatro variables.
5. Ejecutá `pnpm install` y `pnpm dev`.

El catálogo está en `/` y el panel en `/admin`.

## Despliegue en Vercel

Importá el repositorio de GitHub en Vercel y configurá las mismas variables de `.env.example` para Production, Preview y Development. La clave `SUPABASE_SERVICE_ROLE_KEY` es secreta y nunca debe exponerse en variables que comiencen con `NEXT_PUBLIC_`.
