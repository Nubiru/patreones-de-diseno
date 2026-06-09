# language: es
Característica: Procesador de Documentos por capacidades (Problema 2 - LSP e ISP)
  Como demostración de Segregación de Interfaces (ISP) y Sustitución de Liskov (LSP)
  Quiero que cada documento implemente solo las capacidades que realmente soporta
  Para que ningún cliente reciba un objeto que rompa lo que la interfaz promete

  Escenario: Un documento Word soporta todas las capacidades
    Dado un documento Word
    Entonces puede abrirse
    Y puede editarse
    Y puede guardarse

  Escenario: Un PDF protegido solo puede abrirse (ISP)
    Dado un documento PDF protegido
    Entonces puede abrirse
    Pero no expone la capacidad de editar
    Y no expone la capacidad de guardar

  Escenario: Visualizar acepta cualquier documento abrible (LSP)
    Dado un documento PDF protegido
    Cuando lo visualizo
    Entonces se abre correctamente
