import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UploadCloud, XCircle } from "lucide-react";
import {storage} from "@/lib/appwrite.ts";
import {ID} from "appwrite";


interface ImageUploaderProps {
    value?: string;
    onChange: (url: string | undefined) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ value, onChange }) => {
    const [preview, setPreview] = useState<string | null>(value || null);
    const [imageUrl, setImageUrl] = useState<string>("");
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if (value) {
            setPreview(value);
        }
    }, [value]);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setIsUploading(true);
            try {
                // Upload file to Appwrite bucket
                const response = await storage.createFile(
                    "67b478dd00221462624e", // Bucket ID
                    ID.unique(),
                    file
                );
                const fileId = response.$id;

                // Directly get the view URL using getFileView
                const viewUrl = await storage.getFilePreview("67b478dd00221462624e", fileId);

                setPreview(viewUrl.href);  // 'href' will give the preview URL
                setImageUrl(viewUrl.href); // Store the preview URL
                onChange(viewUrl.href);    // Update parent state with preview URL
            } catch (error) {
                console.error("Upload failed:", error);
            } finally {
                setIsUploading(false);
            }
        }
    };

    const handleButtonClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const url = event.target.value;
        setImageUrl(url);
        setPreview(url);
        onChange(url || undefined);
    };

    const handleReset = () => {
        setPreview(null);
        setImageUrl("");
        onChange(undefined);
    };

    return (
        <div>
            {preview ? (
                <div className="relative w-full py-4">
                    <img src={preview} alt="Preview" className="max-h-40 w-full object-cover rounded-lg shadow-md"/>
                    <Button
                        size="icon"
                        variant="ghost"
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                        onClick={handleReset}
                    >
                        <XCircle size={20}/>
                    </Button>
                </div>
            ) : (
                <p className="text-gray-500 text-center">No Image selected</p>
            )}

            <div className="w-full py-4">
                <Input
                    type="text"
                    value={imageUrl}
                    placeholder="Or enter url..."
                    onChange={handleUrlChange}
                />
            </div>

            <div className="w-full py-4">
                <Button variant="outline" className="w-full flex gap-2" type="button" onClick={handleButtonClick} disabled={isUploading}>
                    <UploadCloud size={18}/> {isUploading ? "Uploading..." : "Select image"}
                </Button>
                <Input ref={fileInputRef} type="file" accept="image/*" className="hidden"
                       onChange={handleFileChange}
                       disabled={isUploading}
                />
            </div>
        </div>
    );
};

export default ImageUploader;
