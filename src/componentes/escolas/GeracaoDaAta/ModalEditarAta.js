import React from "react";
import {ModalBootstrapEditarAta} from "../../Globais/ModalBootstrap";
import {DatePickerField} from "../../Globais/DatePickerField";
import {visoesService} from "../../../services/visoes.service";

export const ModalEditarAta = ({
                                   dadosAta,
                                   show,
                                   handleClose,
                                   onSubmitEditarAta,
                                   onChange,
                                   stateFormEditarAta,
                                   tabelas,
                                   membrosCargos,
                                   handleChangeEditarAtaPresidente,
                                   handleChangeEditarAtaPresidenteNaoMembro,
                                   handleChangeEditarAtaSecretario,
                                   handleChangeEditarAtaSecretarioNaoMembro,
                               }) => {
    const bodyTextarea = () => {
        const podeEditarAta = [['change_ata_prestacao_contas']].some(visoesService.getPermissoes)
        return (
            <form className="form-group">
                <div className="row">
                    <div className='col-6'>
                        <label htmlFor="tipo_reuniao">Tipo de Reunião</label>
                        <select
                            value={stateFormEditarAta.tipo_reuniao}
                            onChange={(e) => onChange(e.target.name, e.target.value)}
                            name="tipo_reuniao"
                            className="form-control"
                            disabled={!podeEditarAta}
                        >
                            {tabelas && tabelas.tipos_reuniao && tabelas.tipos_reuniao.map((tipo) =>
                                <option key={tipo.id} value={tipo.id}>{tipo.nome}</option>
                            )}
                        </select>
                    </div>
                    <div className='col-6'>
                        <label htmlFor="data_reuniao">Data</label>
                        <DatePickerField
                            name="data_reuniao"
                            value={stateFormEditarAta.data_reuniao}
                            onChange={onChange}
                            disabled={!podeEditarAta}
                        />
                    </div>
                </div>
                <div className='row'>
                    <div className='col-6'>
                        <label htmlFor="local_reuniao" className="mt-3">Local da reunião</label>
                        <input
                            value={stateFormEditarAta.local_reuniao}
                            onChange={(e) => onChange(e.target.name, e.target.value)}
                            name="local_reuniao"
                            className="form-control"
                            disabled={!podeEditarAta}
                        />
                    </div>
                    <div className='col-6'>
                        <label htmlFor="convocacao" className="mt-3">Abertura da reunião</label>
                        <select
                            value={stateFormEditarAta.convocacao}
                            onChange={(e) => onChange(e.target.name, e.target.value)}
                            name="convocacao"
                            className="form-control"
                            disabled={!podeEditarAta}
                        >
                            {tabelas && tabelas.convocacoes && tabelas.convocacoes.map((tipo) =>
                                <option key={tipo.id} value={tipo.id}>{tipo.nome}</option>
                            )}
                        </select>
                    </div>
                </div>

                <div className='row'>
                    <div className='col-12'>
                        <label htmlFor="presidente_reuniao" className="mt-3">Presidente da reunião</label>
                        <select
                            value={stateFormEditarAta.presidente_reuniao}
                            onChange={(e) => {
                                onChange(e.target.name, e.target.value)
                                handleChangeEditarAtaPresidente(e)
                            }}
                            name="presidente_reuniao"
                            className="form-control"
                            disabled={!podeEditarAta}
                        >
                            <option value=''>Não membro</option>
                            {membrosCargos && membrosCargos.length > 0 && membrosCargos.map((membro) =>
                                <option data-objeto={JSON.stringify({...membro})} key={membro.nome}
                                        value={membro.nome}>{membro.nome}</option>
                            )}
                        </select>
                    </div>
                </div>
                <div className='row'>
                    {!membrosCargos.find(membro => membro.nome === stateFormEditarAta.presidente_reuniao) &&
                        <div className='col-6'>
                            <label htmlFor="presidente_reuniao_nao_membro" className="mt-3">Nome do membro</label>
                            <input
                                defaultValue={stateFormEditarAta.presidente_reuniao}
                                onChange={(e) => {
                                    handleChangeEditarAtaPresidenteNaoMembro(e.target.value)
                                }}
                                name="presidente_reuniao_nao_membro"
                                className="form-control"
                                disabled={!podeEditarAta}
                            />
                        </div>
                    }
                    <div
                        className={!membrosCargos.find(membro => membro.nome === stateFormEditarAta.presidente_reuniao) ? 'col-6' : 'col-12'}>
                        <label htmlFor="cargo_presidente_reuniao" className="mt-3">Cargo</label>
                        <input
                            value={stateFormEditarAta.cargo_presidente_reuniao}
                            onChange={(e) => onChange(e.target.name, e.target.value)}
                            name="cargo_presidente_reuniao"
                            className="form-control"
                            disabled={!membrosCargos.find(membro => membro.nome === stateFormEditarAta.presidente_reuniao) ? !podeEditarAta : true}
                        />
                    </div>
                </div>
                <div className='row'>
                    <div className='col-12'>
                        <label htmlFor="secretario_reuniao" className="mt-3">Secretário da reunião</label>
                        <select
                            value={stateFormEditarAta.secretario_reuniao}
                            onChange={(e) => {
                                onChange(e.target.name, e.target.value)
                                handleChangeEditarAtaSecretario(e)
                            }}
                            name="secretario_reuniao"
                            className="form-control"
                            disabled={!podeEditarAta}
                        >
                            <option value=''>Não membro</option>
                            {membrosCargos && membrosCargos.length > 0 && membrosCargos.map((membro) =>
                                <option data-objeto={JSON.stringify({...membro})} key={membro.nome} value={membro.nome}>{membro.nome}</option>
                            )}
                        </select>
                    </div>
                </div>
                <div className='row'>
                    {!membrosCargos.find(membro => membro.nome === stateFormEditarAta.secretario_reuniao) &&
                        <div className='col-6'>
                            <label htmlFor="secretario_reuniao_nao_membro" className="mt-3">Nome do membro</label>
                            <input
                                defaultValue={stateFormEditarAta.secretario_reuniao}
                                onChange={(e) => {
                                    handleChangeEditarAtaSecretarioNaoMembro(e.target.value)
                                }}
                                name="secretario_reuniao_nao_membro"
                                className="form-control"
                                disabled={!podeEditarAta}
                            />
                        </div>
                    }
                    <div className={!membrosCargos.find(membro => membro.nome === stateFormEditarAta.secretario_reuniao) ? 'col-6' : 'col-12'}>
                        <label htmlFor="cargo_secretaria_reuniao" className="mt-3">Cargo</label>
                        <input
                            value={stateFormEditarAta.cargo_secretaria_reuniao}
                            onChange={(e) => onChange(e.target.name, e.target.value)}
                            name="cargo_secretaria_reuniao"
                            className="form-control"
                            disabled={!membrosCargos.find(membro => membro.nome === stateFormEditarAta.secretario_reuniao) ? !podeEditarAta : true}
                        />
                    </div>
                </div>

                <div className="row">
                    {dadosAta && dadosAta.tipo_ata === "RETIFICACAO" &&
                        <div className="col-12 mt-3">
                            <div className="form-group">
                                <label htmlFor="retificacoes" className="mb-0">Retificações</label>
                                <p><small>Utilize esse campo para registrar as retificações da prestação de
                                    contas</small>
                                </p>
                                <textarea
                                    rows="3"
                                    placeholder="Escreva seu texto aqui"
                                    value={stateFormEditarAta.retificacoes}
                                    onChange={(e) => onChange(e.target.name, e.target.value)}
                                    name="retificacoes"
                                    className="form-control"
                                    disabled={!podeEditarAta}
                                />
                            </div>
                        </div>
                    }
                    <div className="col-12 mt-3">
                        <div className="form-group">
                            <label htmlFor="comentarios" className="mb-0">Manifestações, Comentários e Justificativas</label>
                            <p><small>Utilize esse campo para registrar possíveis dúvidas, discussões, esclarecimentos aparecidos durante a reunião</small></p>
                            <textarea
                                rows="3"
                                placeholder="Escreva seu texto aqui"
                                value={stateFormEditarAta.comentarios}
                                onChange={(e) => onChange(e.target.name, e.target.value)}
                                name="comentarios"
                                className="form-control"
                                disabled={!podeEditarAta}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="parecer_conselho">Como os presentes se posicionam à prestação de contas apresentada?</label>
                            <select
                                value={stateFormEditarAta.parecer_conselho}
                                onChange={(e) => onChange(e.target.name, e.target.value)}
                                name="parecer_conselho"
                                className="form-control"
                                disabled={!podeEditarAta}
                            >
                                {tabelas && tabelas.pareceres && tabelas.pareceres.map((tipo) =>
                                    <option key={tipo.id} value={tipo.id}>{tipo.nome}</option>
                                )}
                            </select>
                        </div>
                    </div>
                </div>
            </form>
        )
    };
    const podeEditarAta = [['change_ata_prestacao_contas']].some(visoesService.getPermissoes)
    return (
        <ModalBootstrapEditarAta
            show={show}
            onHide={handleClose}
            titulo="Editar Ata de apresentação"
            bodyText={bodyTextarea()}
            primeiroBotaoOnclick={handleClose}
            primeiroBotaoTexto="Cancelar"
            primeiroBotaoCss="outline-success"
            segundoBotaoOnclick={onSubmitEditarAta}
            segundoBotaoTexto={podeEditarAta ? "Salvar" : ""}
            segundoBotaoCss="success"
        />
    )
};