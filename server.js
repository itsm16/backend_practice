import express from 'express'
import mongoose from 'mongoose';
import morgan from 'morgan'

const app = express();

app.set('view engine','ejs')
app.use(morgan('common'))
app.use(express.urlencoded({extended:true}))

mongoose.connect('mongodb://127.0.0.1:27017',({
    dbName:'backend'
}))
.then(()=> console.log('connected'))
.catch((e) => console.log(e))

const infoSchema = new mongoose.Schema({
    email:String,
    password:String
}
)

const info = mongoose.model('info',infoSchema)

const userInfo = [];

app.get('/',(req,res)=>{
    res.send('hey')
});

app.get('/add',(req,res)=>{
    info.create({email:'k',password:'k'})
    .then(()=>{
        res.send('Sent')
    })
})

app.get('/getInfo',(req,res)=>{
    res.render('getInfo')
})

app.get('/info',(req,res)=>{
    res.send(userInfo)
})

app.post('/pg1',(req,res)=>{
    console.log(req.body)
    userInfo.push(req.body)
    info.create({email:req.body.email,password:req.body.password})
    .then(()=>res.redirect('/info'))    
})

app.listen(3000,()=>{
    console.log('Running on 3000')
});
