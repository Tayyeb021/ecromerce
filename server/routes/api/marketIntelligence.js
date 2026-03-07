const express = require('express');
const router = express.Router();

// Bring in Models & Utils
const Order = require('../../models/order');
const Product = require('../../models/product');
const Category = require('../../models/category');
const Brand = require('../../models/brand');
const auth = require('../../middleware/auth');
const store = require('../../utils/store');
const { ROLES } = require('../../constants');

// Market Intelligence API
router.get('/', auth, async (req, res) => {
  try {
    // Check if user is admin or merchant
    if (req.user.role !== ROLES.Admin && req.user.role !== ROLES.Merchant) {
      return res.status(403).json({
        error: 'Access denied. Admin or Merchant only.'
      });
    }

    // Get query parameters
    const { 
      period = 'month', // 'day', 'week', 'month', 'year'
      startDate,
      endDate,
      currency = 'PKR'
    } = req.query;

    // Calculate date range
    let start, end;
    const now = new Date();

    if (startDate && endDate) {
      start = new Date(startDate);
      end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
    } else {
      switch (period) {
        case 'day':
          start = new Date(now);
          start.setHours(0, 0, 0, 0);
          end = new Date(now);
          end.setHours(23, 59, 59, 999);
          break;
        case 'week':
          start = new Date(now);
          start.setDate(now.getDate() - 7);
          start.setHours(0, 0, 0, 0);
          end = new Date(now);
          end.setHours(23, 59, 59, 999);
          break;
        case 'month':
          start = new Date(now.getFullYear(), now.getMonth(), 1);
          end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
          break;
        case 'year':
          start = new Date(now.getFullYear(), 0, 1);
          end = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
          break;
        default:
          start = new Date(now.getFullYear(), now.getMonth(), 1);
          end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      }
    }

    // Fetch orders in date range
    const ordersDoc = await Order.find({
      created: {
        $gte: start,
        $lte: end
      }
    })
      .sort('created')
      .populate({
        path: 'cart',
        populate: {
          path: 'products.product',
          populate: {
            path: 'brand',
            select: 'name slug'
          }
        }
      })
      .populate('user', 'firstName lastName email')
      .exec();

    const orders = store.formatOrders(ordersDoc.filter(order => order.cart));

    // Calculate sales metrics
    const totalRevenue = orders.reduce((sum, order) => {
      const orderTotal = order.totalWithTax || order.total || 0;
      return sum + orderTotal;
    }, 0);

    const totalOrders = orders.length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Calculate sales by time period
    const salesByPeriod = {};
    orders.forEach(order => {
      let periodKey;
      const orderDate = new Date(order.created);

      switch (period) {
        case 'day':
          periodKey = orderDate.toISOString().split('T')[0];
          break;
        case 'week':
          const weekStart = new Date(orderDate);
          weekStart.setDate(orderDate.getDate() - orderDate.getDay());
          periodKey = weekStart.toISOString().split('T')[0];
          break;
        case 'month':
          periodKey = `${orderDate.getFullYear()}-${String(orderDate.getMonth() + 1).padStart(2, '0')}`;
          break;
        case 'year':
          periodKey = orderDate.getFullYear().toString();
          break;
        default:
          periodKey = orderDate.toISOString().split('T')[0];
      }

      if (!salesByPeriod[periodKey]) {
        salesByPeriod[periodKey] = {
          period: periodKey,
          revenue: 0,
          orders: 0,
          date: orderDate.toISOString()
        };
      }

      const orderTotal = order.totalWithTax || order.total || 0;
      salesByPeriod[periodKey].revenue += orderTotal;
      salesByPeriod[periodKey].orders += 1;
    });

    const salesTrend = Object.values(salesByPeriod).sort((a, b) => 
      new Date(a.date) - new Date(b.date)
    );

    // Calculate top products
    const productSales = {};
    orders.forEach(order => {
      if (order.products && order.products.length > 0) {
        order.products.forEach(item => {
          if (item.product && item.product._id) {
            const productId = item.product._id.toString();
            if (!productSales[productId]) {
              productSales[productId] = {
                product: {
                  _id: item.product._id,
                  name: item.product.name,
                  slug: item.product.slug,
                  imageUrl: item.product.imageUrl
                },
                quantity: 0,
                revenue: 0,
                orders: 0
              };
            }
            const itemTotal = (item.totalPrice || 0) + (item.totalTax || 0);
            productSales[productId].quantity += item.quantity || 0;
            productSales[productId].revenue += itemTotal;
            productSales[productId].orders += 1;
          }
        });
      }
    });

    const topProducts = Object.values(productSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    // Calculate top categories
    // Since categories contain products (not products contain categories),
    // we need to find which category each product belongs to
    const categorySales = {};
    const allCategories = await Category.find({ isActive: true }).select('name slug products');
    const productToCategoryMap = {};
    
    // Build a map of product ID to category
    allCategories.forEach(category => {
      if (category.products && Array.isArray(category.products)) {
        category.products.forEach(productId => {
          const productIdStr = productId.toString();
          if (!productToCategoryMap[productIdStr]) {
            productToCategoryMap[productIdStr] = [];
          }
          productToCategoryMap[productIdStr].push({
            _id: category._id,
            name: category.name,
            slug: category.slug
          });
        });
      }
    });

    orders.forEach(order => {
      if (order.products && order.products.length > 0) {
        order.products.forEach(item => {
          if (item.product && item.product._id) {
            const productId = item.product._id.toString();
            const categories = productToCategoryMap[productId] || [];
            
            categories.forEach(category => {
              const categoryId = category._id.toString();
              
              if (!categorySales[categoryId]) {
                categorySales[categoryId] = {
                  category: {
                    _id: category._id,
                    name: category.name,
                    slug: category.slug
                  },
                  revenue: 0,
                  orders: 0,
                  products: 0
                };
              }
              
              const itemTotal = (item.totalPrice || 0) + (item.totalTax || 0);
              categorySales[categoryId].revenue += itemTotal;
              categorySales[categoryId].products += 1;
            });
          }
        });
      }
    });

    // Count unique orders per category
    const categoryOrders = {};
    orders.forEach(order => {
      if (order.products && order.products.length > 0) {
        const orderCategories = new Set();
        order.products.forEach(item => {
          if (item.product && item.product._id) {
            const productId = item.product._id.toString();
            const categories = productToCategoryMap[productId] || [];
            categories.forEach(cat => {
              orderCategories.add(cat._id.toString());
            });
          }
        });
        orderCategories.forEach(catId => {
          if (categorySales[catId]) {
            categorySales[catId].orders += 1;
          }
        });
      }
    });

    const topCategories = Object.values(categorySales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    // Calculate top brands
    const brandSales = {};
    orders.forEach(order => {
      if (order.products && order.products.length > 0) {
        order.products.forEach(item => {
          if (item.product && item.product.brand) {
            const brandId = item.product.brand._id 
              ? item.product.brand._id.toString() 
              : item.product.brand.toString();
            
            if (!brandSales[brandId]) {
              brandSales[brandId] = {
                brand: {
                  _id: item.product.brand._id || item.product.brand,
                  name: item.product.brand.name || 'Unknown',
                  slug: item.product.brand.slug || ''
                },
                revenue: 0,
                orders: 0,
                products: 0
              };
            }
            const itemTotal = (item.totalPrice || 0) + (item.totalTax || 0);
            brandSales[brandId].revenue += itemTotal;
            brandSales[brandId].orders += 1;
            brandSales[brandId].products += 1;
          }
        });
      }
    });

    const topBrands = Object.values(brandSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    // Response data
    const response = {
      success: true,
      period,
      currency,
      dateRange: {
        start: start.toISOString(),
        end: end.toISOString()
      },
      summary: {
        totalRevenue: parseFloat(totalRevenue.toFixed(2)),
        totalOrders,
        averageOrderValue: parseFloat(averageOrderValue.toFixed(2))
      },
      salesTrend: salesTrend || [],
      topProducts: topProducts || [],
      topCategories: topCategories || [],
      topBrands: topBrands || []
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Market Intelligence Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch market intelligence data',
      message: process.env.NODE_ENV === 'development' ? error.message : 'An error occurred while fetching market intelligence data'
    });
  }
});

module.exports = router;
