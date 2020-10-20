import React, {useEffect, useState, Fragment} from "react";
import {getComentariosDeAnalise, criarComentarioDeAnalise} from "../../../../services/dres/PrestacaoDeContas.service";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faEdit} from '@fortawesome/free-solid-svg-icons'
import {FieldArray, Formik} from "formik";

export const ComentariosDeAnalise = ({prestacaoDeContas}) => {

    //console.log("ComentariosDeAnalise ", prestacaoDeContas);

    const initialComentarios = {
        comentario: ''
    };

    const [comentarios, setComentarios] = useState(initialComentarios);
    const [toggleExibeBtnAddComentario, setToggleExibeBtnAddComentario] = useState(true);

    useEffect(() => {
        carregaComentarios();
    }, []);

    const carregaComentarios = async () => {
        let comentarios = await getComentariosDeAnalise(prestacaoDeContas.uuid);
        console.log("comentarios ", comentarios);
        setComentarios(comentarios)
    };

    const onSubmit = async (values) => {
        const payload = {
            prestacao_conta: prestacaoDeContas.uuid,
            ordem: comentarios.length + 1,
            comentario: values.comentarios[0].comentario
        };

        await criarComentarioDeAnalise(payload);
        setToggleExibeBtnAddComentario(!toggleExibeBtnAddComentario)
        carregaComentarios()
    };

    return (
        <>
            <hr className='mt-4 mb-3'/>
            <h4 className='mb-2'>Comentários</h4>
            <p>Crie os comentários e arraste as caixas para cima ou para baixo para reorganizar.</p>
            <>
                <Formik
                    initialValues={comentarios}
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

                                    {comentarios && comentarios.length > 0 && comentarios.map((comentario, index) =>
                                        <div key={index} className="d-flex bd-highlight border mt-2">
                                            <div className="p-2 flex-grow-1 bd-highlight">{comentario.comentario}</div>
                                            <div className="p-2 bd-highlight">
                                                <button className="btn-editar-comentario ml-2">
                                                    <FontAwesomeIcon
                                                        style={{fontSize: '20px', marginRight: "0", color: '#A4A4A4'}}
                                                        icon={faEdit}
                                                    />
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                <FieldArray
                                    name="comentarios"
                                    render={({remove, push}) => (
                                        <>
                                            {values.comentarios && values.comentarios.length > 0 && values.comentarios.map((comentario, index) => {
                                                return (
                                                    <div key={index}>
                                                        <div className="form-row container-campos-dinamicos">

                                                            <div className="col mt-4">
                                                                <input
                                                                    value={comentario.comentario}
                                                                    name={`comentarios[${index}].comentario`}
                                                                    id="comentario"
                                                                    className="form-control"
                                                                    onChange={(e) => {
                                                                        props.handleChange(e);
                                                                    }
                                                                    }
                                                                    placeholder='Escreva o comentário aqui...'
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
                                                            }
                                                            }
                                                        >
                                                            + Adicionar novo comentário
                                                        </button>
                                                ) :
                                                    <button
                                                        type="button"
                                                        onClick={()=>onSubmit(values)}
                                                        className="btn btn btn-success mt-2 mr-2"

                                                    >
                                                        Confirmar comentário
                                                    </button>
                                                }


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