import { useEffect, useState } from "react";
import './Services.css';
import { getCategorySlice, getUserSlice } from '../../context/store/store';
import { useForm } from 'react-hook-form';
import { AlertModal } from '../../shared/Modal/AlertModal';
import { constants } from "../../context/constants";
import { createProduct, getAllProducts, updateProduct } from "../../helpers/axiosHelper";
import { useNavigate } from 'react-router-dom';
import Spinner from 'react-bootstrap/Spinner';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import ConfirmModal from "../../../../gold_admin/src/shared/Modal/ConfirmModal";

const Services = () => {
    const navigator = useNavigate();
    const [margin, setMargin] = useState({});
    const { categories } = getCategorySlice();
    const { headers, getUserOptions } = getUserSlice();
    const [alertModalShow, setAlertModalShow] = useState(false);
    const [messagesToModal, setMessagesToModal] = useState({ title: '', body: '' });
    const [loadingServices, setLoadingServices] = useState(false);
    const [loadingEdition, setLoadingEdition] = useState(false);
    const [products, setProducts] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentRow, setCurrentRow] = useState(null);
    const [paginator, setPaginator] = useState({});
    const [loadingPage, setLoadingPage] = useState({});
    const [confirmModalShow, setConfirmModalShow] = useState(false);
    const [productDTO, setProductDTO] = useState({});
    const [errorDiscount, setErrorDiscount] = useState('');
    const [errorPrice, setErrorPrice] = useState('');

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
        // if (!getUserOptions().services) return navigator('../recharges');
        if (!Object.keys(headers).length) return;
        const getProducts = async () => {
            const { data } = await getAllProducts({ page: 1 });
            const {
                docs, hasNextPage, hasPrevPage, limit, nextPage,
                page, pagingCounter, prevPage, totalDocs, totalPages
            } = data;

            setProducts(docs);

            setPaginator({
                hasNextPage, hasPrevPage, limit, nextPage, page,
                pagingCounter, prevPage, totalDocs, totalPages
            });
        }
        getProducts();
    }, [headers, getUserOptions]);

    const onSubmit = async (form) => {
        const productDTO = {
            ...form,
            discount: form.discount ? form.discount : 0,
            isEntire: !form.isEntire,
            quantity: 0,
            status: true
        };
        setConfirmModalShow(true);
        setProductDTO(productDTO);
    }

    const onCloseModal = () => {
        if (loadingServices) {
            setAlertModalShow(false);
            setLoadingServices(false);
        } else {
            setAlertModalShow(false);
            navigator('../services');
        }
    }

    const getCategoryName = (category_id) => categories.find((category) => category._id === category_id).name;

    const handleEditClick = (row) => {
        setCurrentRow(row);
        setShowEditModal(true);
        setErrorDiscount('');
        setErrorPrice('');
    }

    const handleSave = async () => {
        try {
            setLoadingEdition(true);
            const response = await updateProduct(currentRow, headers);
            const updatedData = products.map((product) =>
                product._id === response.data._id ? response.data : product
            );
            setProducts(updatedData);
            setMessagesToModal({ title: constants.MODAL_TITLE_SUCCCESS, body: constants.PRODUCT_UPDATED });
            setAlertModalShow(response.alertModalShow);
            setLoadingEdition(response.loadingReq);
            setShowEditModal(response.loadingReq);

        } catch (error) {
            console.log('error:', error);
            const myBody = error?.response?.data.includes('jwt') ? constants.USER_SESSION_EXPIRED : error?.response?.data;
            setMessagesToModal({ title: constants.MODAL_TITLE_ERROR, body: myBody });
            setAlertModalShow(true);
            setLoadingEdition(false);
            setShowEditModal(false);
        }
    }

    const handlePages = async (event, pageToQuery) => {
        event.preventDefault();
        if (pageToQuery === paginator.page) return;
        setLoadingPage(prevState => ({
            ...prevState,
            [pageToQuery]: true
        }));

        const { data } = await getAllProducts({ page: pageToQuery });
        const {
            docs, hasNextPage, hasPrevPage, limit, nextPage,
            page, pagingCounter, prevPage, totalDocs, totalPages
        } = data;

        setProducts(docs);

        setPaginator({
            hasNextPage, hasPrevPage, limit, nextPage, page,
            pagingCounter, prevPage, totalDocs, totalPages
        });
        setLoadingPage(prevState => ({
            ...prevState,
            [pageToQuery]: false
        }));
    }

    const onConfirm = async () => {
        try {
            setLoadingEdition(true);
            setLoadingServices(true);
            const response = await createProduct(productDTO, headers);
            setLoadingServices(response.loadingReq);

            const newProduct = {
                ...response.data,
                category_id: productDTO.category_id
            };

            setProducts([newProduct, ...products]);

            setMessagesToModal({ title: constants.MODAL_TITLE_SUCCCESS, body: constants.PRODUCT_CREATED });
            setAlertModalShow(response.alertModalShow);
            setConfirmModalShow(false);
            setLoadingEdition(false);
            reset();
        } catch (error) {
            console.log('error:', error);
            const myBody = error?.response?.data.includes('jwt') ? constants.USER_SESSION_EXPIRED : error?.response?.data;
            setMessagesToModal({ title: constants.MODAL_TITLE_ERROR, body: myBody });
            setAlertModalShow(true);
            setLoadingEdition(false);
            setConfirmModalShow(false);
        }
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
                <h4 className="card-title">Crear servicio</h4>

                <form className="row g-3 mt-5" onSubmit={handleSubmit(onSubmit)}>
                    <div className="col-md-4">
                        <label htmlFor="inputCategory" className="form-label">Categoría</label>
                        <select
                            id="inputCategory"
                            className={`form-select ${errors.category_id ? 'is-invalid' : ''}`}
                            {...register('category_id', { required: 'Selecciona una categoría' })}
                        >
                            <option value="">Selecciona</option>
                            {categories.map((category) =>
                                <option value={category._id} key={category._id}>
                                    {category.name}
                                </option>
                            )}
                        </select>
                        {errors.category_id && <span className="text-danger">{errors.category_id.message}</span>}
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="name" className="form-label">Nombre</label>
                        <input
                            type="text"
                            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                            id="name"
                            {...register('name', { required: 'El nombre es obligatorio' })}
                        />
                        {errors.name && <span className="text-danger">{errors.name.message}</span>}
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="price" className="form-label">Precio</label>
                        <input
                            type="number"
                            className={`form-control ${errors.price ? 'is-invalid' : ''}`}
                            id="price"
                            step="100"
                            {...register('price', {
                                required: 'El precio es obligatorio',
                                valueAsNumber: true,
                                min: { value: 100, message: 'El monto debe ser mayor o igual a 100.' }
                            })}
                            placeholder="$0"
                            autoComplete="false"
                        />
                        {errors.price && <span className="text-danger">{errors.price.message}</span>}
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="discount" className="form-label">Descuento (%)</label>
                        <input
                            type="number"
                            className={`form-control ${errors.discount ? 'is-invalid' : ''}`}
                            id="discount"
                            step="1"
                            {...register('discount', {
                                valueAsNumber: true,
                                min: { value: 0, message: 'El descuento debe ser mayor o igual a 0' },
                                max: { value: 100, message: 'El descuento no puede ser mayor a 100' }
                            })}
                        />
                        {errors.discount && <span className="text-danger">{errors.discount.message}</span>}
                    </div>
                    <div className="col-md-8">
                        <label htmlFor="description" className="form-label">Descripción</label>
                        <textarea
                            className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                            id="description"
                            rows="2"
                            {...register('description', { required: 'La descripción es obligatoria' })}
                        ></textarea>
                        {errors.description && <span className="text-danger">{errors.description.message}</span>}
                    </div>
                    <div className="d-flex justify-content-center form-check">
                        <input
                            type="checkbox"
                            className="form-check-input me-1"
                            id="isEntire"
                            defaultChecked
                            {...register('isEntire')}
                        />
                        <label htmlFor="isEntire" className="form-check-label">Venta por perfiles</label>
                    </div>
                    <div className="text-center">
                        <button type="reset" className="btn btn-secondary me-2" onClick={() => reset()}>Limpiar</button>
                        <button type="submit" className="btn btn-primary" disabled={loadingServices} style={{ width: '10rem' }}>
                            Crear servicio
                            {loadingServices && <Spinner animation="border" role="status" size="sm" className='ms-2' />}
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
                            <th>Categoria</th>
                            <th>Nombre</th>
                            <th>Precio</th>
                            <th>Descuento</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product, productIndex) => (
                            <tr key={productIndex}>
                                <td>{getCategoryName(product.category_id)}</td>
                                <td>{product.name}</td>
                                <td>{product.price}</td>
                                <td>{product.discount}%</td>
                                <td>
                                    <Button
                                        variant="warning"
                                        onClick={() => handleEditClick(product)}
                                    >
                                        Editar
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
            <Modal centered show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Editar servicio</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {currentRow && (
                        <Form>
                            <Form.Group controlId="formName">
                                <Form.Label>Nombre</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={currentRow.name}
                                    onChange={(e) =>
                                        setCurrentRow({ ...currentRow, name: e.target.value })
                                    }
                                />
                            </Form.Group>
                            <Form.Group controlId="formPrice">
                                <Form.Label>Precio</Form.Label>
                                <Form.Control
                                    type="number"
                                    step="100"
                                    value={currentRow.price}
                                    onChange={(e) => {
                                        const value = parseInt(e.target.value);
                                        if (value <= 0) return setErrorPrice('El precio debe ser mayor a 0.');
                                        setErrorPrice('');
                                        setCurrentRow({ ...currentRow, price: value })
                                    }}
                                />
                                {errorPrice && <span className="text-danger">{errorPrice}</span>}
                            </Form.Group>
                            <Form.Group controlId="formDiscount">
                                <Form.Label>Descuento</Form.Label>
                                <Form.Control
                                    type="number"
                                    step="1"
                                    value={currentRow.discount}
                                    onChange={(e) => {
                                        const value = parseInt(e.target.value);
                                        if (value < 0) return setErrorDiscount('El descuento debe ser igual o mayor a 0.');
                                        setErrorDiscount('');
                                        setCurrentRow({ ...currentRow, discount: value });
                                    }}
                                />
                                {errorDiscount && <span className="text-danger">{errorDiscount}</span>}
                            </Form.Group>
                            <Form.Group controlId="formDiscount">
                                <Form.Label>Descripcion</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={currentRow.description}
                                    onChange={(e) =>
                                        setCurrentRow({ ...currentRow, description: e.target.value })
                                    }
                                />
                            </Form.Group>
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
                bodyText={'¿Estás seguro que quieres crear el servicio?'}
                size='md'
                closeButton={0}
                onConfirm={onConfirm}
                loadingReq={loadingEdition}
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
    )
}

export default Services;