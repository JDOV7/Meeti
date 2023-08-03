## Tabla de Contenidos
1. [Informacion General](#informacion-general)
2. [Tecnologias](#tecnologias)
3. [Instalacion](#instalacion)
## Informacion General
***
Esta es una aplicacion web basada en MeetUp.
Esta aplicacion tiene como finalidad el crear eventos con personas que compartan, gustos, pasatiempos o intereses similares.
* Creacion de cuentas con envio de correo para validar
* Inicio de sesion
* Cierre de sesion
* Crear nuevo grupo. Incluye el subir una imagen con Multer y el uso de Trix
* Editar grupo
* Eliminar Grupo
* Crear nuevo Meeti. Incluye el uso de Trix y Leaflet

## Tecnologias
***
Tecnologias usadas:
* NodeJS: Version 18.14.2
* Express: Version 4.18.2
* MySQL: Version *
* Sequelize: Version 6.32.1
* Flash: Version 0.1.1
* Passport: Version 1.0.0
* EJS: Version 3.1.9
* Leaflet: Version 1.8.0
* leaflet-geosearch: Version 3.8.0
* [Trix](https://github.com/basecamp/trix/tree/custom-elements-v1): Version 1
* Nodemailer: Version 6.9.4

## Instalacion
***
Para la instalacion, primero tener ```node 18.14.2``` y luejo seguir los pasos siguiente.
```
$ git clone https://github.com/JDOV7/Meeti.git
$ cd ../path/to/the/file
$ npm install
$ npm run start
```
Ademas de esto se debe tener una base de datos en MySQL y tener una cuenta en mailtrap para probar los correos.
