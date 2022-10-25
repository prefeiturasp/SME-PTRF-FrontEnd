import React from "react";
import {FieldArray, Formik} from "formik";
import ComentariosDeAnaliseSmeNotificados from "./ComentariosDeAnaliseSmeNotificados";

export const FormikForm = ({
    comentarios,
    comentariosNotificados,
    comentarioChecked, 
    SortableList, 
    onSortEnd, 
    validaConteudoComentario, 
    setToggleExibeBtnAddComentario, 
    toggleExibeBtnAddComentario,
    setDisabledBtnAddComentario, 
    disabledBtnAddComentario,
    setShowModalNotificarComentarios,
    onSubmit,
    comentariosReadOnly
}) => {
    return(
        <Formik
            initialValues={comentarios}
            enableReinitialize={true}
            validateOnBlur={true}
            onSubmit={onSubmit}
        >
            {props => 
                {
                    const {
                        values,
                    } = props;
                    return (
                        <form onSubmit={props.handleSubmit}>
                            <SortableList comentarios={comentarios} onSortEnd={onSortEnd} distance={1}/>

                            <FieldArray
                                    name="comentarios"
                                    render={({remove, push}) => (
                                        <>
                                            {values.comentarios && values.comentarios.length > 0 && values.comentarios.map((comentario, index) => {
                                                return (
                                                    <div key={index}>
                                                        <div className="form-row container-campos-dinamicos">

                                                            <div className="col mt-4 mb-4">
                                                                <input
                                                                    value={comentario.comentario}
                                                                    name={`comentarios[${index}].comentario`}
                                                                    id="comentario"
                                                                    className="form-control"
                                                                    onChange={(e) => {
                                                                        props.handleChange(e);
                                                                        validaConteudoComentario(e.target.value)
                                                                    }
                                                                    }
                                                                    placeholder='Escreva o comentário aqui...'
                                                                    disabled={comentariosReadOnly}
                                                                />
                                                                {props.touched.comentario && props.errors.comentario &&
                                                                    <span className="text-danger mt-1"> {props.errors.comentario}</span>
                                                                }
                                                            </div>

                                                            {index >= 0 && values.comentarios.length > 0 && (
                                                                <div
                                                                    className="col-1 mt-4 d-flex justify-content-center">
                                                                    <button
                                                                        className="btn-cancelar-comentario pt-0"
                                                                        onClick={() => {
                                                                            remove(index);
                                                                            setToggleExibeBtnAddComentario(!toggleExibeBtnAddComentario)
                                                                        }
                                                                        }>
                                                                        Cancelar
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div> /*div key*/
                                                )
                                            })}

                                            <ComentariosDeAnaliseSmeNotificados
                                                comentariosNotificados={comentariosNotificados}
                                            />

                                            <div className="d-flex  justify-content-start mt-3 mb-3">

                                                {toggleExibeBtnAddComentario ? (
                                                        <button
                                                            type="button"
                                                            className="btn btn btn-success mt-2 mr-2"
                                                            onClick={() => {
                                                                push({
                                                                    comentario: ''
                                                                }
                                                            );
                                                                setToggleExibeBtnAddComentario(!toggleExibeBtnAddComentario)
                                                                setDisabledBtnAddComentario(true);
                                                            }}
                                                            disabled={comentariosReadOnly}
                                                        >
                                                            + Adicionar novo comentário
                                                        </button>
                                                ) :
                                                    <button
                                                        type="button"
                                                        onClick={()=>onSubmit(values)}
                                                        className="btn btn btn-success mt-2 mr-2"
                                                        disabled={disabledBtnAddComentario}
                                                    >
                                                        Confirmar comentário
                                                    </button>
                                                }

                                                <button
                                                    className="btn btn btn-outline-success mt-2 mr-2"
                                                    type="button"
                                                    disabled={comentarioChecked.length <=0}
                                                    onClick={()=>setShowModalNotificarComentarios(true)}
                                                    >
                                                    Notificar a DRE
                                                </button>

                                            </div>
                                        </>
                                    )}
                                />
                        </form>
                    )
                }
            }

        </Formik>
    )
}