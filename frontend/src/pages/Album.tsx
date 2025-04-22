import { useParams } from "react-router-dom";
import Layout from "../components/Layout"
import { useSongData } from "../context/SongContext"
import { useEffect } from "react";
import Loading from "../components/Loading";
import { FaPlay, FaPause, FaBookmark } from "react-icons/fa";
import { useUserData } from "../context/UserContext";

const Album = () => {
    const {fetchAlbumSongs,albumSong,albumData,setIsPlaying,setSelectedSong,loading,IsPlaying,selectedSong}=useSongData();
    const {isAuth,AddToPlaylist}=useUserData()
    const params=useParams<{id:string}>()
    console.log(albumData)
    useEffect(() => {
        if (params.id) {
            console.log("Fetching album songs for album ID:", params.id);
            fetchAlbumSongs(params.id).then(() => {
                console.log("Fetched album data:", albumData);
                console.log("Fetched album songs:", albumSong);
            });
        }
    }, [params.id, fetchAlbumSongs]);

    console.log("Current albumData:", albumData);
    console.log("Current albumSong:", albumSong);

    return (
        <div>
                  <Layout>
            {loading ? (
                <Loading />
            ) : albumData ? (
                <>
                    <div className="mt-10 flex gap-8 flex-col md:flex-row md:items-center">
                        {albumData.thumbnail && (
                            <img
                                src={albumData.thumbnail}
                                className="w-48 rounded"
                                alt="Album Thumbnail"
                            />
                        )}
                        <div className="flex flex-col">
                            <p>PlayList</p>
                            <h2 className="text-3xl font-bold md:text-5xl">
                                {albumData.title} PlayList
                            </h2>
                            <h4>{albumData.description}</h4>
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
                            {albumSong.map((song) => (
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
                                        {(isAuth||localStorage.getItem("token"))&& <button className="text-[15px] text-center" onClick={()=>{
                                            AddToPlaylist(song.id)
                                        }}>
                                            <FaBookmark/>
                                        </button>}

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
            ) : (
                <p>No album data available.</p>
            )}
        </Layout>
        </div>
  
    );
}

export default Album