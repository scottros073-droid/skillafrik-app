import React, { useState } from "react";

const SafeImage = ({ src, alt, fallback = "/images/placeholder.png", ...props }) => {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <img
      src={imgSrc}
      alt={alt}
      {...props}
      onError={() => setImgSrc(fallback)} // fallback if image fails to load
    />
  );
};

export default SafeImage;
