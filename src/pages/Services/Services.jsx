import { useCallback, useEffect, useState } from "react";
import './Services.css';
import { getCategorySlice, getUserSlice } from '../../context/store/store';
import { useForm } from 'react-hook-form';
import { AlertModal } from '../../shared/Modal/AlertModal';
import { constants } from "../../context/constants";
import { createProduct, deleteProduct, getAllProducts, getCategories as getCategoriesAxios, restoreProduct, updateProduct, uploadImage } from "../../helpers/axiosHelper";
import { useNavigate } from 'react-router-dom';
import Spinner from 'react-bootstrap/Spinner';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import ConfirmModal from "../../../../gold_admin/src/shared/Modal/ConfirmModal";
import { useRef } from "react";
import FilterChips from "../../shared/FilterChips/FilterChips";

const Services = () => {

    const navigator = useNavigate();
    const [margin, setMargin] = useState({});
    const { getCategories, updateCategories } = getCategorySlice();
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
    const [activeFilter, setActiveFilter] = useState('all');
    const [confirmModalShow, setConfirmModalShow] = useState(false);
    const [confirmDeleteModalShow, setConfirmDeleteModalShow] = useState(false);
    const [confirmHistoricalDeleteModalShow, setConfirmHistoricalDeleteModalShow] = useState(false);
    const [confirmRestoreModalShow, setConfirmRestoreModalShow] = useState(false);
    const [productDTO, setProductDTO] = useState({});
    const [productToDelete, setProductToDelete] = useState(null);
    const [productToRestore, setProductToRestore] = useState(null);
    const [errorDiscount, setErrorDiscount] = useState('');
    const [errorPrice, setErrorPrice] = useState('');
    const [previewUrl, setPreviewUrl] = useState('');
    const [modalPreviewUrl, setModalPreviewUrl] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedModalFile, setSelectedModalFile] = useState(null);
    const fileInputRef = useRef(null);
    const modalFileInputRef = useRef(null);
    const startPage = Math.max(1, paginator.page - Math.floor(constants.MAX_VISIBLE_PAGES / 2));
    const endPage = Math.min(paginator.totalPages, startPage + constants.MAX_VISIBLE_PAGES - 1);
    const pages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        setError,
        clearErrors,
        watch,
        formState: { errors }
    } = useForm();
    const imageUrl = watch('imageUrl');

    const loadProducts = useCallback(async (pageToQuery = 1, filterToQuery = activeFilter) => {
        const { data } = await getAllProducts({ page: pageToQuery, filter: filterToQuery });
        const {
            docs, hasNextPage, hasPrevPage, limit, nextPage,
            page, pagingCounter, prevPage, totalDocs, totalPages
        } = data;

        setProducts(docs);
        setPaginator({
            hasNextPage, hasPrevPage, limit, nextPage, page,
            pagingCounter, prevPage, totalDocs, totalPages
        });
    }, [activeFilter]);

    useEffect(() => {

        const fetchCategories = async () => {
            try {
                const response = await getCategoriesAxios({ headers });
                if (response && Array.isArray(response.data)) { // Verifica que sea un array
                    updateCategories(response.data); // Actualiza el estado global
                } else {
                    console.error("se esperaba un array pero envió:", response);
                }
            } catch (error) {
                console.error("Error fetching active categories:", error);
            }
        };

        fetchCategories();

        const uOptions = getUserOptions();
        if (!uOptions.services) return navigator(`../${Object.keys(uOptions)[0]}`);
        const marginLeft = document.querySelector('.sidebar').clientWidth;
        const marginTop = document.querySelector('.header').clientHeight;
        if (marginLeft && marginTop) setMargin({
            marginLeft,
            marginTop
        });
        if (!Object.keys(headers).length) return;
        loadProducts(1, activeFilter);
    }, [activeFilter, headers, getUserOptions, loadProducts, navigator, updateCategories]);
    const categories = getCategories() || []; // Si es undefined, usa un array vacío
    const onSubmit = async (form) => {
        if (!selectedFile && (!form.imageUrl || !form.imagePublicId)) {
            setError('imageUrl', { type: 'manual', message: 'La imagen es obligatoria.' });
            return;
        }
        const productDTO = {
            ...form,
            discount: form.discount ? form.discount : 0,
            isEntire: !form.isEntire,
            quantity: 0,
            status: true,
            imageUrl: form.imageUrl,
            imagePublicId: form.imagePublicId
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

    const getCategoryName = (category_id) => {
        const categories = getCategories() || [];
        const category = categories.find((category) => category._id === category_id);
        return category ? category.name : "No disponible";
    };

    const handleEditClick = (row) => {
        setCurrentRow(row);
        setShowEditModal(true);
        setErrorDiscount('');
        setErrorPrice('');
        setModalPreviewUrl(row.imageUrl || '');
    }

    const handleDeleteClick = (row) => {
        setProductToDelete(row);
        setConfirmDeleteModalShow(true);
    }

    const handleRestoreClick = (row) => {
        setProductToRestore(row);
        setConfirmRestoreModalShow(true);
    }

    const executeRestore = async () => {
        try {
            if (!productToRestore) return;
            setLoadingEdition(true);
            const response = await restoreProduct({ _id: productToRestore._id, headers });
            const shouldGoToPrevPage = activeFilter === 'deleted' && products.length === 1 && (paginator.page || 1) > 1;
            const targetPage = shouldGoToPrevPage ? paginator.page - 1 : (paginator.page || 1);
            await loadProducts(targetPage, activeFilter);
            setMessagesToModal({ title: constants.MODAL_TITLE_SUCCCESS, body: constants.PRODUCT_RESTORED });
            setAlertModalShow(response.alertModalShow);
            setConfirmRestoreModalShow(false);
            setProductToRestore(null);
            setLoadingEdition(false);
        } catch (error) {
            const myBody = error?.response?.data?.message || error?.response?.data || constants.MODAL_BODY_ERROR;
            setMessagesToModal({ title: constants.MODAL_TITLE_ERROR, body: myBody });
            setAlertModalShow(true);
            setConfirmRestoreModalShow(false);
            setProductToRestore(null);
            setLoadingEdition(false);
        }
    }

    const executeDelete = async (confirmHistorical = false) => {
        try {
            if (!productToDelete) return;
            setLoadingEdition(true);
            const response = await deleteProduct({ _id: productToDelete._id, headers, confirmHistorical });
            await loadProducts(paginator.page || 1, activeFilter);
            setMessagesToModal({ title: constants.MODAL_TITLE_SUCCCESS, body: constants.PRODUCT_DELETED });
            setAlertModalShow(response.alertModalShow);
            setConfirmDeleteModalShow(false);
            setConfirmHistoricalDeleteModalShow(false);
            setProductToDelete(null);
            setLoadingEdition(false);
        } catch (error) {
            const errorCode = error?.response?.data?.code;
            const errorMessage = error?.response?.data?.message || error?.response?.data || constants.MODAL_BODY_ERROR;

            if (errorCode === 'PRODUCT_HAS_MOVEMENTS') {
                setConfirmDeleteModalShow(false);
                setConfirmHistoricalDeleteModalShow(true);
                setLoadingEdition(false);
                return;
            }

            setMessagesToModal({ title: constants.MODAL_TITLE_ERROR, body: errorMessage });
            setAlertModalShow(true);
            setConfirmDeleteModalShow(false);
            setConfirmHistoricalDeleteModalShow(false);
            setProductToDelete(null);
            setLoadingEdition(false);
        }
    }

    const handleSave = async () => {
        try {
            setLoadingEdition(true);

            let payload = { ...currentRow };

            if (selectedModalFile) {
                const responseUpload = await uploadImage(selectedModalFile, headers);
                payload = {
                    ...payload,
                    imageUrl: responseUpload.data.url,
                    imagePublicId: responseUpload.data.publicId
                };
                setSelectedModalFile(null);
                if (modalFileInputRef.current) modalFileInputRef.current.value = '';
            }

            const response = await updateProduct(payload, headers);
            await loadProducts(paginator.page || 1, activeFilter);
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

        await loadProducts(pageToQuery, activeFilter);
        setLoadingPage(prevState => ({
            ...prevState,
            [pageToQuery]: false
        }));
    }

    const onResetForm = () => {
        reset();
        setPreviewUrl('');
        setValue('imageUrl', '');
        setValue('imagePublicId', '');
        if (fileInputRef.current) fileInputRef.current.value = '';
    }

    const onConfirm = async () => {
        try {
            setLoadingEdition(true);
            setLoadingServices(true);
            let payload = { ...productDTO };

            if (selectedFile) {
                const responseUpload = await uploadImage(selectedFile, headers);
                payload = {
                    ...payload,
                    imageUrl: responseUpload.data.url,
                    imagePublicId: responseUpload.data.publicId
                };
                setSelectedFile(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
            }

            if (!payload.imageUrl || !payload.imagePublicId) {
                setLoadingEdition(false);
                setLoadingServices(false);
                setAlertModalShow(true);
                setMessagesToModal({ title: constants.MODAL_TITLE_ERROR, body: 'Selecciona una imagen y súbela.' });
                return;
            }

            const response = await createProduct(payload, headers);
            setLoadingServices(response.loadingReq);

            await loadProducts(1, activeFilter);

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
                            <option key="default" value="">Selecciona</option>
                            {categories
                                .filter((category) => category.status)
                                .map((category, index) => (
                                    <option key={category._id || `category-${index}`} value={category._id}>
                                        {category.name}
                                    </option>
                                ))}
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
                        <label className="form-label">Imagen del servicio</label>
                        <div className="d-flex align-items-start gap-3 border rounded p-2 bg-light">
                            <div className="flex-grow-1">
                                <div className="d-flex align-items-center gap-2">
                            <input
                                type="file"
                                className="form-control"
                                ref={fileInputRef}
                                accept="image/png, image/jpeg, image/webp"
                                onChange={(e) => {
                                    const name = e.target.files?.[0]?.name || '';
                                    const file = e.target.files?.[0] || null;
                                    setSelectedFile(file);
                                    setPreviewUrl(file ? URL.createObjectURL(file) : '');
                                    if (name) clearErrors('imageUrl');
                                }}
                            />
                        </div>
                        <small className="text-muted">Formatos: JPG, PNG o WEBP. Máximo 5MB.</small></div>
                            {(previewUrl || imageUrl) &&
                                <div className="d-flex flex-column align-items-center" style={{ width: '140px' }}>
                                    <span className="text-muted small">Preview</span>
                                    <div className="border rounded d-flex justify-content-center align-items-center bg-white" style={{ width: '120px', height: '120px' }}>
                                        <img src={previewUrl || imageUrl} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} className="rounded" />
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                    <input type="hidden" {...register('imageUrl')} />
                    <input type="hidden" {...register('imagePublicId')} />
                    <div className="col-md-8">
                        <label htmlFor="description" className="form-label">Descripcion</label>
                        <textarea
                            className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                            id="description"
                            rows="2"
                            {...register('description', { required: 'La descripcion es obligatoria' })}
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
                        <button type="reset" className="btn btn-secondary me-2" onClick={onResetForm}>Limpiar</button>
                        <button type="submit" className="btn btn-primary" disabled={loadingServices} style={{ width: '10rem' }}>
                            Crear servicio
                            {loadingServices && <Spinner animation="border" role="status" size="sm" className='ms-2' />}
                        </button>
                    </div>
                </form>

            </div>
            <div
                className="mt-3 contResponsive"
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
                <FilterChips
                    options={[
                        { id: 'all', label: 'Todos' },
                        { id: 'available', label: 'Disponibles' },
                        { id: 'exhausted', label: 'Agotados' },
                        { id: 'deleted', label: 'Eliminados' }
                    ]}
                    activeValue={activeFilter}
                    onChange={setActiveFilter}
                    className="mb-3"
                />
                <Table bordered hover className="tableResponsive">
                    <thead>
                        <tr>
                            <th>Categoria</th>
                            <th>Nombre</th>
                            <th>Imagen</th>
                            <th>Unidades disponibles</th>
                            <th>Precio</th>
                            <th>Descuento</th>
                            <th>Estado de la categoria</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => {
                            const category = getCategories().find((cat) => cat._id === product.category_id);
                            return (
                                <tr key={product._id}>
                                    <td>{getCategoryName(product.category_id)}</td>
                                    <td>{product.name}</td>
                                    <td className="text-center align-middle">
                                        {product.imageUrl
                                            ? <img src={product.imageUrl} alt={product.name} style={{ width: '60px', height: '60px', objectFit: 'cover' }} className="rounded" />
                                            : <span className="text-muted">-</span>
                                        }
                                    </td>
                                    <td className="text-center">{`${product.inventoryRealCount ?? 0} ${product.inventoryRealUnit ?? ''}`.trim()}</td>
                                    <td>{product.price}</td>
                                    <td>{product.discount}%</td>
                                    <td>{constants.CATEGORY_STATUSES[category?.status]}</td>
                                    <td>
                                        {product.lifecycleStatus === 'deleted' ? (
                                            <Button variant="success" disabled={loadingEdition} onClick={() => handleRestoreClick(product)}>
                                                Restaurar
                                            </Button>
                                        ) : (
                                            <div className="d-flex gap-2">
                                                <Button variant="warning" onClick={() => handleEditClick(product)}>Editar</Button>
                                                <Button variant="danger" disabled={loadingEdition} onClick={() => handleDeleteClick(product)}>
                                                    Eliminar
                                                </Button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
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

                            {startPage > 1 && (
                                <>
                                    <li className="page-item" onClick={(event) => handlePages(event, 1)}>
                                        <a className="page-link" href=".">1</a>
                                    </li>
                                    {startPage > 2 && <li className="page-item disabled"><span className="page-link">...</span></li>}
                                </>
                            )}

                            {pages.map((pageIndex) => (
                                <li
                                    className={paginator.page === pageIndex ? "page-item active" : "page-item"}
                                    key={pageIndex}
                                    onClick={(event) => handlePages(event, pageIndex)}
                                >
                                    <a className="page-link" href=".">
                                        {loadingPage[pageIndex] ? <Spinner animation="border" size="sm" /> : pageIndex}
                                    </a>
                                </li>
                            ))}

                            {endPage < paginator.totalPages && (
                                <>
                                    {endPage < paginator.totalPages - 1 && <li className="page-item disabled"><span className="page-link">...</span></li>}
                                    <li className="page-item" onClick={(event) => handlePages(event, paginator.totalPages)}>
                                        <a className="page-link" href=".">{paginator.totalPages}</a>
                                    </li>
                                </>
                            )}


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
                            <Form.Group controlId="formImageEdit">
                                <Form.Label>Imagen</Form.Label>
                                <div className="d-flex align-items-start gap-3 border rounded p-2 bg-light">
                                    <div className="flex-grow-1">
                                        <Form.Control
                                            type="file"
                                            ref={modalFileInputRef}
                                    accept="image/png, image/jpeg, image/webp"
                                    onChange={(e) => {
                                    const file = e.target.files?.[0] || null;
                                    setSelectedModalFile(file);
                                    setModalPreviewUrl(file ? URL.createObjectURL(file) : currentRow.imageUrl);
                                    }}
                                />
                                    <small className="text-muted ms-1">Selecciona un archivo para previsualizar. Se subirá al guardar.</small>
                                    </div>
                                    <div className="d-flex flex-column align-items-center" style={{ width: '140px' }}>
                                        <span className="text-muted small">Preview</span>
                                        <div className="border rounded d-flex justify-content-center align-items-center bg-white" style={{ width: '120px', height: '120px' }}>
                                            {(modalPreviewUrl || currentRow.imageUrl)
                                                ? <img src={modalPreviewUrl || currentRow.imageUrl} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} className="rounded" />
                                                : null
                                            }
                                        </div>
                                    </div>
                                </div>
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
            <ConfirmModal
                show={confirmDeleteModalShow}
                onHide={() => {
                    setConfirmDeleteModalShow(false);
                    setProductToDelete(null);
                }}
                title={constants.MODAL_TITLE_DELETE_PRODUCT}
                bodyText={constants.MODAL_BODY_DELETE_PRODUCT}
                size='md'
                closeButton={0}
                onConfirm={() => executeDelete(false)}
                loadingReq={loadingEdition}
            />
            <ConfirmModal
                show={confirmHistoricalDeleteModalShow}
                onHide={() => {
                    setConfirmHistoricalDeleteModalShow(false);
                    setProductToDelete(null);
                }}
                title={constants.MODAL_TITLE_DELETE_PRODUCT}
                bodyText={constants.MODAL_BODY_DELETE_PRODUCT_WITH_MOVEMENTS}
                size='md'
                closeButton={0}
                onConfirm={() => executeDelete(true)}
                loadingReq={loadingEdition}
            />
            <ConfirmModal
                show={confirmRestoreModalShow}
                onHide={() => {
                    setConfirmRestoreModalShow(false);
                    setProductToRestore(null);
                }}
                title={constants.MODAL_TITLE_RESTORE_PRODUCT}
                bodyText={constants.MODAL_BODY_RESTORE_PRODUCT}
                size='md'
                closeButton={0}
                onConfirm={executeRestore}
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













