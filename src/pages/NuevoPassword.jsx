import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import clienteAxios from '../config/clienteAxios';
import Alerta from '../components/Alerta';

const NuevoPassword = () => {

    const [tokenValido, setTokenValido] = useState(false);
    const [alerta, setAlerta] = useState({});
    const [password, setPassword] = useState('');
    const [passwordModificado, setPasswordModificado] = useState(false);

    const params = useParams();
    const { token } = params;

    useEffect(() => {
        const comprobarToken = async () => {
            try {
                await clienteAxios(`/usuarios/olvide-password/${token}`)
                setTokenValido(true);
            } catch (error) {
                setAlerta({
                    msg: error.response.data.msg,
                    error: true
                })
            }
        }
        return () => { comprobarToken() } 
    }, []);

    const { msg } = alerta;

    const handleSubmit = async e => {
        e.preventDefault();

        if (password.length < 6) {
            setAlerta({
                msg: 'El password debe ser minimo de 6 caracteres',
                error: true
            })
            return;
        }

        try {
            const url = `/usuarios/olvide-password/${token}`

            const { data } = await clienteAxios.post(url,{password})
            setAlerta({
                msg: data.msg,
                error: false
            })
            setPasswordModificado(true)
        } catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                error: true
            })
        }
    };

    return (
        <>
            <h1 className="text-indigo-600 text-5xl font-black capitalize"> Restablece tu password y no pierdas acceso a tus  {''} <span className="text-slate-700"> proyectos</span>
            </h1>

            {msg && <Alerta alerta={alerta} />}

            {tokenValido && (
                <form 
                 className="my-10 bg-white rounded-lg px-10 py-10 shadow"
                 onSubmit={handleSubmit}  
                >
                    <div className="my-5">
                        <label
                        className="uppercase text-gray-600 block font-bold text-xl"
                        htmlFor="password"
                        >
                            Nuevo Password
                        </label>
                        <input 
                            type="password"
                            placeholder="Escribe tu nuevo Password"
                            className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
                            id="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                    </div>

                    <input 
                        type="submit"
                        value="Guardar Nuevo Password"
                        className="bg-indigo-600 w-full py-3 mb-5 text-white font-bold uppercase rounded hover:cursor-pointer hover:bg-indigo-700 transition-colors"
                    />
                </form>
            )}

            {passwordModificado && (
                    <Link
                        className='block text-center my-2 text-slate-500 capitalize text-sm'
                        to="/"
                    >
                        inicia sesión
                    </Link>
            )}
        </>
    );
}

export default NuevoPassword;
