import Actividad from "../modelo/Actividad.js";
import ModeloMem from "../modelo/DAO/actividadesMem.js";

class Servicio{
    #modelo = null

    constructor(){
        this.#modelo = new ModeloMem()
    }

    obtenerActividades = async (id)=>{
        if(id){
            const actividad = await this.#modelo.obtenerActividad(id)
            return actividad
        } else {
            const actividades = await this.#modelo.obtenerActividades()
            return actividades
        }
    }

    guardarActividad = async (actividad)=>{
        const actividadModelo = new Actividad(actividad)
        actividadModelo.validar()
        const actividadGuardada = await this.#modelo.guardarActividad(actividadModelo)
        return actividadGuardada
    }
}
export default Servicio