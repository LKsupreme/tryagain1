import React, { useState } from 'react';
import { X, Cloud, Key, HardDrive, Check, Copy, ExternalLink, ShieldCheck } from 'lucide-react';
import { CloudflareConfig } from '../../types';
import { StorageService } from '../../services/storage';

interface CloudflareSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CloudflareSettingsModal: React.FC<CloudflareSettingsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [config, setConfig] = useState<CloudflareConfig>(() =>
    StorageService.getCloudflareConfig()
  );
  const [saved, setSaved] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    StorageService.saveCloudflareConfig(config);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const sampleWorkerSnippet = `// cloudflare-worker-r2-upload.ts
// Cloudflare Worker for direct streaming uploads to Elle Kay's R2 Bucket
export default {
  async fetch(request: Request, env: { ELLE_KAY_R2: R2Bucket }): Promise<Response> {
    const url = new URL(request.url);
    const key = url.pathname.slice(1);

    if (request.method === "PUT") {
      await env.ELLE_KAY_R2.put(key, request.body, {
        httpMetadata: { contentType: request.headers.get("content-type") || "image/jpeg" }
      });
      return new Response(JSON.stringify({ 
        success: true, 
        url: \`https://\${url.hostname}/\${key}\` 
      }), {
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }

    const object = await env.ELLE_KAY_R2.get(key);
    if (!object) return new Response("Asset Not Found", { status: 404 });
    return new Response(object.body);
  }
};`;

  const copySnippet = () => {
    navigator.clipboard.writeText(sampleWorkerSnippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 sm:p-6 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col border border-[#27272a] bg-[#0c0c0e] rounded-sm shadow-2xl my-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#27272a] px-6 py-4 bg-[#121215]">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-[#f38020]/20 flex items-center justify-center text-[#f38020]">
              <Cloud className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-editorial text-lg text-white">
                Cloudflare R2 & Video Storage Architecture
              </h3>
              <p className="text-xs text-[#a1a1aa]">
                Modular high-performance media pipeline configuration
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-[#a1a1aa] hover:text-white" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="bg-[#121216] border border-[#27272a] p-4 text-xs text-[#d4d4d8] leading-relaxed space-y-2">
            <div className="flex items-center gap-2 text-white font-medium">
              <ShieldCheck className="h-4 w-4 text-[#10b981]" />
              <span>Zero-Egress Fees & Lightning-Fast Edge Delivery</span>
            </div>
            <p>
              By configuring Cloudflare R2 and Cloudflare Stream, you bypass Git file size limitations. Your 8K renders and 4K architectural films stream with zero egress charges across 330+ Cloudflare edge locations worldwide.
            </p>
          </div>

          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={config.enabled}
                onChange={(e) => setConfig({ ...config, enabled: e.target.checked })}
                className="h-4 w-4 accent-[#f38020]"
              />
              <div>
                <span className="text-sm font-medium text-white block">
                  Enable Cloudflare R2 CDN Resolution
                </span>
                <span className="text-[11px] text-[#71717a]">
                  When active, image paths prefixed with <code className="text-white">r2://</code> resolve through your custom CDN URL
                </span>
              </div>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-[#a1a1aa] block">
                Cloudflare Account ID
              </label>
              <input
                type="text"
                value={config.accountId}
                onChange={(e) => setConfig({ ...config, accountId: e.target.value })}
                placeholder="e.g. 78f192b678c1..."
                className="w-full bg-[#18181b] border border-[#27272a] px-3.5 py-2 text-xs text-white focus:outline-none focus:border-white font-mono"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-[#a1a1aa] block">
                R2 Bucket Name
              </label>
              <input
                type="text"
                value={config.bucketName}
                onChange={(e) => setConfig({ ...config, bucketName: e.target.value })}
                placeholder="elle-kay-portfolio-assets"
                className="w-full bg-[#18181b] border border-[#27272a] px-3.5 py-2 text-xs text-white focus:outline-none focus:border-white font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-[#a1a1aa] block">
                Public Custom Domain / CDN URL
              </label>
              <input
                type="text"
                value={config.publicCdnUrl}
                onChange={(e) => setConfig({ ...config, publicCdnUrl: e.target.value })}
                placeholder="https://cdn.ellekay-studio.com"
                className="w-full bg-[#18181b] border border-[#27272a] px-3.5 py-2 text-xs text-white focus:outline-none focus:border-white font-mono"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-[#a1a1aa] block">
                Cloudflare Stream Gateway URL
              </label>
              <input
                type="text"
                value={config.streamUrl || ''}
                onChange={(e) => setConfig({ ...config, streamUrl: e.target.value })}
                placeholder="https://customer-stream.cloudflare.com"
                className="w-full bg-[#18181b] border border-[#27272a] px-3.5 py-2 text-xs text-white focus:outline-none focus:border-white font-mono"
              />
            </div>
          </div>

          {/* Sample Cloudflare Worker integration code */}
          <div className="space-y-2 border-t border-[#27272a] pt-5">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-[#a1a1aa]">
                Cloudflare Worker Deployment Snippet
              </span>
              <button
                type="button"
                onClick={copySnippet}
                className="flex items-center gap-1.5 text-xs text-[#a1a1aa] hover:text-white"
              >
                {copiedCode ? <Check className="h-3.5 w-3.5 text-[#10b981]" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedCode ? 'Copied' : 'Copy Worker Code'}</span>
              </button>
            </div>
            <pre className="p-4 bg-[#09090b] border border-[#27272a] text-[11px] text-[#a1a1aa] overflow-x-auto font-mono">
              {sampleWorkerSnippet}
            </pre>
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-[#27272a] flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="text-xs text-[#a1a1aa] hover:text-white uppercase tracking-wider"
            >
              Close
            </button>

            <button
              type="submit"
              className="flex items-center gap-2 bg-[#f4f4f6] text-black px-5 py-2 text-xs font-semibold uppercase tracking-wider hover:bg-white"
            >
              {saved ? <Check className="h-4 w-4 text-[#10b981]" /> : null}
              <span>{saved ? 'Settings Saved' : 'Save Cloudflare Settings'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
