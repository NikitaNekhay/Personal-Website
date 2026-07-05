import { auth, db } from "$lib/firebase/firebase"
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut, updateEmail, updatePassword, type User } from "firebase/auth"
import { deleteDoc, doc } from "firebase/firestore";
import { writable } from "svelte/store"
import { Errors, Language, type AuthStoreType, type ProductType, type UserDataType } from "../shared/types";


// Single source of truth for a "blank" profile — used for the initial store
// value and whenever we resolve to a logged-out state, so no stale data lingers.
export function emptyUserData(): UserDataType {
  return {
    id: "",
    name: "template",
    email: "",
    phone: "",
    country: "",
    city: "",
    adress: "",
    description: "",
    messages: [],
    cart: [],
  };
}

export const authStore = writable<AuthStoreType>({
  user: null,
  loading: true,
  data: emptyUserData(),
});

export const productStore = writable({
  id: "",
  title: "",
  images: [] as string[],
  description: {
    smallDescription:"",
    bigDescription:"",
    modelDescription:"",
    materialsDescription:"",
    colors:[""],
    sizes:[""],
  },
  price: 0,
  isArchive:false,
  section:"",
});

export const isAdmin = writable({
  value:false,
});

export const triggerComments = writable({
  value:false,
});



export const authHandlers = {

  signup: async (email:string, pass:string) => {
    return (await createUserWithEmailAndPassword(auth, email, pass))
    // ////console.log("creating user")
    // var emailAuth = email;

    // FirebaseAuth.instance.sendSignInLinkToEmail(
    //         email: emailAuth, actionCodeSettings: acs)
    //     .catchError((onError) => print('Error sending email verification $onError'))
    //     .then((value) => print('Successfully sent email verification'));
    // };
  },
  login: async (email:string, pass:string) => {
    // ////console.log("signing in")
    await signInWithEmailAndPassword(auth, email, pass)
  },
  logout: async () => {
    // ////console.log("signing out")
    await signOut(auth)

  },
  changeCredentials: async(user,email:string, pass:string)=>{
    try {
          //const user  = auth.currentUser;
      updatePassword(user,pass);
      updateEmail(user,email)
    } catch (error) {
      console.error(error)
      throw error
    }

    
  },
  deactivate: async () => {
      try {
        if(auth.currentUser){
          ////console.log("deactivating account...",auth.currentUser.uid)
          let user:User = auth.currentUser;
          // Delete the user from Firestore
          const userDocRef = doc(db, "user", auth.currentUser.uid);
          await deleteDoc(userDocRef);

          // Delete user from Firebase Authentication
          user?.delete;

          await auth.currentUser?.delete()
          //  ////console.log('User successfully deactivated');
        }

    
      } catch (error) {
        console.error(error)
        throw Errors.DeleteProfile
      }

  },

}
