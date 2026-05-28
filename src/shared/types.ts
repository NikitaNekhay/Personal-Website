import { base } from "$app/paths";
import type { User } from "firebase/auth";

export enum Language {
    English = 'en',
    Russian = 'ru',
  }

export enum ContactOptions{
    Telegram = "tg",
    Instagram = "ig",
    Facebook = "fb",
    Whatsapp = "wapp",
}

export enum DeliveryOptions{
    SelfDelivery = "sd",
    EMS ="ems",
    Cdek = "cdek",
    Evropochta = "ep",
}


export enum PaymentOptions {
    Cash = "c",
    CashLessTotal = "clt",
    CashLessParts = "clp",
}

  export type Slide = {
    img: string;
  };

  export enum EmailSubjects {
    NewAccount = "Create Account at NEKHAY NIKITA",
    ProceedOrder = "Proceed Order at NEKHAY NIKITA",
    CompleteFullPaymentOrder = "Complete Full Payment Order at NEKHAY NIKITA",
    CompletePrePaymentOrder ="Complete PrePayment Order at NEKHAY NIKITA",
    OrderCredentials = "Order Credentials at NEKHAY NIKITA"
  }

  export enum EmailText {
    EmptyCart = "Your cart is currently empty. Please add some products before proceeding.",
    NewAccount = "Hello user. You have created account at NEKHAY NIKITA. This is your password: ",
    ProceedOrder = `Hello user! This is your check with information about your order:\n\n`,
    CompleteFullPaymentOrder = "",
    CompletePrePaymentOrder ="",
  }

  export enum Errors {
    VerifyPass = "Error while verifying your current pass!",
    RepeatPass = "Your passwords don't match each other!",
    SmallPass = "Your passwords must contain out of 6 symbols!",
    EmptyInput = "Your input is empty, fill it the right way!",
    Authentication = "Error while Authenticating user! Please check your credentials, again.",
    Register = "Error while creating user account!",
    Logout = "",

    EditProfile = "Error while editing profile!",
    EditCredentialProfile = "",
    DeleteProfile="Error while deleting the user!",
    DeleteProfileAuth = "Error while deleting user's credential!",
    DeleteProfileStore = "Error while deleting user in db!",


    AddComment ="Error while adding a comment!",
    SaveComment = "Error while saving comments!",
    EditComment = "Error while editing comments!",
    DeleteComment = "Error while deleting comments!",

    CreatePost = "",
    EditPost="",
    DeletePost = "",

    NoUserToAddToCart = "Error while adding item to cart, because there is no user",
    AddToCart = "Error while adding item to cart!",
    DeleteAtCart = "",


    PurchaseForm = "Something at filling purchase form!",

    PurchaseFormAttention = "Please, check all forms to be filled properly (Discount input is not required one).",
    PurchaseFormName = "Please provide your full name. Ensure it is correct.",
    PurchaseFormUsername = "Please provide a username. Ensure it is correct.",
    PurchaseFormEmail = "Please provide a valid email address.",
    PurchaseFormAdress = "Please provide your full address, including street and number.",
    PurchaseFormPhone = "Phone number is incorrect or missing.  ",
    PurchaseFormDiscount = "Discount code is invalid. (If you do not have one, you can leave this field empty.)",
    PurchaseFormCity = "Please provide name of your city, it should be correct.",
    PurchaseSuccess ="Please check your detail again",
    PurchaseFormContact = "Please choose a contact option.",
    PurchaseFormDelivery = "Please choose a delivery option.",
    PurchaseFormPayment = "Please choose a payment option.",
    PurchaseFormPolicyAgree = "Please, agree our policy.",

    FetchUser = "Error while fetching user's info!",
    FetchUsers = "Error while fetching info about users!",
    FetchProfile ="Error while fetching user's profile!",
    FetchPost = "Error while fetching the post's info!",
    FetchPosts = "Error while fetching posts!",
    FetchComments = "Error while fetching comments!",
    FetchCart = "",

    InternalError = "This is internal error, please, contact admin to fix the error",
    BadPass ="Error while creating svelte component (passing values)",
  }

