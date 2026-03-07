/**
 *
 * Navigation
 *
 */

import React from 'react';

import { connect } from 'react-redux';
import { Link, NavLink as ActiveLink, withRouter } from 'react-router-dom';
import Autosuggest from 'react-autosuggest';
import AutosuggestHighlightMatch from 'autosuggest-highlight/match';
import AutosuggestHighlightParse from 'autosuggest-highlight/parse';
import {
  Container,
  Row,
  Col,
  Navbar,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';

import actions from '../../actions';

import Button from '../../components/Common/Button';
import { getImageUrl } from '../../utils/image';
import CartIcon from '../../components/Common/CartIcon';
import { BarsIcon } from '../../components/Common/Icon';
import MiniBrand from '../../components/Store//MiniBrand';
import Menu from '../NavigationMenu';
import Cart from '../Cart';

class Navigation extends React.PureComponent {
  componentDidMount() {
    this.props.fetchStoreBrands();
    this.props.fetchStoreCategories();
  }

  toggleBrand() {
    this.props.fetchStoreBrands();
    this.props.toggleBrand();
  }

  toggleMenu() {
    this.props.fetchStoreCategories();
    this.props.toggleMenu();
  }

  getSuggestionValue(suggestion) {
    return suggestion.name;
  }

  renderSuggestion(suggestion, { query, isHighlighted }) {
    const BoldName = (suggestion, query) => {
      const matches = AutosuggestHighlightMatch(suggestion.name, query);
      const parts = AutosuggestHighlightParse(suggestion.name, matches);

      return (
        <div>
          {parts.map((part, index) => {
            const className = part.highlight
              ? 'react-autosuggest__suggestion-match'
              : null;
            return (
              <span className={className} key={index}>
                {part.text}
              </span>
            );
          })}
        </div>
      );
    };

    return (
      <Link to={`/product/${suggestion.slug}`}>
        <div className='d-flex'>
          <img
            className='item-image'
            src={getImageUrl(suggestion.imageUrl)}
          />
          <div>
            <Container>
              <Row>
                <Col>
                  <span className='name'>{BoldName(suggestion, query)}</span>
                </Col>
              </Row>
              <Row>
                <Col>
                  <span className='price'>PKR {suggestion.price}</span>
                </Col>
              </Row>
            </Container>
          </div>
        </div>
      </Link>
    );
  }

  render() {
    const {
      history,
      authenticated,
      user,
      cartItems,
      brands,
      categories,
      signOut,
      isMenuOpen,
      isCartOpen,
      isBrandOpen,
      toggleCart,
      toggleMenu,
      searchValue,
      suggestions,
      onSearch,
      onSuggestionsFetchRequested,
      onSuggestionsClearRequested
    } = this.props;

    const inputProps = {
      placeholder: 'Search Products...',
      value: searchValue || '',
      onChange: (_, { newValue }) => {
        onSearch(newValue);
      },
      onFocus: () => {
        // Trigger search if there's already a value
        if (searchValue && searchValue.length >= 2) {
          onSuggestionsFetchRequested({ value: searchValue });
        }
      }
    };

    return (
      <header className='header fixed-mobile-header'>
        <div className='header-info'>
          <Container>
            <Row className='justify-content-center'>
              <Col md='4' className='text-center d-none d-md-block'>
                <i className='fa fa-truck' />
                <span>Free Shipping</span>
              </Col>
              <Col md='4' className='text-center d-none d-md-block'>
                <i className='fa fa-credit-card' />
                <span>Payment Methods</span>
              </Col>
              <Col md='4' className='text-center d-none d-md-block'>
                <a href='tel:+923130417345' className='contact-link'>
                  <i className='fa fa-phone' />
                  <span>Call us +92 313 0417345</span>
                </a>
              </Col>

              <Col xs='12' className='text-center d-block d-md-none'>
                <div className='mobile-contact'>
                  <a href='tel:+923130417345' className='contact-link'>
                    <i className='fa fa-phone' />
                    <span>Call +92 313 0417345</span>
                  </a>
                  <a href='https://wa.me/923130417345' target='_blank' rel='noopener noreferrer' className='contact-link whatsapp-link'>
                    <i className='fa fa-whatsapp' />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
        <Container>
          <Row className='align-items-center top-header'>
            <Col
              xs={{ size: 12, order: 1 }}
              sm={{ size: 12, order: 1 }}
              md={{ size: 3, order: 1 }}
              lg={{ size: 3, order: 1 }}
              className='pr-0'
            >
              <div className='brand'>
                <Link to='/' className='logo-link'>
                  <img src='/images/logo.svg' alt='A-Z On-Buz' className='logo' />
                </Link>
              </div>
            </Col>
            <Col
              xs={{ size: 12, order: 4 }}
              sm={{ size: 12, order: 4 }}
              md={{ size: 12, order: 4 }}
              lg={{ size: 5, order: 2 }}
              className='pt-2 pt-lg-0'
            >
              <Autosuggest
                suggestions={suggestions}
                onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                onSuggestionsClearRequested={onSuggestionsClearRequested}
                getSuggestionValue={this.getSuggestionValue}
                renderSuggestion={this.renderSuggestion}
                inputProps={inputProps}
                onSuggestionSelected={(_, item) => {
                  history.push(`/product/${item.suggestion.slug}`);
                }}
              />
            </Col>
            <Col
              xs={{ size: 12, order: 2 }}
              sm={{ size: 12, order: 2 }}
              md={{ size: 4, order: 1 }}
              lg={{ size: 5, order: 3 }}
              className='d-md-none'
            >
              <div className='header-links'>
                <Button
                  borderless
                  variant='empty'
                  ariaLabel='open the menu'
                  icon={<BarsIcon />}
                  onClick={() => this.toggleMenu()}
                />
                <CartIcon cartItems={cartItems} onClick={toggleCart} />
              </div>
            </Col>
            <Col
              xs={{ size: 12, order: 2 }}
              sm={{ size: 12, order: 2 }}
              md={{ size: 9, order: 1 }}
              lg={{ size: 4, order: 3 }}
            // className='px-0'
            >
              <Navbar color='light' light expand='md' className='mt-1 mt-md-0'>
                <CartIcon
                  className='d-none d-md-block'
                  cartItems={cartItems}
                  onClick={toggleCart}
                />
                <Nav navbar>
                  {brands && brands.length > 0 && (
                    <Dropdown
                      nav
                      inNavbar
                      toggle={() => this.toggleBrand()}
                      isOpen={isBrandOpen}
                    >
                      <DropdownToggle nav>
                        Brands
                        <span className='fa fa-chevron-down dropdown-caret'></span>
                      </DropdownToggle>
                      <DropdownMenu right className='nav-brand-dropdown'>
                        <div className='mini-brand'>
                          <MiniBrand
                            brands={brands}
                            toggleBrand={() => this.toggleBrand()}
                          />
                        </div>
                      </DropdownMenu>
                    </Dropdown>
                  )}
                  <NavItem>
                    <NavLink
                      tag={ActiveLink}
                      to='/shop'
                      activeClassName='active'
                    >
                      Shop
                    </NavLink>
                  </NavItem>
                  {authenticated ? (
                    <UncontrolledDropdown nav inNavbar>
                      <DropdownToggle nav>
                        {user.firstName ? user.firstName : 'Welcome'}
                        <span className='fa fa-chevron-down dropdown-caret'></span>
                      </DropdownToggle>
                      <DropdownMenu right>
                        <DropdownItem
                          onClick={() => history.push('/dashboard')}
                        >
                          Dashboard
                        </DropdownItem>
                        <DropdownItem onClick={signOut}>Sign Out</DropdownItem>
                      </DropdownMenu>
                    </UncontrolledDropdown>
                  ) : (
                    <UncontrolledDropdown nav inNavbar>
                      <DropdownToggle nav>
                        Welcome!
                        <span className='fa fa-chevron-down dropdown-caret'></span>
                      </DropdownToggle>
                      <DropdownMenu right>
                        <DropdownItem onClick={() => history.push('/login')}>
                          Login
                        </DropdownItem>
                        <DropdownItem onClick={() => history.push('/register')}>
                          Sign Up
                        </DropdownItem>
                      </DropdownMenu>
                    </UncontrolledDropdown>
                  )}
                </Nav>
              </Navbar>
            </Col>
          </Row>
        </Container>

        {/* hidden cart drawer */}
        {isCartOpen && (
          <div
            className='mini-cart-open'
            aria-hidden='false'
          >
            <div className='mini-cart'>
              <Cart />
            </div>
            <div
              className='drawer-backdrop dark-overflow'
              onClick={toggleCart}
              onMouseDown={(e) => e.stopPropagation()}
            />
          </div>
        )}

        {/* Always visible side menu on desktop, drawer on mobile */}
        {categories && categories.length > 0 && (
          <>
            <div className='side-menu-container d-none d-md-block'>
              <div className='side-menu'>
                <Menu />
              </div>
            </div>
            {/* Mobile drawer menu */}
            {isMenuOpen && (
              <div
                className='mini-menu-open d-md-none'
                aria-hidden='false'
              >
                <div className='mini-menu'>
                  <Menu />
                </div>
                <div
                  className='drawer-backdrop dark-overflow'
                  onClick={toggleMenu}
                  onMouseDown={(e) => e.stopPropagation()}
                />
              </div>
            )}
          </>
        )}
      </header>
    );
  }
}

const mapStateToProps = state => {
  return {
    isMenuOpen: state.navigation.isMenuOpen,
    isCartOpen: state.navigation.isCartOpen,
    isBrandOpen: state.navigation.isBrandOpen,
    cartItems: state.cart.cartItems,
    brands: state.brand.storeBrands,
    categories: state.category.storeCategories,
    authenticated: state.authentication.authenticated,
    user: state.account.user,
    searchValue: state.navigation.searchValue,
    suggestions: state.navigation.searchSuggestions
  };
};

export default connect(mapStateToProps, actions)(withRouter(Navigation));
