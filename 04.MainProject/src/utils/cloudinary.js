import {v2 as cloudinary} from 'cloudinary'
import { log } from 'console'
import { response } from 'express'
import fs from 'fs'

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})

const UploadOnCloud = async function(LocalFilePath){
    try{
        if(!LocalFilePath){
            return null
        } else {
            const response = await cloudinary.uploader.upload(LocalFilePath, {
                resource_type: "auto",
            })
        }
        console.log("File uploaded succesfully", response.url);
        return response
    } catch (error) {
        fs.unlinkSync(LocalFilePath) //remove locally saved temp file as file upload failed
        return null
    }
}

export {UploadOnCloud}