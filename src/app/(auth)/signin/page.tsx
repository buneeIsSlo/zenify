import ConnectSpotifyButton from "./connect-spotify-button";

export default function Signin() {
  return (
    <div className="flex h-dvh w-full items-center justify-center bg-zinc-900">
      <div className="flex flex-col items-center gap-8 text-center">
        <div className="space-y-3">
          <h1 className="text-4xl font-bold text-white">Welcome to Zenify</h1>
          <p className="max-w-sm text-lg text-zinc-400">
            Connect your Spotify account (Premium) to experience
            distraction-free music
          </p>
        </div>

        <div className="flex flex-col items-center gap-4">
          <ConnectSpotifyButton />
        </div>
      </div>
    </div>
  );
}
