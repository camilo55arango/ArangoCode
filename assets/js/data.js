

const SOCIALS = {
  github:    'https://github.com/camilo55arango',
  x:         'https://x.com/Soy_Breve',
  instagram: 'https://instagram.com/arangoypunto'
};

const LAST_UPDATED = 'septiembre de 2026';
const ISSUES_URL = 'https://github.com/camilo55arango/ArangoCode/issues/new';


const SECTIONS = [
  {
    id: 'dev',
    title: 'Herramientas para desarrollar apps',
    short: 'Herramientas Dev',
    desc: 'Editores, frameworks, bases de datos, testing y despliegue. Todo lo que uso para construir software (sin IA).',
    pageDesc: 'Stack completo para construir, probar y desplegar aplicaciones. Todas las herramientas son de uso profesional y tienen versión gratuita o plan free.',
    grad: 'linear-gradient(135deg, #6d28d9 0%, #7c5cff 45%, #22d3ee 100%)',
    glow: 'rgba(124, 92, 255, .55)',
    icon: '<svg viewBox="0 0 24 24"><path d="M8 17l-5-5 5-5M16 7l5 5-5 5M13.5 4l-3 16"/></svg>'
  },
  {
    id: 'ia',
    title: 'Herramientas IA importantes',
    short: 'Herramientas IA',
    desc: 'Las mejores IA de 2026 para consultas, código, imágenes, video, audio y música.',
    pageDesc: 'Selección de las IA más potentes del momento, organizadas por lo que necesitas hacer: preguntar, programar, crear imágenes, video o música.',
    grad: 'linear-gradient(135deg, #db2777 0%, #f43f8e 45%, #fb923c 100%)',
    glow: 'rgba(244, 63, 142, .55)',
    icon: '<svg viewBox="0 0 24 24"><path d="M12 3a4 4 0 0 0-4 4v1a3 3 0 0 0 0 6v1a4 4 0 0 0 8 0v-1a3 3 0 0 0 0-6V7a4 4 0 0 0-4-4z"/><path d="M12 3v18M5 10H3M21 10h-2M5 15H3M21 15h-2"/></svg>'
  },
  {
    id: 'prompts',
    title: 'Prompts generales para IA',
    short: 'Prompts',
    desc: 'Plantillas largas y listas para copiar: resúmenes, código, imágenes, video, análisis y más.',
    pageDesc: 'Prompts completos y probados. Haz clic en cualquier tarjeta para verlo entero y copiarlo con un botón. Reemplaza los campos entre [corchetes].',
    grad: 'linear-gradient(135deg, #0891b2 0%, #22d3ee 45%, #34d399 100%)',
    glow: 'rgba(34, 211, 238, .55)',
    icon: '<svg viewBox="0 0 24 24"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H18a2 2 0 0 1 2 2v13.5a2.5 2.5 0 0 1-2.5 2.5H6.5A2.5 2.5 0 0 1 4 18.5z"/><path d="M8 8h8M8 12h8M8 16h5"/></svg>'
  }
];


const PALETTE = [
  '#7c5cff', '#22d3ee', '#f43f8e', '#fbbf24', '#34d399',
  '#fb923c', '#a855f7', '#38bdf8', '#f87171', '#4ade80',
  '#e879f9', '#facc15'
];


