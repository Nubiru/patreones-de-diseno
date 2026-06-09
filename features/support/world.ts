import { setWorldConstructor, World } from "@cucumber/cucumber";

// World propio de Cucumber: una instancia nueva por escenario, así los
// escenarios no comparten estado entre sí.
export class SolidWorld extends World {
  // Bolsa de contexto donde cada escenario guarda los objetos que va creando.
  ctx: Record<string, any> = {};
  // Líneas capturadas de la consola durante un paso.
  logs: string[] = [];
}

setWorldConstructor(SolidWorld);

// Helper: ejecuta `fn` interceptando console.log y devuelve lo que se imprimió.
// Sirve para verificar el comportamiento de clases que "actúan" escribiendo
// en consola en lugar de devolver un valor.
export function capturarConsola(fn: () => void): string[] {
  const original = console.log;
  const lineas: string[] = [];
  console.log = (...args: any[]) => {
    lineas.push(args.map(String).join(" "));
  };
  try {
    fn();
  } finally {
    console.log = original;
  }
  return lineas;
}
