import React, { useState, useEffect, useCallback } from "react";
import { Button, Form, Modal, Table, Spinner } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { getCategories, createCategory, updateCategory, deleteCategory } from "../../helpers/axiosHelper";
import { getUserSlice, getCategorySlice } from '../../context/store/store';
import "./CreateCategory.css";
import ConfirmModal from "../../../../gold_admin/src/shared/Modal/ConfirmModal";
import { AlertModal } from '../../shared/Modal/AlertModal';
import { constants } from "../../context/constants";
import { useNavigate } from 'react-router-dom';

const CreateCategory = () => {
  const { updateCategories } = getCategorySlice();
  const [categories, setCategories] = useState([]);
  const navigator = useNavigate();
  const [showEditModal, setShowEditModal] = useState(false);
  const { headers } = getUserSlice();
  const [currentCategory, setCurrentCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [margin, setMargin] = useState({ marginLeft: 0, marginTop: 0 });
  const [confirmModalShow, setConfirmModalShow] = useState(false);
  const [messagesToModal, setMessagesToModal] = useState({ title: '', body: '' });
  const [alertModalShow, setAlertModalShow] = useState(false);
  const [productDTO, setProductDTO] = useState({});
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [paginator, setPaginator] = useState({
    hasNextPage: false,
    hasPrevPage: false,
    limit: 6,
    nextPage: null,
    page: 1,
    prevPage: null,
    totalDocs: 0,
    totalPages: 1,
  });
  const [loadingPage] = useState({});

  // Formulario de creación
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Formulario de edición
  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    reset: resetEdit,
    formState: { errors: errorsEdit },
  } = useForm();

  const defaultValues = {
    name: "",
    description: "",
    status: "",
  };


  const fetchPaginatedCategories = useCallback(async (page, limit) => {
    setLoading(true);
    try {
      const response = await getCategories({ page, limit, headers });
      const { docs, totalPages, hasNextPage, hasPrevPage, nextPage, prevPage } = response.data;
      setCategories(docs);
      updateCategories(docs);
      setPaginator((prev) => ({
        ...prev,
        totalPages,
        hasNextPage,
        hasPrevPage,
        nextPage,
        prevPage

      }));

    } catch (error) {
      console.error("Error fetching paginated categories:", error);
      if (error.response?.status === 401) {

        navigator('/signin');
      }
    } finally {
      setLoading(false);
    }
  }, [headers, navigator, updateCategories]);



  useEffect(() => {

    const sidebarWidth = document.querySelector(".sidebar")?.clientWidth || 0;
    const headerHeight = document.querySelector(".header")?.clientHeight || 0;
    setMargin({ marginLeft: sidebarWidth + 1, marginTop: headerHeight + 1 });

    fetchPaginatedCategories(paginator.page, paginator.limit);
  }, [paginator.page, paginator.limit, fetchPaginatedCategories]);


  const handlePageChange = (event, newPage) => {
    event.preventDefault();


    if (newPage < 1 || newPage > paginator.totalPages) {
      return;
    }


    if (
      (newPage > paginator.page && !paginator.hasNextPage) ||
      (newPage < paginator.page && !paginator.hasPrevPage)
    ) {
      return;
    }


    setPaginator((prev) => ({ ...prev, page: newPage }));
  };




  const onSubmit = async (data) => {
    setMessagesToModal({
      title: constants.MODAL_CONFIRM_CREATION,
      body: constants.MODAL_CONFIRM_CREATE_CATEGORY,
    });
    setConfirmModalShow(true);
    setProductDTO(data);
  };

  const onConfirmCreate = async () => {
    setLoading(true);
    try {
      const newCategory = {
        name: productDTO.name,
        description: productDTO.description,
        status: productDTO.status === "true",
      };

      const response = await createCategory(newCategory, headers);

      const updatedCategories = [...categories, response.data];
      setCategories(updatedCategories);
      updateCategories(updatedCategories);
      await fetchPaginatedCategories(paginator.page, paginator.limit);
      setMessagesToModal({
        title: constants.MODAL_TITLE_SUCCCESS,
        body: constants.CATEGORY_CREATED_SUCCESSFULLY,
      });
      setAlertModalShow(true);

      // Reiniciar el formulario
      reset();
    } catch (error) {
      console.log(error);
      setMessagesToModal({
        title: constants.MODAL_TITLE_ERROR,
        body: error.message,
      });
      setAlertModalShow(true);
    } finally {
      setConfirmModalShow(false);
      setLoading(false);
    }
  };




  const handleDelete = (id) => {
    setMessagesToModal({
      title: constants.MODAL_TITLE_DELETE,
      body: constants.MODAL_BODY_DELETE,
    });
    setConfirmModalShow(true);
    setCategoryToDelete(id);
  };

  const onConfirmDelete = async () => {
    setLoading(true);
    try {
      const response = await deleteCategory(categoryToDelete, headers);

      if (response.success) {

        setCategories((prevCategories) =>
          prevCategories.filter((category) => category._id !== categoryToDelete)
        );

        if (categories.length === 1 && paginator.page > 1) {

          setPaginator((prev) => ({ ...prev, page: prev.page - 1 }));
        }


        await fetchPaginatedCategories(paginator.page, paginator.limit);

        setMessagesToModal({
          title: constants.MODAL_TITLE_SUCCCESS,
          body: constants.CATEGORY_DELETED_SUCCESSFULLY,
        });

      } else {

        setMessagesToModal({
          title: constants.MODAL_TITLE_ERROR,
          body: response.message,
        });
      }
      setAlertModalShow(true);
    } catch (error) {
      setMessagesToModal({
        title: constants.MODAL_TITLE_ERROR,
        body: error.message === constants.CATEGORY_HAS_PRODUCTS
          ? constants.CATEGORY_HAS_PRODUCTS
          : constants.MODAL_BODY_ERROR,
      });
      setAlertModalShow(true);
    } finally {
      setConfirmModalShow(false);
      setCategoryToDelete(null);
      setLoading(false);
    }
  };
  const handleEdit = (category) => {
    setCurrentCategory(category);
    setShowEditModal(true);
    resetEdit({
      name: category.name,
      description: category.description,
      status: category.status.toString(),
    });
  };


  const handleSaveEdit = async (data) => {
    setLoading(true);
    try {
      const updatedCategory = {
        id: currentCategory.id,
        name: data.name,
        description: data.description,
        status: data.status === "true",
      };
      const response = await updateCategory(updatedCategory, headers);
      // Actualiza el estado local
      const updatedCategories = categories.map((category) =>
        category.id === currentCategory.id ? response.data : category
      );
      setCategories(updatedCategories);

      // Actualiza el estado global
      updateCategories(updatedCategories);
      setShowEditModal(false);
      resetEdit();
      setMessagesToModal({
        title: constants.MODAL_TITLE_SUCCCESS,
        body: constants.CATEGORY_UPDATED,
      });
      setAlertModalShow(true);
    } catch (error) {
      setMessagesToModal({
        title: constants.MODAL_TITLE_ERROR,
        body: constants.MODAL_BODY_ERROR,
      });
      setAlertModalShow(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Formulario de creación */}
      <div
        className="card-body p-4 rounded bg-white"
        style={{
          marginLeft: (margin.marginLeft ? margin.marginLeft : 0) + 30,
          marginTop: (margin.marginTop ? margin.marginTop : 0) + 30,
          width: '75%',
          boxShadow: '0px 0px 20px rgba(1, 41, 112, 0.1)'
        }}
      >
        <h4 className="card-title" style={{ marginBottom: "20px" }}>Crear categoría</h4>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <div className="row justify-content-center">
            <div className="col-md-5">
              <Form.Group className="mb-3">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nombre de la categoría"
                  {...register("name", { required: "El nombre es obligatorio" })}
                  isInvalid={!!errors.name}
                />
                <Form.Control.Feedback type="invalid">
                  {errorsEdit.name?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </div>
            <div className="col-md-5">
              <Form.Group className="mb-3">
                <Form.Label>Estado</Form.Label>
                <Form.Select
                  {...register("status", { required: "El estado es obligatorio" })}
                  isInvalid={!!errors.status}
                >
                  <option value="">Selecciona un estado</option>
                  <option value="true">Activo</option>
                  <option value="false">Inactivo</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.status?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </div>
          </div>

          <div className="row justify-content-center">
            <div className="col-md-10">
              <Form.Group className="mb-3 text-center">
                <Form.Label style={{ display: "block", textAlign: "left", width: "80%", margin: "0 auto" }}>
                  Descripción
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  placeholder="Descripción de la categoría"
                  {...register("description", {
                    required: "La descripción es obligatoria",
                  })}
                  isInvalid={!!errors.description}
                  style={{ width: "80%", margin: "0 auto" }}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.description?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </div>
          </div>

          <div className="row justify-content-center">
            <div className="col-md-10 text-center">

              <Button variant="secondary" onClick={() => resetEdit(defaultValues)} className="me-2">
                Limpiar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Spinner animation="border" size="sm" /> Guardando...
                  </>
                ) : (
                  "Guardar"
                )}
              </Button>
            </div>
          </div>
        </Form>
      </div>

      {/* Tabla de categorías */}
      <div
        className="card-body p-4 rounded bg-white"
        style={{
          marginLeft: (margin.marginLeft ? margin.marginLeft : 0) + 30,
          width: '75%',
          marginTop: "20px",
          boxShadow: '0px 0px 20px rgba(1, 41, 112, 0.1)',
          padding: '1rem',
          backgroundColor: 'white',
          borderRadius: '0.3rem'
        }}
      >
        <h4 className="card-title" style={{ marginBottom: "20px" }}>Lista de categorías</h4>
        <div className="table-container">
          <Table bordered hover>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category, index) => (
                <tr key={category._id || index}> {/* Usa category._id como key si está disponible */}
                  <td>{category.name}</td>
                  <td>{category.description}</td>
                  <td>{category.status ? "Activo" : "Inactivo"}</td>
                  <td>
                    <Button
                      variant="warning"
                      onClick={() => handleEdit(category)}
                      className="me-2"
                    >
                      Editar
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleDelete(category._id)}
                    >
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>

      {/* Controles de paginación */}
      <div className="d-flex justify-content-center mt-4">
        <nav aria-label="Page navigation example">
          <ul className="pagination">
            {paginator.prevPage && (
              <li className="page-item" onClick={(event) => handlePageChange(event, paginator.prevPage)}>
                <a className="page-link" href=".">
                  Atrás
                </a>
              </li>
            )}
            {Array(paginator.totalPages).fill('').map((_, pageIndex) => {
              return (
                <li
                  className={paginator.page === (pageIndex + 1) ? "page-item active" : "page-item"}
                  key={pageIndex}
                  onClick={(event) => handlePageChange(event, (pageIndex + 1))}
                >
                  <a className="page-link" href=".">
                    {loadingPage[pageIndex + 1] ? (
                      <Spinner animation="border" size="sm" />
                    ) : (
                      pageIndex + 1
                    )}
                  </a>
                </li>
              );
            })}
            {paginator.hasNextPage && (
              <li className="page-item" onClick={(event) => handlePageChange(event, paginator.nextPage)}>
                <a className="page-link" href=".">
                  Adelante
                </a>
              </li>
            )}
          </ul>
        </nav>
      </div>

      {/* Modal de edición */}
      <Modal show={showEditModal} onHide={() => {
        setShowEditModal(false);
        setCurrentCategory(null); // Limpiar el estado de la categoría actual
        resetEdit(); // Limpiar el formulario de edición
      }}>
        <Modal.Header closeButton>
          <Modal.Title>Editar categoría</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmitEdit(handleSaveEdit)}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                {...registerEdit("name", { required: "El nombre es obligatorio" })}
                isInvalid={!!errorsEdit.name}
              />
              <Form.Control.Feedback type="invalid">
                {errorsEdit.name?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                {...registerEdit("description", {
                  required: "La descripción es obligatoria",
                })}
                isInvalid={!!errorsEdit.description}
              />
              <Form.Control.Feedback type="invalid">
                {errorsEdit.description?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Estado</Form.Label>
              <Form.Select
                {...registerEdit("status", { required: "El estado es obligatorio" })}
                isInvalid={!!errorsEdit.status}
              >
                <option value="true">Activo</option>
                <option value="false">Inactivo</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errorsEdit.status?.message}
              </Form.Control.Feedback>
            </Form.Group>

            {/* Botón Cancelar */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <Button
                variant="secondary"
                onClick={() => {
                  setShowEditModal(false); // Cierra el modal
                  setCurrentCategory(null); // Limpia la categoría actual
                  resetEdit(); // Limpia el formulario de edición
                }}
              >Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Spinner animation="border" size="sm" /> Guardando...
                  </>
                ) : (
                  "Guardar"
                )}
              </Button>

            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* ConfirmModal para confirmar acciones */}
      <ConfirmModal
        show={confirmModalShow}
        onHide={() => setConfirmModalShow(false)}
        title={messagesToModal.title}
        bodyText={messagesToModal.body}
        onConfirm={categoryToDelete ? onConfirmDelete : onConfirmCreate}
        loadingReq={loading}
      />

      {/* AlertModal para mostrar mensajes de éxito/error */}
      <AlertModal
        show={alertModalShow}
        onHide={() => setAlertModalShow(false)}
        title={messagesToModal.title}
        bodyText={messagesToModal.body}
        timeout={false}
      />
    </>
  );
};

export default CreateCategory;