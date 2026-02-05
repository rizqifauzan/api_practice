/**
 * Request Pattern Detection
 * Mendeteksi pola request yang mencurigakan
 */

interface RequestRecord {
  timestamp: number;
  endpoint: string;
  method: string;
}

interface PatternDetectionResult {
  suspicious: boolean;
  reason?: string;
  score: number; // 0-100, semakin tinggi semakin mencurigakan
}

// Storage untuk tracking request per IP
const requestStore: Map<string, RequestRecord[]> = new Map();

// Konfigurasi pattern detection
const PATTERN_CONFIG = {
  // Burst detection: jika lebih dari X request dalam Y ms
  burstThreshold: 10,      // request count
  burstWindow: 1000,      // ms (1 detik)
  
  // Exact interval detection: jika request dengan interval sama persis
  exactIntervalThreshold: 5,  // jumlah request untuk dianggap pattern
  exactIntervalTolerance: 50,  // ms toleransi
  
  // Same endpoint detection: jika request ke endpoint yang sama berulang
  sameEndpointThreshold: 20,   // request count
  sameEndpointWindow: 5000,    // ms (5 detik)
  
  // Storage cleanup: hapus record yang lebih lama dari X ms
  cleanupAge: 60000,  // ms (1 menit)
  
  // Maximum score untuk dianggap suspicious
  suspiciousThreshold: 70,
};

/**
 * Tambah record request untuk IP tertentu
 */
export function addRequestRecord(
  ip: string,
  endpoint: string,
  method: string
): void {
  const now = Date.now();
  const record: RequestRecord = {
    timestamp: now,
    endpoint,
    method,
  };

  if (!requestStore.has(ip)) {
    requestStore.set(ip, []);
  }

  const records = requestStore.get(ip)!;
  records.push(record);

  // Cleanup old records
  cleanupOldRecords(records);
}

/**
 * Cleanup record yang sudah kadaluarsa
 */
function cleanupOldRecords(records: RequestRecord[]): void {
  const now = Date.now();
  const cutoff = now - PATTERN_CONFIG.cleanupAge;

  for (let i = records.length - 1; i >= 0; i--) {
    if (records[i].timestamp < cutoff) {
      records.splice(i, 1);
    }
  }
}

/**
 * Cek burst requests
 */
function detectBurstRequests(records: RequestRecord[]): {
  detected: boolean;
  score: number;
} {
  if (records.length < PATTERN_CONFIG.burstThreshold) {
    return { detected: false, score: 0 };
  }

  const now = Date.now();
  const cutoff = now - PATTERN_CONFIG.burstWindow;

  // Hitung request dalam window
  const recentRequests = records.filter(r => r.timestamp >= cutoff);

  if (recentRequests.length >= PATTERN_CONFIG.burstThreshold) {
    // Score berdasarkan seberapa melebihi threshold
    const excess = recentRequests.length - PATTERN_CONFIG.burstThreshold;
    const score = Math.min(100, 50 + excess * 5);
    return { detected: true, score };
  }

  return { detected: false, score: 0 };
}

/**
 * Cek exact interval requests (automated pattern)
 */
function detectExactInterval(records: RequestRecord[]): {
  detected: boolean;
  score: number;
} {
  if (records.length < PATTERN_CONFIG.exactIntervalThreshold) {
    return { detected: false, score: 0 };
  }

  // Ambil N request terakhir
  const recentRecords = records.slice(-PATTERN_CONFIG.exactIntervalThreshold);

  // Hitung interval antar request
  const intervals: number[] = [];
  for (let i = 1; i < recentRecords.length; i++) {
    intervals.push(recentRecords[i].timestamp - recentRecords[i - 1].timestamp);
  }

  // Cek apakah semua interval sama (dalam toleransi)
  const firstInterval = intervals[0];
  const allSame = intervals.every(
    interval => Math.abs(interval - firstInterval) <= PATTERN_CONFIG.exactIntervalTolerance
  );

  if (allSame && intervals.length > 0) {
    // Score berdasarkan seberapa presis intervalnya
    const variance = intervals.reduce((sum, interval) => sum + Math.abs(interval - firstInterval), 0) / intervals.length;
    const score = Math.min(100, 80 + (PATTERN_CONFIG.exactIntervalTolerance - variance) * 2);
    return { detected: true, score };
  }

  return { detected: false, score: 0 };
}

