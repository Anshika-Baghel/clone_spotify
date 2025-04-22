import axios from 'axios';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';


// const server = "http://localhost:5002";
const server="https://lavish-kindness-production.up.railway.app"

export interface Song {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    audio: string;
    album: string;
}

export interface Album {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    audio?: string; // Added optional audio property
}

interface SongContextType {
    songs: Song[];
    song:   Song|null;
    albums: Album[]; // Added albums to the context
    IsPlaying: boolean;
    setIsPlaying: (value: boolean) => void;
    loading: boolean;
    selectedSong: string | null;
    setSelectedSong: (id: string | null) => void;
    fetchSingleSong: () => Promise<void>; 
    nextSong: () => void
    previousSong: () => void;
    albumSong:Song[];
    albumData:Album|null;
    fetchAlbumSongs:(id:string)=>Promise<void>
    fetchSongs:()=>Promise<void>
    fetchAlbums:()=>Promise<void>
}

const SongContext = createContext<SongContextType | undefined>(undefined);

interface SongProviderProps {
    children: React.ReactNode;
}

export const SongProvider: React.FC<SongProviderProps> = ({ children }) => {
    const [songs, setSongs] = useState<Song[]>([]);
    const [albums, setAlbums] = useState<Album[]>([]); // Added albums state
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedSong, setSelectedSong] = useState<string | null>(null);
    const [IsPlaying, setIsPlaying] = useState<boolean>(false);

    const fetchAlbums = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(`${server}/api/v1/album/all`);
            if (Array.isArray(data)) {
                setAlbums(data);
            } else if (data?.albums) {
                setAlbums(data.albums);
            } else {
                console.error("Unexpected albums data format:", data);
            }
        } catch (err) {
            console.error("Error fetching albums:", err);
        }
        finally{
            setLoading(false);
        }
    }, []);

    const fetchSongs = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(`${server}/api/v1/songs/all`);
            console.log("Fetched Songs Data:", data); // Debug log

            if (data?.albums && Array.isArray(data.albums)) {
                // Map songs directly from the response
                const extractedSongs = data.albums.map((song: any) => ({
                    id: song.id,
                    title: song.title,
                    description: song.description,
                    thumbnail: song.thumbnail,
                    audio: song.audio,
                    album: song.album_id,
                }));
                setSongs(extractedSongs);
                if (extractedSongs.length > 0) {
                    setSelectedSong(extractedSongs[0].id);
                    setIsPlaying(false);
                }
            } else {
                console.error("Unexpected songs data format:", data);
            }
        } catch (err) {
            console.error("Error fetching songs:", err);
        } finally {
            setLoading(false);
        }
    }, []);
   const [song,setSong]=useState<Song|null>(null)

   const fetchSingleSong = useCallback(async () => {
    if (!selectedSong) return;
    try {
        const { data } = await axios.get(`${server}/api/v1/songs/${selectedSong}`);
        console.log("Fetched Single Song Data:", data); // Debug log
        if (data?.songs) {
            setSong(data.songs); // Extract the song from the response
        } else {
            console.error("Unexpected single song data format:", data);
        }
    } catch (err) {
        console.error("Error fetching single song:", err);
    }
}, [selectedSong]);
    const [index,setIndex]=useState<number>(0)

    const nextSong = useCallback(() => {
        if (index === songs.length - 1) {
            setIndex(0);
            setSelectedSong(songs[0]?.id.toString());
        } else {
            setIndex((prevIndex) => prevIndex + 1);
            setSelectedSong(songs[index + 1]?.id.toString());
        }
    }, [index, songs]);

    const previousSong = useCallback(() => {
        if (index === 0) {
            setIndex(songs.length - 1);
            setSelectedSong(songs[songs.length - 1]?.id.toString());
        } else {
            setIndex((prevIndex) => prevIndex - 1);
            setSelectedSong(songs[index - 1]?.id.toString());
        }
    }, [index, songs]);


    const [albumSong,setAlbumSong]=useState<Song[]>([])
    const [albumData,setAlbumData]=useState<Album|null>(null)

    const fetchAlbumSongs = useCallback(async (id: string) => {
        setLoading(true);
        try {
            const { data } = await axios.get(`${server}/api/v1/album/${id}`);
            console.log("API Response:", data); // Debug log
    
            if (data?.response) {
                setAlbumData(data.response.albums);
                setAlbumSong(data.response.songs);
            } else {
                console.error("Unexpected API response structure:", data);
            }
        } catch (error) {
            console.error("Error fetching album songs:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSongs();
        fetchAlbums();
    }, [fetchSongs, fetchAlbums]);

    console.log("Songs state:", songs);
    console.log("Albums state:", albums);

    return (
        <SongContext.Provider value={{ songs, albums, selectedSong, setSelectedSong, IsPlaying, setIsPlaying, loading ,fetchSingleSong,song,nextSong,previousSong,albumSong,albumData,fetchAlbumSongs,fetchSongs,fetchAlbums}}>
            {children}
        </SongContext.Provider>
    );
};
export const useSongData = (): SongContextType => {
    const context = useContext(SongContext);
    if (!context) {
        throw new Error("useSongData must be used within a SongProvider");
    }
    return context;
};