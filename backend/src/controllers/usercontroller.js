import httpStatus from "http-status";
import bcrypt ,{hash} from "bcrypt";
import { UserVedio } from "../models/user.model.js";
import crypto from "crypto"

import { Meeting } from "../models/meeting.model.js";

const login = async(req,res)=>{
    const {username, password} = req.body;

    if(!username || !password){
        return res.status(400).json({message:"invalid username or password"});
    }
    try{
        const user = await UserVedio.findOne({username});

        if(!user){
            return res.status(httpStatus.NOT_FOUND).json({message:" User not found"});
        }

        let isPasswordCorrect = await bcrypt.compare(password,user.password);

        if(isPasswordCorrect){
            let token = crypto.randomBytes(20).toString("hex");

            user.token = token;
            await user.save();
            return res.status(httpStatus.OK).json({token:token});
        }else{
            return res,status(httpStatus.UNAUTHORIZED).json({message:"invalid username or password"});
        }

    }catch(err){
        return res.status(500).json({message:`something went wrong ${err}`});

    }
}

const register = async(req,res)=>{
    const {username, email,password} = req.body;

    try{
        const findUser = await UserVedio.findOne({username});
        if(findUser){
            return res.status(httpStatus.FOUND).json({
                message:"User already Exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password,10);


        const newUser = new UserVedio({
            name: name,
            username: username,
            password: hashedPassword
        })
        await newUser.save();

        res.status(httpStatus.CREATED).json({message:"User Registered successfully"});
        
    }catch(err){
        res.json({message:`Something went wrong ${err}`});
    }
}

const getUserHistory = async(req,res) =>{
    let { token } = req.query;
    try{
        const user = await UserVedio.findOne({token : token});
        const meetings = await Meeting.find({user_id : user.username});
        res.json(meetings);
    }catch(err){
        res.json({message:`Something went wrong ${err}`});
    }
}

const addToHistory = async(req,res) => {
    const {token, meeting_code} = req.body;
    try{
        const user = await UserVedio.findOne({token:token});
        const newMeeting = new Meeting({
            user_id:user.username,
            meetingCode:meeting_code
        })

        await newMeeting.save();
        res.status(httpStatus.CREATED).json({message:"Added code to History"});
    }catch(err){
        res.json({message:`something went wrong ${err}`});
    }
}


export{login,register, getUserHistory,addToHistory};