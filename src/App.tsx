/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Scale,
  BookOpen,
  Sparkles,
  Calculator,
  AlertTriangle,
  CheckCircle2,
  Heart,
  Search,
  Info,
  ExternalLink,
  Share2,
  Bookmark,
  ChevronRight,
  ArrowLeft,
  HelpCircle,
  X,
  FileText,
  Check,
  Zap,
  Target
} from 'lucide-react';

interface GuideItem {
  id: string;
  title: string;
  category: 'suplemento' | 'alerta' | 'vitamina';
  subtitle: string;
  whatIs: string;
  evidence: string;
  howToEvaluate: string[];
  quantityInfo?: string;
  summaryPositive: string;
  summaryNegative: string;
}

const guidesData: GuideItem[] = [
  {
    id: 'creatina',
    title: 'Creatina monohidratada',
    category: 'suplemento',
    subtitle: 'O suplemento mais estudado para força e treino intenso',
    whatIs: 'Um suplemento usado principalmente em contextos de exercício de força e atividades intensas.',
    evidence: 'A creatina monohidratada está entre as formas de creatina mais estudadas. A evidência aponta possível benefício para desempenho em exercícios de alta intensidade quando associada ao treinamento — não para queimar gordura, afinar a cintura ou produzir uma transformação estética garantida.',
    howToEvaluate: [
      'Veja se o ingrediente está identificado como creatina monohidratada.',
      'Prefira fórmula simples, sem misturas "proprietárias" difíceis de avaliar.',
      'Compare o custo por dose indicada no rótulo, não apenas o preço do pote.',
      'Confira a regularização e as orientações de consumo do produto.'
    ],
    quantityInfo: 'A Anvisa atualizou o limite diário autorizado para creatina em suplementos para até 5 g por dia. Isso não significa que toda pessoa precise suplementar nem que essa quantidade seja adequada para todos. Respeite o rótulo e procure orientação individualizada, especialmente se tiver condição de saúde, usar medicamentos, for menor de 18 anos, estiver grávida ou amamentando.',
    summaryPositive: 'Pode fazer sentido: para alguns adultos que treinam força e buscam apoio ao desempenho do treino.',
    summaryNegative: 'Não faz: reduzir gordura localizada ou "desinchar" a barriga por si só.'
  },
  {
    id: 'proteina',
    title: 'Proteína em pó (Whey e Vegetal)',
    category: 'suplemento',
    subtitle: 'Praticidade para complementar a ingestão diária de proteínas',
    whatIs: 'Uma forma prática de consumir proteína. Exemplos incluem whey protein e proteínas vegetais.',
    evidence: 'A suplementação pode ajudar quando a alimentação não fornece proteína suficiente ou quando a praticidade é importante. Com treino de resistência, a proteína pode contribuir para ganhos de força e massa muscular; o efeito tende a ser menor quando a ingestão alimentar já é adequada. O suplemento não substitui o treino nem é obrigatório para progredir.',
    howToEvaluate: [
      'Compare gramas de proteína por porção, não apenas o peso total do pote.',
      'Confira ingredientes, alergênicos, açúcares e tamanho da porção.',
      'Escolha a fonte de proteína de acordo com suas restrições e preferências.',
      'Compare o custo por quantidade de proteína, usando os dados do rótulo.'
    ],
    summaryPositive: 'Pode fazer sentido: quando for uma opção prática ou ajudar a complementar a alimentação.',
    summaryNegative: 'Pode ser dispensável: quando a pessoa já obtém proteína suficiente com alimentos.'
  },
  {
    id: 'vitaminas',
    title: 'Vitaminas e minerais',
    category: 'vitamina',
    subtitle: 'Nutrientes essenciais, mas não são atalhos estéticos',
    whatIs: 'Nutrientes que podem ser necessários em situações específicas, mas que não funcionam como "atalho" para mudar o formato do corpo.',
    evidence: 'Não escolha vitaminas ou minerais com a expectativa de emagrecer, ganhar curvas ou resolver sintomas sem avaliação. A necessidade depende da alimentação, do histórico de saúde e, em alguns casos, de avaliação profissional.',
    howToEvaluate: [
      'Não combine vários produtos sem conferir os ingredientes repetidos.',
      'Não use ferro, vitamina D ou outros micronutrientes em dose alta por conta própria.',
      'Converse com um profissional se houver suspeita de deficiência, sintomas persistentes, condição de saúde ou uso contínuo de medicamentos.'
    ],
    quantityInfo: 'A Anvisa recomenda buscar orientação profissional, seguir as instruções do rótulo e observar efeitos inesperados ao usar suplementos.',
    summaryPositive: 'Pode fazer sentido: em caso de deficiência diagnosticada ou orientação profissional específica.',
    summaryNegative: 'Pode ser desnecessário ou prejudicial: uso excessivo sem controle (megadoses).'
  },
  {
    id: 'bcaa',
    title: 'BCAA e Aminoácidos isolados',
    category: 'alerta',
    subtitle: 'Geralmente dispensáveis se a ingestão de proteína é adequada',
    whatIs: 'Aminoácidos de cadeia ramificada frequentemente vendidos como auxiliares na recuperação muscular.',
    evidence: 'O app os classifica como "não são compra prioritária para a maioria das pessoas", em vez de dizer que são sempre inúteis. Se a ingestão de proteína já for adequada (via alimentos ou whey), pode não haver benefício adicional relevante em comprar um produto isolado. A prioridade é avaliar a alimentação e o treino.',
    howToEvaluate: [
      'Verifique se a sua dieta já fornece proteínas de boa qualidade.',
      'Compare o custo-benefício em relação a alimentos ou proteínas completas.'
    ],
    summaryPositive: 'Pode ter utilidade marginal: em contextos muito específicos de restrição extrema.',
    summaryNegative: 'Não é prioridade: se você já consome carne, ovos, laticínios ou proteína em pó.'
  }
];