/**
 * Cek same endpoint requests
 */
function detectSameEndpoint(records: RequestRecord[]): {
  detected: boolean;
  score: number;
  endpoint?: string;
} {
  if (records.length < PATTERN_CONFIG.sameEndpointThreshold) {
    return { detected: false, score: 0 };
  }

  const now = Date.now();
  const cutoff = now - PATTERN_CONFIG.sameEndpointWindow;

  // Hitung request per endpoint dalam window
  const endpointCounts: Map<string, number> = new Map();
  records.forEach(record => {
    if (record.timestamp >= cutoff) {
      const count = endpointCounts.get(record.endpoint) || 0;
      endpointCounts.set(record.endpoint, count + 1);
    }
  });

  // Cek endpoint dengan request terbanyak
  let maxCount = 0;
  let maxEndpoint = '';
  endpointCounts.forEach((count, endpoint) => {
    if (count > maxCount) {
      maxCount = count;
      maxEndpoint = endpoint;
    }
  });

  if (maxCount >= PATTERN_CONFIG.sameEndpointThreshold) {
    // Score berdasarkan seberapa melebihi threshold
    const excess = maxCount - PATTERN_CONFIG.sameEndpointThreshold;
    const score = Math.min(100, 40 + excess * 3);
    return { detected: true, score, endpoint: maxEndpoint };
  }

  return { detected: false, score: 0 };
}

/**
 * Cek pola request yang mencurigakan
 */
export function detectSuspiciousPattern(ip: string): PatternDetectionResult {
  const records = requestStore.get(ip);

  if (!records || records.length < 3) {
    return { suspicious: false, score: 0 };
  }

  // Jalankan semua detection
  const burstResult = detectBurstRequests(records);
  const intervalResult = detectExactInterval(records);
  const endpointResult = detectSameEndpoint(records);

  // Kombinasikan score
  let totalScore = Math.max(burstResult.score, intervalResult.score, endpointResult.score);

  // Jika multiple detections, tambahkan bonus score
  const detectionCount = [
    burstResult.detected,
    intervalResult.detected,
    endpointResult.detected
  ].filter(Boolean).length;

  if (detectionCount > 1) {
    totalScore = Math.min(100, totalScore + 10 * (detectionCount - 1));
  }

  // Tentukan reason
  let reason: string | undefined;
  if (totalScore >= PATTERN_CONFIG.suspiciousThreshold) {
    const reasons: string[] = [];
    if (burstResult.detected) reasons.push('burst requests');
    if (intervalResult.detected) reasons.push('automated pattern');
    if (endpointResult.detected) reasons.push(`repeated endpoint: ${endpointResult.endpoint}`);
    reason = reasons.join(', ');
  }

  return {
    suspicious: totalScore >= PATTERN_CONFIG.suspiciousThreshold,
    reason,
    score: totalScore,
  };
}

/**
 * Reset records untuk IP tertentu (untuk testing/admin)
 */
export function resetRequestRecords(ip: string): void {
  requestStore.delete(ip);
}

/**
 * Get statistics untuk IP tertentu
 */
export function getRequestStats(ip: string): {
  totalRequests: number;
  uniqueEndpoints: number;
  oldestRequest: number | null;
  newestRequest: number | null;
} {
  const records = requestStore.get(ip);

  if (!records || records.length === 0) {
    return {
      totalRequests: 0,
      uniqueEndpoints: 0,
      oldestRequest: null,
      newestRequest: null,
    };
  }

  const timestamps = records.map(r => r.timestamp);
  const endpoints = new Set(records.map(r => r.endpoint));

  return {
    totalRequests: records.length,
    uniqueEndpoints: endpoints.size,
    oldestRequest: Math.min(...timestamps),
    newestRequest: Math.max(...timestamps),
  };
}

/**
 * Cek apakah pattern detection diaktifkan
 */
export function isPatternDetectionEnabled(): boolean {
  return process.env.PATTERN_DETECTION_ENABLED !== 'false';
}
