import AlbumCard from "../components/AlbumCard";
import Layout from "../components/Layout";
import Loading from "../components/Loading";
import SongCard from "../components/SongCard";
import { useSongData } from "../context/SongContext";

const Home = () => {
  const { albums, songs ,loading} = useSongData();

  // Debug log to check albums and songs data
  console.log("Albums Data:", albums);
  console.log("Songs Data:", songs);

  return (
    <div>
      
      {loading?<Loading/>:<Layout>
        <div className="mb-4">
          <h1 className="my-5 font-bold text-2xl">Featured Albums</h1>
          <div className="flex overflow-x-auto gap-4">
            {albums && albums.length > 0 ? (
              albums.map((e, i) => (
                <AlbumCard
                  key={i}
                  image={e.thumbnail}
                  name={e.title}
                  description={e.description}
                  id={e.id}
                />
              ))
            ) : (
              <p className="text-gray-500">No albums available</p>
            )}
          </div>
        </div>

        <div className="mb-4">
          <h1 className="my-5 font-bold text-2xl">Featured Songs</h1>
          <div className="flex overflow-x-auto gap-4">
            {songs && songs.length > 0 ? (
              songs.map((e, i) => (
                <SongCard
                  key={i}
                  image={e.thumbnail}
                  name={e.title}
                  description={e.description}
                  id={e.id}
                />
              ))
            ) : (
              <p className="text-gray-500">No songs available</p>
            )}
          </div>
        </div>
      </Layout>}
    </div>
  );
};

export default Home;