export enum SortMethod{
    Default = 0,
    NameAlpha = 1,
    EmailAlpha = 2,
    CartLow = 3,
    CartHigh = 4,
}

export interface ProductType {
    id:string,
    images:string[],
    price:string,
    title:string,
    description: Map<string,string|string[]>,
    isArchive:boolean,
    section:string,

} 

export interface UserCartType {
    fullName:string,
    phoneNumber:string,
    email:string,
    contactOption: ContactOptions,
    contactName: string,
    deliveryOption:DeliveryOptions,
    country:string,
    city:string,
    adress:string,
    paymentOption:PaymentOptions,
    discount:string,
    cart:ProductType[],
    
}

export interface MessageType {
    cid:string,
    id:string,
    comment:string,
    post:string,
}

export interface AuthStoreType {
    user:User | null,
    loading:boolean,
    data:UserDataType,
} 

export interface UserDataType {
    id:string,
    name: string ,
    email: string ,
    phone: string ,
    country: string ,
    city:string,
    adress:string,
    description: string,
    messages: MessageType[],
    cart:ProductType[],
} 



export const nonAuthRoutes = [
    `${base}/`,
    `${base}/about`,
    `${base}/contact`,
    `${base}/login`,
    `${base}/shop`,
    `${base}/works`,
    `${base}/posts`,
    `${base}/profile/shoppingcart`,
    `${base}/slider`,
];

export const AdminRoutes = [
    `${base}/dashboard`,
    `${base}/stat`,
    `${base}/create`,
    `${base}/posts`,
    `${base}/slider-dashboard`,
    `${base}/photos-dashboard`,
];

export interface SliderPhoto {
    id: string;
    name: string;
    url: string;
    order: number;
    createdAt: string;
}

/** Years available in the home page collection filter */
export const PHOTO_COLLECTION_YEARS = [2026, 2025, 2024, 2023] as const;
export type PhotoCollectionYear = (typeof PHOTO_COLLECTION_YEARS)[number];

export const PHOTO_REVEAL_DIRECTIONS = ['left', 'right', 'top', 'bottom'] as const;
export type PhotoRevealDirection = (typeof PHOTO_REVEAL_DIRECTIONS)[number];

export const PHOTO_OBJECT_POSITIONS = [
    'center center',
    'center top',
    'center bottom',
    'left center',
    'right center',
    'left top',
    'right top',
    'left bottom',
    'right bottom'
] as const;
export type PhotoObjectPosition = (typeof PHOTO_OBJECT_POSITIONS)[number];

export interface PhotoManifestEntry {
    id: string;
    slug: string;
    title: string;
    order: number;
    /** Collection year shown in home filter (e.g. 2023–2026) */
    collectionNumber: number;
    original: string;
    thumb: string;
    width: number;
    height: number;
    /** CSS object-position value used to tune the visible crop on the home gallery */
    objectPosition: PhotoObjectPosition;
    /** Horizontal focal point percentage, 0 = left, 100 = right */
    positionX: number;
    /** Vertical focal point percentage, 0 = top, 100 = bottom */
    positionY: number;
    /** Extra zoom/crop strength. 1 = natural cover, 100 = strongest zoom. */
    scalePercent: number;
    /** Desktop/tablet scroll reveal direction. Mobile always reveals from bottom. */
    revealFrom: PhotoRevealDirection;
    uploadedAt: string;
}

export const PHOTO_POSITION_MIN = 0;
export const PHOTO_POSITION_MAX = 100;
export const PHOTO_SCALE_MIN = 1;
export const PHOTO_SCALE_MAX = 100;
export const DEFAULT_PHOTO_POSITION = 50;
export const DEFAULT_PHOTO_SCALE = 1;

