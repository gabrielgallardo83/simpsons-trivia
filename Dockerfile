# Imagen base oficial de nginx (servidor web liviano)
FROM nginx:alpine

# Copiamos los archivos de la aplicación al directorio raíz de nginx
COPY . /usr/share/nginx/html

# Exponemos el puerto 80
EXPOSE 80

# nginx arranca automáticamente con la imagen base
