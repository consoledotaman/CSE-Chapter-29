import React from 'react'
import { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import DefaultPfp from '../../assets/default.jpg'
import DivOrigami from '../LogoAnimation/LogoAnimation.jsx'
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faCircleCheck, faMapMarkerAlt, faCamera, } from '@fortawesome/free-solid-svg-icons';
import {
  faInstagram,
  faGithub,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";
import imageCompression from 'browser-image-compression'

function Login({refresh}) {
  const [img,setImg]=useState();
  const [loading,setLoad]=useState(true); // Start with loading as true
  const [name, setName] = useState('');
  const [insta,SetInsta]=useState('');
  const [Description,setDescription]=useState('');
  const [LinkedIn,SetLinkedIn]=useState('');
  const [GitHub,SetGitHub]=useState('');
  const [Location,SetLocation]=useState('');
  const [data, setData] = useState([]);
  const[submit,setSubmit]=useState('invisible');
  const { user, isAuthenticated:realAuth } = useAuth0();
  const isAuthenticated = import.meta.env.MODE === "development" ? true : realAuth;
  const [imgFile,setImgFile]=useState();
  const [contentType,setContentType]=useState();
  let year;

  const imagebase64=(file)=>{
    const reader=new FileReader();
    reader.readAsDataURL(file);
    const data=new Promise((resolve,reject)=>{
      reader.onload=()=>resolve(reader.result);
      reader.onerror=(err)=>reject(err);
    })
    return data;
  }

  const imagesize=(file)=>{
    const reader=new FileReader();
    reader.readAsDataURL(file);
    const promise=new Promise((resolve,reject)=>{
      reader.onload=function(e){
        const image =new Image();
        image.src=e.target.result;
        image.onload=function(){
          const height=this.height;
          const width=this.width;
          resolve({width,height});
        };
        image.onerror=reject;
      }
    })
    return promise;
  }

  let ImageInput=async (e)=>{
    const file=e.target.files[0];
    const imageDimension=await imagesize(file);
    const option={
      maxSizeMB:2,
      maxWidthOrHeight:imageDimension.width>1300?1300:imageDimension.width,
      useWebWorker:true,
    };
    const compressedImg= await imageCompression(file,option);
    setImgFile(compressedImg);
    const image=await imagebase64(compressedImg);
    setImg(image);
  };

  useEffect(() => {
    const loadApi = async () => {
      if (!isAuthenticated || !user) {
        setLoad(false);
        return;
      }

      setLoad(true); 
      try {
        let id = user.email.slice(0, 7).toUpperCase();
        year = "20" + (Number(id.slice(2, 4)) + 4);

        const result = await axios.get(`https://cse-chapter-29-server.vercel.app/api/${year}/id?id=${id}`);
        const dt = result.data;
        
        if (dt && dt.length > 0) {
            setData(dt);
            const userData = dt[0];
            setName(userData.name || user.name || '');
            setImg(userData.image || null);
            SetInsta(userData.Instagram || '');
            SetGitHub(userData.GitHub || '');
            SetLinkedIn(userData.LinkedIn || '');
            setDescription(userData.Description || '');
            SetLocation(userData.Location || '');
        } else {
            setData([{ id: id }]); // Set mock data so the form ID works
            setName(user.name || '');
        }
      } catch (error) {
        console.error("Failed to load user data:", error);
        // Handle error state if needed
      } finally {
        setLoad(false); 
      }
    };
    
    loadApi();
  }, [refresh, isAuthenticated, user]);
  
  function timeout(delay) {
    return new Promise( res => setTimeout(res, delay) );
  }

  let submitChk=async ()=>{
    setSubmit('visible');
    await timeout(2500);
    setSubmit('invisible');
  }

  let SubmitCall=async (e)=>{
    e.preventDefault();
    if (!data || data.length === 0) return; // Prevent submission if no data

    year="20"+((Number)(data[0].id.slice(2,4))+4);
    const form=new FormData();
    
    // FIX 2: Ensure name is always submitted
    form.append("name", name); 
    
    if(imgFile){
        form.append("images",imgFile);
    }
    
    form.append("location",Location);
    form.append("instagram",insta);
    form.append("github",GitHub);
    form.append("description",Description);
    form.append("linkedin",LinkedIn);
    form.append("id",data[0].id);

    await axios.post(`https://cse-chapter-29-server.vercel.app/api/${year}/profile`,
      form,{
        headers:{
          'Content-Type':'multipart/form-data'
        }
      }
    );
    submitChk();
  }

  return (
    <div>
      {!loading ? (
        <div className='md:text-xl lg:text-2xl lg:mt-8'>
            { (data && data.length > 0) ? (
                <form onSubmit={SubmitCall}>
                    <div className='flex justify-center h-[100%] w-[100%] mx-auto lg:flex-row flex-col items-center lg:px-[10%]'>
                        <div className='sm:w-[40%] md:w-[50%] w-[80%] flex flex-col items-center'>
                            <div className='h-[100%] rounded-full relative'>
                                <img
                                    className='lg:w-[300px] aspect-square lg:h-[300px] border-8 border-[#002f26] md:w-[250px] md:h-[250px] w-[225px] h-[225px] rounded-full mx-auto hover:brightness-90 cursor-pointer object-cover'
                                    src={img || DefaultPfp}
                                />
                                <div className='bg-[#002f26] rounded-full h-[4.5rem] w-[4.5rem] absolute right-0 bottom-0'>
                                    <label htmlFor='upload' className='h-[4.5rem] w-[4.5rem] rounded-full flex items-center justify-center cursor-pointer'>
                                        <FontAwesomeIcon icon={faCamera} className='h-[1.75rem] w-[1.75rem] text-[#cffaf1] hover:text-[#fff] transition ease-in-out duration-150 transform' />
                                    </label>
                                    <input
                                    className='hidden'
                                    id='upload'
                                    type='file' 
                                    onChange={ImageInput}
                                    accept="image/*" 
                                    />
                                </div>
                            </div>

                            <input
                                className='w-[70%] mb-2 lg:mx-auto md:ml-20 mt-8 p-2 bg-transparent rounded-lg font-extrabold text-center text-[#004040] text-3xl uppercase outline-none transition-colors duration-200 focus:bg-[#004040]/10'
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Your Name"
                            />
                            <input className='w-[100%] bg-transparent p-2 rounded-lg font-extrabold text-center text-white' readOnly hidden type='text' name='id' placeholder="Id" value={data[0].id} />

                            <div className='w-[90%] flex justify-center'>
                                <FontAwesomeIcon icon={faMapMarkerAlt} className='inline mx-4 ml-1 my-2 size-9 text-[#004040]' />
                                <input
                                className='w-[75%] lg:w-[90%] mr-10 bg-[#004040] bg-opacity-20 backdrop-blur-sm p-2 pl-3 text-[#00404098] rounded-lg max-w-[86%] outline-none placeholder-[#6a8e2360] focus:outline-[#004040a0]'
                                type='text' name='location' value={Location} placeholder='Location'
                                onChange={(event) => SetLocation(event.target.value)}
                                />
                            </div>
                        </div>

                        <div className='sm:w-[50%] w-[80%] h-[70%]'>
                            <br />
                            <h1 className='font-extrabold mt-4 text-4xl text-center text-[#004040]'>About me</h1>
                            <textarea
                                className='w-[100%] bg-[#004040] h-[30%] bg-opacity-20 xl:max-w-3xl backdrop-blur-sm pt-3 mt-6 rounded-lg max-w-2xl text-[#00404098] placeholder-[#6a8e2360] outline-offset-0 focus:outline-[#004040] resize-none p-4' 
                                rows='4'
                                name='description' value={Description} placeholder='Description'
                                onChange={(event) => setDescription(event.target.value)}
                            />
                            <br /><br />
                            
                            <div className='w-[100%] flex mt-5 items-center'>
                                <FontAwesomeIcon className='inline mx-4 ml-1 size-10 text-[#004040]' icon={faInstagram} />
                                <input
                                className='w-[91.5%] bg-[#004040] bg-opacity-20 backdrop-blur-sm p-2 pl-3 rounded-lg text-[#00404098] outline-none placeholder-[#6a8e2360] focus:outline-[#004040a0]'
                                type='text' name='instagram' value={insta} placeholder='Instagram'
                                onChange={(event) => SetInsta(event.target.value)}
                                />
                            </div>

                            <div className='w-[100%] flex mt-5 items-center'>
                                <FontAwesomeIcon className='inline mx-4 ml-1 size-10 text-[#004040]' icon={faLinkedin} />
                                <input
                                className='w-[91.5%] bg-[#004040] bg-opacity-20 backdrop-blur-sm p-2 pl-3 text-[#00404098] rounded-lg outline-none placeholder-[#6a8e2360] focus:outline-[#004040a0]'
                                type='text' name='linkedin' value={LinkedIn} placeholder='LinkedIn'
                                onChange={(event) => SetLinkedIn(event.target.value)}
                                />
                            </div>

                            <div className='w-[100%] flex mt-5 items-center'>
                                <FontAwesomeIcon className='inline mx-4 ml-1 size-10 text-[#004040]' icon={faGithub} />
                                <input
                                className='w-[91.5%] bg-[#004040] bg-opacity-20 backdrop-blur-sm p-2 pl-3 text-[#00404098] rounded-lg outline-none placeholder-[#6a8e2360] focus:outline-[#004040a0]'
                                type='text' name='github' value={GitHub} placeholder='GitHub'
                                onChange={(event) => SetGitHub(event.target.value)}
                                />
                            </div>
                            <br /><br />
                        </div>
                    </div>
                    <div>
                        <button
                        className='md:ml-[45vw] ml-[35vw] px-8 py-2 lg:mt-6 rounded-lg bg-[#004040] hover:scale-105 shadow-lg hover:shadow-xl transition-all duration-300 font-extrabold md:text-2xl self-center text-white'
                        type="submit">
                        SUBMIT
                        </button>
                        <FontAwesomeIcon className={`ml-4 ${submit} text-[#004040]`} icon={faCircleCheck} />
                    </div>
                </form>
            ) : (
                <div className="text-center text-2xl text-gray-600 mt-20">Could not load user data.</div>
            )}
        <br />
        </div>
      ) : (
        <DivOrigami />
      )}
    </div>
  )
}

export default Login;