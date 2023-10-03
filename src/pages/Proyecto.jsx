import { useParams, Link } from "react-router-dom";
import { useEffect } from "react";
import useProyectos from "../hooks/useProyectos";
import useAdmin from "../hooks/useAmin";
import ModalFormTarea from "../components/ModalFormTarea";
import ModalEliminarTarea from "../components/ModalEliminarTarea"
import ModalEliminarColaborador from "../components/ModalEliminarColaborador";
import Tarea from "../components/Tarea";
import Alerta from "../components/Alerta";
import Colaborador from "../components/Colaborador";
import io from 'socket.io-client';

let socket;

const Proyecto = () => {

  const params = useParams();
  const { obtenerProyecto, proyecto, cargando,handleModalTarea, submitTareasProyecto, eliminarTareaProyecto, editarTareaProyecto, cambiarEstadoProyecto } = useProyectos();

  const admin = useAdmin();

  useEffect(() => {
    obtenerProyecto(params.id)
  }, []);

  // =========================== SOCKET IO ===========================

  useEffect(() => {
    socket = io(import.meta.env.VITE_BACKEND_URL)
    socket.emit('abrir proyecto', params.id)
  }, []);

  useEffect(() => {
    socket.on('tarea agregada',(tareaNueva) => {
      if (tareaNueva.proyecto === proyecto._id) {
        submitTareasProyecto(tareaNueva)
      }
      
    });

    socket.on('tarea eliminada',tareaEliminada => {
      if (tareaEliminada.proyecto === proyecto._id) {
        eliminarTareaProyecto(tareaEliminada)
      }
    });

    socket.on('tarea editada',tareaEditada => {
      if (tareaEditada.proyecto === proyecto._id) {
        editarTareaProyecto(tareaEditada)
      }
    });

    socket.on('estado actualizado', estadoActualizado => {
      if (estadoActualizado.proyecto._id === proyecto._id) {
        cambiarEstadoProyecto(estadoActualizado)
      }
    })
  });

  // ===============================================================

  const { nombre } = proyecto

  return (
    // TODO cargar un spiner
    cargando ? 'Cargando...' : (
      
      <>
        <div className="flex justify-between">
          <h1 className="font-black text-3xl"> {nombre} </h1>

          {/* admin es para oculatar el botón editar proyecto si es colaborador  */}
          {admin && (
            <div className="flex items-center gap-2 text-gray-400 hover:text-black">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
              </svg>

              <Link
                to={`/proyectos/editar/${params.id}`}
                className="uppercase font-bold"
              >
                Editar
              </Link>
          </div>
          )}
          {/* -------------------------------------------------------------*/}
        </div>

        {/* admin es para oculatar el botón nueva tarea si es colaborador  */}
        {admin && (
          <button
          onClick={handleModalTarea}
          type="button"
          className="text-sm px-5 py-2 w-full md:w-auto rounded-lg uppercase font-bold bg-sky-400 text-white text-center mt-5 flex gap-2 hover:bg-sky-600 items-center justify-center"
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>

            Nueva Tarea
          </button>
        )}
        {/* -------------------------------------------------------------*/}
        
        <p className="font-bold text-xl mt-10"> Tareas del Proyecto</p>     

        <div className="bg-white shadow mt-10 rounded-lg">
          {proyecto.tareas?.length ? 
            proyecto.tareas?.map(tarea => (
              <Tarea
                key={tarea._id}
                tarea={tarea}
              />
            ))
            :
            <p className="text-center my-5 p-10 text-sm font-semibold">Aún no tienes tareas en este proyecto</p>}
        </div>
        
         {/* admin es para oculatar el modulo de añadir y visualizar colaboradores si es un colaborador */}
        {admin && (
          <>
            <div className="flex justify-between items-center mt-10">
            <p className="font-bold text-xl"> Colaboradores</p>
            <Link 
              to={`/proyectos/nuevo-colaborador/${proyecto._id}`}
              className="text-gray-400 uppercase font-bold hover:text-black"
            >
              Añadir
            </Link>
          </div>

          <div className="bg-white shadow mt-10 rounded-lg">
            {proyecto.colaboradores?.length ? 
              proyecto.colaboradores?.map(colaborador => (
                <Colaborador
                  key={colaborador._id}
                  colaborador={colaborador}
                />
              ))
              :
              <p className="text-center my-5 p-10 text-sm font-semibold">No hay colaboradores en este proyecto</p>}
          </div>
        </>
        )}
        {/* --------------------------------------------------------------------- */}

        <ModalFormTarea />
        <ModalEliminarTarea />
        <ModalEliminarColaborador />
      </>
      
    )
    )
}

export default Proyecto