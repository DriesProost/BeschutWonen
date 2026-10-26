const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const vm = require('node:vm');
const html = readFileSync('demo/twijgje.html', 'utf8');
const context = vm.createContext({});
vm.runInContext(html.match(/<script id="billing-core">([\s\S]*?)<\/script>/)[1] + '\nglobalThis.core = Twijgje;', context);
const core = context.core;

test('twee dagdelen en een maaltijd kosten samen 12 euro', () => {
  const result = core.summarize(core.seed(), '2026-07', 'D001');
  assert.equal(result.total, 1200);
  assert.equal(result.count, 3);
});
test('PVT verzamelt uitsluitend PVT-cliënten met detail per cliënt', () => {
  const result = core.summarize(core.seed(), '2026-07', 'pvt');
  assert.equal(result.groups.length, 2);
  assert.equal(result.groups[0].total, 1200);
  assert.equal(result.groups[1].total, 400);
  assert.equal(result.total, 1600);
  assert.equal(core.summarize(core.seed(), '2026-07', 'D003').count, 0);
});
test('verlof en afwezigheid leveren geen aanwezigheidskosten op', () => {
  const data = core.seed();
  assert.equal(core.summarize(data, '2026-07', 'D005').total, 0);
  assert.equal(core.summarize(data, '2026-07', 'D002').total, 400);
  assert.equal(core.linesFor({am:'leave',pm:'leave',meal:true,soup:true,other:true}, '2026-07-27', data.rates).length, 0);
});
test('ontbrekende consumptietarieven blijven onbekend; expliciet gratis is toegestaan', () => {
  const data = core.seed();
  data.records['2026-07-27'].D001.soup = true;
  data.records['2026-07-27'].D001.other = true;
  assert.equal(core.summarize(data, '2026-07', 'D001').missing, 2);
  data.rates[0].soup = 0;
  data.rates[0].other = 125;
  const result = core.summarize(data, '2026-07', 'D001');
  assert.equal(result.missing, 0);
  assert.equal(result.total, 1325);
});
test('tarief geldt vanaf de prestatiedatum, met correcte maandgrens', () => {
  const data = core.seed();
  data.rates.push({date:'2026-07-28',session:550,meal:625,soup:150,other:200});
  data.records['2026-07-28'] = {D001:{am:'present',pm:'absent',meal:true,soup:false,other:false}};
  data.records['2026-08-01'] = {D001:{am:'present',pm:'absent',meal:false,soup:false,other:false}};
  assert.equal(core.summarize(data, '2026-07', 'D001').total, 2375);
  assert.equal(core.summarize(data, '2026-08', 'D001').total, 550);
  assert.equal(core.rateAt(data.rates, '2025-12-31').session, undefined);
});
test('onbekende dagdelen worden niet als aanwezigheid geteld of stilzwijgend afgerond', () => {
  const data = core.seed();
  data.records['2026-07-28'] = {D001:core.blank()};
  const result = core.summarize(data, '2026-07', 'D001');
  assert.equal(result.unknown, 2);
  assert.equal(result.total, 1200);
});
test('concept opnieuw berekenen dupliceert geen prestaties', () => {
  const data = core.seed();
  const before = JSON.stringify(data);
  const a = core.summarize(data, '2026-07', 'pvt');
  const b = core.summarize(data, '2026-07', 'pvt');
  assert.equal(a.count, b.count);
  assert.equal(JSON.stringify(data), before);
});
test('lokale opslag weigert ongeldige bedragen, datums en tegenstrijdig verlof', () => {
  const data = core.seed();
  assert.equal(core.valid(data), true);
  data.rates[0].soup = -1;
  assert.equal(core.valid(data), false);
  data.rates[0].soup = null;
  data.records['2026-07-27'].D005.meal = true;
  assert.equal(core.valid(data), false);
  assert.equal(core.validDate('2026-02-30'), false);
  assert.equal(core.validDate('2028-02-29'), true);
});

test('de daglijst toont alleen de planning van het geselecteerde dagdeel', () => {
  const data = core.seed();
  const am = Array.from(core.roster(data, '2026-07-27', 'am'), c => c.id);
  const pm = Array.from(core.roster(data, '2026-07-27', 'pm'), c => c.id);
  assert.deepEqual(am, ['D001','D002','D003','D005']);
  assert.deepEqual(pm, ['D001','D003','D004','D005']);
});
test('niet-geplande onbekende dagdelen blokkeren de afrekening niet', () => {
  const data = core.seed();
  data.records['2026-07-27'].D002.pm = 'unknown';
  const result = core.summarize(data, '2026-07', 'D002');
  assert.equal(result.unknown, 0);
  assert.equal(result.total, 400);
});
test('toevoegen van een extra bezoeker vereist bevestiging en blijft datumgebonden', () => {
  const data = core.seed();
  const record = data.records['2026-07-27'].D002;
  record.expected = {am:true, pm:true};
  record.pm = 'unknown';
  assert.equal(core.valid(data), true);
  assert.equal(core.roster(data, '2026-07-27', 'pm').some(c => c.id === 'D002'), true);
  assert.equal(core.roster(data, '2026-07-28', 'pm').some(c => c.id === 'D002'), false);
  assert.equal(core.summarize(data, '2026-07', 'D002').unknown, 1);
  assert.equal(core.summarize(data, '2026-07', 'D002').total, 400);
  record.pm = 'present';
  assert.equal(core.summarize(data, '2026-07', 'D002').total, 800);
});
test('bestaande ongeplande aanwezigheden blijven zichtbaar en worden aangerekend', () => {
  const data = core.seed();
  data.records['2026-07-27'].D004.am = 'present';
  assert.equal(core.roster(data, '2026-07-27', 'am').some(c => c.id === 'D004'), true);
  assert.equal(core.summarize(data, '2026-07', 'pvt').total, 2000);
});
test('een ontbrekende registratie van een verwachte cliënt blijft zichtbaar bij maandcontrole', () => {
  const data = core.seed();
  delete data.records['2026-07-27'].D002;
  assert.equal(core.summarize(data, '2026-07', 'D002').unknown, 1);
});
