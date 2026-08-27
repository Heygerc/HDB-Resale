import React, { useEffect, useState } from 'react';

interface DisqusThreadProps {
  identifier: string;
  title: string;
  url?: string;
  category?: string;
  className?: string;
  compact?: boolean;
}

declare global {
  interface Window {
    DISQUS?: {
      reset: (args: {
        reload: boolean;
        config: (this: {
          page: {
            identifier?: string;
            url?: string;
            title?: string;
          };
        }) => void;
      }) => void;
    };
    disqus_config?: () => void;
    disqus_shortname?: string;
  }
}

export const DisqusThread: React.FC<DisqusThreadProps> = ({
  identifier,
  title,
  url,
  category = 'Singapore HDB & Property Discussion',
  className = '',
  compact = false,
}) => {
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    // Current page URL fallback
    const canonicalUrl = url || window.location.href.split('#')[0];
    const pageIdentifier = identifier || 'proptrust-hdb-main';

    window.disqus_shortname = 'gtest-1';
    window.disqus_config = function (this: {
      page: {
        identifier?: string;
        url?: string;
        title?: string;
      };
    }) {
      this.page.url = canonicalUrl;
      this.page.identifier = pageIdentifier;
      this.page.title = title || 'PropTrust HDB Forum';
    };

    // If DISQUS is already loaded on the page, reset it with the new configuration
    if (typeof window.DISQUS !== 'undefined') {
      try {
        window.DISQUS.reset({
          reload: true,
          config: function (this: {
            page: {
              identifier?: string;
              url?: string;
              title?: string;
            };
          }) {
            this.page.identifier = pageIdentifier;
            this.page.url = canonicalUrl;
            this.page.title = title || 'PropTrust HDB Forum';
          },
        });
        setIsLoaded(true);
      } catch (err) {
        console.warn('DISQUS reset error:', err);
      }
    } else {
      // Check if script element already exists
      const existingScript = document.getElementById('dsq-embed-scr');
      if (!existingScript) {
        const d = document;
        const s = d.createElement('script');
        s.id = 'dsq-embed-scr';
        s.src = 'https://gtest-1.disqus.com/embed.js';
        s.setAttribute('data-timestamp', String(+new Date()));
        s.async = true;
        s.onload = () => {
          setIsLoaded(true);
        };
        s.onerror = () => {
          setLoadError('Disqus comments failed to load. Check your network or privacy blocker settings.');
        };
        (d.head || d.body).appendChild(s);
      }
    }
  }, [identifier, title, url]);

  return (
    <div
      id={`disqus-container-${identifier}`}
      className={`bg-surface-container-lowest rounded-2xl border border-surface-variant shadow-xs overflow-hidden ${className}`}
    >
      {!compact && (
        <div className="p-5 bg-surface-container-low/80 border-b border-outline-variant/20 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[20px]">forum</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-headline-lg text-title-sm sm:text-title-md font-bold text-on-surface">
                  {title}
                </h3>
                <span className="bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                  Disqus
                </span>
              </div>
              <p className="text-xs text-on-surface-variant">
                {category} • Verified Community & Consultant Thread
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-on-surface-variant">
            <span className="inline-flex items-center gap-1 bg-surface px-2.5 py-1 rounded-md border border-outline-variant/30 font-mono text-[11px]">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span>Live Comments</span>
            </span>
            <a
              href="https://disqus.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-on-surface-variant hover:text-primary transition-colors flex items-center gap-0.5 text-[11px]"
            >
              <span>Powered by Disqus</span>
              <span className="material-symbols-outlined text-[13px]">open_in_new</span>
            </a>
          </div>
        </div>
      )}

      <div className="p-6">
        {loadError ? (
          <div className="p-4 bg-error-container/20 border border-error/30 rounded-xl text-error text-xs">
            <div className="font-semibold flex items-center gap-1.5 mb-1">
              <span className="material-symbols-outlined text-[18px]">warning</span>
              <span>Unable to load Disqus comment feed</span>
            </div>
            <p>{loadError}</p>
          </div>
        ) : null}

        {/* Disqus Core Embed Container */}
        <div id="disqus_thread" className="min-h-[220px]"></div>

        <noscript>
          <div className="p-4 bg-surface-container rounded-xl text-center text-xs text-on-surface-variant mt-3">
            Please enable JavaScript to view the{' '}
            <a
              href="https://disqus.com/?ref_noscript"
              className="text-primary underline font-medium"
              target="_blank"
              rel="noopener noreferrer"
            >
              comments powered by Disqus.
            </a>
          </div>
        </noscript>
      </div>
    </div>
  );
};
