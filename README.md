# 🌊 Atlántica F.C. — Web Oficial & Pizarra Táctica (`EA Sports FC 27`)

> ***"Donec vincas"*** — *Hasta que venzas.*

Web oficial de **Atlántica F.C.**, club competitivo de **Clubes Pro de EA Sports FC 27**. Diseñada con estética eSports/Ultimate Team usando **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, **GSAP + Lenis** y **Framer Motion**.

---

## 🏆 ¿De qué trata la web?

La plataforma cuenta con dos secciones principales:

1. **El Club (`/`) — Portada y Plantilla Oficial:**
   * **Experiencia inmersiva de estadio:** Un fondo interactivo en `<canvas>` sincronizado con el *scroll* (mediante **GSAP ScrollTrigger** y **Lenis**) que recorre una secuencia de 120 fotogramas desde el túnel de vestuarios hasta el césped.
   * **Nuestra Historia:** Presentación de la identidad, filosofía competitiva y valores del club.
   * **Plantilla Oficial (Estilo Ultimate Team):** Galería interactiva con las 17 cartas oficiales de los jugadores de Atlántica F.C., recortadas en su silueta real con corona dorada e inclinación 3D al mover el ratón.
   * **Comunidad y Competiciones:** Accesos directos a Instagram, canal de Twitch y ligas oficiales donde compite el club.

2. **Pizarra Táctica (`/pizarra`) — Generador de XI Titular:**
   * Herramienta interactiva para armar la alineación de cada jornada o partido, exportarla como cartel oficial de eSports en alta resolución y compartirla al instante con el equipo.

---

## ⚽ ¿Cómo funciona la Pizarra Táctica Interactiva?

* **Selector de Formaciones:** Permite alternar en tiempo real entre **`3-1-4-2`** (formación insignia por defecto), **`3-4-1-2`** (variante con `MCO` en lugar de `MCD`), **`4-3-3`** y **`4-2-3-1`** conservando los jugadores ya colocados sobre el césped.
* **Título de Jornada Editable:** Incluye un campo de texto superior para personalizar el subtítulo del cartel (ej. `"JORNADA 4 vs RIVAL"`).
* **Asignación por Drag & Drop y Toque Táctil (Móvil/PC):**
  * **Arrastrar y soltar (`@dnd-kit`):** Arrastra cualquier jugador desde la convocatoria hacia un puesto del campo, intercambia posiciones entre dos jugadores del césped o devuélvelos al banquillo.
  * **Modo rápido por clic/toque:** Toca una demarcación del campo y luego elige al jugador en el banquillo (o viceversa), ideal para usar desde el móvil.
* **Banquillo Inteligente:** Los **suplentes disponibles** se posicionan siempre en los primeros lugares del banquillo para tenerlos a mano. Cuando un jugador entra al once titular, su carta pasa automáticamente al final del banquillo con el distintivo **`"EN EL 11"`**.
* **Exportación y Compartición Directa (`alineacion-atlantica-fc.png`):**
  * **Compartir en WhatsApp:** En móvil abre directamente la app de WhatsApp con la imagen adjunta; en escritorio copia el cartel al portapapeles y abre WhatsApp Web listo para pegar (`Ctrl + V`).
  * **Compartir en Discord:** Permite pegar la imagen directamente en cualquier canal (`Ctrl + V`), compartir desde el móvil o configurar un **Discord Webhook** (en el icono `⚙️`) para publicar el cartel automáticamente en el servidor del club con un solo clic.
  * **Copiar Imagen / Descargar PNG:** Botones rápidos para copiar el cartel al portapapeles o descargarlo en alta resolución (`pixelRatio: 2`).

---

## 🚀 Comandos Principales

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo (http://localhost:3000)
npm run dev

# Compilar para producción
npm run build

# Extraer los 120 fotogramas .webp desde public/video/estadio.mp4
npm run extract-frames

# Recortar y eliminar el fondo de las cartas de public/cards/*.jpg a .webp transparente
npm run remove-bg
```
