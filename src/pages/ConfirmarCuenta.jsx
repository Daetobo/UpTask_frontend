import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import clienteAxios from '../config/clienteAxios'
import Alerta from '../components/Alerta'


const ConfirmarCuenta = () => {

    const [alerta, setAlerta] = useState({});
    const [cuentaConfirmada, setCuentaConfirmada] = useState(false);

    const params = useParams();
    const { id } = params;

    useEffect(() => {
        const confirmarCuenta = async () =>{
            try {
                const url = `/usuarios/confirmar/${id}`
                const { data } = await clienteAxios(url)
                console.log(data)
                setAlerta({
                    msg: data.msg,
                    error: false
                })
                
                setCuentaConfirmada(true);
            } catch (error) {
                setAlerta({
                    msg: error.response.data.msg,
                    error: true
                })
            }
        }

        return () => { confirmarCuenta() };
    }, []);

    const { msg } = alerta;

    return (
        <>
            <h1 className="text-indigo-600 text-5xl font-black capitalize"> Confirma tu cuenta y comienza a crear tus  {''} <span className="text-slate-700"> proyectos</span>
            </h1>

            <div className='mt-20 md:mt-10 shadow-lg px-5 py-10 rounded-xl bg-white'>
                {msg && <Alerta alerta={alerta} />}

                {cuentaConfirmada && (
                    <Link
                        className='block text-center my-2 text-slate-500 capitalize text-sm'
                        to="/"
                    >
                        inicia sesión
                    </Link>
                )}
            </div>


        </>
    );
}

export default ConfirmarCuenta;
