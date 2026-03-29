# 🚀 Roadmap de Avance: Ecosistema Digital SaaS (StandMX & PuestoWeb)

Este documento detalla el progreso actual del proyecto basado en el PRD original y los hitos técnicos alcanzados hasta el momento.

## 📊 Estado General de Fases
- **Sprint 1 (Core & Enrutamiento):** 100% ✅
- **Sprint 2 (vCard MVP & Editor):** 100% ✅ 
- **Sprint 3 (Autenticación & WhatsApp):** 100% ✅ 
- **Sprint 4 (Showcase & Publicación):** 95% 🚧 (Constructor de Galería listo, Ngrok implementado)
- **Sprint 5 (PWA & SEO):** 15% 🚧 (Pendiente Manifest, Icons y OG Tags dinámicos)

---

## 🛠️ Desglose Detallado

### ✅ Sprint 1: Core de Usuarios & Lógica de Redirección
*   **Lógica de Enrutamiento (proxy.ts):** Resolución dinámica de subdominios (`slug.localhost`), dominios propios y túneles ngrok. [Completado]
*   **Arquitectura Multi-tenant:** Motor capaz de servir múltiples clientes desde una sola instancia de Next.js. [Completado]
*   **Base de Datos (Supabase):** Esquema de tablas `profiles`, `microsites`, `qr_codes` y `qr_analytics` creados y vinculados. [Completado]

### ✅ Sprint 2: Constructor No-Code (Dashboard Editor)
*   **Editor en Vivo:** Interfaz reactiva con previsualización en tiempo real dentro de un mockup de iPhone 16. [Completado]
*   **Sincronización Supabase:** Hook `useMicrosite` para guardar y cargar cambios directamente de la DB. [Completado]
*   **Generador de QR Vectorial:** Herramienta integrada para descargar QRs únicos para cada micrositio. [Completado]
*   **Seguridad RLS (Row Level Security):** Políticas de base de datos para protección de datos por usuario. [Completado]

### ✅ Sprint 3: Autenticación & WhatsApp Checkout
*   **Autenticación Real (Supabase Auth):** Sistema completo de Registro, Login y Protección de Rutas. [Completado]
*   **Carrito de Compras v1:** Sistema local de selección de productos con cálculo de total. [Completado]
*   **Integración WhatsApp:** Generación automática de mensajes formateados para pedidos rápidos. [Completado]
*   **Redirector Inteligente (API QR):** Endpoint centralizado para rastrear escaneos y redirigir sin romper el código impreso. [Completado]

### ✅ Sprint 4: Showcase & Exposure
*   **Módulo Showcase:** Galería de proyectos con soporte para **subida directa de archivos** a Supabase Storage (`microsite-images`). [Completado]
*   **Página de Contacto:** Formulario de solicitud integrado con links directos a email, WhatsApp y teléfono. [Completado]
*   **Exposición MVP (Ngrok):** Configuración de authtoken y túnel para pruebas externas en tiempo real. [Completado]
*   **Módulo de Analíticas:** Dashboard visual con gráficas de rendimiento y actividad reciente por país. [Completado]

---

## ⚠️ Bloqueadores / Tareas Pendientes Inmediatas (Backlog)

1.  **⚙️ PWA Engine**: Crear `manifest.json`, generar iconos de marca (192x192, 512x512) y registrar el service worker para modo App.
2.  **🖼️ Dynamic OG Tags**: Configurar `generateMetadata` para usar el logo de la empresa o una imagen del proyecto en la previsualización de links (WhatsApp Shared).
3.  **📧 Backend de Contacto**: Conectar el formulario de la página de contacto a un servicio de envío de correos (Resend/SendGrid).
4.  **🌐 Dominios Custom (Elite)**: Implementar la validación y mapeo de CNAMEs para dominios externos que apunten al túnel/servidor.

---

*Última actualización: 29 de Marzo, 2026 (10:25 AM)*
