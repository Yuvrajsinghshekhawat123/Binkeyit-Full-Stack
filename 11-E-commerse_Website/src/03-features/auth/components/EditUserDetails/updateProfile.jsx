
import { useState } from "react";
import { FaPhoneAlt, FaUserAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";   // Material Design icon
import { FaCircleExclamation } from "react-icons/fa6";
 
import {  useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { ClipLoader } from "react-spinners";
import { useUpdateUserDetails } from "../../hook/useUpdateUserDetails";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../hook/01-useSlice";
import { RxCross2 } from "react-icons/rx";
import {  useQueryClient } from "@tanstack/react-query";


export function EditUserDetails({setIsShowUserUpdateComponent}){
    const userDetail=useSelector((state)=>state.userDetail)
    const [formdata, setformData] = useState({
            name: "",
            email: "",
            mobile:"",
        });

    const dispatch=useDispatch()
    const [error,setError]=useState("");
    const [processing, setProcessing] = useState(false);
    const {mutate:UpdateDetails}=useUpdateUserDetails();
    const queryClient = useQueryClient();


        const navigate=useNavigate();

    function handleChange(e){
        const {name,value}=e.target;
        setformData((prev)=>{
            return {...prev,[name]: value.trimStart()} // trims leading spaces while typing}
        })
        
        
        setError("");  // Clear error on input change
    }



    function handleSubmit(e){
        e.preventDefault();

        setProcessing(true);
        UpdateDetails(formdata,{
            onSuccess:async (data)=>{
                toast.success(data.message);
                dispatch(setUser({name:userDetail.name, email: formdata.email })); // here the name can be empty so write the userDetails.name

                 setformData({
                        name: "",
                        email: "",
                        mobile:"",
                    });

                    
                await queryClient.refetchQueries({ 
                    queryKey: ["userDetails"],
                    exact: true 
                });


                 await new Promise((resolve) => setTimeout(resolve, 100));

                 setIsShowUserUpdateComponent(false)

                if(formdata.email.length !==0) {
                    navigate('/verify-email',{replace:true});
                }


            },
            onError:(err)=>{

               setError(err.response?.data?.message || "Something went wrong"); // asios error
        },
        onSettled: () => {
            setProcessing(false); // Stop processing after request acompletes
        }
        })


    }







    return (
    <>
                <div className="fixed z-50 top-1/2 left-1/2 w-[90%] h-[92%] md:w-[60%] md:h-[90%]  lg:w-[35%] lg:h-[95%] xl:h-[75%] transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-xl">

                    <div className="flex justify-between w-full text-sm lg:text-2xl  font-bold text-gray-700 border-b border-gray-300 py-6 mb-8">
                                   <h1>Update Personal Information</h1>
                                   <button onClick={()=>setIsShowUserUpdateComponent(false)}><RxCross2  className="inline text-black hover:text-gray-400 cursor-pointer text-xl lg:text-2xl " title="Edit Avatar" /></button>
                    </div>

                    <form  className="flex flex-col gap-6 font-medium px-2 sm:px-6" onSubmit={handleSubmit}>
                    <div className="relative w-full text-sm lg:text-xl ">
                        <label htmlFor='name'>Name :</label>
                        <input
                            type='text'
                            id='name'
                
                            className='bg-blue-50 w-full p-2 border-2 border-gray-300 rounded outline-none focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-blue-600 transform duration-200 ease-in-out'
                            name='name'
                            value={formdata.name}
                            onChange={handleChange}
                            placeholder='Enter your name'
                        />
                        <FaUserAlt className="inline absolute right-3 top-1/2 transform translate-y-1/4 text-gray-400"/>
                        
                    </div>

                     <div className="relative w-full text-sm lg:text-xl ">
                        <label htmlFor='name'>Mobile :</label>
                        <input
                            type='text'
                            id='mobile'
                
                            className='bg-blue-50 w-full p-2 border-2 border-gray-300 rounded outline-none focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-blue-600 transform duration-200 ease-in-out'
                            name='mobile'
                            value={formdata.mobile}
                            onChange={handleChange}
                            placeholder='Enter your mobile no.'
                        />
                        <FaPhoneAlt className="inline absolute right-3 top-1/2 transform translate-y-1/4 text-gray-400"/>
                        
                    </div>
                    <div className="relative w-full text-sm lg:text-xl ">
                        <label htmlFor='email'>Email :</label>
                        <input
                            type='text'
                            id='email'
                
                            className='bg-blue-50 w-full p-2 border-2 border-gray-300 rounded outline-none  focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-blue-600 transform duration-200 ease-in-out'
                            name='email'
                            value={formdata.email}
                            onChange={handleChange}
                            placeholder='Enter your email'
                        />
                        <MdEmail  className="inline absolute right-3 top-1/4 text-gray-400 text-xl"/>
                        

                        <div className="border-l-3 border-blue-600 bg-slate-200 text-gray-400 font-light my-2 p-2 rounded-lg">
                            <FaCircleExclamation className="inline text-blue-600"/> You will need to verify your email address to activate your account.
                        </div>
                    </div>

                     
                     

 

                    {/* show all errror in this box if is there */}
                    {
                        error.length !==0 && <div className="text-red-600 font-medium text-sm lg:text-xl ">{error}</div>
                    }
 
 
                    <div>
                        <button type="submit" className= "flex justify-center items-center gap-2 text-sm sm:text-sm md:text-md lg:text-lg bg-gray-600 hover:bg-gray-800  text-white w-full font-bold rounded-lg p-2 cursor-pointer">
                            {processing ?  <><ClipLoader className="" color="white" loading size={22}/>  <span>Updating...</span> </> : "Update"} 
                              
                        </button>
                    </div>
 
                     
                
                </form>
              </div>


    </>)
}