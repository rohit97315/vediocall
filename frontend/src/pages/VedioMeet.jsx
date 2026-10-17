import React, { useEffect, useRef, useState } from 'react'
import io from "socket.io-client";
import { Badge, IconButton, TextField } from '@mui/material';
import { Button } from '@mui/material';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff'
import styles from "../styles/videoComponent.module.css";
import CallEndIcon from '@mui/icons-material/CallEnd'
import MicIcon from '@mui/icons-material/Mic'
import MicOffIcon from '@mui/icons-material/MicOff'
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import StopScreenShareIcon from '@mui/icons-material/StopScreenShare'
import ChatIcon from '@mui/icons-material/Chat'
import server from '../environment.js';



const server_url = server;

const connections ={};

const peerConfigConnections = {
    "iceServers":[
        {"urls":"stun:stun.l.google.com:19302"}
    ]
}




export default function VedioMeetComponent() {

    var socketRef = useRef();
    let socketIdRef = useRef();

    let localVideoref = useRef();

    let [videoAvailable, setVideoAvailable] = useState(true);

    let [audioAvailable, setAudioAvailable] = useState(true);

    let [video, setVideo] = useState([]);

    let [audio, setAudio] = useState();

    let [screen, setScreen] = useState();

    let [showModal, setModal] = useState(true);

    let [screenAvailable, setScreenAvailable] = useState();

    let [messages, setMessages] = useState([])

    let [message, setMessage] = useState("");

    let [newMessages, setNewMessages] = useState(3);

    let [askForUsername, setAskForUsername] = useState(true);

    let [username, setUsername] = useState("");

    const videoRef = useRef([])

    let [videos, setVideos] = useState([])


    useEffect(() => {
        console.log("get Permissions");
        getPermissions();
    },[])

    let getDisplayMedia = () => {
        if(screen){
            if(navigator.mediaDevices.getDisplayMedia){
                navigator.mediaDevices.getDisplayMedia({video:true,audio:true})
                .then(getDisplayMediaSuccess)
                .then((stream)=>{})
                .catch((e) => console.log(e))
            }
        }
    }


    const getPermissions = async() => {
        try{

            const videoPermission = await navigator.mediaDevices.getUserMedia({video:true});
            if(videoPermission){
                setVideoAvailable(true);
                console.log("video permission granted");
            }else{
                setVideoAvailable(false);
                console.log("video permission denied");
            }


            const audioPermission = await navigator.mediaDevices.getUserMedia({audio:true});
            if(audioPermission){
                setAudioAvailable(true);
                console.log("audio permission granted");
            }else{
                setAudioAvailable(false);
                console.log("audio permission denied");
            }

            if (navigator.mediaDevices.getDisplayMedia) {
                setScreenAvailable(true);
            } else {
                setScreenAvailable(false);
            }

            if(videoAvailable || audioAvailable){
                const userMediaStream = navigator.mediaDevices.getUserMedia({video:videoAvailable, audio:audioAvailable});
                if(userMediaStream){
                    window.localStream = userMediaStream;
                    if(videoRef.current){
                        videoRef.current.srcObject = userMediaStream;
                    }
                }
            }

        }catch(e){
            console.log(e);
        }
    }


    useEffect(() => {
        if(video !== undefined && audio !== undefined){
            getUserMedia();
            console.log("setstate has ",video,audio);
        }
    },[video,audio])

    let getMedia = () => {
        setVideo(videoAvailable);
        setAudio(audioAvailable);
        connectToSocketServer();
    }

    let getUserMediaSuccess = (stream) => {
        try{
            window.localStream.getTracks().forEach(track => track.stop());
        }catch(e){
            console.log(e);
        }

        window.localStream = stream;
        localVideoref.current.srcObject = stream;

        for(let id in connections){
            if(id === socketIdRef.current) continue;

            // connections[id].addTrack(window.localStream).   -> this way is deprecated

            window.localStream.getTracks().forEach(track => {
                connections[id].addTrack(track, window.localStream);
            });

            connections[id].createOffer().then((description) => {
                console.log(description);
                connections[id].setLocalDescription(description)
                .then(() => {
                    socketRef.current.emit('signal',id,JSON.stringify({'sdp':connections[id].localDescription}))
                })
                .catch((e) => console.log(e))
            })

        }


        stream.getTracks().forEach(track => track.onended =()=> {
            setVideo(false);
            setAudio(false);

            try{
                let tracks = localVideoref.current.srcObject.getTracks();
                tracks.forEach(track => track.stop());
            }catch(e){
                console.log(e);
            }
            let blackSilence = (...args) => new MediaStream([black(...args),silence()]);
            window.localStream = blackSilence();
            localVideoref.current.srcObject = window.localStream;


            for (let id in connections) {
                window.localStream.getTracks().forEach(track => {
                connections[id].addTrack(track, window.localStream);
                });

    
                connections[id].createOffer().then((description) => {
                    connections[id].setLocalDescription(description)
                    .then(() => {
                        socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }))
                    })
                    .catch(e => console.log(e))
                })
            }

        })
    }


    let getUserMedia = () => {
        if((video && videoAvailable) || (audio && audioAvailable)){
            navigator.mediaDevices.getUserMedia({video:video,audio:audio})
            .then(getUserMediaSuccess)
            .then((stream) => { })
            .catch((e) => console.log(e))
        }else{
            try{
                let tracks = localVideoref.current.srcObject.getTracks();
                tracks.forEach(track => track.stop());
            }catch(e){
                console.log(e);
            }
        }
    }
    





  return (
    <div>
      <h1>VedioMeet</h1>
    </div>
  )
}
