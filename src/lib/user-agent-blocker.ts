/**
 * User-Agent Blocking
 * Mencegah request dari tools performance testing yang dikenali
 */

// User-Agent patterns yang akan diblokir
const BLOCKLISTED_PATTERNS = [
  // Performance testing tools
  /ab\//i,                    // Apache Bench
  /ApacheBench/i,             // Apache Bench
  /Apache-JMeter/i,           // JMeter
  /JMeter/i,                  // JMeter
  /k6\//i,                    // k6
  /locust\//i,                // Locust
  /Gatling/i,                 // Gatling
  /wrk\//i,                   // wrk
  /hey\//i,                   // hey
  /boom\//i,                  // boom
  /vegeta\//i,                // Vegeta
  /siege\//i,                 // Siege
  /tsung\//i,                 // Tsung
  /autocannon\//i,            // Autocannon
  
  // HTTP clients yang sering dipakai untuk testing
  /curl\//i,                  // curl
  /wget\//i,                  // wget
  /Go-http-client\//i,        // Go HTTP client
  /Java\//i,                  // Java HTTP client (sering dipakai JMeter)
  /python-requests\//i,       // Python requests (sering dipakai Locust)
  /node-fetch\//i,            // Node.js fetch (sering dipakai k6)
  /axios\//i,                 // Axios (sering dipakai untuk testing)
  /httpie\//i,                // HTTPie
  
  // Postman (boleh di-comment jika ingin izinkan untuk development)
  /PostmanRuntime/i,          // Postman
  
  // Headless browsers (sering dipakai untuk automated testing)
  /HeadlessChrome/i,          // Headless Chrome
  /PhantomJS/i,               // PhantomJS
  /Puppeteer/i,               // Puppeteer
  /Playwright/i,              // Playwright
  
  // Generic patterns
  /bot/i,                     // Generic bot (hati-hati dengan ini)
  /spider/i,                  // Generic spider
  /crawler/i,                 // Generic crawler
  /scraper/i,                 // Generic scraper
];

// User-Agent patterns yang diizinkan (whitelist)
const WHITELISTED_PATTERNS = [
  // Modern browsers
  /Mozilla\/5\.0.*Chrome/i,   // Chrome
  /Mozilla\/5\.0.*Firefox/i,  // Firefox
  /Mozilla\/5\.0.*Safari/i,   // Safari
  /Mozilla\/5\.0.*Edge/i,     // Edge
  
  // Search engine bots (biasanya aman)
  /Googlebot/i,               // Google bot
  /Bingbot/i,                 // Bing bot
  /Slurp/i,                   // Yahoo bot
  /DuckDuckBot/i,             // DuckDuckGo bot
  
  // Vercel related
  /Vercel/i,                  // Vercel
  
  // Social media bots
  /facebookexternalhit/i,     // Facebook crawler
  /Twitterbot/i,              // Twitter bot
  /LinkedInBot/i,             // LinkedIn bot
];

interface BlockResult {
  blocked: boolean;
  reason?: string;
  userAgent: string;
}

/**
 * Cek apakah User-Agent harus diblokir
 */
export function checkUserAgent(userAgent: string | null): BlockResult {
  // Jika tidak ada User-Agent, anggap mencurigakan
  if (!userAgent || userAgent.trim() === '') {
    return {
      blocked: true,
      reason: 'Missing User-Agent header',
      userAgent: 'unknown',
    };
  }

  // Cek whitelist terlebih dahulu
  for (const pattern of WHITELISTED_PATTERNS) {
    if (pattern.test(userAgent)) {
      return {
        blocked: false,
        userAgent,
      };
    }
  }

  // Cek blocklist
  for (const pattern of BLOCKLISTED_PATTERNS) {
    if (pattern.test(userAgent)) {
      // Cari pattern yang match untuk memberi reason yang lebih spesifik
      const matchedPattern = pattern.source.replace(/\\/g, '');
      return {
        blocked: true,
        reason: `Blocked User-Agent pattern: ${matchedPattern}`,
        userAgent,
      };
    }
  }

  // Jika tidak match dengan whitelist atau blocklist, izinkan tapi log
  return {
    blocked: false,
    userAgent,
  };
}

/**
 * Cek apakah User-Agent dari browser modern
 */
export function isModernBrowser(userAgent: string | null): boolean {
  if (!userAgent) return false;
  
  const browserPatterns = [
    /Mozilla\/5\.0.*Chrome/i,
    /Mozilla\/5\.0.*Firefox/i,
    /Mozilla\/5\.0.*Safari/i,
    /Mozilla\/5\.0.*Edge/i,
  ];
  
  return browserPatterns.some(pattern => pattern.test(userAgent));
}

/**
 * Ekstrak informasi dasar dari User-Agent
 */
export function parseUserAgent(userAgent: string): {
  browser?: string;
  os?: string;
  device?: string;
} {
  const result: any = {};

  // Browser detection
  if (/Chrome/i.test(userAgent) && !/Edg/i.test(userAgent)) {
    result.browser = 'Chrome';
  } else if (/Firefox/i.test(userAgent)) {
    result.browser = 'Firefox';
  } else if (/Safari/i.test(userAgent) && !/Chrome/i.test(userAgent)) {
    result.browser = 'Safari';
  } else if (/Edg/i.test(userAgent)) {
    result.browser = 'Edge';
  } else if (/MSIE|Trident/i.test(userAgent)) {
    result.browser = 'Internet Explorer';
  }

  // OS detection
  if (/Windows/i.test(userAgent)) {
    result.os = 'Windows';
  } else if (/Mac/i.test(userAgent)) {
    result.os = 'macOS';
  } else if (/Linux/i.test(userAgent)) {
    result.os = 'Linux';
  } else if (/Android/i.test(userAgent)) {
    result.os = 'Android';
  } else if (/iOS/i.test(userAgent)) {
    result.os = 'iOS';
  }

  // Device detection
  if (/Mobile/i.test(userAgent)) {
    result.device = 'Mobile';
  } else if (/Tablet/i.test(userAgent)) {
    result.device = 'Tablet';
  } else {
    result.device = 'Desktop';
  }

  return result;
}
