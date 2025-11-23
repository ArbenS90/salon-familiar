# Aplicación de Control Horario

Aplicación web completa para gestión de fichajes (control horario) con roles de usuario, cálculo de horas trabajadas y exportación de datos.

## Stack Tecnológico

- **Frontend**: React 18 + Vite + TypeScript + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + RLS)
- **Deploy**: Vercel (Frontend) + Supabase (Backend)

## Características

- ✅ Autenticación con Supabase Auth (email/password)
- ✅ Sistema de roles: USER, ADMIN, SUPER_ADMIN
- ✅ CRUD completo de fichajes (ENTRADA, SALIDA, PAUSA, DESCANSO)
- ✅ Cálculo de horas trabajadas por día/semana/mes
- ✅ Exportación a XLSX
- ✅ Row Level Security (RLS) en Supabase
- ✅ UI responsive con Tailwind CSS

## Requisitos Previos

- Node.js 18+ y npm
- Cuenta de Supabase
- Cuenta de Vercel (para deploy)

## Instalación Local

1. **Clonar el repositorio**
```bash
git clone <repo-url>
cd control-horario
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
```

Editar `.env` y agregar tus credenciales de Supabase:
```
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_anon_key_de_supabase
```

4. **Configurar Supabase**

   a. Crear un nuevo proyecto en [Supabase](https://supabase.com)
   
   b. Ir a SQL Editor y ejecutar el contenido de `supabase/schema.sql`
   
   c. Desplegar la Edge Function `calculate-hours`:
   ```bash
   # Instalar Supabase CLI si no lo tienes
   npm install -g supabase
   
   # Login en Supabase
   supabase login
   
   # Link tu proyecto
   supabase link --project-ref tu-project-ref
   
   # Desplegar Edge Function
   supabase functions deploy calculate-hours
   ```

5. **Ejecutar en desarrollo**
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## Estructura del Proyecto

```
src/
├── components/        # Componentes React
│   ├── auth/         # Login y Register
│   ├── dashboard/    # Dashboards por rol
│   ├── fichajes/     # Componentes de fichajes
│   ├── users/        # Gestión de usuarios
│   ├── export/       # Exportación de datos
│   └── layout/       # Header y ProtectedRoute
├── hooks/            # Custom hooks
├── services/         # Servicios de API
├── types/            # Tipos TypeScript
└── utils/            # Utilidades

supabase/
├── schema.sql        # Esquema de base de datos + RLS
├── seed.sql          # Datos de ejemplo
└── functions/        # Edge Functions
    └── calculate-hours/
```

## Roles y Permisos

### USER
- Ver y gestionar solo sus propios fichajes
- Calcular sus horas trabajadas
- Exportar sus fichajes

### ADMIN
- Todo lo de USER
- Ver todos los fichajes
- Crear nuevos usuarios
- Exportar todos los fichajes

### SUPER_ADMIN
- Todo lo de ADMIN
- Cambiar roles de usuarios (promover/degradar)
- Gestión completa del sistema

## Uso

### Crear Primer Usuario

1. Ejecutar el schema SQL en Supabase
2. Crear un usuario manualmente desde Supabase Dashboard (Authentication > Users > Add User)
3. Ejecutar este SQL para asignar rol SUPER_ADMIN:
```sql
INSERT INTO profiles (user_id, role)
VALUES ('user-uuid-aqui', 'SUPER_ADMIN');
```

### Crear Fichajes

1. Iniciar sesión
2. Ir a Dashboard
3. Click en "Nuevo Fichaje"
4. Seleccionar tipo (ENTRADA, SALIDA, PAUSA, DESCANSO)
5. Configurar fecha/hora y nota opcional

### Calcular Horas

1. En el Dashboard, seleccionar período (Día/Semana/Mes)
2. Click en "Calcular"
3. Ver resultado con horas trabajadas

### Exportar Datos

1. Click en botón de exportación
2. Seleccionar opción:
   - Exportar Todo
   - Exportar Hoy/Semana/Mes
   - Rango Personalizado
3. Se descargará archivo XLSX

## Scripts Disponibles

- `npm run dev` - Iniciar servidor de desarrollo
- `npm run build` - Construir para producción
- `npm run preview` - Previsualizar build de producción
- `npm run lint` - Ejecutar linter

## Deploy

Ver `DEPLOY.md` para instrucciones detalladas de deploy en Vercel y Supabase.

## Testing

### Usuarios de Ejemplo

Después de crear usuarios en Supabase, puedes usar estos roles para pruebas:

1. **SUPER_ADMIN**: Acceso completo, puede cambiar roles
2. **ADMIN**: Puede crear usuarios y ver todos los fichajes
3. **USER**: Solo ve y gestiona sus fichajes

### Pruebas con curl

```bash
# Login (obtener token)
curl -X POST 'https://tu-proyecto.supabase.co/auth/v1/token?grant_type=password' \
  -H "apikey: tu_anon_key" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Obtener fichajes (usar token del login)
curl 'https://tu-proyecto.supabase.co/rest/v1/fichajes' \
  -H "apikey: tu_anon_key" \
  -H "Authorization: Bearer tu_token"
```

## Troubleshooting

### Error: "Missing Supabase environment variables"
- Verificar que `.env` existe y tiene las variables correctas
- Reiniciar el servidor de desarrollo

### Error: "Profile not found"
- Verificar que el usuario tiene un registro en la tabla `profiles`
- Ejecutar el schema SQL completo

### Edge Function no funciona
- Verificar que la función está desplegada: `supabase functions list`
- Verificar permisos RLS en la función

## Licencia

MIT

