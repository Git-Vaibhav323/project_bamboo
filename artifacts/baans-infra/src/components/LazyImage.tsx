import React, { useCallback, forwardRef } from "react";

type LazyImageProps = React.ImgHTMLAttributes<HTMLImageElement>;

const LazyImage = forwardRef<HTMLImageElement, LazyImageProps>(
  function LazyImage({ style, onLoad, loading = "lazy", ...props }, ref) {
    const handleLoad = useCallback(
      (e: React.SyntheticEvent<HTMLImageElement>) => {
        e.currentTarget.style.opacity = "1";
        onLoad?.(e);
      },
      [onLoad],
    );

    const setRef = useCallback(
      (el: HTMLImageElement | null) => {
        if (typeof ref === "function") ref(el);
        else if (ref) ref.current = el;
        if (el?.complete && el.naturalWidth > 0) {
          el.style.opacity = "1";
        }
      },
      [ref],
    );

    return (
      <img
        ref={setRef}
        loading={loading}
        style={{
          opacity: 0,
          transition: "opacity 0.6s ease",
          ...style,
        }}
        onLoad={handleLoad}
        {...props}
      />
    );
  },
);

export default LazyImage;
