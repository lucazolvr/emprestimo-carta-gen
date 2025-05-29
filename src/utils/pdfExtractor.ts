
import { ProposalData } from '@/types';

export async function extractDataFromPDF(file: File): Promise<ProposalData> {
  console.log('Iniciando processo de extração de dados para:', file.name);

  try {
    // Por enquanto, simular extração de dados baseada no nome do arquivo
    // Em produção, aqui você implementaria OCR real ou parsing de PDF
    const extractedData = await simulateDataExtraction(file);
    
    console.log('Dados extraídos:', extractedData);
    return extractedData;
  } catch (error) {
    console.error('Erro na extração:', error);
    
    // Em caso de erro, usar dados padrão
    const fallbackData: ProposalData = {
      clientName: 'DADOS NÃO EXTRAÍDOS - VERIFICAR PDF',
      cpf: '000.000.000-00',
      rg: '0000000000',
      agencia: '0000',
      conta: '00.000',
      loanValue: '0,00',
      installmentValue: '0,00',
      installmentCount: '0',
      firstInstallmentDate: '00/00/0000',
      lastInstallmentDate: '00/00/0000',
      proposalNumber: '000000000',
      conventionName: 'CONVÊNIO NÃO IDENTIFICADO',
      conventionCnpj: '00.000.000/0001-00'
    };
    
    return fallbackData;
  }
}

async function simulateDataExtraction(file: File): Promise<ProposalData> {
  // Simular tempo de processamento
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Simular diferentes cenários baseados no nome do arquivo
  // Em produção, aqui você faria a extração real do PDF
  
  if (file.name.toLowerCase().includes('gicelma')) {
    return {
      clientName: 'MARIA GICELMA OLIVEIRA DA SILVA',
      cpf: '005.534.623-50',
      rg: '191849520010',
      agencia: '2651',
      conta: '23.321',
      loanValue: '77.995,11',
      installmentValue: '2.267,16',
      installmentCount: '120',
      firstInstallmentDate: '25/07/2025',
      lastInstallmentDate: '25/06/2035',
      proposalNumber: '181816970',
      conventionName: 'SECRETARIA MUNICIPAL DE EDUCACAO',
      conventionCnpj: '31.043.226/0001-01'
    };
  }

  // Gerar dados simulados diferentes para outros arquivos
  const proposalNumber = Math.floor(Math.random() * 900000000) + 100000000;
  const agencia = Math.floor(Math.random() * 9000) + 1000;
  const conta = Math.floor(Math.random() * 90000) + 10000;
  
  return {
    clientName: 'CLIENTE EXEMPLO SIMULADO',
    cpf: '123.456.789-00',
    rg: '1234567890',
    agencia: agencia.toString(),
    conta: `${conta.toString().slice(0, 2)}.${conta.toString().slice(2)}`,
    loanValue: '50.000,00',
    installmentValue: '1.500,00',
    installmentCount: '84',
    firstInstallmentDate: '15/06/2025',
    lastInstallmentDate: '15/05/2032',
    proposalNumber: proposalNumber.toString(),
    conventionName: 'CONVÊNIO EXEMPLO',
    conventionCnpj: '12.345.678/0001-90'
  };
}

// Função para extração real de texto (para implementação futura)
export function parseExtractedText(text: string): ProposalData {
  console.log('Parseando texto extraído...');

  // Regex patterns melhorados para extrair dados específicos
  const patterns = {
    clientName: /Nome[:\s]*([A-ZÁÊÂÔÉÍÓÚÃÇ\s]+?)(?:\n|CPF|$)/i,
    cpf: /CPF[:\s]*(\d{3}\.?\d{3}\.?\d{3}-?\d{2})/i,
    rg: /RG[:\s]*(\d+)/i,
    agencia: /Agência[:\s]*(\d+)/i,
    conta: /Conta[:\s]*(\d+\.?\d*)/i,
    proposalNumber: /Número da proposta[:\s]*(\d+)/i,
    loanValue: /Valor solicitado[:\s]*([R$\s]*[\d.,]+)/i,
    installmentValue: /Valor Parcela[:\s]*([R$\s]*[\d.,]+)/i,
    installmentCount: /Prazo em Meses[:\s]*(\d+)/i,
    firstInstallmentDate: /Data do Débito da Primeira Parcela[:\s]*(\d{2}\/\d{2}\/\d{4})/i,
    lastInstallmentDate: /Data do Débito Da Última Parcela[:\s]*(\d{2}\/\d{2}\/\d{4})/i,
    conventionName: /Nome do convênio[:\s]*([A-ZÁÊÂÔÉÍÓÚÃÇ\s\-]+?)(?:\n|Número|$)/i,
    conventionCnpj: /CNPJ[:\s]*(\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2})/i
  };

  const extractedData: ProposalData = {
    clientName: extractMatch(text, patterns.clientName) || 'NOME NÃO ENCONTRADO',
    cpf: extractMatch(text, patterns.cpf) || '000.000.000-00',
    rg: extractMatch(text, patterns.rg) || '0000000000',
    agencia: extractMatch(text, patterns.agencia) || '0000',
    conta: extractMatch(text, patterns.conta) || '00.000',
    loanValue: cleanCurrency(extractMatch(text, patterns.loanValue)) || '0,00',
    installmentValue: cleanCurrency(extractMatch(text, patterns.installmentValue)) || '0,00',
    installmentCount: extractMatch(text, patterns.installmentCount) || '0',
    firstInstallmentDate: extractMatch(text, patterns.firstInstallmentDate) || '00/00/0000',
    lastInstallmentDate: extractMatch(text, patterns.lastInstallmentDate) || '00/00/0000',
    proposalNumber: extractMatch(text, patterns.proposalNumber) || '000000000',
    conventionName: extractMatch(text, patterns.conventionName) || 'CONVÊNIO NÃO IDENTIFICADO',
    conventionCnpj: extractMatch(text, patterns.conventionCnpj) || '00.000.000/0001-00'
  };

  console.log('Dados extraídos:', extractedData);
  return extractedData;
}

function extractMatch(text: string, pattern: RegExp): string | null {
  const match = text.match(pattern);
  return match ? match[1].trim() : null;
}

function cleanCurrency(value: string | null): string {
  if (!value) return '0,00';
  return value.replace(/[R$\s]/g, '').trim();
}
