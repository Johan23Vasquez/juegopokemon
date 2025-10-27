const MAPA = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 5, 3, 3, 3, 3, 3, 3, 3, 3, 3, 5, 3, 0],
    [0, 3, 0, 0, 0, 0, 3, 0, 0, 0, 3, 0, 3, 0, 0, 0, 3, 0, 0, 4, 3, 0, 3, 3, 0],
    [0, 3, 3, 3, 3, 0, 3, 3, 3, 0, 3, 0, 3, 0, 3, 3, 3, 3, 3, 0, 3, 0, 3, 0, 0],
    [0, 0, 0, 0, 3, 0, 0, 0, 3, 0, 3, 0, 3, 0, 0, 0, 0, 0, 3, 0, 3, 0, 3, 0, 0],
    [0, 3, 3, 3, 3, 3, 3, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 3, 3, 3, 3, 3, 4, 0],
    [0, 3, 0, 0, 0, 0, 3, 0, 3, 0, 0, 0, 0, 3, 0, 0, 3, 0, 3, 0, 0, 0, 3, 3, 0],
    [0, 3, 0, 5, 3, 3, 3, 3, 3, 3, 3, 0, 0, 3, 3, 3, 3, 3, 3, 0, 0, 0, 3, 0, 0],
    [0, 3, 0, 0, 0, 3, 0, 0, 0, 0, 3, 0, 0, 3, 0, 0, 0, 0, 3, 0, 5, 0, 3, 0, 0],
    [0, 3, 3, 3, 3, 3, 3, 3, 3, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 3, 0, 0],
    [0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 4, 5, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 3, 0, 0],
    [0, 3, 0, 4, 0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 3, 0, 3, 3, 3, 0, 0],
    [0, 3, 0, 0, 0, 3, 0, 0, 0, 3, 0, 0, 0, 0, 3, 0, 3, 0, 3, 0, 3, 3, 3, 0, 0],
    [0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0],
    [0, 3, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 4, 3, 3, 0, 0, 0, 0, 0, 3, 0, 0, 3, 0],
    [0, 3, 0, 4, 0, 3, 3, 3, 0, 3, 3, 3, 3, 5, 3, 3, 0, 3, 3, 3, 3, 3, 0, 3, 0]
];

const ROWS = MAPA.length;
const COLS = MAPA[0].length;
const canvas = document.getElementById('lienzo');
const ctx = canvas.getContext('2d');
const TILE_SIZE = canvas.width / COLS;

// === Imágenes ===
const fondo = new Image(); fondo.src = 'imgs/pasto1.jpg';
const imgPared = new Image(); imgPared.src = 'imgs/arbol1.png';
const imgPokebola = new Image(); imgPokebola.src = 'imgs/pokebola1.png';


// === Música de fondo ===
const musicaFondo = new Audio("sounds/musica_fondo.mp3");
musicaFondo.loop = true;
musicaFondo.volume = 0.5;

// === Sprites jugador ===
const spritesJugador = { up: [], down: [], left: [], right: [] };
for (let i = 0; i < 4; i++) {
    spritesJugador.up[i] = new Image(); spritesJugador.up[i].src = `imgs/red_up_${i}.png`;
    spritesJugador.down[i] = new Image(); spritesJugador.down[i].src = `imgs/red_down_${i}.png`;
    spritesJugador.left[i] = new Image(); spritesJugador.left[i].src = `imgs/red_left_${i}.png`;
    spritesJugador.right[i] = new Image(); spritesJugador.right[i].src = `imgs/red_right_${i}.png`;
}

// === Sprites fantasmas ===
const spritesFantasma = { up: [], down: [], left: [], right: [] };
for (let i = 0; i < 4; i++) {
    spritesFantasma.up[i] = new Image(); spritesFantasma.up[i].src = `imgs/charizard_up_${i}.png`;
    spritesFantasma.down[i] = new Image(); spritesFantasma.down[i].src = `imgs/charizard_down_${i}.png`;
    spritesFantasma.left[i] = new Image(); spritesFantasma.left[i].src = `imgs/charizard_left_${i}.png`;
    spritesFantasma.right[i] = new Image(); spritesFantasma.right[i].src = `imgs/charizard_right_${i}.png`;
}

