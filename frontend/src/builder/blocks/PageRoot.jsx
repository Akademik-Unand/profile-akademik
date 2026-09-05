import { pageChromePreview } from '../../helpers/pageChrome';
import { showEditorChrome } from '../../helpers/builderChrome';
import { BG_CLASS } from '../tokens';

/**
 * Akar kanvas: latar halaman plus pratinjau hero/sidebar.
 */
export function PageRoot({ children, background, chrome, sidebar, showHero, puck }) {
  const editing = showEditorChrome(puck);
  const preview = pageChromePreview({ chrome, sidebar, showHero });
  const tone = BG_CLASS[background] || BG_CLASS.base;

  return (
    <div className={`builder-page-root flex min-h-full flex-col ${tone}`}>
      {editing && preview.showHeroBar ? <div className="builder-page-hero-hint">Hero judul halaman</div> : null}
      {editing && preview.showSidebar ? (
        <div className="builder-page-shell">
          <div className="flex min-h-0 flex-1 flex-col">{children}</div>
          <aside className="builder-page-sidebar-hint">Sidebar menu — di situs publik ini jadi menu terkait</aside>
        </div>
      ) : (
        <div className="flex min-h-0 flex-1 flex-col">{children}</div>
      )}
    </div>
  );
}
