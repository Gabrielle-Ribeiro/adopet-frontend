// dependencies
import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import React from "react";
import { jwtDecode } from "jwt-decode";

import client from '../axios.config'



// 'http://localhost:3000/adotante'

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('')

    useEffect(() => {
        const recoveredUser = localStorage.getItem('user');

        if (recoveredUser) {
            setUser(JSON.parse(recoveredUser));
        }

          setLoading(false);
    }, []);

    const login = async (email, password) => {
      try {
        const response = await client.post(`/adotante/login`, { email, password})
        const token = response.data.token;
          // console.log('login auth', { email:email, password:password });

        if (token){
            localStorage.setItem('token', token);

            const decode = jwtDecode(token);
            // const user = decode(token);
            // console.log(decode);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            setUser(decode);
            navigate('/home');
            // console.log('entrou no if');

        }else {
             console.error("Erro. Verifique suas credenciais");
            setErrorMessage('Falha no login. Consulte suas credenciais.')
        }
    }catch(error){
        setErrorMessage('Falha no login. Consulte suas credenciais.')
        console.error('Erro ao autenticar', error.message);

        throw error
    }
}
                  
   

    const logout = () => {
        // console.log('logout');
        localStorage.removeItem('user');
        setUser(null);
        navigate('/');
    };

     return (
        <AuthContext.Provider value={{ authenticated: !!user, user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
