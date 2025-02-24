import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"
// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDIARY_CLOUD_NAME,
    api_key: process.env.CLOUDIARY_API_KEY,
    api_secret: process.env.CLOUDIARY_API_SECRET_KEY
});

export const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) {
            console.log("Provide localfile path in order to upload on cloudinary");
            return null;
        }

        const uploadResult = await cloudinary.uploader
            .upload(
                "./uploads/" + localFilePath, {
                resource_type: 'auto'
            }
            )

        fs.unlink("./uploads/" + localFilePath, (err) => {
            if (err) {
                console.error("cloudinary Error deleting file:", err);
            }
        })


        return uploadResult.url

    } catch (error) {
        fs.unlink("./uploads/" + localFilePath, (err) => {
            if (err) {
                console.error(" cloudinary Error deleting file:", err);
            } else {
                console.log("Local file deleted successfully");
            }
        })
        console.log("cloudinary error: ", error);
        return null;
    }
}