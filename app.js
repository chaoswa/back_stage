var express =require ('express');

var app=new express();

//ejs模板引擎,不需要引入，直接用
app.set('view engine','ejs')

//配置public目录为静态资源目录
app.use(express.static('public'))

//body-parser中间件，获取post数据
var bodyParser=require('body-parser')
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())


//连接数据库，数据库操作，安装mongodb
var MongoClient=require('mongodb').MongoClient
var DbUrl=


app.get('/',function(req,res){
    res.send('index')
})

//登录
app.get('/login',function(req,res){
    res.render('login')
})

//获取登录提交的数据
app.post('/doLogin',function(req,res){
    console.log(req.body) //body-parser中间件，获取post提交数据
})

//商品
app.get('/product',function(req,res){
    res.render('product')
})

//增加商品
app.get('/productAdd',function(req,res){
    res.render('productAdd')
})

//编辑商品
app.get('/productEdit',function(req,res){
    res.render('productEdit')
})

//删除商品
app.get('/productDelete',function(req,res){
    res.send('productDelete')
})

app.listen(3000,'127.0.0.1')