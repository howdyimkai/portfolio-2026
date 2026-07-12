import Link from 'next/link';

export default function Navigation() {
  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Works', href: '/works' },
    { label: 'Recent Play', href: '/play' },
    { label: 'About', href: '/about' },
    { label: 'Resume', href: '/resume' }
  ];

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1.5rem 3rem',
      maxWidth: '1400px',
      margin: '0 auto'
    }}>
      {/* Logo/Icon on the left */}
      <Link href="/" style={{ textDecoration: 'none' }}>
        <div style={{ fontSize: '32px' }}>🤠</div>
      </Link>

      {/* Navigation links on the right */}
      <div style={{
        display: 'flex',
        gap: '2rem',
        alignItems: 'center'
      }}>
        {navItems.map((item) => (
          <Link 
            key={item.href} 
            href={item.href}
            style={{
              fontSize: '16px',
              color: '#4a4a4a',
              textDecoration: 'none',
              transition: 'color 0.3s ease'
            }}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
