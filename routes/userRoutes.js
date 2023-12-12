import express from 'express'
import info from '../models/info.model.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const Router = express.Router();


// Register User

Router.get("/register",(req,res)=>{
    res.render("register")
})

Router.post("/register",async (req,res)=>{
    const {email,password} = req.body;
    const hashedPassword = await bcrypt.hash(password,10)
    const existingUser = await info.findOne({ email });

    if (existingUser) {
        return res.redirect("/authLogin");
    }
        await info.create({email,password:hashedPassword})
        const user = await info.findOne({email,password:hashedPassword})

        if (!user) {
            // Handle error, user not found after creation
            return res.redirect("/authLogin");
        }
    
        // Generate a token for the new user
        const token = jwt.sign({ _id: user._id }, "oneTwo");
    
        // Set the token in a cookie
        res.cookie('authToken', token, {
            httpOnly: true,
            expires: new Date(Date.now() + 60 * 1000), 
        });
    
        // Redirect to the authenticated route
        res.redirect("/authIn");
    
        
})

export default Router;
