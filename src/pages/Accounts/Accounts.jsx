import { useEffect, useState } from "react";
import { getUserSlice } from '../../context/store/store';
import { useForm, Controller } from 'react-hook-form';
import { createAccount, getAccountsPage, getProducts, updateAccount } from "../../helpers/axiosHelper";
import Select from 'react-select';
import { constants } from "../../context/constants";
import Spinner from 'react-bootstrap/Spinner';
import ConfirmModal from "../../shared/Modal/ConfirmModal";
import { AlertModal } from "../../shared/Modal/AlertModal";
import { useNavigate } from 'react-router-dom';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import { timeFormatter } from "../../helpers/timeZoneHelper";

const Accounts = () => {
    const navigator = useNavigate();
    const [margin, setMargin] = useState({});
    const { headers } = getUserSlice();
    const [products, setProducts] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [messagesToModal, setMessagesToModal] = useState({ title: '', body: '' });
    const [loadingAccount, setLoadingAccount] = useState(false);
    const [alertModalShow, setAlertModalShow] = useState(false);
    const [confirmModalShow, setConfirmModalShow] = useState(false);
    const [profiles, setProfiles] = useState({ 1: { name: '', pin: '', status: true } });
    const [accountDTO, setAccountDTO] = useState({});
    const [paginator, setPaginator] = useState({});
    const [loadingPage, setLoadingPage] = useState({});
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentRow, setCurrentRow] = useState(null);
    const [loadingEdition, setLoadingEdition] = useState(false);

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

        const getTheAccounts = async () => {
            try {
                const response = await getAccountsPage({ headers, page: 1 });
                setAccounts(response.data.docs);
                delete response.data.docs;
                setPaginator(response.data);
            } catch (error) {
                console.log('error:', error);
                const myBody = error?.response?.data.includes('jwt') ? constants.USER_SESSION_EXPIRED : error?.response?.data;
                setMessagesToModal({ title: constants.MODAL_TITLE_ERROR, body: myBody });
                setAlertModalShow(true);
            }
        }
        getTheAccounts();
        getTheProducts();
    }, [headers]);

    const onSubmit = async (form) => {
        let incompleteProfiles = [];
        let selectedProfiles = [];

        for (const profile of Object.values(profiles)) {
            if (!profile.name || !profile.pin)
                incompleteProfiles.push(profile);
            else
                selectedProfiles.push(profile);
        }

        if (incompleteProfiles.length > 0) {
            setMessagesToModal({ title: constants.MODAL_TITLE_ERROR, body: 'Completa la información del perfil o de los perfiles.' });
            setAlertModalShow(true);
        } else {
            const { email, password, selectedProduct } = form;
            const accountDTO = {
                email,
                password,
                productID: selectedProduct._id,
                profiles: selectedProfiles
            };

            setAccountDTO(accountDTO);
            setConfirmModalShow(true);
        }
    }

    const onConfirm = async () => {
        try {
            setLoadingAccount(true);
            const response = await createAccount({ headers, accountDTO });
            setAccounts([response.data, ...accounts]);
            setLoadingAccount(response.loadingReq);
            setProfiles({ 1: { name: '', pin: '', status: true } });
            setConfirmModalShow(false);
            setMessagesToModal({ title: constants.MODAL_TITLE_SUCCCESS, body: constants.ACCOUNT_CREATED });
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
        if (Object.keys(profiles).length === 1) return;
        const currentProfiles = { ...profiles };
        delete currentProfiles[key];
        setProfiles({ ...currentProfiles });
    }

    const onAddProfiles = (e) => {
        e.preventDefault();
        const nextKey = parseInt(Object.keys(profiles).at(Object.keys(profiles).length - 1)) + 1;
        setProfiles({ ...profiles, [nextKey]: { name: '', pin: '', status: true } });
    }

    const handlePages = async (event, pageToQuery) => {
        event.preventDefault();
        if (pageToQuery === paginator.page) return;
        setLoadingPage(prevState => ({
            ...prevState,
            [pageToQuery]: true
        }));

        const { data } = await getAccountsPage({ headers, page: pageToQuery });
        const {
            docs, hasNextPage, hasPrevPage, limit, nextPage,
            page, pagingCounter, prevPage, totalDocs, totalPages
        } = data;

        setAccounts(docs);

        setPaginator({
            hasNextPage, hasPrevPage, limit, nextPage, page,
            pagingCounter, prevPage, totalDocs, totalPages
        });
        setLoadingPage(prevState => ({
            ...prevState,
            [pageToQuery]: false
        }));
    }

    const handleEditClick = (row) => {
        setCurrentRow(row);
        setShowEditModal(true);
    }

    const handleSave = async () => {
        try {
            setLoadingEdition(true);
            const response = await updateAccount({ headers, ...currentRow });

            const accountsCopy = [...accounts];
            const accountsUpdated = accountsCopy.map((account) => {
                return account._id === response.data._id ? response.data : account;
            });

            setAccounts(accountsUpdated);
            setLoadingEdition(response.loadingReq);
            setShowEditModal(response.loadingReq);
            setMessagesToModal({ title: constants.MODAL_TITLE_SUCCCESS, body: constants.UPDATED_ACCOUNT });
            setAlertModalShow(true);
        } catch (error) {
            console.log('error:', error);
            const myBody = error?.response?.data.includes('jwt') ? constants.USER_SESSION_EXPIRED : error?.response?.data;
            setMessagesToModal({ title: constants.MODAL_TITLE_ERROR, body: myBody });
            setAlertModalShow(true);
            setLoadingEdition(false);
            setShowEditModal(false);
        }
    };

    return (
        <>
            <div
                className="card-body p-4 rounded bg-white"
                style={
                    {
                        marginLeft: (margin.marginLeft ? margin.marginLeft : 0) + 30,
                        marginTop: (margin.marginTop ? margin.marginTop : 0) + 30,
                        width: '75%',
                        boxShadow: '0px 0px 20px rgba(1, 41, 112, 0.1)'
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
                            rules={{ required: 'Selecciona un servicio.' }}
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
                                    onChange={(e) => setProfiles({ ...profiles, [key]: { ...value, name: e.target.value } })}
                                    value={value.name}
                                />
                            </div>
                            <div className="col-md-4 ms-3">
                                <label htmlFor="pin" className="form-label">PIN ({key})</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    onChange={(e) => setProfiles({ ...profiles, [key]: { ...value, pin: e.target.value } })}
                                    value={value.pin}
                                />
                            </div>
                            <div className="d-flex align-items-end mb-3 h-100 ms-3 form-check">
                                <input
                                    type="checkbox"
                                    className="form-check-input me-1"
                                    defaultChecked
                                    onChange={(e) => setProfiles({ ...profiles, [key]: { ...value, status: e.target.value } })}
                                    value={value.status}
                                />
                                <label htmlFor="status" className="form-check-label">Activo</label>
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
                        <button type="reset" className="btn btn-secondary me-2" onClick={() => reset()}>Limpiar</button>
                        <button type="submit" className="btn btn-primary" disabled={loadingAccount} style={{ width: '10rem' }}>
                            Crear cuenta
                            {loadingAccount && <Spinner animation="border" role="status" size="sm" className='ms-2' />}
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
                            <th>Tipo</th>
                            <th>Email</th>
                            <th>Contraseña</th>
                            <th>Disponibilidad</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {accounts.map((account, accIndex) =>
                            <tr key={accIndex}>
                                <td>{timeFormatter(account.createdAt)}</td>
                                <td>{products.find((product) => product._id === account.productID)?.name}</td>
                                <td>{account.email}</td>
                                <td>{account.password}</td>
                                <td>{constants.ACCOUNT_STATUS[account.status]}</td>
                                <td>
                                    <Button
                                        variant="warning"
                                        disabled={loadingEdition}
                                        onClick={() => handleEditClick(account)}
                                    >
                                        Editar
                                        {loadingEdition && <Spinner animation="border" role="status" size="sm" className='ms-2' />}
                                    </Button>
                                </td>
                            </tr>
                        )}
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
            <Modal centered size="md" show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Editar cuenta</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {currentRow && (
                        <Form>
                            <Form.Group controlId="formType">
                                <Form.Label>Tipo</Form.Label>
                                <Select
                                    value={products.find((product) => product._id === currentRow.productID) || null}
                                    onChange={(selectedOption) =>
                                        setCurrentRow({ ...currentRow, productID: selectedOption._id })
                                    }
                                    options={products}
                                    isDisabled={true}
                                />
                            </Form.Group>
                            <Form.Group controlId="formEmail">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={currentRow.email}
                                    onChange={(e) => {
                                        setCurrentRow({ ...currentRow, email: e.target.value })
                                    }}
                                />
                            </Form.Group>
                            <Form.Group controlId="formPassword">
                                <Form.Label>Contraseña</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={currentRow.password}
                                    onChange={(e) => {
                                        setCurrentRow({ ...currentRow, password: e.target.value });
                                    }}
                                />
                            </Form.Group>
                            <Form.Group controlId="formDisponibility">
                                <Form.Label>Disponibilidad</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={constants.ACCOUNT_STATUS[currentRow.status]}
                                    disabled={true}
                                />
                            </Form.Group>

                            <h5 className="d-flex justify-content-center card-title mt-5">Perfiles</h5>

                            {currentRow.profiles.map((profile, key) =>
                                <div key={key}>
                                    <Form.Group controlId="formName">
                                        <Form.Label>Nombre ({key + 1})</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={profile.name}
                                            onChange={(e) => {
                                                currentRow.profiles[key].name = e.target.value;
                                                setCurrentRow({ ...currentRow });
                                            }}
                                        />
                                    </Form.Group>
                                    <Form.Group controlId="formPin">
                                        <Form.Label>PIN ({key + 1})</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={profile.pin}
                                            onChange={(e) => {
                                                currentRow.profiles[key].pin = e.target.value;
                                                setCurrentRow({ ...currentRow });
                                            }}
                                        />
                                    </Form.Group>
                                </div>
                            )}
                        </Form>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                        Cancelar
                    </Button>
                    <Button variant="primary" disabled={loadingEdition} onClick={handleSave}>
                        Guardar
                        {loadingEdition && <Spinner animation="border" role="status" size="sm" className='ms-2' />}
                    </Button>
                </Modal.Footer>
            </Modal>
            <ConfirmModal
                show={confirmModalShow}
                onHide={() => setConfirmModalShow(false)}
                title={'Confirmaci\u00f3n de creaci\u00f3n'}
                bodyText={'¿Estás seguro que quieres crear la cuenta?'}
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