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
import OrderList from '../../components/Manager/OrderList';
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

  renderSimpleChart = () => {
    const chartData = this.formatChartData();
    if (!chartData || chartData.length === 0) return null;

    const width = 800;
    const height = 300;
    const padding = { top: 20, right: 30, bottom: 40, left: 60 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    const maxSales = Math.max(...chartData.map(d => d.sales), 1);
    const maxOrders = Math.max(...chartData.map(d => d.orders), 1);

    const xScale = chartWidth / (chartData.length - 1 || 1);
    const yScaleSales = chartHeight / maxSales;
    const yScaleOrders = chartHeight / maxOrders;

    const salesPoints = chartData.map((d, i) => ({
      x: padding.left + i * xScale,
      y: padding.top + chartHeight - d.sales * yScaleSales
    }));

    const ordersPoints = chartData.map((d, i) => ({
      x: padding.left + i * xScale,
      y: padding.top + chartHeight - d.orders * yScaleOrders
    }));

    const salesPath = salesPoints.map((p, i) => 
      i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`
    ).join(' ');

    const ordersPath = ordersPoints.map((p, i) => 
      i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`
    ).join(' ');

    return (
      <div style={{ overflowX: 'auto' }}>
        <svg width={width} height={height} style={{ display: 'block' }}>
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
            <g key={i}>
              <line
                x1={padding.left}
                y1={padding.top + chartHeight * ratio}
                x2={width - padding.right}
                y2={padding.top + chartHeight * ratio}
                stroke="#e0e0e0"
                strokeWidth="1"
                strokeDasharray="3 3"
              />
              <text
                x={padding.left - 10}
                y={padding.top + chartHeight * ratio}
                textAnchor="end"
                fontSize="10"
                fill="#666"
              >
                {Math.round(maxSales * (1 - ratio))}
              </text>
            </g>
          ))}

          {/* X-axis labels */}
          {chartData.map((d, i) => (
            <text
              key={i}
              x={padding.left + i * xScale}
              y={height - padding.bottom + 20}
              textAnchor="middle"
              fontSize="10"
              fill="#666"
            >
              {d.date}
            </text>
          ))}

          {/* Sales line */}
          <path
            d={salesPath}
            fill="none"
            stroke="#8884d8"
            strokeWidth="2"
          />
          {salesPoints.map((p, i) => (
            <circle
              key={`sales-${i}`}
              cx={p.x}
              cy={p.y}
              r="4"
              fill="#8884d8"
            />
          ))}

          {/* Orders line */}
          <path
            d={ordersPath}
            fill="none"
            stroke="#82ca9d"
            strokeWidth="2"
          />
          {ordersPoints.map((p, i) => (
            <circle
              key={`orders-${i}`}
              cx={p.x}
              cy={p.y}
              r="4"
              fill="#82ca9d"
            />
          ))}

          {/* Legend */}
          <g>
            <line
              x1={width - padding.right - 100}
              y1={padding.top + 10}
              x2={width - padding.right - 80}
              y2={padding.top + 10}
              stroke="#8884d8"
              strokeWidth="2"
            />
            <text
              x={width - padding.right - 75}
              y={padding.top + 14}
              fontSize="12"
              fill="#333"
            >
              Sales (PKR)
            </text>
            <line
              x1={width - padding.right - 100}
              y1={padding.top + 30}
              x2={width - padding.right - 80}
              y2={padding.top + 30}
              stroke="#82ca9d"
              strokeWidth="2"
            />
            <text
              x={width - padding.right - 75}
              y={padding.top + 34}
              fontSize="12"
              fill="#333"
            >
              Orders
            </text>
          </g>
        </svg>
      </div>
    );
  };

  render() {
    const { salesData, totalSales, salesCount, orders, isLoading } = this.props;
    const chartData = this.formatChartData();
    const hasData = salesData && salesData.length > 0;
    const displayOrders = orders && orders.length > 0;

    return (
      <div className='admin-dashboard'>
        <SubPage title='Admin Dashboard'>
          {isLoading && <LoadingIndicator />}
          
          {!isLoading && (
            <>
              {/* Sales Summary Cards */}
              <Row className='mb-4'>
                <Col md='6' lg='4' className='mb-3'>
                  <Card className='h-100'>
                    <CardBody>
                      <h5 className='text-muted mb-2'>Total Sales</h5>
                      <h2 className='mb-0'>PKR {totalSales.toFixed(2)}</h2>
                      <small className='text-muted'>Current Month</small>
                    </CardBody>
                  </Card>
                </Col>
                <Col md='6' lg='4' className='mb-3'>
                  <Card className='h-100'>
                    <CardBody>
                      <h5 className='text-muted mb-2'>Total Orders</h5>
                      <h2 className='mb-0'>{salesCount}</h2>
                      <small className='text-muted'>Current Month</small>
                    </CardBody>
                  </Card>
                </Col>
                <Col md='6' lg='4' className='mb-3'>
                  <Card className='h-100'>
                    <CardBody>
                      <h5 className='text-muted mb-2'>Average Order Value</h5>
                      <h2 className='mb-0'>
                        PKR {salesCount > 0 ? (totalSales / salesCount).toFixed(2) : '0.00'}
                      </h2>
                      <small className='text-muted'>Current Month</small>
                    </CardBody>
                  </Card>
                </Col>
              </Row>

              {/* Sales Graph */}
              {hasData && (
                <Card className='mb-4'>
                  <CardBody>
                    <h4 className='mb-3'>Daily Sales Trend - Current Month</h4>
                    {this.renderSimpleChart()}
                  </CardBody>
                </Card>
              )}

              {/* Sales List */}
              <Card>
                <CardBody>
                  <h4 className='mb-3'>Recent Orders - Current Month</h4>
                  {displayOrders ? (
                    <OrderList orders={orders.slice(0, 10)} />
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
