import logo from './logo.svg';
import "./OpenVidu/openvidu-webcomponent-2.24.0"
import "./OpenVidu/openvidu-webcomponent-2.24.0.css"
import "./OpenVidu/openvidu-browser-2.24.0"
import axios from "axios";
import {useEffect, useState} from "react";
import async from "async";



function App (){

    useEffect(() =>{
        const webComponent = document.querySelector('openvidu-webcomponent');
        console.log(webComponent);
        webComponent.addEventListener('onSessionCreated', (event) =>{
            const session = event.detail;
            session.on('connectionCreated', (e) => {
                console.log("connectionCreated", e);
            });

            session.on('streamDestroyed', (e) => {
                console.log("streamDestroyed", e);
            });

            session.on('streamCreated', (e) => {
                console.log("streamCreated", e);
            });

            session.on('sessionDisconnected', (event) => {
                console.warn("sessionDisconnected event");
                webComponent.style.display = 'none';
            });

            session.on('exception', (exception) => {
                console.error(exception);
            });
        });

        webComponent.addEventListener('onJoinButtonClicked', (event) => { });
        webComponent.addEventListener('onToolbarLeaveButtonClicked', (event) => { });
        webComponent.addEventListener('onToolbarCameraButtonClicked', (event) => { });
        webComponent.addEventListener('onToolbarMicrophoneButtonClicked', (event) => { });
        webComponent.addEventListener('onToolbarScreenshareButtonClicked', (event) => { });
        webComponent.addEventListener('onToolbarParticipantsPanelButtonClicked', (event) => { });
        webComponent.addEventListener('onToolbarChatPanelButtonClicked', (event) => { });
        webComponent.addEventListener('onToolbarFullscreenButtonClicked', (event) => { });
        webComponent.addEventListener('onParticipantCreated', (event) => { });


    },[])


    async function createToken(sessionId) {
        console.log("Start createToken " + sessionId)
        const config = {
            method: 'post',
            url: 'http://localhost:4443/openvidu/api/sessions/' + sessionId + '/connection',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + btoa('OPENVIDUAPP:' + 'MY_SECRET'),
            }
        };

        const res = await axios(config)

        return res.data
    }



    async function getToken(sessionId) {
        const id = await createSession(sessionId);
        return createToken(sessionId);

    }

     async function joinSession() {
        debugger
         const sessionId = "AAA-BBB-CCC";


         console.warn('SESSION ID', sessionId);

         var promiseResults = await Promise.all([getToken(sessionId), getToken(sessionId)]);

         console.warn('promiseResults', promiseResults);

         var tokens = {webcam: promiseResults[0], screen: promiseResults[1]};

         var webComponent = document.querySelector('openvidu-webcomponent');
         webComponent.tokens = tokens;
     }

     function createSession(sessionId) {
        console.log("createSession ",sessionId)
        const data = JSON.stringify({
            "customSessionId": sessionId
        });

        const config = {
            method: 'post',
            url: 'http://localhost:4443/openvidu/api/sessions',
            headers: {
                'Content-Type': 'application/json',
                'Authorization':'Basic ' + btoa('OPENVIDUAPP:'+'MY_SECRET'),
            },
            data: data
        };

         axios(config)
            .then(function (response) {
                console.log(response.data);
                return response.data
            })
            .catch(function (error) {
                console.log(error);
            });

    }

    return (
      <>
          <input type={"button"} value={"Join"} onClick={joinSession}/>
    <openvidu-webcomponent style={{height:"100%"}}></openvidu-webcomponent>
      </>
  )
}

export default App;
