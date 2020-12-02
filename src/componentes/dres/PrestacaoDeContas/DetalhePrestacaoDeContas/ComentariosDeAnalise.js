import React, {useEffect, useState} from "react";
import {getComentariosDeAnalise, criarComentarioDeAnalise, editarComentarioDeAnalise, deleteComentarioDeAnalise, getReordenarComentarios, postNotificarComentarios} from "../../../../services/dres/PrestacaoDeContas.service";
import {FieldArray, Formik} from "formik";
import {ModalEditarDeletarComentario} from "../ModalEditarDeletarComentario";
import {ModalDeleteComentario} from "../ModalDeleteComentario";
import {ModalNotificarComentarios} from "../ModalNotificarComentarios";
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
    const [showModalDeleteComentario, setShowModalDeleteComentario] = useState(false);
    const [showModalNotificarComentarios, setShowModalNotificarComentarios] = useState(false);
    const [comentarioEdicao, setComentarioEdicao] = useState(false);
    const [disabledBtnAddComentario, setDisabledBtnAddComentario] = useState(true);
    const [comentarioChecked, setComentarioChecked] = useState([]); // notificar comentários

    useEffect(() => {
        carregaComentarios();
    }, []);

    const carregaComentarios = async () => {
        let comentarios = await getComentariosDeAnalise(prestacaoDeContas.uuid);
        setComentarios(comentarios);
    };

    const onSubmit = async (values) => {
        const payload = {
            prestacao_conta: prestacaoDeContas.uuid,
            ordem: comentarios.length + 1,
            comentario: values.comentarios[0].comentario,
            uuid: values.comentarios[0].uuid
        };

        await criarComentarioDeAnalise(payload);
        setToggleExibeBtnAddComentario(true);
        await carregaComentarios();
    };

    const onHandleClose = () => {
        setShowModalComentario(false);
        setComentarioEdicao(false);
        setShowModalNotificarComentarios(false)
    };

    const onHandleCloseDeletarComentario = () => {
        setShowModalDeleteComentario(false);
    };

    const onDeleteComentarioTrue = () => {
        setShowModalDeleteComentario(false);
        onDeletarComentario();
    };

    const setComentarioParaEdicao = (comentario)=>{
        setComentarioEdicao(comentario);
        setShowModalComentario(true);
    };

    const onChangeComentario = (comentario, objComentario) =>{
        setComentarioEdicao({
            ...comentarioEdicao,
            prestacao_conta: prestacaoDeContas.uuid,
            comentario: comentario,
            ordem: objComentario.ordem,
            uuid: objComentario.uuid
        });
    };

    const onEditarComentario = async () => {
        setShowModalComentario(false);
        await editarComentarioDeAnalise(comentarioEdicao.uuid, comentarioEdicao);
        setToggleExibeBtnAddComentario(true);
        await carregaComentarios();
    };

    const onDeletarComentario = async () => {
        setShowModalComentario(false);
        setShowModalDeleteComentario(false);
        await deleteComentarioDeAnalise(comentarioEdicao.uuid);
        setToggleExibeBtnAddComentario(true);
        setComentarioChecked([]);
        await carregaComentarios()
    };

    const validaConteudoComentario = (conteudoComentario) =>{
        if (conteudoComentario) {
            setDisabledBtnAddComentario(false)
        }else {
            setDisabledBtnAddComentario(true)
        }
    };

    // *********** Sortable Comentário
    const onSortEnd = async ({oldIndex, newIndex}) => {
        let novoArrayComentarios = arrayMove(comentarios, oldIndex, newIndex);
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
            };
            await getReordenarComentarios(payload);
            await carregaComentarios()
        }
    };

    const verificaSeChecado = (comentario_uuid) =>{
        if (comentarioChecked && comentarioChecked.length > 0){
            return comentarioChecked.find(element=> element  === comentario_uuid)
        }
    };

    const handleChangeCheckboxNotificarComentarios = (event, comentario_uuid) =>{
        const comentarioClicado = comentarioChecked.indexOf(comentario_uuid);
        const all = [...comentarioChecked];

        if (comentarioClicado === -1) {
            all.push(comentario_uuid);
        } else {
            all.splice(comentarioClicado, 1);
        }
        setComentarioChecked(all);

    };

    const notificarComentarios = async () =>{
        const payload = {
            associacao: prestacaoDeContas.associacao.uuid,
            periodo: prestacaoDeContas.periodo_uuid,
            comentarios: comentarioChecked
        };
        
        try {
            let notificar = await postNotificarComentarios(payload);
            console.log(notificar.mensagem)
        }catch (e) {
            console.log("Erro ao enviar notificações ", e)
        }



        setShowModalNotificarComentarios(false);
        setComentarioChecked([])
    };

    const SortableItem = SortableElement(({comentario}) =>
        <li className="d-flex bd-highlight border mt-2">
            <div className="p-2 flex-grow-1 bd-highlight container-item-comentario">
                <input
                    type='checkbox'
                    onChange={(event)=>handleChangeCheckboxNotificarComentarios(event, comentario.uuid)}
                    checked={verificaSeChecado(comentario.uuid)}
                    className="checkbox-comentario-de-analise"
                />
                {comentario.comentario}
            </div>
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
                    onSubmit={onSubmit}
                >
                    {props => {
                        const {
                            values,
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
                                                                        validaConteudoComentario(e.target.value)
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
                                                    Notificar a Associação
                                                </button>

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
                        setShowModalDeleteComentario={setShowModalDeleteComentario}
                        comentario={comentarioEdicao}
                        onChangeComentario={onChangeComentario}
                        titulo="Edição de comentário"
                        primeiroBotaoTexto="Cancelar"
                        primeiroBotaoCss="outline-success"
                        segundoBotaoCss="success"
                        segundoBotaoTexto="Confirmar"
                    />
                </section>
                <section>
                    <ModalDeleteComentario
                        show={showModalDeleteComentario}
                        handleClose={onHandleCloseDeletarComentario}
                        onDeleteComentarioTrue={onDeleteComentarioTrue}
                        titulo="Excluir Comentário"
                        texto="<p>Deseja realmente excluir este comentário?</p>"
                        primeiroBotaoTexto="Cancelar"
                        primeiroBotaoCss="outline-success"
                        segundoBotaoCss="danger"
                        segundoBotaoTexto="Excluir"
                    />
                </section>
                <section>
                    <ModalNotificarComentarios
                        show={showModalNotificarComentarios}
                        handleClose={onHandleClose}
                        notificarComentarios={notificarComentarios}
                        titulo="Notificar comentários"
                        texto="<p>Deseja enviar os comentários selecionados como notificações para o presidente e vice-presidente da associação?</p>"
                        primeiroBotaoTexto="Sim"
                        primeiroBotaoCss="outline-success"
                        segundoBotaoCss="success"
                        segundoBotaoTexto="Não"
                    />
                </section>
            </>
        </>
    )
};