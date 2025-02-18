export const mockData = [
  {
      "id": 1,
      "nome": "COVID-19",
      "criado_em": "2021-05-17T16:46:01.925716",
      "alterado_em": "2021-05-17T16:46:01.925733",
      "uuid": "77399870-4757-4b77-9851-a09dcb5564bc",
      "status": "ATIVO"
  },
  {
      "id": 3,
      "nome": "Orçamento Grêmio Estudantil",
      "criado_em": "2024-04-09T10:21:23.110103",
      "alterado_em": "2024-04-10T17:15:13.359080",
      "uuid": "8626ad88-3670-466e-8db0-269d09e841a1",
      "status": "ATIVO"
  },
  {
      "id": 2,
      "nome": "Programa de Cuidados com as Estudantes",
      "criado_em": "2021-08-18T11:05:38.533349",
      "alterado_em": "2021-08-19T13:50:52.384852",
      "uuid": "37d81729-ea0a-4e90-b7e3-a9b450f4bd0c",
      "status": "ATIVO"
  }
]

export const mockEdit = {
  id: 50,
  uuid: "8de8e23d-8ab5-474d-a0a8-c57857c23bc2",
  nome: "teste edit",
  tem_documento: true,
  operacao: 'edit',
  status: 'ATIVO'
};

export const mockCreate = {
  id: null,
  uuid: null,
  nome: "teste create",
  tem_documento: false,
  operacao: 'create',
  status: 'ATIVO'
};