import { useEffect, useState } from "react";
import Layout from "../components/Layout"
import { Song, useSongData } from "../context/SongContext";
import { useUserData } from "../context/UserContext"
import SongCard from "../components/SongCard";
import { FaPlay } from "react-icons/fa";
import { FaBookmark } from "react-icons/fa6";
import Loading from "../components/Loading";

const PlayList = () => {
       const {songs,setIsPlaying,setSelectedSong,loading,IsPlaying,selectedSong}=useSongData();
       const [myplaylist,setMyPlaylist]=useState<Song[]>([])
       const {user,AddToPlaylist}=useUserData()
       

       useEffect(() => {
        if (songs && user?.playlist) {
            console.log("User playlist:", user.playlist);
            console.log("All songs:", songs);
            const filteredSongs = songs.filter((song) =>
                user.playlist.includes(song.id.toString())
            );
            console.log("Filtered songs:", filteredSongs);
            setMyPlaylist(filteredSongs);
        } else if (!user) {
            console.warn("User is null or not loaded yet.");
        } else if (!songs) {
            console.warn("Songs are not loaded yet.");
        }
    }, [songs, user]);
       
       

  // Moved the console.log statements inside the component to avoid errors
  console.log("Filtered Playlist Songs:", myplaylist);
  if (myplaylist.length === 0) {
    console.warn("No songs found in the playlist.");
  }

  return (
    <div>
    <Layout>
{myplaylist&&
loading ? (
  <Loading />
) 
:
    <>
    <div className="mt-10 flex gap-8 flex-col md:flex-row md:items-center">
         
            <img
                src={"/download.png"}
                className="w-48 rounded"
                alt=""
            />
        
        <div className="flex flex-col">
            <p>PlayList</p>
            <h2 className="text-3xl font-bold md:text-5xl">
                {user?.name} PlayList
            </h2>
            <h4>Your favourite Songs</h4>
            <p className="mt-1">
                <img
                    src="/logo.png"
                    className="inline-block w-6"
                    alt="Logo"
                />
            </p>
        </div>
    </div>

    <div className="mt-5">
        <h3 className="text-2xl font-bold">Songs</h3>
        <ul className="mt-3">
            { myplaylist&&myplaylist.map((song) => (
                <li
                    key={song.id}
                    className="flex items-center gap-4 p-2 border-b border-gray-300"
                >
                    <div className="flex-1">
                        <h4 className="text-lg font-semibold">
                            {song.title}
                        </h4>
                        <p className="text-sm text-gray-500">
                            {song.description}
                        </p>
                    </div>
                     <p className="flex justify-center items-center gap-5">
                        <button className="text-[15px] text-center" onClick={()=>{
                            AddToPlaylist(song.id)
                        }}>
                            <FaBookmark/>
                        </button>

                        <button className="text-[15px] text-center" onClick={()=>{
                            setSelectedSong(song.id)
                            setIsPlaying(true);
                        }}>
                            <FaPlay/>
                        </button>
                     </p>

                </li>
            ))}
        </ul>
    </div>
</>
 
}
</Layout>
</div>
  )
}

export default PlayList