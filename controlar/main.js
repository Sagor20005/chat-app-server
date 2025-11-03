const Controlar = {}
const createJwt = require("../utilities/jwt.create.js")
const imageKit = require("../lib/Imagekit/imagekit.js")
const { toFile } = require('@imagekit/nodejs');
const userColl = require("../mongoose/models/User.js")


Controlar.uploadAvatar = async (req,resp)=>{
  const { user_id } = req.body || {}
  if(!user_id){
    resp.status(404).json({
      error:"user id not found!"
    })
    return
  }
  
  const { originalname, buffer } = req.file || {}
  if(!originalname || !buffer){
    resp.status(404).json({
      error:"File not found!"
    })
    return
  }
  
  try{
    const { fileId, url, name } = await imageKit.files.upload({ file: await toFile(Buffer.from(buffer), 'file'), fileName: originalname });
    if(!fileId || !url || !name)  throw Error("Upload faild!")
    
    const updateProfile = await userColl.findOneAndUpdate({_id: user_id},{ avatar: { fileId, url, name } })
    const previousAvatarId = updateProfile.avatar.fileId
    
    try{
      const deleteRes = await imageKit.files.delete(previousAvatarId);
    }catch(ierr){}
    
    const me = await userColl.findOne({ _id: user_id })
    const tokenData = {
      ...me.toObject(),
      password:"",
      avatar:{
        fileId, url, name
      }
    }
    
    
    
    resp.status(200).json({
      token: createJwt(tokenData,60*60*24*360)
    })
  }catch(err){
    resp.status(500).json({
      error: err.message
    })
  }
}


module.exports = Controlar