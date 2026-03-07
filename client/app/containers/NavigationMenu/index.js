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
    const iconMap = {
      electronics: 'fa-laptop',
      clothing: 'fa-tshirt',
      shoes: 'fa-shoe-prints',
      accessories: 'fa-gem',
      books: 'fa-book',
      home: 'fa-home',
      kitchen: 'fa-utensils',
      sports: 'fa-futbol',
      beauty: 'fa-spa',
      toys: 'fa-puzzle-piece',
      furniture: 'fa-couch',
      mobile: 'fa-mobile-alt',
      computer: 'fa-desktop',
      watch: 'fa-clock',
      bag: 'fa-shopping-bag',
      jewelry: 'fa-ring',
      health: 'fa-heartbeat',
      automotive: 'fa-car',
      music: 'fa-music',
      pet: 'fa-paw',
      garden: 'fa-seedling',
      food: 'fa-hamburger',
      drink: 'fa-wine-glass',
      default: 'fa-folder-open'
    };

    for (const [key, icon] of Object.entries(iconMap)) {
      if (name.includes(key)) {
        return icon;
      }
    }
    return iconMap.default;
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
        <div className='menu-logo'>
          <Link to='/' className='menu-logo-link'>
            <div className='menu-logo-wrapper'>
              <img src='/images/logo.svg' alt='A-Z On-Buz' className='menu-logo-img' />
            </div>
          </Link>
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
                      <i className={`fa ${this.getCategoryIcon(link.name)}`} />
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
