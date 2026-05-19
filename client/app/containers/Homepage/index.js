/**
 *
 * Homepage
 *
 */

import React from 'react';

import { connect } from 'react-redux';
import { Row, Col, Container } from 'reactstrap';
import { Link } from 'react-router-dom';

import actions from '../../actions';
import CarouselSlider from '../../components/Common/CarouselSlider';
import { responsiveOneItemCarousel } from '../../components/Common/CarouselSlider/utils';
import ProductList from '../../components/Store/ProductList';
import LoadingIndicator from '../../components/Common/LoadingIndicator';
import NotFound from '../../components/Common/NotFound';
import Pagination from '../../components/Common/Pagination';
import RecentlyViewed from '../../components/Store/RecentlyViewed';
import Newsletter from '../Newsletter';
import { SET_ADVANCED_FILTERS } from '../Product/constants';

const CATEGORY_GRADIENTS = [
  'linear-gradient(135deg,#667eea,#764ba2)',
  'linear-gradient(135deg,#f093fb,#f5576c)',
  'linear-gradient(135deg,#4facfe,#00f2fe)',
  'linear-gradient(135deg,#43e97b,#38f9d7)',
  'linear-gradient(135deg,#fa709a,#fee140)',
  'linear-gradient(135deg,#a18cd1,#fbc2eb)',
  'linear-gradient(135deg,#fccb90,#d57eeb)',
  'linear-gradient(135deg,#a1c4fd,#c2e9fb)',
];

class Homepage extends React.PureComponent {
  componentDidMount() {
    // Fetch products when homepage loads
    const { filterProducts, dispatch, fetchStoreBanners, fetchStoreCategories } = this.props;

    // Fetch banners dynamically
    fetchStoreBanners();

    // Fetch categories for homepage display
    fetchStoreCategories();

    // Initialize filters with pagination (12 products per page)
    dispatch({
      type: SET_ADVANCED_FILTERS,
      payload: {
        limit: 12,
        currentPage: 1,
        name: 'all',
        category: 'all',
        brand: 'all',
        min: 1,
        max: 2500,
        rating: 0,
        order: 0
      }
    });

    // Fetch products - use a small delay to ensure state is updated
    setTimeout(() => {
      filterProducts('name', 'all');
    }, 50);
  }

