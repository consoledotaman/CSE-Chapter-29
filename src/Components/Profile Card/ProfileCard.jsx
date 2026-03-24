import React, { useEffect } from "react";
import { useState, useRef } from "react";
import image from "../../assets/avatar.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import './Profile.css';
import DivOrigami from '../LogoAnimation/LogoAnimation.jsx'
import {
  faInstagram,
  faGithub,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import cross from "../../assets/close.svg";
 

function ProfileCard({year}) {
  const [data, setData] = useState([]);
  const [load, LoadState] = useState(false);
  let datageter = () => {
    let response = {};
    let ApiCaller = async () => {
      LoadState(false);
      response = await axios.get(
        "https://cse-chapter-29-server.vercel.app/api/"+year
      );
      setData(response.data);
      console.log(response.data);
      LoadState(true);
    };
    ApiCaller();
    console.log(data[0]);
    
  };
  let [name, setName] = useState("");
  let [id, setId] = useState("");
  let [location, setLocation] = useState("");
  let [description, setDescription] = useState("");
  let [Instagram, setInstagram] = useState("");
  let [GitHub, setGitHub] = useState("");
  let [LinkedIn, setLinkedIn] = useState("");
  let [Fid, setFid] = useState("");
  let [pfp,setPfp]=useState('');
  let [contentType,setContentType]=useState('');
  useEffect(datageter,[year]);
  const [pop, popState] = useState("hidden");
  let popup = (item) => {
    if (item != {}) {
      setName(item.name);
      setId(item.id.slice(4));
      setLocation(item.Location);
      setDescription(item.Description);
      setInstagram(item.Instagram);
      setLinkedIn(item.LinkedIn);
      setGitHub(item.GitHub);
      setFid(item.id);
      setPfp(item.image);
      setContentType(item.contentType);
    }
    popState("visible");
  };


  const modelRef= useRef();
  let popdown = (e) => {
    console.log(e.target);
    console.log(modelRef.current);
    if(e.target===modelRef.current)
    popState("hidden");
  };

  let popdownCross = (e) => {
    popState("hidden");
  };

  return (
    <div  className="flex flex-wrap gap-3 justify-center max-w-[100vw]">
      <div onClick={popdown} ref={modelRef} className={` popup flex flex-col lg:flex-row justify-center items-center inset-0 fixed z-10 backdrop-blur-sm  ${pop}` }>
      <div
        className={` bg-[#ede3b7] bg-opacity-[40%] onClickPopUp w-[90%] h-[85%] sm:w-[60%] lg:w-[60%] lg:h-[70%] backdrop-blur-[15px] border-4 border-opacity-50 rounded-xl border-[#004040]  flex flex-col lg:flex-row items-center popup-content `}
      >
        <div className="flex flex-col justify-center m-3  lg:w-[40%] lg:h-[95%]  my-8 popup-content">
          <div className="flex justify-between flex-col items-center h-[80%] w-[100%]">
            <div className=" lg:h-[100%] flex flex-col justify-center items-center">
              <div className="relative sm:w-[50%] w-[70%] lg:w-[80%] rounded-full">
                <img
                  className="size-[100%] z-20 aspect-square rounded-full border-[#002f26] border-8 object-cover"
                  src={pfp?(pfp):image}
                />
                <div className="h-[80px] w-[80px] z-20 rounded-full bg-[#002f26] absolute  right-0 bottom-0 flex justify-center items-center">
                  <p className="text-white text-3xl font-bold">{Number(id)}</p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-3xl text-center">{name}</p>
                <p className="text-1xl text-center">{location}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="h-[80%] hidden lg:static w-[0.3%] bg-[#002f26]"></div>
        <div className="lg:h-[95%] h-[100%] p-4 pt-0 lg:p-0 w-[95%]  lg:w-[59.7%] flex flex-col justify-center items-center">
          <div className=" lg:h-[80%] h-[95%] w-[95%] lg:w-[90%]  flex flex-col items-center justify-center">
            <div className= "flex flex-col ">
              <div >
                <img  onClick={popdownCross} src={cross} alt="Example" width="40" height="30" className="cross "/>
              </div>
              <p className="text-3xl text-center font-bold justify-center about">About Me</p>
            </div>
            <div className="flex justify-center items-center h-[100%] lg:h-[85%] w-[95%] lg:w-[100%] ">
              <textarea className="font-semibold text-2xl h-[90%] lg:h-[80%] border-[15px] border-transparent w-[100%] bg-white bg-opacity-35 rounded-md resize-none placeholder-[#002f26da] " disabled placeholder={description}  />
               
            </div>
            <div className="flex w-[80%] justify-around">
                {Instagram?<a href={Instagram}><FontAwesomeIcon className="size-7  ease-in-out hover:scale-[1.3] transform" icon={faInstagram} /></a>:''}
                {GitHub?<a href={GitHub}><FontAwesomeIcon className="size-7  ease-in-out hover:scale-[1.3] transform " icon={faGithub} /></a>:''}
                {LinkedIn?<a href={LinkedIn}><FontAwesomeIcon className="size-7  ease-in-out hover:scale-[1.3] transform" icon={faLinkedin} /></a>:''}
                <a href={'https://mail.google.com/mail/?view=cm&to='+Fid+'@iiit-bh.ac.in'}><FontAwesomeIcon className="size-7  ease-in-out hover:scale-[1.3] transform" icon={faEnvelope} /></a>
            </div>
          </div>
        </div>
      </div>
      </div>
      {console.log(load)}
      {load ? (
        data.map((item) => (
          <div className="m-4 z-1">
            <div
              onClick={() => popup(item)}
              className="pcard   h-[400px] w-[275px] backdrop-blur-md border-4 rounded-xl border-[#004040] border-opacity-20 hover:border-opacity-60 flex justify-around  items-center flex-col shadow-md hover:shadow-xl brightness-95 hover:brightness-100 text-[#2c3232aa] hover:text-[#004040] hover:scale-[1.05] transform transition duration-500 ease-in-out"
            >
              <div className="mt-3 rounded-full h-[195px] w-[195px] flex items-center justify-center bg-[#004040ba] text-white text-5xl font-bold">
                {item.image ? (
                  <img
                    className="h-[195px] w-[195px] object-cover rounded-full"
                    src={item.image}
                    alt={item.name}
                  />
                ) : (
                  
                  <span>
                    {item.name
                      ?.split(" ")
                      .map((word) => word[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)}
                  </span>
                )}
              </div>
              <div className="flex items-center flex-col">
                <p className=" text-3xl text-center">{item.name}</p>
                <p className=" text-2xl">{item.id}</p>
              </div>
              <div className="flex w-[210px] justify-around">
                {/* <FontAwesomeIcon className="size-7" icon={faInstagram} /> */}
                {item.Instagram?<a href={item.Instagram}><FontAwesomeIcon className="size-7 hover:text-[#004040]  ease-in-out hover:scale-[1.1] transform" icon={faInstagram} title="Instagram" /></a>:''}
                {item.GitHub?<a href={item.GitHub}><FontAwesomeIcon className="size-7 hover:text-[#004040]  ease-in-out hover:scale-[1.1] transform " icon={faGithub} title="GitHub"/></a>:''}
                {item.LinkedIn?<a href={item.LinkedIn}> <FontAwesomeIcon className="size-7 hover:text-[#004040]  ease-in-out hover:scale-[1.1] transform" icon={faLinkedin} title="LinkedIn" /></a>:''}
                <a href={'https://mail.google.com/mail/?view=cm&to='+item.id+'@iiit-bh.ac.in'}>
                  <FontAwesomeIcon className="size-7 hover:text-[#004040]  ease-in-out hover:scale-[1.1] transform" icon={faEnvelope} title={"Mail "+item.id} />
                </a>
              </div>
            </div>
          </div>
        ))
      ) : (
        <DivOrigami/>
      )}
    </div>

     
  );
}

export default ProfileCard;
