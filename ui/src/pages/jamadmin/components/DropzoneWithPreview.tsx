import React from "react";

export const DropzoneWithPreview: React.FC<{
  label: string;
  ctx: string;
  currentImagePreview: string;
  onUploadImage: (file: File, ctx: string, setUploading: (v: boolean) => void) => void;
  isUploading: boolean;
}> = ({ label, ctx, currentImagePreview, onUploadImage, isUploading }) => {
  const [preview, setPreview] = React.useState<string | null>(currentImagePreview);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Sync preview with currentImagePreview from parent
  React.useEffect(() => {
    setPreview(currentImagePreview);
  }, [currentImagePreview]);

  const handleFiles = (files: FileList | null) => {
    if (files && files[0]) {
      const file = files[0];
      setPreview(URL.createObjectURL(file));
      onUploadImage(file, ctx, setUploading);
    }
  };

  const [uploading, setUploading] = React.useState(false);

  React.useEffect(() => {
    setUploading(isUploading);
  }, [isUploading]);

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    handleFiles(e.dataTransfer.files);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const onClick = () => {
    inputRef.current?.click();
  };

  return (
    <div>
      <h3 className="text-xl text-center mb-2">{label}</h3>
      <div
        className="bg-gray-600 border-2 border-gray-400 rounded-lg p-4 flex flex-col justify-center items-center cursor-pointer hover:border-blue-500 transition relative"
        onDrop={onDrop}
        onDragOver={e => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onClick={onClick}
        tabIndex={0}
        style={{ minHeight: 120 }}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={onChange}
          disabled={uploading}
        />
        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 z-10">
            <div
              className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[var(--theme-primary)]"></div>
          </div>
        )}
        {preview ? (
          <img src={preview} alt={label + " preview"} className="max-h-40 max-w-full rounded shadow mb-2" />
        ) : (
          <span className="text-gray-500">Drag & drop or click to select an image</span>
        )}
      </div>
    </div>
  );
};
