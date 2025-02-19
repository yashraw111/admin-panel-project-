const bcrypt=require('bcryptjs')

exports.plainToHash=async(password)=>{
    const salt=await bcrypt.genSalt(10);
    const hashPassword=await bcrypt.hash(password,salt)
    return hashPassword

}

exports.hashToPlain=async(password,hashPassword)=>{
    const match_pass=await bcrypt.compare(password,hashPassword)
    // console.log(match_pass)
    return match_pass
}