var express =require ('express');

var app=new express();

var fs=require('fs')

//ejs模板引擎,不需要引入，直接用
app.set('view engine','ejs')

//配置public目录为静态资源目录
app.use(express.static('public'))

app.use('/upload',express.static('upload'))

//multiparty中间件，既可以获取form表单数据，也可以实现上传图片
// var bodyParser=require('body-parser')
// app.use(bodyParser.urlencoded({extended:false}))
// app.use(bodyParser.json())
var multiparty=require('multiparty')


//连接数据库，数据库操作，安装mongodb
import {DbFind,DbInsert,DbUpdata,DbDeleteOne,ObjectID} from "./modules/db"

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
    // if(req.url=='/login' || req.url=='/doLogin'){
    //     next()
    // }else{
    //     if(req.session.userInfo && req.session.userInfo.username!=''){

    //         //ejs中设置全局数据，所以页面都可以使用
    //         app.locals['userInfo']=req.session.userInfo

    //         next()
    //     }else{
    //         res.redirect('/login')
    //     }
    // }
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

    DbFind('user',req.body,function(error,data){
        console.log(data)
        if(data.length>0){
            console.log('登录成功')

            //保存用户信息
            req.session.userInfo=data[0]

            res.redirect('/product')
        }else{
            console.log('登录失败 ')
        }
    })

})

//商品
app.get('/product',function(req,res){

    //连接数据库，查询数据
    DbFind('product',{},function(error,data){
        console.log(data)

        //将数据渲染到模板
        res.render('product',{
            list:data
        })
    })

})

//增加商品
app.get('/productAdd',function(req,res){ 
    res.render('productAdd')
})

//获取表单提交的数据以及post过来的图片
app.post('/doProductAdd',function(req,res){ 
    var form =new multiparty.Form()

    form.uploadDir='upload'; //上传图片保存的地址，目录必须存在

    form.parse(req,function(err,fields,files){
        console.log(fields) //获取表单的数据
        console.log(files)  //图片上传成功返回的地址信息

        var title=fields.title[0]
        var price=fields.price[0]
        var fee=fields.fee[0]
        var description=fields.description[0]
        var pic=files.pic[0].path

        DbInsert('product',{
            title,
            price,
            fee,
            description,
            pic
        },function(err,data){
            if(!err){
                res.redirect('/product')
            }
        })
    })
})

//编辑商品
app.get('/productEdit',function(req,res){

    var id=req.query.id;

    DbFind('product',{"_id":new ObjectID(id)},function(err,data){
        res.render('productEdit',{
            list:data[0]
        })
    })
    
})

//执行修改商品的路由
app.post('/doProductEdit',function(req,res){
    var form =new multiparty.Form()

    form.uploadDir='upload'; //上传图片保存的地址，目录必须存在

    form.parse(req,function(err,fields,files){
        console.log(fields) //获取表单的数据
        console.log(files)  //图片上传成功返回的地址信息

        var _id=fields._id[0]
        var title=fields.title[0]
        var price=fields.price[0]
        var fee=fields.fee[0]
        var description=fields.description[0]

        var originalFilename=files.pic[0].originalFilename
        var pic=files.pic[0].path
        if(originalFilename){
            var setData={
                title,
                price,
                fee,
                description,
                pic
            }
        }else{
            var setData={
                title,
                price,
                fee,
                description
            }
            //删除生成的临时文件
            fs.unlink(pic)
        }


        DbUpdata('product',{"_id":new ObjectID(id)},setData,function(err,data){
            if(!err){
                res.redirect('/product')
            }
        })
    })
    
})

//删除商品
app.get('/productDelete',function(req,res){
    var id=req.query.id

    DbDeleteOne('product',{"_id":new ObjectID(id)},function(err,data){
        if(!err){
            res.redirect('/product')
        }
    })
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