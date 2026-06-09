/* Springfield Trivia v4 - ASCII only */
var API   = "https://thesimpsonsapi.com/api";
var IMGCD = "https://cdn.thesimpsonsapi.com/500";
var RONDAS = 10;
var SECS = 15;

var chars = [];
var vistos = new Set();
var puntos = 0;
var ronda = 1;
var tmr = null;
var respondio = false;
var actual = null;

function mostrarPantalla(id) {
  document.querySelectorAll(".screen").forEach(function(s) {
    s.classList.remove("active");
  });
  document.getElementById(id).classList.add("active");
}

function mostrarLoading(v) {
  document.getElementById("loading-overlay").classList.toggle("hidden", !v);
}

function actualizarCabecera() {
  document.getElementById("score").textContent = puntos;
  document.getElementById("round").textContent = Math.min(ronda, RONDAS);
}

async function startGame() {
  mostrarLoading(true);
  try {
    chars = [];
    var r1 = await fetch(API + "/characters?page=1");
    var r2 = await fetch(API + "/characters?page=2");
    var r3 = await fetch(API + "/characters?page=3");
    var j1 = await r1.json();
    var j2 = await r2.json();
    var j3 = await r3.json();

    function extraer(j) {
      if (Array.isArray(j)) return j;
      if (j && Array.isArray(j.results)) return j.results;
      if (j && Array.isArray(j.data)) return j.data;
      var keys = Object.keys(j);
      for (var i = 0; i < keys.length; i++) {
        if (Array.isArray(j[keys[i]])) return j[keys[i]];
      }
      return [];
    }

    var todos = extraer(j1).concat(extraer(j2)).concat(extraer(j3));
    chars = todos.filter(function(c) {
      return c && c.name && Array.isArray(c.phrases) && c.phrases.length > 0;
    });

    if (chars.length < 4) {
      throw new Error("Solo " + chars.length + " personajes con frases");
    }

    puntos = 0;
    ronda = 1;
    vistos.clear();
    actualizarCabecera();
    mostrarPantalla("screen-game");
    nuevaRonda();
  } catch(e) {
    alert("Error: " + e.message);
    mostrarPantalla("screen-start");
  } finally {
    mostrarLoading(false);
  }
}

function nuevaRonda() {
  respondio = false;
  clearInterval(tmr);

  if (vistos.size >= chars.length - 3) vistos.clear();

  var pool = chars.filter(function(c) { return !vistos.has(c.id); });
  actual = pool[Math.floor(Math.random() * pool.length)];
  vistos.add(actual.id);

  var frase = actual.phrases[Math.floor(Math.random() * actual.phrases.length)];
  document.getElementById("quote-text").textContent = '"' + frase + '"';

  var incorrectas = chars
    .filter(function(c) { return c.id !== actual.id; })
    .sort(function() { return Math.random() - 0.5; })
    .slice(0, 3);

  var opciones = incorrectas.concat([actual]).sort(function() { return Math.random() - 0.5; });

  var grid = document.getElementById("options-grid");
  grid.innerHTML = "";
  opciones.forEach(function(c) {
    var btn = document.createElement("button");
    btn.className = "option-btn";
    btn.textContent = c.name;
    btn.dataset.id = c.id;
    btn.onclick = function() { responder(c, btn); };
    grid.appendChild(btn);
  });

  var t = SECS;
  var bar = document.getElementById("timer-bar");
  bar.style.width = "100%";
  bar.classList.remove("warning");

  tmr = setInterval(function() {
    t--;
    bar.style.width = (t / SECS * 100) + "%";
    if (t <= 5) bar.classList.add("warning");
    if (t <= 0) {
      clearInterval(tmr);
      if (!respondio) {
        respondio = true;
        marcarRespuesta(null);
        setTimeout(function() { mostrarResultado(false, true); }, 600);
      }
    }
  }, 1000);
}

function responder(elegido, btn) {
  if (respondio) return;
  respondio = true;
  clearInterval(tmr);
  var ok = elegido.id === actual.id;
  if (ok) puntos++;
  marcarRespuesta(btn);
  setTimeout(function() { mostrarResultado(ok, false); }, 800);
}

function marcarRespuesta(btnElegido) {
  document.querySelectorAll(".option-btn").forEach(function(b) {
    b.disabled = true;
    if (parseInt(b.dataset.id) === actual.id) b.classList.add("correct");
  });
  if (btnElegido && parseInt(btnElegido.dataset.id) !== actual.id) {
    btnElegido.classList.add("wrong");
  }
}

function mostrarResultado(ok, timeout) {
  document.getElementById("result-verdict").textContent =
    timeout ? "Tiempo!" : ok ? "Correcto!" : "Incorrecto";
  var img = document.getElementById("result-img");
  img.src = actual.portrait_path ? IMGCD + actual.portrait_path : "";
  img.alt = actual.name;
  document.getElementById("result-name").textContent = actual.name;
  document.getElementById("result-msg").textContent =
    timeout ? ("Era " + actual.name + ".")
    : ok ? ("Lo dijo " + actual.name + ".")
    : ("Era " + actual.name + ". Segui intentando!");
  mostrarPantalla("screen-result");
}

function nextRound() {
  ronda++;
  actualizarCabecera();
  if (ronda > RONDAS) {
    document.getElementById("final-score").textContent = puntos + " / " + RONDAS;
    var p = puntos / RONDAS;
    document.getElementById("final-msg").textContent =
      p >= 0.9 ? "Fan total de Springfield! Trophy" :
      p >= 0.6 ? "Bien! Conoces la serie." :
      p >= 0.4 ? "Podes mejorar." :
                 "Homer estaria orgulloso.";
    mostrarPantalla("screen-end");
    return;
  }
  mostrarPantalla("screen-game");
  nuevaRonda();
}

function resetGame() { startGame(); }