// === Jugador ===
let jugador = {
    fila: 0, col: 0, dir: 'down', frame: 0, frameMax: 4,
    moving: false, speed: 6, offsetX: 0, offsetY: 0
};

// Buscar posición inicial
for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++)
        if (MAPA[r][c] === 1) { jugador.fila = r; jugador.col = c; }

// === Fantasmas ===
let fantasmas = [];
for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++)
        if (MAPA[r][c] === 4) {
            fantasmas.push({
                fila: r, col: c, x: c, y: r,
                dir: 'down', frame: 0, frameMax: 4, speed: 0.010
            });
            MAPA[r][c] = 3;
        }

// === Mapa original para reinicio ===
const MAPA_ORIGINAL = JSON.parse(JSON.stringify(MAPA));
const posInicial = { fila: jugador.fila, col: jugador.col };

// Pokébolas


// === Contador de pokébolas y puntaje ===
let pokebolasTomadas = 0;
let totalPokebolas = MAPA.flat().filter(v => v === 5).length;
const contadorDiv = document.createElement("div");
Object.assign(contadorDiv.style, {
    position: "absolute", top: "10px", left: "10px",
    color: "white", fontSize: "20px", fontFamily: "Arial",
    background: "rgba(0,0,0,0.5)", padding: "8px 12px", borderRadius: "10px"
});
contadorDiv.textContent = `Pokébolas: ${pokebolasTomadas}/${totalPokebolas}`;
document.body.appendChild(contadorDiv);

const infoDiv = document.createElement("div");
Object.assign(infoDiv.style, {
    position: "absolute",
    top: "10px",               // distancia desde arriba
    left: "50%",               // centrado horizontal
    transform: "translateX(-50%)", // corregir para centrar
    display: "flex",
    gap: "20px",               // espacio entre cada indicador
    background: "rgba(0,0,0,0.7)", // fondo semi-transparente
    color: "white",
    padding: "10px 20px",
    borderRadius: "15px",
    fontFamily: "Arial",
    fontSize: "18px",
    textAlign: "center",
    zIndex: "1000"             // asegurarse que esté encima de canvas
});
document.body.appendChild(infoDiv);


// Contador de tiempo
const tiempoDiv = document.createElement("div");
Object.assign(tiempoDiv.style, {
    position: "absolute",
    top: "50px",
    left: "10px",
    color: "white",
    fontSize: "20px",
    fontFamily: "Arial",
    background: "rgba(0,0,0,0.5)",
    padding: "8px 12px",
    borderRadius: "10px"
});
tiempoDiv.textContent = "Tiempo: 0s";
document.body.appendChild(tiempoDiv);

// Mejor puntaje
const mejorDiv = document.createElement("div");
Object.assign(mejorDiv.style, {
    position: "absolute",
    top: "90px",
    left: "10px",
    color: "white",
    fontSize: "20px",
    fontFamily: "Arial",
    background: "rgba(0,0,0,0.5)",
    padding: "8px 12px",
    borderRadius: "10px"
});
const mejor = localStorage.getItem("mejorPuntaje") || 0;
mejorDiv.textContent = `Mejor puntaje: ${mejor}`;
document.body.appendChild(mejorDiv);


// === Pantalla de victoria ===
const finJuegoDiv = document.createElement("div");
Object.assign(finJuegoDiv.style, {
    position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
    display: "none", justifyContent: "center", alignItems: "center",
    background: "rgba(0,0,0,0.8)", color: "white", fontSize: "48px", fontFamily: "Arial",
    flexDirection: "column"
});
finJuegoDiv.innerHTML = "🎉 ¡Has recolectado todas las pokébolas! 🎉<br><span id='puntajeFinal'></span>";
document.body.appendChild(finJuegoDiv);

// === Variables de tiempo y puntaje ===
let tiempoInicio = 0;
let tiempoTranscurrido = 0;