export function defaultCollectionNumber(): number {
    const year = new Date().getFullYear();
    return (PHOTO_COLLECTION_YEARS as readonly number[]).includes(year)
        ? year
        : PHOTO_COLLECTION_YEARS[PHOTO_COLLECTION_YEARS.length - 1];
}

export function normalizePhotoEntry(
    entry: Partial<PhotoManifestEntry> & Pick<PhotoManifestEntry, 'id' | 'slug'>
): PhotoManifestEntry {
    const collectionNumber =
        typeof entry.collectionNumber === 'number' &&
        (PHOTO_COLLECTION_YEARS as readonly number[]).includes(entry.collectionNumber)
            ? entry.collectionNumber
            : defaultCollectionNumber();

    const fallbackPosition = getPercentsFromObjectPosition(entry.objectPosition);

    return {
        id: entry.id,
        slug: entry.slug,
        title: entry.title ?? entry.slug,
        order: entry.order ?? 0,
        collectionNumber,
        original: entry.original ?? `/photos/originals/${entry.slug}.webp`,
        thumb: entry.thumb ?? `/photos/thumbs/${entry.slug}.webp`,
        width: entry.width ?? 0,
        height: entry.height ?? 0,
        objectPosition: isPhotoObjectPosition(entry.objectPosition)
            ? entry.objectPosition
            : 'center center',
        positionX: normalizeRangeNumber(
            entry.positionX,
            fallbackPosition.x,
            PHOTO_POSITION_MIN,
            PHOTO_POSITION_MAX
        ),
        positionY: normalizeRangeNumber(
            entry.positionY,
            fallbackPosition.y,
            PHOTO_POSITION_MIN,
            PHOTO_POSITION_MAX
        ),
        scalePercent: normalizeRangeNumber(
            entry.scalePercent,
            DEFAULT_PHOTO_SCALE,
            PHOTO_SCALE_MIN,
            PHOTO_SCALE_MAX
        ),
        revealFrom: isPhotoRevealDirection(entry.revealFrom) ? entry.revealFrom : 'bottom',
        uploadedAt: entry.uploadedAt ?? new Date().toISOString()
    };
}

export function isPhotoCollectionYear(value: number): value is PhotoCollectionYear {
    return (PHOTO_COLLECTION_YEARS as readonly number[]).includes(value);
}

export function isPhotoRevealDirection(value: unknown): value is PhotoRevealDirection {
    return (
        typeof value === 'string' &&
        (PHOTO_REVEAL_DIRECTIONS as readonly string[]).includes(value)
    );
}

export function isPhotoObjectPosition(value: unknown): value is PhotoObjectPosition {
    return (
        typeof value === 'string' &&
        (PHOTO_OBJECT_POSITIONS as readonly string[]).includes(value)
    );
}

export function isPhotoPositionPercent(value: unknown): value is number {
    return isRangeNumber(value, PHOTO_POSITION_MIN, PHOTO_POSITION_MAX);
}

export function isPhotoScalePercent(value: unknown): value is number {
    return isRangeNumber(value, PHOTO_SCALE_MIN, PHOTO_SCALE_MAX);
}

function isRangeNumber(value: unknown, min: number, max: number): value is number {
    return typeof value === 'number' && Number.isFinite(value) && value >= min && value <= max;
}

function normalizeRangeNumber(
    value: unknown,
    fallback: number,
    min: number,
    max: number
): number {
    if (!isRangeNumber(value, min, max)) return fallback;
    return Math.round(value);
}

function getPercentsFromObjectPosition(value: unknown): { x: number; y: number } {
    if (!isPhotoObjectPosition(value)) {
        return { x: DEFAULT_PHOTO_POSITION, y: DEFAULT_PHOTO_POSITION };
    }

    const [horizontal, vertical] = value.split(' ');
    const x = horizontal === 'left' ? 0 : horizontal === 'right' ? 100 : 50;
    const y = vertical === 'top' ? 0 : vertical === 'bottom' ? 100 : 50;

    return { x, y };
}
