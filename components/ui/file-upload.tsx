"use client";
import { cn } from "@/app/lib/utils";
import React, { useRef, useState, useEffect } from "react";
import { motion } from "motion/react";
import { IconUpload } from "@tabler/icons-react";
import { useDropzone } from "react-dropzone";

const mainVariant = {
  initial: { x: 0, y: 0 },
  animate: { x: 20, y: -20, opacity: 0.9 },
};

export const FileUpload = ({
  onChange,
}: {
  onChange?: (files: File[]) => void;
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]); // <-- store preview URLs
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (newFiles: File[]) => {
    setFiles(newFiles);
    onChange && onChange(newFiles);

    // generate previews
    const newPreviews = newFiles.map((file) =>
      file.type.startsWith("image/") ? URL.createObjectURL(file) : "",
    );
    setPreviews(newPreviews);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const { getRootProps, isDragActive } = useDropzone({
    multiple: false,
    noClick: true,
    onDrop: handleFileChange,
  });

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => previews.forEach((url) => URL.revokeObjectURL(url));
  }, [previews]);

  return (
    <div className="w-full" {...getRootProps()}>
      <motion.div
        onClick={handleClick}
        whileHover="animate"
        className="group/file relative block w-full cursor-pointer overflow-hidden rounded-lg "
      >
        <input
          ref={fileInputRef}
          type="file"
          onChange={(e) => handleFileChange(Array.from(e.target.files || []))}
          className="hidden"
        />

        <div className="flex flex-col items-start justify-start">
          <p className="relative z-20 font-sans text-base font-bold text-white">
            Upload Thumbnail
          </p>
          <p className="relative z-20 mt-2 font-sans text-base font-normal text-white/60">
            Drag or drop your thumbnail here or click to upload
          </p>

          <div className="relative mx-auto mt-6 w-full max-w-xs">
            {files.length > 0 &&
              files.map((file, idx) => (
                <motion.div
                  key={"file" + idx}
                  layout
                  className={cn(
                    "relative z-40 mt-4 flex w-full flex-col items-center justify-center overflow-hidden rounded-md bg-white p-2 dark:bg-neutral-900 shadow-sm",
                  )}
                >
                  {/* Image preview */}
                  {previews[idx] ? (
                    <img
                      src={previews[idx]}
                      alt={file.name}
                      className="h-32 w-full object-cover rounded-md"
                    />
                  ) : (
                    <p className="text-neutral-700 dark:text-neutral-300">
                      No preview
                    </p>
                  )}

                  <div className="mt-2 flex w-full justify-between text-sm text-neutral-600 dark:text-neutral-400">
                    <span className="truncate">{file.name}</span>
                    <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                  </div>
                </motion.div>
              ))}

            {!files.length && (
              <motion.div
                layoutId="file-upload"
                variants={mainVariant}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="relative z-40 mx-auto mt-4 flex h-32 w-full max-w-[8rem] items-center justify-center rounded-md bg-white shadow-[0px_10px_50px_rgba(0,0,0,0.1)] dark:bg-neutral-900"
              >
                {isDragActive ? (
                  <motion.p className="flex flex-col items-center text-neutral-600">
                    Drop it
                    <IconUpload className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
                  </motion.p>
                ) : (
                  <IconUpload className="h-4 w-4 text-neutral-600 dark:text-neutral-300" />
                )}
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
