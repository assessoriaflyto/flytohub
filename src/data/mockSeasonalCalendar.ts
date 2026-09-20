// ============================================================================
// FLYTOHUB — CALENDÁRIO SAZONAL DE MARKETING & DATAS ESTRATÉGICAS ANUAIS
// ============================================================================
import { SeasonalEvent } from '../types/hub';

export const SEASONAL_CALENDAR_EVENTS: SeasonalEvent[] = [
  // JANEIRO
  {
    id: 'sea_1',
    month: 1,
    day: 1,
    title: 'Ano Novo & Resoluções de Início de Ano',
    category: 'COMERCIAL',
    description: 'Pico de buscas por saúde, estética, cursos, produtividade e novas metas corporativas.',
    suggestedAction: 'Campanhas de "Novo Ano, Novos Resultados" e ofertas de matrícula/início de ciclo.'
  },
  {
    id: 'sea_2',
    month: 1,
    day: 30,
    title: 'Dia da Saudade & Liquidações de Verão',
    category: 'OPORTUNIDADE',
    description: 'Campanhas de remarketing emocional para base antiga de clientes.',
    suggestedAction: 'Disparos de cupom de reativação de clientes inativos.'
  },

  // FEVEREIRO
  {
    id: 'sea_3',
    month: 2,
    day: 14,
    title: 'Valentine\'s Day (Internacional)',
    category: 'COMERCIAL',
    description: 'Relevante para marcas de e-commerce, joias e produtos importados.',
    suggestedAction: 'Criativos com kits de presentes e envio expresso.'
  },
  {
    id: 'sea_4',
    month: 2,
    day: 20,
    title: 'Carnaval Brasileiro',
    category: 'DATA_COMEMORATIVA',
    description: 'Foco em estética de curto prazo, moda praia, drinks e entretenimento.',
    suggestedAction: 'Antecipar promoções 15 dias antes da folia.'
  },

  // MARÇO
  {
    id: 'sea_5',
    month: 3,
    day: 8,
    title: 'Dia Internacional da Mulher',
    category: 'DATA_COMEMORATIVA',
    description: 'Uma das maiores datas do ano para clínicas médicas, estética, cosméticos e moda.',
    suggestedAction: 'Campanhas de autocuidado, homenagens corporativas e combos especiais femininos.'
  },
  {
    id: 'sea_6',
    month: 3,
    day: 15,
    title: 'Dia do Consumidor',
    category: 'COMERCIAL',
    description: 'A "Black Friday do primeiro semestre". Altíssima taxa de conversão em e-commerce.',
    suggestedAction: 'Semana do Consumidor com condições agressivas e frete grátis.'
  },

  // ABRIL
  {
    id: 'sea_7',
    month: 4,
    day: 7,
    title: 'Dia Mundial da Saúde',
    category: 'NICHO_ESPECIFICO',
    description: 'Ideal para posicionamento de médicos, clínicas, dentistas e planos corporativos.',
    suggestedAction: 'Conteúdos informativos de prevenção com CTA para check-up preventivo.'
  },
  {
    id: 'sea_8',
    month: 4,
    day: 21,
    title: 'Aniversário de Brasília & Feriado de Tiradentes',
    category: 'OPORTUNIDADE',
    description: 'Forte apelo local para empresas do Distrito Federal.',
    suggestedAction: 'Campanhas homenageando a capital com condições exclusivas para residentes do DF.'
  },

  // MAIO
  {
    id: 'sea_9',
    month: 5,
    day: 10,
    title: 'Dia das Mães',
    category: 'COMERCIAL',
    description: 'A 2ª data mais forte do comércio brasileiro em faturamento.',
    suggestedAction: 'Criativos emotivos antecipados desde a última semana de abril.',
    highlighted: true
  },
  {
    id: 'sea_10',
    month: 5,
    day: 25,
    title: 'Dia do Orgulho Geek & Dia da Toalha',
    category: 'NICHO_ESPECIFICO',
    description: 'Excelente para tecnologia, games, e-commerce nerd e vestuário jovem.',
    suggestedAction: 'Ações com referências da cultura pop e cupons temáticos.'
  },

  // JUNHO
  {
    id: 'sea_11',
    month: 6,
    day: 12,
    title: 'Dia dos Namorados',
    category: 'COMERCIAL',
    description: 'Explosão de vendas para presentes, joias, jantares e hotelaria.',
    suggestedAction: 'Páginas de presentes com filtros "Para Ele" e "Para Ela".',
    highlighted: true
  },
  {
    id: 'sea_12',
    month: 6,
    day: 24,
    title: 'Festas Juninas (São João)',
    category: 'DATA_COMEMORATIVA',
    description: 'Evento cultural de massa em todo o Brasil.',
    suggestedAction: 'Arraiás de ofertas e ações locais de engajamento.'
  },

  // JULHO
  {
    id: 'sea_13',
    month: 7,
    day: 13,
    title: 'Dia Mundial do Rock',
    category: 'OPORTUNIDADE',
    description: 'Engajamento para vestuário e marcas com tom rebelde e autêntico.',
    suggestedAction: 'Playlists temáticas no Spotify e descontos progressivos.'
  },
  {
    id: 'sea_14',
    month: 7,
    day: 26,
    title: 'Dia dos Avós',
    category: 'DATA_COMEMORATIVA',
    description: 'Data afetiva crescente para produtos de conforto, saúde e presentes familiares.',
    suggestedAction: 'Combos de presentes carinhosos para netos presentearem avós.'
  },

  // AGOSTO
  {
    id: 'sea_15',
    month: 8,
    day: 9,
    title: 'Dia dos Pais',
    category: 'COMERCIAL',
    description: 'Forte apelo para tecnologia, moda masculina, ferramentas e experiências.',
    suggestedAction: 'Kits de presentes e anúncios focados em filhos e esposas decisoras.',
    highlighted: true
  },
  {
    id: 'sea_16',
    month: 8,
    day: 11,
    title: 'Dia do Advogado',
    category: 'NICHO_ESPECIFICO',
    description: 'Autoridade para escritórios de advocacia corporativa e compliance.',
    suggestedAction: 'Vídeos de autoridade jurídica sobre segurança nos negócios.'
  },

  // SETEMBRO (MÊS ATUAL PADRÃO)
  {
    id: 'sea_17',
    month: 9,
    day: 15,
    title: 'Dia do Cliente',
    category: 'COMERCIAL',
    description: 'Excelente para bonificar a carteira ativa com vantagens exclusivas.',
    suggestedAction: 'Campanhas VIP de fidelização e descontos secretos para clientes recorrentes.',
    highlighted: true
  },
  {
    id: 'sea_18',
    month: 9,
    day: 22,
    title: 'Início da Primavera',
    category: 'OPORTUNIDADE',
    description: 'Renovação de estoques, coleções florais e procedimentos de preparação para o verão.',
    suggestedAction: 'Lançamento de novas coleções e protocolos de cuidados para a nova estação.',
    highlighted: true
  },
  {
    id: 'sea_19',
    month: 9,
    day: 27,
    title: 'Dia Mundial do Turismo',
    category: 'NICHO_ESPECIFICO',
    description: 'Crucial para agências de viagem, resorts e pacotes de fim de ano.',
    suggestedAction: 'Lançamento de pacotes para o Réveillon e férias de janeiro.'
  },

  // OUTUBRO
  {
    id: 'sea_20',
    month: 10,
    day: 1,
    title: 'Outubro Rosa (Mês de Conscientização)',
    category: 'DATA_COMEMORATIVA',
    description: 'Apoio à saúde feminina. Fortíssimo para clínicas, médicos e marcas femininas.',
    suggestedAction: 'Conteúdo institucional de acolhimento e exames preventivos.'
  },
  {
    id: 'sea_21',
    month: 10,
    day: 12,
    title: 'Dia das Crianças',
    category: 'COMERCIAL',
    description: 'Pico de vendas em brinquedos, vestuário infantil e cursos para jovens.',
    suggestedAction: 'Campanhas voltadas para pais e tios decisores.'
  },
  {
    id: 'sea_22',
    month: 10,
    day: 31,
    title: 'Halloween (Dia das Bruxas)',
    category: 'OPORTUNIDADE',
    description: 'Campanhas criativas de "Preços Assustadoramente Baixos".',
    suggestedAction: 'Cupons relâmpago de 24h na véspera de feriado.'
  },

  // NOVEMBRO
  {
    id: 'sea_23',
    month: 11,
    day: 1,
    title: 'Novembro Azul (Saúde do Homem)',
    category: 'DATA_COMEMORATIVA',
    description: 'Atenção à saúde preventiva masculina.',
    suggestedAction: 'Campanhas com linguagem desmistificada e direta para homens 40+.'
  },
  {
    id: 'sea_24',
    month: 11,
    day: 27,
    title: 'Black Friday Brasil',
    category: 'COMERCIAL',
    description: 'A maior data de vendas do ano no comércio e tráfego pago mundial.',
    suggestedAction: 'Captação de leads VIP 30 dias antes e abertura antecipada de checkout.',
    highlighted: true
  },
  {
    id: 'sea_25',
    month: 11,
    day: 30,
    title: 'Cyber Monday',
    category: 'COMERCIAL',
    description: 'Última chamada da Black Friday para tecnologia, SaaS e infoprodutos.',
    suggestedAction: 'Remarketing agressivo de carrinho abandonado com contagem regressiva.'
  },

  // DEZEMBRO
  {
    id: 'sea_26',
    month: 12,
    day: 15,
    title: 'Prazo Limite de Encomendas de Natal',
    category: 'COMERCIAL',
    description: 'Alerta de escassez e entrega garantida para o Natal.',
    suggestedAction: 'Anúncios com contagem regressiva: "Compre até hoje para receber antes do Natal".'
  },
  {
    id: 'sea_27',
    month: 12,
    day: 25,
    title: 'Natal',
    category: 'COMERCIAL',
    description: 'Maior data de confraternização e encerramento de ano.',
    suggestedAction: 'Mensagens institucionais de agradecimento e gift cards de última hora.'
  },
  {
    id: 'sea_28',
    month: 12,
    day: 31,
    title: 'Réveillon & Virada de Ano',
    category: 'DATA_COMEMORATIVA',
    description: 'Fim de ciclo e renovação de energias.',
    suggestedAction: 'Pré-lançamentos de janeiro e planos de transformação.'
  }
];
