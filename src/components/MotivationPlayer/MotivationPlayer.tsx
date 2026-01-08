import { useState, useRef, useEffect } from "react";
import { FaPlay, FaPause, FaMusic } from "react-icons/fa";

// Dynamically import all audio files from the assets/audio directory
// Using query ?url to ensure we get the URL path
const audioFiles = import.meta.glob('../../assets/audio/*.m4a', { eager: true, query: '?url', import: 'default' });

interface AudioTrack {
    name: string;
    url: string;
}

// Transform the glob result into a usable array
const tracks: AudioTrack[] = Object.entries(audioFiles).map(([path, url]) => {
    // Extract filename without extension for display
    const name = path.split('/').pop()?.replace(/\.[^/.]+$/, '').replace(/_/g, ' ') || 'Unknown Track';
    // Capitalize words
    const formattedName = name.replace(/\b\w/g, l => l.toUpperCase());
    return {
        name: formattedName,
        url: url as string
    };
});

const MotivationPlayer = () => {
    const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const currentTrack = tracks[currentTrackIndex];

    useEffect(() => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.play().catch(e => console.error("Playback failed:", e));
            } else {
                audioRef.current.pause();
            }
        }
    }, [isPlaying, currentTrackIndex]);

    const handlePlayPause = () => {
        setIsPlaying(!isPlaying);
    };

    const handleTrackSelect = (index: number) => {
        if (index === currentTrackIndex) {
            handlePlayPause();
        } else {
            setCurrentTrackIndex(index);
            setIsPlaying(true);
        }
    };

    const handleEnded = () => {
        // Auto-play next track
        if (currentTrackIndex < tracks.length - 1) {
            setCurrentTrackIndex(prev => prev + 1);
        } else {
            // Loop back to start or stop? Let's stop for now, or loop.
            // Let's loop to first track but pause? Or loop continuously?
            // "Motivate themselves" implies continuous background could be nice, but let's just stop or loop.
            // Let's loop.
            setCurrentTrackIndex(0);
        }
    };

    return (
        <div className="w-80 h-[calc(100vh-3rem)] bg-white/30 backdrop-blur-md rounded-3xl border border-white/20 shadow-xl overflow-hidden flex flex-col my-2 mr-4">
            <div className="p-6 bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 h-full flex flex-col">
                <div className="flex items-center gap-2 mb-6 text-gray-700">
                    <FaMusic className="text-violet-600" />
                    <h2 className="text-xl font-bold">Motivation Station</h2>
                </div>

                {/* Now Playing Card */}
                <div className="bg-white/60 rounded-2xl p-4 shadow-sm backdrop-blur-sm mb-6 border border-white/50 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                         <FaMusic size={64} />
                    </div>
                    
                    <p className="text-xs font-semibold text-violet-500 uppercase tracking-wider mb-1">Now Playing</p>
                    <h3 className="text-lg font-bold text-gray-800 truncate mb-4">{currentTrack?.name || "Select a track"}</h3>

                    <div className="flex justify-center mb-2">
                        <button 
                            onClick={handlePlayPause}
                            className="w-12 h-12 flex items-center justify-center rounded-full bg-violet-600 text-white shadow-lg hover:bg-violet-700 hover:scale-105 transition-all transform active:scale-95"
                        >
                            {isPlaying ? <FaPause size={16} /> : <FaPlay size={16} className="ml-1" />}
                        </button>
                    </div>
                </div>

                {/* Playlist */}
                <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                    {tracks.map((track, index) => (
                        <div 
                            key={track.url}
                            onClick={() => handleTrackSelect(index)}
                            className={`p-3 rounded-xl cursor-pointer transition-all border flex items-center gap-3 group
                                ${index === currentTrackIndex 
                                    ? 'bg-violet-600/10 border-violet-200 shadow-inner' 
                                    : 'bg-white/40 border-transparent hover:bg-white/60 hover:shadow-sm'
                                }`}
                        >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs shrink-0 transition-colors
                                ${index === currentTrackIndex ? 'bg-violet-600 text-white' : 'bg-gray-200 text-gray-500 group-hover:bg-violet-100 group-hover:text-violet-600'}`}>
                                {index === currentTrackIndex && isPlaying ? (
                                    <div className="flex gap-[2px] h-3 items-end">
                                        <div className="w-[2px] bg-white animate-bounce h-full"></div>
                                        <div className="w-[2px] bg-white animate-bounce h-2 delay-75"></div>
                                        <div className="w-[2px] bg-white animate-bounce h-full delay-150"></div>
                                    </div>
                                ) : (
                                    <span>{index + 1}</span>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className={`text-sm font-medium truncate ${index === currentTrackIndex ? 'text-violet-800' : 'text-gray-700'}`}>
                                    {track.name}
                                </p>
                            </div>
                        </div>
                    ))}
                    
                    {tracks.length === 0 && (
                         <div className="text-center p-4 text-gray-500 text-sm">
                            <p>No audio files found.</p>
                            <p className="text-xs mt-1 opacity-70">Add .m4a files to src/assets/audio</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Hidden Audio Element */}
            {currentTrack && (
                <audio
                    ref={audioRef}
                    src={currentTrack.url}
                    onEnded={handleEnded}
                    onPause={() => setIsPlaying(false)}
                    onPlay={() => setIsPlaying(true)}
                />
            )}
        </div>
    );
};

export default MotivationPlayer;
