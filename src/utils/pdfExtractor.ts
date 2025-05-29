
import { createWorker } from 'tesseract.js';
import { ProposalData } from '@/types';

export async function extractDataFromPDF(file: File): Promise<ProposalData> {
  console.log('Iniciando processo de extração OCR para:', file.name);

  // Converter PDF para imagem usando canvas
  const arrayBuffer = await file.arrayBuffer();
  const canvas = await convertPDFToCanvas(arrayBuffer);
  
  // Usar Tesseract.js para OCR
  const worker = await createWorker('por');
  const { data: { text } } = await worker.recognize(canvas);
  await worker.terminate();

  console.log('Texto extraído:', text);

  // Extrair dados usando regex
  const extractedData = parseExtractedText(text);
  
  return extractedData;
}

async function convertPDFToCanvas(arrayBuffer: ArrayBuffer): Promise<HTMLCanvasElement> {
  // Implementação simplificada - em produção você usaria pdf.js
  // Por enquanto, criamos um canvas vazio para demonstração
  const canvas = document.createElement('canvas');
  canvas.width = 800;
  canvas.height = 1200;
  
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'black';
    ctx.font = '12px Arial';
    ctx.fillText('Simulação de PDF convertido para OCR', 50, 50);
  }
  
  return canvas;
}

function parseExtractedText(text: string): ProposalData {
  console.log('Parseando texto extraído...');

  // Regex patterns para extrair dados específicos
  const patterns = {
    clientName: /Nome[:\s]*([A-ZÁÊÂÔÉÍÓÚÃÇ\s]+)/i,
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
    conventionName: /Nome do convênio[:\s]*([A-ZÁÊÂÔÉÍÓÚÃÇ\s\-]+)/i,
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
