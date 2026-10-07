// Sugestões de compra. A especificação elétrica final depende do projeto e dos manuais.
export const GROUPS = ['Parte CA', 'Proteção', 'Aterramento', 'Parte CC', 'Estrutura', 'Equipamentos'];

export function generateMaterials(m) {
  const modules = Number(m.modules);
  const watts = Number(m.watts);
  const inverter = Number(m.inverter);
  const ac = Number(m.ac);
  const dc = Number(m.dc);
  if (![modules, watts, inverter, ac, dc].every(n => Number.isFinite(n) && n > 0)) {
    throw new Error('Preencha módulos, potência, inversor, percurso CA e percurso CC com valores maiores que zero.');
  }
  const floors = Math.max(1, Number(m.floors) || 1);
  const ground = Math.max(0, Number(m.ground) || 0);
  const active = m.connection === 'Trifásico' ? 3 : m.connection === 'Mono 127 V' ? 1 : 2;
  const acSection = inverter >= 5 || ac >= 25 ? 10 : 6;
  const conduit = acSection === 10 ? '1"' : '3/4"';
  const acLength = Math.ceil(ac * 1.1 + floors);
  const dcLength = Math.ceil(dc * 1.1);
  const acBars = Math.ceil(acLength / 3);
  const dcBars = Math.ceil(dcLength / 3);
  const roof = String(m.roof || 'A conferir');
  const sun = m.sun === 'Sim';
  const items = [];
  const add = (group, quantity, unit, description, note = '') => items.push({id: crypto.randomUUID(), group, quantity: String(quantity), unit, description, note, source: 'Regra', checked: true});

  const conductorNames = active === 1 ? ['fase (preto)', 'neutro (azul)'] : active === 2 ? ['fase (preto)', 'fase (vermelho)'] : ['fase L1', 'fase L2', 'fase L3'];
  conductorNames.forEach(name => add('Parte CA', acLength, 'm', `Cabo flexível ${acSection} mm², ${name}`, 'Comprimento de percurso com subida, descida e reserva.'));
  add('Parte CA', acLength, 'm', `Cabo flexível ${acSection} mm², PE (verde)`);
  add('Parte CA', acBars, 'barras', `Eletroduto PVC rígido ${conduit}, ${sun ? 'preto resistente a UV' : 'branco'}, barra de 3 m`, m.conduit === 'Aparente' ? 'Instalação aparente.' : 'Confirmar trajeto e ocupação.');
  add('Parte CA', Math.max(4, Math.ceil(ac / 4) + 1), 'un', `Curva 90° ${conduit}`, 'Contar mudanças de direção no desenho.');
  add('Parte CA', acBars, 'un', `Luva ${conduit}`);
  add('Parte CA', ac > 15 ? 3 : 2, 'un', `Caixa de passagem de sobrepor ${conduit}`);
  add('Parte CA', 4, 'pares', `Bucha e arruela ${conduit}`);
  add('Parte CA', acLength + 5, 'un', `Abraçadeira tipo D ${conduit}, com parafuso e bucha`);
  add('Parte CA', 1, 'un', 'Prensa-cabo ou adaptador para a caixa do ponto de conexão', 'Confirmar furo disponível.');
  add('Parte CA', (active + 1) * 2 + 2, 'un', `Terminal tubular pré-isolado ${acSection} mm²`);
  add('Parte CA', 1, 'm', 'Espiral protetor de cabo');

  const poles = active === 3 ? 'tripolar' : active === 2 ? 'bipolar' : 'monopolar';
  add('Proteção', 1, 'un', `Disjuntor ${poles} curva C, dedicado`, `No ${m.point || 'ponto de conexão'}; corrente conforme manual do inversor e capacidade do cabo.`);
  add('Proteção', 1, 'un', 'Etiqueta de identificação do disjuntor');
  add('Proteção', 1, 'un', 'Quadro DIN de sobrepor com porta, 6 módulos', 'Confirmar grau de proteção conforme local.');
  add('Proteção', active, 'un', 'DPS classe II, 275 V, 20 kA / 40 kA', 'Uc e coordenação devem ser conferidos no projeto.');
  add('Proteção', 1, 'un', 'Barra de terra para o quadro');
  add('Proteção', 2, 'm', 'Cabo 6 mm² verde para DPS e barra', 'Ligação curta e reta.');

  add('Aterramento', ground || 'medir', 'm', 'Cabo 6 mm² verde, aterramento do inversor');
  add('Aterramento', 4, 'un', 'Terminal olhal e parafuso M6');
  add('Aterramento', 'medir', 'm', 'Cabo 6 mm² verde, aterramento da estrutura');
  add('Aterramento', 'conforme layout', 'un', 'Terminal de aterramento da estrutura com arruela dentada');

  add('Parte CC', dcLength, 'm', 'Cabo solar 6 mm², vermelho');
  add('Parte CC', dcLength, 'm', 'Cabo solar 6 mm², preto');
  add('Parte CC', 3, 'pares', 'Conector MC4 fêmea e macho', 'String e conectores compatíveis com o inversor.');
  add('Parte CC', Math.ceil(dc / 3), 'barras', 'Eletroduto PVC rígido preto 3/4", barra de 3 m', 'Ajustar ao trecho efetivamente protegido por eletroduto.');
  add('Parte CC', Math.max(4, Math.ceil(dc / 4)), 'un', 'Curva 90° 3/4"');
  add('Parte CC', dcBars, 'un', 'Luva 3/4"');
  add('Parte CC', Math.ceil(dcLength), 'un', 'Abraçadeira 3/4"');
  add('Parte CC', Math.ceil(modules * 5.5), 'un', 'Abraçadeira de nylon com proteção UV');
  add('Parte CC', 1, 'm', 'Espiral protetor de cabo');

  const roofFix = /fibrocimento/i.test(roof) ? 'Fixador para telha de fibrocimento, conforme caibro' : `Fixador de estrutura para ${roof}`;
  add('Estrutura', modules * 4, 'un', roofFix, 'Conferir estrutura e layout da vistoria.');
  add('Estrutura', 'conforme layout', 'barras', 'Perfil de alumínio', 'O ERP dimensiona trilhos a partir do desenho dos blocos; só as medidas desta tela não dão o número de fileiras.');
  add('Estrutura', 'conforme layout', 'un', 'Emenda de perfil');
  add('Estrutura', 'conforme layout', 'un', 'Grampo final');
  add('Estrutura', 'conforme layout', 'un', 'Grampo intermediário');
  add('Estrutura', modules * 4, 'un', 'Vedação dos pontos de fixação');

  add('Equipamentos', modules, 'un', `Módulo fotovoltaico ${watts} W`);
  add('Equipamentos', 1, 'un', `Inversor on-grid ${String(inverter).replace('.', ',')} kW`, 'Conferir tensão, Isc e Voc da string nos manuais.');
  add('Equipamentos', 1, 'un', 'Módulo Wi-Fi do fabricante');
  add('Equipamentos', 2, 'jogos', 'Parafuso e bucha para fixar inversor e quadro');

  return {items, stats: {kwp: modules * watts / 1000, acLength, dcLength}, warning: `Confira no manual do inversor a corrente de entrada, o Isc do módulo, a Voc de ${modules} módulos em série, a corrente do disjuntor e a seção dos cabos antes de comprar.`};
}
