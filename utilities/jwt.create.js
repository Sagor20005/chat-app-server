var jwt = require('jsonwebtoken');

function createJwt(data,exp){
  const secrate = process.env.JWT_SECRATE
  if(!exp){
    return jwt.sign(data, secrate)
  }
  if(exp){
    return jwt.sign(data, secrate ,{ expiresIn: exp })
  }
}

module.exports = createJwt