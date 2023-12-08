import express from 'express'
import morgan, { token } from 'morgan'
import dotenv from 'dotenv'
dotenv.config();
import cookieParser from 'cookie-parser';
import info from './models/info.model.js'
import connectDb from './db/db.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

// Database
connectDb();

const app = express();
const PORT = process.env.PORT;

app.set('view engine','ejs');
app.use(morgan('dev'));
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

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
        res.render('authLogin')
    }
}

const userInfo = [];

app.get('/',(req,res)=>{
    res.send('hey');
});


// Register User

app.get("/register",(req,res)=>{
    res.render("register")
})

app.post("/register",async (req,res)=>{
    const {email,password} = req.body;
    const hashedPassword = await bcrypt.hash(password,10)
    const existingUser = await info.findOne({ email });

    if (existingUser) {
        return res.redirect("/authLogin");
    } else {
        await info.create({email,password : hashedPassword})
        res.redirect("/info")
    }
    
})

app.get('/authLogin',isAuthenticated,(req,res)=>{
    console.log(req.user) //created in isAuthenticated
    res.render('authSecret',{email : req.user.email})
})

app.post('/authLogin',async (req,res)=>{
    const {email,password} = req.body;
    console.table(req.body);
    //const user = await info.create({email,password});
    const user = await info.findOne({email,password})

     if (user==req.user) {
        const token = jwt.sign({_id : user._id},"oneTwo")
        res.cookie('authToken',token,{   
            httpOnly:true,
            expires: new Date(Date.now()+30*1000)
        })
        res.redirect('/authLogin')
     } else {
        res.redirect("/register")
     }

    //sign method takes a secret
    //user's id(written as user._id) is provided with secret to sign method
    //token is passed as value in res.cookie method
    console.log(token);
})

app.get('/authout',(req,res)=>{
    res.cookie('authToken',null,{
        httpOnly:true,
        expires: new Date(Date.now())
    })
    res.redirect('/authLogin')
})

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

app.get('/logout',(req,res)=>{
    res.cookie('token',null,{
        httpOnly:true,
        expires: new Date(Date.now())
    })
    
    res.redirect('/login');
})

app.post('/login',(req,res)=>{
    res.cookie('token','iamIn',{
        httpOnly:true,
        expires: new Date(Date.now()+30*1000)
    });
    res.redirect('/login');
})

app.listen(PORT,()=>{
    console.log(`Running on ${PORT}`);
});
