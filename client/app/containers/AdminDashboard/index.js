/*
 *
 * AdminDashboard
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import { Row, Col, Card, CardBody } from 'reactstrap';

import actions from '../../actions';
import SubPage from '../../components/Manager/SubPage';
import AdminOrderTable from '../../components/Manager/AdminOrderTable';
import LoadingIndicator from '../../components/Common/LoadingIndicator';
import NotFound from '../../components/Common/NotFound';
import { formatDate } from '../../utils/date';

class AdminDashboard extends React.PureComponent {
  componentDidMount() {
    this.props.fetchCurrentMonthSales();
  }

  formatChartData = () => {
    const { salesData } = this.props;

    if (!salesData || salesData.length === 0) {
      return [];
    }

    return salesData.map(item => ({
      date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      sales: parseFloat(item.total.toFixed(2)),
      orders: item.count
    }));
  };

  getPeakSalesDay = chartData => {
    if (!chartData.length) return null;
    return chartData.reduce((peak, current) =>
      current.sales > peak.sales ? current : peak
    );
  };

  getLatestOrder = orders => {
    if (!orders.length) return null;
    return [...orders].sort((a, b) => new Date(b.created) - new Date(a.created))[0];
  };

  renderTrendChart = chartData => {
    if (!chartData.length) return null;

    const width = 760;
    const height = 320;
    const padding = { top: 20, right: 16, bottom: 40, left: 48 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;
    const maxSales = Math.max(...chartData.map(item => item.sales), 1);
    const maxOrders = Math.max(...chartData.map(item => item.orders), 1);
    const xStep = chartData.length > 1 ? chartWidth / (chartData.length - 1) : 0;

    const salesPoints = chartData.map((item, index) => ({
      x: padding.left + xStep * index,
      y: padding.top + chartHeight - (item.sales / maxSales) * chartHeight
    }));

    const orderPoints = chartData.map((item, index) => ({
      x: padding.left + xStep * index,
      y: padding.top + chartHeight - (item.orders / maxOrders) * chartHeight
    }));

    const salesLine = salesPoints
      .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
      .join(' ');
    const salesArea = `${salesLine} L ${padding.left + chartWidth} ${padding.top + chartHeight} L ${padding.left} ${padding.top + chartHeight} Z`;
    const orderLine = orderPoints
      .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
      .join(' ');

    return (
      <>
        <div className='admin-dashboard__chart-wrap'>
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className='admin-dashboard__chart-svg'
            role='img'
            aria-label='Sales trend chart'
          >
            <defs>
              <linearGradient id='adminDashboardSalesFill' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='0%' stopColor='#2962ff' stopOpacity='0.22' />
                <stop offset='100%' stopColor='#2962ff' stopOpacity='0.02' />
              </linearGradient>
            </defs>

            {[0, 0.25, 0.5, 0.75, 1].map(ratio => {
              const y = padding.top + chartHeight * ratio;
              return (
                <line
                  key={ratio}
                  x1={padding.left}
                  y1={y}
                  x2={padding.left + chartWidth}
                  y2={y}
                  stroke='#e5e7eb'
                  strokeDasharray='4 4'
                />
              );
            })}

            {chartData.map((item, index) => (
              <text
                key={item.date}
                x={padding.left + xStep * index}
                y={height - 14}
                textAnchor='middle'
                className='admin-dashboard__chart-axis'
              >
                {item.date}
              </text>
            ))}

            {[0, 0.5, 1].map(ratio => {
              const y = padding.top + chartHeight * ratio;
              const value = Math.round(maxSales * (1 - ratio));

              return (
                <text
                  key={ratio}
                  x={padding.left - 12}
                  y={y + 4}
                  textAnchor='end'
                  className='admin-dashboard__chart-axis'
                >
                  {value}
                </text>
              );
            })}

            <path d={salesArea} fill='url(#adminDashboardSalesFill)' />
            <path
              d={salesLine}
              fill='none'
              stroke='#2962ff'
              strokeWidth='3'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
            <path
              d={orderLine}
              fill='none'
              stroke='#10b981'
              strokeWidth='2.5'
              strokeLinecap='round'
              strokeLinejoin='round'
            />

            {salesPoints.map(point => (
              <circle
                key={`sales-${point.x}`}
                cx={point.x}
                cy={point.y}
                r='4'
                fill='#2962ff'
              />
            ))}

            {orderPoints.map(point => (
              <circle
                key={`orders-${point.x}`}
                cx={point.x}
                cy={point.y}
                r='3.5'
                fill='#10b981'
              />
            ))}
          </svg>
        </div>

        <div className='admin-dashboard__chart-legend'>
          <span>
            <i className='admin-dashboard__chart-dot admin-dashboard__chart-dot--sales' />
            Sales
          </span>
          <span>
            <i className='admin-dashboard__chart-dot admin-dashboard__chart-dot--orders' />
            Orders
          </span>
        </div>
      </>
    );
  };

  render() {
    const { salesData, totalSales, salesCount, orders, isLoading } = this.props;
    const chartData = this.formatChartData();
    const hasData = salesData && salesData.length > 0;
    const displayOrders = orders && orders.length > 0;
    const peakDay = this.getPeakSalesDay(chartData);
    const latestOrder = this.getLatestOrder(orders || []);
    const averageOrderValue =
      salesCount > 0 ? (totalSales / salesCount).toFixed(2) : '0.00';
    const activeDays = chartData.filter(item => item.orders > 0).length;
    const summaryCards = [
      {
        label: 'Total Sales',
        value: `PKR ${totalSales.toFixed(2)}`,
        note: 'Current month revenue'
      },
      {
        label: 'Total Orders',
        value: salesCount,
        note: 'Orders placed this month'
      },
      {
        label: 'Average Order Value',
        value: `PKR ${averageOrderValue}`,
        note: 'Average spend per order'
      },
      {
        label: 'Active Sales Days',
        value: activeDays,
        note: 'Days with at least one order'
      }
    ];

    return (
      <div className='admin-dashboard'>
        <SubPage title='Admin Dashboard'>
          {isLoading && <LoadingIndicator />}

          {!isLoading && (
            <>
              <Row className='admin-dashboard__summary'>
                {summaryCards.map(card => (
                  <Col md='6' xl='3' className='mb-3' key={card.label}>
                    <Card className='admin-dashboard__metric-card h-100'>
                      <CardBody>
                        <span className='admin-dashboard__metric-label'>
                          {card.label}
                        </span>
                        <h2 className='admin-dashboard__metric-value'>
                          {card.value}
                        </h2>
                        <small className='admin-dashboard__metric-note'>
                          {card.note}
                        </small>
                      </CardBody>
                    </Card>
                  </Col>
                ))}
              </Row>

              <Row className='admin-dashboard__content'>
                <Col lg='8' className='mb-4'>
                  <Card className='admin-dashboard__chart-card h-100'>
                    <CardBody>
                      <div className='admin-dashboard__section-head'>
                        <div>
                          <h4 className='mb-1'>Sales Trend</h4>
                          <p className='mb-0 text-muted'>
                            Daily revenue and order volume for the current month.
                          </p>
                        </div>
                      </div>

                      {hasData ? (
                        this.renderTrendChart(chartData)
                      ) : (
                        <NotFound message='No sales data available for the current month.' />
                      )}
                    </CardBody>
                  </Card>
                </Col>

                <Col lg='4' className='mb-4'>
                  <Card className='admin-dashboard__insights-card h-100'>
                    <CardBody>
                      <div className='admin-dashboard__section-head'>
                        <div>
                          <h4 className='mb-1'>At a Glance</h4>
                          <p className='mb-0 text-muted'>
                            Quick highlights to monitor this month.
                          </p>
                        </div>
                      </div>

                      <div className='admin-dashboard__insights-list'>
                        <div className='admin-dashboard__insight'>
                          <span className='admin-dashboard__insight-label'>
                            Peak sales day
                          </span>
                          <strong>
                            {peakDay
                              ? `${peakDay.date} · PKR ${peakDay.sales.toFixed(2)}`
                              : 'No data yet'}
                          </strong>
                        </div>
                        <div className='admin-dashboard__insight'>
                          <span className='admin-dashboard__insight-label'>
                            Best order day volume
                          </span>
                          <strong>
                            {peakDay
                              ? `${peakDay.orders} orders`
                              : 'No orders yet'}
                          </strong>
                        </div>
                        <div className='admin-dashboard__insight'>
                          <span className='admin-dashboard__insight-label'>
                            Latest order
                          </span>
                          <strong>
                            {latestOrder
                              ? `#${latestOrder._id.slice(-6)} · ${formatDate(
                                  latestOrder.created
                                )}`
                              : 'No recent orders'}
                          </strong>
                        </div>
                        <div className='admin-dashboard__insight'>
                          <span className='admin-dashboard__insight-label'>
                            Orders shown below
                          </span>
                          <strong>{displayOrders ? Math.min(orders.length, 8) : 0}</strong>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
              </Row>

              <Card className='admin-dashboard__orders-card'>
                <CardBody>
                  <div className='admin-dashboard__section-head'>
                    <div>
                      <h4 className='mb-1'>Recent Orders</h4>
                      <p className='mb-0 text-muted'>
                        Compact admin view with customer and order status details.
                      </p>
                    </div>
                  </div>
                  {displayOrders ? (
                    <AdminOrderTable orders={orders.slice(0, 8)} />
                  ) : (
                    <NotFound message='No orders found for the current month.' />
                  )}
                </CardBody>
              </Card>
            </>
          )}
        </SubPage>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    salesData: state.adminDashboard.salesData,
    totalSales: state.adminDashboard.totalSales,
    salesCount: state.adminDashboard.salesCount,
    orders: state.adminDashboard.orders,
    isLoading: state.adminDashboard.isLoading
  };
};

export default connect(mapStateToProps, actions)(AdminDashboard);
