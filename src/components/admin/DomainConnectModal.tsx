import React, { useState } from 'react';
import {
  X,
  Globe,
  Check,
  Copy,
  ExternalLink,
  ShieldCheck,
  Server,
  ArrowRight,
  HelpCircle,
  Clock,
  Layers,
  Sparkles,
} from 'lucide-react';
import { StorageService } from '../../services/storage';

interface DomainConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'wix_dns' | 'cloudflare_ns' | 'deploy_steps' | 'troubleshooting';

export const DomainConnectModal: React.FC<DomainConnectModalProps> = ({ isOpen, onClose }) => {
  const [domainInput, setDomainInput] = useState(() => StorageService.getCustomDomain() || 'ellekay.design');
  const [activeTab, setActiveTab] = useState<TabType>('wix_dns');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  // Clean domain string
  const cleanDomain = domainInput
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/\/$/, '');

  const rootDomain = cleanDomain || 'yourdomain.com';
  const wwwDomain = `www.${rootDomain}`;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSaveDomain = (e: React.FormEvent) => {
    e.preventDefault();
    StorageService.saveCustomDomain(cleanDomain);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 sm:p-6 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col border border-[#27272a] bg-[#0c0c0e] rounded-sm shadow-2xl my-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#27272a] px-6 py-4 bg-[#121215]">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Globe className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-editorial text-lg text-white">Connect Wix Domain to Elle Kay Portfolio</h3>
                <span className="text-[10px] uppercase font-mono tracking-wider bg-emerald-950 text-emerald-300 border border-emerald-800/60 px-2 py-0.5 rounded">
                  DNS Assistant
                </span>
              </div>
              <p className="text-xs text-[#a1a1aa]">
                Connect your domain purchased on Wix to your live visual portfolio
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#a1a1aa] hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Domain Configuration Bar */}
        <div className="border-b border-[#27272a] bg-[#16161b] px-6 py-4">
          <form onSubmit={handleSaveDomain} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex-1 relative">
              <label className="text-[11px] uppercase tracking-wider text-[#a1a1aa] font-mono block mb-1">
                Your Purchased Wix Domain
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-xs text-[#71717a] font-mono select-none">https://</span>
                <input
                  type="text"
                  value={domainInput}
                  onChange={(e) => setDomainInput(e.target.value)}
                  placeholder="e.g. ellekay.com or ellekay.design"
                  className="w-full bg-[#0c0c0e] border border-[#2e2e38] pl-20 pr-4 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none rounded font-mono"
                />
              </div>
            </div>
            <button
              type="submit"
              className="mt-auto sm:self-end bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 text-xs font-medium uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-1.5"
            >
              {savedSuccess ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  <span>Domain Saved</span>
                </>
              ) : (
                <span>Save Domain</span>
              )}
            </button>
          </form>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#27272a] bg-[#121215] px-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('wix_dns')}
            className={`py-3 px-4 text-xs font-medium border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === 'wix_dns'
                ? 'border-emerald-400 text-white bg-[#1a1a20]'
                : 'border-transparent text-[#a1a1aa] hover:text-white'
            }`}
          >
            <Server className="h-3.5 w-3.5 text-emerald-400" />
            <span>Method 1: Wix DNS Pointing (Recommended)</span>
          </button>

          <button
            onClick={() => setActiveTab('cloudflare_ns')}
            className={`py-3 px-4 text-xs font-medium border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === 'cloudflare_ns'
                ? 'border-emerald-400 text-white bg-[#1a1a20]'
                : 'border-transparent text-[#a1a1aa] hover:text-white'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>Method 2: Cloudflare Nameservers (Fastest CDN)</span>
          </button>

          <button
            onClick={() => setActiveTab('deploy_steps')}
            className={`py-3 px-4 text-xs font-medium border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === 'deploy_steps'
                ? 'border-emerald-400 text-white bg-[#1a1a20]'
                : 'border-transparent text-[#a1a1aa] hover:text-white'
            }`}
          >
            <Layers className="h-3.5 w-3.5 text-blue-400" />
            <span>Free 1-Click Hosting Setup</span>
          </button>

          <button
            onClick={() => setActiveTab('troubleshooting')}
            className={`py-3 px-4 text-xs font-medium border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === 'troubleshooting'
                ? 'border-emerald-400 text-white bg-[#1a1a20]'
                : 'border-transparent text-[#a1a1aa] hover:text-white'
            }`}
          >
            <HelpCircle className="h-3.5 w-3.5 text-purple-400" />
            <span>Wix FAQ & Propagation</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-[#d4d4d8] text-sm">
          {/* TAB 1: WIX DNS POINTING */}
          {activeTab === 'wix_dns' && (
            <div className="space-y-6">
              <div className="bg-[#141419] border border-[#272730] p-4 rounded text-xs space-y-2">
                <div className="flex items-center gap-2 text-white font-medium">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  <span>How to connect in your Wix Account (Pointing Method)</span>
                </div>
                <p className="text-[#a1a1aa] leading-relaxed">
                  You bought your domain on Wix. You do <strong>not</strong> need to pay for a Wix Website plan to use your domain. Wix provides free DNS management for all domains purchased through their registrar.
                </p>
              </div>

              {/* Step-by-Step Wix Navigation */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono uppercase tracking-wider text-[#a1a1aa]">
                  Step-by-Step in Wix Dashboard
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="border border-[#272730] bg-[#121216] p-4 rounded space-y-2">
                    <div className="flex items-center gap-2 font-semibold text-white text-xs">
                      <span className="h-5 w-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-mono text-[11px]">
                        1
                      </span>
                      <span>Go to Wix Domains</span>
                    </div>
                    <p className="text-xs text-[#a1a1aa] leading-relaxed">
                      Log in to <strong className="text-white">wix.com</strong>, click your account name in the top right, and choose <strong className="text-white">Domains</strong>.
                    </p>
                  </div>

                  <div className="border border-[#272730] bg-[#121216] p-4 rounded space-y-2">
                    <div className="flex items-center gap-2 font-semibold text-white text-xs">
                      <span className="h-5 w-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-mono text-[11px]">
                        2
                      </span>
                      <span>Manage DNS Records</span>
                    </div>
                    <p className="text-xs text-[#a1a1aa] leading-relaxed">
                      Next to <code className="text-emerald-300 font-mono">{rootDomain}</code>, click the <strong className="text-white">••• (More Actions)</strong> icon and select <strong className="text-white">Manage DNS Records</strong>.
                    </p>
                  </div>

                  <div className="border border-[#272730] bg-[#121216] p-4 rounded space-y-2">
                    <div className="flex items-center gap-2 font-semibold text-white text-xs">
                      <span className="h-5 w-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-mono text-[11px]">
                        3
                      </span>
                      <span>Add / Edit Records</span>
                    </div>
                    <p className="text-xs text-[#a1a1aa] leading-relaxed">
                      Update the <strong className="text-white">A Record</strong> and <strong className="text-white">CNAME Record</strong> shown in the table below, then click <strong className="text-white">Save</strong>.
                    </p>
                  </div>
                </div>
              </div>

              {/* Exact DNS Records Table */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-white">
                    Exact Records to Enter into Wix DNS
                  </h4>
                  <span className="text-[11px] text-[#a1a1aa] flex items-center gap-1 font-mono">
                    <Clock className="h-3.5 w-3.5 text-amber-400" />
                    Propagation: 15 mins to 24 hrs
                  </span>
                </div>

                <div className="overflow-x-auto border border-[#272730] rounded bg-[#101014]">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#272730] bg-[#16161c] text-[#a1a1aa] font-mono">
                        <th className="p-3">Type</th>
                        <th className="p-3">Host Name</th>
                        <th className="p-3">Value / Points To</th>
                        <th className="p-3">TTL</th>
                        <th className="p-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#272730] font-mono">
                      {/* A Record for Root */}
                      <tr className="hover:bg-[#181820]">
                        <td className="p-3 text-emerald-400 font-bold">A</td>
                        <td className="p-3 text-white">@ (or leave blank)</td>
                        <td className="p-3 text-amber-300 font-bold">76.76.21.21</td>
                        <td className="p-3 text-[#71717a]">1 Hour (3600)</td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => copyToClipboard('76.76.21.21', 'ip')}
                            className="inline-flex items-center gap-1 bg-[#22222c] hover:bg-[#2e2e3c] text-white px-2.5 py-1 rounded text-[11px]"
                          >
                            {copiedKey === 'ip' ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                            <span>{copiedKey === 'ip' ? 'Copied' : 'Copy IP'}</span>
                          </button>
                        </td>
                      </tr>

                      {/* CNAME Record for WWW */}
                      <tr className="hover:bg-[#181820]">
                        <td className="p-3 text-blue-400 font-bold">CNAME</td>
                        <td className="p-3 text-white">www</td>
                        <td className="p-3 text-amber-300 font-bold">cname.vercel-dns.com</td>
                        <td className="p-3 text-[#71717a]">1 Hour (3600)</td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => copyToClipboard('cname.vercel-dns.com', 'cname')}
                            className="inline-flex items-center gap-1 bg-[#22222c] hover:bg-[#2e2e3c] text-white px-2.5 py-1 rounded text-[11px]"
                          >
                            {copiedKey === 'cname' ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                            <span>{copiedKey === 'cname' ? 'Copied' : 'Copy CNAME'}</span>
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Live DNS Checker */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border border-[#272730] bg-[#121216] rounded">
                <div>
                  <div className="font-semibold text-white text-xs">Verify DNS Propagation Worldwide</div>
                  <div className="text-[11px] text-[#a1a1aa]">
                    Test if Wix has broadcasted your domain records to international DNS nodes.
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={`https://www.whatsmydns.net/#A/${rootDomain}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 border border-[#3f3f4c] bg-[#1c1c24] hover:bg-[#282834] text-white px-3 py-1.5 rounded text-xs transition-colors"
                  >
                    <span>Check on WhatsMyDNS</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                  <a
                    href={`https://dnschecker.org/#A/${rootDomain}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 border border-[#3f3f4c] bg-[#1c1c24] hover:bg-[#282834] text-white px-3 py-1.5 rounded text-xs transition-colors"
                  >
                    <span>DNSChecker</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CLOUDFLARE NAMESERVERS */}
          {activeTab === 'cloudflare_ns' && (
            <div className="space-y-6">
              <div className="bg-[#141419] border border-[#272730] p-4 rounded text-xs space-y-2">
                <div className="flex items-center gap-2 text-white font-medium">
                  <Sparkles className="h-4 w-4 text-amber-400" />
                  <span>Why Cloudflare Nameservers is the Best Route for 3D & Video Portfolios</span>
                </div>
                <p className="text-[#a1a1aa] leading-relaxed">
                  Elle Kay’s portfolio features heavy 4K architectural video loops, 8K CGI renders, and interactive lightboxes. Switching your Wix nameservers to Cloudflare (100% Free) gives you instant global edge caching across 330+ data centers, automatic free SSL, and zero bandwidth bottlenecks.
                </p>
              </div>

              <div className="space-y-4">
                <div className="border border-[#272730] bg-[#121216] p-4 rounded space-y-3">
                  <h4 className="text-xs font-semibold text-white flex items-center gap-2">
                    <span className="h-5 w-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-mono text-[11px]">
                      1
                    </span>
                    <span>Sign up for Free Cloudflare Account</span>
                  </h4>
                  <p className="text-xs text-[#a1a1aa]">
                    Go to <strong className="text-white">dash.cloudflare.com</strong> &gt; Click <strong className="text-white">&quot;Add a domain&quot;</strong> &gt; Enter <code className="text-amber-300 font-mono">{rootDomain}</code> &gt; Select the <strong>Free Plan</strong>.
                  </p>
                </div>

                <div className="border border-[#272730] bg-[#121216] p-4 rounded space-y-3">
                  <h4 className="text-xs font-semibold text-white flex items-center gap-2">
                    <span className="h-5 w-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-mono text-[11px]">
                      2
                    </span>
                    <span>Change Nameservers in Wix</span>
                  </h4>
                  <p className="text-xs text-[#a1a1aa] leading-relaxed">
                    In your Wix Account &gt; <strong className="text-white">Domains</strong> &gt; Click the <strong>•••</strong> icon next to <code className="text-amber-300 font-mono">{rootDomain}</code> &gt; Choose <strong className="text-white">Manage Nameservers</strong>.
                  </p>
                  <div className="bg-[#181820] p-3 rounded border border-[#2e2e3a] text-xs space-y-2">
                    <p className="text-[#d4d4d8]">
                      Change from <em className="text-neutral-400">&quot;Wix Nameservers&quot;</em> to <strong className="text-emerald-400">&quot;Custom Nameservers&quot;</strong> and paste the two nameservers Cloudflare provides:
                    </p>
                    <div className="font-mono text-emerald-300 text-xs bg-[#0f0f14] p-2.5 rounded border border-[#262630] space-y-1">
                      <div>ns1: [your-assigned-name].ns.cloudflare.com</div>
                      <div>ns2: [your-assigned-name].ns.cloudflare.com</div>
                    </div>
                  </div>
                </div>

                <div className="border border-[#272730] bg-[#121216] p-4 rounded space-y-3">
                  <h4 className="text-xs font-semibold text-white flex items-center gap-2">
                    <span className="h-5 w-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-mono text-[11px]">
                      3
                    </span>
                    <span>Automatic SSL &amp; High Speed Delivery</span>
                  </h4>
                  <p className="text-xs text-[#a1a1aa] leading-relaxed">
                    Cloudflare immediately provisions an enterprise-grade SSL certificate (green padlock HTTPS) and activates edge asset caching for all your interior and architectural renders worldwide.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: FREE 1-CLICK HOSTING SETUP */}
          {activeTab === 'deploy_steps' && (
            <div className="space-y-6">
              <div className="bg-[#141419] border border-[#272730] p-4 rounded text-xs space-y-2">
                <div className="flex items-center gap-2 text-white font-medium">
                  <Layers className="h-4 w-4 text-blue-400" />
                  <span>Deploying this Vite Portfolio to Production (Free &amp; Instant)</span>
                </div>
                <p className="text-[#a1a1aa] leading-relaxed">
                  This website is built with modern React + Vite + Tailwind CSS. Connecting your Wix domain takes only 2 minutes using Vercel, Netlify, or Cloudflare Pages.
                </p>
              </div>

              <div className="space-y-3">
                <div className="border border-[#272730] bg-[#121216] p-4 rounded space-y-2">
                  <div className="font-semibold text-white text-xs flex items-center gap-2">
                    <span className="h-5 w-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-mono text-[11px]">
                      A
                    </span>
                    <span>Option 1: Deploy with Vercel (Easiest)</span>
                  </div>
                  <ol className="list-decimal list-inside text-xs text-[#a1a1aa] space-y-1.5 leading-relaxed pl-1">
                    <li>Push your code to GitHub (or export files from AI Studio).</li>
                    <li>Go to <strong className="text-white">vercel.com</strong> &gt; &quot;Add New Project&quot; &gt; Select your repo.</li>
                    <li>Preset will automatically detect <strong>Vite</strong>. Click <strong>Deploy</strong>.</li>
                    <li>In Project Settings &gt; <strong>Domains</strong>, type <code className="text-emerald-300 font-mono">{rootDomain}</code> and <code className="text-emerald-300 font-mono">{wwwDomain}</code>.</li>
                    <li>Vercel confirms the DNS records, which match the records in Tab 1!</li>
                  </ol>
                </div>

                <div className="border border-[#272730] bg-[#121216] p-4 rounded space-y-2">
                  <div className="font-semibold text-white text-xs flex items-center gap-2">
                    <span className="h-5 w-5 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center font-mono text-[11px]">
                      B
                    </span>
                    <span>Option 2: Cloudflare Pages</span>
                  </div>
                  <ol className="list-decimal list-inside text-xs text-[#a1a1aa] space-y-1.5 leading-relaxed pl-1">
                    <li>Go to <strong className="text-white">dash.cloudflare.com</strong> &gt; Workers &amp; Pages &gt; Create application &gt; Pages.</li>
                    <li>Connect Git &gt; Build command: <code className="text-amber-300 font-mono">npm run build</code> &gt; Output directory: <code className="text-amber-300 font-mono">dist</code>.</li>
                    <li>Go to Custom Domains &gt; Add <code className="text-emerald-300 font-mono">{rootDomain}</code>.</li>
                  </ol>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: WIX FAQ & TROUBLESHOOTING */}
          {activeTab === 'troubleshooting' && (
            <div className="space-y-4">
              <div className="border border-[#272730] bg-[#121216] p-4 rounded space-y-2">
                <h4 className="text-xs font-semibold text-white flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-purple-400" />
                  <span>Do I need to pay for a Wix Premium Site plan to use my domain?</span>
                </h4>
                <p className="text-xs text-[#a1a1aa] leading-relaxed">
                  <strong>No!</strong> Wix only charges for a website plan if you build your site with Wix&apos;s drag-and-drop website editor. Because you bought the domain, you own it, and Wix provides DNS management for free. You can point it anywhere without paying Wix extra.
                </p>
              </div>

              <div className="border border-[#272730] bg-[#121216] p-4 rounded space-y-2">
                <h4 className="text-xs font-semibold text-white flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-purple-400" />
                  <span>Why isn&apos;t my website loading immediately after updating Wix DNS?</span>
                </h4>
                <p className="text-xs text-[#a1a1aa] leading-relaxed">
                  Domain Name System (DNS) records need time to replicate across internet service providers (ISPs) worldwide. While it often takes 15 to 30 minutes, full global propagation can take up to 24–48 hours. You can track real-time progress using WhatsMyDNS.net.
                </p>
              </div>

              <div className="border border-[#272730] bg-[#121216] p-4 rounded space-y-2">
                <h4 className="text-xs font-semibold text-white flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-purple-400" />
                  <span>Will HTTPS / SSL work automatically?</span>
                </h4>
                <p className="text-xs text-[#a1a1aa] leading-relaxed">
                  Yes! Both Vercel and Cloudflare automatically request and renew a free Let&apos;s Encrypt / Cloudflare SSL certificate as soon as they detect that your Wix DNS records are pointing to them. You don&apos;t have to buy an SSL certificate.
                </p>
              </div>

              <div className="border border-[#272730] bg-[#121216] p-4 rounded space-y-2">
                <h4 className="text-xs font-semibold text-white flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-purple-400" />
                  <span>Should I point www or the root domain?</span>
                </h4>
                <p className="text-xs text-[#a1a1aa] leading-relaxed">
                  Point both! Set an <strong>A record</strong> for <code className="text-emerald-300 font-mono">@</code> (root: {rootDomain}) and a <strong>CNAME record</strong> for <code className="text-emerald-300 font-mono">www</code> ({wwwDomain}). This ensures visitors who type either address land seamlessly on your portfolio.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="border-t border-[#27272a] bg-[#121215] px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-[#71717a]">
            <span>Current target:</span>
            <span className="font-mono text-emerald-400 font-medium">https://{rootDomain}</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-[#2e2e38] text-xs text-[#a1a1aa] hover:text-white rounded transition-colors"
            >
              Close
            </button>
            <a
              href="https://manage.wix.com/dashboard/domains"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-white text-black hover:bg-neutral-200 px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded transition-colors"
            >
              <span>Open Wix Domain Manager</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
