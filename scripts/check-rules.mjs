import assert from 'node:assert/strict';
import {generateMaterials} from '../rules.js';
const result = generateMaterials({
  modules: 9, watts: 620, inverter: 5, floors: 2, ac: 25, dc: 25, ground: 3,
  connection: 'Bifásico 220 V', roof: 'Fibrocimento sobre madeira',
  sun: 'Não', point: 'Padrão de entrada', conduit: 'Aparente'
});
const qty = starts => result.items.find(i => i.description.startsWith(starts))?.quantity;
assert.equal(result.stats.kwp, 5.58);
assert.equal(qty('Cabo flexível 10 mm², fase (preto)'), '30');
assert.equal(qty('Cabo flexível 10 mm², PE'), '30');
assert.equal(qty('Eletroduto PVC rígido 1"'), '10');
assert.equal(qty('Curva 90° 1"'), '8');
assert.equal(qty('Abraçadeira tipo D 1"'), '35');
assert.equal(qty('Cabo solar 6 mm², vermelho'), '28');
assert.equal(qty('Eletroduto PVC rígido preto 3/4"'), '9');
assert.equal(qty('Fixador para telha de fibrocimento'), '36');
assert.equal(qty('Módulo fotovoltaico 620 W'), '9');
assert.equal(qty('Perfil de alumínio'), 'conforme layout');
assert.throws(() => generateMaterials({...result, modules: 0}), /Preencha/);
console.log('Caso de referência: 5,58 kWp, principais quantidades e aviso de layout conferidos.');
