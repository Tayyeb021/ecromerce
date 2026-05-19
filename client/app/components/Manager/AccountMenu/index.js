/**
 *
 * AccountMenu
 *
 */

import React from 'react';

import { NavLink } from 'react-router-dom';
import { Collapse, Navbar } from 'reactstrap';

import Button from '../../Common/Button';

const AccountMenu = props => {
  const { user, isMenuOpen, links, toggleMenu } = props;

  const roleLabel = (() => {
    const role = user?.role || '';
    if (role === 'ROLE ADMIN') return 'Admin';
    if (role === 'ROLE MERCHANT') return 'Merchant';
    return 'Account';
  })();

  const displayName = [user?.firstName, user?.lastName].filter(Boolean).join(' ') || user?.email || roleLabel;
  const avatarLetter = (user?.firstName || user?.email || roleLabel).charAt(0).toUpperCase();

  const getAllowedProvider = link => {
    if (!link.provider) return true;
    const userProvider = user?.provider ?? '';
    if (!userProvider) return true;
    return link.provider.includes(userProvider);
  };

  return (
    <div className='panel-sidebar'>
      <Button
        text={`${roleLabel} Menu`}
        className={`${isMenuOpen ? 'menu-panel' : 'menu-panel collapse'}`}
        ariaExpanded={isMenuOpen ? 'true' : 'false'}
        onClick={toggleMenu}
      />

      {/* User profile header */}
      <div className='sidebar-profile'>
        <div className='sidebar-avatar'>{avatarLetter}</div>
        <div className='sidebar-user-info'>
          <span className='sidebar-user-name'>{displayName}</span>
          <span className='sidebar-user-role'>{roleLabel}</span>
        </div>
      </div>

      <Navbar color='light' light expand='md'>
        <Collapse isOpen={isMenuOpen} navbar>
          <ul className='panel-links'>
            {links.map((link, index) => {
              if (link.divider) {
                return (
                  <li key={`divider-${index}`} className='panel-links__section'>
                    <span className='panel-links__section-title'>{link.sectionTitle}</span>
                  </li>
                );
              }

              const PREFIX = link.prefix ? link.prefix : '';
              if (!getAllowedProvider(link)) return null;

              return (
                <li key={index}>
                  <NavLink to={PREFIX + link.to} activeClassName='active-link' exact>
                    {link.icon && <i className={`fa ${link.icon} nav-icon`} />}
                    <span>{link.name}</span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </Collapse>
      </Navbar>
    </div>
  );
};

export default AccountMenu;
