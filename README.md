# Asistente de Ajedrez

Una aplicación web asistente de ajedrez que ayuda a los jugadores a analizar posiciones y mejorar su juego. Construida con Python Flask e integrada con el motor de ajedrez Stockfish.

## Características

- Visualización interactiva del tablero de ajedrez en formato ASCII
- Soporte para notación ajedrecística en inglés y español
- Validación y ejecución de movimientos
- Integración del motor Stockfish para sugerencias de jugadas
- Capacidad para cargar partidas en formato PGN
- Alternancia entre modo oscuro y claro
- Selección de color (jugar como blancas o negras)

## Stack Técnico

- **Backend**: Python Flask
- **Frontend**: HTML, CSS, JavaScript
- **Motor de Ajedrez**: Stockfish
- **Librería de Ajedrez**: python-chess

## Instalación

1. Clona el repositorio.
2. Instala las dependencias de Python:
   ```bash
   pip install flask python-chess
3. Instala el motor de ajedrez Stockfish y actualiza la variable STOCKFISH_PATH en asistente_ajedrez.py.

## Estructura del Proyecto

├── asistente_ajedrez.py    # Aplicación principal Flask
├── static/
│   ├── css/
│   │   └── styles.css      # Estilos de la aplicación
│   └── js/
│       └── app.js          # JavaScript del frontend
└── templates/
    └── index.html          # Plantilla HTML principal

## Detalles Técnicos

**Backend (asistente_ajedrez.py):**
- Servidor Flask que maneja las solicitudes HTTP.
- Integración con la librería python-chess para el manejo del tablero de ajedrez.
- Uso del motor Stockfish para sugerencias de jugadas.
- Validación de movimientos y conversión de notación (español/inglés)
- Carga de partidas en formato PGN.
- Análisis y gestión de estado de la partida.

Componentes clave
1. Procesamiento de movimientos:
   - Soporta notación ajedrecística en inglés y español.
   - Conversión automática de notación.
   - Validación de movimientos usando python-chess.
2. Integración con Stockish
    - Profundidad del análisis configurable.
    - Sugerencia de la mejor jugada.
    - Comunicación mediante protocolo UCI.
3. Soporte para PGN
    - Carga de partidas desde notación PGN.
    - Análisis de partidas y validación de movimientos.

**Frontend**
HTML (templates/index.html)
- Interfaz para selección de modo oscuro o claro.
- Visualización del estado de la partida.
- Entrada de movimientos en formato ajedrecístico.
CSS (static/css/styles.css)
- Estilos para la interfaz.
- Diseño responsive.
- Soporte par atemas claro y oscuro.
- Transiciones suavizadas.
JavaScript (static/js/app.js)
- Lógica del frontend.
- Gestión del estado de la partida
- Comunicación con la API.
- Actualizaciones y animaciones en la interfaz.
- Toggle modo oscuro/claro.

**Endpoints de la API**
- GET /: Renderiza la página principal.
- GET /init: Inicializa una nueva partida.
- POST /move: Procesa un movimiento y actualiza el estado de la partida.
- POST /suggest: Obtiene una sugerencia de jugada.
- POST /load_pgn: Carga una partida desde PGN.

## Uso

1. Inicia el servidor Flask:
   ```bash
   python asistente_ajedrez.py
2. Abre tu navegador y visita http://localhost:5000
3. Selecciona el color con el que estás jugando.
4. Ingresa los movimientos en noación ajedrecística o carga una partida desde PGN.
5. Utiliza el botón "sugerir movimiento" para recibir ayuda de Stockfish.

## Notación de Movimientos

La aplicación soporta la notación de piezas de ajedrez anto en inglés como en español:
- **Notación en inglés**: K (king), Q (queen), R (rook), B (bishop), N (knight), P (pawn)
- **Notación en español**: Dama (D), Rey (R), Torre (T), Alfil (A), Caballo (C), Peón (P)

## Rendimiento

- Parámetros conigurables del motor Stockfish.
- Gestión eficiente del estado.
- Actualizaciones rápidas de la interfaz.

## Mejoras Futuras

- Tablero de ajedrez gráfico
- Visualización del historial de movimientos.
- Funcionalidad para guardar y cargar partidas anteriores.
- Múltiples líneas de análisis.

## Licencia

MIT.