<script>
    import { t } from "svelte-i18n";
</script>

<div class="w-screen h-auto">
    <div class=" flex flex-col h-auto ml-[2%] mr-[5%]">
        <div
            class="my-[20%] sm:my-[30%]
            w-3/5 sm:w-[100%] md:w-[100%]"
        >
            <section class="">


                <h1 class="tracking-widest text-black-1 uppercase font-serif text-2xl">
                    {$t("Checkout and acceptance of orders")}
                </h1>
                <p>{$t('For checkout, please, fill out form on our site on the page of shopping cart or if you have already signed up check your profile to have true data in it. Next make the prepayment via a convenient option. If prepayment was successfully recieved by us we will inform you that the order has been started, if it is needed we will send you more details.')}</p>
                <p>{$t('Orders is being performed within 10 calendar days since receiving a prepayment for the order.')}</p>
                <p>{$t('You will be informed when the order was started and ended - you will get appropriate notification.')}</p>
                <p>{$t('After finishing the order, our manager will contact you. If the order is in stock or was performed, then you can pickup your it in Minsk at the same day of notification (orders, performed after 1 PM, will be available to pickup on the next day).')}</p>
                <br>

                <h1 class="tracking-widest uppercase text-black-1 font-serif text-2xl">
                    {$t("Payment conditions")}
                </h1>    
                <h2 class="tracking-widest uppercase text-black-1 font-serif text-lg">
                    {$t("Cash payment")}
                </h2>
                <p>{$t('We accept cash on delivery by courier or in person.')}</p>
                <p>{$t('')}</p>
                <p>{$t('')}</p>
                <p>{$t('')}</p>
                <p>{$t('')}</p>

                <h2 class="tracking-widest uppercase text-black-1 font-serif text-lg">
                    {$t("Cashless payment")}
                </h2>
                <p>{$t('Cashless payments with bank cards of Belarusian banks, Visa Electron, MasterCard, Maestro, Belkart, MIR. Payment is made to the bank details sent to you. If payment is successful, we will contact you.')}</p>
                <p>{$t('')}</p>
                <p>{$t('')}</p>
                <p>{$t('')}</p>
                <p>{$t('')}</p>

                <h2 class="tracking-widest uppercase text-black-1 font-serif text-lg">
                    {$t("Payment via mail's services")}
                </h2>
                <p>{$t('Cash-on-delivery if mail services are choosen is obligatory.')}</p>
                <p>{$t('')}</p>
                <!-- МОЖЕТ ДОБАВИТЬ ЧТО КОНКРЕТНО НУЖНО ВЫБРАТЬ ПРИ ОТПРАВКЕ ПОЧТОЙ, ОБЪЯВЛЕННАЯ ЦЕННОСТЬ ТОВАРА И ТД -->
                <p>{$t('')}</p>
                <p>{$t('')}</p>
                <p>{$t('')}</p>

                <h2 class="tracking-widest uppercase text-black-1 font-serif text-lg">
                    {$t("Internet payment")}
                </h2>
                <p>{$t('It is possible with bank cards Visa, Visa Electron, MasterCard, Maestro, Belkart, MIR on the website of the online store (payment will be automatically transferred to the payment system BePaid). Payment is made before the order starts. Fees for payment by means of a credit card shall not be deducted (unless stipulated in the agreement between the Buyer and the bank).')}</p>
                <p>{$t('')}</p>
                <p>{$t('')}</p>
                <p>{$t('')}</p>
                <p>{$t('')}</p>

                <h2 class="tracking-widest uppercase text-black-1 font-serif text-lg">
                    {$t("Obligatory prepayment")}
                </h2>
                <p>{$t('The prepayment is made only cashless by supported banks.')}</p>
                <p>{$t('To start your order you must pay at least 30% of the price.')}</p>
                <p>{$t('')}</p>
                <p>{$t('')}</p>
                <p>{$t('')}</p>

                <h2 class="tracking-widest uppercase text-black-1 font-serif text-lg">
                    {$t("Attention!")}
                </h2>
                <p>{$t('If you have not found your bank in this list, then write us and we together will try to find a solution of payment or prepayment of the order.')}</p>
                <br />

                <h1 class="tracking-widest uppercase text-black-1 font-serif text-2xl">
                    {$t("Shipping and delivery of goods")}
                </h1>            
                <p>{$t("We suggest some shipping options:")}</p>

                <h2 class="tracking-widest uppercase text-black-1 font-serif text-lg">
                    {$t(
                        "Minsk: Self-delivery/Delivery by our courier to your door:",
                    )}
                </h2>
                <ul>
                    <li>
                        <p>{$t('Place (Minsk, Zavodskoy district) and date for self-delivery are provided by our manager later')}</p>  
                    </li>
                    <li class="list-disc ml-4">
                        <p>{$t('Self-delivery is free')}</p>  
                    </li>
                    <li class="list-disc ml-4">
                        <p>{$t('Delivery service fee -- 10 BYN')}</p>  
                    </li>
                    <li class="list-disc ml-4">
                        <p>{$t('Courier will contact you by your contact details before about exact time.')}</p>  
                    </li>
                </ul>


                <h2 class="tracking-widest uppercase text-black-1 font-serif text-lg">
                    {$t(
                        "RB: Self-delivery from any Evropochta's office:",
                    )}
                </h2>
                <ul>
                    <li class="list-disc ml-4">
                        <p>{$t('Delivery time -- 3-5 working days')}</p>
                    </li>
                    <li class="list-disc ml-4">
                        <p>{$t('Shipping costs -- 5 BYN')}</p>  
                    </li>
                    <li class="list-disc ml-4">
                        <p>{$t('SMS-notification')}</p>  
                    </li>
                    <li class="list-disc ml-4">
                        <p>{$t('Storage at the mail office for up to 7 calendar days.')}</p>  
                    </li>
                    <!-- <li class="list-disc ml-4">
                        <p>{$t('')}</p>  
                    </li> -->
                </ul>

                <h2 class="tracking-widest uppercase text-black-1 font-serif text-lg">
                    {$t(
                        "RF: Self-delivery from CDEK:",
                    )}
                </h2>
                <ul>
                    <li class="list-disc ml-4">
                        <p>{$t('The time and cost of delivery is calculated in the shopping cart automatically and depends on the region of delivery')}</p>
                    </li>

                    <li class="list-disc ml-4">
                        <p>{$t('Storage at the mail office for up to 7 calendar days')}</p>
                    </li>
                    <li class="list-disc ml-4">
                        <p>{$t('SMS-notification (id CDEK app is configured by Buyer)')}</p>
                    </li>
                    <!-- <li class="list-disc ml-4">
                        <p>{$t('')}</p>
                    </li>
                    <li class="list-disc ml-4">
                        <p>{$t('')}</p>
                    </li> -->
                </ul>

                <h2 class="tracking-widest uppercase text-black-1 font-serif text-lg">
                    {$t(
                       "Other countries: EMS or any personal agreements;"
                    )}
                </h2>
                <ul>
                    <li class="list-disc ml-4">
                        <p>{$t('The time and cost of delivery is calculated by the seller. The seller offers possible ways of delivery to your region. The seller has the right to refuse the offered delivery options.')}</p>
                    </li>
                    <li class="list-disc ml-4">
                        <p>{$t("The seller is not responsible for the quality of logistics services when sending abroad, nor is he responsible for the safety of the goods.")}</p>
                    </li>
                </ul>
                <br >

                <p>
                    {$t(
                             "Price of mail services will be included in the order price.",
                         )}
                 </p>
                 <p>{$t('The assembly and processing time of the order is from 1 to 4 working days, when delivery is choosen.')}</p>
                 <p>{$t('The seller or courier has the right to refuse to make delivery, transfer of goods in public places (public transport, railway and other public buildings, commercial objects, public catering facilities, etc.).')}</p>
                 <p>{$t('The transfer of the goods at the self-delivery points of the Seller is carried out during the whole period of operation of the self-delivery. The inspection and fitting time is 15 minutes.')}</p>
                 <p>{$t("If the order was made and sent to the buyer by Evropochta's delivery service or by courier (Minsk/EMS), but not paid in full - the buyer bears the costs of transportation costs for the passage of the goods to the customer and return to the seller, according to the Civil Code of the Republic of Belarus, in the amount of the cost of delivery.")}</p>
                 <p>{$t('Ownership of the delivered goods passes to the Buyer from the moment of the actual delivery of the goods to the Buyer and payment by the latter of the full value of the goods. The risk of accidental death or damage to the goods passes to the Buyer from the moment of the actual transfer of the goods to the Buyer.')}</p>
                 <p>{$t('After the goods have been handed over to the Buyer, the name, quantity and completeness of the goods are not accepted.')}</p>
                 <p>{$t('The Buyer understands and agrees that delivery in accordance with this Policy is a separate service that is not an integral part of the goods purchased by the Buyer, the proper performance of which is confirmed by the Buyer’s receipt of the goods. The primary accounting document confirming the provision of service for the delivery of goods to the Buyer shall be prepared by the Seller separetely.')}</p>
                 <p>{$t('')}</p>
                 <p>{$t('')}</p>
                 <p>{$t('')}</p>
                <br>

                <h2 class="tracking-widest uppercase text-black-1 font-serif text-lg">
                    {$t(
                        "Self-delivery",
                    )}
                </h2>
                <p>{$t('If delivery is being made within МКАД, fitting is available.')}</p>
                <p>{$t('Self-delivery are made from Zavodksoy district of Minsk, exact adress will be sent to you later after checkout.')}</p>
                <p>{$t('Fitting is available for self-delivery and courier delivery.')}</p>
                <p>{$t('Buyer must pick up the product from our warehouse(self-delivery) within 10 calendar days since order was successfully prepared/ Otherwise order is eliminated and money wont be returned to the Buyer.')}</p>
                <p>{$t('')}</p>

                <h2 class="tracking-widest uppercase text-black-1 font-serif text-lg">
                    {$t(
                        "Courier delivery",
                    )}
                </h2>
                
                <p>{$t('Courier delivery is carried out daily from 12:00 to 21:00, in addition to public holidays and holidays in the interval specified by the Buyer at the placing of the order of goods or another time agreed by the parties.')}</p>
                <p>{$t('Courier delivery is carried out at the address pointed out in the order of the Buyer. The Buyer is obliged to provide access for the courier to the building and the premises specified in the delivery address.')}</p>
                <p>{$t('Home delivery is available for an additional fee -- 10 BYN.')}</p>
                <p>{$t('The buyer is obliged to take the courier to the address and at the time specified in the order or additionally agreed by the parties. If, upon arrival of the courier at the address indicated by the Buyer, the Buyer is not at the place and does not answer the phone calls within 10 minutes, the repeated delivery in the new terms agreed with the Seller. Repeated delivery is paid.')}</p>
                <p>{$t('Inspection and fitting of the goods is performed by the Buyer within a period of time not exceeding 15 minutes.')}</p>

                <br>
                <p >{$t('If incorrect data is entered in the order form or in the user profile, the Seller does not bear any responsibility for the further implementation of the order, and in case of partial or full payment for the order the Seller is entitled not to return the funds to the Buyer.')}</p>
                <br>

                <h1 class="tracking-widest text-black-1 uppercase font-serif text-2xl">
                    {$t("Return of goods")}
                </h1>
                <p>{$t('Return of goods is only possible in case of defects or flaws in the product within 14 calendar days from the date of purchase. Confirmation of defects is done through our inspection.')}</p>
                <p>{$t('Return and exchange of non-defective goods are possible if the product has not been used, shows no signs of wear or contamination, maintains its original appearance, factory packaging is intact, and the document confirming the purchase conditions is retained.')}</p>
                <p>{$t('To initiate a return, please CONTACT ME by email at or by phone.')}</p>
                <br>
                <p>{$t('In your email message, please provide:')}</p>
                <ul>
                    <li>
                        <p>{$t('Full name of the buyer for whom the product was purchased')}</p>
                    </li>
                    <li>
                        <p>{$t("Details for the refund of funds: Buyer's account number, bank name, bank code, card number")}</p>
                    </li>
                    <li>
                        <p>{$t('Description of the product defect, and please attach several photos')}</p>
                    </li>
                </ul>
                <br>
                <p>{$t('After our inspection confirms the defect for further return, you need to:')}</p>
                <p>{$t('Pack the items you want to return in a bag or the original box.')}</p>
                <p>{$t('Send the product back to the seller using the method we suggest, such as by mail.')}</p>
                <p>{$t('Send the product and wait for the refund of funds.')}</p>
                <br>
                <p>{$t('In case of a full order refund, the buyer is responsible for covering the shipping costs.')}</p>
                <br>

                <h1 class="tracking-widest text-black-1 uppercase font-serif text-2xl">
                    {$t("Return of money")}
                </h1>
                <p>{$t('The refund of funds is processed only to the same bank card that was used for the order payment.')}</p>
                <p>{$t("The transfer of funds by the Seller will be made no later than 7 calendar days from the return of the product and receipt of the letter from the Buyer, provided that it contains all the necessary information. The time it takes for the funds to appear in the Buyer's account depends on the rules of the issuing bank and may range from 3 to 30 days from the Seller's return.")}</p>
                <!-- <p>{$t('')}</p>
                <p>{$t('')}</p>
                <p>{$t('')}</p>
                <p>{$t('')}</p>
                <p>{$t('')}</p>
                <p>{$t('')}</p>
                <p>{$t('')}</p>
                <p>{$t('')}</p> -->
                <br>

                <h1 class="tracking-widest text-black-1 uppercase font-serif text-2xl">
                    {$t("Fitting of goods")}
                </h1>
                <p>{$t('If there are manufactured products of the required size, we carry out fitting in Minsk. And place and time are agreed personally in a place convenient for you.')}</p>
                <p>{$t('If there is no item of the desired size, the fitting is not performed. See the size table on a separate page of the product in the description.')}</p>
                <p>{$t('Product inspection and fitting are carried out for a maximum of 15 minutes from the moment the product is handed over to the Buyer.')}</p>
                <p>{$t('Fitting of the product is free. Re-fitting of the product is subject to a fee -- 10 BYN.')}</p>
                <!-- <p>{$t('')}</p>
                <p>{$t('')}</p>
                <p>{$t('')}</p>
                <p>{$t('')}</p>
                <p>{$t('')}</p> -->
                <br>

                <h1 class="tracking-widest text-black-1 uppercase font-serif text-2xl">
                    {$t("Termins")}
                </h1>
                    <p>{$t('The moment of purchase -- is the moment of payment of the full price for the goods.')}</p>
                <!-- <p>{$t('')}</p>
                <p>{$t('')}</p>
                <p>{$t('')}</p>
                <p>{$t('')}</p>
                <p>{$t('')}</p>
                <p>{$t('')}</p>
                <p>{$t('')}</p>
                <p>{$t('')}</p>
                <p>{$t('')}</p> -->
                <br>

            </section>
        </div>
    </div>
</div>

<style>
    h1 {
        @apply my-4;
    }
    h2 {
        @apply my-4;
    }
    p {
        @apply font-sans mb-2;
    }
    li {
        @apply list-disc ml-4;
    }
</style>
