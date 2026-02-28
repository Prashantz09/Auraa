"use client";

import React, { forwardRef } from "react";

interface CustomIframeProps {
  src: string;
  className?: string;
  allow?: string;
  allowFullScreen?: boolean;
  onLoad?: () => void;
  onError?: () => void;
  title?: string;
}

const CustomIframe = forwardRef<HTMLIFrameElement, CustomIframeProps>(
  (
    {
      src,
      className = "",
      allow = "autoplay; fullscreen; encrypted-media; picture-in-picture",
      allowFullScreen = true,
      onLoad,
      onError,
      title = "Video Preview",
      ...props
    },
    ref,
  ) => {
    return (
      <iframe
        ref={ref}
        src={src}
        className={`border-0 rounded-lg ${className}`}
        allow={allow}
        allowFullScreen={allowFullScreen}
        onLoad={onLoad}
        onError={onError}
        title={title}
        loading="lazy"
        sandbox="allow-scripts allow-same-origin allow-presentation"
        {...props}
      />
    );
  },
);

CustomIframe.displayName = "CustomIframe";

export default CustomIframe;
