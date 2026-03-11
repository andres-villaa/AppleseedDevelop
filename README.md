# Appleseed - Plataforma de Gestión para Organizaciones de la Sociedad Civil (OSC)

Appleseed es una aplicación web diseñada para facilitar la administración, el cumplimiento normativo y el seguimiento de donaciones para las Organizaciones de la Sociedad Civil en México. Permite a las OSC llevar un registro detallado de su información legal, donantes, donaciones, gastos y alertas de cumplimiento relacionadas con requerimientos de Prevención de Lavado de Dinero (PLD) ante el SAT y la SHCP.

## 🚀 Tecnologías Principales

El proyecto está construido con un stack moderno enfocado en la velocidad, seguridad y experiencia de usuario:

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router) y [React 19](https://react.dev/)
- **Base de Datos & Autenticación**: [Supabase](https://supabase.com/) (PostgreSQL + Auth)
- **Estilos**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Componentes UI**: [shadcn/ui](https://ui.shadcn.com/) (basados en [Radix UI](https://www.radix-ui.com/))
- **Formularios**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) para validación
- **Iconografía**: [Lucide React](https://lucide.dev/)
- **Gráficos**: [Recharts](https://recharts.org/)
- **Lenguaje**: [TypeScript](https://www.typescriptlang.org/)

## 🛠 Instalación y Configuración Local

Sigue estos pasos para correr el proyecto en tu máquina local:

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd AppleseedDevelop
```

### 2. Instalar dependencias

Asegúrate de tener [Node.js](https://nodejs.org/) instalado. Luego ejecuta:

```bash
npm install
# o con yarn
yarn install
```

### 3. Configurar variables de entorno

Debes conectar tu proyecto a una base de datos local o remota de Supabase. Crea un archivo `.env.local` en la raíz del proyecto tomando como referencia las credenciales de tu proyecto de Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<tu-id-de-proyecto>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<tu-anon-key-publica>
```

> **Nota:** La información de base de datos se maneja del lado del servidor. Las variables que empiezan con `NEXT_PUBLIC_` están expuestas de manera segura al cliente.

### 4. Configurar la Base de Datos (Supabase)

El proyecto incluye scripts SQL iniciales en la raíz para preparar la base de datos:
- `Appleseed.sql`: Estructura base.
- `seed_data.sql`: Datos de prueba (opcional).
- `enable_rls.sql` y `rls_policies.sql`: Políticas de seguridad de nivel de fila (RLS).

Debes ejecutar estos scripts en el **SQL Editor** de tu panel de control de Supabase.

### 5. Iniciar el servidor de desarrollo

```bash
npm run dev
# o con yarn
yarn dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver la aplicación.

## 🌟 Características Principales

1. **Dashboard Financiero**: Visualización de donaciones, gastos y alertas críticas del sistema en gráficas dinámicas.
2. **Gestión de Perfil OSC**: Control detallado de la información legal de la organización (RFC, CLUNI, Fecha de constitución, Misión, etc.).
3. **Padrón de Donantes**: Registro de donantes físicos y morales, incluyendo control de expedientes completos, incompletos, en revisión y revisión de PEPs (Personas Expuestas Políticamente).
4. **Registro de Donaciones**: Carga de donativos recibidos, cálculo transparente en UMAs (Unidad de Medida y Actualización) y automatización de alertas por volumen.
5. **Control de Cumplimiento (PLD)**: Generación automática de alertas de "Umbral de Identificación" y avisos de requerimientos de envío al SAT/SHCP basados en reglas oficiales.
6. **Seguridad Integrada**: Autenticación segura de usuarios mediante Supabase Auth y validación de sesiones.

## 📁 Estructura del Proyecto

* `app/`: Contiene todas las rutas de la aplicación usando el Next.js App Router (Páginas, layouts, rutas de API).
* `components/`: Componentes reutilizables de UI (Shadcn/UI, cabeceras, tablas de datos).
* `lib/`: Configuraciones core (Instancias de cliente/servidor de Supabase, esquemas base).
* `hooks/`: Custom React Hooks.
* `public/`: Assets estáticos (imágenes, fuentes).

## 📄 Licencia

Este proyecto está restringido para el uso de la organización interna. Todos los derechos reservados.
