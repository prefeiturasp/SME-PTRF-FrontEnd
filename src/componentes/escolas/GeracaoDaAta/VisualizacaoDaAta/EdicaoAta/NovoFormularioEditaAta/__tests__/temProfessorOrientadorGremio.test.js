import { render, screen } from "@testing-library/react";
import { NovoFormularioEditaAta } from "../index";

jest.mock("../../../../../../../services/visoes.service", () => ({
  visoesService: {
    getPermissoes: jest.fn(() => true),
    featureFlagAtiva: jest.fn(() => true),
  },
}));

jest.mock("../../../EdicaoAtaPaa/utils", () => ({
  getParecerSelecionado: jest.fn(),
  isParecerReprovado: jest.fn(),
  adicionaProfessorGremioNaLista: jest.fn((lista, ataUuid, defaults, precisaProfessorGremio = true) => {
    if (!precisaProfessorGremio) {
      return lista.filter((p) => !p.professor_gremio);
    }
    const existeProfessor = lista.some((p) => p.professor_gremio);
    if (existeProfessor) {
      return lista.map((p) =>
        p.professor_gremio
          ? { ...p, id: p.id || p.uuid || "professor-gremio", professor_gremio: true, presente: p.presente ?? true }
          : p
      );
    }
    return [
      ...lista,
      {
        id: ataUuid ? `${ataUuid}-professor-gremio` : "professor-gremio",
        ata: ataUuid || "",
        cargo: defaults.cargo || "",
        identificacao: defaults.identificacao || "",
        nome: defaults.nome || "",
        editavel: true,
        membro: false,
        adicao: false,
        presente: defaults.presente ?? true,
        presidente_da_reuniao: false,
        secretario_da_reuniao: false,
        professor_gremio: true,
      },
    ];
  }),
  extraiProfessorDefaults: jest.fn(() => null),
  listaPossuiParticipantesAssociacao: jest.fn(),
  marcaParticipantesComoMembrosDaAssociacao: jest.fn(),
  normalizaParaData: jest.fn(),
}));

let mockPrecisaProfessorGremio = true;

jest.mock("formik", () => {
  const original = jest.requireActual("formik");
  return {
    ...original,
    Formik: ({ children }) => {
      const listaParticipantes = mockPrecisaProfessorGremio
        ? [{ id: 1, nome: "João", professor_gremio: true }]
        : [{ id: 1, nome: "João", professor_gremio: false }];
      
      return (
        <>
          {typeof children === "function"
            ? children({
                values: {
                  listaParticipantes,
                  stateFormEditarAta: {
                    tipo_reuniao: "ORDINARIA",
                    data_reuniao: "2025-12-18",
                    hora_reuniao: "10:00",
                    local_reuniao: "Sala X",
                    convocacao: "PRIMEIRA",
                    parecer_conselho: "APROVADA",
                  },
                },
                errors: {},
                touched: {},
                handleChange: jest.fn(),
                handleSubmit: jest.fn((e) => e?.preventDefault?.()),
                setFieldValue: jest.fn(),
              })
            : children}
        </>
      );
    },
    FieldArray: ({ render }) => render({ push: jest.fn(), remove: jest.fn() }),
  };
});

