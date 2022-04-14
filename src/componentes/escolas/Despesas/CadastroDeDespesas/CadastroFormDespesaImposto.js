import React from "react";
import { DatePickerField } from "../../../Globais/DatePickerField";
import CurrencyInput from "react-currency-input";
import { visoesService } from "../../../../services/visoes.service";
import { trataNumericos } from "../../../../utils/ValidacoesAdicionaisFormularios";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTimesCircle} from "@fortawesome/free-solid-svg-icons";

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
												despesaContext,
												acoes_custeio,
												setValorRateioRealizadoImposto,
												readOnlyCamposImposto,
												index,
												despesa_imposto,
												remove,
												formErrorsImposto,
												onCalendarCloseDataPagamentoImposto
											}) => {
    
	return(
		<>
		<div key={index}>
            {eh_despesa_com_retencao_imposto(formikProps.values) &&
				<div className="form-retencao-imposto">

					<div className="d-flex bd-highlight border-bottom mt-2 mb-2 align-items-center">
						<div className="flex-grow-1 bd-highlight">
							<p className='mb-0'>
								<strong>Imposto retido {index + 1}</strong>
							</p>
						</div>
						
						<div className="bd-highlight">
							<div className="d-flex justify-content-start">
								{index >= 1 && (
									<button
										type="button"
										className="btn btn-link btn-remover-despesa mr-2 d-flex align-items-center"
										onClick={() => remove(index)}
										disabled={!visoesService.getPermissoes(['delete_despesa'])}
									>
										<FontAwesomeIcon
											style={{
												fontSize: '17px',
												marginRight: "4px",
												color: "#B40C02"
											}}
											icon={faTimesCircle}
										/>
										Remover Imposto
									</button>
								)}
							</div>
						</div>
					</div>

					<div className="form-row">
						<div className="col-12 col-md-4 mt-1">
							<label htmlFor={`tipo_documento_${index}`}>Tipo de documento</label>
							<select
								value={
									despesa_imposto && despesa_imposto.tipo_documento !== null ? (
										despesa_imposto.tipo_documento === "object" ? despesa_imposto.tipo_documento.id : despesa_imposto.tipo_documento
									) : ""
								}
								onChange={formikProps.handleChange}
								onBlur={formikProps.handleBlur}
								name={`despesas_impostos[${index}].tipo_documento`}
								id={`tipo_documento_${index}`}
								className="form-control"
								disabled={readOnlyCamposImposto[index] || ![['add_despesa'], ['change_despesa']].some(visoesService.getPermissoes)}
							>
								<option key={0} value="">Selecione o tipo</option>
								{tipos_documento_com_recolhimento_imposto().map(item =>
									<option key={item.id} value={item.id}>{item.nome}</option>
								)}
							</select>
						</div>

						<div className="col-12 col-md-4 mt-1">
							<label htmlFor={`numero_documento_${index}`}>Número do documento</label>
							<input
								value={
									despesa_imposto && despesa_imposto.numero_documento !== null ? (
										despesa_imposto.numero_documento
									) : ""
								}
								onChange={(e) => {
									aux.onHandleChangeApenasNumero(e, formikProps.setFieldValue, `despesas_impostos[${index}].numero_documento`);
								}}
								onBlur={formikProps.handleBlur}
								name={`despesas_impostos[${index}].numero_documento`}
								id={`numero_documento_${index}`} type="text"
								className="form-control"
								placeholder={numeroDocumentoImpostoReadOnly(despesa_imposto.tipo_documento, index, formikProps.values) ? "" : "Digite o número"}
								disabled={readOnlyCamposImposto[index] || numeroDocumentoImpostoReadOnly(despesa_imposto.tipo_documento, index, formikProps.values) || ![['add_despesa'], ['change_despesa']].some(visoesService.getPermissoes)}
							/>
						</div>

						<div className="col-12 col-md-4 mt-1">
							
							<label htmlFor={`despesas_impostos[${index}].rateios[0].tipo_custeio`}>Tipo de despesa</label>
							<select
								value={preenche_tipo_despesa_custeio(formikProps.values, index)}
								onChange={(e) => {
									formikProps.handleChange(e);
								}}
								onBlur={formikProps.handleBlur}	
								name={`despesas_impostos[${index}].rateios[0].tipo_custeio`}
								id={`despesas_impostos[${index}].rateios[0].tipo_custeio`}
								className={"form-control retira-dropdown-select"}
								readOnly={true}
								disabled={true}
							>
								<option key={preenche_tipo_despesa_custeio(formikProps.values, index).id} value={preenche_tipo_despesa_custeio(formikProps.values, index).id}>{preenche_tipo_despesa_custeio(formikProps.values, index).nome}</option>
							</select>
						</div>
					</div>

					<div className="form-row">
						<div className="col-12 mt-4">
							<label htmlFor={`despesas_impostos[${index}].rateios[0].especificacao_material_servico`}>Especificação do imposto</label>
							<select
								value={
									despesa_imposto && despesa_imposto.rateios[0].especificacao_material_servico !== null ? (
										typeof despesa_imposto.rateios[0].especificacao_material_servico === "object" ? despesa_imposto.rateios[0].especificacao_material_servico.id : despesa_imposto.rateios[0].especificacao_material_servico
									) : ""
								}
								onChange={(e) => {
									formikProps.handleChange(e);
								}}
								name={`despesas_impostos[${index}].rateios[0].especificacao_material_servico`}
								id={`despesas_impostos[${index}].rateios[0].especificacao_material_servico`}
								className={"form-control"}
								disabled={readOnlyCamposImposto[index] || ![['add_despesa'], ['change_despesa']].some(visoesService.getPermissoes)}
							>
								<option key={0} value="">Selecione uma especificação</option>
								{
									despesa_imposto.rateios[0].tipo_custeio !== null && despesa_imposto.rateios[0].tipo_custeio !== undefined && despesa_imposto.rateios[0].tipo_custeio.id !== null && despesa_imposto.rateios[0].tipo_custeio.id !== undefined && typeof especificacoes_custeio === "object" && especificacoes_custeio[despesa_imposto.rateios[0].tipo_custeio] ? (especificacoes_custeio[despesa_imposto.rateios[0].tipo_custeio].map((item) => (
											<option className={!item.ativa ? 'esconde-especificacao-material-servico' : ''} key={item.id} value={item.id}>{item.descricao}</option>
									)))
									: (
										especificacoes_custeio && especificacoes_custeio[despesa_imposto.rateios[0].tipo_custeio] && especificacoes_custeio[despesa_imposto.rateios[0].tipo_custeio].map(item => (
											<option className={!item.ativa ? 'esconde-especificacao-material-servico' : ''} key={item.id} value={item.id}>{item.descricao}</option>
										))
									)
								}
							</select>
						</div>
					</div>

					<div className="form-row">
						<div className="col-md-6 mt-4">
							<label htmlFor={`tipo_transacao_${index}`}>Forma de pagamento</label>
							<select
								value={
									despesa_imposto.tipo_transacao !== null ? (despesa_imposto.tipo_transacao === "object" ? despesa_imposto.tipo_transacao.id : despesa_imposto.tipo_transacao) : ""
								}
								onChange={(e) => {
									formikProps.handleChange(e);
									aux.exibeDocumentoTransacaoImposto(e.target.value, setLabelDocumentoTransacaoImposto, labelDocumentoTransacaoImposto, setCssEscondeDocumentoTransacaoImposto, cssEscondeDocumentoTransacaoImposto, despesasTabelas, index)
								}}
								onBlur={formikProps.handleBlur}
								name={`despesas_impostos[${index}].tipo_transacao`}
								id={`tipo_transacao_${index}`}
								className="form-control"
								disabled={readOnlyCamposImposto[index] || ![['add_despesa'], ['change_despesa']].some(visoesService.getPermissoes)}
							>
								<option key={0} value="">Selecione o tipo</option>
								{despesasTabelas.tipos_transacao && despesasTabelas.tipos_transacao.map(item => (
									<option key={item.id} value={item.id}>{item.nome}</option>
								))}
							</select>
						</div>

						<div className="col-md-3 mt-4">
							<label htmlFor={`data_transacao_${index}`}>Data do pagamento</label>
							<DatePickerField
								name={`despesas_impostos[${index}].data_transacao`}
								id={`data_transacao_${index}`}
								value={
									despesa_imposto.data_transacao !== null ? despesa_imposto.data_transacao : ""
								}
								onChange={formikProps.setFieldValue}
								onCalendarClose={async () => {
									onCalendarCloseDataPagamentoImposto(formikProps.values, formikProps.setFieldValue, index)
								}}
								about={despesaContext.verboHttp}
								className="form-control"
								disabled={readOnlyCamposImposto[index] || ![['add_despesa'], ['change_despesa']].some(visoesService.getPermissoes)}
								maxDate={new Date()}
								minDate={formikProps.values.data_transacao}
							/>
							{formErrorsImposto[index] && formErrorsImposto[index].despesa_imposto_data_transacao && <span className="span_erro text-danger mt-1"> {formErrorsImposto[index].despesa_imposto_data_transacao}</span>}
						</div>

						<div className="col-12 col-md-3 mt-4">
							<div className={cssEscondeDocumentoTransacaoImposto[index] === '' ? cssEscondeDocumentoTransacaoImposto[index] : 'escondeItem'}>
								<label htmlFor={`documento_transacao_${index}`}>Número do {labelDocumentoTransacaoImposto[index]}</label>
								<input
									value={despesa_imposto.documento_transacao}
									onChange={formikProps.handleChange}
									onBlur={formikProps.handleBlur}
									name={`despesas_impostos[${index}].documento_transacao`}
									id={`documento_transacao_${index}`}
									type="text"
									className="form-control"
									placeholder="Digite o número do documento"
									disabled={readOnlyCamposImposto[index] || ![['add_despesa'], ['change_despesa']].some(visoesService.getPermissoes)}
								/>
							</div>
						</div>

					</div>
					

					<div className="form-row">
						<div className="col-12 col-md-3 mt-4">
							<label htmlFor={`despesas_impostos[${index}].rateios[0].acao_associacao`}>Ação</label>
							<select
								value={
									despesa_imposto.rateios[0].acao_associacao !== null ? (
										typeof despesa_imposto.rateios[0].acao_associacao === "object" ? despesa_imposto.rateios[0].acao_associacao.uuid : despesa_imposto.rateios[0].acao_associacao
									) : ""
								}
								onChange={formikProps.handleChange}
								name={`despesas_impostos[${index}].rateios[0].acao_associacao`}
								id={`despesas_impostos[${index}].rateios[0].acao_associacao`}
								className="form-control"
								disabled={readOnlyCamposImposto[index] || ![['add_despesa'], ['change_despesa']].some(visoesService.getPermissoes)}
							>
								<option value="">Selecione uma ação</option>
								{acoes_custeio().map(item =>
									<option key={item.uuid} value={item.uuid}>{item.nome}</option>
								)}
							</select>
						</div>

						<div className="col-12 col-md-3 mt-4">
							<label htmlFor={`despesas_impostos[${index}].rateios[0].conta_associacao`}>Tipo de conta utilizada</label>
							<select
								value={
									despesa_imposto.rateios[0].conta_associacao !== null ? (
										typeof despesa_imposto.rateios[0].conta_associacao === "object" ? despesa_imposto.rateios[0].conta_associacao.uuid : despesa_imposto.rateios[0].conta_associacao
									) : ""
								}
								onChange={formikProps.handleChange}
								name={`despesas_impostos[${index}].rateios[0].conta_associacao`}
								id={`despesas_impostos[${index}].rateios[0].conta_associacao`}
								className="form-control"
								disabled={readOnlyCamposImposto[index] || ![['add_despesa'], ['change_despesa']].some(visoesService.getPermissoes)}
							>
								<option key={0} value="">Selecione uma conta</option>
								{despesasTabelas.contas_associacao && despesasTabelas.contas_associacao.map(item => (
									<option key={item.uuid} value={item.uuid}>{item.nome}</option>
								))}
							</select>
						</div>

						<div className="col-12 col-md-3 mt-4">
							<label htmlFor={`despesas_impostos[${index}].rateios[0].valor_original`}>Valor do imposto</label>
							<CurrencyInput
								allowNegative={false}
								prefix='R$'
								decimalSeparator=","
								thousandSeparator="."
								value={despesa_imposto.rateios[0].valor_original}
								name={`despesas_impostos[${index}].rateios[0].valor_original`}
								id={`despesas_impostos[${index}].rateios[0].valor_original`}
								className={`form-control`}
								onChangeEvent={(e) => {
									formikProps.handleChange(e);
									setValorRateioRealizadoImposto(formikProps.setFieldValue, e.target.value, index)
								}}
								onBlur={formikProps.handleBlur}
								disabled={disabled || ![['add_despesa'], ['change_despesa']].some(visoesService.getPermissoes)}
							/>
						</div>

						<div className="col-12 col-md-3 mt-4">
							<label htmlFor={`despesas_impostos[${index}].rateios[0].valor_rateio`} className="label-valor-realizado">Valor realizado do imposto</label>
							<CurrencyInput
								allowNegative={false}
								prefix='R$'
								decimalSeparator=","
								thousandSeparator="."
								value={despesa_imposto.rateios[0].valor_rateio}
								name={`despesas_impostos[${index}].rateios[0].valor_rateio`}
								id={`despesas_impostos[${index}].rateios[0].valor_rateio`}
								className={`${ trataNumericos(despesa_imposto.rateios[0].valor_rateio) === 0 && despesaContext.verboHttp === "PUT" ? "is_invalid" : ""} form-control ${trataNumericos(despesa_imposto.rateios[0].valor_rateio) === 0 ? " input-valor-realizado-vazio" : " input-valor-realizado-preenchido"}`}
								onChangeEvent={formikProps.handleChange}
								onBlur={formikProps.handleBlur}
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