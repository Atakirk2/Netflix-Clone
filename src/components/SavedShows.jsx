import React, { useState, useEffect } from "react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import { UserAuth } from "../context/AuthContext";
import { updateDoc, doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import {AiOutlineClose} from "react-icons/ai";

function SavedShows() {
  const [movies, setMovies] = useState([]);
  const { user } = UserAuth();
  const slideLeft = () => {
    const slider = document.getElementById("slider");
    slider.scrollLeft = slider.scrollLeft - 500;
  };
  const slideRight = () => {
    const slider = document.getElementById("slider");
    slider.scrollLeft = slider.scrollLeft + 500;
  };
  useEffect(() => {
    onSnapshot(doc(db, 'users', `${user?.email}`), (doc) => {
      setMovies(doc.data()?.savedShows);
    });
  }, [user?.email]);

  const movieRef = doc(db,'users',`${user?.email}`);
  const deleteShow = async (passedID)=>{
    try {
        const result = movies.filter(item=> item.id !== passedID);
        await updateDoc(movieRef,{
            savedShows:result,
        })

        
    } catch (error) {
     console.log(error); 
    }
  }

  return (
    <div>
      <h2 className="text-white font-bold md:text-xl p-4">My Shows</h2>
      <div className="relative flex items-center group">
        <MdChevronLeft
          onClick={slideLeft}
          className="bg-white left-0 rounded-full absolute opacity-50 hover:opacity-100 cursor-pointer z-10 hidden group-hover:block"
          size={40}
        />
        <div
          id={"slider"}
          className="w-full h-full overflow-x-scroll whitespace-nowrap scroll-smooth scrollbar-hide relative"
        >
          {movies.map((item, id) => (
            <div className="w-[160px] md:w-[240px] lg:w-[280px] inline-block cursor-pointer relative p-2 ">
              <img
                className="w-full h-auto block"
                src={`https://image.tmdb.org/t/p/w500/${item?.img}`}
                alt={item?.title}
              />
              <div className="absolute top-0 left-0 w-full h-full hover:opacity-100 hover:bg-black/80 opacity-0 text-white">
                <p className="whitespace-normal text-xs md:text-sm font-bold h-full flex justify-center items-center p-5">
                  {item?.title}
                </p>
                <p onClick={()=>deleteShow(item?.id)} className="text-gray-300 absolute top-4 right-4"><AiOutlineClose /></p>
              </div>
            </div>
          ))}
        </div>
        <MdChevronRight
          onClick={slideRight}
          className="bg-white right-0 rounded-full absolute opacity-50 hover:opacity-100 cursor-pointer z-10 hidden group-hover:block"
          size={40}
        />
      </div>
    </div>
  );
}

export default SavedShows;
