# 🚀 Roadmap de Avance: Ecosistema Digital SaaS (StandMX & PuestoWeb)

Este documento detalla el progreso actual del proyecto basado en el PRD original y los hitos técnicos alcanzados hasta el momento.

## 📊 Estado General de Fases
- **Sprint 1 (Core & Enrutamiento):** 100% ✅
- **Sprint 2 (vCard MVP & Editor):** 100% ✅ 
- **Sprint 3 (Autenticación & WhatsApp):** 100% ✅ 
- **Sprint 4 (Analytics & GitHub):** 85% ✅ (Publicado en GitHub, Analytics UI lista)

---

## 🛠️ Desglose Detallado

### ✅ Sprint 1: Core de Usuarios & Lógica de Redirección
*   **Lógica de Enrutamiento (proxy.ts):** Resolución dinámica de subdominios (`slug.localhost`), dominios propios y hashes. [Completado]
*   **Arquitectura Multi-tenant:** Motor capaz de servir múltiples clientes desde una sola instancia de Next.js. [Completado]
*   **Base de Datos (Supabase):** Esquema de tablas `profiles`, `microsites`, `qr_codes` y `qr_analytics` creados y vinculados. [Completado]

### ✅ Sprint 2: Constructor No-Code (Dashboard Editor)
*   **Editor en Vivo:** Interfaz reactiva con previsualización en tiempo real dentro de un mockup de iPhone 16. [Completado]
*   **Sincronización Supabase:** Hook `useMicrosite` para guardar y cargar cambios directamente de la DB. [Completado]
*   **Generador de QR Vectorial:** Herramienta integrada para descargar QRs únicos para cada micrositio. [Completado]
*   **Seguridad RLS (Row Level Security):** Políticas de base de datos para protección de datos por usuario. [Completado]

### ✅ Sprint 3: Autenticación & WhatsApp Checkout
*   **Autenticación Real (Supabase Auth):** Sistema completo de Registro, Login y Protección de Rutas (Bye bye MOCK_USER_ID). [Completado]
*   **Carrito de Compras v1:** Sistema local de selección de productos con cálculo de total. [Completado]
*   **Integración WhatsApp:** Generación automática de mensajes formateados para pedidos rápidos. [Completado]
*   **Redirector Inteligente (API QR):** Endpoint centralizado para rastrear escaneos y redirigir sin romper el código impreso. [Completado]

### ✅ Sprint 4: Automatización & Analíticas (Publicado)
*   **Módulo de Analíticas:** Dashboard visual con gráficas de rendimiento y actividad reciente por país. [Completado]
*   **GitHub Repository:** Proyecto inicializado y publicado en JoseNDRX/saas_srg (main). [Completado]
*   **Módulo de Publicación:** Guía de despliegue `DEPLOYMENT.md` creada para Vercel. [Completado]
*   **Provisionamiento SSL:** Automatización de certificados para dominios Elite. [Pendiente Infra]

---

## ⚠️ Bloqueadores / Tareas Pendientes Inmediatas (Backlog)
1.  **Deploy a Cloud Run / Vercel:** Finalizar la carga de variables de entorno en producción.
2.  **Refactor de Estilos:** Pequeñas correcciones de estética en la landing page.
3.  **Dominios Custom:** Implementar la lógica de mapeo DNS para el Tier Elite.

---

*Última actualización: 28 de Marzo, 2026 (14:00)*
