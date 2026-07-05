import { db } from '../../lib/firebase/firebase';
import { collection, doc, getDoc, runTransaction, getDocs, addDoc, deleteDoc } from "firebase/firestore";
import { authStore, productStore } from '../../store/store';
import { Errors, type AuthStoreType, type ProductType, type UserDataType, type UserCartType } from '../../shared/types';
import { updateUserProfile } from '../profile/user';
import { cart } from '../../store/cart_store_';

export const blogsCollection = collection(db, "products");


export async function addProduct(obj: ProductType) {
  try {
    // ////console.log('Temp post:', tempPost)
    const docRef = await addDoc(blogsCollection, obj);
    obj.id = docRef.id;
    ////console.log("New blog added with ID: ", docRef.id);
    updateProduct(obj);
  } catch (error) {
    console.error("error while adding blog post", error)
  }
}



export async function updateProduct(obj: ProductType) {
  try {

    const postDocRef = doc(collection(db, "products"), obj.id);

    await runTransaction(db, async (transaction) => {
      const postDoc = await transaction.get(postDocRef);
      if (!postDoc.exists()) {
        throw new Error("Post does not exist");
      }

      const postData = postDoc.data();
      const updatedPostData = {
        id: obj.id ?? postData.id,
        title: obj.title ?? postData.title,
        images: obj.images ?? postData.images,
        description: obj.description ?? postData.description,
        price: obj.price ?? postData.price,
        isArchive: obj.isArchive ?? postData.isArchive,
        section: obj.section ?? postData.section,
      };

      // Update user document
      transaction.update(postDocRef, updatedPostData);
    });


  } catch (error) {
    console.error('Error updating post:', error);
  }

}

export async function getProduct(id: string) {
  try {
    // ////console.log("this is id passed to function for db call: ", id)
    const postDoc = doc(collection(db, "products"), id);
    const postSnapshot = await getDoc(postDoc);
    // put the value in store
    if (postSnapshot.exists()) {
      const postData = postSnapshot.data()
      // to ensure that the data fits

      const updatedData: ProductType = postData;
      // set the value to store
      productStore.set(updatedData)
      /// return postSnapshot.data(); // работало заебись, но рещил соотнести с неработающей частью профиля юзера
      return postSnapshot.exists() ? postSnapshot.data() : null;
    } else {
      return null;
    }

  } catch (error) {
    console.error('Error fetching post:', error);
  }
}

export async function getProducts() {
  try {

    const blogPostsCollection = collection(db, 'products');
    const blogPostsSnapshot = await getDocs(blogPostsCollection);

    // Extract the data from each blog post document
    const blogPosts = blogPostsSnapshot.docs.map((doc) => ({
      id: String(doc.id),
      ...doc.data(),
    }));


    console.log(blogPosts)

    return blogPosts;
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}

export async function deleteProduct(id: string) {
  try {
    const postDocRef = doc(collection(db, 'products'), id);
    await deleteDoc(postDocRef);
    ////console.log('product deleted:', id);
  } catch (error) {
    console.error('Error deleting blog post:', error);
  }
}

export async function handleCart(post: ProductType, tempAuthStore: AuthStoreType) {

  if (tempAuthStore.user === null || tempAuthStore.loading) {
    throw Errors.NoUserToAddToCart;
  }

  // Optimistic + reactive: push through authStore.update() (NOT a bare mutation)
  // with a NEW array reference, so every subscriber — including the header cart
  // counter — reflects the added item instantly. Keep the previous cart for a
  // rollback if the profile write fails.
  const prevCart: ProductType[] = tempAuthStore.data.cart ?? [];
  const nextCart: ProductType[] = [...prevCart, post];
  authStore.update((s) => {
    s.data.cart = nextCart;
    return s;
  });

  // Persist to the user's profile in the background. On failure, roll the
  // optimistic add back so the counter keeps matching reality.
  try {
    await updateUserProfile(
      tempAuthStore.user,
      tempAuthStore.data.name,
      tempAuthStore.data.email,
      tempAuthStore.data.phone,
      tempAuthStore.data.country,
      tempAuthStore.data.city,
      tempAuthStore.data.description,
      tempAuthStore.data.messages,
      nextCart);
  } catch (err) {
    authStore.update((s) => {
      s.data.cart = prevCart;
      return s;
    });
    throw err;
  }
}

// for cart store(no user)
export async function handleCartNoUser(post: ProductType, _tempCart: UserCartType) {

  // Immutable update: new object + new array so the store fires a change and
  // persists to localStorage; the header counter then updates immediately.
  cart.update((c: UserCartType) => ({ ...c, cart: [...(c.cart ?? []), post] }));

}
