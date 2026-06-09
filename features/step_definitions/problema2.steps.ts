import { Given, When, Then } from "@cucumber/cucumber";
import assert from "node:assert";
import { SolidWorld, capturarConsola } from "../support/world";
import {
  DocumentoWord,
  DocumentoPDF,
  visualizar,
} from "../../problema2-lsp-isp";

Given("un documento Word", function (this: SolidWorld) {
  this.ctx.doc = new DocumentoWord();
});

Given("un documento PDF protegido", function (this: SolidWorld) {
  this.ctx.doc = new DocumentoPDF();
});

Then("puede abrirse", function (this: SolidWorld) {
  // Cualquier documento abrible pasa por visualizar() sin romperse.
  const salida = capturarConsola(() => visualizar(this.ctx.doc));
  assert.ok(salida.some((l) => l.includes("Abriendo")));
});

Then("puede editarse", function (this: SolidWorld) {
  const doc = this.ctx.doc as DocumentoWord;
  assert.strictEqual(typeof doc.editar, "function");
  const salida = capturarConsola(() => doc.editar());
  assert.ok(salida.some((l) => l.includes("Editando")));
});

Then("puede guardarse", function (this: SolidWorld) {
  const doc = this.ctx.doc as DocumentoWord;
  assert.strictEqual(typeof doc.guardar, "function");
  const salida = capturarConsola(() => doc.guardar());
  assert.ok(salida.some((l) => l.includes("Guardando")));
});

// ISP: el PDF no implementa capacidades que no soporta, así que esos métodos
// directamente no existen (no hay throw que disimular).
Then("no expone la capacidad de editar", function (this: SolidWorld) {
  assert.strictEqual((this.ctx.doc as any).editar, undefined);
});

Then("no expone la capacidad de guardar", function (this: SolidWorld) {
  assert.strictEqual((this.ctx.doc as any).guardar, undefined);
});

When("lo visualizo", function (this: SolidWorld) {
  this.logs = capturarConsola(() => visualizar(this.ctx.doc));
});

Then("se abre correctamente", function (this: SolidWorld) {
  assert.ok(this.logs.some((l) => l.includes("Abriendo")));
});
