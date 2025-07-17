import { useParams } from "react-router-dom";
import { IconButton } from "../../../Globais/UI";
import { Steps } from "./components/Steps";
import { VincularDespesas } from "./VincularDespesas";
import { useMemo, useState, useEffect, useRef } from "react";
import { useGetBemProduzido } from "./hooks/useGetBemProduzido";
import { InformarValores } from "./InformarValores";
import { useNavigate, useSearchParams } from "react-router-dom";
import { usePostBemProduzido } from "./hooks/usePostBemProduzido";
import { usePatchBemProduzido } from "./hooks/usePatchBemProduzido";
import { usePostBemProduzidoRascunho } from "./hooks/usePostBemProduzidoRascunho";
import { usePatchBemProduzidoRascunho } from "./hooks/usePatchBemProduzidoRascunho";
import { ClassificarBem } from "./ClassificarBem";
import ModalConfirmarAlteracaoBemProduzido from "./components/ModalConfirmarAlteracaoBemProduzido";

const stepList = [
  { label: "Selecionar despesas" },
  { label: "Informar valores utilizados" },
  { label: "Classificar o bem", qa: "circulo-em-analise-trilha-status-pc" },
];

export const FormularioBemProduzido = () => {
  const { uuid } = useParams();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [despesasSelecionadas, setDespesasSelecionadas] = useState([]);
  const [rateiosComValores, setRateiosComValores] = useState([]);
  const [bemProduzidoItems, setBemProduzidoItems] = useState([]);
  const [habilitaClassificarBem, setHabilitaClassificarBem] = useState(false);
  const [habilitaCadastrarBem, setHabilitaCadastrarBem] = useState(false);
  const [statusCompletoBemProduzido, setStatusCompletoBemProduzido] = useState(false);
  const [showModalConfirmacao, setShowModalConfirmacao] = useState(false);
  const [onConfirmSalvar, setOnConfirmSalvar] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [originalData, setOriginalData] = useState(null);

  const { data } = useGetBemProduzido(uuid);
  const { mutationPost } = usePostBemProduzido();
  const { mutationPatch } = usePatchBemProduzido();

  useEffect(() => {
    setBemProduzidoItems(data?.items)
    setStatusCompletoBemProduzido(data?.status === "COMPLETO")

    if (data?.despesas) {
      const rateios = [];
      data.despesas.forEach(despesa => {
        (despesa.rateios || []).forEach(rateio => {
          rateios.push({
            uuid: rateio.uuid,
            bem_produzido_despesa: despesa.bem_produzido_despesa_uuid,
            valor_utilizado: Number(rateio.bem_produzido_rateio_valor_utilizado) || 0,
          });
        });
      });
      setRateiosComValores(rateios);
    }

    setOriginalData({
      despesasSelecionadas: JSON.parse(JSON.stringify(despesasSelecionadas)),
      rateiosComValores: JSON.parse(JSON.stringify(rateiosComValores)),
      bemProduzidoItems: JSON.parse(JSON.stringify(data?.items || [])),
    });
  }, [data])

  function shallowCompareArray(arr1, arr2) {
    if (!arr1 || !arr2 || arr1.length !== arr2.length) return false;
    return arr1.every((item, idx) => JSON.stringify(item) === JSON.stringify(arr2[idx]));
  }

  function houveAlteracao() {
    if (!originalData) return false;
    if (!shallowCompareArray(despesasSelecionadas, originalData.despesasSelecionadas)) return true;
    if (!shallowCompareArray(rateiosComValores, originalData.rateiosComValores)) return true;
    if (!shallowCompareArray(bemProduzidoItems, originalData.bemProduzidoItems)) return true;
    return false;
  }

  const handleSalvar = async () => {
    if (statusCompletoBemProduzido && houveAlteracao()) {
      setOnConfirmSalvar(() => async () => {
        setModalLoading(true);
        await salvar();
        setModalLoading(false);
      });
      setShowModalConfirmacao(true);
    } else {
      await salvar();
    }
  };

  const { mutationPost: mutationPostRascunho } = usePostBemProduzidoRascunho();
  const { mutationPatch: mutationPatchRascunho } =
    usePatchBemProduzidoRascunho();

  const podeEditar = uuid && data?.status === "INCOMPLETO";

  const valorTotalUtilizado = useMemo(() => {
    const total = rateiosComValores.reduce(
      (sum, r) => sum + (Number(r.valor_utilizado) || 0),
      0
    );
    return total;
  }, [rateiosComValores]);

  const valorTotalUtilizadoBemProduzido = Number(data?.valor_total_informado) || 0;

  const valorTotalDespesasVinculadas = useMemo(() => {
    return despesasSelecionadas.reduce(
      (sum, despesa) => sum + (Number(despesa.valor_total) || 0),
      0
    );
  }, [despesasSelecionadas]);

  const salvarRascunho = async () => {
    const payload = {
      despesas: despesasSelecionadas.map((despesa) => despesa.uuid),
      rateios: rateiosComValores,
      itens: bemProduzidoItems,
    };

    try {
      if (uuid) {
        await mutationPatchRascunho.mutateAsync({ uuid, payload });
      } else {
        await mutationPostRascunho.mutateAsync({ payload });
      }
      navigate(`/lista-situacao-patrimonial`);
    } catch (error) {}
  };

  const salvar = async () => {
    const payload = {
      despesas: despesasSelecionadas.map((despesa) => despesa.uuid),
      rateios: rateiosComValores,
      itens: bemProduzidoItems,
    };

    try {
      if (uuid) {
        await mutationPatch.mutateAsync({ uuid, payload });
      } else {
        await mutationPost.mutateAsync({ payload });
      }
      navigate(`/lista-situacao-patrimonial`);
    } catch (error) {}
  };

  const [isStuck, setIsStuck] = useState(false);
  const sentinelRef = useRef(null);

  useEffect(() => {
    const observer = new window.IntersectionObserver(
      ([e]) => setIsStuck(!e.isIntersecting),
      { threshold: [1] }
    );
    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }
    return () => {
      if (sentinelRef.current) observer.unobserve(sentinelRef.current);
    };
  }, []);

  return (
    <div>
      <div ref={sentinelRef} style={{ height: 1 }} />
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1000,
          backgroundColor: "white",
          paddingTop: isStuck ? "100px" : 0,
          transition: "padding-top 0.2s"
        }}
      >
        {step === 1 ? (
          <div className="d-flex justify-content-end pb-4 mt-2 mb-4">
            <IconButton
              icon="faAngleDoubleRight"
              label="Informar valores"
              iconPosition="right"
              variant="success"
              iconProps={{
                style: { color: "white" },
              }}
              disabled={!despesasSelecionadas.length}
              onClick={() => setStep(2)}
            />
          </div>
        ) : step === 2 ? (
          <div className="d-flex justify-content-between pb-4 mt-2 mb-4">
            <IconButton
              icon="faAngleDoubleLeft"
              label="Selecionar despesas"
              iconPosition="left"
              variant="success"
              iconProps={{
                style: { color: "white" },
              }}
              onClick={() => setStep(1)}
            />
            <IconButton
              icon="faAngleDoubleRight"
              label="Classificar o bem"
              iconPosition="right"
              variant="success"
              iconProps={{
                style: { color: "white" },
              }}
              disabled={!habilitaClassificarBem}
              onClick={() => setStep(3)}
            />
          </div>
        ) : step === 3 ? (
          <div className="d-flex justify-content-between pb-4 mt-2 mb-4">
            <IconButton
              icon="faAngleDoubleLeft"
              label="Informar valores"
              iconPosition="left"
              variant="success"
              iconProps={{
                style: { color: "white" },
              }}
              onClick={() => setStep(2)}
            />
            <IconButton
              label={uuid ? "Editar bem" : "Cadastrar bem"}
              variant="success"
              iconProps={{
                style: { color: "white" },
              }}
              disabled={!habilitaCadastrarBem}
              onClick={handleSalvar}
            />
          </div>
        ) : null}
        <Steps currentStep={step} stepList={stepList} />
      </div>

      {step === 1 ? (
        <VincularDespesas
          uuid={uuid}
          setStep={setStep}
          setDespesasSelecionadas={setDespesasSelecionadas}
          despesasSelecionadas={despesasSelecionadas}
          salvarRascunho={salvarRascunho}
          bemProduzidoDespesas={data?.despesas}
          statusCompletoBemProduzido={statusCompletoBemProduzido}
        />
      ) : null}
      {step === 2 ? (
        <InformarValores
          uuid={uuid}
          despesas={despesasSelecionadas}
          salvarRacuscunho={salvarRascunho}
          podeEditar={podeEditar}
          setRateiosComValores={setRateiosComValores}
          rateiosComValores={rateiosComValores}
          setHabilitaClassificarBem={setHabilitaClassificarBem}
          step={step}
          statusCompletoBemProduzido={statusCompletoBemProduzido}

        />
      ) : step === 3 ? (
        <ClassificarBem
          total={valorTotalUtilizado}
          items={bemProduzidoItems}
          salvarRacuscunho={salvarRascunho}
          salvar={handleSalvar}
          setBemProduzidoItems={setBemProduzidoItems}
          setHabilitaCadastrarBem={setHabilitaCadastrarBem}
          habilitaCadastrarBem={habilitaCadastrarBem}
          statusCompletoBemProduzido={statusCompletoBemProduzido}
        />
      ) : null}

      <ModalConfirmarAlteracaoBemProduzido
        open={showModalConfirmacao}
        onClose={() => setShowModalConfirmacao(false)}
        onConfirm={async () => {
          setShowModalConfirmacao(false);
          if (onConfirmSalvar) await onConfirmSalvar();
        }}
        loading={modalLoading}
        title={"Alteração de valores detectada"}
        message={"Você alterou valores do bem produzido. Tem certeza que deseja salvar essas alterações?"}
      />
    </div>
  );
};
