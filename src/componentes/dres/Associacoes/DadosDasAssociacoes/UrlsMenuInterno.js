import {visoesService} from "../../../../services/visoes.service";

export const UrlsMenuInterno = [
    {label: "Dados da unidade escolar", url: "dre-dados-da-unidade-educacional"},
    {label: "Dados da associação", url: "dre-dados-da-associacao"},
    {label: "Dados das contas", url: "dre-dados-das-contas"},
    {
        label: "Processos SEI",
        url: "dre-processos-sei",
        permissao: visoesService.getPermissoes(['access_processo_sei']),
    },
];


