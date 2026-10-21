export const NEWS = [
  {
    id: "n-feature",
    cat: "proximos",
    featured: true,
    ticker: "Próximo: Noche de Tambores · 7 nov",
    kicker: "Próxima fecha · Concierto",
    title: "Noche de Tambores",
    meta: "Sábado 7 de noviembre de 2026 · 7:00 p. m. · Casa Arte Maestro, barrio Prado",
    body: [
      "Tres repertorios en una sola noche. School MC abre con banda completa, Yurumí lleva marimba y cununos al centro de la sala y Lucía Cuama cierra con el coro de cantaoras.",
      "Habrá mesa de merch de cada artista en el vestíbulo y un conversatorio de 20 minutos antes del último set.",
    ],
    facts: [
      ["Entradas", "Desde $45.000"],
      ["Puertas", "6:00 p. m."],
      ["Aforo", "600 personas"],
      ["Edad", "Todo público"],
    ],
    leaf: ["NOV", "7", "Sáb", "Noche de Tambores"],
  },

  {
    id: "n-cronica",
    cat: "cronicas",
    type: "clip",
    tape: true,
    ticker: "Crónica: Raíz Viva reunió 1.240 personas",
    kicker: "Crónica · Lo que pasó",
    title: "Raíz Viva: 1.240 personas y una lluvia que nadie quiso esquivar",
    meta: "27 de septiembre de 2026 · Parque Cultural, Prado",
    mono: "RV",
    stamp: "27 SEP",
    dek: "Catorce artistas, seis horas de música y un set de Mar de Leva que siguió bajo el aguacero.",
    stats: [
      ["1.240", "asistentes"],
      ["14", "artistas"],
      ["6 h", "de música"],
    ],
    pull: "«Nadie abrió un paraguas. Cantamos mojados».",
    body: [
      "Raíz Viva cerró su tercera edición con 1.240 asistentes a lo largo de seis horas. La lluvia llegó durante el set de Mar de Leva y el público se quedó en la plaza hasta el último tema.",
      "Yurumí presentó por primera vez la versión extendida de «Río Adentro» y School MC invitó a tres estudiantes del barrio a rimar en tarima.",
    ],
    facts: [
      ["Asistentes", "1.240"],
      ["Artistas", "14"],
      ["Duración", "6 horas"],
      ["Lugar", "Parque Cultural"],
    ],
  },

  {
    id: "n-vinilo",
    cat: "lanzamientos",
    type: "vinyl",
    ticker: "Estreno: «Tambor Eléctrico» en vinilo · 30 oct",
    kicker: "Lanzamiento · EP en vinilo",
    title: "«Tambor Eléctrico»",
    by: "Palenque Beat",
    mono: "PB",
    when: "Sale el 30 de octubre · 300 copias numeradas",
    tracks: [
      "Palenque Prende",
      "Champeta Cósmica",
      "Cuerpo de Tambor",
      "Marea Baja",
      "Tambor Eléctrico",
    ],
    meta: "Estreno 30 de octubre de 2026 · Preventa desde el 23 de octubre",
    body: [
      "Palenque Beat publica su primer disco físico: cinco temas de champeta con electrónica, prensados en vinilo de 12 pulgadas en una tirada de 300 copias numeradas.",
      "La preventa abre el 23 de octubre. Quien compre el vinilo recibe un código de descarga y un póster serigrafiado.",
    ],
    facts: [
      ["Formato", 'Vinilo 12"'],
      ["Tirada", "300 copias"],
      ["Temas", "5"],
      ["Estreno", "30 oct 2026"],
    ],
    leaf: ["OCT", "30", "Vie", "Vinilo «Tambor Eléctrico»"],
  },

  {
    id: "n-video",
    cat: "lanzamientos",
    type: "video",
    ticker: "Estreno: videoclip «Río Adentro» · 22 oct",
    kicker: "Lanzamiento · Videoclip",
    title: "«Río Adentro»",
    by: "Yurumí",
    when: "Estreno el jueves 22 de octubre · 8:00 p. m.",
    meta: "Jueves 22 de octubre de 2026 · 8:00 p. m. · Canal oficial",
    body: [
      "El videoclip se grabó en tres días entre Quibdó y la orilla del río. Participan doce bailarines y cinco músicos de la comunidad.",
      "Antes del estreno habrá un chat en vivo con el colectivo audiovisual que lo realizó.",
    ],
    facts: [
      ["Estreno", "22 oct · 8:00 p. m."],
      ["Duración", "4:12"],
      ["Dirección", "Colectivo Ojo de Agua"],
      ["Locación", "Quibdó, Chocó"],
    ],
    leaf: ["OCT", "22", "Jue", "Estreno «Río Adentro»"],
  },

  {
    id: "n-saludos",
    cat: "novedades",
    type: "sticky",
    tape: true,
    ticker: "Novedad: ya puedes pedir saludos personalizados",
    kicker: "Novedad · Servicios",
    title: "Ya puedes pedir un saludo",
    meta: "Disponible desde hoy",
    short:
      "Un video de tu artista favorito con tu nombre. Cumpleaños, grados, sorpresas.",
    price: "Desde $100.000",
    body: [
      "Cada artista graba un video de 30 a 60 segundos con el nombre y la ocasión que tú escojas. Sirve para cumpleaños, grados, aniversarios y sorpresas.",
      "La entrega toma 5 días hábiles y llega como archivo listo para compartir.",
    ],
    facts: [
      ["Desde", "$100.000"],
      ["Entrega", "5 días hábiles"],
      ["Duración", "30 a 60 s"],
    ],
  },

  {
    id: "n-convocatoria",
    cat: "convocatorias",
    type: "ticket",
    ticker: "Convocatoria: Escenarios Afro 2027 cierra 30 nov",
    kicker: "Convocatoria",
    title: "Escenarios Afro 2027 abre inscripciones",
    deadline: "CIERRA 30·NOV",
    reqs: [
      "3 enlaces de tu música",
      "Ficha técnica del proyecto",
      "Video de presentación (2 min)",
    ],
    meta: "Cierre el 30 de noviembre de 2026 · Inscripción en línea",
    body: [
      "Doce proyectos musicales afrodescendientes de Medellín y el Valle de Aburrá recibirán cachet y circulación en tres ciudades durante 2027.",
      "Se piden tres enlaces de música, una ficha técnica y un video de presentación de máximo dos minutos.",
    ],
    facts: [
      ["Cupos", "12"],
      ["Cierre", "30 nov 2026"],
      ["Premio", "Cachet + circulación en 3 ciudades"],
      ["Resultados", "15 ene 2027"],
    ],
    leaf: ["NOV", "30", "Lun", "Cierra Escenarios Afro 2027"],
  },

  {
    id: "n-premio",
    cat: "novedades",
    type: "medal",
    ticker: "Reconocimiento: Lucía Cuama, nominada a los Premios Manglar",
    kicker: "Reconocimiento",
    title: "Lucía Cuama, nominada a Mejor Cantaora Tradicional",
    sub: "Premios Manglar 2026 · Gala el 12 de dic",
    meta: "Gala el 12 de diciembre de 2026",
    body: [
      "Los Premios Manglar anunciaron las nominaciones de su categoría de música tradicional. Lucía Cuama compite con otras cuatro intérpretes del Caribe y el Pacífico.",
      "La gala se transmitirá en directo y Arte Maestro abrirá una sala de proyección para el público.",
    ],
    facts: [
      ["Categoría", "Mejor cantaora tradicional"],
      ["Nominadas", "5"],
      ["Gala", "12 dic 2026"],
    ],
  },

  {
    id: "n-gira",
    cat: "proximos",
    type: "route",
    tape: true,
    ticker: "Gira Sur–Sur: Yurumí recorre cinco ciudades",
    kicker: "Gira · Yurumí",
    title: "Gira Sur–Sur",
    meta: "Del 14 al 28 de noviembre de 2026 · 5 ciudades",
    stops: [
      ["Quibdó", "14 nov · Arranque"],
      ["Cali", "17 nov"],
      ["Buenaventura", "20 nov"],
      ["Tumaco", "23 nov"],
      ["Medellín", "28 nov · Cierre"],
    ],
    body: [
      "Yurumí recorre el Pacífico en cinco fechas y cierra en Medellín. En cada ciudad comparte tarima con un grupo local.",
      "Entre fecha y fecha habrá dos conversatorios y un taller abierto de marimba.",
    ],
    facts: [
      ["Ciudades", "5"],
      ["Fechas", "14 a 28 nov"],
      ["Invitados", "Grupos locales"],
      ["Extras", "2 conversatorios + taller"],
    ],
    leaf: ["NOV", "14", "Sáb", "Arranca la gira Sur–Sur"],
  },

  {
    id: "n-alianza",
    cat: "lanzamientos",
    type: "collab",
    ticker: "Sencillo: School MC × Mar de Leva · 6 nov",
    kicker: "Sencillo · Colaboración",
    title: "School MC × Mar de Leva presentan «Escuela de Marea»",
    song: "«Escuela de Marea»",
    line: "Sencillo · sale el 6 de noviembre",
    meta: "Sale el 6 de noviembre de 2026 · Lanzamiento en vivo en Casa Arte Maestro",
    body: [
      "Dos generaciones del rap y el trap del Pacífico en una misma canción. School MC escribió los versos sobre el aula y el barrio; Mar de Leva puso el coro y la base.",
      "Habrá lanzamiento en vivo en Casa Arte Maestro el 6 de noviembre, un día antes de Noche de Tambores.",
    ],
    facts: [
      ["Formato", "Sencillo"],
      ["Producción", "Mar de Leva"],
      ["Letra", "School MC"],
      ["Estreno", "6 nov 2026"],
    ],
    leaf: ["NOV", "6", "Vie", "Sencillo «Escuela de Marea»"],
  },

  {
    id: "n-prensa",
    cat: "novedades",
    type: "press",
    ticker: "Prensa: tres medios cubren al catálogo",
    kicker: "Prensa",
    title: "Arte Maestro en los medios",
    meta: "Esta semana",
    items: [
      ["Revista La Marea", "El rap que se volvió salón de clase"],
      ["Radio Raíz FM", "Lucía Cuama y el bullerengue como archivo vivo"],
      ["Crónicas del Valle", "Quién guarda el tambor en Medellín"],
    ],
    body: [
      "Tres medios cubrieron esta semana a los artistas del catálogo. Las notas completas se publicarán en la sección de prensa de cada portafolio.",
    ],
    facts: [
      ["Medios", "3"],
      ["Artistas", "3"],
      ["Nota", "Medios de ejemplo"],
    ],
  },

  {
    id: "n-cifra",
    cat: "novedades",
    type: "big",
    ticker: "Hito: «Currulao Nocturno» llega al millón de reproducciones",
    kicker: "Hito",
    title: "1.000.000 de reproducciones para «Currulao Nocturno»",
    num: "1M",
    label: "de reproducciones",
    track: "«Currulao Nocturno» · Yurumí",
    meta: "Alcanzado el 9 de octubre de 2026",
    body: [
      "El tema de Yurumí llegó al millón de reproducciones en plataformas, catorce meses después de su lanzamiento. Cerca de la mitad de las escuchas vienen de Colombia y el resto de México, España y Estados Unidos.",
    ],
    facts: [
      ["Reproducciones", "1.000.000"],
      ["Tiempo", "14 meses"],
      ["País principal", "Colombia"],
    ],
  },

  {
    id: "n-alerta",
    cat: "alertas",
    type: "hazard",
    ticker: "Aviso: el taller de percusión pasa al domingo 18",
    kicker: "Aviso · Cambio de fecha",
    title: "El taller de percusión pasa al domingo",
    oldD: "Sáb 17 oct",
    newD: "Dom 18 oct",
    note: "Por pronóstico de lluvias. El horario se mantiene de 10:00 a. m. a 1:00 p. m.",
    meta: "Antes: sábado 17 de octubre · Ahora: domingo 18 de octubre · Parque Cultural",
    body: [
      "Por pronóstico de lluvias, el taller abierto de percusión se mueve un día. Se mantiene el horario de 10:00 a. m. a 1:00 p. m.",
      "Quienes ya se inscribieron no tienen que hacer nada. Los cupos siguen disponibles.",
    ],
    facts: [
      ["Nueva fecha", "Dom 18 oct"],
      ["Horario", "10:00 a. m. a 1:00 p. m."],
      ["Costo", "Gratis"],
      ["Cupos", "30"],
    ],
    leaf: ["OCT", "18", "Dom", "Taller de percusión (nueva fecha)"],
  },

  {
    id: "n-memoria",
    cat: "memoria",
    type: "polaroid",
    tape: true,
    ticker: "Archivo: hace 10 años, el primer toque de School MC",
    kicker: "Archivo · Hace 10 años",
    title: "El primer toque de School MC fue en una plaza",
    year: "2016",
    cap: "Plaza del barrio, 2016. Un parlante prestado y cuatro letras.",
    meta: "2016 · Plaza del barrio",
    body: [
      "Hace diez años School MC rimó por primera vez frente a un público que no conocía. Tenía un parlante prestado y cuatro letras escritas en una libreta.",
      "Arte Maestro recopila fotos y recuerdos de esa época. Si estuviste ahí, puedes enviar tu imagen.",
    ],
    facts: [
      ["Año", "2016"],
      ["Lugar", "Plaza del barrio"],
      ["Letras en la libreta", "4"],
    ],
  },

  {
    id: "n-merch",
    cat: "novedades",
    type: "tag",
    ticker: "Merch: Hoodie Marea en preventa por 48 horas",
    kicker: "Merch · Preventa",
    title: "Hoodie Marea",
    price: "$140.000",
    tagline: "preventa por 48 horas",
    units: ["100 unidades", "hasta el 16 oct"],
    meta: "Preventa hasta el 16 de octubre de 2026",
    body: [
      "Mar de Leva abre preventa de su hoodie de fleece pesado, bordado en pequeñas tiradas. Se producen solo 100 unidades.",
      "Se entrega durante Noche de Tambores o por envío a todo el país.",
    ],
    facts: [
      ["Precio", "$140.000"],
      ["Unidades", "100"],
      ["Preventa", "Hasta el 16 oct"],
      ["Entrega", "7 nov"],
    ],
  },

  {
    id: "n-taller",
    cat: "proximos",
    type: "notebook",
    ticker: "Taller gratis: tu canción también es un contrato · 28 oct",
    kicker: "Formación · Taller",
    title: "Tu canción también es un contrato",
    lines: [
      "Cómo registrar una obra.",
      "Qué cobra una sociedad de gestión.",
      "Qué firmar antes de subir un tema.",
    ],
    when: "Mié 28 oct · 6:00 p. m. · Gratis · 40 cupos",
    meta: "Miércoles 28 de octubre de 2026 · 6:00 p. m. · Casa Arte Maestro",
    body: [
      "Una abogada de derechos de autor explica cómo registrar una obra, qué cobra una sociedad de gestión y qué firmar antes de subir un tema a una plataforma.",
      "Trae la letra o el audio de una canción propia para hacer el registro en vivo.",
    ],
    facts: [
      ["Costo", "Gratis"],
      ["Cupos", "40"],
      ["Duración", "2 horas"],
      ["Inscripción", "En línea"],
    ],
    leaf: ["OCT", "28", "Mié", "Taller de derechos de autor"],
  },

  {
    id: "n-quote",
    cat: "novedades",
    type: "quote",
    ticker: "Entrevista: «El tambor no se aprende, se hereda»",
    kicker: "Entrevista",
    title: "«El tambor no se aprende, se hereda»",
    text: "El tambor no se aprende, se hereda.",
    who: "Lucía Cuama · Radio Raíz FM",
    meta: "Entrevista en Radio Raíz FM",
    body: [
      "En una conversación de una hora, Lucía Cuama habló de las cantaoras que la formaron y del bullerengue como forma de llevar la cuenta de la vida.",
      "La entrevista completa está disponible en el archivo de la emisora.",
    ],
    facts: [
      ["Duración", "1 hora"],
      ["Emisora", "Radio Raíz FM"],
      ["Tema", "Bullerengue y memoria"],
    ],
  },

  {
    id: "n-bienvenida",
    cat: "novedades",
    type: "burst",
    ticker: "Nuevo en Arte Maestro: Mar de Leva entra al catálogo",
    kicker: "Nuevo en Arte Maestro",
    title: "Mar de Leva entra al catálogo",
    short:
      "Pacífico urbano y trap tropical desde Buenaventura y Medellín. Ya puede contratarse.",
    meta: "Desde hoy",
    body: [
      "El proyecto de Buenaventura y Medellín suma su portafolio con biografía, videoclips y merch. Ya puede contratarse para showcase, campaña visual y marketing.",
    ],
    facts: [
      ["Género", "Pacífico urbano · Trap tropical"],
      ["Ciudades", "Buenaventura · Medellín"],
      ["Servicios", "3"],
    ],
  },

  {
    id: "n-envivo",
    cat: "proximos",
    type: "live",
    ticker: "En vivo: School MC y Mar de Leva en Radio Raíz FM · 15 oct",
    kicker: "En vivo",
    title: "School MC y Mar de Leva en cabina",
    when: "Jue 15 oct · 8:00 p. m.",
    station: "Radio Raíz FM",
    meta: "Jueves 15 de octubre de 2026 · 8:00 p. m. · Radio Raíz FM",
    body: [
      "School MC y Mar de Leva visitan la cabina de Radio Raíz FM para tocar el primer fragmento de su sencillo y responder llamadas del público.",
      "Se transmite por la emisora y por sus redes.",
    ],
    facts: [
      ["Hora", "8:00 p. m."],
      ["Emisora", "Radio Raíz FM"],
      ["Invitados", "School MC y Mar de Leva"],
      ["Duración", "1 hora"],
    ],
    leaf: ["OCT", "15", "Jue", "En vivo en Radio Raíz FM"],
  },

  {
    id: "n-homenaje",
    cat: "memoria",
    type: "memorial",
    ticker: "Memoria: noche de homenaje a las cantaoras mayores · 5 dic",
    kicker: "Memoria · Homenaje",
    title: "Noche de memoria para las cantaoras mayores",
    when: "Sáb 5 dic · 6:00 p. m. · Casa Arte Maestro · Entrada libre",
    meta: "Sábado 5 de diciembre de 2026 · 6:00 p. m. · Casa Arte Maestro",
    body: [
      "Una noche de canto y relato dedicada a las cantaoras que sostuvieron el bullerengue y los cantos de trabajo en Medellín. Habrá exposición de fotografías y una mesa de memoria abierta.",
      "La entrada es libre hasta completar el aforo.",
    ],
    facts: [
      ["Entrada", "Libre"],
      ["Aforo", "200"],
      ["Formato", "Canto, relato y exposición"],
    ],
    leaf: ["DIC", "5", "Sáb", "Noche de memoria"],
  },

  {
    id: "n-recibo",
    cat: "cronicas",
    type: "receipt",
    ticker: "Crónica: la Ronda de Industria #1 dejó 3 contratos",
    kicker: "Crónica · Ronda de Industria #1",
    title: "El recibo de la primera Ronda",
    lines: [
      ["Programadores", "12"],
      ["Showcases de 25 min", "5"],
      ["Reuniones agendadas", "38"],
      ["Cartas de interés", "9"],
    ],
    total: ["Contratos firmados", "3"],
    meta: "3 de octubre de 2026 · Casa Arte Maestro",
    body: [
      "Doce programadores y curadores escucharon cinco showcases de 25 minutos. Quedaron 38 reuniones de 15 minutos agendadas por los propios artistas.",
      "Tres contratos se firmaron esa semana y nueve organizaciones pidieron propuesta formal. La segunda Ronda será el 21 de noviembre.",
    ],
    facts: [
      ["Programadores", "12"],
      ["Showcases", "5"],
      ["Reuniones", "38"],
      ["Contratos", "3"],
    ],
  },
];

