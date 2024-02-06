// styles
import Button from './Button';

// dependencies
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from "react-hook-form";
import { useEffect } from 'react';
import { useState } from 'react';
import { jwtDecode } from 'jwt-decode';
// assets
import loggedUser from '../assets/logged-user.png';

import { useContext } from 'react';
import { AuthContext } from '../contexts/auth';

import client from '../axios.config'


// const baseURL = 'http://localhost:3000/mensagem'

const Message = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { authenticated, user } = useContext(AuthContext)
  const [userMessages, setUserMessages] = useState([]);
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const fetchUserMessages = async () => {
      try {
        if(authenticated){
          const token = localStorage.getItem('token')
          const decodedToken = jwtDecode(token);
          client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await client.get(`/mensagem/${decodedToken.sub}`);
        
      setUserMessages(response.data.msg)
      // console.log(response.data.msg)
    }
      } catch (error) {
        console.error('Erro ao obter mensagens do usuário', error);
        setUserMessages([]);
      }
    };

       fetchUserMessages();
    
  }, [authenticated, user.sub, setUserMessages]);

  
  
  // destructuring useForm
  const { register, handleSubmit, formState: { errors } } = useForm({
    mode: 'onBlur',
    reValidateMode: 'onChange'
  });

  if (!authenticated) {
    navigate('/login');
    return null
  }

  const onSubmit = async (data) => {
    console.log(data);
    try {
      if(authenticated){
        const token = localStorage.getItem('token')
          const decodedToken = jwtDecode(token);
          client.defaults.headers.common['Authorization'] = `Bearer ${token}`;

          const postData = {
            ...data,
            // token: decodedToken.sub 
          };
    


      const response = await client.post('/mensagem', postData);
      console.log(response.data);
      // alert('Mensagem enviada!');
      navigate('/home');}
    } catch (error) {
      console.error('Erro ao enviar mensagem', error);
      setErrorMessage('Falha ao enviar mensagem');
      // alert('Falha ao enviar mensagem')
    }
  };

  return (
    <motion.section className='message' initial={{ width: 0 }} animate={{ width: "auto", transition: { duration: 0.5 } }} exit={{ x: window.innerWidth, transition: { duration: 0.5 } }}>
      {
        location.pathname === '/mensagem' ? (
          <>
            <p>Envie uma mensagem para a pessoa ou instituição que está cuidado do animal:</p>
            <form onSubmit={handleSubmit(onSubmit)}>
              <label htmlFor="name">Nome</label>
              <input id='name' type="text" {...register("name", { required: 'É necessário informar seu nome', maxLength: { value: 40, message: 'O número máximo de caracteres é 40' } })} placeholder='Insira seu nome completo' />
              {errors.name && <p className="error">{errors.name.message}</p>}

              <label htmlFor="phone">Telefone</label>
              <input type="tel" id='phone' {...register('phone', { required: 'Informe um número de telefone', pattern: /\(?[1-9]{2}\)?\s?9?[0-9]{8}/ })} placeholder='Insira seu telefone e/ou whatsapp' />
              {errors.phone && <p className="error">{errors.phone.message || 'Por favor, verifique o número digitado'}</p>}

              <label htmlFor="petName">Nome do animal</label>
              <input id='petName' type="text" {...register("petName", { required: 'É necessário informar o nome do animal', maxLength: { value: 25, message: 'O número máximo de caracteres é 25' } })} placeholder='Por qual animal você se interessou?' />
              {errors.petName && <p className="error">{errors.petName.message}</p>}

              <label htmlFor="msg">Mensagem</label>
              <textarea name="msg" id="msg" cols="30" rows="10" {...register('msg', { required: 'É necessário escrever uma mensagem', maxLength: { value: 500, message: 'O número máximo de caracteres é 500' } })} placeholder='Escreva sua mensagem.' spellCheck='false'></textarea>
              {errors.msg && <p className="error">{errors.msg.message}</p>}

              <Button type='submit' children='Enviar' />
              {errorMessage && <p className="error">{errorMessage}</p>}
            </form>

          {/* Display messages specific to the authenticated user */}
          <div className='enviadas'>
          <p>Mensagens enviadas</p>
            <ul className='enviadas'>
              {userMessages !== null && userMessages.map((message, index) => (
                <li key={index}>
                  <strong>{message.name}</strong>: {message.msg}
                </li>
              ))}
            </ul>
          </div>
        </>
        ): null}
      </motion.section>
  );
};

export default Message;

