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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 sm:p-6 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col border border-[#ded7cc] bg-white rounded-lg shadow-2xl my-auto text-[#18181b]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#ded7cc] px-6 py-4 bg-[#faf8f5]">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700">
              <Cloud className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-editorial text-lg text-[#18181b]">
                Cloudflare R2 & Video Storage Architecture
              </h3>
              <p className="text-xs text-[#787268]">
                Modular high-performance media pipeline configuration
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-[#787268] hover:text-[#18181b] rounded transition-colors" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-6 bg-white">
          <div className="bg-[#faf8f5] border border-[#ded7cc] p-4 text-xs text-[#524d45] leading-relaxed space-y-2 rounded-lg">
            <div className="flex items-center gap-2 text-[#18181b] font-medium">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
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
                className="h-4 w-4 accent-amber-600"
              />
              <div>
                <span className="text-sm font-semibold text-[#18181b] block">
                  Enable Cloudflare R2 CDN Resolution
                </span>
                <span className="text-[11px] text-[#787268]">
                  When active, image paths prefixed with <code className="text-[#18181b] font-semibold">r2://</code> resolve through your custom CDN URL
                </span>
              </div>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-[#524d45] font-semibold block">
                Cloudflare Account ID
              </label>
              <input
                type="text"
                value={config.accountId}
                onChange={(e) => setConfig({ ...config, accountId: e.target.value })}
                placeholder="e.g. 78f192b678c1..."
                className="w-full bg-[#faf8f5] border border-[#ded7cc] px-3.5 py-2 text-xs text-[#18181b] focus:outline-none focus:border-[#18181b] font-mono rounded"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-[#524d45] font-semibold block">
                R2 Bucket Name
              </label>
              <input
                type="text"
                value={config.bucketName}
                onChange={(e) => setConfig({ ...config, bucketName: e.target.value })}
                placeholder="elle-kay-portfolio-assets"
                className="w-full bg-[#faf8f5] border border-[#ded7cc] px-3.5 py-2 text-xs text-[#18181b] focus:outline-none focus:border-[#18181b] font-mono rounded"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-[#524d45] font-semibold block">
                Public Custom Domain / CDN URL
              </label>
              <input
                type="text"
                value={config.publicCdnUrl}
                onChange={(e) => setConfig({ ...config, publicCdnUrl: e.target.value })}
                placeholder="https://cdn.ellekay-studio.com"
                className="w-full bg-[#faf8f5] border border-[#ded7cc] px-3.5 py-2 text-xs text-[#18181b] focus:outline-none focus:border-[#18181b] font-mono rounded"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-[#524d45] font-semibold block">
                Cloudflare Stream Gateway URL
              </label>
              <input
                type="text"
                value={config.streamUrl || ''}
                onChange={(e) => setConfig({ ...config, streamUrl: e.target.value })}
                placeholder="https://customer-stream.cloudflare.com"
                className="w-full bg-[#faf8f5] border border-[#ded7cc] px-3.5 py-2 text-xs text-[#18181b] focus:outline-none focus:border-[#18181b] font-mono rounded"
              />
            </div>
          </div>

          {/* Cloudflare Deployment info */}
          <div className="space-y-3 border-t border-[#ded7cc] pt-5">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-[#524d45] font-semibold">
                Cloudflare Pages Deployment
              </span>
              <span className="text-[11px] font-mono text-emerald-800 bg-emerald-50 border border-emerald-300 px-2 py-0.5 rounded font-medium">
                Pages Ready
              </span>
            </div>
            <div className="bg-[#faf8f5] border border-[#ded7cc] p-3 text-xs space-y-2 text-[#524d45] rounded-lg">
              <p>
                Deployed on Cloudflare Pages using Vite. SPA routing is managed via <code className="text-[#18181b] font-mono font-semibold">public/_redirects</code>.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-mono text-[11px]">
                <div className="bg-white p-2 border border-[#ded7cc] rounded shadow-sm">
                  <span className="text-[#787268] block text-[10px]">Build command:</span>
                  <span className="text-amber-800 font-semibold">npm run build</span>
                </div>
                <div className="bg-white p-2 border border-[#ded7cc] rounded shadow-sm">
                  <span className="text-[#787268] block text-[10px]">Build output directory:</span>
                  <span className="text-emerald-800 font-semibold">dist</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sample Cloudflare Worker integration code */}
          <div className="space-y-2 border-t border-[#ded7cc] pt-5">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-[#524d45] font-semibold">
                Cloudflare Worker Deployment Snippet
              </span>
              <button
                type="button"
                onClick={copySnippet}
                className="flex items-center gap-1.5 text-xs text-[#524d45] hover:text-[#18181b] font-medium"
              >
                {copiedCode ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedCode ? 'Copied' : 'Copy Worker Code'}</span>
              </button>
            </div>
            <pre className="p-4 bg-[#faf8f5] border border-[#ded7cc] text-[11px] text-[#18181b] overflow-x-auto font-mono rounded-lg">
              {sampleWorkerSnippet}
            </pre>
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-[#ded7cc] flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="text-xs text-[#787268] hover:text-[#18181b] uppercase tracking-wider font-semibold"
            >
              Close
            </button>

            <button
              type="submit"
              className="flex items-center gap-2 bg-[#18181b] text-white px-5 py-2 text-xs font-semibold uppercase tracking-wider hover:bg-neutral-800 rounded shadow-sm"
            >
              {saved ? <Check className="h-4 w-4 text-emerald-400" /> : null}
              <span>{saved ? 'Settings Saved' : 'Save Cloudflare Settings'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
