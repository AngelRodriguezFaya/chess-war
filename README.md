#  CHESS WAR (GUERRA DE AJEDREZ)
***Chess War*** es un pequeño juego basado en *Battle Chess.* Se trata de un juego de ajedrez donde las piezas cobran vida y luchan entre ellas, que hemos desarrollado utilizando **Three.js y Javascript**. 

El **objetivo** es sintetizar los conocimientos adquiridos en la asignatura de Sistemas Gráficos, del Grado en Ingeniería Informática en la Universidad de Granada.

Disponemos de libertad para desarrollar e implementar el juego como deseemos; no obstante, debemos de cumplir unos requisitos mínimos que detallamos en el apartado [Requisitos mínimos del juego](#requisitos-mínimos-del-juego)

### Autores
- :bust_in_silhouette:  Ángel Rodríguez Faya :octocat: [http://github.com/AngelRodriguezFaya](http://github.com/AngelRodriguezFaya)
- :bust_in_silhouette:  Francisco Victoriano Pérez Morales :octocat: [https://github.com/fvperezmorales](https://github.com/fvperezmorales)

### Modelado 3D con Three.js (Todo lo que se necesita saber).

Las diferentes técnicas que debemos de utilizar para modelar las piezas son (*las que tienen el tick son las que yas se han utilizado en alguna pieza*) **(modificar esto)**
- [x]  Instanciación de primitivas.
- [x]  Geometría de Sólidos Constructiva (CSG), también llamada Operaciones Booleanas.
- [x]  Extrusión
- [ ]  Barrido
- [x]  Revolución
- [x]  Cargar un modelo en formato .obj
- [ ]  Modelos Jerárquicos

Además, necesitamos figuras con **Animaciones**.

### El Ajedrez y sus Piezas
> El **ajedrez** es un juego de tablero entre dos contrincantes en el que cada uno dispone al inicio de dieciséis piezas móviles, desiguales en importancia y valor, que se desplazan sobre un tablero capturando piezas del jugador contrario, según ciertas reglas.[...]

>Se juega sobre un **tablero cuadriculado de 8×8 casillas **(también llamadas escaques), alternadas en colores blanco y negro, que constituyen las 64 posibles posiciones entre las que se mueven las piezas durante el desarrollo del juego. Al principio del juego cada jugador tiene dieciséis piezas: un rey, una dama, dos alfiles, dos caballos, dos torres y ocho peones. Se trata de un juego de estrategia en el que el objetivo es «encerrar» al rey del oponente. Esto se hace amenazando la casilla que ocupa el rey con alguna de las piezas propias sin que el otro jugador pueda proteger a su rey interponiendo una pieza entre su rey y la pieza que lo amenaza (a menos que dicha pieza sea un peón o un caballo), mover su rey a un escaque libre o capturar a la pieza que lo está amenazando, lo que trae como resultado el jaque mate y el fin de la partida.

Fuente: [Wikipedia - Ajedrez](https://es.wikipedia.org/wiki/Ajedrez)

A continuación detallaremos más detalles sobre las piezas y como la hemos desarrollado en nuestro juego: **(modificar esto)**

|  Nombre  | Cantidad por jugador | Animación (SI/NO/NS) | Técnicas utilizadas para su modelado en 3D| Breve descripción | 
| :------------: | :------------: | :------------: | :------------: | :------------: |
| Rey  | 1  |  SI  |   |   |
|  Dama |  1  | NO  | Cargar un modelo en formato .obj  | Esta pieza se ha realizado cargando un modelo en formato .obj, el cuál se puede ver y descargar desde el siguiente enlace: [Enlace a la figura de la Dama en Free 3D ](https://free3d.com/es/modelo-3d/marionette-queen-v1--45470.html)   |
| Alfiles  | 2 |  NO | Instanciación de primitivas. Revolución. Operaciones booleanas (CSG)  |   |
| Caballos | 2  | No  | Instanciación de primitvas. Revolución. Operaciones booleanas (CSG). Barrido  |   |
|  Torres  | 2  | NO  | Instanciación de primitivas. Revolución. Operaciones booleanas (CSG)  |   |
|  Peones  | 8  | SI  |   |   |   |


### Programación de las entregas
- Para ver más información sobre las entregas, ver el apartado [Entregas al profesor](#entregas-al-profesor) dentro de este mismo fichero.

- Se presentarán al profesor en el horario de prácticas de nuestro grupo. **Lunes de 17:30h a 19:30h.**

- Las entregas se realizarán durante tres semanas seguidas, dejando una semana como libre por si vamos atrasados en alguna entrega.

- **El último día es el 19 de mayo**, pues el 26 de mayo sólo está disponible para la defensa final, la cuál, si todas las entregas van bien no tendremos que realizar. Además, es más difícil que las otras tres, por lo que trataremos evitarla a toda costa.

| Defensa nº   | Fecha de presentación  | Realizada |
| :------------: | :------------: | :------------: |
|  1   | 05/05/2025  | [X] |
|  2 | 12/05/2025  | [ ] |
|  3  |  19/05/2025  | [ ] |

### Requisitos mínimos del juego
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

### Pasos a seguir para el desarrollo

1. Entregar la plantilla de animación al profesor y que le dé el visto bueno.

2. Realizar el diseño de la aplicación. El documento de diseño debe incluir un diagrama de clases, el modelo jerárquico de la pieza articulada que se incluye y la descripción de los algoritmos más importantes del juego.

3. Implementar el juego. Seguir un proceso iterativo e incremental. Intentad tener una versión funcionando (aunque básica) lo antes posible, e ir incorporando y probando progresivamente los distintos elementos y funcionalidades del juego

4. Volver a repasar el apartado de “Documentación a entregar” para asegurarse que está todo: correcto, ordenado y funcionando.


### Entregas al profesor
- **Debe ser presentado parcialmente 3 veces al profesor.**
- No se permite más de una presentación parcial por semana

En cada presentación parcial debe tenerse hecho, al menos:

- **Defensa 1:**
	- Al menos 4 piezas modeladas con diferentes técnicas. *No tiene porque ser la articulada*
  	- Las piezas modeladas que nosotros entregaremos para está defensa serán: (x si está hecha, *vacío* si no lo está)
  	- [x]  Torre
  	- [x]  Alfil
  	- [x]  Dama
  	- [X]  Caballo

- **Defensa 2:**
	- [X]  El tablero
	- El resto de piezas
   		- [ ] Rey
           	- [ ] Peón 
	- Movimientos válidos de las piezas (picking). *Preferiblemente de la pieza luchadora*
	- Cambio de cámara

- **Defensa 3:**
	- La lucha de la pieza elegida para ello.
	- Materiales con texturas, de color y de relieve
	- Luces con sus requisitos mínimos

- En cada presentación parcial:
	- Ambos miembros de la pareja deben explicar qué han hecho en el proyecto para esa presentación. El profesor puede realizar alguna pregunta a modo de defensa y evaluación.
	- Los estudiantes que no obtengan 3 evaluaciones positivas en las presentaciones parciales deberán ir a la defensa final.