const DEV_TOOLS = [
  /* --- Editores e IDEs --- */
  { cat: 'Editores e IDEs', name: 'Visual Studio Code', url: 'https://code.visualstudio.com/', desc: 'El editor más usado del mundo. Gratis, multiplataforma y con miles de extensiones para cualquier lenguaje.' },
  { cat: 'Editores e IDEs', name: 'JetBrains IDEs', url: 'https://www.jetbrains.com/', desc: 'IntelliJ, WebStorm, PyCharm y Rider. Refactorización y análisis estático de nivel profesional.' },
  { cat: 'Editores e IDEs', name: 'Zed', url: 'https://zed.dev/', desc: 'Editor escrito en Rust, extremadamente rápido, con edición colaborativa en tiempo real integrada.' },
  { cat: 'Editores e IDEs', name: 'Neovim', url: 'https://neovim.io/', desc: 'Vim moderno con soporte LSP nativo y configuración en Lua. Ideal para trabajar sin salir de la terminal.' },
  { cat: 'Editores e IDEs', name: 'Android Studio', url: 'https://developer.android.com/studio', desc: 'IDE oficial de Google para apps Android: emulador, profiler y diseñador de layouts.' },

  /* --- Control de versiones --- */
  { cat: 'Control de versiones', name: 'Git', url: 'https://git-scm.com/', desc: 'El sistema de control de versiones estándar. Base de absolutamente todo flujo de trabajo moderno.' },
  { cat: 'Control de versiones', name: 'GitHub', url: 'https://github.com/', desc: 'Alojamiento de repositorios, pull requests, issues, Actions y Codespaces en un solo lugar.' },
  { cat: 'Control de versiones', name: 'GitLab', url: 'https://gitlab.com/', desc: 'Alternativa con CI/CD muy potente incluido y opción de instalación auto-hospedada.' },
  { cat: 'Control de versiones', name: 'GitKraken', url: 'https://www.gitkraken.com/', desc: 'Cliente visual de Git. Facilita entender ramas, merges y resolver conflictos sin dolor.' },
  { cat: 'Control de versiones', name: 'Conventional Commits', url: 'https://www.conventionalcommits.org/es/v1.0.0/', desc: 'Convención para escribir mensajes de commit legibles y generar changelogs automáticos.' },

  /* --- Frontend --- */
  { cat: 'Frontend', name: 'React', url: 'https://react.dev/', desc: 'La librería de interfaces más extendida. Enorme ecosistema y demanda laboral.' },
  { cat: 'Frontend', name: 'Next.js', url: 'https://nextjs.org/', desc: 'Framework React con renderizado en servidor, rutas de API y despliegue optimizado.' },
  { cat: 'Frontend', name: 'Vue', url: 'https://vuejs.org/', desc: 'Framework progresivo, con curva de aprendizaje suave y documentación excelente en español.' },
  { cat: 'Frontend', name: 'Svelte / SvelteKit', url: 'https://svelte.dev/', desc: 'Compila a JavaScript puro: menos código, bundles diminutos y rendimiento sobresaliente.' },
  { cat: 'Frontend', name: 'Astro', url: 'https://astro.build/', desc: 'Ideal para sitios de contenido: envía cero JavaScript por defecto y mezcla React, Vue o Svelte.' },
  { cat: 'Frontend', name: 'Vite', url: 'https://vitejs.dev/', desc: 'Servidor de desarrollo instantáneo y build optimizado. Reemplazo moderno de Webpack.' },
  { cat: 'Frontend', name: 'Tailwind CSS', url: 'https://tailwindcss.com/', desc: 'CSS por utilidades. Prototipa interfaces consistentes muy rápido y sin salir del HTML.' },
  { cat: 'Frontend', name: 'TypeScript', url: 'https://www.typescriptlang.org/', desc: 'JavaScript con tipos. Detecta errores antes de ejecutar y mejora el autocompletado.' },

  /* --- Backend y bases de datos --- */
  { cat: 'Backend y BD', name: 'Node.js', url: 'https://nodejs.org/', desc: 'Ejecuta JavaScript en el servidor. Base de la mayoría de herramientas del ecosistema web.' },
  { cat: 'Backend y BD', name: 'NestJS', url: 'https://nestjs.com/', desc: 'Framework backend con arquitectura modular e inyección de dependencias. Muy escalable.' },
  { cat: 'Backend y BD', name: 'PostgreSQL', url: 'https://www.postgresql.org/', desc: 'La base de datos relacional open source más completa: JSON, full-text search y extensiones.' },
  { cat: 'Backend y BD', name: 'MongoDB Atlas', url: 'https://www.mongodb.com/atlas', desc: 'Base de datos de documentos en la nube con capa gratuita generosa y despliegue en minutos.' },
  { cat: 'Backend y BD', name: 'Supabase', url: 'https://supabase.com/', desc: 'Backend completo sobre Postgres: auth, storage, realtime y APIs automáticas.' },
  { cat: 'Backend y BD', name: 'Firebase', url: 'https://firebase.google.com/', desc: 'Autenticación, base de datos en tiempo real, hosting y notificaciones push de Google.' },
  { cat: 'Backend y BD', name: 'Prisma', url: 'https://www.prisma.io/', desc: 'ORM con tipado seguro y migraciones. Consultas claras y autocompletadas.' },
  { cat: 'Backend y BD', name: 'Redis', url: 'https://redis.io/', desc: 'Almacenamiento en memoria para caché, colas y sesiones. Latencia de microsegundos.' },
  { cat: 'Backend y BD', name: 'DBeaver', url: 'https://dbeaver.io/', desc: 'Cliente universal de bases de datos. Conecta a casi cualquier motor desde una sola app.' },

  /* --- APIs y testing --- */
  { cat: 'APIs y Testing', name: 'Postman', url: 'https://www.postman.com/', desc: 'El estándar para probar y documentar APIs: colecciones, entornos y tests automatizados.' },
  { cat: 'APIs y Testing', name: 'Insomnia', url: 'https://insomnia.rest/', desc: 'Cliente REST y GraphQL ligero, con interfaz limpia y buen soporte de variables.' },
  { cat: 'APIs y Testing', name: 'Bruno', url: 'https://www.usebruno.com/', desc: 'Cliente de API open source que guarda las peticiones como archivos en tu repositorio Git.' },
  { cat: 'APIs y Testing', name: 'Swagger / OpenAPI', url: 'https://swagger.io/', desc: 'Documenta tu API con un estándar y genera clientes, servidores y una consola interactiva.' },
  { cat: 'APIs y Testing', name: 'Playwright', url: 'https://playwright.dev/', desc: 'Tests end-to-end en Chromium, Firefox y WebKit. Rápido, estable y con grabador incluido.' },
  { cat: 'APIs y Testing', name: 'Cypress', url: 'https://www.cypress.io/', desc: 'Testing E2E con recarga en vivo y viaje en el tiempo para depurar cada paso.' },
  { cat: 'APIs y Testing', name: 'Vitest', url: 'https://vitest.dev/', desc: 'Framework de tests unitarios súper rápido, compatible con la API de Jest y nativo de Vite.' },
  { cat: 'APIs y Testing', name: 'Jest', url: 'https://jestjs.io/', desc: 'Testing unitario con mocks, snapshots y cobertura. El clásico del ecosistema JavaScript.' },
  { cat: 'APIs y Testing', name: 'Testing Library', url: 'https://testing-library.com/', desc: 'Prueba tus componentes como los usa una persona real, no por detalles de implementación.' },
  { cat: 'APIs y Testing', name: 'k6', url: 'https://k6.io/', desc: 'Pruebas de carga y rendimiento escritas en JavaScript. Perfecto para integrarlas en CI.' },

  /* --- DevOps y despliegue --- */
  { cat: 'DevOps y Deploy', name: 'Docker', url: 'https://www.docker.com/', desc: 'Empaqueta tu app con sus dependencias. Se acabó el "en mi máquina sí funciona".' },
  { cat: 'DevOps y Deploy', name: 'GitHub Actions', url: 'https://github.com/features/actions', desc: 'CI/CD dentro de GitHub: tests, builds y despliegues automáticos en cada push.' },
  { cat: 'DevOps y Deploy', name: 'Vercel', url: 'https://vercel.com/', desc: 'Despliegue de frontends en segundos, con previews por rama y CDN global.' },
  { cat: 'DevOps y Deploy', name: 'Netlify', url: 'https://www.netlify.com/', desc: 'Hosting de sitios estáticos y funciones serverless con formularios y auth incluidos.' },
  { cat: 'DevOps y Deploy', name: 'Cloudflare Pages', url: 'https://pages.cloudflare.com/', desc: 'Hosting gratuito ultrarrápido en el edge, con Workers para lógica del lado del servidor.' },
  { cat: 'DevOps y Deploy', name: 'Railway', url: 'https://railway.app/', desc: 'Despliega backends y bases de datos conectando el repo. Configuración casi nula.' },
  { cat: 'DevOps y Deploy', name: 'Render', url: 'https://render.com/', desc: 'Alternativa sencilla a Heroku para APIs, cron jobs y bases de datos gestionadas.' },
  { cat: 'DevOps y Deploy', name: 'Kubernetes', url: 'https://kubernetes.io/es/', desc: 'Orquestación de contenedores a escala: autoescalado, balanceo y despliegues sin caídas.' },

  /* --- Diseño y UI --- */
  { cat: 'Diseño y UI', name: 'Figma', url: 'https://www.figma.com/', desc: 'Diseño de interfaces colaborativo en el navegador, con inspección de CSS para desarrolladores.' },
  { cat: 'Diseño y UI', name: 'Penpot', url: 'https://penpot.app/', desc: 'Alternativa open source a Figma, auto-hospedable y basada en estándares web.' },
  { cat: 'Diseño y UI', name: 'Storybook', url: 'https://storybook.js.org/', desc: 'Desarrolla y documenta componentes de forma aislada. Tu catálogo vivo de UI.' },
  { cat: 'Diseño y UI', name: 'Excalidraw', url: 'https://excalidraw.com/', desc: 'Diagramas de arquitectura con estilo de pizarra. Rápido para explicar ideas.' },
  { cat: 'Diseño y UI', name: 'Coolors', url: 'https://coolors.co/', desc: 'Generador de paletas de color con comprobación de contraste y exportación a CSS.' },
  { cat: 'Diseño y UI', name: 'Google Fonts', url: 'https://fonts.google.com/', desc: 'Más de mil tipografías libres, optimizadas y listas para incrustar en cualquier web.' },

  /* --- Calidad y monitoreo --- */
  { cat: 'Calidad y Monitoreo', name: 'ESLint', url: 'https://eslint.org/', desc: 'Detecta errores y malas prácticas en JavaScript y TypeScript antes de que lleguen a producción.' },
  { cat: 'Calidad y Monitoreo', name: 'Prettier', url: 'https://prettier.io/', desc: 'Formateo automático de código. Elimina para siempre las discusiones de estilo en el equipo.' },
  { cat: 'Calidad y Monitoreo', name: 'SonarQube', url: 'https://www.sonarsource.com/products/sonarqube/', desc: 'Análisis estático de calidad y seguridad, con métricas de deuda técnica y cobertura.' },
  { cat: 'Calidad y Monitoreo', name: 'Sentry', url: 'https://sentry.io/', desc: 'Captura errores en producción con stack trace, contexto del usuario y alertas.' },
  { cat: 'Calidad y Monitoreo', name: 'PageSpeed Insights', url: 'https://pagespeed.web.dev/', desc: 'Audita rendimiento, accesibilidad y SEO con Lighthouse y datos reales de usuarios.' },
  { cat: 'Calidad y Monitoreo', name: 'Chrome DevTools', url: 'https://developer.chrome.com/docs/devtools', desc: 'Depuración, red, memoria y rendimiento. La herramienta que más rentabilidad te da aprender.' },

  /* --- Productividad --- */
  { cat: 'Productividad', name: 'Notion', url: 'https://www.notion.so/', desc: 'Documentación, tableros y bases de datos del proyecto en un único espacio de trabajo.' },
  { cat: 'Productividad', name: 'Jira', url: 'https://www.atlassian.com/software/jira', desc: 'Gestión ágil de sprints, backlog e incidencias. Estándar en equipos medianos y grandes.' },
  { cat: 'Productividad', name: 'Obsidian', url: 'https://obsidian.md/', desc: 'Notas locales en Markdown enlazadas entre sí. Perfecto para tu base de conocimiento técnico.' },
  { cat: 'Productividad', name: 'Warp', url: 'https://www.warp.dev/', desc: 'Terminal moderna con bloques, historial buscable y autocompletado inteligente.' },
  { cat: 'Productividad', name: 'DevDocs', url: 'https://devdocs.io/', desc: 'Documentación de cientos de lenguajes y librerías en una sola app, con búsqueda offline.' },
  { cat: 'Productividad', name: 'Can I Use', url: 'https://caniuse.com/', desc: 'Comprueba el soporte de cualquier característica web en navegadores antes de usarla.' }
];


