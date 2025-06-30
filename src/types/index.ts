
export interface ProposalData {
  clientName: string;
  cpf: string;
  rg: string;
  agencia: string;
  conta: string;
  loanValue: string;
  installmentValue: string;
  installmentCount: string;
  firstInstallmentDate: string;
  lastInstallmentDate: string;
  proposalNumber: string;
  conventionName: string;
  conventionCnpj: string;
}

export interface LetterTemplate {
  id: string;
  name: string;
  cnpj: string;
  signatory: string;
  signatoryRole: string;
  signatoryCpf: string;
}

export const LETTER_TEMPLATES: LetterTemplate[] = [
  {
    id: 'prefeitura',
    name: 'SECRETARIA MUNICIPAL DE EDUCAÇÃO -  MUNICÍPIO DE SÃO MATEUS',
    cnpj: '31.043.226/0001-01',
    signatory: 'TELMA DA SILVA VIEIRA',
    signatoryRole: 'SECRETARIA MUNICIPAL DE SÃO MATEUS DO MA',
    signatoryCpf: '279.219.053-15'
  },
  {
    id: 'ipam',
    name: 'INST MUNC PREV ASSIST DO MUNICIPIO IPAM',
    cnpj: '01.743.768/0001-18',
    signatory: 'IARA AMARAL LIMA LOPES',
    signatoryRole: 'INSTITUTO MUNICIPAL DE PREVIDÊNCIA E ASSIST IPAM',
    signatoryCpf: '048.597.213-14'
  }
];
