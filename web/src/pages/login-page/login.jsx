import { useState, useContext, useRef, useEffect } from 'react';
import { GlobalContext } from '../../context/context';
import api from '../../axios';
import './login.css';

let LoginPage = () => {


    let { state, dispatch } = useContext(GlobalContext);

    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const [alertMessage, setAlertMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState("loading-msg-hide");
    const [loadingMessage, setLoadingMessage] = useState(null)
    let [errMsg, setErrMsg] = useState(null);

    useEffect(

        ()=>{


        }
        ,[alertMessage, errorMessage]

    );

    let loginHandler = async(e)=>{

        e.preventDefault();
        setLoadingMessage("Loading...")
        setErrorMessage(null)


        try{
         let axiosresponse = await api.post('/api/v1/login', {

            email: emailRef.current.value,
            password: passwordRef.current.value,
        });
        if(axiosresponse.status === 200){
        setLoadingMessage(null)

        }
        setAlertMessage(axiosresponse.data.message)

        console.log(axiosresponse)

        dispatch({
            type: 'USER_LOGIN',
            payload: axiosresponse.data.data

            
        })


        }catch(err){
            console.log("Error: ", e);
            setLoadingMessage(null)
            setErrorMessage(err?.response?.data?.message)


        }
    
    
    }

    return (
        <div className='maindiv'>
            <div className='login-form'>
                <h1>SMIT</h1>
                <form action="" onSubmit={loginHandler}>
                    {/* <label htmlFor="email">Email:</label> */}
                    <input type="email" id="email" ref={emailRef} placeholder="Enter your email" />

                    {/* <label htmlFor="password">Password:</label> */}
                    <input type="password" id="password" ref={passwordRef} placeholder="Enter your password" />

                    <button>Login</button>
                </form>
            </div>
        </div>
    )
}

export default LoginPage;
