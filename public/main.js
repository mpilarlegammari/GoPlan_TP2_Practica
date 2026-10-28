const formulario = document.querySelector('#formulario')
const lista = document.querySelector('#actividades')
const mensaje = document.querySelector('#mensaje')
const estadoLista = document.querySelector('#estadoLista')
const botonGuardar = formulario.querySelector('button')

async function consultarApi(opciones) {
    const respuesta = await fetch('/api/actividades', opciones)
    if (!respuesta.ok) {
        const detalle = await respuesta.json().catch(() => ({}))
        throw new Error(detalle.error || 'No se pudo completar la solicitud')
    }
    return respuesta.json()
}

function agregarTexto(elemento, etiqueta, texto) {
    const nodo = document.createElement(etiqueta)
    nodo.textContent = texto
    elemento.append(nodo)
}

async function cargarActividades() {
    estadoLista.textContent = 'Cargando actividades...'
    estadoLista.className = ''
    try {
        const actividades = await consultarApi()
        if (!Array.isArray(actividades)) throw new Error('La respuesta no es una lista de actividades')
        lista.replaceChildren()
        for (const actividad of actividades) {
            const item = document.createElement('li')
            const ubicacion = actividad.ubicacion
            agregarTexto(item, 'h3', actividad.nombre)
            agregarTexto(item, 'p', actividad.descripcion)
            agregarTexto(item, 'p', `Categoría: ${actividad.categoria || 'Sin categoría'}`)
            agregarTexto(item, 'p', `Fecha: ${new Date(actividad.fechaInicio).toLocaleString('es-AR')}`)
            agregarTexto(item, 'p', `Cupo: ${actividad.cupo} | Precio: ${Number(actividad.precio).toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}`)
            agregarTexto(item, 'p', [ubicacion?.direccion, ubicacion?.ciudad?.nombre, ubicacion?.provincia?.nombre, ubicacion?.pais?.nombre].filter(Boolean).join(', '))
            lista.append(item)
        }
        estadoLista.textContent = actividades.length ? '' : 'Todavía no hay actividades.'
    } catch (error) {
        estadoLista.className = 'error'
        estadoLista.textContent = `No se pudo actualizar la lista: ${error.message}`
    }
}

formulario.addEventListener('submit', async evento => {
    evento.preventDefault()
    const datos = new FormData(formulario)
    const texto = nombre => datos.get(nombre).trim()
    const actividad = {
        nombre: texto('nombre'),
        descripcion: texto('descripcion'),
        categoria: texto('categoria'),
        fechaInicio: new Date(datos.get('fechaInicio')).toISOString(),
        cupo: Number(datos.get('cupo')),
        precio: Number(datos.get('precio')),
        ubicacion: {
            pais: { codigo: texto('paisCodigo').toUpperCase(), nombre: texto('pais') },
            provincia: { codigo: texto('provinciaCodigo').toUpperCase(), nombre: texto('provincia') },
            ciudad: { nombre: texto('ciudad') },
            direccion: texto('direccion')
        }
    }
    botonGuardar.disabled = true
    mensaje.className = ''
    mensaje.textContent = 'Guardando...'
    try {
        await consultarApi({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(actividad)
        })
        formulario.reset()
        mensaje.textContent = 'Actividad agregada.'
        await cargarActividades()
    } catch (error) {
        mensaje.className = 'error'
        mensaje.textContent = `No se pudo guardar: ${error.message}`
    } finally {
        botonGuardar.disabled = false
    }
})

document.querySelector('#recargar').addEventListener('click', cargarActividades)
cargarActividades()
