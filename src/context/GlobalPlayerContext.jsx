import React, { createContext, useState, useContext, useRef, useEffect } from 'react';

const GlobalPlayerContext = createContext();

export const useGlobalPlayer = () => useContext(GlobalPlayerContext);

export const GlobalPlayerProvider = ({ children }) => {
    const [currentTrack, setCurrentTrack] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);

    // Use a ref to hold the audio object.
    const audioRef = useRef(null);

    useEffect(() => {
        // Initialize Audio object only once
        if (!audioRef.current) {
            audioRef.current = new Audio();
            // Preload metadata to ensure we can play
            audioRef.current.preload = "auto";
        }

        const audio = audioRef.current;

        const handleEnded = () => setIsPlaying(false);
        const handleError = (e) => {
            console.error("Audio Playback Error:", e);
            console.error("Audio Source:", audio.src);
            setIsPlaying(false);
        };
        const handleCanPlay = () => {
            console.log("Audio can play");
        };
        const handleTimeUpdate = () => {
            setCurrentTime(audio.currentTime);
        };
        const handleLoadedMetadata = () => {
            setDuration(audio.duration);
        };

        audio.addEventListener('ended', handleEnded);
        audio.addEventListener('error', handleError);
        audio.addEventListener('canplay', handleCanPlay);
        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('loadedmetadata', handleLoadedMetadata);

        return () => {
            audio.removeEventListener('ended', handleEnded);
            audio.removeEventListener('error', handleError);
            audio.removeEventListener('canplay', handleCanPlay);
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
            audio.pause();
        };
    }, []);

    const playTrack = async (track) => {
        const audio = audioRef.current;
        if (!audio) return;

        try {
            if (currentTrack?.audioUrl === track.audioUrl) {
                // Toggle if same track
                togglePlay();
            } else {
                // New track
                console.log("Playing new track:", track.title, track.audioUrl);
                setCurrentTrack(track);
                setIsVisible(true);

                // Ensure we pause previous audio before changing src
                audio.pause();
                audio.currentTime = 0;

                audio.src = track.audioUrl;
                audio.load(); // Reload audio element

                const playPromise = audio.play();
                if (playPromise !== undefined) {
                    playPromise
                        .then(() => {
                            setIsPlaying(true);
                        })
                        .catch(error => {
                            console.error("Play failed:", error);
                            setIsPlaying(false);
                        });
                }
            }
        } catch (err) {
            console.error("Error in playTrack:", err);
        }
    };

    const togglePlay = () => {
        const audio = audioRef.current;
        if (!audio) return;

        if (isPlaying) {
            audio.pause();
            setIsPlaying(false);
        } else {
            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise
                    .then(() => setIsPlaying(true))
                    .catch(e => console.error("Resume failed", e));
            }
        }
    };

    const seek = (time) => {
        const audio = audioRef.current;
        if (audio) {
            audio.currentTime = time;
            setCurrentTime(time);
        }
    };

    const closePlayer = () => {
        const audio = audioRef.current;
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
        }
        setIsPlaying(false);
        setIsVisible(false);
        setCurrentTrack(null);
    };

    return (
        <GlobalPlayerContext.Provider value={{
            currentTrack,
            isPlaying,
            isVisible,
            duration,
            currentTime,
            playTrack,
            togglePlay,
            seek,
            closePlayer
        }}>
            {children}
        </GlobalPlayerContext.Provider>
    );
};
