import './user.css'
import { GlobalContext } from '../../context/context'
import { useContext, useRef } from 'react'
import api from '../../axios'



let User = ()=>{

    let { state, dispatch } = useContext(GlobalContext);
    let userImgRef = useRef(null);

    let checkInHandler = async ()=>{

       try{

        let formData = new FormData();

        formData.append("image", userImgRef.current.files[0])

        let axiosResponse = await api.post(`api/v1/checkin/${state.user.email}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          })
        console.log(axiosResponse.data.message)
        alert('checked in');

       }catch(e){

        console.log(e)

       }


    }

    
    let logoutHandler = async ()=>{


        let axiosResponse = await api.post('/api/v1/logout');
        if(axiosResponse){dispatch({
            type: 'USER_LOGOUT',
        })
        }
    }

    console.log(state)

    return(

        <div className='usermaindiv'>
        
            <div className='thehead'>

                <h3>Hello {state.user.name}!</h3>

                <img className='theuserimage' src={state.user.img} alt="" />

            </div>
        
        <div className='thealldata'>

        <span>Id</span>
        <span><h5>{state.user.id}</h5></span>

        <span>Course</span>
        <span><h5>{state.user.course}</h5></span>

        <span>Check in time</span>
        <span></span>

        <span>Check out time</span>
        <span></span>

        <input ref={userImgRef} id="userImg" type="file" name="image" accept="image/*" />

        <button className='usercheckin' onClick={checkInHandler}>Check in</button>
        <button className='usercheckout' onClick={logoutHandler}>Logout</button>


        </div>
        
        </div>

        

    )

}

export default User