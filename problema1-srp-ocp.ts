// =============================================================================
// Problema 1: El Sistema de Envíos Todopoderoso
// Principios aplicados: SRP (Responsabilidad Única) y OCP (Abierto/Cerrado)
// =============================================================================
//
// PROBLEMA ORIGINAL:
//   La clase OrderService hacía de todo en un solo método: calculaba el envío,
//   procesaba el pago y enviaba la notificación (viola SRP). Además usaba
//   cadenas + if/else, así que agregar un método nuevo obligaba a EDITAR la
//   clase existente (viola OCP).
//
// SOLUCIÓN:
//   - SRP: una clase = una responsabilidad. Separamos envío, pago y
//     notificación en clases independientes. OrderService solo ORQUESTA.
//   - OCP: cada método de envío/pago es su propia clase detrás de una
//     interfaz. Agregar "Entrega con Drones" es crear una clase nueva,
//     nunca modificar las que ya existen.
//   - Las estrategias se INYECTAN por el constructor (Inyección de
//     Dependencias): OrderService depende de abstracciones, no de concretos.
// =============================================================================

// El pedido: simple objeto de dominio, sin lógica de negocio.
export class Order {
  constructor(public id: string, public totalAmount: number) {}
}

// -----------------------------------------------------------------------------
// ENVÍO (OCP)
// -----------------------------------------------------------------------------
// Abstracción común a cualquier método de envío. Para sumar uno nuevo basta
// con implementar esta interfaz: el código existente no se toca.
export interface ShippingMethod {
  readonly nombre: string;
  calcularCosto(order: Order): number;
}

export class StandardShipping implements ShippingMethod {
  readonly nombre = "estándar";
  calcularCosto(_order: Order): number {
    const costo = 10;
    console.log(`Calculando envío ${this.nombre}: $${costo}`);
    return costo;
  }
}

export class ExpressShipping implements ShippingMethod {
  readonly nombre = "express";
  calcularCosto(_order: Order): number {
    const costo = 25;
    console.log(`Calculando envío ${this.nombre}: $${costo}`);
    return costo;
  }
}

// OCP en acción: una funcionalidad nueva = una clase nueva, sin tocar nada más.
export class DroneShipping implements ShippingMethod {
  readonly nombre = "drones";
  calcularCosto(_order: Order): number {
    const costo = 40;
    console.log(`Calculando envío con ${this.nombre}: $${costo}`);
    return costo;
  }
}

// -----------------------------------------------------------------------------
// PAGO (OCP)
// -----------------------------------------------------------------------------
// Abstracción común a cualquier forma de pago.
export interface PaymentProcessor {
  pagar(monto: number): void;
}

export class PayPalProcessor implements PaymentProcessor {
  pagar(monto: number): void {
    console.log(`Procesando pago de $${monto} vía PayPal...`);
  }
}

export class CreditCardProcessor implements PaymentProcessor {
  pagar(monto: number): void {
    console.log(`Cargando $${monto} a la tarjeta de crédito...`);
  }
}

// -----------------------------------------------------------------------------
// NOTIFICACIÓN (SRP)
// -----------------------------------------------------------------------------
// Responsabilidad aislada: avisarle al cliente. Mañana podría ser SMS o push
// implementando la misma interfaz, sin afectar al resto.
export interface Notifier {
  notificar(order: Order): void;
}

export class EmailNotifier implements Notifier {
  notificar(order: Order): void {
    console.log(`Email enviado: Su pedido ${order.id} ha sido procesado.`);
  }
}

// -----------------------------------------------------------------------------
// ORQUESTADOR (SRP + DI)
// -----------------------------------------------------------------------------
// Única responsabilidad de OrderService: coordinar el flujo del pedido.
// No sabe CÓMO se calcula el envío, CÓMO se cobra ni CÓMO se notifica;
// solo conoce las abstracciones que recibe inyectadas.
export class OrderService {
  constructor(
    private readonly shipping: ShippingMethod,
    private readonly payment: PaymentProcessor,
    private readonly notifier: Notifier,
  ) {}

  processOrder(order: Order): void {
    const costoEnvio = this.shipping.calcularCosto(order);
    this.payment.pagar(order.totalAmount + costoEnvio);
    this.notifier.notificar(order);
  }
}

// -----------------------------------------------------------------------------
// DEMO
// -----------------------------------------------------------------------------
export function demoProblema1(): void {
  console.log("===== Problema 1: SRP + OCP =====");
  const order = new Order("A-1001", 100);

  // Elegimos las estrategias y se las inyectamos al servicio.
  const servicioExpressPaypal = new OrderService(
    new ExpressShipping(),
    new PayPalProcessor(),
    new EmailNotifier(),
  );
  servicioExpressPaypal.processOrder(order);

  console.log("---");

  // Otro pedido con drones + tarjeta: NO modificamos OrderService ni nada
  // existente; solo combinamos clases. Eso es OCP.
  const servicioDronTarjeta = new OrderService(
    new DroneShipping(),
    new CreditCardProcessor(),
    new EmailNotifier(),
  );
  servicioDronTarjeta.processOrder(new Order("A-1002", 250));
}
