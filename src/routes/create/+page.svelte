<svelte:head>
   <title>Dashboard of products</title>
   <meta name="description" content="Admin dashboard for managing products">
</svelte:head>

<script lang="ts">
  import PostEdit from '../../components/MainPages/Posts/PostEdit.svelte'
</script>

<PostEdit typeCRUD={"CREATE POST"} post={null}/>
