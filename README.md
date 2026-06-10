

# Springfield Trivia – ¿Quién lo dijo?

Trivia interactiva de Los Simpsons: se muestra una frase icónica y el jugador debe adivinar qué personaje la dijo entre cuatro opciones, antes de que se acabe el tiempo.

https://gabrielgallardo83.github.io/simpsons-trivia/

---

## Tecnologías utilizadas

| Tecnología | Rol |
|------------|-----|
| HTML5 | Estructura de la aplicación |
| CSS3 | Estilos y animaciones |
| JavaScript (vanilla) | Lógica del juego |
| [The Simpsons API](https://thesimpsonsapi.com/) | Fuente de personajes y frases |
| Docker + nginx | Contenedor para servir la app |

---

## Requisitos previos

- [Docker](https://www.docker.com/) instalado y corriendo
- Conexión a internet (para consumir la API en tiempo real)
- Navegador web moderno

---

## Estructura del proyecto

```
simpsons-trivia/
├── index.html      # Estructura principal
├── style.css       # Estilos
├── app.js          # Lógica del juego y consumo de API
├── Dockerfile      # Configuración del contenedor
├── .gitignore      # Archivos ignorados por Git
└── README.md       # Este archivo
```

---

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/TU_USUARIO/simpsons-trivia.git
cd simpsons-trivia
```

### 2. Construir la imagen Docker

```bash
docker build -t simpsons-trivia .
```

### 3. Ejecutar el contenedor

```bash
docker run -d -p 8080:80 --name simpsons-trivia simpsons-trivia
```

Luego abrí el navegador en:

```
http://localhost:8080
```

Para detener el contenedor:

```bash
docker stop simpsons-trivia
docker rm simpsons-trivia
```

---

## Cómo jugar

1. Presioná **¡Empezar!**
2. Leé la frase que aparece en pantalla
3. Elegí el personaje correcto entre las 4 opciones antes de que se agote el tiempo (15 segundos)
4. Completá las 10 rondas y descubrí tu puntaje final

---

## API utilizada

**The Simpsons API** – [https://thesimpsonsapi.com](https://thesimpsonsapi.com)

- No requiere autenticación
- Endpoint usado: `GET /api/characters?page={n}`
- Devuelve personajes con nombre, imagen y frases

---

## Capturas de pantalla

Repositorio publicado  
![Repositorio](capturas/repo.png)

Construcción de la imagen  
![Build](capturas/build.png)

Ejecución del contenedor  
![Run](capturas/run.png)

Aplicación funcionando  
![App](capturas/app.png)

---

Trabajo Práctico N°1 – Git y Docker  
Materia: Ingeniería de Software  
Alumno: Gabriel Gallardo
 






