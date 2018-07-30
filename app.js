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
const DbUrl="mongodb://localhost:27017"
const dbName = 'productmanage';
// 1.启动mongodb服务，mongod --dbpath F:\mongodb;
// 2.连接mongodb数据库，mongo




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

    MongoClient.connect(DbUrl,{useNewUrlParser:true},function(err,client){/*连接数据库*/
        if(err){
            console.log(err);
            return;
        }
        const db=client.db(dbName)

        var result=db.collection('user').find(req.body)
        //遍历数据
        result.toArray(function(err,data){
            console.log(data)
            if(data.length>0){
                console.log('登录成功')
                res.redirect('/product')
            }else{
                console.log('登录失败 ')
            }
            client.close()
        })

    })

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