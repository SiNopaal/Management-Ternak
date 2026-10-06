import { Animal, Activity } from '../types';

// Default empty data for clean production use
export const INITIAL_ANIMALS: Animal[] = [];
export const INITIAL_ACTIVITIES: Activity[] = [];

// Demo data kept as optional backup if user ever wants to preview samples
export const DEMO_ANIMALS: Animal[] = [
  {
    id: '1',
    eartag: 'SP-26-0147',
    species: 'sapi',
    breed: 'Simental',
    sex: 'Betina',
    age: '1 thn 8 bln',
    kandang: 'Kandang A1 (Penggemukan Sapi)',
    origin: 'Lahir di Farm',
    weight: 462.5,
    initialWeight: 380.0,
    targetWeight: 550.0,
    adg: 0.89,
    status: 'withdrawal',
    statusBadge: 'WITHDRAWAL S/D 10 SEP',
    statusColor: 'red',
    subStatus: 'Dilarang potong/jual',
    birthDate: '2024-06-12',
    rfid: 'RFID-9820001234568',
    withdrawalEndDate: '10 Sep 2026',
    withdrawalReason: 'Medoxy-L (Oxytetracycline 100mg) - 20 ml',
    photoUrl: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&w=800&q=80',
    notes: 'Kondisi fisik prima, bulu mengkilap, bobot naik stabil.'
  },
  {
    id: '2',
    eartag: 'SP-26-0146',
    species: 'sapi',
    breed: 'Limousin',
    sex: 'Jantan',
    age: '2 thn 1 bln',
    kandang: 'Kandang A2 (Penggemukan Sapi)',
    origin: 'Beli (Supplier Metro)',
    weight: 540.0,
    initialWeight: 420.0,
    targetWeight: 600.0,
    adg: 1.10,
    status: 'aktif',
    statusBadge: 'AKTIF • SEHAT',
    statusColor: 'green',
    birthDate: '2024-01-15',
    rfid: 'RFID-9820001234567',
    photoUrl: 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=800&q=80',
    notes: 'Pertumbuhan ADG di atas rata-rata kelompok.'
  },
  {
    id: '3',
    eartag: 'KB-26-0034',
    species: 'kambing',
    breed: 'Boer',
    sex: 'Jantan',
    age: '8 bln',
    kandang: 'Kandang B (Penggemukan)',
    origin: 'Beli',
    weight: 42.0,
    initialWeight: 28.0,
    targetWeight: 55.0,
    adg: 0.20,
    status: 'aktif',
    statusBadge: 'AKTIF',
    statusColor: 'green',
    birthDate: '2025-06-10',
    photoUrl: 'https://images.unsplash.com/photo-1524024973431-2ad916746881?auto=format&fit=crop&w=800&q=80',
    notes: 'Nafsu makan tinggi, lincah, suhu normal.'
  },
  {
    id: '4',
    eartag: 'DB-26-0012',
    species: 'domba',
    breed: 'Garut',
    sex: 'Betina',
    age: '1 thn',
    kandang: 'Kandang C (Isolasi / Partus)',
    origin: 'Lahir di Farm',
    weight: 35.0,
    initialWeight: 22.0,
    targetWeight: 45.0,
    adg: 0.14,
    status: 'bunting',
    statusBadge: 'BUNTING (H-15)',
    statusColor: 'amber',
    subStatus: 'Perkiraan lahir: 15 hari',
    birthDate: '2025-02-18',
    notes: 'Hasil periksa USG/palpasi positif bunting 1 ekor.'
  },
  {
    id: '5',
    eartag: 'KB-23-0102',
    species: 'kambing',
    breed: 'Jawa Randu',
    sex: 'Betina',
    age: '2 thn',
    kandang: 'Kandang B',
    origin: 'Beli',
    weight: 38.0,
    initialWeight: 30.0,
    targetWeight: 48.0,
    adg: 0.16,
    status: 'withdrawal',
    statusBadge: 'WITHDRAWAL AKTIF',
    statusColor: 'red',
    subStatus: 'Antibiotik Terapi',
    birthDate: '2024-03-05',
    withdrawalEndDate: '15 Sep 2026',
    withdrawalReason: 'Penstrep injeksi pasca abses kaki',
    notes: 'Tahap pemulihan luka luar.'
  }
];

export const DEMO_ACTIVITIES: Activity[] = [
  {
    id: 'act-1',
    type: 'timbang',
    time: '10:15 WIB',
    dateGroup: 'Hari Ini',
    animalTag: 'SP-26-0147',
    animalDesc: 'Sapi Simental • Kandang A1 (Pedet Jantan)',
    title: 'Penimbangan SP-26-0147',
    details: {
      'Bobot Terkini': '462.5 kg (+12.5 kg)',
      'Laju Pertumbuhan (ADG)': '0.89 kg/hari (Sangat Baik)'
    },
    operator: 'Operator Shift 1 (Budi)',
    badgeText: 'TIMBANG',
    badgeVariant: 'green',
    actionText: 'Lihat Kartu >'
  },
  {
    id: 'act-2',
    type: 'obat',
    time: '09:30 WIB',
    dateGroup: 'Hari Ini',
    animalTag: 'SP-26-0147',
    animalDesc: 'Sapi Simental • Injeksi Medoxy-L 20 ml',
    title: 'Pemberian Obat Medoxy-L',
    details: {
      'Masa Henti Obat': 'Hingga 10 Feb 2026 (7 Hari)',
      'Biaya HPP Terapi': 'Rp 45.000'
    },
    warningNote: 'Kunci proteksi aktif: Dilarang dipotong, diperah untuk konsumsi, atau dijual komersial.',
    operator: 'drh. Hendra Wijaya',
    badgeText: 'WITHDRAWAL AKTIF',
    badgeVariant: 'red',
    actionText: 'Audit Residu >'
  }
];
