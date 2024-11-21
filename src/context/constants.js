const API_URL = process.env.REACT_APP_API_URL;
const USER_SIGNIN = '/user/signinAdm';
const USER_INFO = '/user';
const USER_LOGGED = '\u00A1Bienvenid@ a Gold Admin!';
const USER_SESSION_EXPIRED = 'Sesión caducada, por favor inicia sesión otra vez.';
const GET_CATEGORIES = '/categories';
const GET_PRODUCTS_BY_CATEGORY = '/productsByCategory';
const GET_PRODUCT_BY_ID = '/product';
const CREATE_PRODUCT = '/product';
const PRODUCT_CREATED = '\u00A1Servicio creado exitosamente!';
const PRODUCT_UPDATED = '\u00A1Servicio actualizado exitosamente!';
const GET_ALL_PRODUCTS = '/products';
const GET_ALL_RECHARGES = '/rechargeMovements';
const GET_THE_RECHARGER = '/getTheRecharger';
const GET_PRODUCTS = '/getProducts';
const GET_ACCOUNTS = '/getAccountsPage';
const CREATE_ACCOUNT = '/createAccount';
const UPDATE_ACCOUNT = '/updateAccount';
const ACCOUNT_CREATED = '\u00A1Cuenta creada exitosamente!';
const UPDATED_ACCOUNT = '\u00A1Cuenta actualizada exitosamente!';
const ACCOUNT_STATUS = { true: 'Activo', false: 'Inactivo' };
const QUERY_PRODUCTS = '/queryProducts';
const MODAL_TITLE_SUCCCESS = '\u00A1Se ha realizado con \u00E9xito!';
const MODAL_TITLE_ERROR = '\u00A1Oops, error en la solicitud!';
const MODAL_TITLE_SIGNOUT = 'Desconexión exitosa.';
const MODAL_BODY_SIGNOUT = 'Hasta luego, vuelve pronto...';
const PARAMS_CATEGORY_ID = 'category_id=';
const PARAMS_PAGE = 'page=';
const PARAMS_RESPONSIBLE = 'responsible=';
const PARAMS_PRODUCT = 'product=';
const PARAMS_QUERY_PRODUCT = 'productQuery=';
const PRODUCT_STATUS_ACTIVE = 'active';
const PRODUCT_STATUS_INACTIVE = 'inactive';
const LANGUAGE_TAG = 'es-CO';
const CURRENCY_NAME = 'COP';
const WIDTH_MOBILE = 500;
const POST_RECHARGE_WALLET = '/rechargeWallet';
const USER_RECHARGE_SUCCESSFULL = '¡Recarga realizada exitosamente!';
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
    GET_ALL_RECHARGES,
    GET_THE_RECHARGER,
    GET_PRODUCTS,
    GET_ACCOUNTS,
    CREATE_ACCOUNT,
    UPDATE_ACCOUNT,
    ACCOUNT_CREATED,
    UPDATED_ACCOUNT,
    ACCOUNT_STATUS,
    QUERY_PRODUCTS,
    MODAL_TITLE_SUCCCESS,
    MODAL_TITLE_ERROR,
    MODAL_TITLE_SIGNOUT,
    MODAL_BODY_SIGNOUT,
    PARAMS_CATEGORY_ID,
    PARAMS_PAGE,
    PARAMS_RESPONSIBLE,
    PARAMS_PRODUCT,
    PARAMS_QUERY_PRODUCT,
    PRODUCT_STATUS_ACTIVE,
    PRODUCT_STATUS_INACTIVE,
    LANGUAGE_TAG,
    CURRENCY_NAME,
    WIDTH_MOBILE,
    POST_RECHARGE_WALLET,
    USER_RECHARGE_SUCCESSFULL,
    KEY_STORAGE_BASE
});