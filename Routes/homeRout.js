const express = require('express'); 
const router = express.Router();
const passport = require('passport');
const {checkAuth} =require('../middleware/checkAuth');



const User = require('../Models/userModel');
const Server = require('../Models/serverModel');
const Router = require('../Models/router');



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
    const server = await Server.findById(req.params.id).populate('routers');
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








module.exports = router;