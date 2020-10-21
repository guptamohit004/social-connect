import"firebase/messaging";
import firebase from "firebase/app";
import localforage from"localforage";
import {sendPushTokenServer} from './auth';

const firebaseCloudMessaging = {
	//checking whether token is available in indexed DB
	tokenInlocalforage: async () =>
	{
		return localforage.getItem("fcm_token");
	},
	//initializing firebase app
	init: async function ()
	{
		if (!firebase.apps.length)
		{
			firebase.initializeApp(
			{
                    apiKey: "AIzaSyDsKYfDD9snfFnrCOG2CKp8xClVb_5Ay7E",
                    authDomain: "dsc-aura.firebaseapp.com",
                    databaseURL: "https://dsc-aura.firebaseio.com",
                    projectId: "dsc-aura",
                    storageBucket: "dsc-aura.appspot.com",
                    messagingSenderId: "904550820845",
                    appId: "1:904550820845:web:dc711ef8eb1dbca41595e4"
			});
			try
			{
				const messaging = firebase.messaging();
				const tokenInLocalForage = await this.tokenInlocalforage();
				//if FCM token is already there just return the token
				if (tokenInLocalForage !== null)
				{
					return tokenInLocalForage;
				}
				//requesting notification permission from browser
				const status = await Notification.requestPermission();
				if (status && status === "granted")
				{
					//getting token from FCM
                    const fcm_token = await messaging.getToken();
                    if (fcm_token)
					{
						//setting FCM token in indexed db using localforage
						localforage.setItem("fcm_token", fcm_token);
						if ("serviceWorker" in navigator) {
							var options = {
							  title: "Successfully Subscribed",
							  body:"Successfully Subscribed to Receive notification from Social Connect",
							  icon: "favicon-32x32.png",
							  image: "https://www.violinschool.com/wp-content/uploads/2017/10/Nature-Amazing-Grace-600px-400px.jpg",
							  vibrate: [200, 100, 200]
							};
							navigator.serviceWorker.ready.then(function(swreg) {
							  swreg.showNotification("Successfully Subscribed", options);
							});
						  }
						//return the FCM token after saving it
						sendPushTokenServer(fcm_token);
						return fcm_token;
					}
				}
			}
			catch (error)
			{
				console.error(error);
				return null;
			}
		}
	},
};
export
{
	firebaseCloudMessaging
};