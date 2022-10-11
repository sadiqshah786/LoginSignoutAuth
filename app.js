import { initializeApp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js";
import { getAuth, signOut, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js";



const firebaseConfig = {
    apiKey: "AIzaSyBt68qDIjM9fBMu1FWNSHVQxgEfcDfp6fI",
    authDomain: "chat-app786.firebaseapp.com",
    projectId: "chat-app786",
    storageBucket: "chat-app786.appspot.com",
    messagingSenderId: "1095003338480",
    appId: "1:1095003338480:web:939d70ad30b9102babf435",
    measurementId: "G-4TE7NXLBPG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);


// login details 
let signInEmail = document.getElementById('signInEmail');
let signInPassword = document.getElementById('signInPassword');
let loginBtn = document.getElementById('loginBtn');
let emailRegx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
let errors = document.getElementById('error');
let redirect = false;


// Signup details 
let firstName = document.getElementById('firstName');
let lastName = document.getElementById('lastName');
let sigupEmail = document.getElementById('sigupInEmail');
let signupPassword = document.getElementById('signupPassword');
let signupCPassword = document.getElementById('signupCPassword');
let signupBtn = document.getElementById('signupBtn')

// let loginBtn = document.getElementById('loginBtn');


if (signupBtn) {
    signupBtn.addEventListener("click", () => {
        if (firstName.value.trim() == "") {
            signupToast();
            errors.innerHTML = "Empty First Name feild";
        }
        else if (lastName.value.trim() == "") {
            signupToast();
            errors.innerHTML = "Empty Last Name feild";
        }
        else if (sigupEmail.value.trim() === "") {
            signupToast()
            errors.innerHTML = "Empty Email Feild";
        }
        else if (!emailRegx.test(sigupEmail.value)) {
            signupToast();
            errors.innerHTML = "Invalid Email";
        }
        else if (signupPassword.value.trim() === "") {
            signupToast()
            errors.innerHTML = "Empty Password Feild";
        }
        else if (signupPassword.value.length < 6) {
            signupToast();
            errors.innerHTML = "Password Should be at least 6";
        }
        else if (signupCPassword.value.trim() === "") {
            signupToast()
            errors.innerHTML = "Empty Confirm Password Feild";
        }
        else if (signupPassword.value !== signupCPassword.value) {
            signupToast();
            errors.innerHTML = "Password not matched";
        }
        else {

            let spinner = document.querySelector('.spinner-border');
            createUserWithEmailAndPassword(auth, sigupEmail.value, signupPassword.value)
                .then(async (userCredential) => {
                    //loader
                    spinner.classList.add('spinnerShow')
                    console.log("user registered. please wait for updating record in database")
                    const user = userCredential.user;
                    await setDoc(doc(db, "users", user.uid), {
                        FirstName: firstName.value,
                        LastName: lastName.value,
                        email: sigupEmail.value,
                        password: signupPassword.value,
                    });
                   
                    toastSuccess();
                    spinner.classList.remove('spinnerShow')
                    errors.innerHTML = "you are sucessfully Registered !";
                    setTimeout(()=>{
                    window.location.replace("dashboard.html")
                    },1000)
                    firstName.value = "";
                    lastName.value = "";
                    sigupEmail.value = "";
                    signupPassword.value = "";
                    signupCPassword.value = "";

                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    spinner.classList.add('spinn')
                    if (errorCode == "auth/email-already-in-use") {
                        toastSuccess();
                        errors.innerHTML = errorMessage + "you are redirecting to login";
                        setTimeout(() => {
                            window.location.replace("index.html")
                        }, 5000)
                    }


                });


            // setTimeout(() => {
            //     window.location.href = 'dashboard.html'
            // }, 6000)
        }


    })
}
if (loginBtn) {
    loginBtn.addEventListener("click", () => {

        signInWithEmailAndPassword(auth, signInEmail.value, signInPassword.value)
            .then(async (userCredential) => {
                let spinner = document.querySelector('.spinner-border');
                spinner.classList.add('spinnerShow');    
                const user = userCredential.user;
                setTimeout(()=>{
                    spinner.classList.remove("spinnerShow")
                    errors.innerHTML = "Successfully Login";
                    toastSuccess();
                },2000)
                 setTimeout(() => {
                    window.location.replace('dashboard.html')
                }, 4000)
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                if (signInEmail.value.trim() === "") {
                    toastShow();
                    errors.innerHTML = "Empty Email feild";
                }
                else if (!emailRegx.test(signInEmail.value)) {
                    toastShow();
                    errors.innerHTML = "Invalid Email";
                }
                else if (signInPassword.value.trim() === "") {
                    toastShow();
                    errors.innerHTML = "Empty Password feild";
                }
                else if (signInPassword.value.length < 6) {
                    toastShow();
                    errors.innerHTML = "Password Should be at least 6";
                }
                else {
                    signupToast();
                    errors.innerHTML = errorMessage;
                    console.log(errorMessage)
                }


            });
    })

}

















//check user login or not
// window.onload = async () => {

//     await onAuthStateChanged(auth, (user) => {
//       const uid = user.uid;
//       getUserFromDataBase(uid);
//       console.log(uid)
//       if (user) {
//         if (user && window.location.pathname == "/" || window.location.pathname == "/index.html" && redirect) {
//           getUserFromDataBase(uid)
//           console.log("user logged in")
//           window.location = "dashboard.html"
//           // ...
//         } else if (user && redirect) {
//           getUserFromDataBase(uid)
  
//           console.log("user logged in")
//         }
//       } else if (!user && !window.location.patshname == "/" || !window.location.pathname == "/index.html" && redirect) {
//         window.location = "index.html"
//         console.log("not sign in. click to signup or login");
//       }
//     });
//   }

  
// window.onload = function () {
//     onAuthStateChanged(auth, (user) => {
//         console.log(user)
//         // if (user && window.location.pathname == "index.html" || window.location.pathname == "/") {
//         //     // window.location.replace('dashboard.html')
//         // }
//     })
// }