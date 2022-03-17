import React from "react";
import { DatePickerField } from "../../../Globais/DatePickerField";
import CurrencyInput from "react-currency-input";
import { visoesService } from "../../../../services/visoes.service";
import { trataNumericos } from "../../../../utils/ValidacoesAdicionaisFormularios";

export const CadastroFormDespesaImposto = ({
												formikProps, 
												eh_despesa_com_retencao_imposto,
												disabled, 
												tipos_documento_com_recolhimento_imposto, 
												numeroDocumentoImpostoReadOnly, 
												aux, 
												preenche_tipo_despesa_custeio,
												especificacoes_custeio,
												despesasTabelas,
												cssEscondeDocumentoTransacaoImposto,
												labelDocumentoTransacaoImposto,
												setCssEscondeDocumentoTransacaoImposto,
												setLabelDocumentoTransacaoImposto,
												setFormErrors,
												validacoesPersonalizadas,
												formErrors,
												despesaContext,
												acoes_custeio,
												setValorRateioRealizadoImposto,
												readOnlyCamposImposto,
												mostraModalExcluirImposto
											}) => {
    
	
	
    const setaValorRealizado = (setFieldValue, valor_original, valor_imposto) => {
		console.log(trataNumericos(valor_original), trataNumericos(valor_imposto))
		let resultado = trataNumericos(valor_original) - trataNumericos(valor_imposto);
		setFieldValue("valor_total", resultado)
	}
	return(
		<>
        <div className="container-retencao-imposto mt-2">
            <div className="form-row align-items-center box-escolha-retencao-imposto">
                <div className="col-auto">
                    <p className='mb-0 mr-4 font-weight-normal'>Este serviço teve/terá retenção de imposto por parte da Associação?</p>
                </div>
                <div className="col-auto">
                    <div className="form-check form-check-inline">
                        <input
                            name="retem_imposto"
                            onChange={(e) => {
                                formikProps.handleChange(e);
                                formikProps.setFieldValue("retem_imposto", true)
                            }}
                            onBlur={formikProps.handleBlur}
                            className={`form-check-input`}
                            type="radio"
                            id="retem_imposto_sim"
                            disabled={disabled}
                            checked={eh_despesa_com_retencao_imposto(formikProps.values)}
                            value={eh_despesa_com_retencao_imposto(formikProps.values)}
                        />
                        <label className="form-check-label" htmlFor="retem_imposto_sim">Sim</label>
                    </div>

                    <div className="form-check form-check-inline">
                        <input
                            name="retem_imposto"
                            onChange={(e) => {
                                formikProps.handleChange(e);
                                formikProps.setFieldValue("retem_imposto", false)
								mostraModalExcluirImposto();
                            }}
                            onBlur={formikProps.handleBlur}
                            className={`form-check-input`}
                            type="radio"
                            id="retem_imposto_nao"
                            disabled={disabled}
                            checked={!eh_despesa_com_retencao_imposto(formikProps.values)}
                            value={!eh_despesa_com_retencao_imposto(formikProps.values)}
                        />
                        <label className="form-check-label" htmlFor="retem_imposto_nao">Não</label>
                    </div>
                </div>
            </div>
		
		
            {eh_despesa_com_retencao_imposto(formikProps.values) &&
				<div className="form-retencao-imposto">
					<p><strong>Dados do imposto retido</strong></p>
					<div className="form-row">
						<div className="col-12 col-md-4 mt-1">
							<label htmlFor="despesa_imposto.tipo_documento">Tipo de documento</label>
							<select
								value={
									formikProps.values.despesa_imposto && formikProps.values.despesa_imposto.tipo_documento !== null ? (
										formikProps.values.despesa_imposto.tipo_documento === "object" ? formikProps.values.despesa_imposto.tipo_documento.id : formikProps.values.despesa_imposto.tipo_documento
									) : ""
								}
								onChange={formikProps.handleChange}
								onBlur={formikProps.handleBlur}
								name='despesa_imposto.tipo_documento'
								id='despesa_imposto.tipo_documento'
								className="form-control"
								disabled={readOnlyCamposImposto || ![['add_despesa'], ['change_despesa']].some(visoesService.getPermissoes)}
							>
								<option key={0} value="">Selecione o tipo</option>
								{tipos_documento_com_recolhimento_imposto().map(item =>
									<option key={item.id} value={item.id}>{item.nome}</option>
								)}
							</select>
						</div>

						<div className="col-12 col-md-4 mt-1">
							<label htmlFor="despesa_imposto.numero_documento">Número do documento</label>
							<input
								value={
									formikProps.values.despesa_imposto && formikProps.values.despesa_imposto.numero_documento !== null ? (
										formikProps.values.despesa_imposto.numero_documento
									) : ""
								}
								onChange={(e) => {
									aux.onHandleChangeApenasNumero(e, formikProps.setFieldValue, "despesa_imposto.numero_documento");
								}}
								onBlur={formikProps.handleBlur}
								name="despesa_imposto.numero_documento"
								id="despesa_imposto.numero_documento" type="text"
								className="form-control"
								placeholder={numeroDocumentoImpostoReadOnly ? "" : "Digite o número"}
								disabled={readOnlyCamposImposto || numeroDocumentoImpostoReadOnly || ![['add_despesa'], ['change_despesa']].some(visoesService.getPermissoes)}
							/>
						</div>

						<div className="col-12 col-md-4 mt-1">
							
							<label htmlFor={`despesa_imposto.rateios[0].tipo_custeio`}>Tipo de despesa</label>
							<select
								value={preenche_tipo_despesa_custeio().id}
								onChange={(e) => {
									formikProps.handleChange(e);
								}}
								onBlur={formikProps.handleBlur}	
								name={"despesa_imposto.rateios[0].tipo_custeio"}
								id={"despesa_imposto.rateios[0].tipo_custeio"}
								className={"form-control retira-dropdown-select"}
								readOnly={true}
								disabled={true}
							>
								<option key={preenche_tipo_despesa_custeio().id} value={preenche_tipo_despesa_custeio().id}>{preenche_tipo_despesa_custeio().nome}</option>
							</select>
						</div>
					</div>

					<div className="form-row">
						<div className="col-12 mt-4">
							<label htmlFor={`despesa_imposto.rateios[0].especificacao_material_servico`}>Especificação do imposto</label>
							<select
								value={
									formikProps.values.despesa_imposto && formikProps.values.despesa_imposto.rateios[0].especificacao_material_servico !== null ? (
										typeof formikProps.values.despesa_imposto.rateios[0].especificacao_material_servico === "object" ? formikProps.values.despesa_imposto.rateios[0].especificacao_material_servico.id : formikProps.values.despesa_imposto.rateios[0].especificacao_material_servico
									) : ""
								}
								onChange={formikProps.handleChange}
								name={"despesa_imposto.rateios[0].especificacao_material_servico"}
								id={"despesa_imposto.rateios[0].especificacao_material_servico"}
								className={"form-control"}
								disabled={readOnlyCamposImposto || ![['add_despesa'], ['change_despesa']].some(visoesService.getPermissoes)}
							>
								<option key={0} value="">Selecione uma especificação</option>
								{
									formikProps.values.despesa_imposto.rateios[0].tipo_custeio !== null && formikProps.values.despesa_imposto.rateios[0].tipo_custeio !== undefined && formikProps.values.despesa_imposto.rateios[0].tipo_custeio.id !== null && formikProps.values.despesa_imposto.rateios[0].tipo_custeio.id !== undefined && typeof especificacoes_custeio === "object" && especificacoes_custeio[formikProps.values.despesa_imposto.rateios[0].tipo_custeio] ? (especificacoes_custeio[formikProps.values.despesa_imposto.rateios[0].tipo_custeio].map((item) => (
											<option className={!item.ativa ? 'esconde-especificacao-material-servico' : ''} key={item.id} value={item.id}>{item.descricao}</option>
									)))
									: (
										especificacoes_custeio && especificacoes_custeio[formikProps.values.despesa_imposto.rateios[0].tipo_custeio] && especificacoes_custeio[formikProps.values.despesa_imposto.rateios[0].tipo_custeio].map(item => (
											<option className={!item.ativa ? 'esconde-especificacao-material-servico' : ''} key={item.id} value={item.id}>{item.descricao}</option>
										))
									)
								}
							</select>
						</div>
					</div>

					<div className="form-row">
						<div className="col-md-6 mt-4">
							<label htmlFor="despesa_imposto.tipo_transacao">Forma de pagamento</label>
							<select
								value={
									formikProps.values.despesa_imposto.tipo_transacao !== null ? (
										formikProps.values.despesa_imposto.tipo_transacao === "object" ? formikProps.values.despesa_imposto.tipo_transacao.id : formikProps.values.despesa_imposto.tipo_transacao
									) : ""
								}
								onChange={(e) => {
									formikProps.handleChange(e);
									aux.exibeDocumentoTransacao(e.target.value, setCssEscondeDocumentoTransacaoImposto, setLabelDocumentoTransacaoImposto, despesasTabelas)
								}}
								onBlur={formikProps.handleBlur}
								name='despesa_imposto.tipo_transacao'
								id='despesa_imposto.tipo_transacao'
								className="form-control"
								disabled={readOnlyCamposImposto || ![['add_despesa'], ['change_despesa']].some(visoesService.getPermissoes)}
							>
								<option key={0} value="">Selecione o tipo</option>
								{despesasTabelas.tipos_transacao && despesasTabelas.tipos_transacao.map(item => (
									<option key={item.id} value={item.id}>{item.nome}</option>
								))}
							</select>
						</div>

						<div className="col-md-3 mt-4">
							<label htmlFor="despesa_imposto.data_transacao">Data do pagamento</label>
							<DatePickerField
								name="despesa_imposto.data_transacao"
								id="despesa_imposto.data_transacao"
								value={
									formikProps.values.despesa_imposto.data_transacao !== null ? formikProps.values.despesa_imposto.data_transacao : ""
								}
								onChange={formikProps.setFieldValue}
								onCalendarClose={async () => {
									
									setFormErrors(await validacoesPersonalizadas(formikProps.values, formikProps.setFieldValue, "despesa_imposto"));
								}}
								about={despesaContext.verboHttp}
								className="form-control"
								disabled={readOnlyCamposImposto || ![['add_despesa'], ['change_despesa']].some(visoesService.getPermissoes)}
								maxDate={new Date()}
							/>
							{formErrors.despesa_imposto_data_transacao && <span className="span_erro text-danger mt-1"> {formErrors.despesa_imposto_data_transacao}</span>}
						</div>

						<div className="col-12 col-md-3 mt-4">
							<div className={cssEscondeDocumentoTransacaoImposto}>
								<label htmlFor="despesa_imposto.documento_transacao">Número do {labelDocumentoTransacaoImposto}</label>
								<input
									value={formikProps.values.despesa_imposto_documento_transacao}
									onChange={formikProps.handleChange}
									onBlur={formikProps.handleBlur}
									name="despesa_imposto.documento_transacao"
									id="despesa_imposto.documento_transacao"
									type="text"
									className="form-control"
									placeholder="Digite o número do documento"
									disabled={readOnlyCamposImposto || ![['add_despesa'], ['change_despesa']].some(visoesService.getPermissoes)}
								/>
							</div>
						</div>

					</div>
					

					<div className="form-row">
						<div className="col-12 col-md-3 mt-4">
							<label htmlFor="despesa_imposto.rateios[0].acao_associacao">Ação</label>
							<select
								value={
									formikProps.values.despesa_imposto.rateios[0].acao_associacao !== null ? (
										typeof formikProps.values.despesa_imposto.rateios[0].acao_associacao === "object" ? formikProps.values.despesa_imposto.rateios[0].acao_associacao.uuid : formikProps.values.despesa_imposto.rateios[0].acao_associacao
									) : ""
								}
								onChange={formikProps.handleChange}
								name='despesa_imposto.rateios[0].acao_associacao'
								id='despesa_imposto.rateios[0].acao_associacao'
								className="form-control"
								disabled={readOnlyCamposImposto || ![['add_despesa'], ['change_despesa']].some(visoesService.getPermissoes)}
							>
								<option value="">Selecione uma ação</option>
								{acoes_custeio().map(item =>
									<option key={item.uuid} value={item.uuid}>{item.nome}</option>
								)}
							</select>
						</div>

						<div className="col-12 col-md-3 mt-4">
							<label htmlFor="despesa_imposto.rateios[0].conta_associacao">Tipo de conta utilizada</label>
							<select
								value={
									formikProps.values.despesa_imposto.rateios[0].conta_associacao !== null ? (
										typeof formikProps.values.despesa_imposto.rateios[0].conta_associacao === "object" ? formikProps.values.despesa_imposto.rateios[0].conta_associacao.uuid : formikProps.values.despesa_imposto.rateios[0].conta_associacao
									) : ""
								}
								onChange={formikProps.handleChange}
								name='despesa_imposto.rateios[0].conta_associacao'
								id='despesa_imposto.rateios[0].conta_associacao'
								className="form-control"
								disabled={readOnlyCamposImposto || ![['add_despesa'], ['change_despesa']].some(visoesService.getPermissoes)}
							>
								<option key={0} value="">Selecione uma conta</option>
								{despesasTabelas.contas_associacao && despesasTabelas.contas_associacao.map(item => (
									<option key={item.uuid} value={item.uuid}>{item.nome}</option>
								))}
							</select>
						</div>

						<div className="col-12 col-md-3 mt-4">
							<label htmlFor="despesa_imposto.rateios[0].valor_original">Valor do imposto</label>
							<CurrencyInput
								allowNegative={false}
								prefix='R$'
								decimalSeparator=","
								thousandSeparator="."
								value={formikProps.values.despesa_imposto.rateios[0].valor_original}
								name="despesa_imposto.rateios[0].valor_original"
								id="vdespesa_imposto.rateios[0].valor_original"
								className={`form-control`}
								onChangeEvent={(e) => {
									formikProps.handleChange(e);
									setValorRateioRealizadoImposto(formikProps.setFieldValue, e.target.value)
									/* formikProps.setFieldValue("valor_total", formikProps.values.valor_original - e.target.value) */
									/* setaValorRealizado(formikProps.setFieldValue, formikProps.values.valor_original, e.target.value) */
								}}
								disabled={disabled || ![['add_despesa'], ['change_despesa']].some(visoesService.getPermissoes)}
							/>
						</div>

						<div className="col-12 col-md-3 mt-4">
							<label htmlFor="despesa_imposto.rateios[0].valor_rateio" className="label-valor-realizado">Valor realizado do imposto</label>
							<CurrencyInput
								allowNegative={false}
								prefix='R$'
								decimalSeparator=","
								thousandSeparator="."
								value={formikProps.values.despesa_imposto.rateios[0].valor_rateio}
								name="despesa_imposto.rateios[0].valor_rateio"
								id="despesa_imposto.rateios[0].valor_rateio"
								className={`${ trataNumericos(formikProps.values.despesa_imposto.rateios[0].valor_rateio) === 0 && despesaContext.verboHttp === "PUT" ? "is_invalid" : ""} form-control ${trataNumericos(formikProps.values.despesa_imposto.rateios[0].valor_rateio) === 0 ? " input-valor-realizado-vazio" : " input-valor-realizado-preenchido"}`}
								onChangeEvent={formikProps.handleChange}
								disabled={disabled || ![['add_despesa'], ['change_despesa']].some(visoesService.getPermissoes)}
							/>
						</div>

					</div>

				</div>	
            }
		</div>
        </>
		
    )
}