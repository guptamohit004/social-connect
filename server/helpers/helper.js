const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: 'dwmckpjq0',
    api_key: '277664388976843',
    api_secret: 'vjmkY-wxPyWof0iVS64lO0h_FG8'
});

exports.cloudinaryDelete = async (req,res,next,fileName)=>{
    cloudinary.uploader.destroy(fileName, function(error,result) {
        console.log(result, error);
    });
}

exports.cloudinaryUpload = async(req,res,next,path,uniqueFilename)=>{
    var data = await cloudinary.uploader.upload(
        path,
        { public_id: uniqueFilename}, // directory and tags are optional
        function(err, image) {
          if (err) return res.send(err)
          console.log('file uploaded to Cloudinary');
          // remove file from server
          const fs = require('fs');
          fs.unlinkSync(path)
          // return image details
          return(image);
        }
      )
    return data;
}