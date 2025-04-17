#  CHESS WAR (GUERRA DE AJEDREZ)
***Chess War*** es un pequeño juego basado en *Battle Chess.* Se trata de un juego de ajedrez donde las piezas cobran vida y luchan entre ellas, que hemos desarrollado utilizando **Three.js y Javascript**. 

El **objetivo** es sintetizar los conocimientos adquiridos en la asignatura de Sistemas Gráficos, del Grado en Ingeniería Informática en la Universidad de Granada.

Disponemos de libertad para desarrollar e implementar el juego como deseemos; no obstante, debemos de cumplir unos requisitos mínimos que detallamos más abajo.

### Autores
- :fa-user:  Ángel Rodríguez Faya :fa-github: [http://github.com/AngelRodriguezFaya](http://github.com/AngelRodriguezFaya)
- :fa-user:  Francisco Victoriano Pérez Morales :fa-github: 


#### Programación de las entregas.
- Para ver más información sobre las entregas, ver el apartado [Entregas al profesor](####Entregas al profesor.) dentro de este mismo fichero.

- Se presentarán al profesor en el horario de prácticas de nuestro grupo. **Lunes de 17:30h a 19:30h.**

- Las entregas se realizarán durante tres semanas seguidas, dejando una semana como libre por si vamos atrasados en alguna entrega.

- El último día es el 19 de mayo, pues el 26 de mayo sólo está disponible para la defensa final, la cuál, si todas las entregas van bien no tendremos que realizar. Además, es más difícil que las otras tres, por lo que trataremos evitarla a toda costa.

| Defensa nº   | Fecha de presentación  |
| :------------: | :------------: |
|  1   | 28/04/2025  |
|  2 | 05/05/2025  |
|  3  |  12/05/2025  |


#### Requisitos mínimos del juego.
- **Geometría:**
	- Las piezas se deben modelar usando diferentes técnicas.
	- Al menos una debe estar articulada. Debe incluirse su modelo jerárquico en la documentación.
- **Animación:**
	- En cada jugada, el movimiento de la pieza del escaque origen al destino.
	- Alguna pieza en cada bando debe tener movimiento. Cuando la pieza con movimiento capture una pieza del oponente lo hará luchando contra ella.
- **Iteracción:**
	- Para jugar:
		- Primero se hará clic sobre la pieza que se vaya a mover.
		- Luego se mostrarán de diferente color las casillas donde sea legal mover esa pieza.
		- Por último, se seleccionará la casilla (escaque) donde se desea mover la pieza.
	- Jugadas mínimas:
		- Los movimientos básicos de cada pieza
		- La captura de una pieza del contrario (si se trata de la pieza que lucha, debe hacer la captura luchando)
		- NO se piden, como requisito mínimo, otras jugadas como enroque, jaque, etc
- **Materiales:**
	- Debe haber materiales basados en un color
	- Debe haber materiales basados en texturas para el canal de color
	- Debe haber al menos un material con una textura en el canal de relieve.
- **Luces:**
	- Debe haber luces de diferentes colores
	- Debe haber al menos una luz que cambie en el juego (por ejemplo, cambia su punto de mira para iluminar algo concreto, cambia de color, etc.)
- **Cámaras:**
	- La cámara debe mostrar el tablero desde el punto de vista de la persona que le toca jugar.
	- Cuando una persona juegue, la cámara cambiará de manera continua a la posición de la otra persona.

*Como ya se ha indicado, estos son los requisitos mínimos que debe de cumplir el juego, todo lo que desarrollemos de forma extra será tenido en cuenta en la nota positivamente.*

####Pasos a seguir para el desarrollo.

1. Entregar la plantilla de animación al profesor y que le dé el visto bueno.

2. Realizar el diseño de la aplicación. El documento de diseño debe incluir un diagrama de clases, el modelo jerárquico de la pieza articulada que se incluye y la descripción de los algoritmos más importantes del juego.

3. Implementar el juego. Seguir un proceso iterativo e incremental. Intentad tener una versión funcionando (aunque básica) lo antes posible, e ir incorporando y probando progresivamente los distintos elementos y funcionalidades del juego

4. Volver a repasar el apartado de “Documentación a entregar” para asegurarse que está todo: correcto, ordenado y funcionando.


####Entregas al profesor.
- **Debe ser presentado parcialmente 3 veces al profesor.**
- No se permite más de una presentación parcial por semana

En cada presentación parcial debe tenerse hecho, al menos:

- **Defensa 1:**
	- Al menos 4 piezas modeladas con diferentes técnicas. *No tiene porque ser la articulada*

- **Defensa 2:**
	- El tablero
	- El resto de piezas
	- Movimientos válidos de las piezas (picking). *Preferiblemente de la pieza luchadora*
	- Cambio de cámara

- **Defensa 3:**
	- La lucha de la pieza elegida para ello.
	- Materiales con texturas, de color y de relieve
	- Luces con sus requisitos mínimos

- En cada presentación parcial:
	- Ambos miembros de la pareja deben explicar qué han hecho en el proyecto para esa presentación. El profesor puede realizar alguna pregunta a modo de defensa y evaluación.
	- Los estudiantes que no obtengan 3 evaluaciones positivas en las presentaciones parciales deberán ir a la defensa final.
