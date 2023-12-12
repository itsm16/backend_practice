import express, { Router } from 'express'
import morgan from 'morgan'
import dotenv from 'dotenv'
dotenv.config();
import cookieParser from 'cookie-parser';
import info from './models/info.model.js'
import connectDb from './db/db.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import userRouter from './routes/userRoutes.js'

// Database
connectDb();

const app = express();
const PORT = process.env.PORT;

app.set('view engine','ejs');
app.use(morgan('dev'));
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(userRouter);

// custom middlewares 
app.use((req,res,next)=>{
    console.log("Request URL: ",req.url);
    console.log("Request method: ",req.method);
    console.log("Request time: ",new Date(Date.now()).toISOString());
    next();
});

const isAuth = (req,res,next) => {
    const {token} = req.cookies;
    if (token) {
        next();
    } else {
        res.render('login');
    }
}

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

const userInfo = [];

app.get('/',(req,res)=>{
    res.send('hey');
});

app.get("/api/get",(req,res)=>{
    res.send(
        "Route : /api/get"
    )
})

// Register User - defined in routes

// Login User

app.get('/authLogin',(req,res)=>{
     //created in isAuthenticated
    // res.render('authSecret',{email : req.user.email})
    res.render('authLogin')
    
})


//sign method takes a secret
//     //user's id(written as user._id) is provided with secret to sign method
//     //token is passed as value in res.cookie method
//     console.log(token);


// app.post('/authLogin', async (req, res) => {
//     const { email, password } = req.body;
//     console.table(req.body);

//     // Find the user by email
//     const user = await info.findOne({ email });

//     // Check if the user exists
//     if (!user) {
//         return res.redirect('/register'); // or handle the error accordingly
//     }

//     // Compare the hashed password
//     const passwordMatch = await bcrypt.compare(password, user.password);

//     // If passwords match, generate JWT token and set cookie
//     if (passwordMatch) {
//         const token = jwt.sign({ _id: user._id }, "oneTwo");
//         console.table([password,user.password])
//         res.cookie('authToken', token, {
//             httpOnly: true,
//             expires: new Date(Date.now() + 30 * 60 * 1000) // set expiration to 30 minutes
//         });
//         return res.redirect('/authIn');
//     } else {
//         // Handle incorrect password
//         return res.redirect('/authLogin'); // or handle the error accordingly
//     }
    
// });

app.post("/authLogin", async (req, res) => {
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



app.get('/authIn',isAuthenticated,(req,res)=>{
    res.render('authSecret',{email:req.user.email})
})

app.get("/authout",(req,res)=>{
    res.cookie("authToken", null, {
        httpOnly: true,
        expires: new Date(Date.now())
      });
    res.redirect("/authLogin");
})


// Show Database Info
app.get('/getInfo',(req,res)=>{
    res.render('getInfo');
})

app.post('/infoPg',(req,res)=>{
    const {email,password} = req.body;
    console.table(req.body);
    userInfo.push(req.body);
    info.create({email,password});
    res.redirect('/info');
    
});

app.get('/info', (req, res) => {
  info.find()
    .then(entries => {
      res.send(JSON.stringify(entries));
    })
    .catch(error => {
      console.log(error);
      res.status(500).send('Internal Server Error');
    });
});

app.get('/login',isAuth,(req,res)=>{
    res.render('secret')    //action="/logout" action attribute in secret.ejs form is set to /logout
})

app.post('/login',(req,res)=>{
    res.cookie('token','iamIn',{
        httpOnly:true,
        expires: new Date(Date.now()+30*1000)
    });
    res.redirect('/login');
})

app.get('/logout', (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        expires: new Date(0) // Set the expiration date to a past date
    });

    res.redirect('/authLogin');
});

app.listen(PORT,()=>{
    console.log(`Running on ${PORT}`);
});
