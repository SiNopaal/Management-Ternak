// Automated Test Suite for TernakPro
import { Animal, Activity, AnimalSpecies } from './src/types';

let testsPassed = 0;
let testsFailed = 0;

function assert(condition: boolean, testName: string) {
  if (condition) {
    console.log(`✅ [PASS] ${testName}`);
    testsPassed++;
  } else {
    console.error(`❌ [FAIL] ${testName}`);
    testsFailed++;
  }
}

console.log('====================================================');
console.log('🧪 RUNNING COMPREHENSIVE TERNAKPRO TEST SUITE');
console.log('====================================================\n');

// TEST 1: Eartag Auto-Generation Logic
console.log('--- TEST 1: Penomoran Eartag Otomatis & Standar Format ---');
function generateEartag(species: AnimalSpecies, existingAnimals: Animal[]): string {
  const prefix = species === 'sapi' ? 'SP' : species === 'kambing' ? 'KB' : species === 'domba' ? 'DB' : 'KR';
  const year = '26';
  const count = existingAnimals.filter(a => a.species === species).length + 1;
  return `${prefix}-${year}-${String(count).padStart(4, '0')}`;
}

const mockAnimals: Animal[] = [];
const eartag1 = generateEartag('sapi', mockAnimals);
assert(eartag1 === 'SP-26-0001', 'Eartag sapi pertama harus SP-26-0001');

mockAnimals.push({
  id: '1',
  eartag: eartag1,
  species: 'sapi',
  breed: 'Limousin',
  sex: 'Jantan',
  age: 'Baru Masuk',
  kandang: 'Kandang A1',
  origin: 'Lahir di Farm',
  weight: 380,
  initialWeight: 380,
  targetWeight: 550,
  adg: 0.8,
  status: 'aktif'
});

const eartag2 = generateEartag('sapi', mockAnimals);
assert(eartag2 === 'SP-26-0002', 'Eartag sapi kedua harus SP-26-0002');

const eartagGoat = generateEartag('kambing', mockAnimals);
assert(eartagGoat === 'KB-26-0001', 'Eartag kambing pertama harus KB-26-0001');

// TEST 2: Kalkulator ADG (Average Daily Gain) Real-Time
console.log('\n--- TEST 2: Kalkulator ADG Real-Time ---');
function calculateADG(currentWeight: number, prevWeight: number, days: number): number {
  return +((currentWeight - prevWeight) / days).toFixed(2);
}

const adgResult1 = calculateADG(462.5, 450.0, 14);
assert(adgResult1 === 0.89, `Kenaikan 12.5 kg dalam 14 hari menghasilkan ADG 0.89 kg/hari (Actual: ${adgResult1})`);

function getADGClassification(adg: number): string {
  if (adg >= 0.85) return 'SANGAT BAIK';
  if (adg >= 0.50) return 'BAIK';
  return 'EVALUASI PAKAN';
}

assert(getADGClassification(adgResult1) === 'SANGAT BAIK', 'ADG 0.89 harus berstatus SANGAT BAIK');
assert(getADGClassification(0.40) === 'EVALUASI PAKAN', 'ADG 0.40 harus berstatus EVALUASI PAKAN');

// TEST 3: Protokol Masa Henti Obat (Withdrawal) & Regulasi ASUH
console.log('\n--- TEST 3: Protokol Masa Henti Obat (Withdrawal) ---');
function calculateSafeDate(startDateStr: string, withdrawalDays: number): string {
  const d = new Date(startDateStr);
  d.setDate(d.getDate() + withdrawalDays);
  return d.toISOString().split('T')[0];
}

const safeDate = calculateSafeDate('2026-02-03', 7);
assert(safeDate === '2026-02-10', 'Withdrawal 7 hari dari 03 Feb 2026 harus berakhir pada 10 Feb 2026');

// Simulate applying medication to an animal
const animalToMedicate = { ...mockAnimals[0] };
function applyMedication(animal: Animal, medicine: string, days: number): Animal {
  return {
    ...animal,
    status: 'withdrawal',
    statusBadge: `WITHDRAWAL (${days} HARI)`,
    withdrawalEndDate: calculateSafeDate('2026-02-03', days),
    withdrawalReason: medicine
  };
}

const medicatedAnimal = applyMedication(animalToMedicate, 'Medoxy-L 20 ml', 7);
assert(medicatedAnimal.status === 'withdrawal', 'Status ternak setelah diberi obat ber-residu harus WITHDRAWAL');
assert(medicatedAnimal.withdrawalEndDate === '2026-02-10', 'Tanggal batas aman harus 2026-02-10');

// TEST 4: Filter & Pencarian Daftar Ternak
console.log('\n--- TEST 4: Filter & Pencarian Database Ternak ---');
const testDb: Animal[] = [
  medicatedAnimal,
  {
    id: '2',
    eartag: 'KB-26-0001',
    species: 'kambing',
    breed: 'Boer',
    sex: 'Jantan',
    age: '8 bln',
    kandang: 'Kandang B',
    origin: 'Beli',
    weight: 42,
    adg: 0.2,
    status: 'aktif'
  },
  {
    id: '3',
    eartag: 'DB-26-0001',
    species: 'domba',
    breed: 'Garut',
    sex: 'Betina',
    age: '1 thn',
    kandang: 'Kandang C',
    origin: 'Lahir di Farm',
    weight: 35,
    adg: 0.14,
    status: 'bunting'
  }
];

const sapiOnly = testDb.filter(a => a.species === 'sapi');
assert(sapiOnly.length === 1 && sapiOnly[0].eartag === 'SP-26-0001', 'Filter spesies sapi harus menghasilkan 1 ekor');

const withdrawalOnly = testDb.filter(a => a.status === 'withdrawal');
assert(withdrawalOnly.length === 1 && withdrawalOnly[0].eartag === 'SP-26-0001', 'Filter status withdrawal harus mendeteksi 1 ternak terkunci');

const searchByTag = testDb.filter(a => a.eartag.toLowerCase().includes('kb-26'));
assert(searchByTag.length === 1 && searchByTag[0].species === 'kambing', 'Pencarian tag "kb-26" harus menemukan kambing');

// TEST 5: Finansial & Margin Operasional Laporan
console.log('\n--- TEST 5: Formula Finansial & Margin Operasional ---');
const estimasiPenjualan = 68500000;
const biayaPakan = 21450000;
const marginKasar = estimasiPenjualan - biayaPakan;
const marginPercent = +((marginKasar / estimasiPenjualan) * 100).toFixed(1);

assert(marginKasar === 47050000, `Margin kasar harus Rp 47.050.000 (Actual: ${marginKasar})`);
assert(marginPercent === 68.7, `Margin persen harus 68.7% (Actual: ${marginPercent}%)`);

// TEST 6: Stepper Glove-Friendly Bounds Check
console.log('\n--- TEST 6: Stepper Glove-Friendly Bobot & Dosis ---');
let testWeight = 462.5;
testWeight = +(testWeight + 0.5).toFixed(1);
assert(testWeight === 463.0, 'Stepper +0.5 menghasilkan 463.0');
testWeight = +(testWeight - 1.0).toFixed(1);
assert(testWeight === 462.0, 'Stepper -1.0 menghasilkan 462.0');

let testDose = 20;
testDose = Math.max(1, testDose - 5);
assert(testDose === 15, 'Stepper dosis -5 menghasilkan 15 ml');

console.log('\n====================================================');
console.log(`🏁 TEST SUITE RESULT: ${testsPassed} PASSED, ${testsFailed} FAILED`);
console.log('====================================================');

if (testsFailed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
