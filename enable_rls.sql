-- Habilitar Row Level Security (RLS) para todas las tablas
ALTER TABLE "Organizaciones" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Donantes" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Donaciones" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Gastos" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Documentos_Org" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Documentos_Donantes" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Alertas_Cumplimiento" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Configuracion_UMA" ENABLE ROW LEVEL SECURITY;

-- IMPORTANTE: Al habilitar RLS, por defecto NADIE (excepto el rol de servicio o administradores)
-- podrá leer, insertar, actualizar o borrar datos desde una aplicación (API anon/authenticated).
-- Para poder interactuar con los datos desde tu app web, necesitarás crear "Políticas" (Policies).

-- Aquí tienes un ejemplo de política hiper-permisiva para entorno de desarrollo local 
-- (Si estás en producción, DEBES cambiarla para validar roles o IDs):
-- 
-- CREATE POLICY "Permitir todo a todos provisionalmente" 
-- ON "Organizaciones" 
-- FOR ALL 
-- TO public 
-- USING (true) 
-- WITH CHECK (true);
