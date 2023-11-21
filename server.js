import express from 'express'
import morgan from 'morgan'

const app = express();

app.set('view engine','ejs')
app.use(morgan('common'))
app.use(express.urlencoded({extended:true}))

app.get('/',(req,res)=>{
    res.send('hey')
});

app.get('/pg1',(req,res)=>{
    res.render('page1')
})

app.post('/pg1',(req,res)=>{
    res.redirect('/')
    console.log(req.body)
})

app.listen(3000,()=>{
    console.log('Running on 3000')
});