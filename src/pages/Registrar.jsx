import { useState } from 'react'
import { Link } from 'react-router-dom'
import Alerta from '../components/Alerta';
import clienteAxios from '../config/clienteAxios';

const Registrar = () => {

    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');
    const [repetirPassword, setRepetirPassword] = useState('');
    const [alerta, setAlerta] = useState({});

    const handleSubmit = async e => {
        e.preventDefault();
        // Todos los campos son obligatorios
        if ([nombre, email, password, repetirPassword, user].includes('')) {
            setAlerta({
                msg: 'Todos los campos son obligatorios',
                error: true
            })
            return;
        }

        // Password y Password 2 deben ser iguales
        if (password !== repetirPassword) {
            setAlerta({
                msg: 'Los password no son iguales',
                error: true
            })
            return;
        }

        // Longitud del Password
        if (password.length < 6) {
            setAlerta({
                msg: 'El password es muy corto, Agrega minimo 6 caracteres',
                error: true
            })
            return;
        }

        setAlerta({})

        // Crear el user en la API
        try {
            const { data } = await clienteAxios.post(`/usuarios`, {nombre, email, password,user})
            setAlerta({
                msg: data.msg,
                error: false
            })
            // Limpiar form
            setNombre('');
            setEmail('');
            setUser('');
            setPassword('');
            setRepetirPassword('');

        } catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                error: true
            })
        }

    }

    const { msg } = alerta

    return (
        <>
            <h1 className="text-indigo-600 text-5xl font-black capitalize"> Crea tu cuenta y administra tus  {''} <span className="text-slate-700"> proyectos</span>
            </h1>

            { msg && <Alerta alerta={alerta} /> }

            <form 
             className="my-10 bg-white rounded-lg px-10 py-10 shadow"
             onSubmit={handleSubmit} 
            >
                <div className="my-5">
                    <label
                     className="uppercase text-gray-600 block font-bold text-xl"
                     htmlFor="nombre"
                    >
                        Nombre
                    </label>
                    <input 
                        type="text"
                        placeholder="Tu Nombre"
                        className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
                        id="nombre"
                        value={nombre}
                        onChange={e => setNombre(e.target.value)}
                    />
                </div>
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
                     htmlFor="usuario"
                    >
                        Usuario
                    </label>
                    <input 
                        type="text"
                        placeholder="Registre un usuario de Red"
                        className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
                        id="usuario"
                        value={user}
                        onChange={e => setUser(e.target.value)}
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
                <div className="my-5">
                    <label
                     className="uppercase text-gray-600 block font-bold text-xl"
                     htmlFor="password2"
                    >
                        Repetir Password
                    </label>
                    <input 
                        type="password"
                        placeholder="Repetir Password"
                        className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
                        id="password2"
                        value={repetirPassword}
                        onChange={e => setRepetirPassword(e.target.value)}
                    />
                </div>

                <input 
                    type="submit"
                    value="Crear Cuenta"
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
                    to="/olvide-password"
                >
                    Olvide mi Password
                </Link>
            </nav>
        </>
    );
}

export default Registrar;
