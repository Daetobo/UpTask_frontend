import { Link } from "react-router-dom"
import useProyectos from "../hooks/useProyectos"
import useAuth from "../hooks/useAuth";
import Busqueda from "./Busqueda";

const Header = () => {

    const { handleBuscador, cerrarSesionProyectos } = useProyectos();
    const { cerrarSesionAuth } = useAuth();

    const handleCerrarSesion = () => {
        cerrarSesionProyectos();
        cerrarSesionAuth();
        localStorage.removeItem('token')
    }

  return (
    <header className="px-4 py-5 bg-white border-b">
        <div className="md:flex md: justify-between">

            <h2 className="text-3xl text-sky-600 font-black text-center mb-5 md:mb-0">UpTask</h2>

            <div className="flex flex-col md:flex-row items-center gap-4">
                <button
                    type="button"
                    className="font-bold uppercase"
                    onClick={handleBuscador}
                >
                    Buscar proyecto
                </button>
                <Link
                    to="/proyectos"
                    className="font-bold uppercase"
                >Proyectos</Link>

                <button
                    type="button"
                    className=" text-white bg-sky-600 uppercase rounded-md p-3 font-bold text-xs "
                    onClick={handleCerrarSesion}
                >
                Cerrar Sesión
                </button>

                <Busqueda />
            </div>

        </div>

    </header>
  )
}

export default Header