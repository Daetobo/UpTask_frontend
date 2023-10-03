import { useState, useEffect, createContext } from "react";
import clienteAxios from "../config/clienteAxios";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import io from 'socket.io-client';

let socket;

const ProyectosContext = createContext();

const ProyectosProvider = ({children}) => {

const [proyectos, setProyectos] = useState([]);
const [alerta, setAlerta] = useState({});
const [proyecto, setProyecto] = useState({});
const [cargando, setCargando] = useState(false);
const [modalFromTarea, setModalFromTarea] = useState(false);
const [tarea, setTarea] = useState({});
const [modalEliminarTarea, setModalEliminarTarea] = useState(false);
const [colaborador, setColaborador] = useState({});
const [modalEliminarColaborador, setModalEliminarColaborador] = useState(false);
const [buscador, setBuscador] = useState(false);

const navigate = useNavigate()
const { auth } = useAuth()

useEffect(() => {
    const obtenerProyectos = async () => {
        try {
            const token = localStorage.getItem('token')
            if (!token) return
    
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization:`Bearer ${token}`
                }
            }

            const { data } = await clienteAxios('/proyectos',config)
            setProyectos(data)

        } catch (error) {
            console.log(error)
        }
    }

    obtenerProyectos()
}, [auth]);

// conexión socket io
useEffect(() => {
    //url con la que se conecta
    socket = io(import.meta.env.VITE_BACKEND_URL)

}, []);

const mostrarAlerta = alerta => {
    setAlerta(alerta)

    setTimeout(() => {
        setAlerta({})
    }, 5000);
}

const submitProyecto = async proyecto => {

    if (proyecto.id) {
        await editarProyecto(proyecto)
    } else {
        await nuevoProyecto(proyecto)
    }

}

const editarProyecto = async proyecto => {
    try {
        const token = localStorage.getItem('token')
        if (!token) return

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization:`Bearer ${token}`
            }
        }
        const { data } = await clienteAxios.put(`/proyectos/${proyecto.id}`, proyecto, config)
        console.log(data)

        //sincronizar el state
        const proyectosActualizados = proyectos.map(proyectoState => (
            proyectoState._id === data._id ? data : proyectoState
        ))
        
        setProyectos(proyectosActualizados)

        //Mostrar Alerta
        setAlerta({
            msg: 'proyecto Actualizado Correctamente',
            error: false
        })

        //Redireccionar
        setTimeout(() => {
            setAlerta({})
            navigate('/proyectos')
        }, 3000);

    } catch (error) {
        console.log(error)
    }
    
}

const nuevoProyecto = async proyecto => {
    try {
        const token = localStorage.getItem('token')
        if (!token) return

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization:`Bearer ${token}`
            }
        }
        const { data } = await clienteAxios.post('/proyectos', proyecto, config)

        //se hace una copia de los proyectos y se agrega el nuevo proyecto ingresado en data
        //para mantener el state actualizado y visualizar los proyectos en tiempo real sin recargar pg
        setProyectos([...proyectos,data])

        setAlerta({
            msg: 'proyecto creado correctamente',
            error: false
        })

        setTimeout(() => {
            setAlerta({})
            navigate('/proyectos')
        }, 3000);

    } catch (error) {
        console.log(error)
    }    
}

const obtenerProyecto = async id =>{
    //esta variable cargando es para evitar que mientras cambia de estado se vea el estado anterior
    setCargando(true)
    try {
        const token = localStorage.getItem('token')
        if (!token) return

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization:`Bearer ${token}`
            }
        }

        const { data } = await clienteAxios(`/proyectos/${id}`,config)
        setProyecto(data)
        setAlerta({})
    } catch (error) {
        navigate('/proyectos')
        setAlerta({
            msg: error.response.data.msg,
            error: true
        })
        setTimeout(() => {
            setAlerta({})
        }, 3000);
    } finally {
        setCargando(false)
    }
}
    
const eliminarProyecto = async id =>{
    try {
        const token = localStorage.getItem('token')
        if (!token) return

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization:`Bearer ${token}`
            }
        }
        const { data } = await clienteAxios.delete(`/proyectos/${id}`, config) 

        const proyectosActualizados = proyectos.filter(proyectoState => proyectoState._id != id)
        setProyectos(proyectosActualizados)

        setAlerta({
            msg: data.msg,
            error: false
        })

        setTimeout(() => {
            setAlerta({})
            navigate('/proyectos')
        }, 3000);

    } catch (error) {
        console.log(error)
    }
}

const handleModalTarea = () => {
    setModalFromTarea(!modalFromTarea)
    setTarea({})
}

const submitTarea = async tarea =>{

    if (tarea?.id) {
        await editarTarea(tarea)
    } else {
        await crearTarea(tarea)
    }
}

const crearTarea = async tarea => {
    try {
        const token = localStorage.getItem('token')
        if (!token) return

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization:`Bearer ${token}`
            }
        }
        const { data } = await clienteAxios.post('/tareas', tarea, config) 

        //Agrega la tarea al state
        //se hace copia del proyecto, se toma las tareas y se hace copia de las tareas
        //del proyecto y se agrega la nueva tarea que es la respuesta de la api de nueva tarea

        // const proyectoActualizado = {...proyecto}
        // proyectoActualizado.tareas = [...proyecto.tareas, data]
        // setProyecto(proyectoActualizado)
        setAlerta({})
        setModalFromTarea(false)

        // SOCKET IO
        socket.emit('nueva tarea', data)

    } catch (error) {
        console.log(error)
    }
}

