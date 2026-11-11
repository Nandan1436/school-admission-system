import { useState } from "react";
import { NavLink } from "react-router-dom";
import { ClipboardList, GraduationCap, LayoutGrid, Menu, Moon, PlusSquare, Sun, X } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import styles from "./Layout.module.css";

const NAV_LINKS = [
  { to: "/", label: "Classes", icon: LayoutGrid, end: true },
  { to: "/my-applications", label: "My applications", icon: ClipboardList, end: false },
  { to: "/classes/new", label: "Create class", icon: PlusSquare, end: false },
];

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <>
      {NAV_LINKS.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          onClick={onNavigate}
          className={({ isActive }) => (isActive ? styles.linkActive : styles.link)}
        >
          <Icon />
          {label}
        </NavLink>
      ))}
    </>
  );
}

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className={styles.navbar}>
      <div className={styles.navInner}>
        <NavLink to="/" className={styles.brand} onClick={() => setIsMenuOpen(false)}>
          <span className={styles.logo}>
            <GraduationCap />
          </span>
          <span className={styles.wordmark}>School Admission</span>
        </NavLink>
        <nav className={styles.links} aria-label="Main">
          <NavLinks />
        </nav>
        <div className={styles.navActions}>
          <button type="button" className={styles.iconButton} onClick={toggleTheme} aria-label="Toggle theme">
            {theme === "dark" ? <Sun /> : <Moon />}
          </button>
          <button
            type="button"
            className={styles.menuButton}
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      {isMenuOpen && (
        <nav className={styles.mobilePanel} aria-label="Mobile">
          <NavLinks onNavigate={() => setIsMenuOpen(false)} />
        </nav>
      )}
    </header>
  );
}
