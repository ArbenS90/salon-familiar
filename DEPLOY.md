# Guía de Deploy - Control Horario

Esta guía explica cómo desplegar la aplicación en Vercel (frontend) y configurar Supabase (backend).

## 1. Configurar Supabase

### 1.1 Crear Proyecto

1. Ir a [Supabase](https://supabase.com) y crear cuenta/login
2. Click en "New Project"
3. Completar:
   - Nombre del proyecto
   - Contraseña de base de datos
   - Región (elegir la más cercana)
4. Esperar a que se cree el proyecto (2-3 minutos)

### 1.2 Ejecutar Schema SQL

1. En Supabase Dashboard, ir a **SQL Editor**
2. Click en **New Query**
3. Copiar y pegar el contenido completo de `supabase/schema.sql`
4. Click en **Run** (o Ctrl+Enter)
5. Verificar que no hay errores

### 1.3 Desplegar Edge Function

**Opción A: Usando Supabase CLI (Recomendado)**

```bash
# Instalar Supabase CLI
npm install -g supabase

# Login
supabase login

# Link proyecto (obtener project-ref desde Settings > API)
supabase link --project-ref tu-project-ref

# Desplegar función
supabase functions deploy calculate-hours
```

**Opción B: Desde Dashboard**

1. Ir a **Edge Functions** en Supabase Dashboard
2. Click en **Create a new function**
3. Nombre: `calculate-hours`
4. Copiar el contenido de `supabase/functions/calculate-hours/index.ts`
5. Click en **Deploy**

### 1.4 Obtener Credenciales

1. Ir a **Settings > API**
2. Copiar:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public key** → `VITE_SUPABASE_ANON_KEY`

## 2. Deploy Frontend en Vercel

### 2.1 Preparar Repositorio

1. Subir código a GitHub/GitLab/Bitbucket
2. Asegurarse de que `.env` está en `.gitignore`

### 2.2 Conectar con Vercel

1. Ir a [Vercel](https://vercel.com) y crear cuenta/login
2. Click en **Add New Project**
3. Importar tu repositorio
4. Configurar:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (raíz del proyecto)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 2.3 Configurar Variables de Entorno

En Vercel, antes de hacer deploy:

1. Ir a **Settings > Environment Variables**
2. Agregar:
   - `VITE_SUPABASE_URL` = tu Project URL de Supabase
   - `VITE_SUPABASE_ANON_KEY` = tu anon key de Supabase
3. Aplicar a: **Production, Preview, Development**

### 2.4 Deploy

1. Click en **Deploy**
2. Esperar a que termine el build
3. Verificar que el deploy fue exitoso

## 3. Configuración Post-Deploy

### 3.1 Crear Primer Usuario

1. Ir a Supabase Dashboard > **Authentication > Users**
2. Click en **Add User**
3. Completar email y password
4. Copiar el **User UID**

5. Ir a **SQL Editor** y ejecutar:
```sql
INSERT INTO profiles (user_id, role)
VALUES ('user-uid-copiado', 'SUPER_ADMIN');
```

### 3.2 Verificar RLS

1. En Supabase, ir a **Authentication > Policies**
2. Verificar que las políticas RLS están activas
3. Probar login desde la aplicación desplegada

### 3.3 Configurar Dominio (Opcional)

1. En Vercel, ir a **Settings > Domains**
2. Agregar tu dominio personalizado
3. Configurar DNS según instrucciones de Vercel

## 4. Verificación

### Checklist Pre-Producción

- [ ] Schema SQL ejecutado sin errores
- [ ] Edge Function desplegada
- [ ] Variables de entorno configuradas en Vercel
- [ ] Primer usuario SUPER_ADMIN creado
- [ ] Login funciona correctamente
- [ ] RLS policies activas
- [ ] Deploy de Vercel exitoso
- [ ] Aplicación accesible en URL de Vercel

### Pruebas Post-Deploy

1. **Login**: Verificar que puedes iniciar sesión
2. **Fichajes**: Crear un fichaje de prueba
3. **Roles**: Verificar permisos según rol
4. **Export**: Probar exportación XLSX
5. **Cálculo de Horas**: Verificar Edge Function

## 5. Troubleshooting Deploy

### Error: "Missing Supabase environment variables"
- Verificar que las variables están en Vercel
- Reiniciar el deploy

### Error: "Function not found"
- Verificar que la Edge Function está desplegada
- Revisar nombre de la función (debe ser `calculate-hours`)

### Error: "RLS policy violation"
- Verificar que el schema SQL se ejecutó completo
- Revisar políticas en Supabase Dashboard

### Build falla en Vercel
- Verificar que `package.json` tiene todos los scripts
- Revisar logs de build en Vercel
- Asegurarse de que TypeScript compila sin errores

## 6. Actualizaciones Futuras

### Actualizar Código

1. Hacer cambios en local
2. Commit y push a GitHub
3. Vercel desplegará automáticamente

### Actualizar Edge Function

```bash
# Desde local
supabase functions deploy calculate-hours
```

### Actualizar Schema

1. Modificar `supabase/schema.sql`
2. Ejecutar cambios en Supabase SQL Editor
3. Documentar cambios en README

## 7. Monitoreo

### Vercel Analytics

- Activar en Vercel Dashboard > Analytics
- Ver métricas de rendimiento

### Supabase Logs

- Ir a **Logs** en Supabase Dashboard
- Revisar errores de API y Edge Functions

## 8. Backup

### Base de Datos

1. En Supabase, ir a **Settings > Database**
2. Click en **Backups** para ver backups automáticos
3. O usar **Database > Backups** para backup manual

### Código

- El código está en Git, así que ya tienes backup
- Considerar tags/releases para versiones importantes

## Soporte

Para problemas específicos:
- Supabase: [Documentación](https://supabase.com/docs)
- Vercel: [Documentación](https://vercel.com/docs)
- React: [Documentación](https://react.dev)

