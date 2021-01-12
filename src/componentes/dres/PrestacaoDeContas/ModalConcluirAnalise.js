import React, {useState} from "react";
import {ModalBootstrapFormConcluirAnalise} from "../../Globais/ModalBootstrap";
import {DatePickerField} from "../../Globais/DatePickerField";

export const ModalConcluirAnalise = (props) => {

    const [selectOptions, setSelectOptions] = useState([]);

    const handleChange = (e) => {
        let target = e.target
        let name = target.name
        //here
        let value = Array.from(target.selectedOptions, option => option.value);
        setSelectOptions(value);
        // this.setState({
        //     [name]: value
        // });
    };

    const bodyTextarea = () => {

        //console.log("SELECT OPTION ", selectOptions)

        return (
            <form>
                <div className='row'>
                    <div className="col-12">
                        <label htmlFor="status">Como você deseja concluir a análise?</label>
                        <select
                            value={props.stateConcluirAnalise.status}
                            onChange={(e) => props.handleChangeConcluirAnalise(e.target.name, e.target.value)}
                            name="status"
                            id="status"
                            className="form-control"
                        >
                            <option value="">Selecione a sua conclusão</option>
                            {props.tabelaPrestacoes.status && props.tabelaPrestacoes.status.length > 0 && props.tabelaPrestacoes.status.filter(element => element.id !== 'NAO_APRESENTADA' && element.id !== 'NAO_RECEBIDA' && element.id !== 'RECEBIDA' && element.id !== 'EM_ANALISE').map(item => (
                                <option key={item.id} value={item.id}>{item.nome}</option>
                            ))}
                        </select>
                    </div>

                    {props.stateConcluirAnalise.status === 'APROVADA_RESSALVA' &&
                        <div className="col-12 mt-2">
                            <label htmlFor="resalvas">Motivo:</label>

                            {/*<select
                                name="selectOptions"
                                multiple={true}
                                onChange={(e)=>handleChange(e)}
                                value={selectOptions}
                                className="form-control"
                            >
                                {props.motivosAprovadoComRessalva && props.motivosAprovadoComRessalva.length > 0 && props.motivosAprovadoComRessalva.map((motivo)=>(
                                    <option key={motivo.uuid} value={motivo.uuid}>{motivo.motivo}</option>
                                ))}
                                <option value="zen">Zen</option>
                                <option value="ana">Ana</option>
                                <option value="junk">Junk</option>
                            </select>*/}



                            <select
                                name='resalvas'
                                value={props.stateConcluirAnalise.resalvas}
                                onChange={(e) => props.handleChangeConcluirAnalise(e.target.name, e.target.value)}
                                className="form-control"
                            >
                                <option value="">Selecione o motivo</option>
                                {props.motivosAprovadoComRessalva && props.motivosAprovadoComRessalva.length > 0 && props.motivosAprovadoComRessalva.map((motivo)=>(
                                    <option key={motivo.uuid} value={motivo.uuid}>{motivo.motivo}</option>
                                ))}
                            </select>
                        </div>
                    }
                    {props.stateConcluirAnalise.status === 'REPROVADA' &&
                        <div className="col-12 mt-2">
                            <label htmlFor="motivos_reprovacao">Motivos:</label>
                            <textarea
                                name='motivos_reprovacao'
                                value={props.stateConcluirAnalise.motivos_reprovacao}
                                onChange={(e) => props.handleChangeConcluirAnalise(e.target.name, e.target.value)}
                                className="form-control"
                            />
                        </div>
                    }
                    {props.stateConcluirAnalise.status === 'DEVOLVIDA' &&
                        <>
                        <div className="col-12 mt-2">
                            <label htmlFor="data_limite_devolucao">Data limite da devolução</label>
                            <DatePickerField
                                value={props.stateConcluirAnalise.data_limite_devolucao}
                                onChange={props.handleChangeConcluirAnalise}
                                name='data_limite_devolucao'
                                type="date"
                                className="form-control"
                            />
                        </div>

                        <div className="col-12 mt-2">
                            <p className='info-devolvida'><span>Atenção,</span> a prestação de contas será reaberta para a Associação que poderá fazer alteração e precisará concluí-la novamente.</p>
                        </div>
                        </>
                    }

                    <div className='col-12'>
                        <div className="d-flex  justify-content-end pb-3 mt-3">
                            <button onClick={props.handleClose} type="reset" className="btn btn btn-outline-success mt-2 mr-2">Cancelar</button>
                            <button
                                onClick={props.onConcluirAnalise}
                                type="button"
                                className="btn btn-success mt-2"
                                disabled={!props.stateConcluirAnalise.status || (props.stateConcluirAnalise.status === 'APROVADA_RESSALVA' && !props.stateConcluirAnalise.resalvas) || (props.stateConcluirAnalise.status === 'DEVOLVIDA' && !props.stateConcluirAnalise.data_limite_devolucao)}
                            >
                                Confirmar
                            </button>
                        </div>
                    </div>

                </div>
            </form>
        )
    };
    return (
        <>
            <ModalBootstrapFormConcluirAnalise
                show={props.show}
                onHide={props.handleClose}
                titulo={props.titulo}
                bodyText={bodyTextarea()}
                primeiroBotaoOnclick={props.handleClose}
                primeiroBotaoTexto={props.primeiroBotaoTexto}
                primeiroBotaoCss={props.primeiroBotaoCss}
                segundoBotaoOnclick={props.onConcluirAnalise}
                segundoBotaoCss={props.segundoBotaoCss}
                segundoBotaoTexto={props.segundoBotaoTexto}
            />
        </>
    );
};