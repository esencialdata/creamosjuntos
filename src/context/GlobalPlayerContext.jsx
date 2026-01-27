import React, { createContext, useState, useContext, useRef, useEffect } from 'react';

const GlobalPlayerContext = createContext();

export const useGlobalPlayer = () => useContext(GlobalPlayerContext);

export const GlobalPlayerProvider = ({ children }) => {
    const [currentTrack, setCurrentTrack] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

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
            alert("Hubo un error al reproducir el audio. Por favor verifica tu conexión.");
        };
        const handleCanPlay = () => {
            console.log("Audio can play");
        };

        audio.addEventListener('ended', handleEnded);
        audio.addEventListener('error', handleError);
        audio.addEventListener('canplay', handleCanPlay);

        return () => {
            audio.removeEventListener('ended', handleEnded);
            audio.removeEventListener('error', handleError);
            audio.removeEventListener('canplay', handleCanPlay);
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
            playTrack,
            togglePlay,
            closePlayer
        }}>
            {children}
        </GlobalPlayerContext.Provider>
    );
};