export const CATEGORIES = [
  ["todo", "Todo"],
  ["proximos", "Próximos"],
  ["cronicas", "Crónicas"],
  ["lanzamientos", "Lanzamientos"],
  ["novedades", "Novedades"],
  ["convocatorias", "Convocatorias"],
  ["alertas", "Alertas"],
  ["memoria", "Memoria"],
];

export const ROTATIONS = [
  -2.4, 1.8, -1.2, 2.6, -1.9, 0.9, -2.8, 1.4, -0.8, 2.2, -1.6, 1.1,
];

export const AGENDA_ORDER = [
  "n-envivo",
  "n-alerta",
  "n-video",
  "n-taller",
  "n-vinilo",
  "n-alianza",
  "n-feature",
  "n-gira",
  "n-convocatoria",
  "n-homenaje",
];

export const CARD_TYPES = [
  {
    id: "clip",
    label: "Crónica / Recorte",
  },
  {
    id: "vinyl",
    label: "Lanzamiento / Vinilo",
  },
  {
    id: "video",
    label: "Video / Estreno",
  },
  {
    id: "sticky",
    label: "Nota / Post-it",
  },
  {
    id: "ticket",
    label: "Convocatoria / Ticket",
  },
  {
    id: "medal",
    label: "Premio / Reconocimiento",
  },
  {
    id: "route",
    label: "Gira / Ruta",
  },
  {
    id: "collab",
    label: "Colaboración",
  },
  {
    id: "press",
    label: "Prensa",
  },
  {
    id: "big",
    label: "Cifra / Hito",
  },
  {
    id: "hazard",
    label: "Alerta / Cambio",
  },
  {
    id: "polaroid",
    label: "Memoria / Polaroid",
  },
  {
    id: "tag",
    label: "Merch / Etiqueta",
  },
  {
    id: "notebook",
    label: "Taller / Cuaderno",
  },
  {
    id: "quote",
    label: "Entrevista / Cita",
  },
  {
    id: "burst",
    label: "Nuevo artista / Novedad",
  },
  {
    id: "live",
    label: "En vivo / Radio",
  },
  {
    id: "memorial",
    label: "Memoria / Homenaje",
  },
  {
    id: "receipt",
    label: "Balance / Recibo",
  },
];

export const CATEGORY_OPTIONS = [
  ["proximos", "Próximos"],
  ["cronicas", "Crónicas"],
  ["lanzamientos", "Lanzamientos"],
  ["novedades", "Novedades"],
  ["convocatorias", "Convocatorias"],
  ["alertas", "Alertas"],
  ["memoria", "Memoria"],
];

export const INITIAL_FORM = {
  type: "clip",
  cat: "novedades",

  title: "",
  kicker: "",
  ticker: "",

  artist: "",
  meta: "",
  summary: "",

  body1: "",
  body2: "",
};

export const AGENDA_ROTATIONS = [-2, 1.5, -1, 2, -1.5, 1];
