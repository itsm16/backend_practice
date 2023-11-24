import express from 'express'
import morgan from 'morgan'
import mongoose from 'mongoose'

const app = express();

app.set('view engine','ejs')
app.use(morgan('common'))
app.use(express.urlencoded({extended:true}))

mongoose.connect('mongodb://127.0.0.1:27017',({
    dbName:'Backend'
}))
.then(()=> console.log('Database Connected'))
.catch((e) => console.log(e))

const infoSchema = new mongoose.Schema({
    email:String,
    password:String
})

const info = mongoose.model('info',infoSchema) // info is used as collection name , infos collection in database gets created

const userInfo = [];

app.get('/',(req,res)=>{
    res.send('hey')
});

app.get('/getInfo',(req,res)=>{
    res.render('getInfo')
})

app.post('/infoPg',(req,res)=>{
    const {email,password} = req.body;
    console.table(req.body)
    userInfo.push(req.body)
    info.create({email,password})
    res.redirect('/info')
    
})

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

app.listen(3000,()=>{
    console.log('Running on 3000')
});
