import { useEffect, useState } from "react";
import { getUserSlice } from '../../context/store/store';
import { useForm, Controller } from 'react-hook-form';
import { getProducts } from "../../helpers/axiosHelper";
import Select from 'react-select';
import { constants } from "../../context/constants";
import Spinner from 'react-bootstrap/Spinner';
import ConfirmModal from "../../shared/Modal/ConfirmModal";
import { AlertModal } from "../../shared/Modal/AlertModal";

const Accounts = () => {
    const [margin, setMargin] = useState({});
    const { headers } = getUserSlice();
    const [products, setProducts] = useState([]);
    const [messagesToModal, setMessagesToModal] = useState({ title: '', body: '' });
    const [loadingAccount, setLoadingAccount] = useState(false);
    const [alertModalShow, setAlertModalShow] = useState(false);
    const [confirmModalShow, setConfirmModalShow] = useState(false);
    const [profiles, setProfiles] = useState({ 1: { name: '', pin: '', status: true } });

    const {
        register,
        handleSubmit,
        reset,
        control,
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
        setLoadingAccount(true);
        reset();
    }

    const onConfirm = async () => {
        try {

        } catch (error) {

        }
    }

    const onCloseModal = () => {
        if (loadingAccount) {
            setAlertModalShow(false);
            setLoadingAccount(false);
        } else {
            setAlertModalShow(false);
            navigator('../accounts');
        }
    }

    const onSubstractProfile = (e, key) => {
        e.preventDefault();
        if (profiles.length === 1) return;
        const currentProfiles = { ...profiles };
        delete currentProfiles[key];
        setProfiles({ ...currentProfiles });
    }

    const onAddProfiles = (e) => {
        e.preventDefault();
        const nextKey = parseInt(Object.keys(profiles).at(Object.keys(profiles).length - 1)) + 1;
        setProfiles({ ...profiles, [nextKey]: { name: '', pin: '', status: true } });
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
                        <Controller
                            name="selectedProduct"
                            control={control}
                            defaultValue=""
                            rules={{ required: 'Selecciona una categoría.' }}
                            render={({ field, fieldState: { error } }) => (
                                <>
                                    <Select
                                        {...field}
                                        options={products}
                                        placeholder="Escribe para buscar..."
                                        isClearable
                                        onChange={(selectedOption) => field.onChange(selectedOption)}
                                    />
                                    {error && <span className="text-danger">{error.message}</span>}
                                </>
                            )}
                        />
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input
                            type="text"
                            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                            required
                            autoComplete='true'
                            id="email"
                            {...register('email', {
                                required: 'El email es requerido.',
                                pattern: {
                                    value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                                    message: 'El email es inválido.'
                                }
                            })}
                        />
                        {errors.email && <span className="text-danger">{errors.email.message}</span>}
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="password" className="form-label">Contraseña</label>
                        <input
                            type="text"
                            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                            id="password"
                            {...register('password', { required: 'La contraseña es obligatoria.' })}
                        />
                        {errors.password && <span className="text-danger">{errors.password.message}</span>}
                    </div>

                    <h5 className="d-flex justify-content-center card-title mt-5">Perfiles</h5>

                    {Object.entries(profiles).map(([key, value], cIndex) => (
                        <div className="d-flex justify-content-center align-items-center mt-4" key={cIndex}>
                            <div className="col-md-4">
                                <label htmlFor="name" className="form-label">Nombre ({key})</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    onChange={(e) => setProfiles({ ...profiles, [key]: { ...profiles[key], name: e.target.value } })}
                                    value={profiles[key].name}
                                />
                            </div>
                            <div className="col-md-4 ms-3">
                                <label htmlFor="pin" className="form-label">PIN ({key})</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    onChange={(e) => setProfiles({ ...profiles, [key]: { ...profiles[key], pin: e.target.value } })}
                                    value={profiles[key].pin}
                                />
                            </div>
                            <div className="d-flex align-items-end mb-3 h-100 ms-3 form-check">
                                <input
                                    type="checkbox"
                                    className="form-check-input me-1"
                                    defaultChecked
                                    onChange={(e) => setProfiles({ ...profiles, [key]: { ...profiles[key], status: e.target.value } })}
                                    value={profiles[key].status}
                                />
                                <label htmlFor="status" className="form-check-label">Estado (Activo/Inactivo)</label>
                            </div>
                            <div className="d-flex align-items-end h-100">
                                <button
                                    className="btn btn-danger ms-3 mb-1 bi bi-ban"
                                    style={{ height: '50%' }}
                                    onClick={(e) => onSubstractProfile(e, key)}
                                >
                                </button>
                            </div>
                        </div>
                    ))}

                    <div className="text-center mt-5">
                        <button
                            className="btn btn-primary"
                            style={{ width: '10rem' }}
                            onClick={(e) => onAddProfiles(e)}
                        >
                            Agregar (+)
                        </button>
                    </div>


                    <div className="text-center mt-5">
                        <button type="reset" className="btn btn-secondary me-2">Limpiar</button>
                        <button type="submit" className="btn btn-primary" disabled={loadingAccount} style={{ width: '10rem' }}>
                            Crear cuenta
                            {loadingAccount && <Spinner animation="border" role="status" size="sm" className='ms-2' />}
                        </button>
                    </div>
                </form>

            </div>
            <ConfirmModal
                show={confirmModalShow}
                onHide={() => setConfirmModalShow(false)}
                title={'Confirmaci\u00f3n de creaci\u00f3n'}
                bodyText={'¿Estás seguro que quieres crear el servicio?'}
                size='md'
                closeButton={0}
                onConfirm={onConfirm}
                loadingReq={loadingAccount}
            />
            <AlertModal
                show={alertModalShow}
                onHide={() => onCloseModal()}
                title={messagesToModal.title}
                bodyText={messagesToModal.body}
                size='md'
                closeButton={0}
                timeout={true}
            />
        </>
    );
}

export default Accounts;