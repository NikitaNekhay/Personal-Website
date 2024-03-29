import { c as create_ssr_component, s as subscribe, e as escape, b as add_attribute, v as validate_component } from "../../../chunks/index.js";
import "firebase/storage";
import "../../../chunks/firebase.js";
import "../../../chunks/post.js";
import { X } from "../../../chunks/runtime.esm.js";
import "../../../chunks/store_.js";
import "firebase/auth";
import "firebase/firestore";
const PostCreate = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $t, $$unsubscribe_t;
  $$unsubscribe_t = subscribe(X, (value) => $t = value);
  let tempPost = {
    id: -1,
    title: "",
    description: "",
    author: "",
    authorEmail: "",
    price: "",
    images: [],
    date: /* @__PURE__ */ new Date()
  };
  $$unsubscribe_t();
  return `<div class="place flex place-content-center pt-60"><form class="w-full max-w-lg"><div class="mb-6 flex justify-center"><h1 class="font-abril text-4xl text-blue-0">${escape($t("CREATE POST"))}</h1></div>

    <div class="-mx-3 mb-6 flex flex-wrap"><div class="w-full px-3"><label class="relative block overflow-hidden rounded-md border border-gray-200 bg-white-1 px-3 pt-3 shadow-sm focus-within:border-white-2 focus-within:ring-1 focus-within:ring-white-2" for="title"><input class="peer h-8 w-full border-none bg-transparent bg-white-1 p-0 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm" type="text" id="title" required placeholder="Title"${add_attribute("value", tempPost.title, 0)}>
          <span class="absolute start-3 top-3 -translate-y-1/2 cursor-text bg-white-1 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs">${escape($t("Title"))}</span></label></div></div>
    <div class="-mx-3 mb-4 flex flex-wrap"><div class="h-full w-full px-3"><label class="relative block overflow-hidden rounded-md border border-gray-200 bg-white-1 px-3 pt-3 shadow-sm focus-within:border-white-2 focus-within:ring-1 focus-within:ring-white-2" for="description"><input class="peer h-8 w-full border-none bg-transparent bg-white-1 p-0 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm" id="description" placeholder="Description"${add_attribute("value", tempPost.description, 0)}>
          <span class="absolute start-3 top-3 -translate-y-1/2 cursor-text bg-white-1 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs">${escape($t("Description"))}</span></label>
        <p class="mt-3 text-xs italic text-gray-600">${escape($t("Make it as simple as informative"))}</p></div></div>

    <div class="-mx-3 mb-6 flex flex-wrap"><div class="mb-6 w-full px-3 md:mb-0 md:w-1/2"><label class="relative block overflow-hidden rounded-md border border-gray-200 bg-white-1 px-3 pt-3 shadow-sm focus-within:border-white-2 focus-within:ring-1 focus-within:ring-white-2" for="author"><input class="peer h-8 w-full border-none bg-transparent bg-white-1 p-0 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm" type="text" id="author" placeholder="Author" required${add_attribute("value", tempPost.author, 0)}>
          <span class="absolute start-3 top-3 -translate-y-1/2 cursor-text bg-white-1 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs">${escape($t("Author Name"))}</span></label></div>
      <div class="w-full px-3 md:w-1/2"><label class="relative block overflow-hidden rounded-md border border-gray-200 bg-white-1 px-3 pt-3 shadow-sm focus-within:border-white-2 focus-within:ring-1 focus-within:ring-white-2" for="authorEmail"><input class="peer h-8 w-full border-none bg-transparent bg-white-1 p-0 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm" type="email" id="authorEmail" placeholder="email@web.net" required${add_attribute("value", tempPost.authorEmail, 0)}>
          <span class="absolute start-3 top-3 -translate-y-1/2 cursor-text bg-white-1 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs">${escape($t("Author Email"))}</span></label></div></div>

    <div class="-mx-3 mb-2 ms-0 flex flex-wrap"><div class="mb-6 w-2/5"><label class="relative block overflow-hidden rounded-md border border-gray-200 bg-white-1 px-3 pt-3 shadow-sm focus-within:border-white-2 focus-within:ring-1 focus-within:ring-white-2" for="price"><input class="peer h-8 w-full border-none bg-transparent bg-white-1 p-0 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm" type="text" id="price" placeholder="400$" required${add_attribute("value", tempPost.price, 0)}>
          <span class="absolute start-3 top-3 -translate-y-1/2 cursor-text bg-white-1 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs">${escape($t("Price"))}</span></label></div>
      <div class="mb-3 h-1/2 px-3 md:mb-3 md:w-3/5"><label class="relative block overflow-hidden rounded-md border border-gray-200 bg-white-1 px-3 pt-3 shadow-sm focus-within:border-white-2 focus-within:ring-1 focus-within:ring-white-2" for="files"><input class="transparent peer block h-8 w-full border-none bg-transparent bg-white-1 p-0 text-center placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm" type="file" id="images" multiple placeholder="Files">
          <span class="absolute start-3 top-3 -translate-y-1/2 cursor-text bg-white-1 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs"></span></label></div></div>

    ${`<button class="group relative mx-[136px] flex w-1/2 items-center justify-center overflow-hidden rounded-md border border-orange-0 px-8 py-3 focus:outline-none" type="button"><span class="absolute inset-x-0 bottom-0 h-[2px] bg-orange-0 transition-all group-hover:h-full group-active:bg-orange-0"></span>

        <span class="relative text-sm font-medium text-orange-0 transition-colors group-hover:text-white">${escape($t("Submit"))}</span></button>`}</form></div>`;
});
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${$$result.head += `<!-- HEAD_svelte-1s9z257_START -->${$$result.title = `<title>${escape("Sandbox of posts")}</title>`, ""}<meta name="sandbox" content="Admin dashboard, manage posts"><!-- HEAD_svelte-1s9z257_END -->`, ""}



${validate_component(PostCreate, "PostCreate").$$render($$result, {}, {}, {})}`;
});
export {
  Page as default
};
