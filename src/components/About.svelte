<script>
  import { t } from 'svelte-i18n';






 // async function updateStatisticsCollection() {
        // try {
        //     console.log("statistic store before click", $statisticsStore)
        //     $statisticsStore.adminDataClicks += 1
        //     console.log("statistic store after click", $statisticsStore)
        //     const statisticsCollectionRef = collection(db, "statistics");
        //     const newDocRef = doc(statisticsCollectionRef); // Create a reference to a new document
        //     console.log("what we got from db:",newDocRef)
        //     // update if not empty
        
           
        //     // // to ensure that the data fits
        //     // const updatedData = {
        //     //     authorEmailClicks: $statisticsStore.authorEmailClicks,
        //     //     adminDataClicks: $statisticsStore.authorEmailClicks,
        //     // };
        //     // console.log("updatedData:",updatedData)
        //     // // set the value to store
        //     console.log("value of statisticsStore after updating: ",$statisticsStore)
        //     await setDoc(newDocRef, $statisticsStore);
        // } catch (error) {
        //     console.error("Error updating statistics collection:", error);
        // }
   // }

</script>


<p class="short_info">
    {$t('IT-Student based in Belarus, Minsk. Part-time making clothes-design, photography, videography. Mainly studies at BSUIR and majoring in Informational systems and technologies in logistics.')}<br>
</p>


<div class=" text-center justify-self-center">
    <ul class="text-center ">
        <li class="gap-y-10">
            <p style=" margin-block-start: 0px; margin-block-end: 0px;" >
                <a target="_blank" style=" text-decoration:none;" 
                class="href_links transition duration-200 hover:text-blue-0" href ="https://docs.google.com/document/d/1rcklzYqRFf4ICC1Ai48KPzl5S0NArSxANsda5uv7IdM/edit">
                CV
                </a>
            </p>
        </li>
        <li><a style=" text-decoration:none;" class="href_links transition duration-200 hover:text-blue-0" target="_blank" href ="https://github.com/NikitaNekhay?tab=repositories">Github projects</a></li>
        <li><a class="href_links transition duration-200 hover:text-blue-0" target="_blank" href="https://youtu.be/aJqHTiAQ560" >Conceptual video "Campus tour"</a></li>
        <li><a class="href_links transition duration-200 hover:text-blue-0" target="_blank" href="https://youtu.be/WdUAxi6tISg" >Short cut film "The Whole"</a></li>
        <li><a class="href_links transition duration-200 hover:text-blue-0" target="_blank" href="https://www.instagram.com/nekhaynikita/">Capsule collection 2022</a></li>
        <li><a class="href_links transition duration-200 hover:text-blue-0" target="_blank" href="https://www.behance.net/nekhaynikita">Phography pieces</a></li>
    </ul>
</div>

<style>

        ul{
            padding-left: 20px;
            list-style-type:upper-roman;
        }

        .short_info{
            text-align: left; 
            padding-left: 0px

        }

</style>