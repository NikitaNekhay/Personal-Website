<script lang="ts">
    // import states
    import { onMount } from 'svelte';
    import { getBlogPosts } from '../routes/posts/post';
    import { base } from '$app/paths';
    import { Language, blogPost } from '../store/store';
    import { addMessages, locale, t } from 'svelte-i18n';
  import { currentLanguagee } from '../store/store_';
  import ru from '../services/ru.json';
  import en from '../services/en.json';

  if($currentLanguagee!==undefined){
        const currentValue = $currentLanguagee;
        // Switch the language value
        if(currentValue === Language.English){
           
            addMessages(Language.English, en)
            locale.set(Language.English)
        } else {
          addMessages(Language.Russian, ru)
            locale.set(Language.Russian)
           
        }
    } else {
        addMessages(Language.English, en)
        locale.set(Language.English)
    }

    // use Firestore's onSnapshot method to listen for changes
    // in the blogs collection and update the page in 
    // real-time whenever a new blog is added, edited, or deleted.
  
    let blogPosts = [];
  
    onMount(async () => {
    
      // Fetch blog posts from the database
      console.log('Fetching blog posts from the database...')
      blogPosts = await getBlogPosts();
      console.log(blogPosts)
      
  
    });
  
    function handleClick(id:string) {
    // Navigate to the detailed page of the selected blog post
    console.log(id)
    $blogPost.id = id
    console.log($blogPost.id)
    //goto(`${base}/posts/${id}`);
    window.location.href = `${base}/posts/${id}`;
    }
  
  </script>
    
  
  
    <div class="bg-white">
      <div class="mx-auto max-w-xl py-16 sm:px-6 sm:py-24 lg: lg:px-8">
        {#if blogPosts.length !== 0}
            {#each blogPosts as post}
            <div class="mt-44 flex gap-x-6 gap-y-10 ">
              <div>
                <div on:click={() => handleClick(post.id)} on:keypress 
                  class="min-h-80 overflow-hidden 
                  bg-gray-200 hover:opacity-80 lg:h-80
                  hover:cursor-pointer">
                  <img src={post.images[0]} alt="Blog Post"
                  class="object-center"/>
                </div>
                <div class="mt-2 flex justify-between">
                  <div class=" items-center">
                    <h3 class="text-lg font-bold text-gray-900 sm:text-xl">
                        {post.title}
                    </h3>
                  
                    <p class="mt-2 max-w-sm text-gray-700">
                      {post.description.slice(0,post.description.search(' '))}
                    </p>
                  </div>
                
                  <div class="grid grid-rows items-center justify-items-end max-h-fit max-w-fit">
                    <div>
                      <p class="text-3xl font-medium text-gray-900 font-anonymous">{post.price}</p>
                    </div>
                    <div>
                        <button class="hover:text-yellow-0">add to bucket</button>
                    </div>
                  </div>
                </div>
                  
                  
                  
            </div>
            
        
        </div>
            {/each}
        {:else}
        <div class="grid h-screen px-4 bg-white place-content-center">
            <h1 class="tracking-widest text-black-1 uppercase font-abril text-3xl">
                {$t('NO POSTS | FOUND')}
            </h1>
        </div>
        {/if}
    
        
      </div>
    </div>
  
  
  
  
    <style>
        .gallery {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      grid-gap: 20px;
      justify-items: center;
    }
  
    .post {
      position: relative;
      padding: 10px;
      background-color: #f0f0f0;
      border-radius: 5px;
    }
  
    .post img {
      width: 100%;
      height: auto;
      cursor: pointer;
    }
  
    .actions {
      margin-top: 10px;
      display: flex;
      justify-content: space-between;
    }
  
    .actions button {
      padding: 5px 10px;
      background-color: #ccc;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    }
  
    </style>
  
    
  