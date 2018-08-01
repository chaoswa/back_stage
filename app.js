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
// 1.启动mongodb服务，mongod --dbpath F:\mongodb;
// 2.连接mongodb数据库，mongo
var MongoClient=require('mongodb').MongoClient
const DbUrl="mongodb://localhost:27017"
const dbName = 'productmanage';

//session中间件保存用户信息
var session = require('express-session')
app.use(session({
    secret:'this is string key',
    resave:false,
    saveUninitialized:true,
    cookie:{maxAge:1000*60*30},
    rolling:true
}))


//自定义中间件，判断登录状态
app.use(function(req,res,next){
    console.log(req.url)
    if(req.url=='/login' || req.url=='/doLogin'){
        next()
    }else{
        if(req.session.userInfo && req.session.userInfo.username!=''){

            //ejs中设置全局数据，所以页面都可以使用
            app.locals['userInfo']=req.session.userInfo

            next()
        }else{
            res.redirect('/login')
        }
    }
})





/******************* 配置路由**************************/
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

                //保存用户信息
                req.session.userInfo=data[0]

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

    //连接数据库，查询数据
    MongoClient.connect(DbUrl,{useNewUrlParser:true},function(err,client){
        if(err){
            console.log(err);
            return;
        }
        const db=client.db(dbName)
        var result=db.collection('product').find()
        result.toArray(function(error,data){
            if(error){
                console.log(err);
                return;
            }
            console.log(data)//得到查询的数据
            //sadfs
            //将数据渲染到模板
            res.render('product',{
                list:data
            })
        })
    })

    
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

//退出登录
app.get('/loginOut',function(req,res){
    //销毁session
    req.session.destroy(function(err){
        if(err){
            console.log(err)
        }else{
            res.redirect('/login')
        }
        
    })
})

app.listen(3000,'127.0.0.1')