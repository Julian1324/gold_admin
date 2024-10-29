import { useState } from 'react';
import './Signin.css';
import Spinner from 'react-bootstrap/Spinner';
import goldServiceLogo from '../../assets/Crop_servicioGold.webp';
import { useForm } from 'react-hook-form';
import { signInUser } from '../../helpers/axiosHelper';
import { AlertModal } from '../../shared/Modal/AlertModal';
import { constants } from '../../context/constants';
import { useNavigate } from 'react-router-dom';
import { getUserSlice } from "../../context/store/store.js";

const Signin = () => {
    const navigator = useNavigate();
    const { updateUserName, updateHeaders } = getUserSlice();
    const [loadingLogin, setLoadingLogin] = useState(false);
    const [alertModalShow, setAlertModalShow] = useState(false);
    const [messagesToModal, setMessagesToModal] = useState({ title: '', body: '' });

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm();

    const onSubmit = async ({ email, password }) => {
        try {
            setLoadingLogin(true);
            const response = await signInUser({ email, password });
            setLoadingLogin(response.loadingLogin);
            if (response.alertModalShow) {
                setMessagesToModal({ title: constants.MODAL_TITLE_SUCCCESS, body: constants.USER_LOGGED });
                setAlertModalShow(response.alertModalShow);
            }
            reset();
            updateHeaders(response?.data?.token);
            updateUserName(response?.data?.name);
        } catch (error) {
            console.log('error:', error);
            setMessagesToModal({ title: constants.MODAL_TITLE_ERROR, body: error?.response?.data });
            setAlertModalShow(true);
        }
    }

    const onCloseModal = () => {
        if (loadingLogin) {
            setAlertModalShow(false);
            setLoadingLogin(false);
        } else {
            setAlertModalShow(false);
            navigator('../');
        }
    }

    return (
        <div className="myBackground">
            <section className="section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-4 col-md-6 d-flex flex-column align-items-center justify-content-center">

                            <div className="card mb-3 bg-dark text-white myOpacity">
                                <div className="d-flex justify-content-center">
                                    <div className="logo d-flex align-items-center justify-content-center w-auto">
                                        <img src={goldServiceLogo} alt="goldServiceLogo" className='img-fluid imgLogo' />
                                    </div>
                                </div>

                                <div className="card-body">

                                    <div className="pt-4 pb-2">
                                        <h5 className="card-title text-center pb-0 fs-4">Ingresa a tu cuenta</h5>
                                        <p className="text-center small">Ingresa tu email y tu contraseña para ingresar</p>
                                    </div>

                                    <form className="row g-3 needs-validation" noValidate onSubmit={handleSubmit(onSubmit)}>

                                        <div className="col-12">
                                            <label htmlFor="yourUsername" className="form-label">Email</label>
                                            <div className="input-group has-validation">
                                                <input
                                                    type="text"
                                                    name="email"
                                                    className="form-control"
                                                    id="emailInput"
                                                    required
                                                    autoComplete='true'
                                                    {...register('email', {
                                                        required: 'El email es requerido.',
                                                        pattern: {
                                                            value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                                                            message: 'El email es inválido.'
                                                        }
                                                    })}
                                                />
                                            </div>
                                            {errors.email && <p className='text-danger'>{errors.email.message}</p>}
                                        </div>

                                        <div className="col-12">
                                            <label htmlFor="yourPassword" className="form-label">Contraseña</label>
                                            <input
                                                type="password"
                                                name="password"
                                                className="form-control"
                                                id="passInput"
                                                required
                                                autoComplete='current-password'
                                                {...register('password', {
                                                    required: 'La contraseña es requerida',
                                                    minLength: {
                                                        value: 8,
                                                        message: "Debe tener al menos 8 caracteres."
                                                    }
                                                })}
                                            />
                                        </div>
                                        {errors.password && <p className='text-danger'>{errors.password.message}</p>}

                                        <div className="col-12">
                                            <div className="form-check">
                                                <input className="form-check-input" type="checkbox" name="remember" value="true" id="rememberMe" />
                                                <label className="form-check-label" htmlFor="rememberMe">Recordarme</label>
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <button className="btn btn-primary w-100" type="submit">
                                                Ingresar
                                                {loadingLogin && <Spinner animation="border" role="status" size="sm" className='ms-2' />}
                                            </button>

                                        </div>
                                        <div className="col-12">
                                            <p className="small mb-0">No tienes cuenta?{' '}
                                                <a href="./signup">Crear cuenta</a>
                                            </p>
                                        </div>
                                    </form>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </section>
            <AlertModal
                show={alertModalShow}
                onHide={() => onCloseModal()}
                title={messagesToModal.title}
                bodyText={messagesToModal.body}
                size='md'
                closeButton={0}
                timeout={true}
            />
        </div>
    );
}

export default Signin;