import { useEffect, useState } from "react";
import { getMediaUrl, checkUrlExists } from "../../utils/mediaUtils";

export function SafeImage({ src, alt = "image", className = "", fallback = "/public/default.png", ...props }) {
  const defaultPlaceholder = "https://via.placeholder.com/600x400?text=Image+unavailable";
  const [srcUrl, setSrcUrl] = useState(getMediaUrl(src || fallback || defaultPlaceholder));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const resolved = getMediaUrl(src || fallback || defaultPlaceholder);
    setIsLoading(true);

    checkUrlExists(resolved)
      .then((exists) => {
        if (exists) {
          setSrcUrl(resolved);
        } else if (fallback) {
          setSrcUrl(getMediaUrl(fallback));
        } else {
          setSrcUrl(defaultPlaceholder);
        }
      })
      .catch(() => {
        if (fallback) setSrcUrl(getMediaUrl(fallback));
        else setSrcUrl(defaultPlaceholder);
      })
      .finally(() => setIsLoading(false));
  }, [src, fallback]);

  return (
    <img
      src={srcUrl}
      alt={alt}
      className={`${className} ${isLoading ? "opacity-50 animate-pulse" : ""}`.trim()}
      onError={(e) => {
        e.currentTarget.onerror = null;
        e.currentTarget.src = fallback ? getMediaUrl(fallback) : defaultPlaceholder;
      }}
      {...props}
    />
  );
}

export function SafeAudio({ src, controls = true, fallback = "http://localhost:5000/public/default.mp3", ...props }) {
  const [audioUrl, setAudioUrl] = useState(getMediaUrl(src || fallback));
  const [loaded, setLoaded] = useState(false);
  const fallbackAudio = "http://localhost:5000/public/default.mp3";

  useEffect(() => {
    const resolved = getMediaUrl(src || fallbackAudio);
    checkUrlExists(resolved)
      .then((exists) => {
        setAudioUrl(exists ? resolved : getMediaUrl(fallbackAudio));
      })
      .catch(() => {
        setAudioUrl(getMediaUrl(fallbackAudio));
      })
      .finally(() => {
        setLoaded(true);
      });
  }, [src, fallback]);

  const playSafe = async () => {
    if (!audioUrl) return;
    try {
      const audio = new Audio(audioUrl);
      audio.volume = 0.6;
      await audio.play();
    } catch (err) {
      console.warn("Audio failed to play", err);
    }
  };

  return (
    <audio
      src={audioUrl}
      controls={controls}
      onError={(e) => {
        e.currentTarget.onerror = null;
        e.currentTarget.src = getMediaUrl(fallbackAudio);
      }}
      onCanPlayThrough={() => setLoaded(true)}
      {...props}
    >
      {loaded ? "" : <source src={audioUrl} type="audio/mpeg" />}
    </audio>
  );
}
