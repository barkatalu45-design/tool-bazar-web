// Real Browser and Device Diagnostic APIs - ZERO fake hardware data

export interface DeviceData {
  browser: string;
  browserVersion: string;
  os: string;
  userAgent: string;
  platform: string;
  screenResolution: string;
  viewportSize: string;
  devicePixelRatio: number;
  language: string;
  timeZone: string;
  onlineStatus: boolean;
  connectionType: string;
  effectiveConnectionType: string;
  downlinkSpeed: string;
  roundTripTime: string;
  batteryPercentage: string;
  chargingStatus: string;
  cpuCores: string;
  deviceMemory: string;
  touchSupport: boolean;
  maxTouchPoints: number;
  cookiesEnabled: boolean;
  localStorageAvailable: boolean;
  sessionStorageAvailable: boolean;
  webglSupported: boolean;
  webgpuSupported: boolean;
}

export function parseUserAgent(ua: string): { browser: string; version: string; os: string } {
  let browser = 'Unknown Browser';
  let version = 'Unknown';
  let os = 'Unknown OS';

  // Detect OS
  if (/Windows NT 10/i.test(ua)) os = 'Windows 10 / 11';
  else if (/Windows NT 6.3/i.test(ua)) os = 'Windows 8.1';
  else if (/Windows NT 6.1/i.test(ua)) os = 'Windows 7';
  else if (/Android/i.test(ua)) {
    const match = ua.match(/Android\s([0-9.]+)/i);
    os = match ? `Android ${match[1]}` : 'Android';
  } else if (/iPhone|iPad|iPod/i.test(ua)) {
    const match = ua.match(/OS\s([0-9_]+)/i);
    os = match ? `iOS ${match[1].replace(/_/g, '.')}` : 'iOS';
  } else if (/Macintosh|Mac OS X/i.test(ua)) {
    const match = ua.match(/Mac OS X\s([0-9_.]+)/i);
    os = match ? `macOS ${match[1].replace(/_/g, '.')}` : 'macOS';
  } else if (/Linux/i.test(ua)) os = 'Linux';

  // Detect Browser
  if (/Edg\/([0-9.]+)/i.test(ua)) {
    browser = 'Microsoft Edge';
    version = ua.match(/Edg\/([0-9.]+)/i)?.[1] || '';
  } else if (/Chrome\/([0-9.]+)/i.test(ua) && !/Edg/i.test(ua)) {
    browser = 'Google Chrome';
    version = ua.match(/Chrome\/([0-9.]+)/i)?.[1] || '';
  } else if (/Firefox\/([0-9.]+)/i.test(ua)) {
    browser = 'Mozilla Firefox';
    version = ua.match(/Firefox\/([0-9.]+)/i)?.[1] || '';
  } else if (/Version\/([0-9.]+).*Safari/i.test(ua)) {
    browser = 'Apple Safari';
    version = ua.match(/Version\/([0-9.]+)/i)?.[1] || '';
  } else if (/Opera|OPR\/([0-9.]+)/i.test(ua)) {
    browser = 'Opera';
    version = ua.match(/(?:Opera|OPR)\/([0-9.]+)/i)?.[1] || '';
  }

  return { browser, version, os };
}

export async function getRealDeviceData(): Promise<DeviceData> {
  const ua = navigator.userAgent;
  const parsed = parseUserAgent(ua);

  // Network info
  const navAny = navigator as unknown as {
    connection?: {
      type?: string;
      effectiveType?: string;
      downlink?: number;
      rtt?: number;
    };
    deviceMemory?: number;
    getBattery?: () => Promise<{
      level: number;
      charging: boolean;
    }>;
  };

  const connection = navAny.connection;
  const connectionType = connection?.type || (connection ? 'Network connection active' : 'Not available through this browser');
  const effectiveConnectionType = connection?.effectiveType ? connection.effectiveType.toUpperCase() : 'Not available through this browser';
  const downlinkSpeed = connection?.downlink !== undefined ? `${connection.downlink} Mbps (approx)` : 'Not available through this browser';
  const roundTripTime = connection?.rtt !== undefined ? `${connection.rtt} ms` : 'Not available through this browser';

  // Battery info
  let batteryPercentage = 'Not available through this browser';
  let chargingStatus = 'Not available through this browser';

  if (typeof navAny.getBattery === 'function') {
    try {
      const battery = await navAny.getBattery();
      batteryPercentage = `${Math.round(battery.level * 100)}%`;
      chargingStatus = battery.charging ? 'Charging (Connected to power)' : 'Discharging (Running on battery)';
    } catch {
      batteryPercentage = 'Not available through this browser';
      chargingStatus = 'Not available through this browser';
    }
  }

  // CPU Cores
  const cpuCores = navigator.hardwareConcurrency
    ? `${navigator.hardwareConcurrency} logical cores detected`
    : 'Not available through this browser';

  // Device Memory
  const deviceMemory = navAny.deviceMemory
    ? `Approx. ≥ ${navAny.deviceMemory} GB RAM (Browser Security Estimate)`
    : 'Not available through this browser';

  // Local & Session storage checks
  let localStorageAvailable = false;
  try {
    localStorage.setItem('__test__', '1');
    localStorage.removeItem('__test__');
    localStorageAvailable = true;
  } catch {
    localStorageAvailable = false;
  }

  let sessionStorageAvailable = false;
  try {
    sessionStorage.setItem('__test__', '1');
    sessionStorage.removeItem('__test__');
    sessionStorageAvailable = true;
  } catch {
    sessionStorageAvailable = false;
  }

  // WebGL support
  let webglSupported = false;
  try {
    const canvas = document.createElement('canvas');
    webglSupported = !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
  } catch {
    webglSupported = false;
  }

  // WebGPU support
  const webgpuSupported = 'gpu' in navigator;

  return {
    browser: parsed.browser,
    browserVersion: parsed.version,
    os: parsed.os,
    userAgent: ua,
    platform: navigator.platform || 'Unknown platform',
    screenResolution: `${window.screen.width} × ${window.screen.height} pixels (${window.screen.colorDepth}-bit color)`,
    viewportSize: `${window.innerWidth} × ${window.innerHeight} pixels`,
    devicePixelRatio: window.devicePixelRatio || 1,
    language: navigator.language,
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
    onlineStatus: navigator.onLine,
    connectionType,
    effectiveConnectionType,
    downlinkSpeed,
    roundTripTime,
    batteryPercentage,
    chargingStatus,
    cpuCores,
    deviceMemory,
    touchSupport: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
    maxTouchPoints: navigator.maxTouchPoints || 0,
    cookiesEnabled: navigator.cookieEnabled,
    localStorageAvailable,
    sessionStorageAvailable,
    webglSupported,
    webgpuSupported,
  };
}
