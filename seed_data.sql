-- ==============================================================================
-- SCRIPT DE DATOS DE PRUEBA (SEED DATA)
-- Copia y pega esto en el SQL Editor de Supabase y ejecútalo (Botón "Run")
-- ==============================================================================

-- 1. Limpiar datos existentes (Opcional, pero recomendado si ya habías insertado algo)
DELETE FROM "Documentos_Donantes";
DELETE FROM "Documentos_Org";
DELETE FROM "Alertas_Cumplimiento";
DELETE FROM "Gastos";
DELETE FROM "Donaciones";
DELETE FROM "Donantes";
DELETE FROM "Organizaciones";

-- ==============================================================================
-- 2. Insertar Organizaciones
-- ==============================================================================
INSERT INTO "Organizaciones" (org_id, nombre, razon_social, rfc, cluni, email, contrasena, created_at) VALUES
('11111111-1111-1111-1111-111111111111', 'Fundación Appleseed', 'Fundación Appleseed México A.C.', 'FAM123456789', 'CLUNI12345', 'contacto@appleseed.org.mx', 'hashed_password_1', '2020-03-01');

-- ==============================================================================
-- 3. Insertar Donantes
-- ==============================================================================
INSERT INTO "Donantes" (donante_id, org_id, tipo_persona, nombre_razon_social, rfc, curp, regimen_fiscal, codigo_postal, direccion, email, actividad_economica, es_pep, estatus_expediente, donacion_acumulada) VALUES
('c86448fb-429f-4318-aff5-40e15babbd96', '11111111-1111-1111-1111-111111111111', 'moral', 'Inversiones del Norte S.A.', 'INO850101AAA', NULL, '601 - General de Ley Personas Morales', '64000', 'Av. Constitución 100, Monterrey, NL', 'contacto@inversionesdelnorte.mx', 'Servicios financieros', false, 'completo', 250000.00),
('658b11c9-52e9-4e5c-a576-6baef0e44505', '11111111-1111-1111-1111-111111111111', 'fisica', 'Carlos Mendez Rodriguez', 'MERC890523BB1', 'MERC890523HNLNRL09', '605 - Sueldos y Salarios', '06600', 'Calle Reforma 45, CDMX', 'carlos.mendez@email.com', 'Empleado sector privado', false, 'completo', 48500.00),
('44917cc1-9bfe-4c63-af50-5ab5acdb7eb2', '11111111-1111-1111-1111-111111111111', 'moral', 'Global Trading S.A. de C.V.', 'GTS910301CC2', NULL, '601 - General de Ley Personas Morales', '11000', 'Paseo de la Reforma 250, CDMX', 'finanzas@globaltrading.mx', 'Comercio internacional', false, 'en_revision', 980000.00),
('ef727ad9-caeb-452f-85f7-3367b458ab93', '11111111-1111-1111-1111-111111111111', 'fisica', 'Maria Fernanda Lopez', 'LOFM920715DD3', 'LOFM920715MOCRPR05', '612 - Personas Fisicas con Actividades Empresariales', '68000', 'Calle Macedonio Alcalá 30, Oaxaca', 'mflopez@gmail.com', 'Comercio al por menor', false, 'completo', 15200.00),
('5693b4e7-4bba-4e94-8ce3-b1d5d14dfc73', '11111111-1111-1111-1111-111111111111', 'moral', 'Tech Solutions Mexico', 'TSM880920EE4', NULL, '601 - General de Ley Personas Morales', '44100', 'Av. López Mateos 1500, Guadalajara, JAL', 'donaciones@techsolutions.mx', 'Tecnología y software', false, 'completo', 120000.00),
('09add696-eed6-42c2-8086-538ca2790ac3', '11111111-1111-1111-1111-111111111111', 'fisica', 'Roberto Sanchez Diaz', 'SADR770412FF5', 'SADR770412HDFNCB02', '605 - Sueldos y Salarios', '83000', 'Blvd. Rodolfo Elías Calles 120, Hermosillo, SON', 'roberto.sanchez@email.com', 'Servidor público', true, 'en_revision', 75000.00);

