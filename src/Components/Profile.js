
// styles
import Button from './Button';

// dependencies
import { useLocation, useNavigate, useParams} from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from "react-hook-form";

// assets
import loggedUser from '../assets/logged-user.png';

import { useContext } from 'react';
import { AuthContext } from '../contexts/auth';
import { useState } from 'react';
import { useEffect } from 'react';


import client from '../axios.config'


// const baseURL = 'http://localhost:3000/adotante'

const Profile = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { authenticated, user } = useContext(AuthContext)
    
    const [profileImage, setProfileImage] = useState(null)
    const [profileData, setProfileData] = useState({perfil: {nome: '', cidade:'' , sobre:'', telefone: '' }}); 


    const { register, handleSubmit, formState: { errors } } = useForm({
        mode: 'onBlur',
        reValidateMode: 'onChange'
    });

    const [errorMessage, setErrorMessage] = useState('')

    useEffect(() => {
        const fetchProfileData = async () => {
          try {
            if(authenticated){
                // console.log(user.sub);
                // Faz uma solicitação GET para obter as informações do perfil do servidor
                const response = await client.get(`/adotante/perfil/${user.sub}`);
                setProfileData(prevData => ({ ...prevData, ...response.data }));
                // console.log(response.data);
            }
            // setProfileImage(response.data.fotoPerfil);
          } catch (error) {
            console.error('Erro ao obter informações do perfil', error);
            setErrorMessage("Erro ao obter informações do perfil");
            // alert('Problemas no Login')

            // Lida com o erro de acordo com a lógica do seu aplicativo
          }
        };
    
         fetchProfileData();
         
      }, [authenticated, setProfileData, user.sub]);

    const onSubmit = async (data) => {
        try {
            const response = await client.patch(`/adotante/perfil/${user.sub}`, data);
            // setProfileImage(response.data.fotoPerfil)
            console.log(response.data);
            // alert('Atualização concluída!');
            navigate('/home')
        } catch (error) {
            console.error('Erro ao atualizar perfil', error);
            errorMessage()
            // alert('Erro: perfil não atualizado');
        }
    }


        return (

            <motion.section className='message' initial={{ width: 0 }} animate={{ width: "auto", transition: { duration: 0.5 } }} exit={{ x: window.innerWidth, transition: { duration: 0.5 } }}>
                {
                    location.pathname === '/perfil' ? (
                        <>

                            <p>Esse é o perfil que aparece para responsáveis ou ONGs que recebem sua mensagem.</p>
                            <form onSubmit={handleSubmit(onSubmit)}>

                                <legend>Perfil</legend>
                                <label htmlFor='user-pic'>Foto</label>
                                <input type="image" id='fotoPerfil' src={loggedUser} alt="Usuário logado"/>
                                {/* <a href="#">Clique na foto para editar</a> */}

                              
                                <label htmlFor="name">Nome</label>
                                <input id='nome' type="text" {...register("nome", { required: 'É necessário informar seu nome', maxLength: { value: 40, message: 'O número máximo de caracteres é 40' } })} 
                                placeholder='Insira seu nome completo' value={profileData.perfil.nome} />
                                
                                {errors.nome && <p className="error">{errors.nome.message}</p>}

                                <label htmlFor="telefone">Telefone</label>
                                <input type="tel" id='telefone' {...register('telefone', { required: 'Informe um número de telefone', pattern: /\(?[1-9]{2}\)?\s?9?[0-9]{8}/ })} placeholder='Insira seu telefone e/ou whatsapp XX XXXXXXXXX' />
                                {errors.telefone && <p className="error">{errors.telefone.message || 'Por favor, verifique o número digitado'}</p>}

                                <label htmlFor="city">Cidade</label>
                                <input type="text" id='cidade' {...register('cidade', { required: 'Informe a cidade em que você mora' })} placeholder='Informe a cidade em que você mora' />

                                <label htmlFor="sobre">Sobre</label>
                                <textarea
                                spellCheck="false"
                                name="sobre"
                                id="sobre"
                                cols="30"
                                rows="8"
                                placeholder="Escreva sua mensagem."
                                {...register('sobre', { required: 'Informe algo sobre você' })}
                                ></textarea>

                                {errors.sobre && <p className="error">{errors.sobre.message}</p>}
                            
                                <Button type='submit' children='Salvar' /> {errorMessage && <p className="error">{errorMessage}</p>}
                                
                            </form>
                        </>
                    ) : null}
                    
            </motion.section>
        );
    };

export default Profile;