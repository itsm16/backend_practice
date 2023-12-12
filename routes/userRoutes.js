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
    
        //sign method takes a secret
        //user's id(written as user._id) is provided with secret to sign method
        //token is passed as value in res.cookie method

        // Redirect to the authenticated route
        res.redirect("/authIn");
    
        
})


// Login User

const isAuthenticated = async (req,res,next)=>{
    const {authToken} = req.cookies;
    if (authToken) {
        const decoded = jwt.verify(authToken,"oneTwo");
        req.user = await info.findById(decoded._id)
        next();
    } else {
        res.redirect("/authLogin")
    }
}

Router.get('/authLogin',(req,res)=>{
    //created in isAuthenticated
   // res.render('authSecret',{email : req.user.email})
   res.render('authLogin')
   
})

Router.post("/authLogin", async (req, res) => {
    const { email, password } = req.body;

    // Check if the user exists
    let user = await info.findOne({ email });

    if (!user) {
        return res.redirect('/register'); // or handle the error accordingly
    }

    // Compare passwords only if the user exists
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        return res.redirect("/authLogin");

    }
        const token = jwt.sign({ _id: user._id }, "oneTwo");

        res.cookie("authToken", token, {
            httpOnly: true,
            expires: new Date(Date.now() + 60 * 1000),
        });

        return res.redirect("/authIn");
    
});

/*
app.post('/authLogin', async (req, res) => {
    const { email, password } = req.body;
    console.table(req.body);

    // Find the user by email
    const user = await info.findOne({ email });

    // Check if the user exists
    if (!user) {
        return res.redirect('/register'); // or handle the error accordingly
    }

    // Compare the hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);

    // If passwords match, generate JWT token and set cookie
    if (passwordMatch) {
        const token = jwt.sign({ _id: user._id }, "oneTwo");
        console.table([password,user.password])
        res.cookie('authToken', token, {
            httpOnly: true,
            expires: new Date(Date.now() + 30 * 1000) 
        });
        return res.redirect('/authIn');
    } else {
        // Handle incorrect password
        return res.redirect('/authLogin'); // or handle the error accordingly
    }
    
});
*/

Router.get('/authIn',isAuthenticated,(req,res)=>{
    res.render('authSecret',{email:req.user.email})
})

Router.get("/authout",(req,res)=>{
    res.cookie("authToken", null, {
        httpOnly: true,
        expires: new Date(Date.now())
      });
    res.redirect("/authLogin");
})

export default Router;
