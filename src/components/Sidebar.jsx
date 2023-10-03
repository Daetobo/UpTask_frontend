import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const Sidebar = () => {

  const { auth } = useAuth();

  return (
    <aside className="md:w-1/3 lg:w-1/5 xl:w-1/6 px-5 py-10">
        <p className="text-sm font-bold uppercase">Hola: {auth.nombre}</p>
        <Link 
            to="crear-proyecto"
            className="bg-sky-600 uppercase p-3 text-white font-bold mt-5 text-center rounded-lg block w-full hover:bg-sky-800 transition-colors"
        >
            Nuevo Proyecto
        </Link>
    </aside>
  )
}

export default Sidebar