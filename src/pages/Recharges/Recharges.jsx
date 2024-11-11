import { useEffect, useState } from "react";
import { getUserSlice } from '../../context/store/store';
import { useForm } from 'react-hook-form';
import './Recharges.css';
import Spinner from 'react-bootstrap/Spinner';
import { constants } from "../../context/constants";
import ConfirmModal from "../../shared/Modal/ConfirmModal";
import { AlertModal } from "../../shared/Modal/AlertModal";
import { rechargeMovements, rechargeWallet } from "../../helpers/axiosHelper";

const Recharges = () => {
    const [margin, setMargin] = useState({});
    const { headers } = getUserSlice();
    const [loadingRecharge, setLoadingRecharge] = useState(false);
    const [confirmModalShow, setConfirmModalShow] = useState(false);
    const [alertModalShow, setAlertModalShow] = useState(false);
    const [messagesToModal, setMessagesToModal] = useState({ title: '', body: '' });
    const [rechargeDTO, setRechargeDTO] = useState({});
    const [recharges, setRecharges] = useState([]);

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
        const getRecharges = async () => {
            try {
                const recharges = await rechargeMovements({ page: 1, headers });
                setRecharges(recharges.data.docs);
            } catch (error) {
                console.log('error:', error);
                const myBody = error?.response?.data.includes('jwt') ? constants.USER_SESSION_EXPIRED : error?.response?.data;
                setMessagesToModal({ title: constants.MODAL_TITLE_ERROR, body: myBody });
                setAlertModalShow(true);
            }
        }
        getRecharges();
    }, [headers]);

    const onSubmit = async (form) => {
        setRechargeDTO({ ...form });
        setConfirmModalShow(true);
    }

    const onConfirm = async () => {
        try {
            setLoadingRecharge(true);
            const response = await rechargeWallet(rechargeDTO.email, rechargeDTO.amount, headers);
            setLoadingRecharge(response.loadingReq);
            setConfirmModalShow(false);
            setMessagesToModal({ title: constants.MODAL_TITLE_SUCCCESS, body: constants.USER_RECHARGE_SUCCESSFULL });
            setAlertModalShow(true);
            reset();
        } catch (error) {
            console.log('error:', error);
            const myBody = error?.response?.data.includes('jwt') ? constants.USER_SESSION_EXPIRED : error?.response?.data;
            setMessagesToModal({ title: constants.MODAL_TITLE_ERROR, body: myBody });
            setAlertModalShow(true);
        }
    }

    const onCloseModal = () => {
        setAlertModalShow(false);
        setLoadingRecharge(false);
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

                <h4 className="card-title">Recargar saldo</h4>

                <form className="row g-3 mt-5 d-flex justify-content-center" onSubmit={handleSubmit(onSubmit)}>
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
                        <label htmlFor="amount" className="form-label">Monto a recargar</label>
                        <input
                            type="number"
                            className={`form-control ${errors.amount ? 'is-invalid' : ''}`}
                            id="amount"
                            step="1000"
                            {...register('amount', {
                                required: 'El monto es obligatorio',
                                valueAsNumber: true,
                                min: { value: 0, message: 'El monto debe ser mayor o igual a 0' }
                            })}
                        />
                        {errors.amount && <span className="text-danger">{errors.amount.message}</span>}
                    </div>

                    <div className="text-center">
                        <button type="reset" className="btn btn-secondary me-2">Limpiar</button>
                        <button type="submit" className="btn btn-primary" style={{ width: '12rem' }}>
                            Recargar monto
                            {loadingRecharge && <Spinner animation="border" role="status" size="sm" className='ms-2' />}
                        </button>
                    </div>
                </form>

            </div>
            <ConfirmModal
                show={confirmModalShow}
                onHide={() => setConfirmModalShow(false)}
                title={'Confirmaci\u00f3n de recarga'}
                bodyText={`¿Estás seguro que quieres recargar $${rechargeDTO.amount} a ${rechargeDTO.email}?`}
                size='lg'
                closeButton={0}
                onConfirm={onConfirm}
                loadingReq={loadingRecharge}
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

export default Recharges;