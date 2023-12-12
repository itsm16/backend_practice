import express from 'express'
import morgan from 'morgan'
import dotenv from 'dotenv'
dotenv.config();
import cookieParser from 'cookie-parser';
import info from './models/info.model.js'
import connectDb from './db/db.js'
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

const userInfo = [];

app.get('/',(req,res)=>{
    res.send('hey');
});

app.get("/api/get",(req,res)=>{
    res.send(
        "Route : /api/get"
    )
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
