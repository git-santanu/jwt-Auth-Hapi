const { success, error } = require('../../response/macros');
const user = require('../../models').user;
const {hashPassword} = require('../helper');

exports.registration = async(req,res)=>{
    try {
        //getting request body responses
        const rb = req.payload;
        //check email
        let emailExists = await user.findOne({
            where: {
                email: rb.email
            },attributes:['id']
        })
        if(emailExists){
            return success({error: 'Email does not exists'})(res)
        }
        //check mobile
        let mobileExists= await user.findOne({
            where:{
                mobile_number: rb.mobile_number
            },attributes: ['id']
        })
        if(mobileExists){
            return success({error: 'Mobile number already exists'})(res)
        }
        //hash password
        let password = await hashPassword(rb.password)

        //create user
        let create = await user.create({
            firstName: rb.firstName,
            lastName: rb.lastName,
            email: rb.email,
            password: password,
            mobile_number: rb.mobile_number
        })
        return success(create,'User created successfully')(res);
    } catch (error) {
        console.log(err)
        return error(err.message)(res) 
    }
}