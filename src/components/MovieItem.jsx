import React, { useState } from 'react';
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { arrayUnion, doc, updateDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { UserAuth } from '../context/AuthContext';
import endpoints, { createImageUrl } from '../services/movieServices';

const MovieItem = ({ movie }) => {
  const [like, setLike] = useState(false);
  const { user } = UserAuth();
  const { title, backdrop_path, poster_path } = movie;

  const markfavShow = async () => {
    const userId = user?.uid;

    if (userId) {
      const userDoc = doc(db, 'users', userId);
      setLike(!like);
      try {
        await updateDoc(userDoc, {
          favShows: arrayUnion({ ...movie }),
        });
      } catch (error) {
        console.error("Error updating document: ", error);
      }
    } else {
      alert('Login to Save the Movie!!');
    }
  };

  return (
    <div className="relative w-[160px] sm:w-[200px] md:w-[240px] lg:w-[280px] inline-block rounded-lg overflow-hidden cursor-pointer m-2">
      <img
        className="w-full h-40 block object-cover object-top"
        src={createImageUrl(backdrop_path ?? poster_path, "w500")}
        alt={title}
      />
      <div className="absolute top-0 left-0 w-full h-40 bg-black/80 opacity-0 hover:opacity-100">
        <p className="whitespace-normal text-xl md:text-xl flex justify-center items-center h-full font-nsans-bold">
          {movie.title}
        </p>
        <p onClick={markfavShow} className="cursor-pointer">
        {like ? (
            <FaHeart 
            size={20} 
            className="absolute top-2 left-2 text-gray-300" 
            /> 
          ):(
             <FaRegHeart 
             size={20} 
             className="absolute top-2 left-2 text-gray-300" 
             />)}
        </p>
      </div>
    </div>
  );
};

export default MovieItem;