-- ==============================================================================
-- 4. Insertar Donaciones
-- ==============================================================================
-- Eliminado uma_id y sus referencias
INSERT INTO "Donaciones" (donante_id, org_id, monto, fecha, metodo_pago, valor_uma_aplicado, requiere_reporte_pld, reportada_pld, fecha_reporte_pld, reportada_sat) VALUES
('c86448fb-429f-4318-aff5-40e15babbd96', '11111111-1111-1111-1111-111111111111', 80000.00, '2026-01-15', 'transferencia', 117.31, true, true, '2026-01-20', false),
('c86448fb-429f-4318-aff5-40e15babbd96', '11111111-1111-1111-1111-111111111111', 170000.00, '2026-02-01', 'transferencia', 117.31, true, false, NULL, false),
('658b11c9-52e9-4e5c-a576-6baef0e44505', '11111111-1111-1111-1111-111111111111', 12000.00, '2026-01-08', 'transferencia', 117.31, false, false, NULL, false),
('44917cc1-9bfe-4c63-af50-5ab5acdb7eb2', '11111111-1111-1111-1111-111111111111', 350000.00, '2026-01-10', 'cheque', 117.31, true, true, '2026-01-18', true),
('44917cc1-9bfe-4c63-af50-5ab5acdb7eb2', '11111111-1111-1111-1111-111111111111', 630000.00, '2026-02-05', 'transferencia', 117.31, true, false, NULL, false),
('ef727ad9-caeb-452f-85f7-3367b458ab93', '11111111-1111-1111-1111-111111111111', 8500.00, '2026-01-20', 'efectivo', 117.31, false, false, NULL, false),
('5693b4e7-4bba-4e94-8ce3-b1d5d14dfc73', '11111111-1111-1111-1111-111111111111', 120000.00, '2026-01-28', 'transferencia', 117.31, true, true, '2026-02-03', true),
('09add696-eed6-42c2-8086-538ca2790ac3', '11111111-1111-1111-1111-111111111111', 75000.00, '2026-02-10', 'transferencia', 117.31, true, false, NULL, false);

-- ==============================================================================
-- 5. Insertar Gastos
-- ==============================================================================
INSERT INTO "Gastos" (org_id, categoria, concepto, monto, rfc_proveedor, fecha) VALUES
('11111111-1111-1111-1111-111111111111', 'Renta', 'Renta de oficina — Enero 2026', 18500.00, 'INMO800101XYZ', '2026-01-31'),
('11111111-1111-1111-1111-111111111111', 'Nómina', 'Nómina personal operativo — Enero 2026', 45000.00, 'FES200301ABC', '2026-01-31'),
('11111111-1111-1111-1111-111111111111', 'Servicios', 'Servicio de internet y telefonía', 3200.00, 'AMX870707JA0', '2026-01-05'),
('11111111-1111-1111-1111-111111111111', 'Materiales', 'Material didáctico para talleres', 9800.00, 'OFF900601GHI', '2026-01-18'),
('11111111-1111-1111-1111-111111111111', 'Viáticos', 'Viáticos visita comunidades', 7400.00, 'VIATCO1234F', '2026-02-10'),
('11111111-1111-1111-1111-111111111111', 'Servicios', 'Auditoría externa anual', 22000.00, 'GOCA750312MNO', '2026-02-20');

-- ==============================================================================
-- 6. Insertar Alertas de Cumplimiento
-- ==============================================================================
INSERT INTO "Alertas_Cumplimiento" (organizacion_id, titulo, mensaje, tipo_alerta, atendida, created_at) VALUES
('11111111-1111-1111-1111-111111111111', 'Donación inusual detectada', 'Múltiples donaciones por montos altos. Se requiere reporte a la SHCP.', 'donacion_inusual', false, '2026-02-18'),
('11111111-1111-1111-1111-111111111111', 'Documento de expediente vencido', 'La identificación oficial presentada tiene una vigencia expirada.', 'documento_vencido', false, '2026-02-17'),
('11111111-1111-1111-1111-111111111111', 'Donante clasificado como PEP', 'El donante presenta coincidencia con la lista PEP. Se requiere diligencia debida reforzada.', 'pep', false, '2026-02-16');

-- ==============================================================================
-- 7. Insertar Documentos Org
-- ==============================================================================
INSERT INTO "Documentos_Org" (org_id, titulo, tipo_archivo, ruta_archivo, fecha_subida, fecha_vencimiento, numero_operacion_sat, uuid_fiscal) VALUES
('11111111-1111-1111-1111-111111111111', 'Acta Constitutiva', 'Legal', '/docs/acta.pdf', '2025-12-15', '2030-12-15', NULL, NULL),
('11111111-1111-1111-1111-111111111111', 'Constancia de Situación Fiscal', 'Fiscal', '/docs/csf.pdf', '2026-01-10', '2026-12-31', 'OP-2025-001', NULL),
('11111111-1111-1111-1111-111111111111', 'CLUNI — Registro RFOSC', 'Legal', '/docs/cluni.pdf', '2020-03-01', '2027-03-01', NULL, NULL);

-- ==============================================================================
-- 8. Insertar Documentos Donantes
-- ==============================================================================
INSERT INTO "Documentos_Donantes" (org_id, donante_id, tipo_documento, ruta_archivo, fecha_subida, fecha_vencimiento) VALUES
('11111111-1111-1111-1111-111111111111', 'c86448fb-429f-4318-aff5-40e15babbd96', 'Identificación Oficial', '/docs/id-001.pdf', '2025-12-15', '2027-05-01'),
('11111111-1111-1111-1111-111111111111', '658b11c9-52e9-4e5c-a576-6baef0e44505', 'Comprobante de Domicilio', '/docs/dom-002.pdf', '2025-12-18', '2026-03-18'),
('11111111-1111-1111-1111-111111111111', '09add696-eed6-42c2-8086-538ca2790ac3', 'Declaración de PEP', '/docs/pep-006.pdf', '2026-02-01', '2027-02-01');

