import React, {useEffect, useState, Fragment} from "react";
import {getComentariosDeAnalise} from "../../../../services/dres/PrestacaoDeContas.service";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faEdit, faTrashAlt} from '@fortawesome/free-solid-svg-icons'
import {FieldArray, Formik} from "formik";
import CurrencyInput from "react-currency-input";

export const ComentariosDeAnalise = ({prestacaoDeContas}) => {

    console.log("ComentariosDeAnalise ", prestacaoDeContas);

    const initialComentarios = {
        prestacao_conta: '',
        ordem: '',
        comentario: ''
    };

    const [comentarios, setComentarios] = useState(initialComentarios);

    useEffect(() => {
        carregaComentarios();
    }, []);

    const carregaComentarios = async () => {
        let comentarios = await getComentariosDeAnalise(prestacaoDeContas.uuid);
        console.log("comentarios ", comentarios);
        setComentarios(comentarios)
    };

    const onSubmit = async (values) => {

    };

    return (
        <>
            <hr className='mt-4 mb-3'/>
            <h4 className='mb-2'>Comentários</h4>
            <p>Crie os comentários e arraste as caixas para cima ou para baixo para reorganizar.</p>

            <div className="d-flex bd-highlight border">
                {comentarios && comentarios.length > 0 && comentarios.map((comentario, index) =>
                    <Fragment key={index}>
                        <div className="p-2 flex-grow-1 bd-highlight">Comentario aszlmdflasjdflasjf</div>
                        <div className="p-2 bd-highlight">
                            <button className="btn-editar-comentario ml-2">
                                <FontAwesomeIcon
                                    style={{fontSize: '20px', marginRight: "0", color: '#A4A4A4'}}
                                    icon={faEdit}
                                />
                            </button>
                        </div>
                    </Fragment>
                )}
            </div>

            <>
                <Formik
                    initialValues={comentarios}
                    //validationSchema={YupSignupSchemaValoresReprogramados}
                    enableReinitialize={true}
                    validateOnBlur={true}
                    //validate={validateFormValoresReprogramados}
                    onSubmit={onSubmit}
                >
                    {props => {
                        const {
                            values,
                            setFieldValue,
                            errors,
                        } = props;
                        return (
                            <form onSubmit={props.handleSubmit}>
                                <FieldArray
                                    name="comentarios"
                                    render={({remove, push}) => (
                                        <>
                                            {values.comentarios && values.comentarios.length > 0 && values.comentarios.map((comentario, index) => {
                                                return (
                                                    <div key={index}>
                                                        <div className="form-row container-campos-dinamicos">

                                                            <div className="col mt-4">
                                                                <label htmlFor="comentario">Valor reprogramado</label>
                                                                <input
                                                                    value={comentario.comentario}
                                                                    name={`comentarios[${index}].comentario`}
                                                                    id="comentario"
                                                                    className="form-control"
                                                                    onChange={(e) => {
                                                                        props.handleChange(e);
                                                                    }
                                                                    }
                                                                />
                                                                {props.touched.comentario && props.errors.comentario &&
                                                                <span
                                                                    className="text-danger mt-1"> {props.errors.comentario}</span>}
                                                            </div>

                                                            <input type="hidden" name={`comentarios[${index}].name`}/>
                                                            {index >= 0 && values.comentarios.length > 0 && (
                                                                <div
                                                                    className="col-1 mt-4 d-flex justify-content-center">
                                                                    <button
                                                                        className="btn-excluir-valores-reprogramados mt-4 pt-2"
                                                                        onClick={() => remove(index)}>
                                                                        cancelar
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div> /*div key*/
                                                )
                                            })}

                                            <div className="d-flex  justify-content-start mt-3 mb-3">
                                                <button
                                                    type="button"
                                                    className="btn btn btn-success mt-2 mr-2"
                                                    onClick={() => push(
                                                        {
                                                            prestacao_conta: '',
                                                            ordem: '',
                                                            comentario: ''
                                                        }
                                                    )
                                                    }
                                                >
                                                    + Adicionar novo comentário
                                                </button>
                                            </div>
                                        </>
                                    )}
                                />


                            </form>
                        )
                    }}
                </Formik>
            </>


        </>
    )
};