# language: es
Característica: Interruptor que opera cualquier dispositivo (Problema 3 - DIP)
  Como demostración de Inversión de Dependencias (DIP)
  Quiero que el interruptor dependa de una abstracción y reciba el dispositivo
  Para poder controlar distintos aparatos sin reescribir la clase Switch

  Esquema del escenario: El mismo interruptor opera distintos dispositivos
    Dado un interruptor conectado a un dispositivo "<dispositivo>"
    Cuando lo enciendo
    Entonces el dispositivo responde "<mensaje_encendido>"
    Cuando lo apago
    Entonces el dispositivo responde "<mensaje_apagado>"

    Ejemplos:
      | dispositivo | mensaje_encendido | mensaje_apagado |
      | bombilla    | encendida         | apagada         |
      | luz         | encendida         | apagada         |
      | ventilador  | girando           | detenido        |
