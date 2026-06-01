// =============================================================================
// Problema 3: El Interruptor Rígido
// Principio aplicado: DIP (Inversión de Dependencias)
// =============================================================================
//
// PROBLEMA ORIGINAL:
//   La clase Switch hacía `new TraditionalBulb()` DENTRO de su constructor.
//   Quedaba pegada a una clase concreta: cambiar la bombilla por una
//   SmartLight o un Fan obligaba a reescribir Switch. El módulo de alto nivel
//   (Switch) dependía del de bajo nivel (la bombilla concreta).
//
// SOLUCIÓN:
//   - Creamos una abstracción (Switchable) que define el comportamiento de
//     cualquier dispositivo encendible/apagable.
//   - Switch deja de instanciar nada: RECIBE el dispositivo desde afuera por
//     el constructor (Inyección de Dependencias).
//   - Ahora tanto el alto nivel (Switch) como el bajo nivel (los dispositivos)
//     dependen de la abstracción, no al revés. Eso es DIP.
// =============================================================================

// -----------------------------------------------------------------------------
// ABSTRACCIÓN: cualquier cosa que se pueda encender y apagar.
// -----------------------------------------------------------------------------
export interface Switchable {
  encender(): void;
  apagar(): void;
}

// -----------------------------------------------------------------------------
// IMPLEMENTACIONES de bajo nivel: todas dependen de la abstracción.
// -----------------------------------------------------------------------------
export class TraditionalBulb implements Switchable {
  encender(): void {
    console.log("Bombilla tradicional encendida... consumiendo mucha energía.");
  }
  apagar(): void {
    console.log("Bombilla tradicional apagada.");
  }
}

export class SmartLight implements Switchable {
  encender(): void {
    console.log("Luz inteligente encendida (bajo consumo, color cálido).");
  }
  apagar(): void {
    console.log("Luz inteligente apagada.");
  }
}

export class Fan implements Switchable {
  encender(): void {
    console.log("Ventilador girando.");
  }
  apagar(): void {
    console.log("Ventilador detenido.");
  }
}

// -----------------------------------------------------------------------------
// MÓDULO DE ALTO NIVEL: depende SOLO de la abstracción Switchable.
// -----------------------------------------------------------------------------
export class Switch {
  // El dispositivo entra por el constructor; Switch nunca hace `new`.
  constructor(private readonly device: Switchable) {}

  // Acotamos la acción a un tipo unión en lugar de un string libre.
  operate(action: "on" | "off"): void {
    if (action === "on") {
      this.device.encender();
    } else {
      this.device.apagar();
    }
  }
}

// -----------------------------------------------------------------------------
// DEMO
// -----------------------------------------------------------------------------
export function demoProblema3(): void {
  console.log("===== Problema 3: DIP =====");

  // El MISMO Switch sirve para cualquier dispositivo: solo cambia lo que le
  // inyectamos. No tuvimos que reescribir la clase Switch ni una sola vez.
  const interruptorBombilla = new Switch(new TraditionalBulb());
  interruptorBombilla.operate("on");
  interruptorBombilla.operate("off");

  console.log("---");

  const interruptorLuz = new Switch(new SmartLight());
  interruptorLuz.operate("on");
  interruptorLuz.operate("off");

  console.log("---");

  const interruptorVentilador = new Switch(new Fan());
  interruptorVentilador.operate("on");
  interruptorVentilador.operate("off");
}