const AI_TOOLS = [
  /* --- Consultas y chat --- */
  { cat: 'Consultas y Chat', name: 'ChatGPT', url: 'https://chatgpt.com/', desc: 'El asistente más popular. Razonamiento avanzado, análisis de archivos, voz, imágenes y agentes.' },
  { cat: 'Consultas y Chat', name: 'Claude', url: 'https://claude.ai/', desc: 'De Anthropic. Sobresale en textos largos, análisis de documentos y calidad de escritura y código.' },
  { cat: 'Consultas y Chat', name: 'Google Gemini', url: 'https://gemini.google.com/', desc: 'Ventana de contexto enorme e integración total con Gmail, Docs, Drive y YouTube.' },
  { cat: 'Consultas y Chat', name: 'Perplexity', url: 'https://www.perplexity.ai/', desc: 'Buscador con IA que responde citando fuentes reales. Ideal para investigar y verificar.' },
  { cat: 'Consultas y Chat', name: 'Grok', url: 'https://grok.com/', desc: 'IA de xAI con acceso en tiempo real a lo que se publica en X. Muy útil para tendencias.' },
  { cat: 'Consultas y Chat', name: 'DeepSeek', url: 'https://chat.deepseek.com/', desc: 'Modelo open weight con excelente razonamiento matemático y de código a coste muy bajo.' },
  { cat: 'Consultas y Chat', name: 'Mistral Le Chat', url: 'https://chat.mistral.ai/', desc: 'Asistente europeo, rápido y con fuerte enfoque en privacidad y modelos abiertos.' },
  { cat: 'Consultas y Chat', name: 'Microsoft Copilot', url: 'https://copilot.microsoft.com/', desc: 'IA integrada en Windows y Office. Redacta en Word, analiza en Excel y resume en Teams.' },
  { cat: 'Consultas y Chat', name: 'NotebookLM', url: 'https://notebooklm.google.com/', desc: 'Sube tus documentos y pregunta solo sobre ellos. Genera resúmenes y podcasts de audio.' },

  /* --- Desarrollo --- */
  { cat: 'Desarrollo con IA', name: 'Claude Code', url: 'https://claude.com/product/claude-code', desc: 'Agente de terminal que lee tu repositorio, edita varios archivos y ejecuta comandos por ti.' },
  { cat: 'Desarrollo con IA', name: 'Cursor', url: 'https://cursor.com/', desc: 'Editor basado en VS Code con IA integrada. La mejor opción para trabajar en bases de código grandes.' },
  { cat: 'Desarrollo con IA', name: 'GitHub Copilot', url: 'https://github.com/features/copilot', desc: 'Autocompletado, chat y agentes dentro de VS Code, JetBrains y el propio GitHub.' },
  { cat: 'Desarrollo con IA', name: 'Cline', url: 'https://cline.bot/', desc: 'Agente open source para VS Code. Eliges tu modelo y ves cada cambio antes de aplicarlo.' },
  { cat: 'Desarrollo con IA', name: 'OpenAI Codex', url: 'https://openai.com/codex/', desc: 'Agente de ingeniería que trabaja en tareas en paralelo y abre pull requests.' },
  { cat: 'Desarrollo con IA', name: 'Gemini CLI', url: 'https://github.com/google-gemini/gemini-cli', desc: 'Agente de Google para la terminal, open source y con capa gratuita muy amplia.' },
  { cat: 'Desarrollo con IA', name: 'Bolt.new', url: 'https://bolt.new/', desc: 'Describe una app y la construye completa en el navegador, con despliegue en un clic.' },
  { cat: 'Desarrollo con IA', name: 'v0 de Vercel', url: 'https://v0.app/', desc: 'Genera interfaces React y Tailwind a partir de texto o de una captura de pantalla.' },
  { cat: 'Desarrollo con IA', name: 'Lovable', url: 'https://lovable.dev/', desc: 'Crea aplicaciones full-stack conversando: frontend, base de datos y autenticación.' },
  { cat: 'Desarrollo con IA', name: 'Replit', url: 'https://replit.com/', desc: 'IDE en la nube con agente que programa, prueba y publica sin instalar nada.' },
  { cat: 'Desarrollo con IA', name: 'Devin Desktop', url: 'https://devin.ai/', desc: 'Antes Windsurf. Agente autónomo de Cognition con mapas de código y flujo Cascade.' },
  { cat: 'Desarrollo con IA', name: 'CodeRabbit', url: 'https://www.coderabbit.ai/', desc: 'Revisión automática de pull requests con comentarios línea a línea y resumen de cambios.' },

  /* --- Imágenes: generación --- */
  { cat: 'Imágenes', name: 'Nano Banana Pro', url: 'https://gemini.google.com/', desc: 'Modelo de imagen de Google. Mejor calidad general, 4K y edición precisa por instrucciones.' },
  { cat: 'Imágenes', name: 'Midjourney', url: 'https://www.midjourney.com/', desc: 'El rey del estilo artístico. Texturas, iluminación y composición con un acabado inconfundible.' },
  { cat: 'Imágenes', name: 'GPT Image (ChatGPT)', url: 'https://chatgpt.com/', desc: 'El mejor renderizando texto dentro de la imagen: carteles, logos, infografías y mockups.' },
  { cat: 'Imágenes', name: 'Flux', url: 'https://blackforestlabs.ai/', desc: 'Modelos de Black Forest Labs. Gran relación calidad-precio y excelentes resultados fotorrealistas.' },
  { cat: 'Imágenes', name: 'Ideogram', url: 'https://ideogram.ai/', desc: 'Especialista en tipografía y diseño gráfico. Perfecto para logos y piezas con texto.' },
  { cat: 'Imágenes', name: 'Leonardo AI', url: 'https://leonardo.ai/', desc: 'Orientado a game art y assets: modelos entrenables, control de pose y capa gratuita diaria.' },
  { cat: 'Imágenes', name: 'Recraft', url: 'https://www.recraft.ai/', desc: 'Genera vectores SVG e iconos con estilo consistente. Muy útil para branding.' },
  { cat: 'Imágenes', name: 'Krea', url: 'https://www.krea.ai/', desc: 'Generación en tiempo real mientras dibujas, más mejora y ampliación de imágenes.' },
  { cat: 'Imágenes', name: 'Stable Diffusion', url: 'https://stability.ai/', desc: 'Modelos abiertos que puedes ejecutar en tu propio equipo, sin límites ni suscripción.' },

  /* --- Edición de imagen --- */
  { cat: 'Edición de imagen', name: 'Adobe Firefly', url: 'https://firefly.adobe.com/', desc: 'IA generativa de Adobe integrada en Photoshop: relleno generativo y expansión de escena.' },
  { cat: 'Edición de imagen', name: 'Magnific AI', url: 'https://magnific.ai/', desc: 'Ampliador que inventa detalle real. Convierte imágenes pequeñas en piezas de alta resolución.' },
  { cat: 'Edición de imagen', name: 'Photoroom', url: 'https://www.photoroom.com/', desc: 'Fotos de producto profesionales: quita el fondo y genera escenarios en segundos.' },
  { cat: 'Edición de imagen', name: 'Clipdrop', url: 'https://clipdrop.co/', desc: 'Suite de utilidades: limpiar objetos, reiluminar, quitar fondo y mejorar resolución.' },
  { cat: 'Edición de imagen', name: 'remove.bg', url: 'https://www.remove.bg/', desc: 'Elimina el fondo de cualquier imagen en un clic. Rápido, preciso y con API.' },
  { cat: 'Edición de imagen', name: 'Canva Magic Studio', url: 'https://www.canva.com/magic-studio/', desc: 'Diseño con IA para redes sociales, presentaciones y video, sin saber diseñar.' },
  { cat: 'Edición de imagen', name: 'Upscayl', url: 'https://upscayl.org/', desc: 'Ampliador de imágenes open source que funciona 100% offline en tu computador.' },

  /* --- Video --- */
  { cat: 'Video', name: 'Google Veo / Flow', url: 'https://labs.google/flow/', desc: 'El más sólido en 2026: sigue muy bien el prompt, genera audio nativo y salida en 4K.' },
  { cat: 'Video', name: 'Kling AI', url: 'https://klingai.com/', desc: 'Excelente en movimiento complejo, física realista y modo storyboard con varias tomas.' },
  { cat: 'Video', name: 'Runway', url: 'https://runwayml.com/', desc: 'Control de cámara, consistencia de personajes y editor integrado. Favorito de creativos.' },
  { cat: 'Video', name: 'Luma Dream Machine', url: 'https://lumalabs.ai/dream-machine', desc: 'Convierte imágenes en clips con movimiento natural. Interfaz simple y resultados rápidos.' },
  { cat: 'Video', name: 'Pika', url: 'https://pika.art/', desc: 'Video desde texto o imagen y edición por partes con instrucciones en lenguaje natural.' },
  { cat: 'Video', name: 'Hailuo (MiniMax)', url: 'https://hailuoai.video/', desc: 'Destaca en movimiento humano y expresiones faciales creíbles.' },
  { cat: 'Video', name: 'PixVerse', url: 'https://pixverse.ai/', desc: 'Plantillas de efectos virales y generación rápida pensada para redes sociales.' },
  { cat: 'Video', name: 'HeyGen', url: 'https://www.heygen.com/', desc: 'Avatares realistas y doblaje con sincronía labial en más de 40 idiomas.' },
  { cat: 'Video', name: 'Synthesia', url: 'https://www.synthesia.io/', desc: 'Video corporativo y formación con presentadores virtuales a partir de un guion.' },
  { cat: 'Video', name: 'Descript', url: 'https://www.descript.com/', desc: 'Edita video borrando texto de la transcripción. Elimina muletillas automáticamente.' },
  { cat: 'Video', name: 'CapCut', url: 'https://www.capcut.com/', desc: 'Editor gratuito con subtítulos automáticos, quitar fondo y plantillas para vertical.' },

  /* --- Audio y música --- */
  { cat: 'Audio y Música', name: 'Suno', url: 'https://suno.com/', desc: 'La mejor para canciones completas con voz. Escribes la letra y el estilo, y suena pulida.' },
  { cat: 'Audio y Música', name: 'Udio', url: 'https://www.udio.com/', desc: 'Más control fino sobre estructura y estilo. Ideal si quieres refinar la composición.' },
  { cat: 'Audio y Música', name: 'ElevenLabs', url: 'https://elevenlabs.io/', desc: 'Voces sintéticas de máxima calidad, clonación de voz, doblaje y efectos de sonido.' },
  { cat: 'Audio y Música', name: 'Stable Audio', url: 'https://stableaudio.com/', desc: 'Música y diseño sonoro con licencia limpia. Muy útil para desarrolladores y videojuegos.' },
  { cat: 'Audio y Música', name: 'Adobe Podcast', url: 'https://podcast.adobe.com/', desc: 'Convierte una grabación casera en audio de estudio. Quita ruido y eco gratis.' },
  { cat: 'Audio y Música', name: 'LALAL.AI', url: 'https://www.lalal.ai/', desc: 'Separa voz, batería, bajo e instrumentos de cualquier canción con altísima limpieza.' },
  { cat: 'Audio y Música', name: 'Mubert', url: 'https://mubert.com/', desc: 'Música de fondo libre de derechos generada al momento para videos y streams.' },

  /* --- Productividad y contenido --- */
  { cat: 'Productividad IA', name: 'Gamma', url: 'https://gamma.app/', desc: 'Presentaciones y documentos con buen diseño a partir de un guion o unas notas.' },
  { cat: 'Productividad IA', name: 'Napkin AI', url: 'https://www.napkin.ai/', desc: 'Convierte texto en diagramas y gráficos editables. Perfecto para explicar arquitecturas.' },
  { cat: 'Productividad IA', name: 'Notion AI', url: 'https://www.notion.so/product/ai', desc: 'Escribe, resume y busca dentro de todo tu espacio de trabajo y apps conectadas.' },
  { cat: 'Productividad IA', name: 'Otter.ai', url: 'https://otter.ai/', desc: 'Transcribe reuniones en vivo y entrega resumen con tareas y responsables.' },
  { cat: 'Productividad IA', name: 'Hugging Face', url: 'https://huggingface.co/', desc: 'El repositorio de modelos open source. Prueba miles de IA gratis desde el navegador.' },
  { cat: 'Productividad IA', name: 'OpenRouter', url: 'https://openrouter.ai/', desc: 'Una sola API y una sola factura para acceder a cientos de modelos de distintos proveedores.' }
];