const suspiciousClaims = [
  { claim: '"Perca barriga sem mudar nada na rotina"', rebuttal: 'Anvisa alerta que nenhum suplemento tem capacidade de queimar gordura localizada ou emagrecer sem déficit calórico e hábitos adequados.' },
  { claim: '"Aumente o bumbum ou as curvas com cápsulas"', rebuttal: 'Suplementos alimentares não alteram a distribuição de gordura ou formato anatômico do corpo.' },
  { claim: '"Resultado garantido em poucos dias"', rebuttal: 'Respostas fisiológicas variam individualmente; promessas de prazos certos violam as normas sanitárias.' },
  { claim: '"Queimador de gordura natural sem riscos"', rebuttal: 'Termogênicos podem elevar frequência cardíaca e pressão arterial, exigindo extremo cuidado e orientação médica.' },
  { claim: '"Detox" ou "desinchaço" como transformação corporal', rebuttal: 'O corpo humano possui fígado e rins para eliminação de metabólitos; chás e cápsulas não provocam remodelagem corporal.' },
  { claim: 'Fórmula sem identificação clara de fabricante ou rótulo incompleto', rebuttal: 'Produto irregular representa risco direto à saúde e viola a legislação sanitária brasileira.' }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'inicio' | 'objetivo' | 'guia' | 'comparar' | 'seguranca'>('inicio');
  const [showDisclaimerModal, setShowDisclaimerModal] = useState<boolean>(false);
  const [hasSeenDisclaimer, setHasSeenDisclaimer] = useState<boolean>(false);
  const [selectedGuide, setSelectedGuide] = useState<GuideItem | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [favorites, setFavorites] = useState<string[]>([]);
  
  // Calculator state
  const [calcPrice, setCalcPrice] = useState<string>('90');
  const [calcPortions, setCalcPortions] = useState<string>('30');
  const [calcProteinGrams, setCalcProteinGrams] = useState<string>('24');
  const [calcTotalProteinGramsInJar, setCalcTotalProteinGramsInJar] = useState<string>('720');

  // Checklist state
  const [checklist, setChecklist] = useState({
    ingredients: false,
    sealed: false,
    manufacturer: false,
    noFakeClaims: false,
    regularized: false
  });

  // Objective filter state
  const [selectedObjective, setSelectedObjective] = useState<string | null>(null);

  useEffect(() => {
    // Check if first visit
    const seen = localStorage.getItem('suplementos_disclaimer_seen');
    if (!seen) {
      setShowDisclaimerModal(true);
    }
  }, []);

  const acceptDisclaimer = () => {
    localStorage.setItem('suplementos_disclaimer_seen', 'true');
    setHasSeenDisclaimer(true);
    setShowDisclaimerModal(false);
  };

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Calculations
  const priceNum = parseFloat(calcPrice) || 0;
  const portionsNum = parseFloat(calcPortions) || 1;
  const totalProteinNum = parseFloat(calcTotalProteinGramsInJar) || 1;
  
  const costPerPortion = portionsNum > 0 ? (priceNum / portionsNum).toFixed(2) : '0.00';
  const costPerGramProtein = totalProteinNum > 0 ? (priceNum / totalProteinNum).toFixed(2) : '0.00';

  const filteredGuides = guidesData.filter(g => 
    g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.whatIs.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased pb-20 md:pb-0 flex flex-col items-center">
      
      {/* Disclaimer Modal on First Open */}
      {showDisclaimerModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 mb-2">
              Aviso Importante & Compromisso Educativo
            </h2>
            <div className="text-sm text-slate-600 space-y-3 max-h-[50vh] overflow-y-auto pr-2 mb-6">
              <p>
                Este mini app oferece conteúdo educativo e informativo. Não é consulta, prescrição ou recomendação individualizada e não substitui nutricionista, médico, farmacêutico ou outro profissional habilitado.
              </p>
              <p>
                O uso de suplementos não garante emagrecimento, redução de barriga, aumento de curvas, ganho de massa muscular ou qualquer resultado específico. Os efeitos variam entre pessoas e dependem de diversos fatores, incluindo alimentação, treino, saúde e rotina.
              </p>
              <p className="font-medium text-slate-900">
                Este material não promete resultados. Leia o rótulo e consulte um profissional antes de iniciar qualquer suplementação.
              </p>
            </div>
            <button
              onClick={acceptDisclaimer}
              className="w-full py-3.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-2xl transition-colors shadow-lg shadow-slate-900/10 active:scale-[0.98]"
            >
              Compreendi e quero começar
            </button>
          </div>
        </div>
      )}

      {/* Main Container with Mobile Framing & Desktop Responsive Width */}
      <div className="w-full max-w-md md:max-w-4xl lg:max-w-5xl bg-white min-h-screen md:min-h-[90vh] md:my-6 md:rounded-3xl md:shadow-xl md:border md:border-slate-200/80 flex flex-col overflow-hidden relative">

        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-100 px-6 py-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <h1 className="text-base font-bold tracking-tight text-slate-900">
                Suplementos sem enrolação
              </h1>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              Guia educativo · Sem promessas milagrosas
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowDisclaimerModal(true)}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center"
              title="Aviso legal"
            >
              <Info className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 overflow-y-auto">
          
          {/* TELA 1 — INÍCIO */}
          {activeTab === 'inicio' && (
            <div className="p-6 space-y-8 animate-in fade-in duration-300">
              {/* Hero Banner */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl">
                <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-emerald-500/20 rounded-full blur-2xl"></div>
                <div className="relative z-10 space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-medium">
                    <Sparkles className="w-3.5 h-3.5" />
                    Guia Prático e Confiável
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                    Antes de comprar, descubra se você precisa
                  </h2>
                  <p className="text-slate-300 text-sm leading-relaxed max-w-xl">
                    Suplemento não é obrigatório para ter resultados. Em alguns casos, pode ser uma forma prática de complementar a alimentação; em outros, pode não acrescentar benefício. Aqui você encontra informações gerais para comparar opções — sem promessas de mudanças estéticas.
                  </p>
                  <div className="pt-2 flex flex-wrap gap-3">
                    <button
                      onClick={() => setActiveTab('guia')}
                      className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold rounded-2xl transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2 text-sm"
                    >
                      Começar o guia
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setActiveTab('objetivo')}
                      className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-2xl transition-all text-sm backdrop-blur-sm"
                    >
                      O que você procura?
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Navigation Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div
                  onClick={() => setActiveTab('guia')}
                  className="p-5 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-slate-100/70 transition-all cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-1">Fichas do Guia</h3>
                  <p className="text-xs text-slate-500">Creatina, proteínas, vitaminas e minerais explicados sem rodeios.</p>
                </div>

                <div
                  onClick={() => setActiveTab('comparar')}
                  className="p-5 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-slate-100/70 transition-all cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <Calculator className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-1">Comparador de Rótulos</h3>
                  <p className="text-xs text-slate-500">Calcule o custo real por porção e por grama de proteína.</p>
                </div>

                <div
                  onClick={() => setActiveTab('seguranca')}
                  className="p-5 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-slate-100/70 transition-all cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-1">Compra Segura & Alertas</h3>
                  <p className="text-xs text-slate-500">Checklist de rótulo e sinais de alerta contra promessas fáceis.</p>
                </div>
              </div>

              {/* Notice Footer inside screen */}
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/60 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-900">
                  <span className="font-semibold">Aviso educativo:</span> Conteúdo educativo. Não substitui avaliação de nutricionista, médico ou farmacêutico.
                </div>
              </div>
            </div>
          )}

          {/* TELA 2 — "O QUE VOCÊ PROCURA?" (Objetivos & Filtros) */}
          {activeTab === 'objetivo' && (
            <div className="p-6 space-y-6 animate-in fade-in duration-300">
              <div>
                <span className="text-xs text-emerald-600 font-semibold uppercase tracking-wider">Filtro Educativo</span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">O que você procura hoje?</h2>
                <p className="text-sm text-slate-500 mt-1">Selecione uma opção para ver orientações gerais:</p>
              </div>

              <div className="space-y-3">
                {[
                  { id: 'creatina', label: 'Quero entender a creatina', icon: Zap },
                  { id: 'proteina', label: 'Quero saber se proteína em pó pode ser útil', icon: Target },
                  { id: 'vitaminas', label: 'Estou pensando em comprar vitaminas ou minerais', icon: Sparkles },
                  { id: 'conferir', label: 'Quero conferir um produto que vi na farmácia', icon: FileText },
                  { id: 'evitar', label: 'Quero saber o que evitar (promessas fáceis)', icon: AlertTriangle }
                ].map((item) => {
                  const IconComp = item.icon;
                  const isSelected = selectedObjective === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setSelectedObjective(item.id);
                        if (item.id === 'creatina' || item.id === 'proteina' || item.id === 'vitaminas') {
                          const guide = guidesData.find(g => g.id === item.id);
                          if (guide) setSelectedGuide(guide);
                        } else if (item.id === 'evitar' || item.id === 'conferir') {
                          setActiveTab('seguranca');
                        }
                      }}
                      className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                        isSelected 
                          ? 'border-emerald-600 bg-emerald-50/50 shadow-sm' 
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700'}`}>
                          <IconComp className="w-5 h-5" />
                        </div>
                        <span className="font-medium text-sm text-slate-900">{item.label}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </button>
                  );
                })}
              </div>

              {selectedObjective && (
                <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 text-xs text-slate-600 leading-relaxed">
                  <span className="font-semibold text-slate-900">Nota:</span> Esta seleção serve apenas para mostrar informações gerais. Ela não identifica necessidades nutricionais nem recomenda um produto individualmente.
                </div>
              )}

              {selectedGuide && (
                <div className="mt-6 p-5 rounded-2xl bg-emerald-950 text-white space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-emerald-400 font-semibold uppercase">Ficha Selecionada</span>
                    <button onClick={() => setSelectedGuide(null)} className="text-slate-400 hover:text-white">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <h3 className="text-lg font-bold">{selectedGuide.title}</h3>
                  <p className="text-xs text-slate-300">{selectedGuide.evidence}</p>
                  <button
                    onClick={() => setActiveTab('guia')}
                    className="mt-2 text-xs font-semibold text-emerald-400 hover:underline flex items-center gap-1"
                  >
                    Ver ficha completa no guia <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TELA 3 — GUIA DE OPÇÕES & FICHAS */}
          {activeTab === 'guia' && (
            <div className="p-6 space-y-6 animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Guia de Opções</h2>
                  <p className="text-sm text-slate-500">Conheça o que diz a evidência científica e regulatória.</p>
                </div>
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Buscar suplemento..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full sm:w-64 pl-9 pr-4 py-2 bg-slate-100 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Guide Cards List */}
              <div className="space-y-4">
                {filteredGuides.map((guide) => (
                  <div
                    key={guide.id}
                    onClick={() => setSelectedGuide(guide)}
                    className="p-5 rounded-2xl border border-slate-200 hover:border-emerald-500/50 bg-white hover:shadow-md transition-all cursor-pointer group flex items-start justify-between gap-4"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                          {guide.category === 'suplemento' ? 'Suplemento' : guide.category === 'vitamina' ? 'Micronutriente' : 'Alerta'}
                        </span>
                        {favorites.includes(guide.id) && (
                          <span className="text-rose-500 text-xs flex items-center gap-1">
                            <Heart className="w-3 h-3 fill-rose-500" /> Salvo
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-slate-900 text-base group-hover:text-emerald-600 transition-colors">
                        {guide.title}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-2">{guide.subtitle}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(guide.id);
                        }}
                        className={`p-2 rounded-xl border transition-colors ${favorites.includes(guide.id) ? 'bg-rose-50 border-rose-200 text-rose-500' : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-600'}`}
                        title="Favoritar"
                      >
                        <Heart className={`w-4 h-4 ${favorites.includes(guide.id) ? 'fill-rose-500' : ''}`} />
                      </button>
                      <div className="p-2 rounded-xl bg-slate-100 group-hover:bg-emerald-50 group-hover:text-emerald-700 text-slate-400 transition-colors">
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TELA 4 & COMPRA SEGURA / COMPARADOR */}
          {activeTab === 'comparar' && (
            <div className="p-6 space-y-6 animate-in fade-in duration-300">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Comparador de Rótulos</h2>
                <p className="text-sm text-slate-500">Compare o custo real por porção e por grama de proteína (dados fornecidos pelo usuário).</p>
              </div>

              {/* Calculator Card */}
              <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl space-y-5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Calculadora de Custo</span>
                  <Calculator className="w-5 h-5 text-emerald-400" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Preço pago (R$)</label>
                    <input
                      type="number"
                      value={calcPrice}
                      onChange={(e) => setCalcPrice(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Número de porções</label>
                    <input
                      type="number"
                      value={calcPortions}
                      onChange={(e) => setCalcPortions(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Total gramas de proteína no pote</label>
                    <input
                      type="number"
                      value={calcTotalProteinGramsInJar}
                      onChange={(e) => setCalcTotalProteinGramsInJar(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                {/* Calculation Output */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
                    <span className="text-xs text-slate-400 block mb-1">Custo por porção</span>
                    <span className="text-2xl font-bold text-emerald-400">R$ {costPerPortion}</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
                    <span className="text-xs text-slate-400 block mb-1">Custo por grama de proteína</span>
                    <span className="text-2xl font-bold text-emerald-400">R$ {costPerGramProtein} /g</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 italic">
                  Fórmula: Preço ÷ número de porções = custo por porção. Menor custo não garante melhor qualidade ou adequação às suas necessidades.
                </p>
              </div>

              {/* Fictional Example Card */}
              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200/60 space-y-2">
                <h3 className="font-semibold text-slate-900 text-sm">Exemplo ilustrativo (fictício)</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Produto A custa R$ 90 e tem 30 porções: R$ 3 por porção. Produto B custa R$ 75 e tem 15 porções: R$ 5 por porção. O preço da embalagem, sozinho, não mostra qual oferece melhor custo por uso.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'seguranca' && (
            <div className="p-6 space-y-8 animate-in fade-in duration-300">
              {/* Compra Segura Checklist */}
              <div className="space-y-4">
                <div>
                  <span className="text-xs text-amber-600 font-semibold uppercase tracking-wider">Segurança</span>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">Checklist antes de pagar</h2>
                  <p className="text-sm text-slate-500">Confirme os pontos abaixo antes de finalizar a compra:</p>
                </div>

                <div className="space-y-3">
                  {[
                    { key: 'ingredients', label: 'O rótulo informa claramente os ingredientes e a quantidade por porção?' },
                    { key: 'sealed', label: 'A embalagem está lacrada, íntegra e dentro do prazo de validade?' },
                    { key: 'manufacturer', label: 'O fabricante e o canal de venda estão identificados?' },
                    { key: 'noFakeClaims', label: 'A propaganda NÃO promete emagrecimento, cura ou transformação corporal?' },
                    { key: 'regularized', label: 'O produto está regularizado ("Alimento registrado/notificado na Anvisa")?' }
                  ].map((item) => {
                    const isChecked = checklist[item.key as keyof typeof checklist];
                    return (
                      <div
                        key={item.key}
                        onClick={() => setChecklist(prev => ({ ...prev, [item.key]: !isChecked }))}
                        className={`p-4 rounded-2xl border flex items-center gap-3 cursor-pointer transition-all ${
                          isChecked ? 'bg-emerald-50/60 border-emerald-500 text-emerald-950' : 'bg-white border-slate-200 text-slate-700'
                        }`}
                      >
                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border ${isChecked ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-slate-50'}`}>
                          {isChecked && <Check className="w-4 h-4" />}
                        </div>
                        <span className="text-sm font-medium">{item.label}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-xs text-blue-900 space-y-2">
                  <p className="font-semibold">Orientação da Anvisa:</p>
                  <p>
                    Dependendo do produto, o rótulo pode informar “Alimento registrado na Anvisa” ou “Alimento notificado na Anvisa”, com o número correspondente. Esse número pode ser consultado no portal oficial da Agência.
                  </p>
                </div>
              </div>

              {/* What not to prioritize / Suspicious claims */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div>
                  <span className="text-xs text-rose-600 font-semibold uppercase tracking-wider">Desconfie</span>
                  <h2 className="text-xl font-bold text-slate-900 mt-1">Sinais de alerta: Promessas fáceis</h2>
                  <p className="text-sm text-slate-500">Nenhum suplemento substitui alimentação e treino.</p>
                </div>

                <div className="space-y-3">
                  {suspiciousClaims.map((item, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-rose-50/50 border border-rose-100 space-y-1">
                      <div className="flex items-start gap-2 text-rose-900 font-semibold text-sm">
                        <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                        <span>{item.claim}</span>
                      </div>
                      <p className="text-xs text-slate-600 pl-6">{item.rebuttal}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </main>

        {/* Selected Guide Modal Sheet */}
        {selectedGuide && (
          <div className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-lg w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl animate-in slide-in-from-bottom duration-200">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <span className="text-xs uppercase font-semibold text-emerald-600 tracking-wider">Ficha Educativa</span>
                <button
                  onClick={() => setSelectedGuide(null)}
                  className="p-2 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-900"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">{selectedGuide.title}</h2>
                  <p className="text-xs text-slate-500 mt-1">{selectedGuide.subtitle}</p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-semibold uppercase text-slate-400 tracking-wider">O que é</h4>
                  <p className="text-sm text-slate-700 bg-slate-50 p-3.5 rounded-xl border border-slate-100 leading-relaxed">
                    {selectedGuide.whatIs}
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-semibold uppercase text-slate-400 tracking-wider">O que a evidência indica</h4>
                  <p className="text-sm text-slate-700 bg-slate-50 p-3.5 rounded-xl border border-slate-100 leading-relaxed">
                    {selectedGuide.evidence}
                  </p>
                </div>

                {selectedGuide.howToEvaluate && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Como avaliar uma opção</h4>
                    <ul className="space-y-2 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                      {selectedGuide.howToEvaluate.map((evalItem, i) => (
                        <li key={i} className="text-xs text-slate-700 flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{evalItem}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedGuide.quantityInfo && (
                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed">
                    <span className="font-semibold block mb-1">Informação sobre quantidade e limites:</span>
                    {selectedGuide.quantityInfo}
                  </div>
                )}

                <div className="grid grid-cols-1 gap-2 pt-2">
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-medium">
                    ✓ {selectedGuide.summaryPositive}
                  </div>
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900 font-medium">
                    ✗ {selectedGuide.summaryNegative}
                  </div>
                </div>
              </div>

              {/* Share button with educational disclaimer */}
              <div className="pt-2 flex gap-3">
                <button
                  onClick={() => {
                    const text = `Guia Educativo: ${selectedGuide.title}\n${selectedGuide.evidence}\n\n(Conteúdo educativo — não é prescrição)`;
                    navigator.clipboard.writeText(text);
                    alert('Resumo copiado com aviso educativo!');
                  }}
                  className="flex-1 py-3 px-4 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 text-xs"
                >
                  <Share2 className="w-4 h-4" /> Compartilhar ficha (com aviso)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Navigation Bar (Mobile Thumb Zone & Desktop Footer) */}
        <nav className="sticky bottom-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 grid grid-cols-5 items-center h-16 px-2 shadow-lg">
          {[
            { id: 'inicio', label: 'Início', icon: Sparkles },
            { id: 'objetivo', label: 'Objetivo', icon: Target },
            { id: 'guia', label: 'Guia', icon: BookOpen },
            { id: 'comparar', label: 'Comparar', icon: Calculator },
            { id: 'seguranca', label: 'Segurança', icon: ShieldCheck }
          ].map((tab) => {
            const IconComp = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex flex-col items-center justify-center py-1 transition-colors ${
                  isActive ? 'text-emerald-600 font-semibold' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <IconComp className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
                <span className="text-[10px] mt-1 tracking-tight">{tab.label}</span>
              </button>
            );
          })}
        </nav>

      </div>
    </div>
  );
}
