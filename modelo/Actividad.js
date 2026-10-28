import Joi from "joi"; 
class Actividad{

nombre = null
descripcion= null
categoria= null
fechaInicio= null
cupo= null
precio= null
ubicacion= null

    constructor({
        nombre,
        descripcion,
        categoria,
        fechaInicio,
        cupo,
        precio,
        ubicacion
    }) {
        this.nombre = nombre
        this.descripcion = descripcion
        this.categoria = categoria
        this.fechaInicio = fechaInicio
        this.cupo = cupo
        this.precio = precio

        this.ubicacion = {
            pais: {
                codigo: ubicacion.pais.codigo,
                nombre: ubicacion.pais.nombre
            },
            provincia: {
                codigo: ubicacion.provincia.codigo,
                nombre: ubicacion.provincia.nombre
            },
            ciudad: {
                idExterno: ubicacion.ciudad.idExterno,
                nombre: ubicacion.ciudad.nombre
            },
            direccion: ubicacion.direccion
        }

        }
    validar(){
        return true
    }

    get(){
        return {        nombre: this.nombre,
        descripcion : this.descripcion,
        categoria: this.categoria,
        fechaInicio: this.fechaInicio,
        cupo: this.cupo,
        precio: this.precio,
        ubicacion: this.ubicacion}
    }
}

export default Actividad
