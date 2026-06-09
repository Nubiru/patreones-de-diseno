import { Given, When, Then } from "@cucumber/cucumber";
import assert from "node:assert";
import { SolidWorld, capturarConsola } from "../support/world";
import {
  Order,
  OrderService,
  ShippingMethod,
  PaymentProcessor,
  Notifier,
  StandardShipping,
  ExpressShipping,
  DroneShipping,
} from "../../problema1-srp-ocp";

// Dobles de prueba: en lugar de cobrar/notificar de verdad, registran lo que
// pasó para poder afirmarlo en los pasos "Entonces".
class PagoEspia implements PaymentProcessor {
  montoCobrado = 0;
  pagar(monto: number): void {
    this.montoCobrado = monto;
  }
}

class NotificadorEspia implements Notifier {
  notificado = false;
  notificar(): void {
    this.notificado = true;
  }
}

function envioPorNombre(nombre: string): ShippingMethod {
  switch (nombre) {
    case "estándar":
      return new StandardShipping();
    case "express":
      return new ExpressShipping();
    case "drones":
      return new DroneShipping();
    default:
      throw new Error(`Método de envío desconocido: ${nombre}`);
  }
}

Given(
  "un pedido {string} con un monto de {int}",
  function (this: SolidWorld, id: string, monto: number) {
    this.ctx.order = new Order(id, monto);
  },
);

When(
  "calculo el costo del envío {string}",
  function (this: SolidWorld, metodo: string) {
    const envio = envioPorNombre(metodo);
    capturarConsola(() => {
      this.ctx.costo = envio.calcularCosto(this.ctx.order);
    });
  },
);

Then("el costo del envío es {int}", function (this: SolidWorld, costo: number) {
  assert.strictEqual(this.ctx.costo, costo);
});

Given("el método de envío {string}", function (this: SolidWorld, metodo: string) {
  this.ctx.shipping = envioPorNombre(metodo);
});

When("proceso el pedido", function (this: SolidWorld) {
  const pago = new PagoEspia();
  const notificador = new NotificadorEspia();
  const servicio = new OrderService(this.ctx.shipping, pago, notificador);
  capturarConsola(() => servicio.processOrder(this.ctx.order));
  this.ctx.pago = pago;
  this.ctx.notificador = notificador;
});

Then("se cobra un total de {int}", function (this: SolidWorld, total: number) {
  assert.strictEqual(this.ctx.pago.montoCobrado, total);
});

Then("se notifica al cliente", function (this: SolidWorld) {
  assert.strictEqual(this.ctx.notificador.notificado, true);
});
