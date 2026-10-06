export type AnimalSpecies = 'sapi' | 'kambing' | 'domba' | 'kerbau';

export type AnimalStatus = 'aktif' | 'withdrawal' | 'bunting' | 'terjual' | 'mati';

export interface Animal {
  id: string;
  eartag: string;
  species: AnimalSpecies;
  breed: string;
  sex: 'Jantan' | 'Betina';
  age: string;
  kandang: string;
  origin: string;
  weight: number;
  adg: number; // Average Daily Gain kg/hari
  status: AnimalStatus;
  statusBadge?: string;
  statusColor?: 'green' | 'red' | 'amber' | 'blue' | 'gray';
  subStatus?: string;
  targetWeight?: number;
  initialWeight?: number;
  birthDate?: string;
  motherTag?: string;
  fatherTag?: string;
  photoUrl?: string;
  notes?: string;
  withdrawalEndDate?: string;
  withdrawalReason?: string;
  rfid?: string;
}

export interface Activity {
  id: string;
  type: 'timbang' | 'obat' | 'registrasi' | 'reproduksi' | 'vaksinasi';
  time: string;
  dateGroup: 'Hari Ini' | 'Kemarin' | 'Sebelumnya';
  animalTag: string;
  animalDesc: string;
  title: string;
  details: {
    [key: string]: string | number | undefined;
  };
  operator: string;
  badgeText?: string;
  badgeVariant?: 'green' | 'red' | 'blue' | 'amber' | 'gray';
  actionText?: string;
  warningNote?: string;
}

export interface MedicationEntry {
  id: string;
  animalTag: string;
  category: 'obat' | 'vaksinasi';
  medicineName: string;
  date: string;
  dosage: number;
  route: string;
  symptoms: string[];
  hasWithdrawal: boolean;
  withdrawalDays: number;
  withdrawalEndDate: string;
  cost: number;
  vetName: string;
  notes: string;
}

export interface WeightEntry {
  id: string;
  animalTag: string;
  date: string;
  weight: number;
  diffWeight: number;
  adg: number;
  conditions: string[];
  notes: string;
}
