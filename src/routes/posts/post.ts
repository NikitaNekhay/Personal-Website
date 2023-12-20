import { db } from '../../lib/firebase/firebase';
import { collection, doc, getDoc, runTransaction,  getDocs, addDoc, deleteDoc} from "firebase/firestore";
import { blogPost } from '../../store/store';
import { Errors, type AuthStoreType, type PostType } from '../../shared/types';
import { updateUserProfile } from '../profile/user';

export const blogsCollection = collection(db, "blogs");


export async function addBlogPost(tempPost){
  try {
   // console.log('Temp post:', tempPost)
    const docRef = await addDoc(blogsCollection, tempPost);
   // console.log("New blog added with ID: ", docRef.id);
    updateBlogPost(docRef.id,tempPost.title,tempPost.images,tempPost.author,tempPost.authorEmail,tempPost.description,tempPost.price,tempPost.date)
  } catch (error) {
    console.error("error while adding blog post",error)
  }
}



export async function updateBlogPost(  
                                    id:string,
                                    title:string,
                                    images: string[],
                                    author: string,
                                    authorEmail: string,
                                    description: string,
                                    price: number,
                                    date: Date){
  try{

    const postDocRef = doc(collection(db, "blogs"), id);
    
    await runTransaction(db, async (transaction) => {
      const postDoc = await transaction.get(postDocRef);
      if (!postDoc.exists()) {
        throw new Error("Post does not exist");
      }
      
      const postData = postDoc.data();
      const updatedPostData = {     
        id:id ?? postData.id,
        title:title ?? postData.title,
        images: images ?? postData.images,
        author: author ?? postData.author,
        authorEmail: authorEmail ?? postData.authorEmail,
        description: description ?? postData.description,
        price: price ?? postData.price,
        date: date ?? postData.date,
      };

      // Update user document
      transaction.update(postDocRef, updatedPostData);
    });

    
  } catch (error) {
    console.error('Error updating post:', error);
  }
  
}

export async function getBlogPost(id:string){
  try{
   // console.log("this is id passed to function for db call: ", id)
    const postDoc = doc(collection(db, "blogs"), id);
    const postSnapshot = await getDoc(postDoc);
    // put the value in store
    if (postSnapshot.exists()) {
        const postData = postSnapshot.data()
        // to ensure that the data fits
        const updatedData = {
            id: postData.id ?? 0,
            title: postData.title ?? '',
            images: postData.images ?? [],
            author: postData.author ?? 'John Berkley',
            authorEmail: postData.authorEmail ?? 'john.example@gmail.com',
            description: postData.description ?? 'Lorem ipsum',
            price: postData.price ?? 1,
            date: postData.date ?? new Date(),
        };
        // set the value to store
        blogPost.set(updatedData)
        /// return postSnapshot.data(); // работало заебись, но рещил соотнести с неработающей частью профиля юзера
        return postSnapshot.exists() ? postSnapshot.data() : null;
      } else {
        return null;
      }
    // short version without setting value to store
    // return postSnapshot.exists() ? postSnapshot.data() : null;
  } catch (error) {
    console.error('Error fetching post:', error);
  }
}

export async function getBlogPosts() {
  try {
    
    const blogPostsCollection = collection(db, 'blogs');
    const blogPostsSnapshot = await getDocs(blogPostsCollection);

    // Extract the data from each blog post document
    const blogPosts = blogPostsSnapshot.docs.map((doc) => ({
      id: String(doc.id),
      ...doc.data(),
    }));
    console.log("blog posts from post.ts:",blogPosts)
    return blogPosts;
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}

export async function deleteBlogPost(id:string){
  try {
    const postDocRef = doc(collection(db, 'blogs'), id);
    await deleteDoc(postDocRef);
    console.log('Blog post deleted:', id);
  } catch (error) {
    console.error('Error deleting blog post:', error);
  }
}

export async function  handleCart(post: PostType, tempAuthStore:AuthStoreType){

    if(tempAuthStore.user !== null && !(tempAuthStore.loading)){
      const tempArr:PostType[] = tempAuthStore.data.cart ?? [];
      tempArr.push(post);
      
      tempAuthStore.data.cart = tempArr;
      //console.log("tempAuthStore is",tempAuthStore)
      //console.log("handleClick - pushed value for cart:",tempArr)
      await updateUserProfile(
        tempAuthStore.user,
        tempAuthStore.data.name,
        tempAuthStore.data.email,
        tempAuthStore.data.phone,
        tempAuthStore.data.country,
        tempAuthStore.data.description,
        tempAuthStore.data.messages,
        tempAuthStore.data.cart )

      } else {
        throw Errors.NoUserToAddToCart;
      }



}