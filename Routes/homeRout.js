const express = require('express'); 
const router = express.Router();
const passport = require('passport');
const {checkAuth} =require('../middleware/checkAuth');



const User = require('../Models/userModel');
const Server = require('../Models/serverModel');
const Router = require('../Models/router');
const Schema = require('../Models/schemaModel');
const Sub = require('../Models/subRout');



router.get('/home',async(req,res)=>{
    const currentUser = await User.findById(req.user._id).populate('server');
    res.render('home',{currentUser});
})

router.post('/createserver/new',async(req,res)=>{
    
    const {name} = req.body;

    if(name.indexOf(' ')>=0)
    {
        req.flash('error_msg','Servername should not contain spaces');
        res.redirect('/home');
    }
    else{
        const serverFind = await Server.findOne({name});

        if(!serverFind)
        {
        const server = new Server({name : req.body.name});
        await server.save();
        const currentUser = await User.findById(req.user._id);
        currentUser.server = currentUser.server.concat(server._id);  
        await currentUser.save();
        res.redirect(`/servershow/${server._id}`);
        }
        else{
            req.flash('error_msg','Servername already taken');
            res.redirect('/home');
        }
    }



})

router.get('/servershow/:id',async(req,res)=>{

    const currentUser = await User.findById(req.user._id);
    const server = await Server.findById(req.params.id).populate('routers').populate('data');
    res.render('serverShow',{server,currentUser});


})


router.get('/createrouter/:id',async(req,res)=>{

    const currentUser = await User.findById(req.user._id);
    const server = await Server.findById(req.params.id);
    res.render('createRouter',{currentUser,server});

})

router.post('/createrouter/:id',async(req,res)=>{

    const currentUser = await User.findById(req.user._id);
    const server = await Server.findById(req.params.id).populate('routers');
    const {name,type} = req.body;

    if((req.body.name).indexOf(' ')>=0)
    {
        req.flash('error_msg','Routername should not contain spaces');
        res.redirect(`/createrouter/${server._id}`);
    }
    else{
        let flg=0;
        for(r of server.routers)
        {
            if(r.name==(req.body.name) && r.type==(req.body.type) )
            {
                flg++;
                req.flash('error_msg','Router already taken');
                res.redirect(`/createrouter/${server._id}`);
            }
        }
        if(flg==0)
        {
            const router = new Router({name,type,server:req.params.id});
            await router.save();
            server.routers = server.routers.concat(router._id);
            await server.save();
            res.redirect(`/servershow/${server._id}`);
        }


    }
    

})


// router show

router.get('/router/show/:serverid/:routerid',async(req,res)=>{

    const currentUser = await User.findById(req.user._id);
    const server = await Server.findById(req.params.serverid);
    const router = await Router.findById(req.params.routerid).populate('sub');
    res.render('routerShow',{router,server});

})


//json from router

router.post('/routerresponse/send/:id/:sid',async(req,res)=>{

    const currentUser = await User.findById(req.user._id);
    const router = await Router.findById(req.params.id);
    const server = await Server.findById(req.params.sid);
    router.send = req.body.send;
    router.save();
    res.redirect(`/router/show/${server._id}/${router._id}`);


})

router.get('/routerdelete/:rid/:sid',async(req,res)=>{
    const router = await Router.findByIdAndDelete(req.params.rid);
    const server = await Server.findById(req.params.sid);
    let s = server.routers.indexOf(req.params.rid);
    server.routers.splice(s,-1);
    server.save();
    res.redirect(`/servershow/${server._id}`);

})



router.get('/createschema/:sid',async(req,res)=>{

    const server = await Server.findById(req.params.sid);
    res.render('createSchema',{server});

})

router.post('/createmodel/:sid',async(req,res)=>{

    const currentUser = await User.findById(req.user._id);
    const server = await Server.findById(req.params.sid).populate('data');
    const {name} = req.body;

    if((req.body.name).indexOf(' ')>=0)
    {
        req.flash('error_msg','Model name should not contain spaces');
        res.redirect(`/createschema/${server._id}`);
    }
    else{
        let flg=0;
        for(r of server.data)
        {
            if(r.name==(req.body.name))
            {
                flg++;
                req.flash('error_msg','Model name already taken');
                res.redirect(`/createschema/${server._id}`);
            }
        }
        if(flg==0)
        {
            
            const model = new Schema(req.body);
            await model.save();
            server.data = server.data.concat(model._id);
            await server.save();
            res.redirect(`/servershow/${server._id}`);

        }


    }

})


router.get('/model/show/:serverid/:modelid',async(req,res)=>{

    const currentUser = await User.findById(req.user._id);
    const server = await Server.findById(req.params.serverid);
    const model = await Schema.findById(req.params.modelid);
    res.render('schemaShow',{model,server});

})


router.get('/model/delete/:mid/:sid',async(req,res)=>{
    const currentUser = await User.findById(req.user._id);
    const server = await Server.findById(req.params.sid);
    const model = await Schema.findByIdAndDelete(req.params.mid);
    let s = server.data.indexOf(req.params.mid);
    server.data.splice(s,-1);
    server.save();
    res.redirect(`/servershow/${server._id}`);
})

router.post('/subcreate/:rid/:sid',async(req,res)=>{

    const router = await Router.findById(req.params.rid);
    const server = await Server.findById(req.params.sid);
    const sub = new Sub(req.body);
    await sub.save();
    router.sub = router.sub.concat(sub._id);
    router.save();
    res.redirect(`/router/show/${server._id}/${router._id}`);

})

router.get('/subdelete/:subid/:rid/:sid',async(req,res)=>{
    
    const router = await Router.findById(req.params.rid);
    const server = await Server.findById(req.params.sid);
    const sub = await Sub.findByIdAndDelete(req.params.subid);
    let s = router.sub.indexOf(req.params.subid);
    router.sub.splice(s,-1);
    router.save();
    res.redirect(`/router/show/${server._id}/${router._id}`);

})




module.exports = router;