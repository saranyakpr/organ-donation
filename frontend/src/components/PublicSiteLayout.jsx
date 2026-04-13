import { NavLink } from 'react-router-dom'

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'About Us', to: '/about-us' },
  { label: 'Contact', to: '/contact' },
  { label: 'Awareness', to: '/awareness' },
  { label: 'Pledge', to: '/pledge' },
]

const PublicSiteLayout = ({ children }) => (
  <div className='public-site'>
    <header className='public-header'>
      <div className='public-container'>
        <nav className='public-nav'>
          <NavLink to='/' className='public-logo-link'>
            <img
              className='public-logo'
              src='/reference-logo.svg'
              alt='Organ Donation Platform'
            />
          </NavLink>
          <ul className='public-nav-list'>
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) => `public-nav-link${isActive ? ' active' : ''}`}
                  end={item.to === '/'}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
            <li>
              <NavLink to='/login' className='public-login-button'>
                Login
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>

    <main className='public-main'>{children}</main>

    <footer className='public-footer'>
      <div className='public-container'>
        <div className='public-footer-inner'>
          <div className='public-footer-logo'>
            <img src='/reference-logo-white.svg' alt='Organ Donation Platform' />
          </div>
          <div className='public-copyright'>
            <p>Copyright © 2022 Organ Donation Platform - All rights reserved</p>
          </div>
        </div>
      </div>
    </footer>
  </div>
)

export default PublicSiteLayout