// === Detectar pokébola frente al jugador ===
function pokebolaEnFrente() {
    let f = jugador.fila, c = jugador.col;
    if (jugador.dir === "up") f--;
    else if (jugador.dir === "down") f++;
    else if (jugador.dir === "left") c--;
    else if (jugador.dir === "right") c++;
    if (MAPA[f] && MAPA[f][c] === 5) return { fila: f, col: c };
    return null;
}

// === Recolectar con X ===
document.addEventListener("keydown", e => {
    if (e.key.toLowerCase() === "x") {
        const pk = pokebolaEnFrente();
        if (pk) {
            MAPA[pk.fila][pk.col] = 3;
            pokebolasTomadas++;
            contadorDiv.textContent = `Pokébolas: ${pokebolasTomadas}/${totalPokebolas}`;

            mostrarDialogo(`¡Has recogido una Pokébola! Quedan ${totalPokebolas - pokebolasTomadas} por atrapar.`);

            if (pokebolasTomadas === totalPokebolas) {
                tiempoTranscurrido = Math.floor((Date.now() - tiempoInicio) / 1000);
                const puntaje = Math.max(0, 1000 - tiempoTranscurrido * 5);

                // Guardar en localStorage si es el mejor puntaje
                const mejor = localStorage.getItem("mejorPuntaje");
                if (!mejor || puntaje > mejor) {
                    localStorage.setItem("mejorPuntaje", puntaje);
                }

                document.getElementById('puntajeFinal').textContent = `⏱ Tiempo: ${tiempoTranscurrido}s | 🏆 Puntaje: ${puntaje}`;

                finJuegoDiv.style.display = "flex";
                cancelAnimationFrame(animFrame);
            }
        }
    }
});

// === Movimiento del jugador ===
const teclas = {};
document.addEventListener('keydown', e => teclas[e.key.toLowerCase()] = true);
document.addEventListener('keyup', e => teclas[e.key.toLowerCase()] = false);

function moverJugador() {
    if (jugador.moving) return;
    let nf = jugador.fila, nc = jugador.col, dir = null;
    if (teclas['w']) { dir = 'up'; nf--; }
    else if (teclas['s']) { dir = 'down'; nf++; }
    else if (teclas['a']) { dir = 'left'; nc--; }
    else if (teclas['d']) { dir = 'right'; nc++; }
    if (!dir) return;
    jugador.dir = dir;
    if (MAPA[nf] && (MAPA[nf][nc] === 3 || MAPA[nf][nc] === 1)) {
        jugador.moving = true;
        const ox = jugador.col * TILE_SIZE, oy = jugador.fila * TILE_SIZE;
        const dx = nc * TILE_SIZE, dy = nf * TILE_SIZE, pasos = TILE_SIZE / jugador.speed;
        let paso = 0;
        (function animar() {
            paso++;
            jugador.offsetX = (dx - ox) * (paso / pasos);
            jugador.offsetY = (dy - oy) * (paso / pasos);
            jugador.frame = (jugador.frame + 1) % jugador.frameMax;
            if (paso < pasos) setTimeout(animar, 60);
            else {
                jugador.fila = nf; jugador.col = nc;
                jugador.offsetX = jugador.offsetY = 0; jugador.moving = false;
            }
        })();
    }
}