const editarTarea = async tarea => {
    try {
        const token = localStorage.getItem('token')
        if (!token) return

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization:`Bearer ${token}`
            }
        }
        const { data } = await clienteAxios.put(`/tareas/${tarea.id}`, tarea, config) 

        socket.emit('editar tarea',data)

        setAlerta({})
        handleModalTarea(false)
    } catch (error) {
        console.log(error)
    }
}

const handleModalEditarTarea = tarea => {
    setTarea(tarea)
    setModalFromTarea(true)
}

const handleModalEliminarTarea = tarea => {
    setTarea(tarea)
    setModalEliminarTarea(!modalEliminarTarea)
}

const eliminarTarea = async () => {

    try {
        const token = localStorage.getItem('token')
        if (!token) return

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization:`Bearer ${token}`
            }
        }
        const { data } = await clienteAxios.delete(`/tareas/${tarea._id}`, config) 
        setAlerta({
            msg: data.msg,
            error: false
        })


        setModalEliminarTarea(false)

        // SOCKET IO
        socket.emit('eliminar tarea', tarea)

        setTarea({})
        setTimeout(() => {
            setAlerta({})
        }, 3000);
    } catch (error) {
        console.log(error)
    }
}

const submitColaborador = async email => {
    setCargando(true)
    try {
        const token = localStorage.getItem('token')
        if (!token) return

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization:`Bearer ${token}`
            }
        }
        const { data } = await clienteAxios.post('/proyectos/colaboradores', {email}, config)
        setColaborador(data)
        setAlerta({})
    } catch (error) {
        setAlerta({
            msg: error.response.data.msg,
            error: true
        })
    } finally{
        setCargando(false)
    }
}

const agregarColaborador = async email => {
    try {
        const token = localStorage.getItem('token')
        if (!token) return

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization:`Bearer ${token}`
            }
        }
        const { data } = await clienteAxios.post(`/proyectos/colaboradores/${proyecto._id}`,email, config)

        setAlerta({
            msg:data.msg,
            error: false
        })

        setColaborador({})

        setTimeout(() => {
            setAlerta({})
        }, 3000);

    } catch (error) {
        setAlerta({
            msg: error.response.data.msg,
            error: true
        })
    }
}

const handleModalEliminarColaborador = colaborador => {
    console.log(colaborador)
    setModalEliminarColaborador(!modalEliminarColaborador)
    setColaborador(colaborador)
}

const eliminarColaborador = async () => {
    
    try {
        const token = localStorage.getItem('token')
        if (!token) return

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization:`Bearer ${token}`
            }
        }
        const { data } = await clienteAxios.post(`/proyectos/eliminar-colaborador/${proyecto._id}`,{id: colaborador._id}, config)
        console.log(colaborador._id)

        const proyectoActualizado = {...proyecto}
        proyectoActualizado.colaboradores = proyectoActualizado.colaboradores.filter(colaboradorState => colaboradorState._id !== colaborador._id)
        setProyecto(proyectoActualizado)
        setAlerta({
            msg: data.msg,
            error: false
        })
        setColaborador({})
        setModalEliminarColaborador(false)
        setTimeout(() => {
            setAlerta({})
        }, 3000);
    } catch (error) {
        console.log(error)
    }
}

const completarTarea = async id => {
    console.log(id)
    try {
        const token = localStorage.getItem('token')
        if (!token) return

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization:`Bearer ${token}`
            }
        }
        const { data } = await clienteAxios.post(`/tareas/estado/${id}`,{}, config)

        // SOCKET IO
        socket.emit('cambiar estado', data)

        setAlerta({})
        setTarea({})

    } catch (error) {
        console.log(error.response)
    }
}

const handleBuscador = () => {
    setBuscador(!buscador)
}

// SOCKET IO

const submitTareasProyecto = tarea => {

    const proyectoActualizado = {...proyecto}
    proyectoActualizado.tareas = [...proyectoActualizado.tareas, tarea]
    setProyecto(proyectoActualizado)
}

const eliminarTareaProyecto = tarea => {
    const proyectoActualizado = {...proyecto};
    proyectoActualizado.tareas = proyectoActualizado.tareas.filter(tareaSatate => tareaSatate._id != tarea._id )
    setProyecto(proyectoActualizado)
}

const editarTareaProyecto = tarea => {
    const proyectoActualizado = {...proyecto};
    proyectoActualizado.tareas = proyectoActualizado.tareas.map(tareaState => tareaState._id === tarea._id ? tarea : tareaState)
    setProyecto(proyectoActualizado)
}

const cambiarEstadoProyecto = tarea => {
    const proyectoActualizado = {...proyecto}
    proyectoActualizado.tareas = proyectoActualizado.tareas.map(tareaState => tareaState._id === tarea._id ? tarea : tareaState) 
    setProyecto(proyectoActualizado)
}

const cerrarSesionProyectos = () => {
    setProyectos([]);
    setProyecto({});
    setAlerta({});
}

    return (

        <ProyectosContext.Provider
            value={{
                proyectos,
                mostrarAlerta,
                alerta,
                submitProyecto,
                obtenerProyecto,
                proyecto, 
                cargando,
                eliminarProyecto,
                modalFromTarea,
                handleModalTarea,
                submitTarea,
                handleModalEditarTarea,
                tarea,
                modalEliminarTarea,
                handleModalEliminarTarea,
                eliminarTarea,
                submitColaborador,
                colaborador,
                agregarColaborador,
                handleModalEliminarColaborador,
                modalEliminarColaborador,
                eliminarColaborador,
                completarTarea,
                handleBuscador,
                buscador,
                submitTareasProyecto,
                eliminarTareaProyecto,
                editarTareaProyecto,
                cambiarEstadoProyecto,
                cerrarSesionProyectos
            }}
        >
            {children}
        </ProyectosContext.Provider>
    )
}

export {
    ProyectosProvider
}

export default ProyectosContext;