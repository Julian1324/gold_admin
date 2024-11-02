const API_URL = process.env.REACT_APP_API_URL;
const USER_SIGNIN = '/user/signinAdm';
const USER_INFO = '/user';
const USER_SETPASSWORD = '/userPassword';
const USER_LOGGED = '¡Bienvenid@ a Gold Admin!';
const USER_SESSION_EXPIRED = 'Sesión caducada, por favor inicia sesión otra vez.';
const USER_MOVEMENTS = '/myMovements';
const GET_CATEGORIES = '/categories';
const GET_PRODUCTS_BY_CATEGORY = '/productsByCategory';
const GET_PRODUCT_BY_ID = '/product';
const GET_ALL_PRODUCTS = '/products';
const GET_CART_PRODUCTS = '/cartProducts';
const QUERY_PRODUCTS = '/queryProducts';
const MODAL_TITLE_SUCCCESS = '¡Se ha realizado con éxito!';
const MODAL_TITLE_ERROR = '¡Oops, error en la solicitud!';
const MODAL_TITLE_SIGNOUT = 'Desconexión exitosa.';
const MODAL_BODY_SIGNOUT = 'Hasta luego, vuelve pronto...';
const MODAL_ITEM_ADDED = 'Se ha agregado el item al carrito.';
const PARAMS_CATEGORY_ID = 'category_id=';
const PARAMS_PAGE = 'page=';
const PARAMS_PRODUCT = 'product=';
const PARAMS_QUERY_PRODUCT = 'productQuery=';
const PRODUCT_STATUS_ACTIVE = 'active';
const PRODUCT_STATUS_INACTIVE = 'inactive';
const LANGUAGE_TAG = 'es-CO';
const WIDTH_MOBILE = 500;
const KEY_STORAGE_BASE = 'GLDST0';

export const constants = Object.freeze({
    API_URL,
    USER_SIGNIN,
    USER_INFO,
    USER_SETPASSWORD,
    USER_LOGGED,
    USER_SESSION_EXPIRED,
    GET_CATEGORIES,
    GET_PRODUCTS_BY_CATEGORY,
    GET_PRODUCT_BY_ID,
    GET_ALL_PRODUCTS,
    GET_CART_PRODUCTS,
    QUERY_PRODUCTS,
    MODAL_TITLE_SUCCCESS,
    MODAL_TITLE_ERROR,
    MODAL_TITLE_SIGNOUT,
    MODAL_BODY_SIGNOUT,
    MODAL_ITEM_ADDED,
    PARAMS_CATEGORY_ID,
    PARAMS_PAGE,
    PARAMS_PRODUCT,
    PARAMS_QUERY_PRODUCT,
    PRODUCT_STATUS_ACTIVE,
    PRODUCT_STATUS_INACTIVE,
    LANGUAGE_TAG,
    USER_MOVEMENTS,
    WIDTH_MOBILE,
    KEY_STORAGE_BASE
});