  render() {
    const { products, isLoading, authenticated, updateWishlist, banners, bannersLoading, advancedFilters, filterProducts, categories, dispatch } = this.props;
    const displayProducts = products && products.length > 0;
    // Use dynamic banners or fallback to empty array
    const displayBanners = banners && banners.length > 0 ? banners : [];
    const totalPages = advancedFilters?.totalPages || 1;
    const currentPage = advancedFilters?.currentPage || 1;
    const totalProducts = advancedFilters?.count || 0;
    const displayPagination = totalPages > 1;
    // Homepage categories: hide "Home" category so it doesn't show as a tile.
    const displayCategories =
      categories && categories.length > 0
        ? categories
            .filter(c => {
              const name = (c?.name || '').toLowerCase().trim();
              return name !== 'home' && !name.includes('home');
            })
            .slice(0, 8)
        : [];

    return (
      <div className='homepage'>
        {/* Hero Banner Section */}
        <section className='homepage-hero-section'>
          <Container>
            <Row className='hero-row'>
              <Col xs='12' lg='8' className='hero-main'>
                <div className='hero-main-inner'>
                <div className='hero-overlay'>
                  <h1 className='hero-title'>Shop Everything You Love</h1>
                  <p className='hero-subtitle'>Fresh arrivals &amp; unbeatable prices — delivered to your door.</p>
                  <div className='hero-cta'>
                    <Link to='/shop' className='btn btn-primary btn-lg mr-3'>Shop Now</Link>
                    <span
                      className='btn btn-outline-light btn-lg'
                      style={{ cursor: 'pointer' }}
                      onClick={() => {
                        dispatch({
                          type: SET_ADVANCED_FILTERS,
                          payload: { limit: 12, currentPage: 1, name: 'all', category: 'all', brand: 'all', min: 1, max: 2500, rating: 0, order: 0, specialOffer: false, newArrivals: true }
                        });
                        setTimeout(() => {
                          filterProducts('newArrivals', true);
                          const s = document.querySelector('.homepage-products-section');
                          if (s) s.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }, 50);
                      }}
                    >New Arrivals</span>
                  </div>
                </div>
                <div className='hero-carousel-wrapper'>
                  {displayBanners.length > 0 ? (
                    <CarouselSlider
                      swipeable={true}
                      showDots={true}
                      infinite={true}
                      autoPlay={true}
                      autoPlaySpeed={5000}
                      slides={displayBanners}
                      responsive={responsiveOneItemCarousel}
                    >
                      {displayBanners.map((item, index) => (
                        <div key={item._id || index} className='hero-slide'>
                          {item.link ? (
                            <a href={item.link}>
                              <img src={item.imageUrl} alt={item.title || `Hero Banner ${index + 1}`} />
                            </a>
                          ) : (
                            <img src={item.imageUrl} alt={item.title || `Hero Banner ${index + 1}`} />
                          )}
                        </div>
                      ))}
                    </CarouselSlider>
                  ) : (
                    <div className='hero-carousel-placeholder'>
                      <img src='/images/banners/banner-3.jpg' alt='Default Banner' />
                    </div>
                  )}
                </div>
                </div>{/* hero-main-inner */}
              </Col>
              <Col xs='12' lg='4' className='hero-sidebar'>
                <div className='hero-sidebar-content'>
                  <div
                    className='hero-side-card hero-card-top'
                    onClick={() => {
                      dispatch({
                        type: SET_ADVANCED_FILTERS,
                        payload: {
                          limit: 12,
                          currentPage: 1,
                          name: 'all',
                          category: 'all',
                          brand: 'all',
                          min: 1,
                          max: 2500,
                          rating: 0,
                          order: 0,
                          specialOffer: true,
                          newArrivals: false
                        }
                      });
                      setTimeout(() => {
                        filterProducts('specialOffer', true);
                        // Scroll to products section
                        const productsSection = document.querySelector('.homepage-products-section');
                        if (productsSection) {
                          productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                      }, 50);
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    <img src='/images/banners/banner-2.jpg' alt='Featured Deal' />
                    <div className='hero-card-overlay'>
                      <span className='hero-card-badge'>Special Offer</span>
                    </div>
                  </div>
                  <div
                    className='hero-side-card hero-card-bottom'
                    onClick={() => {
                      dispatch({
                        type: SET_ADVANCED_FILTERS,
                        payload: {
                          limit: 12,
                          currentPage: 1,
                          name: 'all',
                          category: 'all',
                          brand: 'all',
                          min: 1,
                          max: 2500,
                          rating: 0,
                          order: 0,
                          specialOffer: false,
                          newArrivals: true
                        }
                      });
                      setTimeout(() => {
                        filterProducts('newArrivals', true);
                        // Scroll to products section
                        const productsSection = document.querySelector('.homepage-products-section');
                        if (productsSection) {
                          productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                      }, 50);
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    <img src='/images/banners/banner-5.jpg' alt='New Arrivals' />
                    <div className='hero-card-overlay'>
                      <span className='hero-card-badge'>New Arrivals</span>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </section>

        {/* Stats Trust Bar */}
        <section className='stats-bar'>
          <Container>
            <Row className='stats-row'>
              {[
                { value: '10,000+', label: 'Orders Delivered' },
                { value: '500+',    label: 'Products Listed'  },
                { value: '98%',     label: 'Happy Customers'  },
                { value: '5 ★',    label: 'Average Rating'   },
              ].map((stat, i) => (
                <Col key={i} xs='6' md='3' className='stat-item'>
                  <span className='stat-value'>{stat.value}</span>
                  <span className='stat-label'>{stat.label}</span>
                </Col>
              ))}
            </Row>
          </Container>
        </section>

        {/* Features Bar */}
        <section className='features-bar'>
          <Container>
            <Row className='features-row'>
              <Col xs='6' md='3' className='feature-item'>
                <div className='feature-icon'>
                  <i className='fa fa-truck' />
                </div>
                <div className='feature-content'>
                  <h4>Free Shipping</h4>
                  <p>On orders over PKR 5,000</p>
                </div>
              </Col>
              <Col xs='6' md='3' className='feature-item'>
                <div className='feature-icon'>
                  <i className='fa fa-undo' />
                </div>
                <div className='feature-content'>
                  <h4>Easy Returns</h4>
                  <p>30-day return policy</p>
                </div>
              </Col>
              <Col xs='6' md='3' className='feature-item'>
                <div className='feature-icon'>
                  <i className='fa fa-shield' />
                </div>
                <div className='feature-content'>
                  <h4>Secure Payment</h4>
                  <p>100% secure checkout</p>
                </div>
              </Col>
              <Col xs='6' md='3' className='feature-item'>
                <div className='feature-icon'>
                  <i className='fa fa-headphones' />
                </div>
                <div className='feature-content'>
                  <h4>24/7 Support</h4>
                  <p>Dedicated support</p>
                </div>
              </Col>
            </Row>
          </Container>
        </section>

        {/* Flash Deals Banner */}
        <div className='flash-deals-banner'>
          <div className='flash-banner-inner'>
            <span className='flash-badge'>LIMITED TIME</span>
            <span className='flash-text'>SALE &mdash; Up to <strong>50% Off</strong> on selected items</span>
            <span
              className='flash-cta'
              onClick={() => {
                dispatch({
                  type: SET_ADVANCED_FILTERS,
                  payload: { limit: 12, currentPage: 1, name: 'all', category: 'all', brand: 'all', min: 1, max: 2500, rating: 0, order: 0, specialOffer: true, newArrivals: false }
                });
                setTimeout(() => {
                  filterProducts('specialOffer', true);
                  const s = document.querySelector('.homepage-products-section');
                  if (s) s.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 50);
              }}
            >
              Shop Sale <i className='fa fa-arrow-right' />
            </span>
          </div>
        </div>

        {/* Categories Section */}
        {displayCategories.length > 0 && (
          <section className='homepage-categories-section'>
            <Container>
              <div className='section-header'>
                <div className='section-header-content'>
                  <h2 className='section-title'>Shop By Category</h2>
                  <p className='section-subtitle'>Browse our wide range of product categories</p>
                </div>
              </div>
              <div className='categories-grid'>
                <Row>
                  {displayCategories.map((category, index) => (
                    <Col xs='6' sm='4' md='3' lg='3' key={category._id || index} className='category-col'>
                      <Link
                        to={`/shop/category/${category.slug}`}
                        className='category-card'
                      >
                        <div className='category-icon-wrapper'>
                          <div
                            className='category-avatar'
                            style={{ background: CATEGORY_GRADIENTS[index % CATEGORY_GRADIENTS.length] }}
                          >
                            {(category.name || '?').charAt(0).toUpperCase()}
                          </div>
                        </div>
                        <div className='category-content'>
                          <h4 className='category-name'>{category.name}</h4>
                          {category.description && (
                            <p className='category-desc'>{category.description.substring(0, 60)}...</p>
                          )}
                          <span className='category-link'>
                            Explore <i className='fa fa-arrow-right' />
                          </span>
                        </div>
                      </Link>
                    </Col>
                  ))}
                </Row>
              </div>
            </Container>
          </section>
        )}

        {/* Products Section */}
        <section className='homepage-products-section'>
          <Container>
            <div className='section-header'>
              <div className='section-header-content'>
                <h2 className='section-title'>
                  {advancedFilters?.specialOffer
                    ? 'Special Offers'
                    : advancedFilters?.newArrivals
                      ? 'New Arrivals'
                      : currentPage === 1
                        ? 'Featured Products'
                        : 'All Products'}
                </h2>
                <p className='section-subtitle'>
                  {advancedFilters?.specialOffer
                    ? 'Discover our exclusive deals and special offers'
                    : advancedFilters?.newArrivals
                      ? 'Check out our latest products and newest arrivals'
                      : currentPage === 1
                        ? 'Discover our handpicked selection of premium products'
                        : 'Browse through our complete collection'}
                </p>
              </div>
              {displayProducts && (
                <div className='section-meta'>
                  <span className='product-count'>
                    {totalProducts} {totalProducts === 1 ? 'Product' : 'Products'}
                    {displayPagination && ` • Page ${currentPage} of ${totalPages}`}
                  </span>
                </div>
              )}
            </div>

            {isLoading ? (
              <div className='products-loading'>
                <LoadingIndicator />
              </div>
            ) : displayProducts ? (
              <>
                <div className='products-container'>
                  <ProductList
                    products={products}
                    authenticated={authenticated}
                    updateWishlist={updateWishlist}
                    cartItems={[]}
                  />
                </div>
                {displayPagination && (
                  <div
                    className='pagination-wrapper'
                    onClick={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}
                  >
                    <Pagination
                      totalPages={totalPages}
                      onPagination={filterProducts}
                    />
                  </div>
                )}
                <div className='view-all-wrapper'>
                  <Link to='/shop' className='btn view-all-btn'>
                    View All Products <i className='fa fa-arrow-right' />
                  </Link>
                </div>
              </>
            ) : (
              <div className='products-empty'>
                <NotFound message='No products found. Please check your connection or try refreshing the page.' />
              </div>
            )}
          </Container>
        </section>

        {/* Newsletter CTA Section */}
        <section className='newsletter-cta'>
          <Container>
            <div className='newsletter-content'>
              <h2>Get Exclusive Deals in Your Inbox</h2>
              <p>Subscribe and be the first to know about new arrivals and special offers.</p>
              <Newsletter />
            </div>
          </Container>
        </section>

        {/* Recently Viewed Section */}
        <RecentlyViewed authenticated={authenticated} updateWishlist={updateWishlist} />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    products: state.product.storeProducts,
    isLoading: state.product.isLoading,
    authenticated: state.authentication.authenticated,
    banners: state.homepage.banners || [],
    bannersLoading: state.homepage.isLoading || false,
    advancedFilters: state.product.advancedFilters || {},
    categories: state.category.storeCategories || []
  };
};

export default connect(
  mapStateToProps,
  dispatch => ({
    ...actions(dispatch),
    dispatch
  })
)(Homepage);
