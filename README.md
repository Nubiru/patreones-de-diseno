# Patrones de Diseño — Principios SOLID

Actividad de estudio de Programación Orientada a Objetos (POO): refactorización de
código acoplado aplicando los **cinco principios SOLID**, escrita en **TypeScript**
con un enfoque orientado a objetos (interfaces, clases e inyección de dependencias).

**Autor:** Gabriel Osemberg
**Cuenta:** Nubiru
**Consigna original:** [`Actividad.md`](./Actividad.md)

---

## ¿Qué es SOLID?

SOLID es un acrónimo de cinco reglas para escribir clases que sean **fáciles de
cambiar sin romper lo que ya funciona**. Todas combaten al mismo enemigo: el
**cambio**. La idea de fondo es siempre la misma: *agregar comportamiento nuevo
escribiendo código nuevo, no editando el código viejo y probado.*

| Letra | Nombre completo | Idea en una frase |
|-------|-----------------|-------------------|
| **S** | Single Responsibility Principle | Una clase, una sola responsabilidad |
| **O** | Open/Closed Principle | Abierto a extensión, cerrado a modificación |
| **L** | Liskov Substitution Principle | Un subtipo debe poder reemplazar a su base sin sorpresas |
| **I** | Interface Segregation Principle | Interfaces pequeñas y específicas, sin métodos forzados |
| **D** | Dependency Inversion Principle | Depender de abstracciones, no de implementaciones concretas |

---

## Cómo ejecutarlo

```bash
npm install
npm start
```

Esto ejecuta [`index.ts`](./index.ts), que corre las tres demos en orden e
imprime el resultado de cada refactorización por consola.

---

## Pruebas automatizadas (Cucumber)

Cada problema tiene pruebas de comportamiento escritas en **Gherkin (español)** y
ejecutadas con **Cucumber** sobre TypeScript, siguiendo el enfoque del artículo
referenciado en la consigna ([Cucumber in TypeScript](https://daniel-delimata.medium.com/cucumber-in-the-typescript-a86bd03117a7)).

```bash
npm install
npm test
```

Resultado: **11 escenarios / 45 pasos** en verde.

Qué verifica cada feature:

| Feature | Principios | Qué prueba |
|---------|-----------|------------|
| [`problema1-srp-ocp.feature`](./features/problema1-srp-ocp.feature) | SRP + OCP | Cada método de envío calcula su costo; `OrderService` cobra `monto + envío` y notifica; agregar **Drones** funciona sin tocar `OrderService` (OCP). |
| [`problema2-lsp-isp.feature`](./features/problema2-lsp-isp.feature) | LSP + ISP | El Word soporta abrir/editar/guardar; el PDF **solo** abre y **no expone** editar/guardar (ISP); `visualizar` acepta cualquier `Abrible` (LSP). |
| [`problema3-dip.feature`](./features/problema3-dip.feature) | DIP | El mismo `Switch` opera bombilla, luz inteligente y ventilador con solo cambiar el dispositivo inyectado. |

Las definiciones de pasos están en [`features/step_definitions/`](./features/step_definitions/)
y usan **dobles de prueba** (espías de pago/notificación) y captura de consola para
verificar el comportamiento real de las clases.

---

## La estrategia, problema por problema

La actividad tiene **tres problemas independientes**. Cada uno parte de un
"código acoplado" y lo refactorizamos aplicando los principios indicados.

### Problema 1 — El Sistema de Envíos Todopoderoso · **SRP + OCP**
Archivo: [`problema1-srp-ocp.ts`](./problema1-srp-ocp.ts)

- **El problema:** `OrderService` hacía de todo en un solo método —calcular envío,
  procesar pago y notificar— (viola **SRP**), y usaba cadenas con `if/else`, así
  que sumar un método de envío obligaba a editar la clase (viola **OCP**).
- **La estrategia:**
  - **SRP:** separamos cada responsabilidad en su propia clase
    (`ShippingMethod`, `PaymentProcessor`, `Notifier`). `OrderService` queda con
    una única tarea: **orquestar** el flujo del pedido.
  - **OCP:** cada método de envío y de pago es una clase detrás de una interfaz.
    Agregar "Entrega con Drones" fue **crear** `DroneShipping`, sin tocar ninguna
    clase existente.
  - Las estrategias se **inyectan por el constructor** (Inyección de
    Dependencias): el servicio depende de abstracciones, no de concretos.

### Problema 2 — El Procesador de Documentos Rebelde · **LSP + ISP**
Archivo: [`problema2-lsp-isp.ts`](./problema2-lsp-isp.ts)

- **El problema:** una sola interfaz gorda (`DocumentHandler`) obligaba a todo
  documento a prometer `open` + `edit` + `save`. El PDF protegido no puede editar
  ni guardar, así que lanzaba `Error` (viola **ISP** —depende de métodos que no
  usa— y **LSP** —no puede sustituir a la interfaz sin romper el programa—).
- **La estrategia:**
  - **ISP:** partimos la interfaz por **capacidades**: `Abrible`, `Editable` y
    `Guardable`. Cada clase implementa **solo lo que de verdad puede hacer**
    (`DocumentoWord` las tres; `DocumentoPDF` solo `Abrible`).
  - **LSP:** cada función cliente pide **exactamente** la capacidad que necesita
    (`editarDocumento` exige `Abrible & Editable`). Así, pasarle un PDF a una
    función de edición **ni siquiera compila**: el error pasa de tiempo de
    ejecución (crash) a tiempo de compilación (aviso del editor).

### Problema 3 — El Interruptor Rígido · **DIP**
Archivo: [`problema3-dip.ts`](./problema3-dip.ts)

- **El problema:** `Switch` hacía `new TraditionalBulb()` dentro de sí mismo,
  quedando pegado a una clase concreta. Cambiar la bombilla por una `SmartLight`
  o un `Fan` obligaba a reescribir `Switch` (viola **DIP**).
- **La estrategia:**
  - Creamos la abstracción `Switchable` (cualquier cosa que se pueda
    `encender`/`apagar`).
  - `Switch` deja de instanciar nada y **recibe el dispositivo por el
    constructor** (Inyección de Dependencias). El mismo `Switch` maneja bombilla,
    luz inteligente o ventilador sin reescribirse jamás.

---

## Estructura del proyecto

```
junio/design/
├── Actividad.md            La consigna + guía de estudio en inglés
├── README.md               Este archivo
├── index.ts                Ejecuta las tres demos
├── problema1-srp-ocp.ts    Problema 1 — SRP + OCP
├── problema2-lsp-isp.ts    Problema 2 — LSP + ISP
├── problema3-dip.ts        Problema 3 — DIP
├── features/               Pruebas Cucumber
│   ├── *.feature           Escenarios en Gherkin (español)
│   ├── step_definitions/   Definiciones de los pasos
│   └── support/            World + helper de captura de consola
├── cucumber.json           Configuración de Cucumber
├── package.json
└── tsconfig.json           (strict: true)
```

---

## Conclusión

Los principios trabajan en equipo: **SRP + OCP** (responsabilidades chicas hacen
fácil la extensión) y **LSP + ISP** (interfaces chicas y honestas hacen segura la
sustitución), con **DIP** como el pegamento que mantiene todo débilmente acoplado.

> **Atajo mental:** *"Que agregar cosas nuevas sea fácil, y romper las viejas sea difícil."*
