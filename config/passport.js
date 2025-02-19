const LocalStrategy = require('passport-local').Strategy
const Admin = require('../model/admin.model');
const { hashToPlain } = require('../utils/password');

module.exports =  (passport) =>{
    passport.use(new  LocalStrategy(async(email,passport,done)=>{
        const adminCon = await Admin.findOne({email})

        if(!adminCon){
            return done(null,false,console.log("user not found"))
        }

        const match = await hashToPlain(passport)
        if(!match){
            return done(null,false,console.log("wrong password"))
        }
        return done(null,adminCon)
    }));

    passport.serializeUser((user,done)=>{
        done(null,user.id)
    });
    passport.deserializeUser(async(id,done)=>{
        const adminCon = await Admin.findById(id)
        done(null,adminCon)
    })
}