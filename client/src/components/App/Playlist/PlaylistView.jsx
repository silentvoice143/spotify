//song component import

import { PlaylistCard } from "./PlaylistCard";

const PlaylistView = ({ playlists, heading }) => {
  return (
    <div className="py-4 pl-6 pr-4">
      <h1 className="text-2xl font-bold hover:underline">{heading}</h1>
      <div className="flex flex-wrap gap-6 my-4">
        {playlists.map((playlist) => (
          <PlaylistCard key={playlist._id} playlist={playlist} />
        ))}
      </div>
    </div>
  );
};

export default PlaylistView;