const PROMPTS = [
  {
    cat: 'Uso general',
    name: 'Experto a medida (rol maestro)',
    desc: 'Convierte cualquier IA en un especialista de tu tema con contexto, límites y formato definidos.',
    text: `Actúa como [PROFESIÓN / ESPECIALIDAD] con más de 15 años de experiencia en [SECTOR O CONTEXTO].

CONTEXTO
- Mi situación actual: [DESCRIBE TU SITUACIÓN]
- Lo que ya intenté: [QUÉ HAS PROBADO Y QUÉ PASÓ]
- Recursos disponibles: [TIEMPO, PRESUPUESTO, EQUIPO, HERRAMIENTAS]
- Restricciones: [LO QUE NO PUEDO O NO QUIERO HACER]

OBJETIVO
[DESCRIBE EL RESULTADO CONCRETO QUE QUIERES CONSEGUIR Y PARA CUÁNDO]

INSTRUCCIONES
1. Antes de responder, hazme entre 3 y 5 preguntas de aclaración si falta información clave. Si tienes lo suficiente, continúa directamente.
2. Dame la recomendación principal en un párrafo corto y directo, sin rodeos.
3. Justifícala con los 3 argumentos más fuertes, ordenados por importancia.
4. Presenta un plan de acción numerado con pasos concretos, cada uno con: qué hacer, cuánto tiempo tomaría y cómo sé que salió bien.
5. Advierte sobre los 3 errores más comunes que la gente comete aquí y cómo evitarlos.
6. Termina con una alternativa razonable por si mi restricción principal cambia.

ESTILO
- Escribe en español claro y directo, sin relleno ni frases motivacionales.
- Usa encabezados y viñetas. Máximo [NÚMERO] palabras.
- Si algo no lo sabes con certeza, dilo explícitamente en lugar de inventarlo.
- Distingue siempre entre hecho verificable, práctica habitual del sector y opinión tuya.`
  },
  {
    cat: 'Uso general',
    name: 'Toma de decisiones difíciles',
    desc: 'Analiza dos o más opciones con criterios ponderados, riesgos y una recomendación final.',
    text: `Ayúdame a tomar una decisión con rigor. No quieras quedar bien conmigo: quiero un análisis honesto.

DECISIÓN A TOMAR
[DESCRIBE LA DECISIÓN]

OPCIONES
A) [OPCIÓN A]
B) [OPCIÓN B]
C) [OPCIÓN C — opcional]

MI CONTEXTO
- Prioridades, en orden: [1º, 2º, 3º]
- Horizonte de tiempo: [CORTO / MEDIO / LARGO PLAZO]
- Qué pasa si me equivoco: [CONSECUENCIAS]
- Restricciones innegociables: [LISTA]

QUÉ NECESITO DE TI
1. Define entre 5 y 7 criterios de evaluación relevantes y asígnales un peso porcentual que sume 100, justificando cada peso.
2. Construye una tabla puntuando cada opción de 1 a 10 en cada criterio, con el total ponderado.
3. Para cada opción, describe el mejor escenario realista, el peor escenario realista y el escenario más probable.
4. Identifica el supuesto oculto más frágil de mi planteamiento: aquello que, si resulta falso, invalida toda la comparación.
5. Nombra qué información me falta y que, de conseguirla, cambiaría la decisión.
6. Da tu recomendación final en una frase, con tu nivel de confianza (alto / medio / bajo) y por qué.
7. Añade una prueba barata y rápida que pueda hacer esta semana para reducir la incertidumbre antes de comprometerme del todo.`
  },
  {
    cat: 'Uso general',
    name: 'Mejorar un prompt (meta-prompt)',
    desc: 'Le pides a la IA que reescriba y optimice tu propio prompt antes de ejecutarlo.',
    text: `Eres un ingeniero de prompts experto. Tu tarea NO es responder mi petición todavía, sino convertirla en un prompt excelente.

MI PROMPT ACTUAL
"""
[PEGA AQUÍ TU PROMPT TAL COMO LO ESCRIBISTE]
"""

MODELO DONDE LO VOY A USAR: [ChatGPT / Claude / Gemini / otro]
RESULTADO QUE ESPERO OBTENER: [DESCRÍBELO]

HAZ LO SIGUIENTE, EN ESTE ORDEN
1. Diagnóstico: enumera los problemas concretos del prompt actual (ambigüedad, falta de contexto, ausencia de formato de salida, criterios de éxito indefinidos, instrucciones contradictorias).
2. Preguntas: lista la información que falta y que solo yo puedo aportar.
3. Prompt mejorado: reescríbelo completo, listo para copiar y pegar, incluyendo rol, contexto, tarea, restricciones, formato de salida y criterios de calidad.
4. Variante corta: una versión resumida para cuando tenga prisa.
5. Variante avanzada: una versión con razonamiento paso a paso y autoverificación al final.
6. Explica en 3 viñetas por qué la versión mejorada funcionará mejor.

No respondas al contenido de mi petición original. Solo optimiza el prompt.`
  },

  /* ------------------- RESÚMENES ------------------- */
  {
    cat: 'Resúmenes',
    name: 'Resumen profesional por capas',
    desc: 'Resume cualquier texto largo en tres niveles de profundidad, con datos y citas clave.',
    text: `Resume el siguiente contenido para alguien que necesita entenderlo bien pero no tiene tiempo de leerlo entero.

CONTENIDO
"""
[PEGA AQUÍ EL TEXTO, TRANSCRIPCIÓN O ARTÍCULO]
"""

AUDIENCIA: [A QUIÉN VA DIRIGIDO Y QUÉ SABE DEL TEMA]
PARA QUÉ LO NECESITO: [DECIDIR ALGO / ESTUDIAR / EXPLICARLO A OTROS]

ENTREGA EL RESUMEN EN ESTAS CAPAS
1. TITULAR: la idea central en una sola frase de máximo 25 palabras.
2. RESUMEN EJECUTIVO: un párrafo de 4 a 6 líneas con lo esencial.
3. PUNTOS CLAVE: entre 5 y 8 viñetas, cada una autoexplicativa (que se entienda sin leer el original).
4. DATOS Y CIFRAS: todos los números, fechas, nombres y porcentajes relevantes, tal como aparecen.
5. CITAS TEXTUALES: las 2 o 3 frases más importantes, transcritas literalmente entre comillas.
6. CONCLUSIONES Y ACCIONES: qué se deduce y qué debería hacer al respecto.
7. LO QUE NO DICE: vacíos, sesgos evidentes o preguntas que el texto deja sin responder.

REGLAS
- No inventes absolutamente nada que no esté en el contenido.
- Si algo es ambiguo en el original, márcalo como "ambiguo en la fuente".
- Conserva el matiz: si el autor duda o condiciona una afirmación, no la conviertas en certeza.
- Escribe en español neutro y sin jerga innecesaria.`
  },
  {
    cat: 'Resúmenes',
    name: 'Resumen de reunión a plan de acción',
    desc: 'Convierte la transcripción de una reunión en decisiones, tareas y responsables.',
    text: `Convierte esta transcripción de reunión en un acta útil y accionable.

TRANSCRIPCIÓN
"""
[PEGA AQUÍ LA TRANSCRIPCIÓN]
"""

GENERA
1. RESUMEN: 3 o 4 líneas sobre de qué trató la reunión y en qué punto quedó.
2. DECISIONES TOMADAS: lista numerada. Para cada una indica qué se decidió, quién lo decidió y qué la motivó.
3. TAREAS: una tabla con las columnas Tarea | Responsable | Fecha límite | Prioridad (alta/media/baja) | Depende de.
4. TEMAS ABIERTOS: lo que se discutió pero quedó sin resolver, con quién debe cerrarlo.
5. DESACUERDOS: posturas enfrentadas que se expresaron y no se zanjaron. Sé neutral al describirlas.
6. RIESGOS Y BLOQUEOS: lo que puede impedir que se cumpla lo acordado.
7. PARA LA PRÓXIMA REUNIÓN: agenda sugerida con 3 a 5 puntos.

REGLAS
- Si un responsable o una fecha no se mencionó, escribe "SIN ASIGNAR" en lugar de suponerlo.
- No incluyas conversación informal ni divagaciones fuera de tema.
- Usa los nombres exactos que aparecen en la transcripción.`
  },
  {
    cat: 'Resúmenes',
    name: 'Explícamelo de verdad',
    desc: 'Aprende un concepto difícil con analogía, ejemplo real, errores comunes y autoevaluación.',
    text: `Enséñame el concepto de [CONCEPTO O TEMA] como lo haría el mejor profesor que he tenido.

MI NIVEL ACTUAL: [PRINCIPIANTE TOTAL / SÉ ALGO / INTERMEDIO]
LO QUE YA CONOZCO Y PUEDES USAR COMO PUNTO DE PARTIDA: [TEMAS QUE DOMINAS]
PARA QUÉ LO NECESITO: [ESTUDIO / TRABAJO / PROYECTO CONCRETO]

ESTRUCTURA LA EXPLICACIÓN ASÍ
1. EN UNA FRASE: qué es, sin tecnicismos.
2. POR QUÉ EXISTE: qué problema real vino a resolver y qué se hacía antes.
3. ANALOGÍA: una comparación con algo cotidiano, y a continuación di explícitamente dónde falla esa analogía.
4. EL MECANISMO: cómo funciona de verdad, paso a paso, subiendo la precisión poco a poco.
5. EJEMPLO CONCRETO: un caso real y completo, con datos, desarrollado de principio a fin.
6. ERRORES FRECUENTES: los 3 malentendidos típicos de quien está aprendiendo esto, y por qué son incorrectos.
7. CÓMO SE CONECTA: con qué otros conceptos se relaciona y con cuáles se confunde a menudo.
8. COMPRUEBA SI ENTENDÍ: 3 preguntas de dificultad creciente. No me des las respuestas todavía; espera a que yo conteste y luego corrígeme.

REGLAS
- Si necesitas usar un término técnico, defínelo la primera vez en la misma frase.
- Prefiere la precisión a la simplificación excesiva: si algo es más complejo de lo que parece, dímelo.`
  },

  /* ------------------- DESARROLLO ------------------- */
  {
    cat: 'Desarrollo',
    name: 'Generar una funcionalidad completa',
    desc: 'Pide código de producción con tipos, validaciones, manejo de errores y tests.',
    text: `Actúa como desarrollador senior de [LENGUAJE / FRAMEWORK]. Necesito código listo para producción, no un ejemplo de tutorial.

QUÉ NECESITO CONSTRUIR
[DESCRIBE LA FUNCIONALIDAD CON DETALLE: QUÉ HACE, QUIÉN LA USA, QUÉ RECIBE Y QUÉ DEVUELVE]

CONTEXTO TÉCNICO
- Lenguaje y versión: [EJ. TypeScript 5.x]
- Framework y librerías ya presentes: [LISTA]
- Base de datos: [MOTOR Y ORM SI APLICA]
- Convenciones del proyecto: [NOMBRADO, ESTRUCTURA DE CARPETAS, ESTILO]
- Entorno de ejecución: [NAVEGADOR / NODE / SERVERLESS / MÓVIL]

REQUISITOS OBLIGATORIOS
1. Valida todas las entradas y trata los casos límite: valores vacíos, nulos, negativos, listas enormes, caracteres especiales y concurrencia.
2. Maneja los errores de forma explícita, con mensajes útiles. Nada de bloques catch vacíos.
3. Añade tipos estrictos. Evita el tipo any o equivalentes.
4. Comenta solo lo que no sea evidente al leer el código: el porqué, no el qué.
5. No introduzcas dependencias nuevas sin justificarlo; si lo haces, explica por qué y qué alternativa hay sin ella.

ENTREGA EN ESTE ORDEN
1. Enfoque elegido en 3 o 4 líneas, y qué alternativa descartaste y por qué.
2. El código completo, dividido por archivos, cada uno con su ruta.
3. Tests unitarios que cubran el camino feliz, los errores y al menos dos casos límite.
4. Ejemplo de uso real.
5. Consideraciones de rendimiento y seguridad relevantes en este caso concreto.
6. Qué dejarías para una segunda iteración y por qué no es urgente.

Si mis requisitos son ambiguos o contradictorios, dímelo antes de escribir código.`
  },
  {
    cat: 'Desarrollo',
    name: 'Depurar un error paso a paso',
    desc: 'Diagnóstico sistemático de un bug: hipótesis, causa raíz, solución y prevención.',
    text: `Ayúdame a encontrar la causa raíz de este error. Quiero un diagnóstico razonado, no que adivines.

SÍNTOMA
[QUÉ ESTÁ PASANDO Y QUÉ ESPERABA QUE PASARA]

CÓMO REPRODUCIRLO
[PASOS EXACTOS. INDICA SI ES INTERMITENTE O CONSTANTE]

MENSAJE DE ERROR Y TRAZA
"""
[PEGA AQUÍ EL ERROR COMPLETO]
"""

CÓDIGO RELEVANTE
"""
[PEGA AQUÍ EL CÓDIGO]
"""

ENTORNO
- Versiones: [LENGUAJE, FRAMEWORK, LIBRERÍAS, SISTEMA OPERATIVO]
- Dónde ocurre: [LOCAL / STAGING / PRODUCCIÓN]
- Cambios recientes antes de que apareciera: [QUÉ TOCASTE]
- Qué ya intenté: [LISTA Y RESULTADO DE CADA INTENTO]

PROCEDE ASÍ
1. Explica en tus palabras qué está fallando exactamente, leyendo la traza línea por línea.
2. Plantea de 3 a 5 hipótesis ordenadas de más a menos probable, con el razonamiento de cada una.
3. Para cada hipótesis, indica una comprobación concreta y barata que la confirme o descarte, y qué resultado esperarías ver.
4. Señala la causa raíz más probable y distínguela claramente del síntoma.
5. Da la solución con el código corregido y explica por qué funciona.
6. Añade una prueba automatizada que falle con el bug y pase con el arreglo.
7. Sugiere qué cambio estructural o qué log evitaría que esta clase de error vuelva a pasar desapercibido.

Si el código o el contexto no bastan para concluir, dime exactamente qué archivo, log o dato necesitas ver.`
  },
  {
    cat: 'Desarrollo',
    name: 'Revisión de código exigente',
    desc: 'Una code review seria: bugs, seguridad, rendimiento y mantenibilidad priorizados.',
    text: `Haz una revisión de código rigurosa, como la haría un tech lead exigente pero constructivo. Prefiero que seas duro a que seas amable.

CÓDIGO A REVISAR
"""
[PEGA AQUÍ EL CÓDIGO]
"""

CONTEXTO
- Qué hace y para qué sirve: [DESCRIPCIÓN]
- Quién y cómo lo usa: [USUARIOS, VOLUMEN, FRECUENCIA]
- Nivel de criticidad: [PROTOTIPO / INTERNO / PRODUCCIÓN CON USUARIOS REALES]
- Convenciones del equipo: [ESTILO, PATRONES, LO QUE ESTÁ PROHIBIDO]

REVISA POR CATEGORÍAS Y CLASIFICA CADA HALLAZGO
Usa estas etiquetas: [CRÍTICO] rompe o expone algo, [IMPORTANTE] hay que arreglarlo pronto, [MENOR] mejora opcional, [ELOGIO] algo bien hecho que conviene mantener.

Categorías a cubrir:
1. Corrección: bugs reales, casos límite no contemplados, condiciones de carrera, errores silenciados.
2. Seguridad: validación de entradas, inyección, exposición de datos sensibles, permisos, secretos en el código.
3. Rendimiento: consultas repetidas en bucles, complejidad innecesaria, fugas de memoria, ausencia de paginación o caché.
4. Legibilidad y mantenimiento: nombres, funciones demasiado largas, lógica duplicada, acoplamiento.
5. Tests: qué no está cubierto y qué prueba concreta añadirías.
6. API y contrato: nombres, valores de retorno, retrocompatibilidad.

FORMATO DE CADA HALLAZGO
- Etiqueta y título breve.
- Fragmento afectado.
- Por qué es un problema, con un escenario concreto donde falla.
- Código corregido propuesto.

CIERRE
- Los 3 cambios que más valor aportan, en orden.
- Veredicto: se puede fusionar tal cual, se puede fusionar con cambios menores, o requiere trabajo.
- No inventes problemas para llenar la lista. Si algo está bien, dilo.`
  },
  {
    cat: 'Desarrollo',
    name: 'Diseñar la arquitectura de un proyecto',
    desc: 'Define stack, estructura, modelo de datos y plan por fases antes de escribir una línea.',
    text: `Actúa como arquitecto de software. Ayúdame a diseñar este proyecto antes de escribir código.

EL PROYECTO
- Qué hace: [DESCRIPCIÓN]
- Problema que resuelve y para quién: [USUARIOS Y NECESIDAD]
- Funcionalidades imprescindibles para la primera versión: [LISTA]
- Funcionalidades deseables más adelante: [LISTA]

RESTRICCIONES REALES
- Equipo: [CUÁNTAS PERSONAS Y QUÉ DOMINAN]
- Plazo: [TIEMPO DISPONIBLE]
- Presupuesto de infraestructura: [MENSUAL]
- Escala esperada: [USUARIOS Y VOLUMEN DE DATOS EL PRIMER AÑO]
- Plataformas: [WEB / MÓVIL / ESCRITORIO / API]
- Requisitos legales o de privacidad: [SI APLICA]

ENTREGA
1. STACK RECOMENDADO: cada elección con una justificación de una línea y la alternativa que descartaste. Prioriza tecnologías que el equipo ya conozca frente a las más modernas.
2. ARQUITECTURA GENERAL: describe los componentes y cómo se comunican. Incluye un diagrama en formato Mermaid.
3. ESTRUCTURA DE CARPETAS: árbol completo con una explicación por carpeta.
4. MODELO DE DATOS: entidades, campos, tipos, relaciones e índices necesarios.
5. CONTRATO DE API: endpoints principales con método, ruta, entrada y salida.
6. DECISIONES CLAVE: las 3 que más condicionan el proyecto, cuál es su coste de reversión y en qué momento habría que reconsiderarlas.
7. PLAN POR FASES: qué construir primero y qué es seguro dejar para después. Ordena por riesgo, no por facilidad.
8. LO QUE NO VOY A HACER: qué sobreingeniería debería evitar en esta etapa.

Si el proyecto es más simple de lo que creo y me estoy complicando, dímelo sin rodeos.`
  },
  {
    cat: 'Desarrollo',
    name: 'Refactorizar sin romper nada',
    desc: 'Plan de refactor incremental con pasos verificables y criterios de reversión.',
    text: `Necesito refactorizar este código sin romper el comportamiento actual.

CÓDIGO ACTUAL
"""
[PEGA AQUÍ EL CÓDIGO]
"""

POR QUÉ QUIERO REFACTORIZARLO
[EJ. ES ILEGIBLE, ES LENTO, ES IMPOSIBLE DE PROBAR, HAY LÓGICA DUPLICADA]

RESTRICCIONES
- La interfaz pública [PUEDE / NO PUEDE] cambiar.
- Tests existentes: [SÍ, CUÁLES / NO HAY]
- Otras partes que dependen de esto: [LISTA]

ENTREGA
1. Explica qué hace el código actual, incluidos los comportamientos raros o accidentales que podrían ser necesarios para alguien.
2. Enumera los problemas concretos, ordenados por impacto.
3. Si no hay tests, escribe primero una red de seguridad: tests que capturen el comportamiento actual tal como es, incluso el discutible.
4. Propón el refactor dividido en pasos pequeños e independientes. Cada paso debe dejar el código funcionando y ser verificable por separado.
5. Muestra el código final completo.
6. Señala explícitamente cualquier cambio de comportamiento, por mínimo que sea.
7. Indica qué partes NO tocarías ahora y por qué el riesgo no compensa.

Prioriza que el código sea fácil de entender dentro de seis meses por encima de que sea ingenioso.`
  },
  {
    cat: 'Desarrollo',
    name: 'Consultas SQL y modelado de datos',
    desc: 'Escribe, explica y optimiza consultas SQL con índices y alternativas.',
    text: `Actúa como especialista en bases de datos [POSTGRESQL / MYSQL / SQL SERVER / OTRO].

ESQUEMA
"""
[PEGA AQUÍ LAS TABLAS, COLUMNAS, TIPOS, CLAVES E ÍNDICES ACTUALES]
"""

VOLUMEN APROXIMADO
[FILAS POR TABLA Y CRECIMIENTO MENSUAL]

QUÉ NECESITO OBTENER
[DESCRIBE EN LENGUAJE NATURAL EL RESULTADO QUE BUSCAS, CON UN EJEMPLO DE CÓMO SE VERÍA LA SALIDA]

ENTREGA
1. La consulta SQL completa, formateada y legible.
2. Explicación paso a paso de qué hace cada bloque (joins, filtros, agrupaciones, ventanas).
3. Advertencias sobre resultados inesperados: duplicados por joins, filas nulas que desaparecen con INNER JOIN, agregaciones que ignoran nulos, zonas horarias.
4. Índices que deberían existir para que esta consulta sea rápida, con la sentencia CREATE INDEX y por qué ayudan.
5. Una versión alternativa si el volumen crece diez veces.
6. Cómo verificar que el resultado es correcto: una consulta de control que contraste los totales.

Si mi esquema tiene un problema de diseño que hace esta consulta más difícil de lo necesario, dímelo y propón la corrección.`
  },

  /* ------------------- IMÁGENES ------------------- */
  {
    cat: 'Imágenes',
    name: 'Fotografía realista (fórmula completa)',
    desc: 'Estructura profesional para generar imágenes fotorrealistas con control de cámara y luz.',
    text: `[SUJETO PRINCIPAL: quién o qué, con detalle de aspecto, edad, ropa, expresión y postura], [ACCIÓN: qué está haciendo exactamente en este instante], [ENTORNO: lugar concreto, objetos de fondo, época del año, hora del día].

Fotografía: cámara [Canon EOS R5 / Sony A7 IV / Hasselblad X2D], objetivo [35mm / 50mm / 85mm / 24-70mm], apertura [f/1.4 para fondo muy desenfocado, f/8 para todo enfocado], ISO [100-400], velocidad [1/250s].

Iluminación: [luz natural de ventana lateral / hora dorada al atardecer / luz suave de día nublado / clave baja con una sola fuente / anillo de luz frontal], sombras [suaves y difusas / marcadas y contrastadas], temperatura de color [cálida 3200K / neutra 5500K / fría 7000K].

Composición: plano [primer plano / plano medio / plano general / cenital], regla de los tercios, ángulo de cámara [a la altura de los ojos / contrapicado / picado], profundidad de campo [reducida con bokeh cremoso].

Estilo y acabado: [fotografía editorial / documental / retrato de estudio / fotografía de producto], paleta de color [DESCRIBE 2 O 3 COLORES DOMINANTES], textura de película [grano fino Kodak Portra 400], alto rango dinámico, detalle nítido en [DÓNDE DEBE ESTAR EL MÁXIMO DETALLE].

Formato: relación de aspecto [16:9 / 4:5 / 1:1 / 9:16], resolución máxima.

Evitar: manos deformes, texto ilegible, marcas de agua, rostros duplicados, aspecto plástico o de render 3D, sobresaturación, ojos asimétricos.`
  },
  {
    cat: 'Imágenes',
    name: 'Logo e identidad de marca',
    desc: 'Prompt para logos vectoriales limpios, escalables y con concepto detrás.',
    text: `Diseño de logotipo profesional para [NOMBRE DE LA MARCA], una empresa de [SECTOR / ACTIVIDAD].

Concepto: el logo debe transmitir [3 ATRIBUTOS, EJ. confianza, innovación, cercanía] y comunicar visualmente la idea de [METÁFORA O CONCEPTO CENTRAL].

Tipo de marca: [isotipo abstracto / símbolo geométrico / monograma con las iniciales / imagotipo con símbolo y texto].

Estilo: minimalista y moderno, geometría limpia, trazos de grosor uniforme, formas simples y memorables, estilo vectorial plano sin degradados ni sombras, sin efectos 3D.

Color: paleta de [2] colores principales, [ESPECIFICA COLORES O DESCRIBE EL ÁNIMO: azul profundo y cian eléctrico / negro y dorado / verde bosque y crema]. Debe funcionar también en una sola tinta negra.

Composición: centrado sobre fondo blanco liso, amplio espacio libre alrededor, equilibrio óptico perfecto, legible al reducirlo a 16 píxeles.

Formato: vectorial, alta resolución, sin fondo o fondo transparente, presentado como una única propuesta limpia y centrada.

Evitar: degradados complejos, texto pequeño ilegible, más de tres colores, iconos genéricos de banco de imágenes, sombras paralelas, efectos brillantes, marcas de agua, elementos recortados por el borde.

Genera [4] variaciones distintas de concepto, no cuatro versiones del mismo dibujo.`
  },
  {
    cat: 'Imágenes',
    name: 'Ilustración e interfaz de producto',
    desc: 'Para ilustraciones de estilo consistente y mockups de app o web.',
    text: `[ELIGE UNO Y BORRA EL OTRO]

OPCIÓN A — ILUSTRACIÓN
Ilustración digital de [ESCENA O CONCEPTO A REPRESENTAR], en estilo [flat design / isométrico / line art de trazo fino / acuarela digital / cómic / 3D suave tipo claymation].
Paleta: [COLOR PRINCIPAL], [COLOR SECUNDARIO] y [COLOR DE ACENTO], sobre fondo [COLOR O TRANSPARENTE].
Composición: [SUJETO] centrado, elementos secundarios [DESCRIBE], amplio espacio negativo para poder colocar texto encima a la [izquierda / derecha].
Detalles: trazos limpios y consistentes, sombras planas sin degradados complejos, esquinas redondeadas, iluminación uniforme.
Uso final: [ilustración para cabecera de blog / icono de sección / ilustración de estado vacío en una app].

OPCIÓN B — INTERFAZ
Mockup de interfaz de [aplicación web / app móvil iOS / panel de administración] para [PROPÓSITO DE LA APP].
Pantalla mostrada: [DESCRIBE QUÉ PANTALLA: login, dashboard con métricas, listado, detalle de producto].
Estilo visual: [modo oscuro elegante / modo claro minimalista], color de acento [COLOR], tipografía sans-serif geométrica, esquinas redondeadas de 12px, sombras suaves, mucho espacio en blanco.
Elementos visibles: [barra lateral de navegación, tarjetas de métricas, gráfico de líneas, tabla de datos, botón principal destacado].
Presentación: vista frontal limpia sobre fondo [COLOR SUAVE], alta resolución, bordes nítidos, aspecto de captura real de producto.

Evitar en ambos casos: texto ilegible o inventado, elementos desalineados, mezcla de estilos, marcas de agua, saturación excesiva.`
  },

  /* ------------------- VIDEO Y AUDIO ------------------- */
  {
    cat: 'Video y audio',
    name: 'Video con IA (toma cinematográfica)',
    desc: 'Estructura para Veo, Kling, Runway o Sora con movimiento de cámara y audio.',
    text: `TOMA: [DESCRIPCIÓN DE LA ESCENA EN UNA FRASE CLARA].

SUJETO: [QUIÉN O QUÉ APARECE, CON DETALLE DE APARIENCIA, VESTUARIO Y EXPRESIÓN. Si debe mantenerse consistente entre tomas, descríbelo siempre con las mismas palabras exactas].

ACCIÓN: [QUÉ OCURRE DURANTE LOS SEGUNDOS QUE DURA EL CLIP. Describe un solo movimiento continuo, no una secuencia de eventos].

ENTORNO: [LUGAR, HORA DEL DÍA, CLIMA, ELEMENTOS DE FONDO, ATMÓSFERA].

CÁMARA: plano [general / medio / primer plano / detalle], movimiento [fijo en trípode / travelling lateral lento / dolly de acercamiento / plano aéreo con dron / cámara en mano con ligero temblor / órbita alrededor del sujeto], lente [gran angular 24mm / 50mm natural / teleobjetivo 85mm], profundidad de campo [reducida con fondo desenfocado].

ILUMINACIÓN: [hora dorada cálida / luz dura de mediodía / interior con luz de neón / clave baja con contraluz / día nublado difuso]. Contraste [alto / suave].

ESTILO: [cinematográfico tipo largometraje / documental realista / anuncio publicitario pulido / animación 3D / estética de película analógica], gradación de color [DESCRIBE: tonos teal y naranja / desaturado y frío / cálido y nostálgico].

AUDIO: [sonido ambiente de LUGAR, música MOOD e INSTRUMENTOS, diálogo: "TEXTO EXACTO", efectos de sonido concretos].

DURACIÓN: [5 / 8 / 10] segundos. FORMATO: [16:9 horizontal / 9:16 vertical]. RITMO: [una sola toma continua sin cortes].

EVITAR: cortes de plano, cambios bruscos de iluminación, deformación de manos y rostros, texto en pantalla, movimiento de cámara excesivo, cambios de identidad del sujeto.`
  },
  {
    cat: 'Video y audio',
    name: 'Guion para video corto (Reels / Shorts)',
    desc: 'Guion vertical con gancho, desarrollo y cierre, plano a plano.',
    text: `Escribe el guion completo de un video vertical de [30 / 45 / 60] segundos para [Instagram Reels / TikTok / YouTube Shorts].

TEMA: [DE QUÉ TRATA]
OBJETIVO: [EDUCAR / VENDER / ENTRETENER / GANAR SEGUIDORES]
AUDIENCIA: [A QUIÉN LE HABLAS, QUÉ LE PREOCUPA, QUÉ NIVEL TIENE]
TONO: [CERCANO / TÉCNICO / DIVERTIDO / DIRECTO]
LO QUE QUIERO QUE HAGAN AL FINAL: [SEGUIR / COMENTAR / VISITAR ENLACE]

ENTREGA UNA TABLA CON ESTAS COLUMNAS
Tiempo | Texto que digo (literal) | Qué se ve en pantalla | Texto sobreimpreso | Nota de edición

REGLAS DEL GUION
1. Los primeros 3 segundos deben cortar el scroll: empieza con una afirmación concreta, un dato sorprendente o el resultado final. Nunca con "hola, hoy os voy a hablar de".
2. Una sola idea en todo el video. Si hay dos, descarta la más débil.
3. Frases cortas, habladas, como se dice en voz alta. Nada de lenguaje de artículo escrito.
4. Cambio visual cada 2 o 3 segundos para sostener la atención.
5. El texto sobreimpreso no repite lo que digo: lo refuerza o lo contradice para crear tensión.
6. Cierra con una llamada a la acción específica, no genérica.

ADEMÁS ENTREGA
- 3 ganchos alternativos para los primeros 3 segundos.
- Un título y descripción optimizados con 5 hashtags relevantes.
- Sugerencia de música o ritmo de edición que encaje.`
  },
  {
    cat: 'Video y audio',
    name: 'Canción con IA (Suno / Udio)',
    desc: 'Prompt de estilo musical y letra estructurada por secciones.',
    text: `ESTILO (para el campo de estilo o género):
[GÉNERO PRINCIPAL, EJ. indie pop] con influencias de [SUBGÉNERO], tempo [80-90 / 100-120 / 128-140] BPM, tonalidad [mayor luminosa / menor melancólica], voz [femenina cálida / masculina grave / dueto / coro], instrumentación [guitarra acústica, bajo, batería suave, sintetizador de fondo, cuerdas], producción [limpia y moderna / analógica y con textura / lo-fi], ambiente [nostálgico / energético / íntimo / épico]. Idioma: [español].

LETRA (para el campo de letra, respetando las etiquetas de sección):

[Intro]
[Instrumental suave, 4 compases]

[Verso 1]
[4 LÍNEAS QUE PRESENTEN LA SITUACIÓN CON IMÁGENES CONCRETAS, NO ABSTRACCIONES]

[Pre-estribillo]
[2 LÍNEAS QUE CREEN TENSIÓN Y ANUNCIEN EL ESTRIBILLO]

[Estribillo]
[4 LÍNEAS CON LA IDEA CENTRAL, LA FRASE MÁS PEGADIZA Y REPETIBLE]

[Verso 2]
[4 LÍNEAS QUE HAGAN AVANZAR LA HISTORIA, NO QUE REPITAN EL VERSO 1]

[Pre-estribillo]
[LAS MISMAS 2 LÍNEAS O UNA VARIACIÓN]

[Estribillo]
[REPITE EL ESTRIBILLO]

[Puente]
[3 O 4 LÍNEAS CON UN GIRO EMOCIONAL O UN CAMBIO DE PERSPECTIVA]

[Estribillo final]
[REPITE, CON MÁS INTENSIDAD]

[Outro]
[1 O 2 LÍNEAS QUE CIERREN, O INSTRUMENTAL QUE SE APAGA]

TEMA DE LA CANCIÓN: [SOBRE QUÉ TRATA]
EMOCIÓN QUE DEBE DEJAR: [QUÉ QUIERES QUE SIENTA QUIEN LA ESCUCHE]
REFERENCIAS: suena como [ARTISTA 1] mezclado con [ARTISTA 2].`
  },

  /* ------------------- ESCRITURA Y NEGOCIO ------------------- */
  {
    cat: 'Escritura',
    name: 'Redactar un texto que no suene a IA',
    desc: 'Escribe contenido con voz propia, estructura clara y sin frases vacías.',
    text: `Escribe [UN ARTÍCULO / UN POST / UN CORREO / UNA PÁGINA DE VENTA] sobre [TEMA].

DESTINATARIO: [QUIÉN LO VA A LEER, QUÉ SABE, QUÉ LE IMPORTA, EN QUÉ MOMENTO LO LEE]
OBJETIVO: [QUÉ QUIERO QUE PIENSE, SIENTA O HAGA DESPUÉS DE LEERLO]
EXTENSIÓN: [NÚMERO] palabras
TONO: [PROFESIONAL CERCANO / TÉCNICO / DIRECTO / DIVULGATIVO]

MATERIA PRIMA QUE DEBES USAR
- Puntos que deben aparecer sí o sí: [LISTA]
- Datos, cifras o ejemplos reales disponibles: [PÉGALOS AQUÍ]
- Mi experiencia u opinión sobre el tema: [ESCRIBE 3 O 4 LÍNEAS CON TU PUNTO DE VISTA]

ESTRUCTURA
1. Apertura que enganche en las dos primeras frases, planteando el problema real del lector.
2. Desarrollo con subtítulos descriptivos, un argumento por sección.
3. Al menos un ejemplo concreto por idea importante.
4. Cierre con una conclusión que aporte algo, no un resumen de lo dicho.

PROHIBIDO
- Frases de relleno como "en el mundo actual", "en la era digital", "no es ningún secreto que", "en resumen podemos decir que".
- Listas de tres adjetivos seguidos sin sustancia.
- Afirmaciones genéricas que valdrían para cualquier tema.
- Empezar párrafos con "Además", "Por otro lado" o "Sin embargo" de forma sistemática.
- Emojis, a menos que te los pida.

REGLAS DE ESTILO
- Alterna frases cortas y largas. Que el ritmo no sea uniforme.
- Voz activa siempre que se pueda.
- Si haces una afirmación fuerte, respáldala con un dato o un ejemplo.
- Prefiere una palabra sencilla a una rebuscada.
- Si un párrafo no aporta nada nuevo, elimínalo antes de entregármelo.`
  },
  {
    cat: 'Escritura',
    name: 'Análisis de datos y hallazgos',
    desc: 'Convierte una tabla o CSV en conclusiones accionables, no en descripciones obvias.',
    text: `Analiza estos datos como lo haría un analista senior. No quiero que me describas la tabla: quiero que me digas qué está pasando y qué hacer.

DATOS
"""
[PEGA AQUÍ LOS DATOS, O DESCRIBE EL ARCHIVO ADJUNTO Y SUS COLUMNAS]
"""

CONTEXTO DEL NEGOCIO
- Qué representan estos datos: [EXPLICACIÓN]
- Periodo que cubren: [FECHAS]
- Cómo se recogieron: [MÉTODO, Y SI HAY SESGOS CONOCIDOS]
- Decisión que tengo que tomar con esto: [CUÁL]

ENTREGA
1. CALIDAD DE LOS DATOS: valores faltantes, duplicados, valores atípicos e incoherencias. Dime si algo hace que el análisis no sea fiable ANTES de seguir.
2. RESUMEN DESCRIPTIVO: las métricas clave con sus cifras exactas.
3. HALLAZGOS: entre 3 y 5, ordenados por relevancia para mi decisión. Cada uno con: qué observas, la cifra que lo respalda, y por qué importa.
4. RELACIONES: correlaciones o patrones relevantes. Distingue explícitamente correlación de causalidad y di qué haría falta para demostrar la causa.
5. LO QUE NO SE VE: qué segmentación adicional podría estar escondiendo un efecto (paradoja de Simpson, promedios que ocultan extremos).
6. RECOMENDACIONES: acciones concretas, cada una ligada al hallazgo que la sustenta, priorizadas por impacto y esfuerzo.
7. LIMITACIONES: qué NO se puede concluir con estos datos. Sé explícito.
8. SIGUIENTE PASO: qué dato adicional pediría y qué pregunta respondería.

Si la muestra es demasiado pequeña o el periodo demasiado corto para concluir algo, dilo claramente en lugar de forzar conclusiones.`
  },
  {
    cat: 'Escritura',
    name: 'Plan de aprendizaje en 30 días',
    desc: 'Ruta realista para aprender una habilidad, con proyectos y criterios de progreso.',
    text: `Diseña un plan de aprendizaje de [30 / 60 / 90] días para dominar [HABILIDAD O TECNOLOGÍA] a nivel [SUFICIENTE PARA TRABAJAR / INTERMEDIO / AVANZADO].

MI PUNTO DE PARTIDA
- Lo que ya sé del tema: [DESCRÍBELO CON HONESTIDAD]
- Conocimientos relacionados que puedo aprovechar: [LISTA]
- Tiempo real disponible: [HORAS AL DÍA] entre semana y [HORAS] los fines de semana
- Cómo aprendo mejor: [LEYENDO / VIENDO VIDEOS / CONSTRUYENDO COSAS / MEZCLA]
- Para qué lo necesito: [OBJETIVO CONCRETO Y FECHA]

ENTREGA
1. DIAGNÓSTICO: qué separa mi nivel actual del objetivo, dividido en bloques de conocimiento.
2. RUTA POR SEMANAS: para cada semana indica el tema, los conceptos concretos, el tiempo estimado y qué debo ser capaz de hacer al terminarla.
3. PROYECTOS: un proyecto práctico por semana, de dificultad creciente, que use lo aprendido. Descríbelos con requisitos concretos, no como ideas vagas.
4. RECURSOS: para cada bloque, la mejor documentación oficial, un curso y una fuente de práctica. Prioriza recursos gratuitos y de calidad contrastada. Si no estás seguro de que un recurso exista actualmente, dilo.
5. AUTOEVALUACIÓN: cómo compruebo cada semana que realmente aprendí y no solo consumí contenido.
6. TRAMPAS: los 3 errores típicos de quien aprende esto y cómo evitarlos.
7. AJUSTE: qué recortar si me atraso una semana, y qué es innegociable.

Sé realista con el tiempo que tengo. Si mi objetivo no es alcanzable en ese plazo, dímelo y propón una meta que sí lo sea.`
  }
];
