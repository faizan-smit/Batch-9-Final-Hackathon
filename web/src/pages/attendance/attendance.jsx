import './attendance.css'

import { Link } from 'react-router-dom';
import Students from '../students/students';
import Attendance from '../attendance/attendance';
import ModalForm from '../../components/modal-form/modal-form';
import { useRef, useState, useEffect, useContext } from 'react';
import { GlobalContext } from '../../context/context';
import api from '../../axios';



let AdminPanel = ()=>{

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [selectedImage, setSelectedImage] = useState("");

    const userImgRef = useRef(null);
    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const nameRef = useRef(null);
    const idRef = useRef(null);
    const courseRef = useRef(null);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleSubmit = async(event) => {
        event.preventDefault();
        
        let email = emailRef.current.value;
        let password = passwordRef.current.value;
        let name = nameRef.current.value;
        let id = idRef.current.value;
        let course = courseRef.current.value;

        try{

            let formData = new FormData();
            formData.append("email", email)
            formData.append("password", password)
            formData.append("name", name)
            formData.append("id", id)
            formData.append("course", course)
            formData.append("image", userImgRef.current.files[0])

            let axiosResponse = await api.post('api/v1/createuser', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
              })
            console.log(axiosResponse.data.message)
            alert('Post Created Successfully');
            

        }
        catch(r){

            console.log(r)

        }
        closeModal();
    };

    /*    ////////////\\\\\\\\\\\\\\\\\\\\\\\\    */
    const [users, setUsers] = useState([]);

    useEffect(() => {
        let fetchPosts = async ()=> {
          try {
            const response = await api.get(`/api/v1/getStudents`);
            console.log(response.data);
            setUsers(response.data);
            console.log(users);
          } catch (error) {
            console.error(error);
            if (error.response && error.response.status === 401) {
              console.log(error.response.status);
            }
          }
        }
    
        fetchPosts();
      }, []);


      
      let { state, dispatch } = useContext(GlobalContext);

      let logoutHandler = async ()=>{
    
    
        let axiosResponse = await api.post('/api/v1/logout');
        if(axiosResponse){dispatch({
            type: 'USER_LOGOUT',
        })
        }
    }
    

    return(

        <>
        
        <div className='admin-main-div'>

            <div className='navbar'>

            <div>
                <div>Logo</div>
                <div><Link to={'/'}>Students</Link></div>
                <div><Link to={'/attendance'}>Attendance</Link></div>
                </div>

                <div>
                <Link onClick={logoutHandler}>Logout</Link>
                </div>

            </div>

            <div>

                <div className='top-part'>
                <div>Students</div>
                <div className='for-modal-div'>

                <div>
            <button onClick={openModal}>Open Form</button>

            <ModalForm isOpen={isModalOpen} onClose={closeModal}>
                <span className="close" onClick={closeModal}>&times;</span>
                <form className='student-data-form' onSubmit={handleSubmit}>

                <div className="right">

                {selectedImage && <img className='selectedImage' height={50} width={50} src={selectedImage} alt="selected image" />}

                </div>

                <label className="fileLabel" htmlFor="userImg">Choose
                    <input ref={userImgRef} id="userImg" type="file" name="image"
                        accept="image/*" onChange={(e) => {
                        const base64Url = URL.createObjectURL(e.target.files[0]);
                        setSelectedImage(base64Url)
                    }} />
                </label>
                    {/* Your form fields go here */}
                    {/* <div> */}
                    {/* <label>Email:</label> */}
                    <input ref={emailRef} placeholder='Email' type="email" required />
                    {/* </div> */}
                    {/* <div> */}
                    {/* <label>Password:</label> */}
                    <input ref={passwordRef} type="password" placeholder='Password' required />
                    <input ref={nameRef} placeholder='Name' type="text" required />
                    {/* </div> */}
                    {/* <div> */}
                    {/* <label>ID:</label> */}
                    <input ref={idRef} type="text" placeholder='ID' required />
                    {/* </div> */}
                    {/* <div> */}
                    {/* <label>Course:</label> */}
                    <input ref={courseRef} placeholder='Course' type="text" required />
                    {/* </div> */}
                    <button type="submit">Add Student</button>
                   
                </form>
            </ModalForm>
        </div>
                   
                </div>
                </div>

                
            <div className='table-head'> 
                
                <div> id </div>
                <div> Profile Img </div>
                <div> Name </div>
                <div> Checked in time </div>
                <div> checked out time </div>
    
            </div>

            </div>

        </div>

        </>


    )

}

export default AdminPanel


