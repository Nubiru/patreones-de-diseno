import { Given, When, Then } from "@cucumber/cucumber";
import assert from "node:assert";
import { SolidWorld, capturarConsola } from "../support/world";
import {
  Switch,
  Switchable,
  TraditionalBulb,
  SmartLight,
  Fan,
} from "../../problema3-dip";

function dispositivoPorNombre(nombre: string): Switchable {
  switch (nombre) {
    case "bombilla":
      return new TraditionalBulb();
    case "luz":
      return new SmartLight();
    case "ventilador":
      return new Fan();
    default:
      throw new Error(`Dispositivo desconocido: ${nombre}`);
  }
}

Given(
  "un interruptor conectado a un dispositivo {string}",
  function (this: SolidWorld, dispositivo: string) {
    // DIP: el Switch recibe el dispositivo inyectado, no lo crea él mismo.
    this.ctx.sw = new Switch(dispositivoPorNombre(dispositivo));
  },
);

When("lo enciendo", function (this: SolidWorld) {
  this.logs = capturarConsola(() => this.ctx.sw.operate("on"));
});

When("lo apago", function (this: SolidWorld) {
  this.logs = capturarConsola(() => this.ctx.sw.operate("off"));
});

Then("el dispositivo responde {string}", function (this: SolidWorld, mensaje: string) {
  assert.ok(
    this.logs.some((l) => l.includes(mensaje)),
    `Se esperaba una línea que contuviera "${mensaje}", pero la salida fue: ${JSON.stringify(this.logs)}`,
  );
});
