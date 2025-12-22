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
const UPLOAD_IMAGE = '/uploadImage';
const ACCOUNT_CREATED = '\u00A1Cuenta creada exitosamente!';
const UPDATED_ACCOUNT = '\u00A1Cuenta actualizada exitosamente!';
const ACCOUNT_STATUS = { true: 'Activo', false: 'Inactivo' };
const CATEGORY_STATUS = { ...ACCOUNT_STATUS };
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
const MAX_VISIBLE_PAGES = 5;
const USER_OPTIONS = {
    admin: { recharges: true, accounts: true },
    superadmin: { services: true, recharges: true, accounts: true, categories: true }
};
const CATEGORY_STATUSES = { true: 'Activa', false: 'Inactiva', undefined: 'No disponible' };
const KEY_STORAGE_BASE = 'GLDST0';
const GET_CATEGORY = '/category';
const DELETE_CATEGORY = '/category';
const GET_ACTIVE_CATEGORIES = '/categories/active'
const MODAL_CONFIRM_CREATION = "¿Estás seguro de que deseas crear esta categoría?";
const MODAL_CONFIRM_CREATE_CATEGORY = "Esta acción agregará una nueva categoría a la lista.";
const CATEGORY_UPDATED = "La categoría ha sido actualizada correctamente.";
const MODAL_TITLE_DELETE = "Eliminar categoría";
const MODAL_BODY_DELETE = "¿Estás seguro de que deseas eliminar esta categoría?";
const MODAL_TILE_DELETE_SUCCESS = "¡Categoría eliminada exitosamente!";
const CATEGORY_DELETED_SUCCESSFULLY = "La categoría ha sido eliminada correctamente.";
const CATEGORY_HAS_PRODUCTS = "No se puede eliminar la categoría porque tiene productos asociados.";
const MODAL_BODY_ERROR = "Ha ocurrido un error inesperado.";
const CATEGORY_NOT_AVAILABLE = "Categoria en estado inactivo, no disponible para su uso.";
const CATEGORY_CREATED_SUCCESSFULLY = "La categoría ha sido creada exitosamente.";

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
    CATEGORY_STATUS,
    UPLOAD_IMAGE,
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
    MAX_VISIBLE_PAGES,
    USER_OPTIONS,
    KEY_STORAGE_BASE,
    MODAL_CONFIRM_CREATION,
    MODAL_CONFIRM_CREATE_CATEGORY,
    CATEGORY_UPDATED,
    MODAL_TITLE_DELETE,
    MODAL_BODY_DELETE,
    MODAL_TILE_DELETE_SUCCESS,
    CATEGORY_DELETED_SUCCESSFULLY,
    CATEGORY_HAS_PRODUCTS,
    MODAL_BODY_ERROR,
    GET_CATEGORY,
    DELETE_CATEGORY,
    GET_ACTIVE_CATEGORIES,
    CATEGORY_NOT_AVAILABLE,
    CATEGORY_CREATED_SUCCESSFULLY,
    CATEGORY_STATUSES
});
