-- Tabla de perfiles de usuario
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'USER' CHECK (role IN ('USER', 'ADMIN', 'SUPER_ADMIN')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de fichajes
CREATE TABLE IF NOT EXISTS fichajes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL CHECK (tipo IN ('ENTRADA', 'SALIDA', 'PAUSA', 'DESCANSO')),
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  ended_at TIMESTAMP WITH TIME ZONE,
  nota TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_fichajes_user_id ON fichajes(user_id);
CREATE INDEX IF NOT EXISTS idx_fichajes_started_at ON fichajes(started_at);
CREATE INDEX IF NOT EXISTS idx_fichajes_tipo ON fichajes(tipo);
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_fichajes_updated_at
  BEFORE UPDATE ON fichajes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Función helper para obtener el rol del usuario actual (bypass RLS)
CREATE OR REPLACE FUNCTION get_user_role(user_uuid UUID)
RETURNS TEXT AS $$
  SELECT role FROM profiles WHERE user_id = user_uuid;
$$ LANGUAGE sql SECURITY DEFINER;

-- Función helper para verificar si el usuario actual es ADMIN o SUPER_ADMIN (bypass RLS)
CREATE OR REPLACE FUNCTION is_admin_or_super_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('ADMIN', 'SUPER_ADMIN')
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Función helper para verificar si el usuario actual es SUPER_ADMIN (bypass RLS)
CREATE OR REPLACE FUNCTION is_super_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles 
    WHERE user_id = auth.uid() 
    AND role = 'SUPER_ADMIN'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Función trigger para prevenir que usuarios cambien su propio rol
CREATE OR REPLACE FUNCTION prevent_role_self_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Si el usuario está intentando cambiar su propio rol y no es SUPER_ADMIN
  IF OLD.user_id = auth.uid() AND OLD.role != NEW.role THEN
    -- Verificar si el usuario es SUPER_ADMIN usando la función helper
    IF NOT is_super_admin() THEN
      RAISE EXCEPTION 'Los usuarios no pueden cambiar su propio rol';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para prevenir cambio de rol propio
CREATE TRIGGER prevent_role_self_change_trigger
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION prevent_role_self_change();

-- Habilitar RLS en ambas tablas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE fichajes ENABLE ROW LEVEL SECURITY;

-- ============================================
-- POLÍTICAS RLS PARA PROFILES
-- ============================================

-- Los usuarios pueden ver su propio perfil
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = user_id);

-- Los usuarios pueden actualizar su propio perfil (excepto rol)
-- Nota: La validación de que no pueden cambiar su rol se maneja en la aplicación
-- o mediante un trigger separado si es necesario
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ADMIN y SUPER_ADMIN pueden ver todos los perfiles
CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (is_admin_or_super_admin());

-- ADMIN y SUPER_ADMIN pueden crear usuarios (insertar perfiles)
CREATE POLICY "Admins can create profiles"
  ON profiles FOR INSERT
  WITH CHECK (is_admin_or_super_admin());

-- Solo SUPER_ADMIN puede cambiar roles
CREATE POLICY "Super admin can update roles"
  ON profiles FOR UPDATE
  USING (is_super_admin())
  WITH CHECK (is_super_admin());

-- ============================================
-- POLÍTICAS RLS PARA FICHAJES
-- ============================================

-- Los usuarios pueden ver solo sus propios fichajes
CREATE POLICY "Users can view own fichajes"
  ON fichajes FOR SELECT
  USING (auth.uid() = user_id);

-- Los usuarios pueden crear sus propios fichajes
CREATE POLICY "Users can create own fichajes"
  ON fichajes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Los usuarios pueden actualizar sus propios fichajes
CREATE POLICY "Users can update own fichajes"
  ON fichajes FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Los usuarios pueden eliminar sus propios fichajes
CREATE POLICY "Users can delete own fichajes"
  ON fichajes FOR DELETE
  USING (auth.uid() = user_id);

-- ADMIN y SUPER_ADMIN pueden ver todos los fichajes
CREATE POLICY "Admins can view all fichajes"
  ON fichajes FOR SELECT
  USING (is_admin_or_super_admin());

-- ADMIN y SUPER_ADMIN pueden crear fichajes para cualquier usuario
CREATE POLICY "Admins can create fichajes"
  ON fichajes FOR INSERT
  WITH CHECK (is_admin_or_super_admin());

-- ADMIN y SUPER_ADMIN pueden actualizar cualquier fichaje
CREATE POLICY "Admins can update fichajes"
  ON fichajes FOR UPDATE
  USING (is_admin_or_super_admin())
  WITH CHECK (is_admin_or_super_admin());

-- ADMIN y SUPER_ADMIN pueden eliminar cualquier fichaje
CREATE POLICY "Admins can delete fichajes"
  ON fichajes FOR DELETE
  USING (is_admin_or_super_admin());

