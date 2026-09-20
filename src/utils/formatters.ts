// ============================================================================
// FORMATADORES PADRÃO BRASIL (24H & DD/MM/AAAA)
// ============================================================================

/**
 * Formata qualquer data para DD/MM/AAAA
 */
export const formatDateBR = (dateStr?: string | null): string => {
  if (!dateStr) return '-';
  
  const trimmed = dateStr.trim();

  // Se já for DD/MM/AAAA
  if (/^\d{2}\/\d{2}\/\d{4}/.test(trimmed)) {
    return trimmed.slice(0, 10);
  }

  // Se contiver espaço ou T (ex: '2026-09-22 15:00' ou '2026-09-22T15:00:00')
  const datePart = trimmed.split(/[ T]/)[0];
  if (/^\d{4}-\d{2}-\d{2}$/.test(datePart)) {
    const [year, month, day] = datePart.split('-');
    return `${day}/${month}/${year}`;
  }

  // Tenta Date parse
  const d = new Date(trimmed);
  if (isNaN(d.getTime())) return datePart || trimmed;
  
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

/**
 * Formata data e hora no padrão brasileiro exigido: "Horário - Data"
 * Exemplo: "15:00 - 22/09/2026"
 */
export const formatDateTimeBR = (dateStr?: string | null, timeStr?: string | null): string => {
  if (!dateStr) return '-';

  const trimmed = dateStr.trim();
  let datePart = '';
  let timePart = timeStr?.trim() || '';

  // Se contiver espaço (ex: '2026-09-22 15:00')
  if (trimmed.includes(' ')) {
    const parts = trimmed.split(' ');
    datePart = formatDateBR(parts[0]);
    if (!timePart && parts[1]) {
      timePart = parts[1].slice(0, 5);
    }
  } 
  // Se contiver ISO 'T' (ex: '2026-09-22T15:00:00')
  else if (trimmed.includes('T')) {
    const parts = trimmed.split('T');
    datePart = formatDateBR(parts[0]);
    if (!timePart && parts[1]) {
      timePart = parts[1].slice(0, 5);
    }
  } else {
    datePart = formatDateBR(trimmed);
  }

  if (timePart) {
    // Retorna explicitamente no formato Horário - Data (ex: 15:00 - 22/09/2026)
    return `${timePart} - ${datePart}`;
  }

  return datePart;
};

/**
 * Formata valor monetário em BRL
 */
export const formatBRL = (val: number): string => {
  return val.toLocaleString('pt-BR', { 
    style: 'currency', 
    currency: 'BRL', 
    maximumFractionDigits: 0 
  });
};
