import express from 'express'
import morgan from 'morgan'
import dotenv from 'dotenv'
dotenv.config();
import cookieParser from 'cookie-parser';
import info from './models/info.models.js'

const app = express();
const PORT = process.env.PORT;

app.set('view engine','ejs');
app.use(morgan('common'));
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

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

app.get('/login',(req,res)=>{
    const {token} = req.cookies;
    console.log(req.cookies)
    if (token) {
        res.render('logout')
    } else {
        res.render('login');
    }
    
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
        expires: new Date(Date.now()+60*1000)
    });
    res.redirect('/login');
})

app.listen(PORT,()=>{
    console.log(`Running on ${PORT}`);
});
