<svelte:head>
   <title>{'User Profile'}</title>
   <meta name="description" content="User Profile">
</svelte:head>

<script >
  import Profile from '../../components/Profile.svelte'
  export const prerender = 'auto'
</script>

<Profile />