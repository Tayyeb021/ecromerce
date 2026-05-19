/**
 *
 * NavigationMenu
 *
 */

import React from 'react';
import { Link } from 'react-router-dom';

import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { Container } from 'reactstrap';

import actions from '../../actions';

import Button from '../../components/Common/Button';
import { CloseIcon } from '../../components/Common/Icon';

class NavigationMenu extends React.PureComponent {
  getCategoryIcon = (categoryName) => {
    const name = categoryName.toLowerCase();
    // All icons are Font Awesome 4.7 compatible
    const iconMap = [
      ['home',        'fa-home'],
      ['electron',    'fa-laptop'],
      ['cloth',       'fa-shopping-bag'],
      ['shirt',       'fa-shopping-bag'],
      ['fashion',     'fa-shopping-bag'],
      ['shoe',        'fa-tag'],
      ['footwear',    'fa-tag'],
      ['accessori',   'fa-diamond'],
      ['jewel',       'fa-diamond'],
      ['book',        'fa-book'],
      ['kitchen',     'fa-cutlery'],
      ['food',        'fa-cutlery'],
      ['sport',       'fa-futbol-o'],
      ['game',        'fa-gamepad'],
      ['toy',         'fa-puzzle-piece'],
      ['beauty',      'fa-leaf'],
      ['health',      'fa-heartbeat'],
      ['furniture',   'fa-bed'],
      ['mobile',      'fa-mobile'],
      ['phone',       'fa-mobile'],
      ['computer',    'fa-desktop'],
      ['laptop',      'fa-laptop'],
      ['watch',       'fa-clock-o'],
      ['bag',         'fa-shopping-bag'],
      ['automat',     'fa-car'],
      ['car',         'fa-car'],
      ['music',       'fa-music'],
      ['pet',         'fa-paw'],
      ['garden',      'fa-leaf'],
      ['plant',       'fa-leaf'],
      ['drink',       'fa-glass'],
      ['movie',       'fa-film'],
      ['film',        'fa-film'],
      ['video',       'fa-film'],
      ['industri',    'fa-industry'],
      ['tool',        'fa-wrench'],
      ['hardware',    'fa-wrench'],
      ['office',      'fa-briefcase'],
      ['stationer',   'fa-pencil'],
      ['gift',        'fa-gift'],
      ['toy',         'fa-puzzle-piece'],
      ['baby',        'fa-child'],
      ['kids',        'fa-child'],
      ['travel',      'fa-plane'],
      ['luggage',     'fa-suitcase'],
    ];

    for (const [key, icon] of iconMap) {
      if (name.includes(key)) return icon;
    }
    // Fallback: use first letter color-coded circle via CSS
    return 'fa-tag';
  };

  render() {
    const { isMenuOpen, categories, toggleMenu } = this.props;

    const handleCategoryClick = () => {
      // Only close menu on mobile
      if (window.innerWidth < 768) {
        this.props.toggleMenu();
      }
    };

    // Sort categories to put "Home" first
    const sortedCategories = categories ? [...categories].sort((a, b) => {
      const aName = a.name.toLowerCase();
      const bName = b.name.toLowerCase();
      
      // If one is "home", it should come first
      if (aName === 'home' || aName.includes('home')) return -1;
      if (bName === 'home' || bName.includes('home')) return 1;
      
      // Otherwise maintain original order
      return 0;
    }) : [];

    return (
      <div className='navigation-menu'>
        <div className='menu-header d-md-none'>
          {isMenuOpen && (
            <Button
              borderless
              variant='empty'
              ariaLabel='close the menu'
              icon={<CloseIcon />}
              onClick={toggleMenu}
            />
          )}
        </div>
        <div className='menu-body'>
          <Container className='px-0'>
            <h3 className='menu-title text-uppercase'>
              <i className='fa fa-th-large' />
              <span>Shop By Category</span>
            </h3>
            <nav role='navigation'>
              <ul className='menu-list'>
                {sortedCategories.map((link, index) => (
                  <li key={index} className='menu-item'>
                    <NavLink
                      onClick={handleCategoryClick}
                      to={'/shop/category/' + link.slug}
                      activeClassName='active-link'
                      exact
                    >
                      <i className={`fa ${link.icon || this.getCategoryIcon(link.name)}`} />
                      <span>{link.name}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>
          </Container>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    isMenuOpen: state.navigation.isMenuOpen,
    categories: state.category.storeCategories
  };
};

export default connect(mapStateToProps, actions)(NavigationMenu);
