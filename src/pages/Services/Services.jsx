import { useEffect, useState } from "react";
import './Services.css';
import { getCategorySlice, getUserSlice } from '../../context/store/store';
import { useForm } from 'react-hook-form';
import { AlertModal } from '../../shared/Modal/AlertModal';
import { constants } from "../../context/constants";
import { createProduct } from "../../helpers/axiosHelper";
import { useNavigate } from 'react-router-dom';
import Spinner from 'react-bootstrap/Spinner';

const Services = () => {
    const navigator = useNavigate();
    const [margin, setMargin] = useState({});
    const { categories } = getCategorySlice();
    const { headers } = getUserSlice();
    const [alertModalShow, setAlertModalShow] = useState(false);
    const [messagesToModal, setMessagesToModal] = useState({ title: '', body: '' });
    const [loadingServices, setLoadingServices] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm();

    useEffect(() => {
        const marginLeft = document.querySelector('.sidebar').clientWidth;
        const marginTop = document.querySelector('.header').clientHeight;
        if (marginLeft && marginTop) return setMargin({
            marginLeft,
            marginTop
        });
    }, []);

    const onSubmit = async (form) => {
        try {
            const productDTO = {
                ...form,
                discount: form.discount ? form.discount : 0,
                isEntire: !form.isEntire,
                quantity: 0,
                status: true
            };
            setLoadingServices(true);
            const response = await createProduct(productDTO, headers);
            console.log('response', response);
            setLoadingServices(response.loadingReq);
            if (Object.keys(response.data).length) {
                setMessagesToModal({ title: constants.MODAL_TITLE_SUCCCESS, body: constants.PRODUCT_CREATED });
                setAlertModalShow(response.alertModalShow);
            }
            reset();
        } catch (error) {
            console.log('error:', error);
            setMessagesToModal({ title: constants.MODAL_TITLE_ERROR, body: error?.response?.data });
            setAlertModalShow(true);
        }
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

    return (
        <>
            <div
                className="card-body"
                style={
                    {
                        marginLeft: (margin.marginLeft ? margin.marginLeft : 0) + 30,
                        marginTop: (margin.marginTop ? margin.marginTop : 0) + 30,
                        width: '75%'
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
                                min: { value: 0, message: 'El precio debe ser mayor o igual a 0' }
                            })}
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
                        <button type="reset" className="btn btn-secondary me-2">Limpiar</button>
                        <button type="submit" className="btn btn-primary" style={{ width: '10rem' }}>
                            Crear servicio
                            {loadingServices && <Spinner animation="border" role="status" size="sm" className='ms-2' />}
                        </button>
                    </div>
                </form>

            </div>
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