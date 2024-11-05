const API_URL = process.env.REACT_APP_API_URL;
const USER_SIGNIN = '/user/signinAdm';
const USER_INFO = '/user';
const USER_LOGGED = '¡Bienvenid@ a Gold Admin!';
const USER_SESSION_EXPIRED = 'Sesión caducada, por favor inicia sesión otra vez.';
const GET_CATEGORIES = '/categories';
const GET_PRODUCTS_BY_CATEGORY = '/productsByCategory';
const GET_PRODUCT_BY_ID = '/product';
const CREATE_PRODUCT = '/product';
const PRODUCT_CREATED = '¡Servicio creado exitosamente!';
const PRODUCT_UPDATED = '¡Servicio actualizado exitosamente!';
const GET_ALL_PRODUCTS = '/products';
const QUERY_PRODUCTS = '/queryProducts';
const MODAL_TITLE_SUCCCESS = '¡Se ha realizado con éxito!';
const MODAL_TITLE_ERROR = '¡Oops, error en la solicitud!';
const MODAL_TITLE_SIGNOUT = 'Desconexión exitosa.';
const MODAL_BODY_SIGNOUT = 'Hasta luego, vuelve pronto...';
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
    USER_LOGGED,
    USER_SESSION_EXPIRED,
    GET_CATEGORIES,
    GET_PRODUCTS_BY_CATEGORY,
    GET_PRODUCT_BY_ID,
    CREATE_PRODUCT,
    PRODUCT_CREATED,
    PRODUCT_UPDATED,
    GET_ALL_PRODUCTS,
    QUERY_PRODUCTS,
    MODAL_TITLE_SUCCCESS,
    MODAL_TITLE_ERROR,
    MODAL_TITLE_SIGNOUT,
    MODAL_BODY_SIGNOUT,
    PARAMS_CATEGORY_ID,
    PARAMS_PAGE,
    PARAMS_PRODUCT,
    PARAMS_QUERY_PRODUCT,
    PRODUCT_STATUS_ACTIVE,
    PRODUCT_STATUS_INACTIVE,
    LANGUAGE_TAG,
    WIDTH_MOBILE,
    KEY_STORAGE_BASE
});