# 🚀 Guía de Despliegue Rápido (StandMX / PuestoWeb)

Ya hemos completado los Sprints 1, 2, 3 y gran parte del 4. El código está listo para ser publicado. Sigue estos pasos para subirlo a GitHub y desplegarlo en Vercel.

## 1. Subir a GitHub
Ya inicialicé el repositorio y creé el primer commit. Solo necesitas conectarlo a tu cuenta:

1.  Crea un nuevo repositorio en GitHub (vacío, sin README ni .gitignore).
2.  Copia la URL del repositorio (Ej: `https://github.com/tu-usuario/saas.git`).
3.  Abre una terminal en la carpeta del proyecto y ejecuta:
    ```powershell
    git remote add origin https://github.com/tu-usuario/saas.git
    git branch -M main
    git push -u origin main
    ```

## 2. Desplegar en Vercel
Vercel es la mejor opción para Next.js. Es gratis para proyectos personales.

1.  Ve a [Vercel.com](https://vercel.com) e inicia sesión con tu cuenta de GitHub.
2.  Haz clic en **"Add New"** > **"Project"**.
3.  Importa el repositorio `saas` que acabas de subir.
4.  **IMPORTANTE (Variables de Entorno):** En la sección "Environment Variables", debes añadir las de Supabase:
    *   `NEXT_PUBLIC_SUPABASE_URL`: (Tu URL de Supabase)
    *   `NEXT_PUBLIC_SUPABASE_ANON_KEY`: (Tu Anon Key)
5.  Haz clic en **Deploy**.

## 3. Configuración de Subdominios (Wildcard)
Para que funcionen los subdominios (`empresa.standmx.com`):

1.  En Vercel, ve a **Settings** > **Domains**.
2.  Añade tu dominio principal (Ej: `standmx.com`).
3.  Añade un dominio tipo comodín: `*.standmx.com`.
4.  Apunta los registros CNAME en tu proveedor de dominio (GoDaddy, Namecheap, etc.) hacia Vercel (`cname.vercel-dns.com`).

---

### Resumen de Funcionalidades Listas:
*   ✅ **Multi-tenant:** Soporte para subdominios ilimitados.
*   ✅ **Auth Real:** Login/Registro con protección de panel.
*   ✅ **Dashboard No-Code:** Editor en vivo con previsualización.
*   ✅ **QR Inteligente:** Generación y Redirección dinámica.
*   ✅ **Analíticas Live:** Tracking de visitas por país y dispositivo.

¡Buen viaje! Si necesitas cualquier ajuste al volver, aquí estaré. ✈️
