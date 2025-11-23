-- Script de seed para datos de ejemplo
-- NOTA: Este script asume que ya existen usuarios en auth.users
-- Los usuarios deben crearse primero desde la aplicación o desde Supabase Auth

-- Ejemplo de inserción de perfiles (ajustar user_id según tus usuarios reales)
-- INSERT INTO profiles (user_id, role) VALUES
--   ('user-uuid-1', 'SUPER_ADMIN'),
--   ('user-uuid-2', 'ADMIN'),
--   ('user-uuid-3', 'USER');

-- Ejemplo de fichajes de prueba (ajustar user_id según tus usuarios reales)
-- INSERT INTO fichajes (user_id, tipo, started_at, ended_at, nota) VALUES
--   ('user-uuid-3', 'ENTRADA', NOW() - INTERVAL '8 hours', NULL, 'Inicio de jornada'),
--   ('user-uuid-3', 'PAUSA', NOW() - INTERVAL '4 hours', NOW() - INTERVAL '3 hours 30 minutes', 'Pausa comida'),
--   ('user-uuid-3', 'SALIDA', NOW() - INTERVAL '30 minutes', NULL, 'Fin de jornada');