describe("NovoFormularioEditaAta - Possui Professor Orientador do Grêmio", () => {
  const baseProps = () => {
    return {
      stateFormEditarAta: {
        comentarios: "",
        parecer_conselho: "APROVADA",
        tipo_reuniao: "ORDINARIA",
        local_reuniao: "",
        presidente_reuniao: "tete",
        secretario_reuniao: "",
        data_reuniao: "2025-12-18",
        convocacao: "PRIMEIRA",
        cargo_presidente_reuniao: "Conselheiro",
        cargo_secretaria_reuniao: "",
        retificacoes: "",
        hora_reuniao: "00:00",
        tipo_ata: "APRESENTACAO",
        justificativa_repasses_pendentes: "",
      },
      tabelas: {
        tipos_ata: [
          {
            id: "APRESENTACAO",
            nome: "Apresentação",
          },
          {
            id: "RETIFICACAO",
            nome: "Retificação",
          },
        ],
        tipos_reuniao: [
          {
            id: "ORDINARIA",
            nome: "Ordinária",
          },
          {
            id: "EXTRAORDINARIA",
            nome: "Extraordinária",
          },
        ],
        convocacoes: [
          {
            id: "PRIMEIRA",
            nome: "1ª convocação",
          },
          {
            id: "SEGUNDA",
            nome: "2ª convocação",
          },
        ],
        pareceres: [
          {
            id: "APROVADA",
            nome: "Aprovada",
          },
          {
            id: "REJEITADA",
            nome: "Rejeitada",
          },
        ],
      },
      formRef: {
        current: {
          values: {
            stateFormEditarAta: {
              comentarios: "",
              parecer_conselho: "APROVADA",
              tipo_reuniao: "ORDINARIA",
              local_reuniao: "",
              presidente_reuniao: "tete",
              secretario_reuniao: "",
              data_reuniao: "2025-12-18",
              convocacao: "PRIMEIRA",
              cargo_presidente_reuniao: "Conselheiro",
              cargo_secretaria_reuniao: "",
              retificacoes: "",
              hora_reuniao: "00:00",
              tipo_ata: "APRESENTACAO",
              justificativa_repasses_pendentes: "",
            },
            listaParticipantes: [
              {
                id: 200906,
                identificacao: "6847340",
                nome: "RUBENS BATISTA SOBRINHO",
                cargo: "Presidente da diretoria executiva",
                membro: true,
                presente: true,
                professor_gremio: false,
                presidente_da_reuniao: false,
                secretario_da_reuniao: false,
              },
            ],
          },
          errors: {},
          touched: {},
          isSubmitting: false,
          isValidating: false,
          submitCount: 0,
          initialValues: {
            stateFormEditarAta: {
              comentarios: "",
              parecer_conselho: "APROVADA",
              tipo_reuniao: "ORDINARIA",
              local_reuniao: "",
              presidente_reuniao: "tete",
              secretario_reuniao: "",
              data_reuniao: "2025-12-18",
              convocacao: "PRIMEIRA",
              cargo_presidente_reuniao: "Conselheiro",
              cargo_secretaria_reuniao: "",
              retificacoes: "",
              hora_reuniao: "00:00",
              tipo_ata: "APRESENTACAO",
              justificativa_repasses_pendentes: "",
            },
            listaParticipantes: [
              {
                id: 200906,
                identificacao: "6847340",
                nome: "RUBENS BATISTA SOBRINHO",
                cargo: "Presidente da diretoria executiva",
                membro: true,
                presente: true,
                professor_gremio: false,
                presidente_da_reuniao: false,
                secretario_da_reuniao: false,
              },
            ],
          },
          initialErrors: {},
          initialTouched: {},
          isValid: true,
          dirty: false,
          validateOnBlur: true,
          validateOnChange: true,
          validateOnMount: false,
        },
      },
      uuid_ata: "763554c1-70bb-4f06-9c78-afcd9faf4a01",
      repassesPendentes: [
        {
          repasse_periodo: "2024.2",
          repasse_acao: "PTRF Básico",
          repasse_total: 96756,
        },
      ],
      erros: {},
      showModalAvisoRegeracaoAta: false,
    };
  };

  test("renderiza label 'RF Professor Orientador do Grêmio' quando precisaProfessorGremio é true", async () => {
    mockPrecisaProfessorGremio = true;
    
    const {
      stateFormEditarAta,
      tabelas,
      formRef,
      uuid_ata,
      repassesPendentes,
      erros,
      showModalAvisoRegeracaoAta,
    } = baseProps();

    render(
      <NovoFormularioEditaAta
        stateFormEditarAta={stateFormEditarAta}
        tabelas={tabelas}
        formRef={formRef}
        uuid_ata={uuid_ata}
        repassesPendentes={repassesPendentes}
        erros={erros}
        showModalAvisoRegeracaoAta={showModalAvisoRegeracaoAta}
        precisaProfessorGremio={true}
      />
    );

    const inputProf = screen.getByLabelText(
      /RF Professor Orientador do Grêmio/i
    );

    expect(inputProf).toBeInTheDocument();
  });

  test("não renderiza campo professor quando precisaProfessorGremio é false", async () => {
    mockPrecisaProfessorGremio = false;
    
    const {
      stateFormEditarAta,
      tabelas,
      formRef,
      uuid_ata,
      repassesPendentes,
      erros,
      showModalAvisoRegeracaoAta,
    } = baseProps();

    render(
      <NovoFormularioEditaAta
        stateFormEditarAta={stateFormEditarAta}
        tabelas={tabelas}
        formRef={formRef}
        uuid_ata={uuid_ata}
        repassesPendentes={repassesPendentes}
        erros={erros}
        showModalAvisoRegeracaoAta={showModalAvisoRegeracaoAta}
        precisaProfessorGremio={false}
      />
    );

    const inputProf = screen.queryByLabelText(
      /RF Professor Orientador do Grêmio/i
    );

    expect(inputProf).not.toBeInTheDocument();
  });
});
