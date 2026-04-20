import { constants } from "../context/constants";
import axiosInstance from "./axiosInstance";
import axios from "axios";

export const signInUser = async ({ email, password }) => {
    try {
        const response = await axiosInstance.post(
            `${constants.USER_SIGNIN}`,
            { email, password }
        );
        if (response.status === 200) return {
            data: response.data,
            loadingLogin: false,
            alertModalShow: true,
        }
    } catch (error) {
        throw error;
    }
}

export const getUser = async ({ headers }) => {
    try {
        const response = await axiosInstance.get(
            `${constants.API_URL + constants.USER_INFO}`,
            { headers }
        );
        if (response.status === 200) return {
            data: response.data,
            loadingReq: false,
        }
    } catch (error) {
        throw error;
    }
}

export const getCategories = async ({ page, limit, headers } = {}) => {
    try {
        const url = page && limit
            ? `${constants.GET_CATEGORIES}?page=${page}&limit=${limit}`
            : constants.GET_CATEGORIES;
        const response = await axiosInstance.get(url, { headers });
        if (response.status === 200) return {
            data: response.data,
        };
    } catch (error) {
        throw error;
    }
};

export const createCategory = async (categoryDTO, headers) => {
    try {
        const response = await axiosInstance.post(
            constants.GET_CATEGORY,
            categoryDTO,
            { headers }
        );
        if (response.status === 200 && response.data) {
            return {
                data: response.data,
                loadingReq: false,
                alertModalShow: true
            };
        } else {
            throw new Error("La respuesta del servidor no es válida");
        }
    } catch (error) {
        if (error.response) {
            console.log(error.response)
            throw new Error('Error en la solicitud: ' + error.response.data);
        } else if (error.request) {
            throw new Error("No se recibió respuesta del servidor");
        } else {
            throw new Error(`Error en la solicitud: ${error.message}`);
        }
    }
};
export const updateCategory = async (categoryDTO, headers) => {
    try {
        const response = await axiosInstance.put(
            constants.GET_CATEGORY, categoryDTO,
            { headers }
        );
        if (response.status === 200) {
            return {
                data: response.data,
                loadingReq: false,
                alertModalShow: true
            };
        }
    } catch (error) {
        throw error;
    }
}
export const deleteCategory = async (id, headers) => {
    try {
        const response = await axiosInstance.delete(
            `${constants.DELETE_CATEGORY}/${id}`,
            { headers }
        );

        if (response.status === 200) {
            return {
                success: true,
                message: constants.CATEGORY_DELETED,
                data: response.data,
            };
        } else {
            throw new Error("La respuesta del servidor no es válida");
        }
    } catch (error) {
        if (error.response) {
            if (error.response.status === 400 && error.response.data.message === constants.CATEGORY_HAS_PRODUCTS) {
                throw new Error(constants.CATEGORY_HAS_PRODUCTS);
            } else {
                throw new Error(error.response.data.message || constants.MODAL_BODY_ERROR);
            }
        } else if (error.request) {
            throw new Error("No se recibió respuesta del servidor");
        } else {
            throw new Error(`Error en la solicitud: ${error.message}`);
        }
    }
};

export const getProduct = async ({ _id }) => {
    try {
        const response = await axiosInstance.get(
            `${constants.API_URL + constants.GET_PRODUCT_BY_ID}?${constants.PARAMS_PRODUCT + _id}`,
        )
        if (response.status === 200) return {
            data: response.data,
            loadingReq: false,
        }
    } catch (error) {
        throw error;
    }
}

export const getMyMovements = async ({ headers, page }) => {
    try {
        const response = await axiosInstance.get(
            `${constants.API_URL + constants.USER_MOVEMENTS}?${constants.PARAMS_PAGE + page}`,
            { headers }
        );
        if (response.status === 200) return {
            data: response.data,
            loadingReq: false,
        }
    } catch (error) {
        throw error;
    }
}

export const queryProducts = async ({ query }) => {
    try {
        const response = await axiosInstance.get(
            `${constants.API_URL + constants.QUERY_PRODUCTS}?${constants.PARAMS_QUERY_PRODUCT + query}`,
        );
        if (response.status === 200) return {
            data: response.data,
            loadingReq: false,
        }
    } catch (error) {
        throw error;
    }
}

export const createProduct = async (productDTO, headers) => {
    try {
        const response = await axiosInstance.post(
            `${constants.API_URL + constants.CREATE_PRODUCT}`,
            productDTO,
            { headers }
        );
        if (response.status === 200) return {
            data: response.data,
            loadingReq: false,
            alertModalShow: true
        }
    } catch (error) {
        throw error;
    }
}

