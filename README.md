<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# Galeo NestJS

## Después de clonar el repositorio

## Instalar dependencias

```bash
npm install
```

## Copiar el .env.example

Con el .env debería ser suficiente para levantar todo

## Lenvantar la BD con docker (construirá la imagen probablemente)

```bash
docker-compose up -d
```

## Iniciar la API en modo de desarrollo

```bash
npm run start:dev
```

## La documentación esta en swagger, abre en el navegador:

localhost:3000/api


## FLUJO:

Usuario y categoría pueden existir por si solos, pero gastos necesita los dos para ser creado

- Crea un usuario
- Crea una categoría
- Crea un gasto



