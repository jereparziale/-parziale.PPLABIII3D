export class Anuncio {
    constructor(id,titulo, transaccion, descripcion,precio,cantBaños,cantAutos,cantHab) {
        this.id=id;
        this.titulo=titulo;
        this.transaccion=transaccion;
        this.descripcion=descripcion;
        this.precio=precio;
        this.cantBaños=cantBaños;
        this.cantAutos=cantAutos;
        this.cantHab=cantHab;
    }

      // Getters
      Titulo() {
        return this.titulo;
    }

    Transaccion() {
        return this.transaccion;
    }

    Descripcion() {
        return this.descripcion;
    }

    Precio() {
        return this.precio;
    }

    CantBaños() {
        return this.cantBaños;
    }

    CantAutos() {
        return this.cantAutos;
    }

    CantHab() {
        return this.cantHab;
    }

    // Setters
    Titulo(titulo) {
        this.titulo = titulo;
    }

    Transaccion(transaccion) {
        this.transaccion = transaccion;
    }

    Descripcion(descripcion) {
        this.descripcion = descripcion;
    }

    Precio(precio) {
        this.precio = precio;
    }

    CantBaños(cantBaños) {
        this.cantBaños = cantBaños;
    }

    CantAutos(cantAutos) {
        this.cantAutos = cantAutos;
    }

    CantHab(cantHab) {
        this.cantHab = cantHab;
    }
}  