<svelte:head>
   <title>Edit profile</title>
   <meta name="description" content="Forms for editing user's profile: name, country, city, phone number, social network option and username in it.">
   <script src="https://unpkg.com/alpinejs" defer></script>
</svelte:head>

<script >
    import CountryData from "../../../services/CountryData.json";
  import ProfileEdit from '../../../components/MainPages/Profile/ProfileEdit.svelte'



</script>

<ProfileEdit countries={CountryData}/>