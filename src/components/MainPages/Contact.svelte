<script>
    import { t } from "svelte-i18n";
</script>


<div class="flex flex-col h-auto ml-[2%] mr-[5%] ">
    <div class="mt-[20%] sm:mt-[30%] w-[75%] sm:w-[100%] ">
        <div class="py-5 shadow-xl bg-white-1 border-navy-2 border-b-2 ">
            <details class="group" open>
                <summary
                    class="flex justify-between mx-2 items-center font-medium cursor-pointer list-none"
                >
                    <span class="text-3xl sm:text-lg select-none"
                        >{$t("CONTACTS")}</span
                    >
                    <span class="transition group-open:rotate-180">
                        <svg
                            fill="none"
                            height="24"
                            shape-rendering="geometricPrecision"
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="1.5"
                            viewBox="0 0 24 24"
                            width="24"
                            ><path d="M6 9l6 6 6-6"></path>
                        </svg>
                    </span>
                </summary>
        
                <ul class="text-gray-700 font-anonymous mx-4 mt-3 group-open:animate-fadeIn">
                    <li >
                        {$t("email")}:
                        <a
                            class="p-link"
                            href="mailto:nekhaymikita@gmail.com"
                            >{$t("SAY HELLO WITH EMAIL")}
                        </a><br />
                    </li>
                    <li >
                        {$t("instagram")}:
                        <a
                            class="p-link"
                            target="_blank"
                            href="https://instagram.com/nekhaynikita/"
                            >{$t("OPEN ACCOUNT")}</a
                        >
                    </li>
                    <li >
                        {$t("telegram")}:
                        <a
                            class="p-link"
                            target="_blank"
                            href="https://t.me/nikitanekhay">{$t("SAY HELLO IN TELEGRAM")}</a
                        ><br />
                    </li>
                </ul>
            </details>
        </div>
    </div>

</div>




<style>
    ul {
        @apply list-disc pl-4;
    }
</style>