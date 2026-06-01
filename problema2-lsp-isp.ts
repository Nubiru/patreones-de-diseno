// =============================================================================
// Problema 2: El Procesador de Documentos Rebelde
// Principios aplicados: LSP (Sustitución de Liskov) e ISP (Segregación de Interfaces)
// =============================================================================
//
// PROBLEMA ORIGINAL:
//   Existía UNA sola interfaz gorda (DocumentHandler) que obligaba a TODO
//   documento a prometer open() + edit() + save(). El PDF protegido no puede
//   editar ni guardar, así que la única salida fue lanzar Error en esos
//   métodos. Eso rompe:
//     - ISP: el PDF depende de métodos que no usa (edit, save).
//     - LSP: un PDF NO puede sustituir a un DocumentHandler sin romper al
//       cliente. Quien recibe la interfaz y llama edit() crashea si es un PDF.
//   La señal de alarma es el `throw`: si hay que lanzar un error para
//   "cumplir" una interfaz, la interfaz está mal diseñada.
//
// SOLUCIÓN:
//   Partimos la interfaz gorda por CAPACIDADES (roles). Cada operación es su
//   propia mini-interfaz, y cada clase implementa SOLO lo que de verdad puede
//   hacer. Los clientes piden exactamente la capacidad que necesitan, así la
//   sustitución es segura por construcción (LSP) y el viejo crash se vuelve
//   imposible YA EN TIEMPO DE COMPILACIÓN.
// =============================================================================

// -----------------------------------------------------------------------------
// CAPACIDADES (ISP): una interfaz por operación, no una que lo prometa todo.
// -----------------------------------------------------------------------------
export interface Abrible {
  abrir(): void;
}

export interface Editable {
  editar(): void;
}

export interface Guardable {
  guardar(): void;
}

// -----------------------------------------------------------------------------
// IMPLEMENTACIONES: cada clase implementa solo lo que puede hacer.
// -----------------------------------------------------------------------------

// El Word puede todo → implementa las tres capacidades. Sin trucos, sin throws.
export class DocumentoWord implements Abrible, Editable, Guardable {
  abrir(): void {
    console.log("Abriendo documento Word...");
  }
  editar(): void {
    console.log("Editando texto...");
  }
  guardar(): void {
    console.log("Guardando cambios en disco...");
  }
}

// El PDF protegido SOLO puede abrirse → implementa solo Abrible.
// No tiene editar() ni guardar(): no hay nada que mentir ni que lanzar.
export class DocumentoPDF implements Abrible {
  abrir(): void {
    console.log("Abriendo PDF protegido...");
  }
}

// -----------------------------------------------------------------------------
// CLIENTES (LSP): cada función pide EXACTAMENTE la capacidad que necesita.
// -----------------------------------------------------------------------------

// Solo necesita abrir → acepta cualquier Abrible. Nunca puede crashear.
export function visualizar(doc: Abrible): void {
  doc.abrir();
}

// Necesita abrir Y editar → exige la intersección Abrible & Editable.
// Un documento que no sea Editable NO compila al pasarlo aquí.
export function editarDocumento(doc: Abrible & Editable): void {
  doc.abrir();
  doc.editar();
}

// Necesita abrir Y guardar → exige Abrible & Guardable.
export function guardarDocumento(doc: Abrible & Guardable): void {
  doc.abrir();
  doc.guardar();
}

// -----------------------------------------------------------------------------
// DEMO
// -----------------------------------------------------------------------------
export function demoProblema2(): void {
  console.log("===== Problema 2: LSP + ISP =====");

  const word = new DocumentoWord();
  const pdf = new DocumentoPDF();

  // Visualizar funciona con AMBOS: solo se les pide abrir, que ambos saben.
  visualizar(word);
  visualizar(pdf);

  console.log("---");

  // Editar y guardar funcionan con el Word, que sí tiene esas capacidades.
  editarDocumento(word);
  guardarDocumento(word);

  console.log("---");

  // El crash del código original es IMPOSIBLE: pasarle un PDF a una función
  // que exige Editable ni siquiera compila. Descomentar la línea de abajo
  // produce un error del compilador en vez de un Error en ejecución:
  //
  //   editarDocumento(pdf);
  //   // ❌ El tipo 'DocumentoPDF' no es asignable a 'Abrible & Editable':
  //   //    falta la propiedad 'editar'.
  console.log(
    "editarDocumento(pdf) fue bloqueado por el compilador (LSP seguro por tipos).",
  );
}
