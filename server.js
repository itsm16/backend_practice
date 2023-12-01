import express from 'express'
import morgan, { token } from 'morgan'
import dotenv from 'dotenv'
dotenv.config();
import cookieParser from 'cookie-parser';
import info from './models/info.models.js'

const app = express();
const PORT = process.env.PORT;

app.set('view engine','ejs');
//app.use(express.static(path.join(__dirname, 'public')));  // import path , Serve html/static files from the 'public' directory 
//app.use(express.static("public")); //CSS
app.use(morgan('common'));
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

// custom middlewares 
app.use((req,res,next)=>{
    console.log("Request method: ",req.method);
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
    res.render('logout')
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
