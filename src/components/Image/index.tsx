import { useState, useEffect } from "react";
import style from "./styles.module.css";

const Image = ({ src, alt, width = "", height = "", className, ...props }) => {
  const [loading, setLoading] = useState(true);
  console.log("🚀 ~ Image ~ loading:", loading);

  useEffect(() => {
    setLoading(true);
  }, [src]);

  const handleOnLoad = () => {
    setLoading(false);
    console.log("🚀 ~ handleOnLoad ~ false:", false);
  };

  return (
    <div className={style.image_container} style={{ width, height }}>
      {loading && <div className={`${style.skeleton_placeholder}`} />}
      <img
        src={src}
        alt={alt}
        onLoad={handleOnLoad}
        loading="lazy"
        className={`${className} ${loading ? "hidden-image" : "visible-image"}`}
        {...props}
      />
    </div>
  );
};

export default Image;
