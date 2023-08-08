#Primero definimos la imagen que vamos a tomar como base
FROM node:16.17.1-alpine3.16

#Definir el directorio de trabajo
WORKDIR /app

#Copiamos el package.json
COPY package*.json ./

#Instalamos las dependencias en el contenedor
RUN npm i -g nodemon
RUN npm install

#Copiamos el resto de archivos (nuestro codigo)
COPY . .

#De mi contenedor yo quiero exponer el puerto 8081 para conectarme a mi app desde mi computador o desde otros contenedores
EXPOSE 8081

#Definimos el comando que se ejecutara al iniciar el contenedor
CMD ["npm", "start"]