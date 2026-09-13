import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  Wifi,
  Battery,
  Cpu,
  Monitor,
  Shield,
  MapPin,
  Camera,
  Mic,
  Copy,
  Check,
  RefreshCw,
  AlertTriangle,
} from 'lucide-react';
import { Tool } from '../../types';
import { getRealDeviceData, DeviceData } from '../../utils/deviceInfo';

interface DeviceInfoViewProps {
  tool: Tool;
  onToast: (msg: string) => void;
}

export const DeviceInfoView: React.FC<DeviceInfoViewProps> = ({ tool, onToast }) => {
  const [deviceData, setDeviceData] = useState<DeviceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  // Permission states
  const [cameraPerm, setCameraPerm] = useState<string>('Querying...');
  const [micPerm, setMicPerm] = useState<string>('Querying...');
  const [geoPerm, setGeoPerm] = useState<string>('Prompt / Not requested');

  // Opt-in Geolocation results
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoCoordinates, setGeoCoordinates] = useState<{ lat: number; lng: number; accuracy: number } | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    const data = await getRealDeviceData();
    setDeviceData(data);
    setLoading(false);

    // Query permissions if supported
    if (navigator.permissions && navigator.permissions.query) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const cam = await navigator.permissions.query({ name: 'camera' as any });
        setCameraPerm(cam.state);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mic = await navigator.permissions.query({ name: 'microphone' as any });
        setMicPerm(mic.state);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const geo = await navigator.permissions.query({ name: 'geolocation' as any });
        setGeoPerm(geo.state);
      } catch {
        // Ignored if specific query is not supported by browser
      }
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCopyDiagnostics = () => {
    if (!deviceData) return;
    const report = `Utility Bazaar Device Diagnostic Report\n` +
      `-----------------------------------------\n` +
      `Operating System: ${deviceData.os}\n` +
      `Browser: ${deviceData.browser} (${deviceData.browserVersion})\n` +
      `Screen Resolution: ${deviceData.screenResolution}\n` +
      `Viewport Size: ${deviceData.viewportSize}\n` +
      `Device Pixel Ratio: ${deviceData.devicePixelRatio}\n` +
      `Online Status: ${deviceData.onlineStatus ? 'Connected' : 'Offline'}\n` +
      `Battery Level: ${deviceData.batteryPercentage}\n` +
      `Charging Status: ${deviceData.chargingStatus}\n` +
      `CPU Cores: ${deviceData.cpuCores}\n` +
      `Device Memory: ${deviceData.deviceMemory}\n` +
      `Touch Support: ${deviceData.touchSupport ? 'Yes' : 'No'}\n` +
      `User Agent: ${deviceData.userAgent}\n`;

    navigator.clipboard.writeText(report);
    setCopied(true);
    onToast('Diagnostic report copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  // Explicit opt-in Geolocation request with user permission
  const handleRequestLocation = () => {
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser.');
      return;
    }
    setGeoLoading(true);
    setGeoError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGeoLoading(false);
        setGeoCoordinates({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: Math.round(pos.coords.accuracy),
        });
        setGeoPerm('granted');
        onToast('Location retrieved successfully');
      },
      (err) => {
        setGeoLoading(false);
        setGeoError(err.message || 'Permission denied or location unavailable');
      },
      { timeout: 10000, maximumAge: 60000 }
    );
  };

  if (loading || !deviceData) {
    return (
      <div className="p-8 text-center text-neutral-500">
        <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-indigo-600" />
        <p className="text-sm">Reading genuine browser diagnostics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Authentic Hardware Notice Banner */}
      <div className="rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/70 dark:bg-blue-950/30 p-4 text-xs leading-relaxed text-blue-900 dark:text-blue-200">
        <div className="flex items-start gap-2">
          <Shield className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Zero Simulated Data Guarantee:</span> All metrics below reflect genuine W3C Web Platform APIs. Browser security sandboxes deliberately protect your privacy by withholding exact physical RAM, internal ROM storage, and physical battery capacity (mAh). Where hardware data cannot be read through the browser, it is honestly stated as "Not available through this browser".
          </div>
        </div>
      </div>

      {/* Copy Diagnostics Report Button */}
      <div className="flex justify-end">
        <button
          onClick={handleCopyDiagnostics}
          className="flex items-center gap-1.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3.5 py-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-700 shadow-xs"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? 'Copied Full Report' : 'Copy Diagnostics Report'}
        </button>
      </div>

      {/* Hardware & Environment Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs">
        {/* Operating System */}
        <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-850 space-y-1">
          <div className="flex items-center gap-2 text-neutral-500 font-semibold">
            <Smartphone className="h-4 w-4 text-indigo-500" />
            <span>Operating System</span>
          </div>
          <div className="text-base font-bold text-neutral-900 dark:text-white">{deviceData.os}</div>
          <p className="text-[11px] text-neutral-400">Platform: {deviceData.platform}</p>
        </div>

        {/* Browser & Engine */}
        <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-850 space-y-1">
          <div className="flex items-center gap-2 text-neutral-500 font-semibold">
            <Monitor className="h-4 w-4 text-indigo-500" />
            <span>Browser & Version</span>
          </div>
          <div className="text-base font-bold text-neutral-900 dark:text-white">
            {deviceData.browser} {deviceData.browserVersion}
          </div>
          <p className="text-[11px] text-neutral-400">Language: {deviceData.language}</p>
        </div>

        {/* Screen & Viewport */}
        <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-850 space-y-1">
          <div className="flex items-center gap-2 text-neutral-500 font-semibold">
            <Monitor className="h-4 w-4 text-indigo-500" />
            <span>Screen & Viewport</span>
          </div>
          <div className="text-base font-bold text-neutral-900 dark:text-white">{deviceData.screenResolution}</div>
          <p className="text-[11px] text-neutral-400">Viewport: {deviceData.viewportSize} (DPR: {deviceData.devicePixelRatio})</p>
        </div>

        {/* Battery Info */}
        <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-850 space-y-1">
          <div className="flex items-center gap-2 text-neutral-500 font-semibold">
            <Battery className="h-4 w-4 text-emerald-500" />
            <span>Battery Status</span>
          </div>
          <div className="text-base font-bold text-neutral-900 dark:text-white">{deviceData.batteryPercentage}</div>
          <p className="text-[11px] text-neutral-400">{deviceData.chargingStatus}</p>
        </div>

        {/* CPU & Memory (W3C estimates) */}
        <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-850 space-y-1">
          <div className="flex items-center gap-2 text-neutral-500 font-semibold">
            <Cpu className="h-4 w-4 text-amber-500" />
            <span>CPU & Memory</span>
          </div>
          <div className="text-sm font-bold text-neutral-900 dark:text-white">{deviceData.cpuCores}</div>
          <p className="text-[11px] text-neutral-400">{deviceData.deviceMemory}</p>
        </div>

        {/* Network & Connectivity */}
        <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-850 space-y-1">
          <div className="flex items-center gap-2 text-neutral-500 font-semibold">
            <Wifi className="h-4 w-4 text-cyan-500" />
            <span>Network Status</span>
          </div>
          <div className="text-base font-bold text-neutral-900 dark:text-white">
            {deviceData.onlineStatus ? 'Online (Connected)' : 'Offline'}
          </div>
          <p className="text-[11px] text-neutral-400">Speed: {deviceData.downlinkSpeed} ({deviceData.effectiveConnectionType})</p>
        </div>
      </div>

      {/* Permissions Section */}
      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-850 p-4 space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
          Browser API Permissions
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Camera className="h-4 w-4 text-indigo-500" />
              Camera:
            </span>
            <span className="font-semibold capitalize text-neutral-700 dark:text-neutral-300">{cameraPerm}</span>
          </div>
          <div className="p-3 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Mic className="h-4 w-4 text-indigo-500" />
              Microphone:
            </span>
            <span className="font-semibold capitalize text-neutral-700 dark:text-neutral-300">{micPerm}</span>
          </div>
          <div className="p-3 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-indigo-500" />
              Geolocation:
            </span>
            <span className="font-semibold capitalize text-neutral-700 dark:text-neutral-300">{geoPerm}</span>
          </div>
        </div>

        {/* Opt-in Geolocation button with explicit user control */}
        <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs text-neutral-500">
              Check GPS coordinates (only requested upon your explicit button click):
            </div>
            <button
              onClick={handleRequestLocation}
              disabled={geoLoading}
              className="px-3.5 py-1.5 rounded-lg bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-700 disabled:opacity-50 shadow-xs"
            >
              {geoLoading ? 'Requesting GPS...' : 'Check My Coordinates'}
            </button>
          </div>

          {geoCoordinates && (
            <div className="mt-3 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-emerald-800 dark:text-emerald-300 text-xs">
              Latitude: {geoCoordinates.lat.toFixed(5)}° | Longitude: {geoCoordinates.lng.toFixed(5)}° (Accuracy: ±{geoCoordinates.accuracy} meters)
            </div>
          )}

          {geoError && (
            <div className="mt-3 p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-rose-700 dark:text-rose-300 text-xs">
              ⚠️ {geoError}
            </div>
          )}
        </div>
      </div>

      {/* User Agent String */}
      <div>
        <div className="flex justify-between items-center mb-1 text-xs font-semibold text-neutral-700 dark:text-neutral-300">
          <span>Complete User Agent String:</span>
          <button
            onClick={() => {
              navigator.clipboard.writeText(deviceData.userAgent);
              onToast('User agent copied');
            }}
            className="text-indigo-600 hover:underline"
          >
            Copy
          </button>
        </div>
        <div className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-900 font-mono text-[11px] text-neutral-300 break-all select-all leading-relaxed">
          {deviceData.userAgent}
        </div>
      </div>
    </div>
  );
};
