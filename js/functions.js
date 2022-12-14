import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.3/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.9.3/firebase-analytics.js";
import { getFirestore, doc, setDoc, updateDoc, increment,collection,getDocs,query,where  } from "https://www.gstatic.com/firebasejs/9.9.3/firebase-firestore.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCrMW9wVcTiM7rNEOY_zmAhFUOqfZf0eNU",
  authDomain: "hjan-dice.firebaseapp.com",
  projectId: "hjan-dice",
  storageBucket: "hjan-dice.appspot.com",
  messagingSenderId: "234654562752",
  appId: "1:234654562752:web:b9792c7344beb35e1c7025",
  measurementId: "G-3K1894JGHX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const db = getFirestore(app);

/*
export async function LoadContents(doc_id) {
  const docRef = doc(db, "alpha2-1", doc_id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    document.getElementById('background').innerHTML = docSnap.data().html
    AddClickEvent()
  } else {
    console.log("No such document!");
  }

}
*/



export async function Send(dic, callback) {
  let loader = document.getElementById('loader')
  if (loader) {
    loader.style.display = 'block'
  }
  if (dic['method'] == 'add') {
    let warns = {
      'a': dic['warning'].includes('a'),
      'b': dic['warning'].includes('b'),
      'c': dic['warning'].includes('c'),
    }


    const ref = doc(db, 'main', dic['elm']);
    await updateDoc(ref, {
      vote: increment(Number(dic['vote_num'])),
      uv: increment(1),
      degree: Number(dic['degree']),
      warns: warns,
    }).then(callback()).catch(async err => {
      await setDoc(ref, {
        vote: Number(dic['vote_num']),
        uv: 1,
        degree: Number(dic['degree']),
        warns: warns,
        room: dic['room'],
      }).then().catch(err => console.log(err));

    }
    );
  }else if(dic['method']=='pick'){
    let querySnapshot = null
    if(!dic["room"]){
      dic["room"]="default"
    }
    querySnapshot = await getDocs(query(collection(db, "main"), where("room", "==", dic['room'])));

    let L=[]
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      let d=doc.data()
      d['elm']=doc.id
      L.push(d)
    });
    console.log(L)
    callback(L)
    
  }else if(dic['method']=='fix'){
    window.alert('??????????????????')
    let loader=document.getElementById('loader')
    if (loader){
        loader.style.display='none'
    }
  }else if(dic['method']=='delete'){
    window.alert('??????????????????')
    let loader=document.getElementById('loader')
    if (loader){
        loader.style.display='none'
    }
  }

}
