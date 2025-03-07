from flask import Flask, render_template, request, jsonify
import chess
import chess.engine

app = Flask(__name__)

# Ruta al ejecutable de Stockfish en mi PC
STOCKFISH_PATH = r"C:\Users\Saul\Desktop\stockfish\stockfish-windows-x86-64-sse41-popcnt.exe"

# Iniciar el motor de Stockfish y configurarlo
engine = chess.engine.SimpleEngine.popen_uci(STOCKFISH_PATH)
engine.configure({"Threads": 2, "Hash": 256})


### FUNCIONES AUXILIARES ###

def convertir_san_espanol_a_ingles(move_san):
    """
    Si el movimiento comienza con una letra que NO sea minúscula (movimiento de peón),
    se revisa:  
      - Si ya comienza con una de las letras inglesas estándar para piezas (K, Q, N, B, R)
        se asume que la notación es inglesa y se devuelve sin cambios.
      - En otro caso, se asume notación española y se hace la conversión:
           C (caballo) -> N
           A (alfil)   -> B
           T (torre)   -> R
           D (dama)    -> Q
           R (rey)     -> K
    """
    if not move_san:
        return move_san
    # Si es un movimiento de peón (empieza con minúscula), se devuelve igual
    if move_san[0].islower():
        return move_san
    # Si ya está en notación inglesa, se devuelve sin cambios.
    if move_san[0] in {"K", "Q", "N", "B", "R"}:
        return move_san
    mapping = {'C': 'N', 'A': 'B', 'T': 'R', 'D': 'Q', 'R': 'K'}
    return mapping.get(move_san[0], move_san[0]) + move_san[1:]

def aplicar_movimiento(board, move_san):
    """
    Intenta aplicar un movimiento (en notación SAN) al tablero.
    Se pasa el movimiento por la función de conversión para aceptar notación española en
    la entrada individual (se recomienda usar "K" para el rey, ya que en notación inglesa es K).
    Retorna (True, "") si el movimiento es válido o (False, mensaje_error) en caso contrario.
    """
    if not move_san:
        return False, "Movimiento vacío."
    move_san_english = convertir_san_espanol_a_ingles(move_san)
    try:
        move = board.parse_san(move_san_english)
        board.push(move)
        return True, ""
    except ValueError:
        return False, f"Movimiento inválido: '{move_san}' (traducido a '{move_san_english}')"

def obtener_mejor_jugada(board, depth=20):
    """
    Utiliza el motor para obtener la mejor jugada en la posición actual a la profundidad indicada.
    Retorna un objeto chess.Move.
    """
    info = engine.play(board, chess.engine.Limit(depth=depth))
    return info.move

def cargar_pgn(pgn_text):
    """
    Procesa un string de movimientos (con formato:
      '1. d4 f5 2. Nf3 e6 3. e3 b6 ...')
    y aplica todos los movimientos a partir de la posición inicial.
    Se entiende que cada número es un turno completo (por ejemplo, "1. d4 f5" indica
    que blancas jugaron d4 y negras f5).
    Se asume que el PGN está en notación SAN inglesa.
    Retorna el tablero resultante.
    """
    board = chess.Board()
    pgn_text = pgn_text.replace("\n", " ")
    tokens = pgn_text.split()
    for token in tokens:
        if token.endswith('.'):
            continue
        if token in ["1-0", "0-1", "1/2-1/2"]:
            continue
        token_procesado = convertir_san_espanol_a_ingles(token.strip())
        try:
            move = board.parse_san(token_procesado)
            board.push(move)
        except Exception as e:
            print("Error al cargar movimiento:", token_procesado, e)
            continue
    return board


### ENDPOINTS DE LA APLICACIÓN ###

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/init', methods=['GET'])
def init_board():
    board = chess.Board()
    return jsonify({"fen": board.fen(), "board_text": str(board)})

@app.route('/move', methods=['POST'])
def move():
    data = request.get_json()
    fen = data.get("fen")
    move_input = data.get("move")
    board = chess.Board(fen)
    success, error_msg = aplicar_movimiento(board, move_input)
    if not success:
        return jsonify({"error": error_msg})
    return jsonify({"fen": board.fen(), "board_text": str(board)})

@app.route('/suggest', methods=['POST'])
def suggest():
    data = request.get_json()
    fen = data.get("fen")
    depth = data.get("depth", 15)
    board = chess.Board(fen)
    try:
        best_move = obtener_mejor_jugada(board, depth)
        suggestion_san = board.san(best_move)
        return jsonify({"suggestion": suggestion_san, "uci": best_move.uci()})
    except Exception as e:
        return jsonify({"error": str(e)})

@app.route('/load_pgn', methods=['POST'])
def load_pgn_route():
    data = request.get_json()
    pgn_text = data.get("pgn", "")
    board = cargar_pgn(pgn_text)
    return jsonify({"fen": board.fen(), "board_text": str(board)})

if __name__ == '__main__':
    app.run(debug=True)
