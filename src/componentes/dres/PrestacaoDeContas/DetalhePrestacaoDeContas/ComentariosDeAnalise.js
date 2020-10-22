import React, {useEffect, useState} from "react";
import {getComentariosDeAnalise, criarComentarioDeAnalise, editarComentarioDeAnalise, deleteComentarioDeAnalise, getReordenarComentarios} from "../../../../services/dres/PrestacaoDeContas.service";
import {FieldArray, Formik} from "formik";
import {ModalEditarDeletarComentario} from "../ModalEditarDeletarComentario";
import {SortableContainer, SortableElement} from 'react-sortable-hoc';
import arrayMove from 'array-move';

export const ComentariosDeAnalise = ({prestacaoDeContas}) => {

    const initialComentarios = {
        prestacao_conta: '',
        ordem: '',
        comentario: '',
        uuid: '',
    };

    const [comentarios, setComentarios] = useState(initialComentarios);
    const [toggleExibeBtnAddComentario, setToggleExibeBtnAddComentario] = useState(true);
    const [showModalComentario, setShowModalComentario] = useState(false);
    const [comentarioEdicao, setComentarioEdicao] = useState(false);

    const [comentariosSortable, setComentariosSortable] = useState([])

    // useEffect(()=>{
    //     setComentariosSortable(comentarios)
    //     reordenarComentarios()
    // }, [comentarios])

    useEffect(() => {
        carregaComentarios();
    }, []);

    // useEffect(() => {
    //     gravarComentariosReordenados();
    // }, [comentariosSortable]);


    const carregaComentarios = async () => {
        let comentarios = await getComentariosDeAnalise(prestacaoDeContas.uuid);
        console.log("Carrega Comentários ", comentarios)
        setComentarios(comentarios)
    };

    const onSubmit = async (values) => {
        const payload = {
            prestacao_conta: prestacaoDeContas.uuid,
            ordem: comentarios.length + 1,
            comentario: values.comentarios[0].comentario,
            uuid: values.comentarios[0].uuid
        };

        await criarComentarioDeAnalise(payload);
        setToggleExibeBtnAddComentario(true)
        carregaComentarios()
    };

    const onHandleClose = () => {
        setShowModalComentario(false);
        setComentarioEdicao(false)
    };

    const setComentarioParaEdicao = (comentario)=>{
        console.log("setComentarioParaEdicao ", comentario)
        setComentarioEdicao(comentario)
        setShowModalComentario(true)
    };

    const onEditarComentario = async () => {
        setShowModalComentario(false);

        console.log("On onEditarComentario ", comentarioEdicao.uuid)

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



    const onChangeComentario = (comentario, objComentario) =>{

        console.log("On onChangeComentario ", objComentario)
        setComentarioEdicao({
            ...comentarioEdicao,
            prestacao_conta: prestacaoDeContas.uuid,
            comentario: comentario,
            ordem: objComentario.ordem,
            uuid: objComentario.uuid
        });
    };

    // *********** Sortable Comentário
    const onSortEnd = async ({oldIndex, newIndex}) => {
        let novoArrayComentarios = arrayMove(comentarios, oldIndex, newIndex);
        //setComentarios(novoArrayComentarios);
        //reordenarComentarios(novoArrayComentarios)

        if (novoArrayComentarios && novoArrayComentarios.length > 0 ){
            let arrayAnalises = [];
            novoArrayComentarios.map((comentario, index)=>{
                arrayAnalises.push({
                    prestacao_conta: prestacaoDeContas.uuid,
                    ordem: index+1,
                    comentario: comentario.comentario,
                    uuid: comentario.uuid,
                })
            });
            setComentarios(arrayAnalises);
            const payload = {
                comentarios_de_analise: [
                    ...arrayAnalises
                ]
            }

            //console.log('gravarComentariosReordenados ', payload)
            await getReordenarComentarios(payload);
            carregaComentarios()


            //setComentariosSortable(arrayAnalises)
        }
    };

    const reordenarComentarios = async (novoArrayComentarios) =>{
        if (novoArrayComentarios && novoArrayComentarios.length > 0 ){
            let arrayAnalises = [];
            novoArrayComentarios.map((comentario, index)=>{
                arrayAnalises.push({
                    prestacao_conta: prestacaoDeContas.uuid,
                    ordem: index+1,
                    comentario: comentario.comentario,
                    uuid: comentario.uuid,
                })
            });

            setComentarios(arrayAnalises);
            //setComentariosSortable(arrayAnalises)
        }
    };

    const gravarComentariosReordenados = async () =>{



        if (comentariosSortable && comentariosSortable.length > 0){
            const payload = {
                comentarios_de_analise: [
                    ...comentariosSortable
                ]
            }

            //console.log('gravarComentariosReordenados ', payload)
            await getReordenarComentarios(payload);
            //carregaComentarios()
        }


    }

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
                <ul className='p-0'>
                    {comentarios && comentarios.length > 0 && comentarios.map((comentario, index) => (
                        <SortableItem comentario={comentario} key={`item-${index}`} index={index} />
                    ))}
                </ul>
            </>
        );
    });
    // *********** Fim Sortable Comentário
    
    //console.log("Itens Reordenados ", comentariosSortable)

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