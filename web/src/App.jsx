import logo from './logo.svg';
import './App.css';
import LoginPage from './pages/login-page/login';
import AdminPanel from './pages/admin-panel/admin';
import Students from './pages/students/students';
import Attendance from './pages/attendance/attendance';
import User from './pages/user/user';
import { GlobalContext } from './context/context';
import { useContext, useEffect } from 'react';
import api from './axios';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';



function App() {

  let { state, dispatch } = useContext(GlobalContext);
  useEffect(()=>{
    let checkLoginStatus = async()=> {

      try{
  
        let axiosResponse = await api.post('/api/v1/authStatus');
        dispatch({
          type: "USER_LOGIN",
          payload: axiosResponse.data.data,
        })
        console.log(axiosResponse);
        
        console.log("User Logged In");
  
  
  
      }catch(e){
  
        dispatch({
          type: "USER_LOGOUT",
        })
        console.log("User not Logged In");
  
      }
  
    };
    checkLoginStatus();


    setTimeout(()=>{

      dispatch({
        type: "SPLASH_SCREEN",
      })


    }, 2000)

  },[]);



  return (
  
    <>
    


    {console.log(state)}

    {   (state?.isLogin === true && state.user.role === "admin")? (<>
        <Routes>
              <Route path='/' element={<AdminPanel />} />
              <Route path='/attendance' element={<Attendance />} />
              <Route path='*' element={<Navigate to='/' replace={true} />} />
          </Routes>
          </>)
          :(null)   }



    {   (state?.isLogin === true && state.user.role === "user")? (<>
            <Routes>
                  <Route path='/' element={<User />} />
                  <Route path='*' element={<Navigate to='/' replace={true} />} />
              </Routes>
              </>)
              :(null)   }



    {   (state?.isLogin === false)?
        (
          <>
            <Routes>
            
              <Route path='/' element={<LoginPage />} />

            </Routes>
          </>) 
          :(null)     }



 


    
{//Splash Screen
}

    {/* {state.splashScreen === true ? (<>
        <div className='splash-screen'>
        <div className='app-name'>Utophoria</div>
          
        <span className='whiteText'>Loading...
          </span>
        </div>
        
        </>) : null} */}




    
    </>

  );
}

export default App;
