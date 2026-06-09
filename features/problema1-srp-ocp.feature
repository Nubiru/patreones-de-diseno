# language: es
Característica: Sistema de Envíos desacoplado (Problema 1 - SRP y OCP)
  Como demostración de Responsabilidad Única (SRP) y Abierto/Cerrado (OCP)
  Quiero que el cálculo del envío, el pago y la notificación estén separados
  Para poder agregar nuevas formas de envío sin modificar el código existente

  Esquema del escenario: Cada método de envío calcula su propio costo
    Dado un pedido "A-1001" con un monto de 100
    Cuando calculo el costo del envío "<metodo>"
    Entonces el costo del envío es <costo>

    Ejemplos:
      | metodo   | costo |
      | estándar | 10    |
      | express  | 25    |
      | drones   | 40    |

  Escenario: Procesar un pedido cobra el monto del pedido más el envío
    Dado un pedido "A-1001" con un monto de 100
    Y el método de envío "express"
    Cuando proceso el pedido
    Entonces se cobra un total de 125
    Y se notifica al cliente

  Escenario: Agregar "Entrega con Drones" no obliga a modificar OrderService (OCP)
    Dado un pedido "A-1002" con un monto de 250
    Y el método de envío "drones"
    Cuando proceso el pedido
    Entonces se cobra un total de 290
    Y se notifica al cliente
