import { useEffect, useState } from "react";
import { getUserSlice } from '../../context/store/store';
import { useForm } from 'react-hook-form';
import './Recharges.css';
import Spinner from 'react-bootstrap/Spinner';
import { constants } from "../../context/constants";
import ConfirmModal from "../../shared/Modal/ConfirmModal";
import { AlertModal } from "../../shared/Modal/AlertModal";
import { getTheRecharger, rechargeMovements, rechargeWallet } from "../../helpers/axiosHelper";
import { Table, Button, Modal } from 'react-bootstrap';
import { timeFormatter } from "../../helpers/timeZoneHelper";
import { currencyValue } from "../../helpers/currencyHelper";

const Recharges = () => {
    const [margin, setMargin] = useState({});
    const { headers, getUserOptions } = getUserSlice();
    const [loadingRecharge, setLoadingRecharge] = useState(false);
    const [loadingResponsible, setLoadingResponsible] = useState(false);
    const [confirmModalShow, setConfirmModalShow] = useState(false);
    const [alertModalShow, setAlertModalShow] = useState(false);
    const [messagesToModal, setMessagesToModal] = useState({ title: '', body: '' });
    const [rechargeDTO, setRechargeDTO] = useState({});
    const [recharges, setRecharges] = useState([]);
    const [currentRow, setCurrentRow] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [paginator, setPaginator] = useState({});
    const [loadingPage, setLoadingPage] = useState({});

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm();

    useEffect(() => {
        const uOptions = getUserOptions();
        if (!uOptions.recharges) return navigator(`../${Object.keys(uOptions)[0]}`);
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
                delete recharges.data.docs;
                setPaginator(recharges.data);
            } catch (error) {
                console.log('error:', error);
                const myBody = error?.response?.data.includes('jwt') ? constants.USER_SESSION_EXPIRED : error?.response?.data;
                setMessagesToModal({ title: constants.MODAL_TITLE_ERROR, body: myBody });
                setAlertModalShow(true);
            }
        }
        getRecharges();
    }, [headers, getUserOptions]);

    const onSubmit = async (form) => {
        setRechargeDTO({ ...form });
        setConfirmModalShow(true);
    }

    const onConfirm = async () => {
        try {
            setLoadingRecharge(true);
            const response = await rechargeWallet(rechargeDTO.email, rechargeDTO.amount, headers);
            setRecharges([response.data, ...recharges]);
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
        setShowDetailModal(false);
    }

    const onDetails = async (recharge) => {
        try {
            setLoadingResponsible(true);
            const response = await getTheRecharger({ responsible: recharge.responsible, headers });
            setLoadingResponsible(response.loadingReq);
            setCurrentRow({ ...recharge, responsible: response.data.email });
            setShowDetailModal(true);
        } catch (error) {
            console.log('error:', error);
            const myBody = error?.response?.data.includes('jwt') ? constants.USER_SESSION_EXPIRED : error?.response?.data;
            setMessagesToModal({ title: constants.MODAL_TITLE_ERROR, body: myBody });
            setAlertModalShow(true);
        }
    }

    const handlePages = async (event, pageToQuery) => {
        event.preventDefault();
        if (pageToQuery === paginator.page) return;
        setLoadingPage(prevState => ({
            ...prevState,
            [pageToQuery]: true
        }));

        const recharges = await rechargeMovements({ page: pageToQuery, headers });
        setRecharges(recharges.data.docs);
        delete recharges.data.docs;
        setPaginator(recharges.data);
        setLoadingPage(prevState => ({
            ...prevState,
            [pageToQuery]: false
        }));
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
                            step="100"
                            {...register('amount', {
                                required: 'El monto es obligatorio',
                                valueAsNumber: true,
                                min: { value: 100, message: 'El monto debe ser mayor o igual a 100.' }
                            })}
                            placeholder="$0"
                            autoComplete="false"
                        />
                        {errors.amount && <span className="text-danger">{errors.amount.message}</span>}
                    </div>

                    <div className="text-center">
                        <button type="reset" className="btn btn-secondary me-2" onClick={() => reset()}>Limpiar</button>
                        <button type="submit" className="btn btn-primary" disabled={loadingRecharge} style={{ width: '12rem' }}>
                            Recargar monto
                            {loadingRecharge && <Spinner animation="border" role="status" size="sm" className='ms-2' />}
                        </button>
                    </div>
                </form>

            </div>
            <div
                className="mt-3"
                style={
                    {
                        marginLeft: (margin.marginLeft ? margin.marginLeft : 0) + 30,
                        width: '75%',
                        boxShadow: '0px 0px 20px rgba(1, 41, 112, 0.1)',
                        padding: '1rem',
                        backgroundColor: 'white',
                        borderRadius: '0.3rem'
                    }
                }
            >
                <Table bordered hover>
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Email</th>
                            <th>Monto</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recharges.map((recharge, rechargeIndex) => (
                            <tr key={rechargeIndex}>
                                <td>{timeFormatter(recharge.createdAt)}</td>
                                <td>{recharge.userEmail}</td>
                                <td>{currencyValue(recharge.amount)} {constants.CURRENCY_NAME}</td>
                                <td>
                                    <Button
                                        variant="primary"
                                        onClick={() => onDetails(recharge)}
                                        disabled={loadingResponsible}
                                    >
                                        Ver detalles
                                        {loadingResponsible && <Spinner animation="border" role="status" size="sm" className='ms-2' />}
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                <div className="d-flex justify-content-center">
                    <nav aria-label="Page navigation example">
                        <ul className="pagination">
                            {paginator.prevPage &&
                                <li className="page-item" onClick={(event) => handlePages(event, paginator.prevPage)}>
                                    <a className="page-link" href=".">
                                        Atrás
                                    </a>
                                </li>
                            }
                            {Array(paginator.totalPages).fill('').map((_, pageIndex) => {
                                return (
                                    <li
                                        className={paginator.page === (pageIndex + 1) ? "page-item active" : "page-item"}
                                        key={pageIndex}
                                        onClick={(event) => handlePages(event, (pageIndex + 1))}
                                    >
                                        <a className="page-link" href=".">
                                            {loadingPage[pageIndex + 1] ? <Spinner animation="border" size="sm" /> : (pageIndex + 1)}
                                        </a>
                                    </li>
                                )
                            })}
                            {paginator.hasNextPage &&
                                <li className="page-item fixedSize" onClick={(event) => handlePages(event, paginator.nextPage)}>
                                    <a className="page-link" href=".">
                                        Adelante
                                    </a>
                                </li>
                            }
                        </ul>
                    </nav>
                </div>
            </div>
            <Modal centered show={showDetailModal} onHide={() => setShowDetailModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Detalles de recarga</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {currentRow && (
                        <>
                            <span>Fecha:&nbsp;</span>
                            <span>{timeFormatter(currentRow.createdAt)}</span>
                            <br />
                            <span>Email:&nbsp;</span>
                            <span>{currentRow.userEmail}</span>
                            <br />
                            <span>Monto:&nbsp;</span>
                            <span>{currencyValue(currentRow.amount)} {constants.CURRENCY_NAME}</span>
                            <br />
                            <span>Responsable:&nbsp;</span>
                            <span>{currentRow.responsible}</span>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => onCloseModal()}>
                        Aceptar
                    </Button>
                </Modal.Footer>
            </Modal>
            <ConfirmModal
                show={confirmModalShow}
                onHide={() => setConfirmModalShow(false)}
                title={'Confirmaci\u00f3n de recarga'}
                bodyText={`¿Estás seguro que quieres recargar ${currencyValue(rechargeDTO.amount)} ${constants.CURRENCY_NAME} a ${rechargeDTO.email}?`}
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