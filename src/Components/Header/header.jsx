import React from "react";
import { useEffect, useState, useRef } from "react";
import logo from "../../assets/logo/logocse.svg";
import { NavLink } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import "./header.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import Example from "./DropDown";
function header() {
  const { user, loginWithRedirect, isAuthenticated, logout } = useAuth0();

  console.log(user);
    let newAccount = async () => {
    let year = "20" + (Number(user.email.slice(2, 4)) + 4);
    console.log(year);
    let id = user.email.slice(0, 7).toUpperCase();
    const check = await axios.get(
      "https://cse-chapter-29-server.vercel.app/api/" + year + "/id?id=" + id
    );
    if (check.data.length == 0) {
      try {
        await axios.post(
          "https://cse-chapter-29-server.vercel.app/api/" +
            year +
            "/add?name=" +
            user.name +
            "&id=" +
            id
        );
      } catch (err) {
        console.error(err.message);
      }
    }
  };
  useEffect(()=>{if(isAuthenticated) {
    const email = user.email;
    //Branch Change IDs
    //27 Batch- "b323027","b523055","b423024","b223048","b523068"
    //26 Batch- "b222032","b322006","b322020","b322037","b422001","b522034","b222010","b322029","b322035","b422019"
    //25 Batch- "b221021","b221029","b321031","b421037","b421054","b521002"
    const BranchChange=["b323027","b523055","b423024","b223048","b523068","b222032","b322006","b322020","b322037","b422001","b522034","b222010","b322029","b322035","b422019","b224039","b224017","b324020","b424029","b524008"]
    if (email.slice(0, 2) != "b1"&&!BranchChange.includes(email.slice(0,7)) ) {
      alert("Email Invailid");
      logout();
    } else {
      newAccount();
    }
  
  }},[isAuthenticated])
  let hamRef = useRef();
  const [hamburger, setHamburger] = useState("invisible");
  let EnableBar = () => {
    if (hamburger == "invisible") setHamburger("visible");
    else setHamburger("invisible");
  };
  let DisableBar = () => {
    console.log(hamburger);
    if (hamburger == "visible") setHamburger("invisible");
  };
return (
  <div className="sticky top-0 z-50">
    <nav >
      <div className="w-screen flex justify-between items-center px-6 py-4">
        
        <div>
          <NavLink to="/">
            <img className="w-28 h-20 object-contain" src={logo} alt="Logo" />
          </NavLink>
        </div>
        
        
        <div className="hidden sm:flex items-center justify-center rounded-full p-5 bg-[#f5f5dc6e] backdrop-blur-sm">
          <ul className="flex items-center space-x-8 font-semibold text-gray-800">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `px-3 py-2 transition-colors duration-200 ${
                    isActive 
                      ? "text-black font-bold underline underline-offset-4" 
                      : "text-gray-600 hover:text-black"
                  }`
                }
              >
                HOME
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/Gallery"
                className={({ isActive }) =>
                  `px-3 py-2 transition-colors duration-200 ${
                    isActive 
                      ? "text-black font-bold underline underline-offset-4" 
                      : "text-gray-600 hover:text-black"
                  }`
                }
              >
                GALLERY
              </NavLink>
            </li>
            <li>
              <Example DropUp={DisableBar} />
            </li>
            <li>
              <NavLink
                to="/About"
                className={({ isActive }) =>
                  `px-3 py-2 transition-colors duration-200 ${
                    isActive 
                      ? "text-black font-bold underline underline-offset-4" 
                      : "text-gray-600 hover:text-black"
                  }`
                }
              >
                ABOUT
              </NavLink>
            </li>
          </ul>
        </div>

        {/* Right Side - Login/Profile Button & Mobile Menu */}
        <div className="flex items-center">
          {/* Login/Profile Button - Desktop */}
          <div className="hidden sm:block">
            {isAuthenticated ? (
              <NavLink
                to="/Profile"
                className="bg-[#6B8E23] hover:bg-[#556B1F] text-white font-semibold px-6 py-2.5 rounded-full transition-colors duration-200"
              >
                PROFILE
              </NavLink>
            ) : (
              <button
                className="bg-[#6B8E23] hover:bg-[#556B1F] text-white font-semibold px-6 py-2.5 rounded-full transition-colors duration-200"
                onClick={(e) => loginWithRedirect()}
              >
                LOGIN
              </button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <FontAwesomeIcon
            icon={faBars}
            className="text-gray-800 h-8 ml-4 sm:hidden hover:cursor-pointer hover:scale-110 transition duration-300 ease-in-out"
            onClick={EnableBar}
          />
        </div>
      </div>

      {/* Mobile Navigation */}
      <ul
        className={`sm:hidden ${hamburger} bg-white shadow-lg absolute left-0 right-0 top-[100px] mx-4 rounded-2xl p-8 z-50 flex flex-col space-y-6 text-center font-semibold text-xl transform transition-all duration-300 ease-in-out`}
      >
        <li onClick={DisableBar}>
          <NavLink
            to="/"
            className={({ isActive }) =>
              `block py-2 ${
                isActive 
                  ? "text-black font-bold underline underline-offset-4" 
                  : "text-gray-600"
              }`
            }
          >
            HOME
          </NavLink>
        </li>
        <li onClick={DisableBar}>
          <NavLink
            to="/Gallery"
            className={({ isActive }) =>
              `block py-2 ${
                isActive 
                  ? "text-black font-bold underline underline-offset-4" 
                  : "text-gray-600"
              }`
            }
          >
            GALLERY
          </NavLink>
        </li>
        <li onClick={DisableBar}>
          <NavLink
            to="/Batches:2026"
            className={({ isActive }) =>
              `block py-2 ${
                isActive 
                  ? "text-black font-bold underline underline-offset-4" 
                  : "text-gray-600"
              }`
            }
          >
            BATCH 26
          </NavLink>
        </li>
        <li onClick={DisableBar}>
          <NavLink
            to="/Batches:2027"
            className={({ isActive }) =>
              `block py-2 ${
                isActive 
                  ? "text-black font-bold underline underline-offset-4" 
                  : "text-gray-600"
              }`
            }
          >
            BATCH 27
          </NavLink>
        </li>
        <li onClick={DisableBar}>
          <NavLink
            to="/Batches:2028"
            className={({ isActive }) =>
              `block py-2 ${
                isActive 
                  ? "text-black font-bold underline underline-offset-4" 
                  : "text-gray-600"
              }`
            }
          >
            BATCH 28
          </NavLink>
        </li>
        <li onClick={DisableBar}>
          <NavLink
            to="/Batches:2029"
            className={({ isActive }) =>
              `block py-2 ${
                isActive 
                  ? "text-black font-bold underline underline-offset-4" 
                  : "text-gray-600"
              }`
            }
          >
            BATCH 29
          </NavLink>
        </li>
        <li onClick={DisableBar}>
          <NavLink
            to="/About"
            className={({ isActive }) =>
              `block py-2 ${
                isActive 
                  ? "text-black font-bold underline underline-offset-4" 
                  : "text-gray-600"
              }`
            }
          >
            ABOUT
          </NavLink>
        </li>
        {isAuthenticated ? (
          <li onClick={DisableBar}>
            <NavLink
              to="/Profile"
              className="block bg-[#6B8E23] hover:bg-[#556B1F] text-white font-semibold px-6 py-3 rounded-full mx-auto w-fit transition-colors duration-200"
            >
              PROFILE
            </NavLink>
          </li>
        ) : (
          <li>
            <button
              className="bg-[#6B8E23] hover:bg-[#556B1F] text-white font-semibold px-6 py-3 rounded-full mx-auto transition-colors duration-200"
              onClick={(e) => loginWithRedirect()}
            >
              LOGIN
            </button>
          </li>
        )}
      </ul>
    </nav>
  </div>
);
}

export default header;