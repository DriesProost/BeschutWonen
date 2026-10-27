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
  data.records['2026-07-27'].D001.soup = 1;
  data.records['2026-07-27'].D001.other = 1;
  assert.equal(core.summarize(data, '2026-07', 'D001').missing, 2);
  data.rates[0].soup = 0;
  data.rates[0].other = 125;
  const result = core.summarize(data, '2026-07', 'D001');
  assert.equal(result.missing, 0);
  assert.equal(result.total, 1325);
});
test('tarief geldt vanaf de prestatiedatum, met correcte maandgrens', () => {
  const data = core.seed();
  data.rates.push({date:'2026-07-28',session:550,meal:625,soup:150,snack:null,other:200});
  data.records['2026-07-28'] = {D001:{...core.blank(),am:'present',pm:'absent',meal:1}};
  data.records['2026-08-01'] = {D001:{...core.blank(),am:'present',pm:'absent'}};
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
  data.records['2026-07-27'].D005.meal = 1;
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

test('aantallen, eenheidsprijzen en vrij bedrag tellen exact één keer mee', () => {
  const data = core.seed();
  const r = data.records['2026-07-27'].D001;
  Object.assign(r, {meal:2,soup:2,snack:3,extraCents:1575,extraNote:'Winkeltje en uitstap'});
  Object.assign(data.rates[0], {soup:125,snack:150});
  const result = core.summarize(data, '2026-07', 'D001');
  // 2 dagdelen + 2 maaltijden + 2 soep + 3 Zoete Inval + vrij bedrag.
  assert.equal(result.total, 3875);
  assert.equal(result.missing, 0);
  assert.equal(result.missingNotes, 0);
  const meal = result.groups[0].lines.find(l => l.kind === 'meal');
  assert.equal(meal.quantity, 2);
  assert.equal(meal.unitCents, 400);
  assert.equal(meal.cents, 800);
  const extra = result.groups[0].lines.find(l => l.kind === 'extra');
  assert.equal(extra.description, 'Winkeltje en uitstap');
  assert.equal(extra.cents, 1575);
});
test('een ontbrekende omschrijving blokkeert afronding; nul aantallen vragen geen tarief', () => {
  const data = core.seed();
  data.records['2026-07-27'].D001.extraCents = 200;
  assert.equal(core.summarize(data, '2026-07', 'D001').missingNotes, 1);
  assert.equal(core.summarize(data, '2026-07', 'D001').missing, 0);
  data.records['2026-07-27'].D001.snack = 2;
  assert.equal(core.summarize(data, '2026-07', 'D001').missing, 1);
});
test('volledig verlof wist aantallen, vrij bedrag en omschrijving', () => {
  const r = {...core.blank(),am:'leave',pm:'leave',meal:2,soup:3,snack:4,other:1,extraCents:1300,extraNote:'Uitstap'};
  core.clearCosts(r);
  assert.equal(core.kinds.every(k => r[k] === 0), true);
  assert.equal(r.extraCents, 0);
  assert.equal(r.extraNote, '');
  assert.equal(core.linesFor(r, '2026-07-27', core.seed().rates).length, 0);
});
test('validatie weigert negatieve, gebroken en te grote aantallen en bedragen', () => {
  for (const value of [-1, 1.5, 100, true, '2']) {
    const data = core.seed();
    data.records['2026-07-27'].D001.meal = value;
    assert.equal(core.valid(data), false);
  }
  const data = core.seed();
  data.records['2026-07-27'].D001.extraCents = 12.5;
  assert.equal(core.valid(data), false);
});
test('PVT telt een volle dag als één datum en twee dagdelen, met maand- en jaargrenzen', () => {
  const data = core.seed();
  data.records['2026-07-28'] = {D003:{...core.blank(),am:'present',pm:'leave'}};
  data.records['2026-08-01'] = {D003:{...core.blank(),am:'absent',pm:'present'}};
  data.records['2025-12-31'] = {D003:{...core.blank(),am:'present',pm:'present'}};
  const july = core.attendance(data, '2026-07-01', '2026-07-31', true);
  assert.equal(july.length, 2);
  assert.equal(july[0].days, 2);
  assert.equal(july[0].sessions, 3);
  assert.equal(july[0].equivalent, 1.5);
  assert.equal(core.attendance(data, '2026-01-01', '2026-12-31', true)[0].days, 3);
});
test('jaarverslag telt inschrijvingen en uitschrijvingen op hun eigen datum', () => {
  const data = core.seed();
  const result = core.annual(data, '2026');
  assert.equal(result.newEntries, 3);
  assert.equal(result.exits, 1);
  assert.equal(result.activeEnd, 4);
  assert.equal(result.days, 4);
  assert.equal(result.sessions, 6);
  assert.equal(core.annual(data, '2025').newEntries, 1);
  data.clients[0].started = null;
  assert.equal(core.annual(data, '2026').unknownStarts, 1);
  assert.equal(core.annual(data, '2026').activeEnd, 3);
});
test('uitschrijfdag is exclusief voor de verwachte lijst; aanwezige historie blijft zichtbaar', () => {
  const data = core.seed();
  data.clients[0].ended = '2026-07-28';
  assert.equal(core.roster(data, '2026-07-28', 'am').some(c => c.id === 'D001'), false);
  assert.equal(core.roster(data, '2026-07-27', 'am').some(c => c.id === 'D001'), true);
  data.clients[0].ended = '2026-07-27';
  assert.equal(core.roster(data, '2026-07-27', 'am').some(c => c.id === 'D001'), true);
  data.clients[0].ended = '2024-01-01';
  assert.equal(core.valid(data), false);
});
test('bestaande v1-opslag behoudt tarieven, planning en registraties bij migratie', () => {
  const data = core.seed();
  const old = {
    version:1,
    clients:data.clients.map(({id,name,recipient,plan}) => ({id,name,recipient,plan})),
    rates:data.rates.map(({snack,...r}) => r),
    records:Object.fromEntries(Object.entries(data.records).map(([date,rs]) => [date,
      Object.fromEntries(Object.entries(rs).map(([id,r]) => [id,{am:r.am,pm:r.pm,meal:Boolean(r.meal),soup:false,other:false}]))]))
  };
  old.records['2026-07-27'].D002.expected = {am:true,pm:true};
  const before = JSON.stringify(old);
  const upgraded = core.upgrade(old);
  assert.equal(core.valid(upgraded), true);
  assert.equal(upgraded.version, 2);
  assert.equal(upgraded.records['2026-07-27'].D001.meal, 1);
  assert.equal(upgraded.records['2026-07-27'].D002.expected.pm, true);
  assert.equal(upgraded.clients.every(c => c.started === null), true);
  assert.equal(core.summarize(upgraded, '2026-07', 'pvt').total, 1600);
  assert.equal(JSON.stringify(old), before);
  old.records['2026-07-27'].D001.meal = 'yes';
  assert.throws(() => core.upgrade(old));
});
test('CSV bewaart speciale tekens en neutraliseert formule-invoer voor Excel', () => {
  const result = core.csv([['Naam','Tekst'],['A; B','Een "test"\nregel'],['=1+1',' @SUM(A1)']]);
  assert.equal(result.startsWith('\uFEFF'), true);
  assert.equal(result.includes('"A; B";"Een ""test""\nregel"'), true);
  assert.equal(result.includes('"\'=1+1";"\' @SUM(A1)"'), true);
});
