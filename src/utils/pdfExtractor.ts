
import { ProposalData } from '@/types';
import * as pdfjsLib from 'pdfjs-dist';

// Configurar o worker do PDF.js de forma mais robusta
const PDFJS_VERSION = '4.0.379';
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSION}/pdf.worker.min.js`;

export async function extractDataFromPDF(file: File): Promise<ProposalData> {
  console.log('Iniciando extração REAL do PDF:', file.name);

  try {
    // Extrair texto real do PDF
    const text = await extractTextFromPDF(file);
    console.log('Texto completo extraído:', text);
    
    if (!text || text.trim().length < 20) {
      throw new Error('Não foi possível extrair texto suficiente do PDF');
    }

    // Parse dos dados extraídos
    const extractedData = parseExtractedText(text);
    console.log('Dados finais extraídos:', extractedData);
    
    return extractedData;
    
  } catch (error) {
    console.error('ERRO na extração real:', error);
    throw new Error(`Falha na extração do PDF: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
  }
}

async function extractTextFromPDF(file: File): Promise<string> {
  console.log('Iniciando extração de texto do PDF...');
  
  const arrayBuffer = await file.arrayBuffer();
  
  // Configurar PDF.js com opções mais robustas
  const loadingTask = pdfjsLib.getDocument({
    data: arrayBuffer,
    useSystemFonts: true,
    disableFontFace: false,
    verbosity: 0
  });

  const pdf = await loadingTask.promise;
  console.log(`PDF carregado com ${pdf.numPages} páginas`);
  
  let fullText = '';
  
  // Extrair texto de todas as páginas
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    console.log(`Processando página ${pageNum}...`);
    
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();
    
    // Montar o texto da página preservando a estrutura
    let pageText = '';
    let lastY = null;
    
    for (const item of textContent.items) {
      const textItem = item as any;
      
      // Adicionar quebra de linha se mudou de linha significativamente
      if (lastY !== null && Math.abs(lastY - textItem.transform[5]) > 5) {
        pageText += '\n';
      }
      
      pageText += textItem.str + ' ';
      lastY = textItem.transform[5];
    }
    
    fullText += pageText + '\n\n';
  }
  
  console.log('Texto extraído com sucesso. Tamanho:', fullText.length, 'caracteres');
  return fullText;
}

