import { Link } from "react-router-dom";
import music from "../../../assets/images/music.png";
const PlaylistCard = ({ playlist }) => {
  // console.log(playlist);
  const route = "/playlist/" + playlist._id;
  return (
    <Link
      to={route}
      key={playlist._id}
      className="relative bg-[#1a1a1aad] rounded-lg p-4 w-[200px] block hover:bg-lightgray"
    >
      <img
        className="w-full overflow-hidden rounded-lg aspect-square"
        src={playlist.thumbnail ? playlist.thumbnail : music}
      />

      <div className="mt-4">
        <h1 className="mb-2 font-bold">{playlist.name}</h1>
        <p className="leading-5 text-primarytext line-clamp-2 font-opensans">
          {playlist.desc ? playlist.desc : playlist.owner.name}
        </p>
      </div>
    </Link>
  );
};

export { PlaylistCard };
