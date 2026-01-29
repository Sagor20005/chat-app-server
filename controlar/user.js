
const createJwt = require("../utilities/jwt.create.js")
const UserColl = require("../mongoose/models/User.js")
const Controlars = {}




// SIGNUP USER
Controlars.Signup = async (req, resp) => {
  const SignupData = req.body || {}

  // Checking Empty fild
  const Empty = ["fullName", "email", "password"].filter((i) => !SignupData[i])
  if (Empty.length) {
    resp.status(400).json({
      error: `Required ${Empty}`
    })
    return
  }

  // Add User 
  const newUser = new UserColl({
    name: SignupData.fullName,
    username: SignupData.fullName.toLowerCase().split(" ")[0] + Date.now(),
    email: SignupData.email.toLowerCase(),
    password: createJwt(SignupData.password)
  })

  try {
    const saveRes = await newUser.save()
    const userData = saveRes.toObject()
    delete userData.password
    resp.status(200).json({
      token: createJwt(userData, 60 * 60 * 24 * 360)
    })
  } catch (err) {
    resp.status(500).json({
      error: err.message.includes("duplicate") ? "You have an account!" : err.message
    })
  }
}


// LOGIN USER 
Controlars.Login = async (req, resp) => {
  try {
    // Sanityze Data
    const LoginData = req.body || {}
    const EmptyFild = ["email", "password"].filter((i) => !LoginData[i])
    if (EmptyFild.length) {
      resp.status(400).json({
        error: `Please Type ${EmptyFild}`
      })
      return
    }

    // Genaret Password JWT 
    LoginData.password = createJwt(LoginData.password)

    // Validity checking 
    const user = await UserColl.findOne(LoginData)
    if (!user) {
      resp.status(404).json({
        error: "Wrong Email & Password"
      })
    } else {
      const userData = user.toObject()
      delete userData.password
      resp.status(200).json({
        token: createJwt(userData, 31536000)
      })
    }

  } catch (err) {
    console.log(err)
    resp.status(500).json({
      error: err.message
    })
  }
}

// RESET LOGIN TOKeN
Controlars.ResetToken = async (req, resp) => {
  const { id } = req.params
  if (!id) resp.status(404).json({ error: "Id not found!" })

  try {
    const userData = await UserColl.findOne({ _id: id })
    const toObj = userData.toObject()
    delete toObj.password

    const token = createJwt(toObj, 31536000)
    resp.status(200).json({ token })
  } catch (err) {
    resp.status(500).json({
      error: "Server error !"
    })
  }

}


// GET ALL USER 
Controlars.userList = async (req, resp) => {
  try {
    resp.status(200).json({
      users: await UserColl.find()
    })
  } catch ({ message }) {
    resp.status(500).json({
      message
    })
  }
}



// CHANGE NAME AND USER NAME 
Controlars.changeNameAndUsername = async (req, resp) => {
  const body = req.body;
  const { user_id, data } = body;
  try {
    // invalid data error 
    if (!user_id || typeof (data) !== "object") throw Error("Invalid data!")
    // Update 
    const updateRes = await UserColl.findOneAndUpdate({ _id: user_id }, data)
    // Get updated data
    const user = await UserColl.findOne({ _id: user_id })

    // Convert to token 
    const toObj = user.toObject()
    delete toObj.password
    const token = createJwt(toObj, 31536000)


    resp.status(200).json({
      token
    })

  } catch (err) {
    resp.status(200).json({
      error: err.message
    })
  }
}



// CHANGE PASSWORD 
Controlars.changePassword = async (req, resp) => {
  const body = req.body;
  const { _id, data } = body;
  try {
    // invalid data error 
    if (!_id || typeof (data) !== "object") throw Error("Invalid data!")

    const user = await UserColl.findOne({ _id })

    // encode old password and match 
    const encodedPass = createJwt(data.current_password)

    // match the bothe encoded password  and if invalid then exit
    if (encodedPass !== user.password) {
      throw Error("Invalid Password.")
    }

    // create hash password and save 
    const newPasswordHash = createJwt(data.newPassword)
    user.password = newPasswordHash
    const save = await user.save()

    resp.status(200).json({
      state: true
    })
  } catch (err) {
    resp.status(200).json({
      error: err.message
    })
  }
}





// CHANGE EMAIL OR PHONE 

Controlars.ChangeEmailPhone = async (req, resp) => {
  try {
    const { isEmail, user, newE_P, CurrentE_P, Password } = req.body

    if (!user || !newE_P || !CurrentE_P || !Password) {
      throw Error("Please provide all information !")
      return
    }

    // find user and Auth check that request 
    // find user 
    const Finduser = await UserColl.findOne({ _id: user })
    if (!Finduser?._id) {
      throw Error("Not Founded User!")
      return
    }
    // prepire password and compare password 
    const encode_password = createJwt(Password)

    if (CurrentE_P !== Finduser.email) throw Error("Incurrect Email!")
    if (encode_password !== Finduser.password) throw Error("Incurrect Password!")

    // Change email or phone 
    Finduser.email = newE_P
    const save = await Finduser.save()

    const userData = Finduser.toObject()
    delete userData.password

    const token = createJwt(userData, 31536000)

    resp.status(200).json({token})


  } catch (err) {
    resp.status(500).json({ error: err.message })
  }
}


module.exports = Controlars