const express = require('express');
const Item=require('../models/itemModel');
const User=require('../models/userModel');
const router=express.Router();
const methodOverride=require('method-override');
const { isLoggedin } = require('../views/middleware');
const { isAdmin } = require('../views/middleware');
const { isUser } = require('../views/middleware');
const catchAsync=require('../utils/catchAsync');
const app = express();
app.use(methodOverride('_method'));


router.get('/home',isLoggedin, catchAsync(async(req, res) => {
    const item=await Item.find({});
    const user1=await User.findById("610810be66380c80b8bc874f");
    const user2=await User.findById(req.user);
    const count=user1.countitem;
    const count1=user2.countbag;
    const user=req.user;
    res.render('index',{item,user,count,count1,user2});
}))
router.get('/details/:id',isLoggedin, catchAsync(async(req, res) => {
    const {id}=req.params;
    const user=req.user;
    const user2=await User.findById(req.user);
    const count1=user2.countbag;
    const item=await Item.findById(id).populate('user');
    res.render('details',{item,user,user2,count1});
}))

router.get('/additem',isLoggedin,isAdmin, catchAsync((req, res) => {
    const user=req.user;
  
    res.render('newItem',{user});
}))

router.post('/additem',isLoggedin,isAdmin, catchAsync(async (req, res) => {
    try{
    const item = new Item(req.body);
    const user=await User.findById(req.user);
    user.countitem=user.countitem+1;
    await user.save();
    await item.save();
  
    res.redirect('/home');
    }catch(e){
        req.flash('error','All are required fields');
        res.redirect('/additem');
    }
}))
router.get('/updateitem/:id',isLoggedin,isAdmin,catchAsync(async(req,res)=>{
    const {id}=req.params;
    const user=req.user;
    const item=await Item.findById(id);
    res.render('updateItem',{item,user});
}))
router.put('/updateitem/:id',isLoggedin,isAdmin,catchAsync(async(req,res)=>{
    const {id}=req.params;
    const item=await Item.findByIdAndUpdate(id,req.body,{runValidators:true,new:true}) ;
    res.redirect('/home');
}))
router.delete('/deleteitem/:id',isLoggedin,isAdmin,catchAsync(async(req,res)=>{
    const {id}=req.params;
    const item=await Item.findByIdAndDelete(id);
    const user=await User.findById(req.user);
    user.countitem=user.countitem-1;
    await user.save();
    res.redirect('/home');
}))

router.post('/buy',isLoggedin,isUser,catchAsync( async(req, res) => {
    const itemId=req.body.itemid;
    const user=await User.findById(req.user);
    user.countbag=user.countbag+1;
    await user.save();
    await User.updateOne({ username: `${req.user.username}` }, { $push : {"userarr" : itemId}});
    res.redirect('/myBag');
}))
router.get('/myBag',isLoggedin,isUser, catchAsync(async(req, res) => {
    let item=[],s=0;
    const user=req.user;
    const buyitems=await User.findById(req.user);
    const user1=await User.findById(req.user);
    const count=user1.countbag;
  
     try{
    for(let i of buyitems.userarr)
    {
        item[s++]=await Item.findById(i);
    }
 }catch(e){
     res.send("nothing added to My bag");
 }
    res.render('myBag',{item,user,count});
}))
router.delete('/deleteBag/:id',isLoggedin,isUser,catchAsync(async(req,res)=>{
    const {id}=req.params;
    const user=await User.findById(req.user);
    user.countbag=user.countbag-1;
    await user.save();
    await User.updateOne({username: `${req.user.username}`}, {$pull: { userarr: id }});
    res.redirect('/myBag');
}))

module.exports=router;


// for(let i=0;i<buyitems.userarr.length;i++)
// User.updateOne({ username: `${req.user.username}` }, { $push : {"userarr" : itemId}});