const User = require('./models/user')
const Role = require('./models/role')
const bcrypt = require('bcrypt');
const jsw = require('jsonwebtoken')
const {validationResult} = require('express-validator')
const {secret} = require("./config")

const generateAccessToken = (id, roles) => {
    const payload = { id, roles }
    return jsw.sign(payload, secret, {expiresIn: "12h"})
}


class authService {
    async registration(req,res){
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json('Error')
            }
            // Is there the same name in data base?
            const { username, password } = req.body
            const candidate = await User.findOne({ username })
            if (candidate) {
                res.status(400).json({message: 'Already know same name'})
            }
            // HASHING and save of the data
            const hashPassword = bcrypt.hashSync(password, 7);
            const userRole = Role.findOne({value: "USER"})
            const user = new User({ username, password: hashPassword, roles: [userRole.value] })
            await user.save()
            return res.json({ massage: "Cool, you passed the registration" })
            
        } catch(e){
            console.log(e)
            res.status(400).json({message: 'Registration error'})
        }
    }
    
    async login(req,res){
        try{
            const { username, password } = req.body
            // Seasch for user in data base
            const user = await User.findOne({ username })
            if (!user) {
                return res.status(400).json('Wrong username')
            }
            // Password comparing
            const validPassword = bcrypt.compareSync(password, user.password)
            if (!validPassword) {
                return res.status(400).json('Wrong password')
            }
            // Create TOKEN and send it 
            const token = generateAccessToken(user._id, user.roles)
            return res.json({token})
        } catch (e) {
            console.log(e)
            res.status(400).json({message: 'Login error'})
        }
        
    }
}

module.exports = new authService


