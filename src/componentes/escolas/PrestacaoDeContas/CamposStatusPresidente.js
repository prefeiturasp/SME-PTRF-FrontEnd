import React, {useEffect, useRef, useState} from "react";
import {Switch} from "antd";
import {ASSOCIACAO_UUID} from "../../../services/auth.service";
import {getStatusPresidente} from "../../../services/escolas/PrestacaoDeContas.service";
import {
    getConselheirosAssinaturaVacancia,
    getSubstitutosPresidenteVacancia,
} from "../../../services/MandatosVacancia.service";

export const CamposStatusPresidente = ({onDefinir}) => {
    const [status, setStatus] = useState("PRESENTE");
    const [cargo, setCargo] = useState("");
    const [cargos, setCargos] = useState([]);
    const [conselheiro, setConselheiro] = useState("");
    const [conselheiros, setConselheiros] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const onDefinirRef = useRef(onDefinir);
    onDefinirRef.current = onDefinir;

    useEffect(() => {
        let ativo = true;
        const carregar = async () => {
            const uuid = localStorage.getItem(ASSOCIACAO_UUID);
            try {
                const [statusAtual, lista, listaConselheiros] = await Promise.all([
                    getStatusPresidente(uuid),
                    getSubstitutosPresidenteVacancia(uuid),
                    getConselheirosAssinaturaVacancia(uuid),
                ]);
                if (!ativo) {
                    return;
                }
                const listaCargos = Array.isArray(lista) ? lista : [];
                const listaConselho = Array.isArray(listaConselheiros) ? listaConselheiros : [];
                const statusInicial = statusAtual && statusAtual.status_presidente === "AUSENTE" ? "AUSENTE" : "PRESENTE";
                const cargoSalvo = statusAtual && statusAtual.cargo_substituto_presidente_ausente
                    ? statusAtual.cargo_substituto_presidente_ausente
                    : "";
                const cargoValido = listaCargos.some((item) => item.id === cargoSalvo) ? cargoSalvo : "";
                const conselheiroSalvo = statusAtual && statusAtual.cargo_conselheiro_assinatura
                    ? statusAtual.cargo_conselheiro_assinatura
                    : "";
                const conselheiroValido = listaConselho.some((item) => item.id === conselheiroSalvo)
                    ? conselheiroSalvo
                    : "";
                setCargos(listaCargos);
                setConselheiros(listaConselho);
                setStatus(statusInicial);
                setCargo(cargoValido);
                setConselheiro(conselheiroValido);
            } finally {
                if (ativo) {
                    setCarregando(false);
                }
            }
        };
        carregar();
        return () => {
            ativo = false;
        };
    }, []);

    useEffect(() => {
        const substitutoValido = status === "PRESENTE" || !!cargo;
        const valido = !carregando && substitutoValido && !!conselheiro;
        const dados = carregando ? null : {
            status_presidente: status,
            cargo_substituto_presidente_ausente: status === "AUSENTE" ? cargo : null,
            cargo_conselheiro_assinatura: conselheiro || null,
        };
        onDefinirRef.current(dados, valido);
    }, [status, cargo, conselheiro, carregando]);

    return (
        <div className="mt-3" data-qa="campos-status-presidente">
            <p>
                Por favor verifique o status de ocupação do Presidente e se necessário informe o responsável pelas atribuições:
            </p>
            <div className="d-flex align-items-center mb-3">
                <span className="mr-3">Status de ocupação do Presidente:</span>
                <Switch
                    checked={status === "PRESENTE"}
                    onChange={(marcado) => {
                        setStatus(marcado ? "PRESENTE" : "AUSENTE");
                        if (marcado) {
                            setCargo("");
                        }
                    }}
                    checkedChildren="Presente"
                    unCheckedChildren="Ausente"
                    disabled={carregando}
                />
            </div>
            {status === "AUSENTE" && (
                <div className="d-flex align-items-center mb-3">
                    <label className="mb-0 mr-3 text-nowrap" htmlFor="substituto-presidente">
                        Responsável pelas atribuições:
                    </label>
                    <select
                        id="substituto-presidente"
                        className="form-control"
                        style={{maxWidth: "420px"}}
                        value={cargo}
                        onChange={(event) => setCargo(event.target.value)}
                        disabled={carregando}
                    >
                        <option value="">Escolha o responsável</option>
                        {cargos.map((item) => (
                            <option key={item.id} value={item.id}>{`${item.cargo} - ${item.nome}`}</option>
                        ))}
                    </select>
                </div>
            )}
            <p className="mt-4">
                Por favor selecione qual dos conselheiros deve constar na assinatura do Demonstrativo Financeiro:
            </p>
            <select
                id="conselheiro-assinatura"
                className="form-control"
                style={{maxWidth: "420px"}}
                aria-label="Conselheiro da assinatura"
                value={conselheiro}
                onChange={(event) => setConselheiro(event.target.value)}
                disabled={carregando}
            >
                <option value="">Escolha o conselheiro</option>
                {conselheiros.map((item) => (
                    <option key={item.id} value={item.id}>{item.nome}</option>
                ))}
            </select>
        </div>
    );
};
