// dependencies
import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import React from "react";
import { jwtDecode } from "jwt-decode";

const baseURL = 'http://localhost:3000/adotante'

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const recoveredUser = localStorage.getItem('user');

        if (recoveredUser) {
            setUser(JSON.parse(recoveredUser));
        }

          setLoading(false);
    }, []);

    const login = async (email, password) => {
      try {
        const response = await axios.post(baseURL+'/login', { email, password})
        const token = response.data.token;
        console.log(token);
        console.log('chegou aqui');
        // console.log('login auth', { email:email, password:password });

        if (token){
            localStorage.setItem('token', token);

            const decode = jwtDecode(token);
            // const user = decode(token);
            console.log(decode);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            setUser(decode);
            navigate('/home');
            console.log('entrou no if');

        }else {
            alert('Consulte suas credenciais')
            console.error("Erro. Verifique suas credenciais");
        }
    }catch(error){
        alert('Falha no Login, consulte suas credenciais')
        console.error('Erro ao autenticar', error.message);
        throw error
    }
}
                  

        // // creating a session api
        // const loggedUser = {
        //     id: '123',
        //     email
        // };

        // // saving user on localStorage
        // localStorage.setItem('user', JSON.stringify(loggedUser));

        // if (password === '12345aA') {
        //     setUser(loggedUser);
        //     navigate('/home');
        // }
    

    const logout = () => {
        console.log('logout');
        localStorage.removeItem('user');
        setUser(null);
        navigate('/');
    };

    // !!user:
    // user != null, then authenticated = true
    // user == null, then authenticated = false

    return (
        <AuthContext.Provider value={{ authenticated: !!user, user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
