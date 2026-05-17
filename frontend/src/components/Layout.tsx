import { Outlet, NavLink } from 'react-router-dom'
import { BookOpen, Heart, Library, Settings, Layers, Sun, Moon } from 'lucide-react'
import { useTheme } from '../hooks/useTheme'

const navItems = [
  { to: '/library',    icon: Library,   label: 'Library'    },
  { to: '/favourites', icon: Heart,     label: 'Favourites' },
  { to: '/projects',   icon: Layers,    label: 'Projects'   },
  { to: '/settings',   icon: Settings,  label: 'Settings'   },
]

export default function Layout() {
  const { isDark, toggle } = useTheme()

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--color-cream)' }}>

      {/* ── Sidebar ──────────────────────────────────────── */}
      <aside style={{
        width: '220px',
        flexShrink: 0,
        background: 'var(--color-warm-white)',
        borderRight: '1px solid var(--color-border)',
        display: 'flex',
        flexDirection: 'column',
        padding: '32px 0',
        position: 'sticky',
        top: 0,
        height: '100vh',
      }}>

        {/* Logo */}
        <div style={{ padding: '0 24px 32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: 36, height: 36,
              background: 'var(--color-terracotta)',
              borderRadius: 'var(--radius-md)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <BookOpen size={18} color="white" strokeWidth={2} />
            </div>
            <div>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1rem',
                fontWeight: 700,
                color: 'var(--color-ink)',
                lineHeight: 1,
              }}>
                HobbyHeaven
              </div>
              <div style={{ fontSize: '0.65rem', color: 'var(--color-muted)', marginTop: 2 }}>
                Pattern Library
              </div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '0 12px' }}>
          <div style={{ fontSize: '0.65rem', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-muted)', padding: '0 12px 8px' }}>
            Navigation
          </div>
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 12px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.875rem',
                fontWeight: isActive ? 500 : 400,
                color: isActive ? 'var(--color-terracotta)' : 'var(--color-ink-soft)',
                background: isActive ? 'rgba(193, 96, 42, 0.08)' : 'transparent',
                marginBottom: 2,
                transition: 'all 0.15s ease',
                textDecoration: 'none',
              })}
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Theme toggle + version */}
        <div style={{ padding: '0 16px 0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--color-muted)' }}>v0.1.0</span>
          <button
            onClick={toggle}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            style={{
              background: 'var(--color-parchment)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: '6px 8px',
              cursor: 'pointer',
              color: 'var(--color-muted)',
              display: 'flex',
              alignItems: 'center',
              transition: 'all 0.2s ease',
            }}
          >
            {isDark ? <Sun size={14} /> : <Moon size={14} />}
          </button>
        </div>
      </aside>

      {/* ── Main Content ─────────────────────────────────── */}
      <main style={{ flex: 1, overflow: 'auto' }}>
        <div className="page-enter">
          <Outlet />
        </div>
      </main>

    </div>
  )
}
