import { Animal, Activity } from '../types';

const CLOUD_ENDPOINT = 'https://api.restful-api.dev/objects/ff808181a09d98f701a1121a9bc50b22';

export interface CloudDatabase {
  animals: Animal[];
  activities: Activity[];
}

// Fetch central database from cloud with localStorage fallback
export async function fetchCentralData(): Promise<CloudDatabase | null> {
  try {
    const res = await fetch(CLOUD_ENDPOINT, { cache: 'no-store' });
    if (!res.ok) throw new Error('Cloud response not ok');
    const json = await res.json();
    if (json && json.data) {
      const data: CloudDatabase = {
        animals: Array.isArray(json.data.animals) ? json.data.animals : [],
        activities: Array.isArray(json.data.activities) ? json.data.activities : [],
      };
      // Cache locally
      localStorage.setItem('ternakpro_animals', JSON.stringify(data.animals));
      localStorage.setItem('ternakpro_activities', JSON.stringify(data.activities));
      return data;
    }
  } catch (err) {
    console.warn('Gagal menarik data cloud (menggunakan cache lokal):', err);
  }

  // Fallback to local storage
  try {
    const savedAnimals = localStorage.getItem('ternakpro_animals');
    const savedActivities = localStorage.getItem('ternakpro_activities');
    return {
      animals: savedAnimals ? JSON.parse(savedAnimals) : [],
      activities: savedActivities ? JSON.parse(savedActivities) : []
    };
  } catch {
    return { animals: [], activities: [] };
  }
}

// Save to central cloud database and local cache
export async function saveCentralData(animals: Animal[], activities: Activity[]): Promise<boolean> {
  // Always update local cache immediately
  try {
    localStorage.setItem('ternakpro_animals', JSON.stringify(animals));
    localStorage.setItem('ternakpro_activities', JSON.stringify(activities));
  } catch (e) {
    console.warn('Local cache error:', e);
  }

  // Sync to Central Cloud DB
  try {
    const res = await fetch(CLOUD_ENDPOINT, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: 'TernakPro Central DB',
        data: {
          animals,
          activities
        }
      })
    });
    return res.ok;
  } catch (err) {
    console.warn('Gagal sinkronisasi ke cloud (tersimpan lokal):', err);
    return false;
  }
}
