<script lang="ts">
    import CommonPopUp from "../../Shared/CommonPopUp.svelte";
import CartTable from "./CartTable.svelte";
import UserTable from "./UserTable.svelte";

let isChanged:boolean = true;
let msg:String ="No AdminSDK -> Can not delete user account both from db and authstore.";
let smmsg:String = "Please, attention!"
let href:String = "";


</script>
<main>
  <section class="grid h-screen px-4 bg-white place-content-center gap-y-40">
    <h1 class="tracking-widest text-black-1 uppercase font-abril text-3xl ">
      MANAGING USERS ACCOUNTS
    </h1>
  </section>
  <section class="grid h-screen px-4 bg-white place-content-center">
    {#if isChanged}
    <CommonPopUp bind:isChanged isError={true} isPreviev={false} message={msg} smallMessage={smmsg} href=""/>
    {/if}
    <div class="">
      
      <UserTable />
    </div>
  </section>
  <section class="grid h-screen px-4 bg-white place-content-center gap-y-40">
    <CartTable />
  </section>


  </main> 

