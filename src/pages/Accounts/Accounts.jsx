import { useEffect, useState } from "react";
import { getUserSlice } from '../../context/store/store';
import { useForm } from 'react-hook-form';
import { getProducts } from "../../helpers/axiosHelper";
import Select from 'react-select';
import { constants } from "../../context/constants";

const Accounts = () => {
    const [margin, setMargin] = useState({});
    const { headers } = getUserSlice();
    const [products, setProducts] = useState([]);
    const [messagesToModal, setMessagesToModal] = useState({ title: '', body: '' });
    const [alertModalShow, setAlertModalShow] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm();

    useEffect(() => {
        const marginLeft = document.querySelector('.sidebar').clientWidth;
        const marginTop = document.querySelector('.header').clientHeight;
        if (marginLeft && marginTop) setMargin({
            marginLeft,
            marginTop
        });
        if (!Object.keys(headers).length) return;
        const getTheProducts = async () => {
            try {
                const response = await getProducts({ headers });
                const mappedProducts = (product) => ({ ...product, value: product._id, label: product.name });
                const updatedProducts = response.data.map(mappedProducts);
                setProducts(updatedProducts);
            } catch (error) {
                console.log('error:', error);
                const myBody = error?.response?.data.includes('jwt') ? constants.USER_SESSION_EXPIRED : error?.response?.data;
                setMessagesToModal({ title: constants.MODAL_TITLE_ERROR, body: myBody });
                setAlertModalShow(true);
            }

        }

        getTheProducts();
    }, [headers]);

    const onSubmit = async (form) => {
        console.log(form);
        reset();
    }

    return (
        <>
            <div
                className="card-body p-4 rounded bg-white"
                style={
                    {
                        marginLeft: (margin.marginLeft ? margin.marginLeft : 0) + 30,
                        marginTop: (margin.marginTop ? margin.marginTop : 0) + 30,
                        width: '75%',
                    }
                }
            >

                <h4 className="card-title">Crear cuentas</h4>

                <form className="row g-3 mt-5" onSubmit={handleSubmit(onSubmit)}>
                    <div className="col-md-4">
                        <label htmlFor="inputProducts" className="form-label">Servicio</label>
                        <Select
                            options={products}
                            placeholder="Escribe para buscar..."
                            isClearable
                        />
                    </div>
                </form>

            </div>
        </>
    );
}

export default Accounts;