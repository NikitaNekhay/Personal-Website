<script lang="ts">
  import { onMount } from "svelte";

  import SubmitButton from "../../Shared/SubmitButton.svelte";

  import { authHandlers, authStore } from "../../../store/store";

  import { t } from "svelte-i18n";
  import { updateUserProfile } from "../../../routes/profile/user";
  import { currentLanguagee } from "../../../store/store_";
  import {
    ContactOptions,
    type ProductType,
    DeliveryOptions,
    PaymentOptions,
    Errors,
    EmailSubjects,
    EmailText,
  } from "../../../shared/types";
  import SquareButton from "../../Shared/SquareButton.svelte";
  import { base } from "$app/paths";
  import CommonPopUp from "../../Shared/CommonPopUp.svelte";

  import { cart } from "../../../store/cart_store_";
  import {
    generateSecurePassword,
    validateAddress,
    validateCity,
    validateDiscount,
    validateEmail,
    validateFullName,
    validatePhoneNumber,
    validateUsername,
  } from "../../../services/help";
  import { error } from "@sveltejs/kit";

  // Assuming you have a list of countries and their codes
  export let countries;
  export let sendEmail: (
    to: string,
    subject: string,
    text: string,
    type: string,
  ) => Promise<void>;

  let isChanged = false;
  let isErrorInput: string[] = [];
  let msgT: String = Errors.PurchaseFormAttention;
  let msg: String = Errors.PurchaseFormAttention;
  let smmsgE: String = Errors.PurchaseForm;
  let isError: boolean = true;
  let href = `${base}/profile`;

  let isAgreePolicy = false;
  let isCreateAccout = false;
  let showDropdown = false;
  let submitClicked = false;
  let isLoading = false;

  let productQuantities = new Map<string, number>();
  let cartItems: ProductType[] = [];

  let cartPrice: number = 0;
  let totalСartPrice: number = 0;
  let deliveryPrice: number = 0;
  let prepaymentPrice: number = 0;

  let isDiscount: boolean = false;

  let tempUserCart = $authStore.user
    ? {
        fullName: $authStore.data.name ?? "",
        phoneNumber: $authStore.data.phone ?? "",
        email: $authStore.data.email ?? "",
        contactOption: ContactOptions.Telegram,
        contactName: "",
        deliveryOption: DeliveryOptions.SelfDelivery,
        country: $authStore.data.country ?? "",
        city: $authStore.data.city ?? "",
        adress: "",
        paymentOption: PaymentOptions.CashLessTotal,
        discount: "",
        cart: $authStore.data.cart ?? [],
      }
    : $cart;

  onMount(() => {
    //console.log("authstore - before unsub", $authStore);
    const unsubscribe = authStore.subscribe((authStoreValue) => {
      //console.log("authstore - in unsub", authStoreValue);
      //console.log("$authstore - in cart", authStoreValue);

      //console.log("cart in cart", tempUserCart.cart);
      tempUserCart = authStoreValue.user
        ? {
            fullName: authStoreValue.data.name ?? "",
            phoneNumber: authStoreValue.data.phone ?? "",
            email: authStoreValue.data.email ?? "",
            contactOption: ContactOptions.Telegram,
            contactName: "",
            deliveryOption: DeliveryOptions.SelfDelivery,
            country: authStoreValue.data.country ?? "",
            city: authStoreValue.data.city ?? "",
            adress: "",
            paymentOption: PaymentOptions.CashLessTotal,
            discount: "",
            cart: authStoreValue.data.cart ?? [],
          }
        : tempUserCart;

      ////console.log(tempUserCart);
      cartItems = tempUserCart.cart;
      countAllPrice();
    });

    return unsubscribe;
  });

  // tempUserCart = setUserPreferences(tempUserCart);

  // function setUserPreferences(userData: UserCartType): UserCartType {
  //   return userData;
  // }

  function selectCountry(country) {
    tempUserCart.country = country.code;
    showDropdown = false;
    // Additional logic to handle the selected country
  }

  // Calculate the quantities of each product

  function countPrice() {
    cartPrice = 0;
    cartItems.forEach((item) => {
      ////console.log(item.price)
      cartPrice += Number(item.price);
    });
    return cartPrice;
  }

  async function handleDeleteItemFromCart(tempId: number) {
    if ($authStore.user) {
      const clickedItem: ProductType = cartItems.find((obj) => {
        return obj.id === cartItems[tempId].id;
      });

      cartItems.splice(cartItems.indexOf(clickedItem), 1);
      $authStore.data.cart = cartItems;
      tempUserCart.cart = cartItems;

      // make map out of user's cart
      cartItems.forEach((item) => {
        productQuantities.set(
          item.title,
          (productQuantities.get(item.title) || 0) + 1,
        );
      });

      await updateUserProfile(
        $authStore.user,
        $authStore.data.name,
        $authStore.data.email,
        $authStore.data.phone,
        $authStore.data.country,
        $authStore.data.city,
        $authStore.data.description,
        $authStore.data.messages,
        $authStore.data.cart,
      );
    } else {
      //console.log("no user to delete from cart");
      const clickedItem: ProductType = cartItems.find((obj) => {
        return obj.id === cartItems[tempId].id;
      });
      //console.log("clickedItem from cart");
      cartItems.splice(cartItems.indexOf(clickedItem), 1);
      tempUserCart.cart = cartItems;
      $cart.cart = cartItems;

      // make map out of user's cart
      cartItems.forEach((item) => {
        productQuantities.set(
          item.title,
          (productQuantities.get(item.title) || 0) + 1,
        );
      });
    }
    countAllPrice();
  }

  // Function to handle country selection
  function handleCountrySelect(event) {
    tempUserCart.country = event.target.value;
    // Additional logic to handle the selected country
  }

  // Function to get the flag URL
  function getFlagUrl(countryCode: string) {
    return `https://flagcdn.com/w20/${countryCode.toLowerCase()}.png`;
  }

  function countAllPrice() {
    // Count prices with delivery
    switch (tempUserCart.deliveryOption) {
      case DeliveryOptions.Evropochta: {
        deliveryPrice = 5;
        break;
      }
      case DeliveryOptions.Cdek: {
        deliveryPrice = 30;
        break;
      }
      case DeliveryOptions.EMS: {
        deliveryPrice = 70;
        break;
      }
      case DeliveryOptions.SelfDelivery: {
        deliveryPrice = 0;
        break;
      }
      default: {
        tempUserCart.deliveryOption = DeliveryOptions.SelfDelivery;
        deliveryPrice = 0;
        cartPrice = countPrice();
        totalСartPrice = cartPrice + deliveryPrice;
        totalСartPrice =
          validateDiscount(tempUserCart.discount) &&
          tempUserCart.discount.length > 0
            ? totalСartPrice * 0.95
            : totalСartPrice;
        prepaymentPrice = totalСartPrice * 0.3;
        break;
        //throw Errors.PurchaseFormPayment;
      }
    }

    // Count discount

    //console.log("delivery option:", tempUserCart.deliveryOption, deliveryPrice);
    cartPrice = countPrice();
    totalСartPrice = cartPrice + deliveryPrice;
    totalСartPrice =
      validateDiscount(tempUserCart.discount) &&
      tempUserCart.discount.length > 0
        ? totalСartPrice * 0.95
        : totalСartPrice;
    prepaymentPrice = totalСartPrice * 0.3;
  }

  function handleCart() {
    try {
      isErrorInput.length = 0;
      if (handleFormValidation()) {
        submitClicked = !submitClicked;
        try {
          // make quantity of items in cart for check
          cartItems.forEach((item) => {
            productQuantities.set(
              item.title,
              (productQuantities.get(item.title) || 0) + 1,
            );
          });

          countAllPrice();

          if (isAgreePolicy) {
            // create and handle user from form data
            ////console.log("create user");
            if (isCreateAccout) handleCreateNewUser();

            // send credentials to admin
            ////console.log("send credentials to admin");
            handleSendCredentials();

            // Download Check
            //downloadCheck();

            // Send check to user's email
            sendEmail(
              tempUserCart.email,
              $t(EmailSubjects.ProceedOrder),
              generateCheck(),
              EmailSubjects.ProceedOrder,
            );
            isChanged = true;
            isError = false;
            msg =
              "You have made your oder! Check your email for further instructions.";
          }
        } catch (error) {
          throw error;
        }
      } else {
        if (msg !== msgT) {
          throw msg;
        } else {
          throw Errors.PurchaseFormAttention;
        }
      }
    } catch (error) {
      if (typeof error === "string") {
        msg = error;
      } else if (error.message !== undefined) {
        msg = error.message;
      } else {
        msg = msgT;
      }
      document.body.scrollIntoView({ block: "start", behavior: "smooth" });
      isChanged = true;
    } finally {
      setTimeout(() => {
        submitClicked = !submitClicked;
        isLoading = true;
      }, 2500);
    }
  }

  function validateContactOption(contactOption) {
    if (contactOption.length === 0) {
      return false;
    }

    return true;
  }

  function validateDeliveryOption(deliveryOption) {
    if (deliveryOption.length === 0) {
      return false;
    }
    return true;
  }

  function validatePaymentOption(paymentOption) {
    if (paymentOption.length === 0) {
      return false;
    }
    return true;
  }

  function handleFormValidation() {
    //console.log(tempUserCart);
    var isBadReturn: boolean = false;
    // Validate all fields

    const isContactOptionValid = validateContactOption(
      tempUserCart.contactOption,
    );
    const isDeliveryOptionValid = validateDeliveryOption(
      tempUserCart.deliveryOption,
    );
    const isPaymentOptionValid = validatePaymentOption(
      tempUserCart.paymentOption,
    );
    const isFullNameValid = validateFullName(tempUserCart.fullName);
    const isPhoneNumberValid = validatePhoneNumber(
      tempUserCart.phoneNumber,
      tempUserCart.country,
      countries,
    );
    const isEmailValid = validateEmail(tempUserCart.email);
    const isUsernameValid = validateUsername(tempUserCart.contactName);
    let isAddressValid = true;

    if (
      isContactOptionValid &&
      tempUserCart.deliveryOption !== DeliveryOptions.SelfDelivery
    ) {
      isAddressValid = validateAddress(tempUserCart.adress);
    }

    const isCityValid = validateCity(
      tempUserCart.city,
      tempUserCart.country,
      countries,
    );
    const isDiscountValid = validateDiscount(tempUserCart.discount);

    // If any validation fails, set an error message and return false
    if (!isAgreePolicy) {
      isErrorInput.push("policy");
      msg = Errors.PurchaseFormPolicyAgree;
      isBadReturn = true;
    }
    if (!isContactOptionValid) {
      isErrorInput.push("contact");
      msg = Errors.PurchaseFormContact;
      isBadReturn = true;
    }
    if (!isDeliveryOptionValid) {
      isErrorInput.push("delivery");
      msg = Errors.PurchaseFormDelivery;
      isBadReturn = true;
    }
    if (!isPaymentOptionValid) {
      isErrorInput.push("payment");
      msg = Errors.PurchaseFormPayment;
      isBadReturn = true;
    }
    if (!isFullNameValid) {
      isErrorInput.push("fullName");
      msg = Errors.PurchaseFormName;
      isBadReturn = true;
    }
    if (!isPhoneNumberValid) {
      isErrorInput.push("phoneNumber");
      msg = Errors.PurchaseFormPhone;
      isBadReturn = true;
    }
    if (!isEmailValid) {
      isErrorInput.push("email");
      msg = Errors.PurchaseFormEmail;
      isBadReturn = true;
    }
    if (!isUsernameValid) {
      isErrorInput.push("username");
      msg = Errors.PurchaseFormUsername;
      isBadReturn = true;
    }
    if (
      !isAddressValid &&
      tempUserCart.deliveryOption !== DeliveryOptions.SelfDelivery &&
      tempUserCart.deliveryOption.length !== 0
    ) {
      isErrorInput.push("address");
      msg = Errors.PurchaseFormAdress;
      isBadReturn = true;
    }
    if (!isCityValid) {
      isErrorInput.push("city");
      msg = Errors.PurchaseFormCity;
      isBadReturn = true;
    }
    if (!isDiscountValid) {
      isErrorInput.push("discount");
      msg = Errors.PurchaseFormDiscount;
      isBadReturn = true;
    } else {
      // Apply discount:
      countAllPrice();
    }

    if (isBadReturn) {
      //console.log(isErrorInput);
      return false;
    }

    // If everything's valid, clear error messages and return true
    isErrorInput.length = 0;
    msg = msgT;
    return true;
  }

  async function handleSendCredentials() {
    try {
      //console.log(tempUserCart);
      var objOfOrder = tempUserCart;
      let cartString = [];
      objOfOrder.cart.forEach((c, index) => {
        cartString[index] =
          c.title +
          " " +
          JSON.stringify(c.description["colors"]) +
          JSON.stringify(c.description["sizes"]);
      });
      //console.log(tempUserCart, objOfOrder);
      //objOfOrder.cart.length = 0;
      let stringOfOrder =
        "Items: " +
        JSON.stringify(cartString) +
        `\n` +
        "prepayment:" +
        prepaymentPrice +
        " total price:" +
        totalСartPrice +
        `\n\n` +
        JSON.stringify(objOfOrder);

      await sendEmail(
        "",
        $t(EmailSubjects.OrderCredentials),
        stringOfOrder,
        EmailSubjects.OrderCredentials,
      );
    } catch (error) {
      if (typeof error === "string") {
        msg = error;
      } else if (error.message !== undefined) {
        msg = error.message;
      }

      document.body.scrollIntoView({ block: "start", behavior: "smooth" });
      isChanged = true;
      throw msg;
    }
  }

  async function handleCreateNewUser() {
    if (isCreateAccout && !$authStore.user) {
      try {
        let password: string = generateSecurePassword();
        let user = await authHandlers.signup(tempUserCart.email, password);
        //console.log(user);
        await updateUserProfile(
          user,
          tempUserCart.fullName,
          tempUserCart.email,
          tempUserCart.phoneNumber,
          tempUserCart.country,
          tempUserCart.city,
          "",
          "",
          tempUserCart.cart,
        );

        setTimeout(async () => {
          await sendEmail(
            tempUserCart.email,
            $t(EmailSubjects.NewAccount),
            $t(EmailText.NewAccount) + password,
            EmailSubjects.NewAccount,
          );
        }, 3000);

        isChanged = true;
        isError = false;
        msg = "You have created user account!";
      } catch (error) {
        if (typeof error === "string") {
          msg = error;
        } else if (error.message !== undefined) {
          msg = error.message;
        } else {
          msg = Errors.Register;
        }

        document.body.scrollIntoView({ block: "start", behavior: "smooth" });
        isChanged = true;
        isError = true;
        throw msg;
      } finally {
        setTimeout(() => {
          submitClicked = !submitClicked;
          isLoading = true;
        }, 2500);
      }
    } else {
      if (typeof error === "string") {
        msg = error;
      } else if (error.message !== undefined) {
        msg = error.message;
      } else {
        msg = Errors.Register;
      }

      document.body.scrollIntoView({ block: "start", behavior: "smooth" });
      isChanged = true;
      isError = true;
    }
  }

  function returnDelivery(deliveryOption) {
    const result: string =
      deliveryOption === DeliveryOptions.SelfDelivery
        ? "SelfDelivery"
        : deliveryOption === DeliveryOptions.EMS
          ? "EMS"
          : deliveryOption === DeliveryOptions.Cdek
            ? "Cdek"
            : deliveryOption === DeliveryOptions.Evropochta
              ? "Evropochta"
              : "Invalid Option";
    return result;
  }

  function downloadCheck() {
    const checkText = generateCheck();
    const blob = new Blob([checkText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "check.txt";
    a.click();
    URL.revokeObjectURL(url);
  }

  function generateCheck() {
    if (cartItems.length === 0) {
      return $t(EmailText.EmptyCart);
    }

    // Accumulate quantities for each product
    const accumulatedQuantities = new Map();
    cartItems.forEach((item) => {
      const quantity = accumulatedQuantities.get(item.title) || 0;
      accumulatedQuantities.set(item.title, quantity + 1);
    });

    let checkText = $t(EmailText.ProceedOrder);

    if ($currentLanguagee === "ru") {
      // Generate check text based on accumulated quantities
      accumulatedQuantities.forEach((quantity, title) => {
        checkText += `Товар: ${$t(title)}\nКоличество: ${quantity}\n`;
      });

      checkText += `\n\nДоставка: ${$t(
        returnDelivery(tempUserCart.deliveryOption),
      )}\n${
        tempUserCart.discount.length !== 0
          ? "Промокод: " + tempUserCart.discount + "\n"
          : ""
      }Предоплата: ${prepaymentPrice} BYN\nОбщая стоимость за заказ: ${totalСartPrice} BYN\n\n`;
      checkText += `Вы получите электронное сообщение на почту от nekhaymikita@gmail.com с заголовком о продолжении заказа\nОжидайте дальнейших инструкций об оплате.\n\n`;

      return checkText;
    } else {
      // Generate check text based on accumulated quantities
      accumulatedQuantities.forEach((quantity, title) => {
        checkText += `Product: ${title}\nQuantity: ${quantity}\n`;
      });

      checkText += `\n\nDelivery option: ${returnDelivery(
        tempUserCart.deliveryOption,
      )}\n${
        tempUserCart.discount.length !== 0
          ? "Discount: " + tempUserCart.discount + "\n"
          : ""
      }Prepayment price: ${prepaymentPrice}\nTotal price of order: ${totalСartPrice}\n\n`;
      checkText += `You will get an copy email from nekhaymikita@gmail.com with the subject of proceeding an order\nWait further instructions for the purchase.\n\n`;

      return checkText;
    }
  }
</script>

{#if isChanged}
  <CommonPopUp
    bind:isChanged
    {isError}
    isPreviev={false}
    message={msg}
    smallMessage={smmsgE}
    href=""
  />
{/if}

<div
  class="w-[100%] relative h-auto
            grid grid-flow-col
            lg:grid-cols-7 xl:grid-cols-7 2xl:grid-cols-7 3xl:grid-cols-7
            sm:grid-flow-row md:grid-flow-row
            gap-x-6 sm:gap-x-0 md:gap-x-0
            py-[14%] px-[3%] sm:py-[40%] xl:mb-40pt 2xl:mb-40pt 3xl:mb-40pt"
>
  <section
    class="sticky-section h-auto
    lg:col-span-3 xl:col-span-3 2xl:col-span-3 3xl:col-span-3
    3xl:pb-[40%] sm:w-[100%] md:w-[100%]"
  >
    <div class=" left-0">
      <header class="text mb-6 flex justify-center">
        <h1 class="font-abril text-4xl text-blue-0">{$t("Your Cart")}</h1>
      </header>

      <!-- <header class="text-center">
            <h1 class="text-xl font-bold text-gray-900 sm:text-3xl">{$t('Your Cart')} </h1>
          </header> -->

      <div class="sm:w-[100%] md:sm:w-[100%]">
        <!-- List of cart -->
        {#key tempUserCart}
          {#if cartItems.length > 0}
            <ul class="space-y-6">
              {#each tempUserCart.cart as item, index}
                <li class="flex items-center justify-between">
                  <div class="flex items-center justify-start gap-x-4">
                    <a href="{base}/posts/{item.id}">
                      <img
                        src={item.images[0]}
                        alt="item img"
                        class="h-16 w-16 rounded object-cover"
                      />
                    </a>

                    <div class="sm:w-28 md:w-32">
                      <div class=" ">
                        <h3
                          class="text-sm text-gray-900 sm:truncate md:truncate"
                        >
                          {item.title}
                        </h3>
                      </div>

                      <!-- Block of item props -->
                      <dl class="mt-0.5 space-y-px text-[10px] text-gray-600">
                        <div>
                          <dt class="inline">Size:</dt>
                          <dd class="inline">Universal</dd>
                        </div>
                        <div>
                          <dt class="inline">Price:</dt>
                          <dd class="inline">{item.price} BYN</dd>
                        </div>
                        <!-- <div>
                        <dt class="inline">Color:</dt>
                        <dd class="inline">White</dd>
                      </div> -->
                      </dl>
                    </div>
                  </div>

                  <div class="flex gap-2">
                    <SquareButton
                      passedfunction={() => {
                        handleDeleteItemFromCart(index);
                      }}
                      typeSquare="delete"
                    />
                  </div>
                </li>
              {/each}
            </ul>
          {:else}
            {$t("NO ITEMS IN CART | BROWSE THE SHOP!")}
          {/if}

          <!-- Check info -->
          <div class="mt-8 flex justify-end border-t-2 border-navy-2 pt-8">
            <div class="w-[100%] max-w-lg space-y-4">
              <div class="flex justify-end gap-6 text-base font-medium mb-8">
                {$t("Price for goods")} :

                {cartPrice}

                BYN
              </div>
            </div>
          </div>
        {/key}
      </div>
    </div>
  </section>
  <section
    class="h-auto 3xl:pb-[40%]
    lg:col-span-4 xl:col-span-4 2xl:col-span-4 3xl:col-span-4
    sm:w-[100%] md:w-[100%]"
  >
    <header class="text mb-6 flex justify-center">
      <h1 class="font-abril text-4xl text-blue-0">
        {$t("Make an order / checkout")}
      </h1>
    </header>
    <form class="font-sans">
      <div class="purchase-container">
        <h2 class="purchase-heading2">{$t("Personal data")}</h2>

        <!-- FULL NAME AND ... -->
        <div class="purchase-item flex mb-6 flex-wrap w-full">
          <div class="w-full px-3">
            <label
              class="relative block overflow-hidden rounded-md
        border border-gray-200 bg-white-1
        px-3 pt-3 shadow-sm focus-within:border-white-2 focus-within:ring-1
        focus-within:ring-white-2 {isChanged &&
              (isErrorInput.includes('fullName') || isErrorInput.includes(''))
                ? 'ring-red-1 ring-1'
                : ''}"
              for="first-name"
            >
              <input
                class="peer h-8 w-full border-none bg-transparent bg-white-1 p-0 placeholder-transparent
        focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                type="text"
                placeholder="name"
                bind:value={tempUserCart.fullName}
                required
                id="name"
                autocomplete="given-name"
              />
              <span
                class=" absolute start-3 top-3 -translate-y-1/2 cursor-text
          bg-white-1 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2
          peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs pointer-events-none"
              >
                {$t("Name, Surname, Middle name (if exists)")}
              </span>
            </label>
          </div>
        </div>
        <!-- YOUR PHONE -->
        <div class="purchase-item flex mb-6 flex-wrap w-full">
          <div class="w-full px-3">
            <label
              class="relative block overflow-hidden rounded-md
              border border-gray-200 bg-white-1
              px-3 pt-3 shadow-sm focus-within:border-white-2 focus-within:ring-1
              focus-within:ring-white-2 {isChanged &&
              (isErrorInput.includes('phoneNumber') ||
                isErrorInput.includes(''))
                ? 'ring-red-1 ring-1'
                : ''}"
              for="phone-number"
            >
              <input
                class="peer h-8 w-full border-none bg-transparent bg-white-1 p-0 placeholder-transparent
                focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                type="tel"
                bind:value={tempUserCart.phoneNumber}
                placeholder="tel"
                id="phone"
                required
                autocomplete="tel"
              />
              <span
                class=" absolute start-3 top-3 -translate-y-1/2 cursor-text
                  bg-white-1 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2
                  peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs pointer-events-none"
              >
                {$t("Phone number")}
              </span>
            </label>
          </div>
        </div>
        <!-- YOUR EMAIL -->
        <div class="purchase-item flex mb-6 flex-wrap w-full">
          <div class="w-full px-3">
            <label
              class="relative block overflow-hidden rounded-md
            border border-gray-200 bg-white-1
            px-3 pt-3 shadow-sm focus-within:border-white-2 focus-within:ring-1
            focus-within:ring-white-2 {isChanged &&
              (isErrorInput.includes('email') || isErrorInput.includes(''))
                ? 'ring-red-1 ring-1'
                : ''}"
              for="email"
            >
              <input
                class="flex peer h-8 w-full border-none bg-transparent
              bg-white-1 p-0 placeholder-transparent
              focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                type="email"
                bind:value={tempUserCart.email}
                required
                id="email"
                autocomplete="email"
                placeholder="email@web.net"
              />

              <span
                class=" absolute start-3 top-3 -translate-y-1/2 cursor-text
              bg-white-1 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2
              peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs pointer-events-none"
              >
                {$t("Email")}
              </span>
            </label>
          </div>
        </div>
        <!-- SOCIAL NETWORK -->
        <!-- HOW TO ACCESS YOU RADIO -->
        <div>
          <fieldset
            class="purchase-item flex flex-col justify-start mb-6 mx-3 {isChanged &&
            (isErrorInput.includes('contact') || isErrorInput.includes(''))
              ? 'ring-red-1 ring-1'
              : ''}"
          >
            <legend>
              {$t("Choose contact option")} :
            </legend>

            <div>
              <input
                bind:group={tempUserCart.contactOption}
                class=" focus:ring-green-0 focus:text-green-0 text-green-0"
                type="radio"
                name="contact"
                id="tg"
                value="tg"
              />
              <label for="tg">Telegram</label>
            </div>

            <div>
              <input
                bind:group={tempUserCart.contactOption}
                class=" focus:ring-green-0 focus:text-green-0 text-green-0"
                type="radio"
                name="contact"
                id="ig"
                value="ig"
              />
              <label for="ig">Instagram</label>
            </div>

            <div>
              <input
                bind:group={tempUserCart.contactOption}
                class=" focus:ring-green-0 focus:text-green-0 text-green-0"
                type="radio"
                name="contact"
                id="fb"
                value="fb"
              />
              <label for="fb">Facebook</label>
            </div>

            <div>
              <input
                bind:group={tempUserCart.contactOption}
                class=" focus:ring-green-0 focus:text-green-0 text-green-0"
                type="radio"
                name="contact"
                id="wapp"
                value="wapp"
              />
              <label for="wapp">Whatsapp</label>
            </div>
          </fieldset>
        </div>
        <!-- USERNAME -->
        <div class="purchase-item flex mb-6 flex-wrap w-full">
          <div class="w-full px-3">
            <label
              class="relative block overflow-hidden rounded-md
        border border-gray-200 bg-white-1
        px-3 pt-3 shadow-sm focus-within:border-white-2 focus-within:ring-1
        focus-within:ring-white-2 {isChanged &&
              (isErrorInput.includes('username') || isErrorInput.includes(''))
                ? 'ring-red-1 ring-1'
                : ''}"
              for="first-name"
            >
              <input
                class="peer h-8 w-full border-none bg-transparent bg-white-1 p-0 placeholder-transparent
        focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                type="text"
                placeholder="Username"
                bind:value={tempUserCart.contactName}
                required
                id="name"
                autocomplete="given-name"
              />
              <span
                class=" absolute start-3 top-3 -translate-y-1/2 cursor-text
          bg-white-1 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2
          peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs pointer-events-none"
              >
                {$t("Username")}
              </span>
            </label>
          </div>
        </div>
      </div>
      <!-- DELIVERY -->
      <div class="purchase-container">
        <h2 class="purchase-heading2">{$t("Delivery details")}</h2>

        <!-- Country Selector with Flags -->
        <div class="purchase-item relative">
          <!-- Custom Dropdown Trigger -->
          <div class=" mb-6 w-full">
            <div class="w-full px-3">
              <button
                type="button"
                aria-haspopup="listbox"
                aria-expanded={showDropdown.toString()}
                class="w-full relative block overflow-hidden rounded-md
                border border-gray-200 bg-white-1
                px-3 py-1.5 shadow-sm focus-within:border-white-2 focus-within:ring-1
                focus-within:ring-white-2"
                on:click={() => (showDropdown = !showDropdown)}
              >
                <img
                  src={tempUserCart.country
                    ? getFlagUrl(tempUserCart.country)
                    : ""}
                  alt={tempUserCart.country}
                  class="inline-block w-5 h-3 ml-0 {tempUserCart.country
                    ? 'opacity-100'
                    : 'opacity-0'}"
                />
                {tempUserCart.country
                  ? countries.find((c) => c.code === tempUserCart.country).name
                  : "Select a country"}

                <svg
                  class="ml-[50%] w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  ><path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 9l-7 7-7-7"
                  ></path></svg
                >
              </button>
            </div>
          </div>

          <!-- Custom Dropdown Options -->
          {#if showDropdown}
            <ul
              class="absolute z-10 w-full bg-white border border-gray-300 -mt-2 max-h-60 overflow-y-auto rounded-lg"
              role="listbox"
              aria-labelledby="country"
            >
              {#each countries as country}
                <li
                  role="option"
                  aria-selected={tempUserCart.country === country.code}
                >
                  <button
                    type="button"
                    class="flex items-center p-2 hover:bg-gray-100 cursor-pointer w-full text-left"
                    on:click={() => selectCountry(country)}
                  >
                    <img
                      src={getFlagUrl(country.code)}
                      alt={country.name}
                      class="inline-block mr-2 w-5 h-3"
                    />
                    {country.name}
                  </button>
                </li>
              {/each}
            </ul>
          {/if}
        </div>

        <!-- City Input -->
        <div class="purchase-item flex mb-6 flex-wrap w-full">
          <div class="w-full px-3">
            <label
              for="city"
              class="relative block overflow-hidden rounded-md
          border border-gray-200 bg-white-1
          px-3 pt-3 shadow-sm focus-within:border-white-2 focus-within:ring-1
          focus-within:ring-white-2 {isChanged &&
              (isErrorInput.includes('city') || isErrorInput.includes(''))
                ? 'ring-red-1 ring-1'
                : ''}"
            >
              <input
                type="text"
                id="city"
                bind:value={tempUserCart.city}
                class="peer h-8 w-full border-none bg-transparent bg-white-1 p-0 placeholder-transparent
            focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                placeholder="Enter your city"
                required
              />
              <span
                class=" absolute start-3 top-3 -translate-y-1/2 cursor-text
          bg-white-1 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2
          peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs pointer-events-none"
              >
                {$t("City")}
              </span>
            </label>
          </div>
        </div>

        <!-- RADIO OPTION OF DELIVERY -->
        <fieldset
          class="purchase-item flex flex-col justify-start mb-6 mx-3 {isChanged &&
          (isErrorInput.includes('delivery') || isErrorInput.includes(''))
            ? 'ring-red-1 ring-1'
            : ''}"
        >
          <legend>{$t("Choose delivery option")} : </legend>
          <div>
            <input
              bind:group={tempUserCart.deliveryOption}
              class=" focus:ring-green-0 focus:text-green-0 text-green-0"
              type="radio"
              name="delivery"
              id=""
              value="sd"
              on:change={() => countAllPrice()}
            />
            <label class="" for="sd">{$t("Self Delivery")}</label>
          </div>

          <div>
            <input
              bind:group={tempUserCart.deliveryOption}
              class=" focus:ring-green-0 focus:text-green-0 text-green-0"
              type="radio"
              name="delivery"
              id="ep"
              value="ep"
              on:change={() => countAllPrice()}
            />
            <label for="ep">{$t("Evropochta")} (5 BYN)</label>
          </div>

          <div>
            <input
              bind:group={tempUserCart.deliveryOption}
              class=" focus:ring-green-0 focus:text-green-0 text-green-0"
              type="radio"
              name="delivery"
              id="cdek"
              value="cdek"
              on:change={() => countAllPrice()}
            />
            <label for="cdek">{$t("CDEK")} (30 BYN)</label>
          </div>

          <div>
            <input
              bind:group={tempUserCart.deliveryOption}
              class=" focus:ring-green-0 focus:text-green-0 text-green-0"
              type="radio"
              name="delivery"
              id="ems"
              value="ems"
              on:change={() => countAllPrice()}
            />
            <label for="ems">EMS (70 BYN)</label>
          </div>
        </fieldset>

        {#if !tempUserCart.deliveryOption}
          <div></div>
        {:else if tempUserCart.deliveryOption === DeliveryOptions.SelfDelivery}
          <!-- SELF-DELIVERY -->
          <div class="purchase-item">
            <p>
              {$t(
                "Place (Minsk, Zavodskoy district) and date for self-delivery are provided by our manager later",
              )}
            </p>
          </div>
        {:else}
          <!-- YOUR ADRESS -->
          <div class="purchase-item flex mb-6 flex-wrap w-full">
            <div class="w-full px-3">
              <label
                class="relative block overflow-hidden rounded-md
                  border border-gray-200 bg-white-1
                  px-3 pt-3 shadow-sm focus-within:border-white-2 focus-within:ring-1
                  focus-within:ring-white-2 {isChanged &&
                (isErrorInput.includes('address') || isErrorInput.includes(''))
                  ? 'ring-red-1 ring-1'
                  : ''}"
                for="adress"
              >
                <input
                  class="peer h-8 w-full border-none bg-transparent bg-white-1 p-0 placeholder-transparent
                  focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                  type="text"
                  placeholder="Adress"
                  bind:value={tempUserCart.adress}
                  required
                  id="adress"
                />
                <span
                  class=" absolute start-3 top-3 -translate-y-1/2 cursor-text
                    bg-white-1 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2
                    peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs pointer-events-none"
                >
                  {$t("Adress")}
                </span>
              </label>
              <p class="mt-3 text-xs italic text-gray-600">
                {$t(
                  "Specify your street, house number, appartement number, post code",
                )}
              </p>
              <p class="mt-3 text-xs italic text-gray-600">
                {$t("Specify information about post office e.g its number")}
              </p>
            </div>
          </div>
        {/if}

        <!-- POLICY -->
        <div class="flex gap-1">
          <p>{$t("You can read in details about delivery policy")} -></p>
          <a class="p-link" target="_blank" href="{base}/purchase"
            >{$t("here")}
          </a>
        </div>
      </div>

      <div class="purchase-container">
        <h2 class="purchase-heading2">{$t("Payment details")}</h2>
        <!-- PAYMENT METHOD RADIO -->
        <p class="purchase-item">
          {$t("You need to make a prepayment via cashless method in anyway.")}
        </p>
        <fieldset
          class="purchase-item flex flex-col justify-start mb-6 mx-3 {isChanged &&
          (isErrorInput.includes('payment') || isErrorInput.includes(''))
            ? 'ring-red-1 ring-1'
            : ''}"
        >
          <legend>{$t("Choose payment method")} :</legend>

          <div>
            <input
              bind:group={tempUserCart.paymentOption}
              class=" focus:ring-green-0 focus:text-green-0 text-green-0"
              type="radio"
              name="payment"
              id="clt"
              value="clt"
            />
            <label for="clt">{$t("Full prepayment via cashless")}</label>
          </div>

          <div>
            <input
              bind:group={tempUserCart.paymentOption}
              class=" focus:ring-green-0 focus:text-green-0 text-green-0"
              type="radio"
              name="payment"
              id="clp"
              value="clp"
            />
            <label for="clp"
              >{$t(
                "Cashless when picking up a good (total price minus prepayment)",
              )}</label
            >
          </div>

          <div>
            <input
              bind:group={tempUserCart.paymentOption}
              class=" focus:ring-green-0 focus:text-green-0 text-green-0"
              type="radio"
              name="payment"
              id="c"
              value="c"
            />
            <label for="c"
              >{$t(
                "With cash when picking up a good (total price minus prepayment)",
              )}</label
            >
          </div>
        </fieldset>
        <!-- IF ONLINE THEN BANNER -->
        <!-- BANNER -->
        <!-- DETAIL -->
        <!-- POLICY -->

        <!-- DISCOUNT BANNER -->
        <div class="purchase-item flex mb-6 flex-wrap w-full">
          <div class="w-full px-3">
            <label
              class="relative block overflow-hidden rounded-md
  border border-gray-200 bg-white-1
  px-3 pt-3 shadow-sm focus-within:border-white-2 focus-within:ring-1
  focus-within:ring-white-2 {isChanged &&
              (isErrorInput.includes('discount') || isErrorInput.includes(''))
                ? 'ring-red-1 ring-1'
                : ''}"
              for="discount"
            >
              <input
                class="peer h-8 w-full border-none bg-transparent bg-white-1 p-0 placeholder-transparent
  focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                type="text"
                placeholder="Discount"
                bind:value={tempUserCart.discount}
                id="discount"
              />
              <span
                class=" absolute start-3 top-3 -translate-y-1/2 cursor-text
    bg-white-1 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2
    peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs pointer-events-none"
              >
                {$t("Discount")}
              </span>
            </label>
          </div>
        </div>

        <div class=" flex gap-1">
          <p>{$t("You can read in details about purchase policy")} -></p>
          <a class="p-link" target="_blank" href="{base}/purchase"
            >{$t("here")}
          </a>
        </div>
      </div>

      <!-- PRICES -->
      <div class="px-6 py-2">
        <fieldset class="grid grid-rows-2 gap-4">
          <div class="flex items-center gap-2">
            <input
              class="focus:ring-green-0 focus:text-green-0 text-green-0"
              type="checkbox"
              id="isCreateAccout"
              value={true}
              bind:group={isCreateAccout}
            />

            <p>
              {$t(
                "Do you want to create an account (password would be sent on your email)?",
              )}
            </p>
          </div>

          <div
            class="flex items-center gap-2 {isErrorInput.includes('policy') ||
            isErrorInput.includes('')
              ? 'ring-red-1 ring-1 p-2'
              : ''}"
          >
            <input
              class=" focus:ring-green-0 focus:text-green-0 text-green-0"
              type="checkbox"
              id="isAgreePolicy"
              bind:value={isAgreePolicy}
            />

            <p class="">
              {$t("Do you agree to our policy?")} ->
              <a class="p-link" target="_blank" href="{base}/purchase"
                >{$t("here")}
              </a>
            </p>
          </div>
        </fieldset>
      </div>
      <div
        class=" border-t-2 pt-8 border-navy-2 grid w-full justify-end grid-flow-row text-base font-medium my-8 gap-3"
      >
        <div class="grid justify-end">
          <p>
            {$t("Prepayment")} :

            {prepaymentPrice} BYN
          </p>
        </div>
        <div class="grid justify-end">
          <p>
            {$t("Total")} :
            {totalСartPrice} BYN
          </p>
        </div>
      </div>

      <!-- Button -->

      <div class="grid w-full justify-center text-center">
        <SubmitButton
          bind:submitClicked
          bind:isLoading
          passedfunction={handleCart}
          text={"Purchase"}
        />
      </div>
    </form>
  </section>
</div>

<style>
  .purchase-container {
    @apply mb-12 shadow-xl p-6 bg-white-0;
  }

  .purchase-item {
    @apply mb-6;
  }

  .purchase-heading3 {
    @apply text-xl font-anonymous;
  }

  .purchase-heading2 {
    @apply text-3xl font-anonymous mb-4;
  }

  /* Add this inside your <style> tag */
  .purchase-container {
    @apply mb-12 shadow-xl p-6 bg-white-0;
  }

  .purchase-item {
    @apply mb-6;
  }

  .purchase-heading3 {
    @apply text-xl font-anonymous;
  }

  .purchase-heading2 {
    @apply text-3xl font-anonymous mb-4;
  }

  /* Custom sticky behavior */
  @media (min-width: 1024px) {
    /* lg screens and above */
    .sticky-section {
      position: sticky;
      top: 20vh; /* Adjust this value based on your navbar's height */
      bottom: 0;
      padding-top: 68;
      z-index: 10;
      max-height: calc(100vh - 35vh);
      overflow-y: auto; /* In case the content overflows */
    }
  }
</style>
