import './hero-figma-code.css'

export default function HeroFigmaCode() {
  return (
    <div className="hfigma">
      {/* Browser chrome */}
      <div className="hfigma-chrome">
        <div className="hfigma-dots">
          <span className="hfigma-dot hfigma-dot-r" />
          <span className="hfigma-dot hfigma-dot-y" />
          <span className="hfigma-dot hfigma-dot-g" />
        </div>

        <div className="hfigma-tabs">
          <span className="hfigma-favicon" />
          <span className="hfigma-url">figma.com/file/design-comp</span>

          <svg className="hfigma-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M4 12h15" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
            <path d="M13 6l6 6-6 6" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>

          <span className="hfigma-tab-blue">localhost:3000</span>
        </div>

        <div className="hfigma-badge-build">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M5 12.5l4.5 4.5L19 7" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Build complete
        </div>
      </div>

      {/* Split content */}
      <div className="hfigma-body">
        {/* LEFT: Figma design */}
        <div className="hfigma-panel hfigma-left">
          <div className="hfigma-panel-label hfigma-label-figma">Figma</div>

          {/* Layer tree */}
          <div className="hfigma-tree">
            <div className="hfigma-tree-row" style={{ paddingLeft: '8px' }}>
              <svg className="hfigma-tri hfigma-tri-open" width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
                <path d="M2 3l3 4 3-4z" fill="#94A3B8" />
              </svg>
              Hero Section
            </div>
            <div className="hfigma-tree-row" style={{ paddingLeft: '22px' }}>
              <svg className="hfigma-tri hfigma-tri-open" width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
                <path d="M2 3l3 4 3-4z" fill="#94A3B8" />
              </svg>
              Container
            </div>
            <div className="hfigma-tree-row" style={{ paddingLeft: '36px' }}>
              <svg className="hfigma-tri" width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
                <path d="M3 2l4 3-4 3z" fill="#CBD5E1" />
              </svg>
              H1 Text
            </div>
            <div className="hfigma-tree-row" style={{ paddingLeft: '36px' }}>
              <svg className="hfigma-tri" width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
                <path d="M3 2l4 3-4 3z" fill="#CBD5E1" />
              </svg>
              Subheading
            </div>
            <div className="hfigma-tree-row" style={{ paddingLeft: '36px' }}>
              <svg className="hfigma-tri" width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
                <path d="M3 2l4 3-4 3z" fill="#CBD5E1" />
              </svg>
              CTA Button
            </div>
            <div className="hfigma-tree-row" style={{ paddingLeft: '36px' }}>
              <svg className="hfigma-tri" width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
                <path d="M3 2l4 3-4 3z" fill="#CBD5E1" />
              </svg>
              Badge Row
            </div>
          </div>

          {/* Design properties */}
          <div className="hfigma-props">
            <div className="hfigma-prop">
              <span className="hfigma-prop-key">Fill</span>
              <span className="hfigma-prop-val">
                <span className="hfigma-swatch" style={{ background: '#EFF6FF' }} />
                #EFF6FF
              </span>
            </div>
            <div className="hfigma-prop">
              <span className="hfigma-prop-key">Font</span>
              <span className="hfigma-prop-val">Inter / Bold / 56px</span>
            </div>
            <div className="hfigma-prop">
              <span className="hfigma-prop-key">Color</span>
              <span className="hfigma-prop-val">
                <span className="hfigma-swatch" style={{ background: '#0F172A' }} />
                #0F172A
              </span>
            </div>
            <div className="hfigma-prop">
              <span className="hfigma-prop-key">Radius</span>
              <span className="hfigma-prop-val">50px (button)</span>
            </div>
            <div className="hfigma-prop">
              <span className="hfigma-prop-key">Padding</span>
              <span className="hfigma-prop-val">96px 24px</span>
            </div>
          </div>

          {/* Wireframe */}
          <div className="hfigma-wire">
            <div className="hfigma-wire-bar" />
            <div className="hfigma-wire-text" />
            <div className="hfigma-wire-btns">
              <div className="hfigma-wire-btn" />
              <div className="hfigma-wire-btn" />
            </div>
            <div className="hfigma-wire-badges">
              <div className="hfigma-wire-pill" />
              <div className="hfigma-wire-pill" />
              <div className="hfigma-wire-pill" />
            </div>
          </div>
        </div>

        {/* CENTER DIVIDER swap icon */}
        <div className="hfigma-divider-swap" aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M7 4L3 8l4 4" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M3 8h13" stroke="#64748B" strokeWidth="2" strokeLinecap="round" />
            <path d="M17 20l4-4-4-4" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M21 16H8" stroke="#64748B" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>

        {/* RIGHT: Live render */}
        <div className="hfigma-panel hfigma-right">
          <div className="hfigma-panel-label hfigma-label-live">Live</div>

          <div className="hfigma-render">
            <div className="hfigma-render-h1">Your Hero Headline</div>
            <div className="hfigma-render-sub" />
            <div className="hfigma-render-btns">
              <span className="hfigma-render-btn hfigma-render-btn-fill">Get Started</span>
              <span className="hfigma-render-btn hfigma-render-btn-outline">Learn More</span>
            </div>
            <div className="hfigma-render-badges">
              <span className="hfigma-render-pill" />
              <span className="hfigma-render-pill" />
              <span className="hfigma-render-pill" />
            </div>
          </div>

          <div className="hfigma-render-stat">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M5 12.5l4.5 4.5L19 7" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Responsive &middot; 3 breakpoints &middot; 98 Lighthouse score
          </div>
        </div>
      </div>

      {/* Footer bar */}
      <div className="hfigma-footer">
        <span className="hfigma-foot-left">figma.com/design</span>
        <span className="hfigma-foot-center">Built with Claude Code + Cursor</span>
        <span className="hfigma-foot-right">
          Deployed to Vercel
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M5 12.5l4.5 4.5L19 7" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    </div>
  )
}
