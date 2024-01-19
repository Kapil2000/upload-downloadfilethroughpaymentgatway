const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');


const app =express();

const picSchema = new mongoose.Schema({
    picpath:String
    
})

const picModel = mongoose.model('picsdemo',picSchema);

const storage = multer.diskStorage({
    destination:function(req,file, cp){
        cp(null,'./public/uploads')
    },
    filename:function(req,file,cp){
        cp(null,file.originalname)
    }
})
const upload = multer({storage:storage})

DATABASE_URL = "mongodb://127.0.0.1:27017"
// mongoose.connect('mongodb://localhost:27017/pics',{useNewUrlParser:true})
// .then(()=>console.log('DB connected')).catch(err=>console.log('error',err));
const connectDB = async (DATABASE_URL) =>{
    try{
        const DB_OPTIONS = {
            dbName: "pics"
        }
        await mongoose.connect(DATABASE_URL, DB_OPTIONS)
        console.log('Connected Successfully to database...')
    }catch(error){
        console.log(error)
    }
}
connectDB(DATABASE_URL)
app.set('views',path.resolve(__dirname,'views'));
app.set('view engine','ejs');

const pathh = path.resolve(__dirname,'public');
app.use(express.static(pathh));
app.use(bodyParser.urlencoded({extended:false}));

app.get('/',(req,res)=>{
    picModel.find((err,data)=>{
        if(err){
            console.log(err)
        }else if(data.length>0){
            res.render('home',{data:data})
        }else{
            res.render('home',{data:{}})
        }
    })
})

// 
app.get('/dwld',(req,res)=>{
    picModel.find((err,data)=>{
        if(err){
            console.log(err)
        }else if(data.length>0){
            res.render('download',{data:data})
        }else{
            res.render('download',{data:{}})
        }
    })
})

app.post('/',upload.single('pic'),(req,res)=>{
    const x = 'uploads/'+req.file.originalname;
    const temp = new picModel({
        picpath:x
    })
    temp.save((err,data)=>{
        if(err){
            console.log(err)
        }
        res.redirect('/')
    })
})

app.get('/download/:id',(req,res)=>{
    picModel.find({_id:req.params.id},(err,data)=>{
        if (err) {
            console.log(err)
        } else {
            const x = __dirname+'/public/'+data[0].picpath;
            res.download(x)
        }
    })
})

const port = process.env.PORT || 3000;
app.listen(port,()=>console.log('Server running at port '+port));