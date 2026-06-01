Problema 1: El Sistema de Envíos Todopoderoso
Principios a aplicar: Single Responsibility Principle (SRP) y Open/Closed Principle (OCP).
El Escenario
Tienes una clase OrderService que se encarga de procesar un pedido. El problema es que hace de todo: calcula el envío, procesa el pago y envía notificaciones. Además, si mañana queremos agregar un nuevo método de envío (como "Entrega con Drones"), tendríamos que modificar la clase existente.
Código Acoplado (A refactorizar)
TypeScript
class Order {
    constructor(public id: string, public totalAmount: number) {}
}

class OrderService {
    processOrder(order: Order, shippingMethod: string, paymentType: string) {
        // 1. Calcular envío
        let shippingCost = 0;
        if (shippingMethod === "standard") {
            shippingCost = 10;
        } else if (shippingMethod === "express") {
            shippingCost = 25;
        }
        console.log(`Calculando envío para ${shippingMethod}: $${shippingCost}`);

        // 2. Procesar Pago
        if (paymentType === "paypal") {
            console.log(`Procesando pago de $${order.totalAmount + shippingCost} vía PayPal...`);
        } else if (paymentType === "credit_card") {
            console.log(`Cargando $${order.totalAmount + shippingCost} a la tarjeta de crédito...`);
        }

        // 3. Enviar Notificación
        console.log(`Email enviado: Su pedido ${order.id} ha sido procesado.`);
    }
}

Tu Reto
Separa las responsabilidades en clases independientes (SRP).
Haz que el sistema de envíos y el de pagos sean extendibles sin modificar el código existente, utilizando interfaces o clases abstractas (OCP).
Problema 2: El Procesador de Documentos Rebelde
Principios a aplicar: Liskov Substitution Principle (LSP) y Interface Segregation Principle (ISP).
El Escenario
Estamos construyendo un sistema de gestión de archivos. Creamos una interfaz general DocumentHandler para todos los documentos. El problema surge cuando agregamos un archivo de tipo ReadonlyDocument (como un PDF protegido); este tipo de documento no puede ser editado ni guardado, lo que obliga a lanzar errores inesperados que rompen el programa.
Código Acoplado (A refactorizar)
TypeScript
interface DocumentHandler {
    open(): void;
    edit(): void;
    save(): void;
}

class WordDocument implements DocumentHandler {
    open() { console.log("Abriendo documento Word..."); }
    edit() { console.log("Editando texto..."); }
    save() { console.log("Guardando cambios en disco..."); }
}

class PDFDocument implements DocumentHandler {
    open() { console.log("Abriendo PDF protegido..."); }
    
    edit() {
        // ¡Violación de LSP! Este objeto no puede hacer lo que la interfaz promete
        throw new Error("Error: No se puede editar un PDF protegido.");
    }
    
    save() {
        // Otra violación
        throw new Error("Error: No se puede guardar un PDF protegido.");
    }
}

// Un cliente que confía en la interfaz se romperá aquí
激活Procesador(doc: DocumentHandler) {
    doc.open();
    doc.edit(); // ¡Crash si es un PDF!
    doc.save();
}

Tu Reto
Divide la interfaz DocumentHandler en interfaces más pequeñas y específicas para que las clases no dependan de métodos que no usan (ISP).
Asegúrate de que cualquier subclase o implementación pueda sustituir a su firma base sin romper el programa (LSP).
Problema 3: El Interruptor Rígido
Principio a aplicar: Dependency Inversion Principle (DIP).
El Escenario
Tienes un sistema de automatización para el hogar. La clase Switch (Interruptor) está fuertemente acoplada a una clase concreta TraditionalBulb (Bombilla tradicional). Si mañana decides cambiar la bombilla por una SmartLight o un Fan (Ventilador), tendrías que reescribir la clase Switch. Los módulos de alto nivel no deben depender de los de bajo nivel; ambos deben depender de abstracciones.
Código Acoplado (A refactorizar)
TypeScript
class TraditionalBulb {
    turnOn() { console.log("Bombilla tradicional encendida... consumiendo mucha energía."); }
    turnOff() { console.log("Bombilla tradicional apagada."); }
}

class Switch {
    private bulb: TraditionalBulb;

    constructor() {
        // Alto acoplamiento: Instanciación directa dentro de la clase
        this.bulb = new TraditionalBulb(); 
    }

    operate(action: string) {
        if (action === "on") {
            this.bulb.turnOn();
        } else {
            this.bulb.turnOff();
        }
    }
}

Tu Reto
Crea una abstracción (interface) que defina el comportamiento de cualquier dispositivo que se pueda encender/apagar.
Aplica Inyección de Dependencias para que el Switch reciba el dispositivo desde el exterior, logrando que dependa de la abstracción y no de la implementación concreta (DIP).

---

# Study Guide — The SOLID Principles (in plain English)

