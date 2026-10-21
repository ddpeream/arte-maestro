// Catálogo local de ejemplo. Precios en COP sujetos a confirmación.
export const serviceGroups = [
  {
    id: "todos",
    label: "Todo",
  },
  {
    id: "escenario",
    label: "Escenario",
  },
  {
    id: "creacion",
    label: "Creación",
  },
  {
    id: "fans",
    label: "Fans",
  },
  {
    id: "marketing",
    label: "Marketing",
  },
];

export const services = [
  {
    id: "showcase",
    group: "escenario",
    icon: "Sparkles",
    title: "Showcase",
    tagline:
      "Presentación corta y curada para marcas, festivales y aliados de la industria.",
    includes: [
      "Set de 25 a 35 minutos",
      "Rider técnico básico incluido",
      "Material gráfico para difusión",
      "Registro fotográfico del evento",
    ],
    duration: "30 min",
    format: "Presencial",
    ideal: "Lanzamientos, ruedas de negocio y activaciones",
    offers: [
      {
        artistId: "school-mc",
        price: 1800000,
        note: "Set con banda en vivo y DJ.",
      },
    ],
  },
  {
    id: "concierto",
    group: "escenario",
    icon: "Music2",
    title: "Concierto",
    tagline:
      "Show completo con producción, repertorio extendido y experiencia de público.",
    includes: [
      "Show de 60 a 90 minutos",
      "Repertorio propio",
      "Pasada de sonido y producción técnica",
      "Coordinación previa del espectáculo",
    ],
    duration: "60–90 min",
    format: "Presencial / Streaming",
    ideal: "Teatros, festivales y eventos corporativos",
    offers: [
      {
        artistId: "school-mc",
        price: 4500000,
        note: "Formato de banda en vivo.",
      },
    ],
  },
  {
    id: "conversatorio",
    group: "escenario",
    icon: "MessageSquare",
    title: "Conversatorio",
    tagline:
      "Charla abierta sobre memoria, territorio y oficio musical con la voz del artista.",
    includes: [
      "Charla de 45 a 60 minutos",
      "Tema y enfoque acordados previamente",
      "Espacio de preguntas del público",
      "Posibilidad de formato presencial o virtual",
    ],
    duration: "45–60 min",
    format: "Presencial / Virtual",
    ideal: "Universidades, bibliotecas, colegios y museos",
    offers: [
      {
        artistId: "school-mc",
        price: 800000,
        note: "Rap, escuela, territorio y procesos creativos.",
      },
    ],
  },
  {
    id: "concierto-conversatorio",
    group: "escenario",
    icon: "Mic",
    title: "Concierto-conversatorio",
    tagline:
      "Música y palabra en un mismo formato: canciones que se explican mientras suenan.",
    includes: [
      "Formato híbrido musical y conversacional",
      "Intervenciones habladas entre canciones",
      "Construcción temática previa",
      "Espacio de interacción con el público",
    ],
    duration: "75 min",
    format: "Presencial",
    ideal: "Centros culturales, festivales de memoria y aulas",
    offers: [],
  },
  {
    id: "campana-visual",
    group: "creacion",
    icon: "Video",
    title: "Campaña visual",
    tagline:
      "Imagen y video con artistas como rostro y voz de una marca o proyecto.",
    includes: [
      "Sesión de fotografía y video",
      "Producción de contenido audiovisual",
      "Fotografías editadas",
      "Uso pactado de imagen",
    ],
    duration: "Según proyecto",
    format: "Producción audiovisual",
    ideal: "Marcas, organizaciones y campañas institucionales",
    offers: [
      {
        artistId: "school-mc",
        price: 3100000,
        note: "Puede incluir composición o rima original para la campaña.",
      },
    ],
  },
  {
    id: "jingle",
    group: "creacion",
    icon: "Radio",
    title: "Jingle",
    tagline:
      "Música original de corta duración con la identidad sonora de una marca.",
    includes: [
      "Composición y grabación original",
      "Versiones adaptadas a diferentes formatos",
      "Una ronda inicial de ajustes",
      "Entrega digital en alta calidad",
    ],
    duration: "Entrega acordada",
    format: "Digital · WAV / MP3",
    ideal: "Radio, pauta digital, podcasts y eventos",
    offers: [
      {
        artistId: "school-mc",
        price: 1500000,
        note: "Rima original y producción musical.",
      },
    ],
  },
  {
    id: "saludos",
    group: "fans",
    icon: "Gift",
    title: "Saludos personalizados",
    tagline:
      "Video corto del artista para cumpleaños, grados, aniversarios o sorpresas.",
    includes: [
      "Video personalizado",
      "Nombre y ocasión incluidos",
      "Archivo listo para compartir",
      "Entrega digital",
    ],
    duration: "30–60 s",
    format: "Video digital",
    ideal: "Fans, regalos y mensajes especiales",
    offers: [
      {
        artistId: "school-mc",
        price: 120000,
        note: "Saludo personalizado con posibilidad de formato rimado.",
      },
    ],
  },
  {
    id: "marketing",
    group: "marketing",
    icon: "Megaphone",
    title: "Campaña de marketing",
    tagline:
      "Artistas como aliados y embajadores de contenido, difusión y activaciones.",
    includes: [
      "Diseño de campaña",
      "Contenido para redes sociales",
      "Activación digital o presencial",
      "Seguimiento del proceso",
    ],
    duration: "Según campaña",
    format: "Digital + presencial",
    ideal: "Lanzamientos, eventos y causas sociales",
    offers: [
      {
        artistId: "school-mc",
        price: 5000000,
        note: "Contenido artístico, educativo y comunitario.",
      },
    ],
  },
];