function moverFantasmas() {
    for (let f of fantasmas) {
        if (Math.abs(f.x - Math.round(f.x)) < 0.01 && Math.abs(f.y - Math.round(f.y)) < 0.01) {
            let r = Math.round(f.y), c = Math.round(f.x);
            let dirs = [
                { df: -1, dc: 0, dir: 'up' },
                { df: 1, dc: 0, dir: 'down' },
                { df: 0, dc: -1, dir: 'left' },
                { df: 0, dc: 1, dir: 'right' }
            ];
            let posibles = dirs.filter(d => MAPA[r + d.df]?.[c + d.dc] === 3);
            if (posibles.length > 0) {
                let mejor = posibles[0];
                let mejorDist = Infinity;
                for (let d of posibles) {
                    let nr = r + d.df;
                    let nc = c + d.dc;
                    let dist = Math.abs(nr - jugador.fila) + Math.abs(nc - jugador.col);
                    if (dist < mejorDist) { mejorDist = dist; mejor = d; }
                }
                f.dir = mejor.dir;
            }
        }
        const velocidad = f.speed;
        if (f.dir === 'up') f.y -= velocidad;
        else if (f.dir === 'down') f.y += velocidad;
        else if (f.dir === 'left') f.x -= velocidad;
        else if (f.dir === 'right') f.x += velocidad;
        f.frame = (f.frame + 1) % f.frameMax;

        const distJugador = Math.hypot(
            f.x - (jugador.col + jugador.offsetX / TILE_SIZE),
            f.y - (jugador.fila + jugador.offsetY / TILE_SIZE)
        );
        if (distJugador < 0.5) reiniciarJuego();
    }
}

// === Reiniciar juego ===
function reiniciarJuego() {
    alert("💀 ¡Te atrapó un fantasma!");
    pokebolasTomadas = 0;
    contadorDiv.textContent = `Pokébolas: ${pokebolasTomadas}/${totalPokebolas}`;
    finJuegoDiv.style.display = "none";
    for (let r = 0; r < ROWS; r++)
        for (let c = 0; c < COLS; c++)
            if (MAPA_ORIGINAL[r][c] === 5) MAPA[r][c] = 5;
    jugador.fila = posInicial.fila;
    jugador.col = posInicial.col;
    jugador.dir = 'down';
    tiempoInicio = Date.now(); // reiniciar tiempo
}

// === Dibujos ===
function dibujarMapa() {
    for (let r = 0; r < ROWS; r++)
        for (let c = 0; c < COLS; c++) {
            ctx.drawImage(fondo, c * TILE_SIZE, r * TILE_SIZE, TILE_SIZE, TILE_SIZE);
            if (MAPA[r][c] === 0) ctx.drawImage(imgPared, c * TILE_SIZE, r * TILE_SIZE, TILE_SIZE, TILE_SIZE);
            else if (MAPA[r][c] === 5) ctx.drawImage(imgPokebola, c * TILE_SIZE, r * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        }
}

function dibujarJugador() {
    const img = spritesJugador[jugador.dir][jugador.frame];
    const x = jugador.col * TILE_SIZE + jugador.offsetX;
    const y = jugador.fila * TILE_SIZE + jugador.offsetY;
    ctx.drawImage(img, x, y, TILE_SIZE, TILE_SIZE);
}

function dibujarFantasmas() {
    for (let f of fantasmas) {
        const img = spritesFantasma[f.dir][f.frame];
        const t = TILE_SIZE * 1.2, off = (t - TILE_SIZE) / 2;
        ctx.drawImage(img, f.x * TILE_SIZE - off, f.y * TILE_SIZE - off, t, t);
    }
}

// === Bucle del juego ===
let animFrame;
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    dibujarMapa();
    moverJugador();
    moverFantasmas();
    dibujarFantasmas();
    dibujarJugador();

    actualizarTiempo(); // Actualiza el cronómetro en pantalla

    animFrame = requestAnimationFrame(gameLoop);
}

// === VIDEO INTRO ===
const video = document.getElementById("introVideo");
const introDiv = document.getElementById("intro");
const juegoDiv = document.getElementById("juego");

let imagenesCargadas = false;
let juegoIniciado = false;

const imagenes = [
    fondo, imgPared, imgPokebola,
    ...spritesJugador.up, ...spritesJugador.down, ...spritesJugador.left, ...spritesJugador.right,
    ...spritesFantasma.up, ...spritesFantasma.down, ...spritesFantasma.left, ...spritesFantasma.right
];
let cargadas = 0;
imagenes.forEach(img => img.onload = () => {
    cargadas++;
    if (cargadas === imagenes.length) imagenesCargadas = true;
});

