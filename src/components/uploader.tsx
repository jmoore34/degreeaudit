import React, { useRef, useState } from "react";

export const FileUploader = ({ onFileSelect }: any) => {
    const fileInput = useRef<HTMLElement | null>(null)
    const handleFileInput = (e: any) => {
        onFileSelect(e.target.files[0])
    }

    return (
        <div className="file-uploaders">
            <input type="file" onChange={handleFileInput} />
            <button onClick={e => fileInput.current && fileInput.current!.click()} className="btn btn-primary">Submit</button>
        </div>
    )
}