export function parseExtractedText(text: string): ProposalData {
  console.log('Iniciando parsing do texto extraído...');
  
  // Patterns mais robustos para diferentes formatos
  const patterns = {
    // Nome do cliente - várias variações
    clientName: [
      /(?:Nome|NOME)[:\s]*(.+?)(?:\s*(?:CPF|RG|\n|$))/i,
      /(?:Cliente|CLIENTE)[:\s]*(.+?)(?:\s*(?:CPF|RG|\n|$))/i,
      /(?:Beneficiário|BENEFICIÁRIO)[:\s]*(.+?)(?:\s*(?:CPF|RG|\n|$))/i
    ],
    
    // CPF
    cpf: [
      /(?:CPF|C\.P\.F\.?)[:\s]*(\d{3}\.?\d{3}\.?\d{3}[-\.]?\d{2})/i,
      /(\d{3}\.?\d{3}\.?\d{3}[-\.]?\d{2})/g
    ],
    
    // RG
    rg: [
      /(?:RG|R\.G\.?)[:\s]*(\d+)/i,
      /(?:Identidade|IDENTIDADE)[:\s]*(\d+)/i
    ],
    
    // Agência
    agencia: [
      /(?:Agência|AGÊNCIA|Ag\.?)[:\s]*(\d+)/i,
      /(?:Agency|AGENCY)[:\s]*(\d+)/i
    ],
    
    // Conta
    conta: [
      /(?:Conta|CONTA|C\/C|CC)[:\s]*(\d+[.\-]?\d*)/i,
      /(?:Account|ACCOUNT)[:\s]*(\d+[.\-]?\d*)/i
    ],
    
    // Número da proposta
    proposalNumber: [
      /(?:Número|NÚMERO|Nº|N°)(?:\s*da\s*)?(?:proposta|PROPOSTA)[:\s]*(\d+)/i,
      /(?:Proposta|PROPOSTA)[:\s]*(?:n°|nº|número)?[:\s]*(\d+)/i,
      /(?:Protocolo|PROTOCOLO)[:\s]*(\d+)/i
    ],
    
    // Valor do empréstimo
    loanValue: [
      /(?:Valor|VALOR)(?:\s*(?:do\s*)?(?:empréstimo|EMPRÉSTIMO|solicitado|SOLICITADO))[:\s]*(?:R\$\s*)?([0-9.,]+)/i,
      /(?:Empréstimo|EMPRÉSTIMO)[:\s]*(?:R\$\s*)?([0-9.,]+)/i
    ],
    
    // Valor da parcela
    installmentValue: [
      /(?:Valor|VALOR)(?:\s*(?:da\s*)?(?:parcela|PARCELA|prestação|PRESTAÇÃO))[:\s]*(?:R\$\s*)?([0-9.,]+)/i,
      /(?:Parcela|PARCELA)[:\s]*(?:R\$\s*)?([0-9.,]+)/i,
      /(?:Prestação|PRESTAÇÃO)[:\s]*(?:R\$\s*)?([0-9.,]+)/i
    ],
    
    // Quantidade de parcelas
    installmentCount: [
      /(?:Prazo|PRAZO)(?:\s*em\s*meses|\s*meses)?[:\s]*(\d+)/i,
      /(\d+)(?:\s*(?:parcelas|PARCELAS|prestações|PRESTAÇÕES|meses|MESES))/i,
      /(?:Parcelas|PARCELAS)[:\s]*(\d+)/i
    ],
    
    // Datas
    firstInstallmentDate: [
      /(?:primeira|PRIMEIRA|1ª|1°)(?:\s*(?:parcela|PARCELA|prestação|PRESTAÇÃO))[:\s]*(\d{1,2}\/\d{1,2}\/\d{4})/i,
      /(?:Data|DATA)(?:\s*(?:da\s*)?(?:primeira|PRIMEIRA))[:\s]*(\d{1,2}\/\d{1,2}\/\d{4})/i
    ],
    
    lastInstallmentDate: [
      /(?:última|ÚLTIMA|final|FINAL)(?:\s*(?:parcela|PARCELA|prestação|PRESTAÇÃO))[:\s]*(\d{1,2}\/\d{1,2}\/\d{4})/i,
      /(?:Data|DATA)(?:\s*(?:da\s*)?(?:última|ÚLTIMA))[:\s]*(\d{1,2}\/\d{1,2}\/\d{4})/i
    ],
    
    // Convênio
    conventionName: [
      /(?:Convênio|CONVÊNIO|Convenio|CONVENIO)[:\s]*(.+?)(?:\s*(?:CNPJ|\n|$))/i,
      /(?:Órgão|ÓRGÃO|Orgao|ORGAO)[:\s]*(.+?)(?:\s*(?:CNPJ|\n|$))/i
    ],
    
    conventionCnpj: [
      /(?:CNPJ|C\.N\.P\.J\.?)[:\s]*(\d{2}\.?\d{3}\.?\d{3}\/?\d{4}[-\.]?\d{2})/i,
      /(\d{2}\.?\d{3}\.?\d{3}\/?\d{4}[-\.]?\d{2})/g
    ]
  };

  // Extrair cada campo usando múltiplos patterns
  const extractedData: ProposalData = {
    clientName: extractWithPatterns(text, patterns.clientName) || 'NOME NÃO ENCONTRADO',
    cpf: extractWithPatterns(text, patterns.cpf) || '000.000.000-00',
    rg: extractWithPatterns(text, patterns.rg) || '0000000000',
    agencia: extractWithPatterns(text, patterns.agencia) || '0000',
    conta: extractWithPatterns(text, patterns.conta) || '00.000',
    loanValue: cleanCurrency(extractWithPatterns(text, patterns.loanValue)) || '0,00',
    installmentValue: cleanCurrency(extractWithPatterns(text, patterns.installmentValue)) || '0,00',
    installmentCount: extractWithPatterns(text, patterns.installmentCount) || '0',
    firstInstallmentDate: extractWithPatterns(text, patterns.firstInstallmentDate) || '00/00/0000',
    lastInstallmentDate: extractWithPatterns(text, patterns.lastInstallmentDate) || '00/00/0000',
    proposalNumber: extractWithPatterns(text, patterns.proposalNumber) || '000000000',
    conventionName: extractWithPatterns(text, patterns.conventionName)?.trim() || 'CONVÊNIO NÃO IDENTIFICADO',
    conventionCnpj: extractWithPatterns(text, patterns.conventionCnpj) || '00.000.000/0001-00'
  };

  console.log('Dados extraídos do parsing:', extractedData);
  return extractedData;
}

function extractWithPatterns(text: string, patterns: RegExp[]): string | null {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      const result = match[1].trim();
      if (result.length > 0) {
        console.log(`Match encontrado para pattern ${pattern}: "${result}"`);
        return result;
      }
    }
  }
  return null;
}

function cleanCurrency(value: string | null): string {
  if (!value) return '0,00';
  return value.replace(/[R$\s]/g, '').trim();
}
