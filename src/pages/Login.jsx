import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Alerta from '../components/Alerta';
import clienteAxios from '../config/clienteAxios';
import useAuth from '../hooks/useAuth';

const Login = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [alerta, setAlerta] = useState({});

    const { setAuth } = useAuth();
    const navigate = useNavigate()

    const handleSubmit = async e =>{
        e.preventDefault();

        if([email, password].includes('')){
            setAlerta({
                msg: 'Todos los campos son Obligatorios',
                error: true
            });
            return;
        }  

        try {
            const { data } = await clienteAxios.post('/usuarios/login', {email, password})
            setAlerta({});
            localStorage.setItem('token', data.token);
            setAuth(data);
            navigate('/proyectos')

        } catch (error) {
            console.log(error)
            setAlerta({
                msg: error.response.data.msg,
                error: true
            })
        }
    }

    const { msg } = alerta;

    return (
        <>
            <h1 className="text-indigo-600 text-5xl font-black capitalize">Inicia sesión y administra tus {''} <span className="text-slate-700"> proyectos</span>
            </h1>

            {msg && <Alerta alerta={alerta} /> }

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
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                </div>
                <div className="my-5">
                    <label
                     className="uppercase text-gray-600 block font-bold text-xl"
                     htmlFor="password"
                    >
                        Password
                    </label>
                    <input 
                        type="password"
                        placeholder="Password de Registro"
                        className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
                        id="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                </div>

                <input 
                    type="submit"
                    value="Iniciar Sesión"
                    className="bg-indigo-600 w-full py-3 mb-5 text-white font-bold uppercase rounded hover:cursor-pointer hover:bg-indigo-700 transition-colors"
                />
            </form>

            <nav className='lg:flex lg:justify-between'>
                <Link
                    className='block text-center my-2 text-slate-500 capitalize text-sm'
                    to="registrar"
                >
                    ¿No tienes una Cuenta? Regístrate
                </Link>
                <Link
                    className='block text-center my-2 text-slate-500 capitalize text-sm'
                    to="olvide-password"
                >
                    Olvide mi Password
                </Link>
            </nav>
        </>
    );
}

export default Login;