export const getAllProducts = async ({ page, filter = 'all' }) => {
    try {
        const response = await axiosInstance.get(
            `${constants.API_URL + constants.GET_ALL_PRODUCTS}?${constants.PARAMS_PAGE + page}&filter=${filter}`,
        )
        if (response.status === 200) return {
            data: response.data,
            loadingReq: false,
        }
    } catch (error) {
        throw error;
    }
}

export const updateProduct = async (productDTO, headers) => {
    try {
        const response = await axiosInstance.put(
            `${constants.API_URL + constants.CREATE_PRODUCT}`,
            productDTO,
            { headers }
        );
        if (response.status === 200) return {
            data: response.data,
            loadingReq: false,
            alertModalShow: true
        }
    } catch (error) {
        throw error;
    }
}

export const rechargeWallet = async (email, amount, headers) => {
    try {
        const response = await axiosInstance.post(
            `${constants.API_URL + constants.POST_RECHARGE_WALLET}`,
            { email, amount },
            { headers }
        );
        if (response.status === 200) return {
            data: response.data,
            loadingReq: false,
            alertModalShow: true
        }
    } catch (error) {
        throw error;
    }
}

export const rechargeMovements = async ({ page, headers }) => {
    try {
        const response = await axiosInstance.get(
            `${constants.API_URL + constants.GET_ALL_RECHARGES}?${constants.PARAMS_PAGE + page}`,
            { headers }
        )
        if (response.status === 200) return {
            data: response.data,
            loadingReq: false,
        }
    } catch (error) {
        throw error;
    }
}

export const getTheRecharger = async ({ responsible, headers }) => {
    try {
        const response = await axiosInstance.get(
            `${constants.API_URL + constants.GET_THE_RECHARGER}?${constants.PARAMS_RESPONSIBLE + responsible}`,
            { headers }
        )
        if (response.status === 200) return {
            data: response.data,
            loadingReq: false,
        }
    } catch (error) {
        throw error;
    }
}

export const getProducts = async ({ headers }) => {
    try {
        const response = await axiosInstance.get(
            `${constants.API_URL + constants.GET_PRODUCTS}`,
            { headers }
        )
        if (response.status === 200) return {
            data: response.data,
            loadingReq: false,
        }
    } catch (error) {
        throw error;
    }
}

export const getAccountsPage = async ({ headers, page, filter = 'all', filters = {} }) => {
    try {
        const params = new URLSearchParams({
            [constants.PARAMS_PAGE.replace('=', '')]: page,
            filter
        });

        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') params.append(key, value);
        });

        const response = await axiosInstance.get(
            `${constants.API_URL + constants.GET_ACCOUNTS}?${params.toString()}`,
            { headers }
        )
        if (response.status === 200) return {
            data: response.data,
            loadingReq: false,
        }
    } catch (error) {
        throw error;
    }
}

export const createAccount = async ({ headers, accountDTO }) => {
    try {
        const response = await axiosInstance.post(
            `${constants.API_URL + constants.CREATE_ACCOUNT}`,
            { ...accountDTO },
            { headers }
        )
        if (response.status === 200) return {
            data: response.data,
            loadingReq: false,
        }
    } catch (error) {
        throw error;
    }
}

export const updateAccount = async ({ headers, _id, productID, email, password, profiles, status }) => {
    try {
        const response = await axiosInstance.post(
            `${constants.API_URL + constants.UPDATE_ACCOUNT}`,
            { _id, productID, email, password, profiles, status },
            { headers }
        )
        if (response.status === 200) return {
            data: response.data,
            loadingReq: false,
        }
    } catch (error) {
        throw error;
    }
}

export const deleteProduct = async ({ _id, headers, confirmHistorical = false }) => {
    try {
        const response = await axiosInstance.delete(
            `${constants.API_URL + constants.CREATE_PRODUCT}/${_id}?confirmHistorical=${confirmHistorical}`,
            { headers }
        );

        if (response.status === 200) return {
            data: response.data,
            loadingReq: false,
            alertModalShow: true
        };
    } catch (error) {
        throw error;
    }
}

export const restoreProduct = async ({ _id, headers }) => {
    try {
        const response = await axiosInstance.put(
            `${constants.API_URL + constants.CREATE_PRODUCT}/restore/${_id}`,
            {},
            { headers }
        );

        if (response.status === 200) return {
            data: response.data,
            loadingReq: false,
            alertModalShow: true
        };
    } catch (error) {
        throw error;
    }
}

export const uploadImage = async (file, headers) => {
    try {
        const formData = new FormData();
        formData.append('image', file);

        const response = await axios.post(
            `${constants.API_URL + constants.UPLOAD_IMAGE}`,
            formData,
            {
                headers: {
                    ...headers,
                    'Content-Type': 'multipart/form-data'
                }
            }
        );
        if (response.status === 200) return {
            data: response.data,
            loadingReq: false,
            alertModalShow: true
        }
    } catch (error) {
        throw error;
    }
}