> **SOLID** is just a memory trick: 5 letters, 5 rules for writing classes that are easy to change later without breaking things. Below is what each one means, why it matters, and where we used it in this activity. Files live in this folder. Run everything with `npm start`.

## The big idea first
All five rules are really fighting **one enemy: change**. When a requirement changes (a new shipping type, a read-only file, a different light bulb), badly-organized code forces you to rip open old, working classes and risk breaking them. SOLID is a set of habits that lets you **add new behavior by adding new code, not by editing old code.**

---

## S — Single Responsibility Principle (SRP)
**"A class should have only one reason to change."** In other words: one class = one job.

- **Layman version:** A Swiss Army knife is handy, but if the corkscrew breaks you risk damaging the scissors. Better to have separate tools. A class that does shipping *and* payments *and* emails is a Swiss Army knife — touching one part can break the others.
- **In our code (`problema1`):** The old `OrderService` calculated shipping, charged the card, *and* sent the email. We split those into `ShippingMethod`, `PaymentProcessor`, and `Notifier`. Now `OrderService` has a single job: **coordinate** the steps. If the email wording changes, you only touch `EmailNotifier`.

## O — Open/Closed Principle (OCP)
**"Software should be open for extension, but closed for modification."** You should be able to add new features *without editing existing, tested code.*

- **Layman version:** A power strip lets you plug in a new device without rewiring your house. You *extend* what's plugged in; you don't *modify* the wiring.
- **In our code (`problema1`):** Adding "Drone delivery" meant creating one new class, `DroneShipping`, that implements the `ShippingMethod` interface. We never touched `StandardShipping`, `ExpressShipping`, or `OrderService`. The old `if (method === "standard") ... else if ...` is gone — that chain was the thing you had to edit every time.

## L — Liskov Substitution Principle (LSP)
**"Subtypes must be usable anywhere their base type is expected, without surprises."** If your code expects a "Document," any kind of document you hand it must actually work — not blow up.

- **Layman version:** If a recipe calls for "a bird's egg," a chicken egg works fine. But if someone hands you a chocolate Easter egg, it *looks* like an egg but breaks the recipe. A subtype that throws errors where the parent worked is a chocolate egg — it lies about being a real substitute.
- **In our code (`problema2`):** The old `PDFDocument` had to `throw new Error()` on `edit()` and `save()` because PDFs can't do those. That's the chocolate egg — it crashes any code that trusted the interface. Our fix makes the crash **impossible**: functions ask only for what they truly need (`editarDocumento` requires an `Editable`), so handing it a PDF won't even compile. The error moves from *runtime* (program crash for the user) to *compile time* (the editor warns you instantly).

## I — Interface Segregation Principle (ISP)
**"Don't force a class to implement methods it doesn't use."** Prefer several small, focused interfaces over one giant one.

- **Layman version:** Don't make everyone sign up for the "all-you-can-eat" menu when they only want a coffee. A read-only PDF shouldn't be forced to promise it can "save" just because the menu listed it.
- **In our code (`problema2`):** We broke the fat `DocumentHandler` (open + edit + save) into three small capabilities: `Abrible` (open), `Editable` (edit), `Guardable` (save). `DocumentoWord` implements all three; `DocumentoPDF` implements only `Abrible`. No class is forced to fake an ability it doesn't have. *(ISP and LSP work as a team here: small honest interfaces are what make safe substitution possible.)*

## D — Dependency Inversion Principle (DIP)
**"Depend on abstractions, not on concrete details."** High-level code (the policy) shouldn't be hard-wired to low-level details (the specific gadget).

- **Layman version:** A wall light switch doesn't care *what* it's connected to — a bulb, a fan, a smart light. It just sends "on"/"off" down a standard wire. If the switch had the bulb *glued* inside it, you'd have to buy a new switch every time you changed the bulb.
- **In our code (`problema3`):** The old `Switch` did `new TraditionalBulb()` inside itself — bulb glued in. We introduced a `Switchable` abstraction (anything with `encender`/`apagar`) and **injected** the device through the constructor. Now the same `Switch` runs a `TraditionalBulb`, a `SmartLight`, or a `Fan` — we never rewrite `Switch`.

---

## One-line cheat sheet
| Letter | Full name | Plain meaning | Our example |
|--------|-----------|---------------|-------------|
| **S** | Single Responsibility | One class, one job | Split `OrderService` into shipping/payment/email |
| **O** | Open/Closed | Add new code, don't edit old code | New `DroneShipping` class, nothing else touched |
| **L** | Liskov Substitution | Subtypes must not surprise/crash | PDF can't be passed where editing is required (caught at compile time) |
| **I** | Interface Segregation | Small focused interfaces, no forced methods | `Abrible` / `Editable` / `Guardable` instead of one big interface |
| **D** | Dependency Inversion | Depend on abstractions, inject details | `Switch` receives any `Switchable` device |

**Mental shortcut to remember the goal of all 5:** *"Make new things easy to add, and make old things hard to break."*

