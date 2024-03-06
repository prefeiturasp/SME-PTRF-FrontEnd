import React, {memo, useCallback, useEffect, useState, useMemo} from "react";
import {getComentariosDeAnalise, criarComentarioDeAnalise, editarComentarioDeAnalise, deleteComentarioDeAnalise, getReordenarComentarios, postNotificarComentarios} from "../../../../services/dres/PrestacaoDeContas.service";
import {FieldArray, Formik} from "formik";
import {ModalEditarDeletarComentario} from "../ModalEditarDeletarComentario";
import {ModalDeleteComentario} from "../ModalDeleteComentario";
import {ModalNotificarComentarios} from "../ModalNotificarComentarios";
import ComentariosDeAnaliseNotificados from "./ComentariosDeAnaliseNotificados";
import {
    DndContext,
    closestCenter,
    KeyboardSensor, 
    MouseSensor, 
    useSensor, 
    useSensors
  } from "@dnd-kit/core";
  import {
    arrayMove,
    SortableContext,
    verticalListSortingStrategy,
    useSortable
  } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const ComentariosDeAnalise = ({prestacaoDeContas="", associacaoUuid="", periodoUuid="", editavel=true}) => {

    // Comentários que NÃO foram notificados ainda e que podem ser alterados ou excluídos
    const [comentarios, setComentarios] = useState([]);
    // Comentários que JÁ foram notificados e que NÃO podem ser alterados ou excluídos
    const [comentariosNotificados, setComentariosNotificados] = useState([]);
    const [toggleExibeBtnAddComentario, setToggleExibeBtnAddComentario] = useState(true);
    const [showModalComentario, setShowModalComentario] = useState(false);
    const [showModalDeleteComentario, setShowModalDeleteComentario] = useState(false);
    const [showModalNotificarComentarios, setShowModalNotificarComentarios] = useState(false);
    const [comentarioEdicao, setComentarioEdicao] = useState(false);
    const [disabledBtnAddComentario, setDisabledBtnAddComentario] = useState(true);
    const [comentarioChecked, setComentarioChecked] = useState([]); // notificar comentários

    const carregaComentarios = useCallback(async () => {
        let comentarios;
        if (prestacaoDeContas && prestacaoDeContas.uuid){
            comentarios = await getComentariosDeAnalise(prestacaoDeContas.uuid);
        }else {
            comentarios = await getComentariosDeAnalise('', associacaoUuid, periodoUuid);
        }


        // Comentários que NÃO foram notificados ainda e que podem ser alterados ou excluídos
        setComentarios(comentarios.comentarios_nao_notificados);

        // Comentários que JÁ foram notificados e que NÃO podem ser alterados ou excluídos
        setComentariosNotificados(comentarios.comentarios_notificados)
    }, [prestacaoDeContas, associacaoUuid, periodoUuid]);


    useEffect(() => {
        carregaComentarios();
    }, [carregaComentarios]);


    const onSubmit = async (values) => {

        let payload;

        if (prestacaoDeContas && prestacaoDeContas.uuid) {
            payload = {
                prestacao_conta: prestacaoDeContas.uuid,
                ordem: comentarios.length + 1,
                comentario: values.comentarios[0].comentario,
                uuid: values.comentarios[0].uuid
            };
        }else {
            payload = {
                associacao: associacaoUuid,
                periodo: periodoUuid,
                ordem: comentarios.length + 1,
                comentario: values.comentarios[0].comentario,
                uuid: values.comentarios[0].uuid
            };
        }

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

        if (prestacaoDeContas && prestacaoDeContas.uuid) {
            setComentarioEdicao({
                ...comentarioEdicao,
                prestacao_conta: prestacaoDeContas.uuid,
                comentario: comentario,
                ordem: objComentario.ordem,
                uuid: objComentario.uuid
            });
        }else {
            setComentarioEdicao({
                ...comentarioEdicao,
                associacao_uuid: associacaoUuid,
                periodo_uuid: periodoUuid,
                comentario: comentario,
                ordem: objComentario.ordem,
                uuid: objComentario.uuid
            });
        }


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

    const verificaSeChecado = (comentario_uuid) =>{
        if (comentarioChecked && comentarioChecked.length > 0){
            return comentarioChecked.find(element=> element === comentario_uuid)
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
        let payload

        if (prestacaoDeContas && prestacaoDeContas.uuid) {
            payload = {
                associacao: prestacaoDeContas.associacao.uuid,
                periodo: prestacaoDeContas.periodo_uuid,
                comentarios: comentarioChecked
            };
        }else {
            payload = {
                associacao: associacaoUuid,
                periodo: periodoUuid,
                comentarios: comentarioChecked
            };
        }
        try {
            let notificar = await postNotificarComentarios(payload);
            console.log(notificar.mensagem)
        }catch (e) {
            console.log("Erro ao enviar notificações ", e)
        }
        setShowModalNotificarComentarios(false);
        setComentarioChecked([])
        await carregaComentarios()
    };

    //************ Novo sortable com dnd-kit
    function handleDragEnd(event) {
        const {active, over} = event;
    
        if (active.id !== over.id) {
            setComentarios((items) => {
                const activeIndex = items.findIndex(item => item.uuid === active.id);
                const overIndex = items.findIndex(item => item.uuid === over.id);
    
                const newItems = arrayMove(items, activeIndex, overIndex);
    
                const payload = {
                    comentarios_de_analise: newItems.map((comentario, index) => ({
                        prestacao_conta: prestacaoDeContas && prestacaoDeContas.uuid ? prestacaoDeContas.uuid : associacaoUuid,
                        ordem: index + 1,
                        comentario: comentario.comentario,
                        uuid: comentario.uuid,
                    }))
                };
    
                getReordenarComentarios(payload)
                    .then(() => {
                        return carregaComentarios();
                    })
                    .catch(error => {
                        console.error("Error updating comments order:", error);
                        return items;
                    });
                    
                return newItems;
            });
        }
    }

    const SortableItem = (props) => {
        const {
            attributes,
            listeners,
            setNodeRef,
            transform,
            transition
        } = useSortable({id: props.id});
    
        const style = {
            transform: CSS.Transform.toString(transform),
            transition
        }
    
        return (
            <div >
                <li className="d-flex bd-highlight border mt-2" ref={setNodeRef} style={style} {...attributes} {...listeners}>
                    <div data-qa={`comentario-${props.comentario.index}`} className="p-2 flex-grow-1 bd-highlight container-item-comentario">
                        <input
                            data-qa={`checkbox-comentario-${props.comentario.index}`}
                            type='checkbox'
                            onChange={(event)=>handleChangeCheckboxNotificarComentarios(event, props.comentario.uuid)}
                            checked={verificaSeChecado(props.comentario.uuid)}
                            className="checkbox-comentario-de-analise"
                            disabled={!editavel}
                        />
                        {props.comentario.comentario}
                    </div>
                    <div className="p-2 bd-highlight" >
                        <button
                            data-qa={`botao-editar-comentario-${props.comentario.index}`}
                            onClick={(event)=>{
                                setComentarioParaEdicao(props.comentario)
                                event.stopPropagation();
                            }}
                            type='button'
                            className={!editavel ? "btn-editar-comentario-disabled ml-2" : "btn-cancelar-comentario ml-2"}
                            disabled={!editavel}
                        >
                            Editar
                        </button>
                    </div>
                </li>
            </div>
        )
    }

    const SortableList = ({comentarios}) => {
        const comentariosIds = useMemo(() => {
            if (comentarios) {
              return comentarios.map((comentario) => comentario.uuid);
            }
            return [];
          }, [comentarios]);

        const mouseSensor = useSensor(MouseSensor, {
            activationConstraint: {
              distance: 10,
            },
        })
        const keyboardSensor = useSensor(KeyboardSensor)

        const sensors = useSensors(mouseSensor, keyboardSensor)

        return (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
                <SortableContext
                  items={comentariosIds}
                  strategy={verticalListSortingStrategy}
                >
                  {comentarios && comentarios.length && comentarios.map(comentario => <SortableItem key={comentario.uuid} id={comentario.uuid} comentario={comentario} disabled={!editavel}/>)}
                </SortableContext>
            </DndContext>
          );
    }

    //************ Fim novo sortable com dnd-kit

    return (
        <>
            <hr className='mt-4 mb-3'/>
            <h4 className='mb-2'>Comentários</h4>
            <p>Crie os comentários e arraste as caixas para cima ou para baixo para reorganizar. Notifique a Associação caso queira, selecionando os comentários no checkbox.</p>
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

                                <SortableList comentarios={comentarios} />

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
                                                                    data-qa="input-escrever-novo-comentario"
                                                                    value={comentario.comentario}
                                                                    name={`comentarios[${index}].comentario`}
                                                                    id="comentario"
                                                                    className="form-control"
                                                                    onChange={(e) => {
                                                                        props.handleChange(e);
                                                                        validaConteudoComentario(e.target.value)
                                                                    }}
                                                                    placeholder='Escreva o comentário aqui...'
                                                                    disabled={!editavel}
                                                                />
                                                                {props.touched.comentario && props.errors.comentario &&
                                                                    <span className="text-danger mt-1"> {props.errors.comentario}</span>
                                                                }
                                                            </div>

                                                            {index >= 0 && values.comentarios.length > 0 && (
                                                                <div
                                                                    className="col-1 mt-4 d-flex justify-content-center">
                                                                    <button
                                                                        data-qa="botao-cancelar-novo-comentario"
                                                                        className="btn-cancelar-comentario pt-0"
                                                                        onClick={() => {
                                                                            remove(index);
                                                                            setToggleExibeBtnAddComentario(!toggleExibeBtnAddComentario)
                                                                        }}
                                                                        disabled={!editavel}
                                                                    >
                                                                        Cancelar
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div> /*div key*/
                                                )
                                            })}

                                            <ComentariosDeAnaliseNotificados
                                                comentariosNotificados={comentariosNotificados}
                                            />

                                            <div className="d-flex  justify-content-start mt-3 mb-3">

                                                {toggleExibeBtnAddComentario ? (
                                                        <button
                                                            data-qa="botao-adicionar-novo-comentario"
                                                            type="button"
                                                            className="btn btn btn-success mt-2 mr-2"
                                                            onClick={() => {
                                                                push({
                                                                    comentario: ''
                                                                }
                                                            );
                                                                setToggleExibeBtnAddComentario(!toggleExibeBtnAddComentario)
                                                            }}
                                                            disabled={!editavel}
                                                        >
                                                            + Adicionar novo comentário
                                                        </button>
                                                ) :
                                                    <button
                                                        data-qa="botao-confirmar-novo-comentario"
                                                        type="button"
                                                        onClick={()=>onSubmit(values)}
                                                        className="btn btn btn-success mt-2 mr-2"
                                                        disabled={disabledBtnAddComentario}
                                                    >
                                                        Confirmar comentário
                                                    </button>
                                                }

                                                <button
                                                    data-qa="botao-notificar-associacao"
                                                    className="btn btn btn-outline-success mt-2 mr-2"
                                                    type="button"
                                                    disabled={comentarioChecked.length <=0 || !editavel}
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
                        texto="<p>Deseja enviar os comentários selecionados como notificações para a associação?</p>"
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

export default memo(ComentariosDeAnalise)