function iniciarJuego() {
    tiempoInicio = Date.now(); // Marca el momento en que inicia el juego
    if (juegoIniciado) return;
    if (!imagenesCargadas) { setTimeout(iniciarJuego, 500); return; }
    juegoIniciado = true;
    introDiv.style.display = "none";
    juegoDiv.style.display = "block";

    tiempoInicio = Date.now(); // iniciar tiempo

    musicaFondo.play().catch(() => {
        document.addEventListener("click", () => { musicaFondo.play(); }, { once: true });
    });

    requestAnimationFrame(gameLoop);
}
function actualizarTiempo() {
    tiempoTranscurrido = Math.floor((Date.now() - tiempoInicio) / 1000);
    tiempoDiv.textContent = `Tiempo: ${tiempoTranscurrido}s`;
}

video.addEventListener("ended", iniciarJuego);
document.addEventListener("keydown", (e) => { if (e.key.toLowerCase() === "x") { video.pause(); iniciarJuego(); } });
document.addEventListener("click", () => { video.muted = false; video.play(); }, { once: true });

function mostrarDialogo(mensaje) {
    const dialogo = document.getElementById("dialogo");
    const texto = document.getElementById("textoDialogo");
    dialogo.style.display = "flex";
    texto.textContent = "";
    let i = 0;
    const escribir = setInterval(() => {
        texto.textContent += mensaje[i];
        i++;
        if (i >= mensaje.length) clearInterval(escribir);
    }, 40);
    if (speechSynthesis) {
        speechSynthesis.cancel();
        const voz = new SpeechSynthesisUtterance(mensaje);
        voz.lang = "es-MX"; voz.pitch = 1.2; voz.rate = 1;
        speechSynthesis.speak(voz);
    }
    setTimeout(() => { dialogo.style.display = "none"; }, 4000);
}

document.addEventListener("click", () => {
    const audio = new Audio(); audio.play().catch(() => {});
}, { once: true });

function actualizarIndicadores() {
    tiempoTranscurrido = Math.floor((Date.now() - tiempoInicio) / 1000);
    pokebolasDiv.textContent = `Pokébolas: ${pokebolasTomadas}/${totalPokebolas}`;
    tiempoDiv.textContent = `Tiempo: ${tiempoTranscurrido}s`;
    const mejor = localStorage.getItem("mejorPuntaje") || 0;
    mejorDiv.textContent = `Mejor puntaje: ${mejor}`;
}


// Botón de reinicio
const reiniciarBtn = document.createElement("button");
reiniciarBtn.textContent = "🎮 Jugar otra vez";
Object.assign(reiniciarBtn.style, {
    fontSize: "24px",
    marginTop: "20px",
    padding: "10px 20px",
    borderRadius: "10px",
    cursor: "pointer",
    background: "#4CAF50",
    color: "white",
    border: "none"
});
finJuegoDiv.appendChild(reiniciarBtn);


reiniciarBtn.addEventListener("click", () => {
    // Reiniciar pokébolas
    pokebolasTomadas = 0;
    contadorDiv.textContent = `Pokébolas: ${pokebolasTomadas}/${totalPokebolas}`;

    // Restaurar mapa
    for (let r = 0; r < ROWS; r++)
        for (let c = 0; c < COLS; c++)
            if (MAPA_ORIGINAL[r][c] === 5) MAPA[r][c] = 5;

    // Reiniciar jugador
    jugador.fila = posInicial.fila;
    jugador.col = posInicial.col;
    jugador.dir = 'down';
    jugador.offsetX = jugador.offsetY = 0;
    jugador.moving = false;

    // Reiniciar fantasmas
    fantasmas = [];
    for (let r = 0; r < ROWS; r++)
        for (let c = 0; c < COLS; c++)
            if (MAPA[r][c] === 4) {
                fantasmas.push({
                    fila: r, col: c, x: c, y: r,
                    dir: 'down', frame: 0, frameMax: 4, speed: 0.010
                });
                MAPA[r][c] = 3;
            }

    // Reiniciar tiempo
    tiempoInicio = Date.now();

    // Ocultar pantalla de victoria y reiniciar bucle de juego
    finJuegoDiv.style.display = "none";
    requestAnimationFrame(gameLoop);
});

