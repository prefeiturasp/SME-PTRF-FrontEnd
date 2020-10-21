import React, {useEffect, useState} from "react";
import {getComentariosDeAnalise, criarComentarioDeAnalise, editarComentarioDeAnalise, deleteComentarioDeAnalise} from "../../../../services/dres/PrestacaoDeContas.service";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faEdit} from '@fortawesome/free-solid-svg-icons'
import {FieldArray, Formik} from "formik";
import {ModalEditarDeletarComentario} from "../ModalEditarDeletarComentario";
import {SortableContainer, SortableElement} from 'react-sortable-hoc';
import arrayMove from 'array-move';

export const ComentariosDeAnalise = ({prestacaoDeContas}) => {

    const initialComentarios = {
        prestacao_conta: '',
        ordem: '',
        comentario: '',
    };

    const [comentarios, setComentarios] = useState(initialComentarios);
    const [toggleExibeBtnAddComentario, setToggleExibeBtnAddComentario] = useState(true);
    const [showModalComentario, setShowModalComentario] = useState(false);
    const [comentarioEdicao, setComentarioEdicao] = useState(false);

    const [itensReordenados, setItensReordenados] = useState([])

    useEffect(()=>{
        setItensReordenados(comentarios)
        reordenarArray()
    }, [comentarios])

    const onSortEnd = ({oldIndex, newIndex}) => {
        setComentarios(arrayMove(comentarios, oldIndex, newIndex));
    };

    const reordenarArray = () =>{
        if (comentarios && comentarios.length > 0 ){
            let arrayAnalises = [];
            comentarios.map((comentario, index)=>{
                arrayAnalises.push({
                    prestacao_conta: prestacaoDeContas.uuid,
                    ordem: index+1,
                    comentario: comentario.comentario,
                })
            });
            setItensReordenados(arrayAnalises)
        }
    };


    useEffect(() => {
        carregaComentarios();
    }, []);

    const carregaComentarios = async () => {
        let comentarios = await getComentariosDeAnalise(prestacaoDeContas.uuid);
        setComentarios(comentarios)
    };

    const onSubmit = async (values) => {
        const payload = {
            prestacao_conta: prestacaoDeContas.uuid,
            ordem: comentarios.length + 1,
            comentario: values.comentarios[0].comentario
        };

        await criarComentarioDeAnalise(payload);
        setToggleExibeBtnAddComentario(true)
        carregaComentarios()
    };

    const onHandleClose = () => {
        setShowModalComentario(false);
        setComentarioEdicao(false)
    };
    
    const onEditarComentario = async () => {
        setShowModalComentario(false);
        await editarComentarioDeAnalise(comentarioEdicao.uuid, comentarioEdicao);
        setToggleExibeBtnAddComentario(true);
        carregaComentarios()
    };

    const onDeletarComentario = async () => {
        setShowModalComentario(false);
        await deleteComentarioDeAnalise(comentarioEdicao.uuid);
        setToggleExibeBtnAddComentario(true);
        carregaComentarios()
    };

    const setComentarioParaEdicao = (comentario)=>{
        setComentarioEdicao(comentario)
        setShowModalComentario(true)
    };

    const onChangeComentario = (comentario) =>{
        setComentarioEdicao({
            ...comentarioEdicao,
            comentario: comentario
        });
    };

    const SortableItem = SortableElement(({comentario}) =>
        <li className="d-flex bd-highlight border mt-2">
            <div className="p-2 flex-grow-1 bd-highlight">{comentario.comentario}</div>
            <div className="p-2 bd-highlight" >
                <button onClick={()=>setComentarioParaEdicao(comentario)} type='button' className="btn-cancelar-comentario ml-2">
                    Editar
                </button>
            </div>
        </li>
    );
    const SortableList = SortableContainer(({comentarios}) => {
        return (
            <>
                <ul>
                    {comentarios && comentarios.length > 0 && comentarios.map((comentario, index) => (
                        <SortableItem comentario={comentario} key={`item-${index}`} index={index} />
                    ))}
                </ul>
            </>
        );
    });

    console.log("Itens Reordenados ", itensReordenados)

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

                                <SortableList comentarios={comentarios} onSortEnd={onSortEnd} />

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

                <section>
                    <ModalEditarDeletarComentario
                        show={showModalComentario}
                        handleClose={onHandleClose}
                        onEditarComentario={onEditarComentario}
                        onDeletarComentario={onDeletarComentario}
                        comentario={comentarioEdicao}
                        onChangeComentario={onChangeComentario}
                        titulo="Edição de comentário"
                        primeiroBotaoTexto="Cancelar"
                        primeiroBotaoCss="outline-success"
                        segundoBotaoCss="success"
                        segundoBotaoTexto="Confirmar"
                    />
                </section>

            </>


        </>
    )
};