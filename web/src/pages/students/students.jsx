import './students.css'
import Modal from '../../components/modal-form-edit/modal-form-edit';
import { useState, useRef } from 'react';
import api from '../../axios';


let Students = (props)=>{

    let allStudents = props.allStudents;
    const [selectedImage, setSelectedImage] = useState("");

    
    const userImgEditRef = useRef(null);
    const emailEditRef = useRef(null);
    const passwordEditRef = useRef(null);
    const nameEditRef = useRef(null);
    const idEditRef = useRef(null);
    const courseEditRef = useRef(null);

    const [editEmail, setEditEmail] = useState(allStudents.email);
    const [editName, setEditName] = useState(allStudents.name);
    const [editCourse, setEditCourse] = useState(allStudents.course);
    const [editId, setEditId] = useState(allStudents.studentId);
    const [passwordEdit, setPasswordEdit] = useState(allStudents.password);


    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleEditSubmit = async(event) => {
        event.preventDefault();
        

        let editPassword = passwordEditRef.current.value;
        let editName = nameEditRef.current.value;
        let editId = idEditRef.current.value;
        let editCourse = courseEditRef.current.value;

        try{

            let formData = new FormData();
            formData.append("email", editEmail)
            formData.append("password", editPassword)
            formData.append("name", editName)
            formData.append("id", editId)
            formData.append("course", editCourse)
            formData.append("image", userImgEditRef.current.files[0])

            let axiosResponse = await api.post(`api/v1/updateuser/`, formData, {
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


    const [passwordVisibility, setPasswordVisibility] = useState(false);
    const togglePasswordVisibility = (index) => {
        setPasswordVisibility((prevVisibility) => {
          return {
            ...prevVisibility,
            [index]: !prevVisibility[index],
          };
        });
      };

    return(

        <>
        <div className='table-head'> 
                
            <div> id </div>
            <div> Profile Img </div>
            <div> Name </div>
            <div> Course </div>
            <div> Password </div>

        </div>

        {allStudents.map((student,index)=>{

        return(

        <div key={index} className='student-data'> 
                
            <div className='sections'> {student.studentId} </div>
            <div className='sections'> <img className='user-image' src={student.img} width={40} height={40} alt="" /> </div>
            <div className='sections'> {student.name} </div>
            <div className='sections'> {student.course} </div>
            <div className='sections'> <input className='show-password' readOnly  type={passwordVisibility[index] ? 'text' : 'password'} value={student.password} name="" id="" /> 
            &nbsp;&nbsp;&nbsp;&nbsp;
            <button onClick={openModal}>Edit</button>

            <Modal isOpen={isModalOpen} onClose={closeModal}>
                <span className="close" onClick={closeModal}>&times;</span>
                <form className='student-data-form' onSubmit={handleEditSubmit}>

                <div className="right">

                {selectedImage && <img className='selectedImage' height={50} width={50} src={selectedImage} alt="selected image" />}

                </div>

                <label className="fileLabel" htmlFor="userImg">Choose
                    <input ref={userImgEditRef} id="userImg" type="file" name="image"
                        accept="image/*" onChange={(e) => {
                        const base64Url = URL.createObjectURL(e.target.files[0]);
                        setSelectedImage(base64Url)
                    }} />
                </label>
                    {/* Your form fields go here */}
                    {/* <div> */}
                    {/* <label>Email:</label> */}
                    <input value={editEmail} onChange={(e)=>setEditEmail(e.target.value)} placeholder={allStudents.email} type="email" required/>
                    {/* </div> */}
                    {/* <div> */}
                    {/* <label>Password:</label> */}
                    <input ref={passwordEditRef} type="password" placeholder='Password'  />
                    <input value={setEditName} onChange={(e)=>setEditName(e.target.value)} placeholder='Name' type="text"  />
                    {/* </div> */}
                    {/* <div> */}
                    {/* <label>ID:</label> */}
                    <input ref={idEditRef} type="text" placeholder='ID'  />
                    {/* </div> */}
                    {/* <div> */}
                    {/* <label>Course:</label> */}
                    <input ref={courseEditRef} placeholder='Course' type="text"  />
                    {/* </div> */}
                    <button type="submit">Edit Student</button>
                   
                </form>
            </Modal>
            <button onClick={() => togglePasswordVisibility(index)}>Reveal</button>
            </div>

        </div>

    )

    })}
        

        </>

    )

}

export default Students