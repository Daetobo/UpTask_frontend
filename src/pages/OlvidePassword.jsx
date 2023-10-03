import { useState } from 'react';
import { Link } from 'react-router-dom';
import clienteAxios from '../config/clienteAxios';
import Alerta from '../components/Alerta';

const OlvidePassword = () => {

    const [email, setEmail] = useState('');
    const [alerta, setAlerta] = useState({});

    const handleSubmit = async e => {
        e.preventDefault();

        if (email === '' || email.length < 6) {
            setAlerta({
                msg:'El  Email es obligatorio',
                error: true
            })
            return;
        }

        try {
            const { data } = await clienteAxios.post(`/usuarios/olvide-password`, {email})
            setAlerta({
                msg: data.msg,
                error: false
            })

        } catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                error: true
            })
        }
    }

    const { msg } = alerta;

    return (
        <>
            <h1 className="text-indigo-600 text-5xl font-black capitalize"> Recupera tu acceso y no pierdas tus {''} <span className="text-slate-700"> proyectos</span>
            </h1>

            {msg && <Alerta alerta={alerta}/>}

            <form 
             className="my-10 bg-white rounded-lg px-10 py-10 shadow"
             onSubmit={handleSubmit}
            >
            
                <div className="my-5">
                    <label
                    className="uppercase text-gray-600 block font-bold text-xl"
                    htmlFor="email"
                    >
                        Email
                    </label>
                    <input 
                        type="email"
                        placeholder="Email de Registro"
                        className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
                        id="email"
                        onChange={e => setEmail(e.target.value)}
                    />
                </div>

                <input 
                    type="submit"
                    value="Enviar Instrucciones"
                    className="bg-indigo-600 w-full py-3 mb-5 text-white font-bold uppercase rounded hover:cursor-pointer hover:bg-indigo-700 transition-colors"
                />
            </form>

            <nav className='lg:flex lg:justify-between'>
                <Link
                    className='block text-center my-2 text-slate-500 capitalize text-sm'
                    to="/"
                >
                    ¿Ya tienes una cuenta? inicia sesión
                </Link>
                <Link
                    className='block text-center my-2 text-slate-500 capitalize text-sm'
                    to="/registrar"
                >
                    ¿No tienes una Cuenta? Regístrate
                </Link>
            </nav>
        </>
    );
}

export default OlvidePassword;
