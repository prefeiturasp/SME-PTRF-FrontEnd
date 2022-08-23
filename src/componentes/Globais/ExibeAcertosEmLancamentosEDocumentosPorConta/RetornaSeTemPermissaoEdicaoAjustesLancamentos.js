import {visoesService} from "../../../services/visoes.service";

export const RetornaSeTemPermissaoEdicaoAjustesLancamentos = (prestacaoDeContas) => {

    const temPermissao = visoesService.getPermissoes(["change_analise_dre"])
    const visao = visoesService.getItemUsuarioLogado('visao_selecionada.nome')
    const status_pc = prestacaoDeContas && prestacaoDeContas.status ? prestacaoDeContas.status : ""

    return temPermissao && visao !== "DRE" && status_pc === 'DEVOLVIDA'

}