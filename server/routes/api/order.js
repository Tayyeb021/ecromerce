const express = require('express');
const router = express.Router();
const Mongoose = require('mongoose');

// Bring in Models & Utils
const Order = require('../../models/order');
const Cart = require('../../models/cart');
const Product = require('../../models/product');
const auth = require('../../middleware/auth');
const gmail = require('../../services/gmail');
const store = require('../../utils/store');
const { ROLES, CART_ITEM_STATUS } = require('../../constants');

// Guest checkout: POST /api/order/guest (no auth), body: email, address, phone, firstName?, lastName?, products, total, shippingOption
router.post('/guest', async (req, res) => {
  try {
    const { email, firstName, lastName, address, phone, products: items, total, shippingOption } = req.body;

    if (!email || !items || !Array.isArray(items) || items.length === 0 || total == null) {
      return res.status(400).json({
        error: 'Email and cart products are required.'
      });
    }
    const addressTrimmed = address != null ? String(address).trim() : '';
    const phoneTrimmed = phone != null ? String(phone).trim() : '';
    if (!addressTrimmed || !phoneTrimmed) {
      return res.status(400).json({
        error: 'Address and phone number are required.'
      });
    }

    const products = store.caculateItemsSalesTax(items);

    const cart = new Cart({
      user: null,
      products
    });
    const cartDoc = await cart.save();

    // Decrease product inventory
    const decreaseQuantity = (prods) => {
      const bulkOptions = prods.map((item) => ({
        updateOne: {
          filter: { _id: item.product },
          update: { $inc: { quantity: -item.quantity } }
        }
      }));
      return Product.bulkWrite(bulkOptions);
    };
    await decreaseQuantity(products);

    const order = new Order({
      cart: cartDoc._id,
      user: null,
      guestEmail: email.trim(),
      guestFirstName: firstName ? firstName.trim() : null,
      guestLastName: lastName ? lastName.trim() : null,
      guestAddress: addressTrimmed,
      guestPhone: phoneTrimmed,
      total: Number(total),
      shippingOption: shippingOption ? {
        name: shippingOption.name,
        cost: shippingOption.cost != null ? Number(shippingOption.cost) : 0,
        deliveryTime: shippingOption.deliveryTime
      } : null
    });
    const orderDoc = await order.save();

    const cartDocPopulated = await Cart.findById(orderDoc.cart._id).populate({
      path: 'products.product',
      populate: { path: 'brand' }
    });

    const newOrder = {
      _id: orderDoc._id,
      created: orderDoc.created,
      user: { email: orderDoc.guestEmail, firstName: orderDoc.guestFirstName, lastName: orderDoc.guestLastName },
      total: orderDoc.total,
      products: cartDocPopulated.products,
      shippingOption: orderDoc.shippingOption
    };
    const orderWithTax = store.caculateTaxAmount(newOrder);

    try {
      await gmail.sendEmail(
        orderDoc.guestEmail,
        'order-confirmation',
        null,
        orderWithTax
      );
    } catch (emailErr) {
      console.error('Guest order confirmation email error:', emailErr);
    }

    res.status(200).json({
      success: true,
      message: 'Your order has been placed successfully!',
      order: { _id: orderDoc._id }
    });
  } catch (error) {
    console.error('Guest order error:', error);
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

router.post('/add', auth, async (req, res) => {
  try {
    const cart = req.body.cartId;
    const total = req.body.total;
    const user = req.user._id;
    const shippingOption = req.body.shippingOption || null;
    const { firstName, lastName, email, phone, address } = req.body;

    const addressTrimmed = address != null ? String(address).trim() : '';
    const phoneTrimmed = phone != null ? String(phone).trim() : '';
    const emailTrimmed = email != null ? String(email).trim() : '';

    if (!emailTrimmed || !addressTrimmed || !phoneTrimmed) {
      return res.status(400).json({
        error: 'Email, address and phone number are required for checkout.'
      });
    }

    const orderData = {
      cart,
      user,
      total,
      shippingOption: shippingOption ? {
        name: shippingOption.name,
        cost: shippingOption.cost || 0,
        deliveryTime: shippingOption.deliveryTime
      } : null
    };

    // Save customer/shipping info to Order (same fields as guest checkout)
    if (emailTrimmed) orderData.guestEmail = emailTrimmed;
    if (firstName != null) orderData.guestFirstName = String(firstName).trim() || null;
    if (lastName != null) orderData.guestLastName = String(lastName).trim() || null;
    if (addressTrimmed) orderData.guestAddress = addressTrimmed;
    if (phoneTrimmed) orderData.guestPhone = phoneTrimmed;

    const order = new Order(orderData);
    const orderDoc = await order.save();

    // Update cart with customer info for future reference
    if (cart && (emailTrimmed || addressTrimmed || phoneTrimmed)) {
      await Cart.updateOne(
        { _id: cart },
        {
          $set: {
            customerEmail: emailTrimmed || null,
            customerFirstName: firstName != null ? String(firstName).trim() : null,
            customerLastName: lastName != null ? String(lastName).trim() : null,
            customerAddress: addressTrimmed || null,
            customerPhone: phoneTrimmed || null,
            shippingOption: shippingOption ? {
              name: shippingOption.name,
              cost: shippingOption.cost || 0,
              deliveryTime: shippingOption.deliveryTime
            } : null,
            updated: new Date()
          }
        }
      );
    }

    // Populate user to get email
    await orderDoc.populate('user', 'email firstName lastName profile');

    const cartDoc = await Cart.findById(orderDoc.cart._id).populate({
      path: 'products.product',
      populate: {
        path: 'brand'
      }
    });

    // Calculate order with tax
    const newOrder = {
      _id: orderDoc._id,
      created: orderDoc.created,
      user: orderDoc.user,
      total: orderDoc.total,
      products: cartDoc.products,
      shippingOption: orderDoc.shippingOption
    };

    const orderWithTax = store.caculateTaxAmount(newOrder);

    // Send order confirmation email (prefer checkout email, else user email)
    const emailTo = orderDoc.guestEmail || (orderDoc.user && orderDoc.user.email);
    if (emailTo) {
      try {
        await gmail.sendEmail(
          emailTo,
          'order-confirmation',
          null,
          orderWithTax
        );
        console.log(`Order confirmation email sent to ${emailTo}`);
      } catch (emailError) {
        console.error('Error sending order confirmation email:', emailError);
        // Don't fail the order if email fails
      }
    }

    res.status(200).json({
      success: true,
      message: `Your order has been placed successfully!`,
      order: { _id: orderDoc._id }
    });
  } catch (error) {
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

// search orders api
router.get('/search', auth, async (req, res) => {
  try {
    const { search } = req.query;

    if (!Mongoose.Types.ObjectId.isValid(search)) {
      return res.status(200).json({
        orders: []
      });
    }

    let ordersDoc = null;

    if (req.user.role === ROLES.Admin) {
      ordersDoc = await Order.find({
        _id: Mongoose.Types.ObjectId(search)
      }).populate({
        path: 'cart',
        populate: {
          path: 'products.product',
          populate: {
            path: 'brand'
          }
        }
      });
    } else {
      const user = req.user._id;
      ordersDoc = await Order.find({
        _id: Mongoose.Types.ObjectId(search),
        user
      }).populate({
        path: 'cart',
        populate: {
          path: 'products.product',
          populate: {
            path: 'brand'
          }
        }
      });
    }

    ordersDoc = ordersDoc.filter(order => order.cart);

    if (ordersDoc.length > 0) {
      const newOrders = ordersDoc.map(o => {
        return {
          _id: o._id,
          total: parseFloat(Number(o.total.toFixed(2))),
          created: o.created,
          products: o.cart?.products
        };
      });

      let orders = newOrders.map(o => store.caculateTaxAmount(o));
      orders.sort((a, b) => b.created - a.created);
      res.status(200).json({
        orders
      });
    } else {
      res.status(200).json({
        orders: []
      });
    }
  } catch (error) {
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

// fetch current month sales api
router.get('/current-month', auth, async (req, res) => {
  try {
    if (req.user.role !== ROLES.Admin) {
      return res.status(403).json({
        error: 'Access denied. Admin only.'
      });
    }

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    const ordersDoc = await Order.find({
      created: {
        $gte: startOfMonth,
        $lte: endOfMonth
      }
    })
      .sort('created')
      .populate({
        path: 'cart',
        populate: {
          path: 'products.product',
          populate: {
            path: 'brand'
          }
        }
      })
      .populate('user', 'firstName lastName email')
      .exec();

    const cleanString = value =>
      value != null && String(value).trim() !== '' ? String(value).trim() : null;

    const orders = ordersDoc
      .filter(order => order.cart)
      .map(orderDoc => {
        const guestFirstName = cleanString(orderDoc.guestFirstName);
        const guestLastName = cleanString(orderDoc.guestLastName);
        const userFirstName = cleanString(orderDoc.user?.firstName);
        const userLastName = cleanString(orderDoc.user?.lastName);
        const customerName =
          [guestFirstName || userFirstName, guestLastName || userLastName]
            .filter(Boolean)
            .join(' ') || null;

        const order = store.caculateTaxAmount({
          _id: orderDoc._id,
          total: parseFloat(Number(orderDoc.total.toFixed(2))),
          created: orderDoc.created,
          products: orderDoc?.cart?.products || [],
          shippingOption: orderDoc.shippingOption
            ? {
                name: orderDoc.shippingOption.name,
                cost: orderDoc.shippingOption.cost,
                deliveryTime: orderDoc.shippingOption.deliveryTime
              }
            : null
        });

        return {
          ...order,
          customerName: customerName || 'Guest customer',
          customerEmail:
            cleanString(orderDoc.guestEmail) || cleanString(orderDoc.user?.email),
          itemCount: Array.isArray(order.products)
            ? order.products.reduce((sum, item) => sum + (item.quantity || 0), 0)
            : 0,
          primaryStatus: order.products?.[0]?.status || 'Unavailable'
        };
      });

    // Calculate daily sales for graph
    const dailySales = {};
    orders.forEach(order => {
      const date = new Date(order.created).toISOString().split('T')[0];
      if (!dailySales[date]) {
        dailySales[date] = { date, total: 0, count: 0 };
      }
      // Use totalWithTax if available, otherwise use total
      const orderTotal = order.totalWithTax || order.total || 0;
      dailySales[date].total += orderTotal;
      dailySales[date].count += 1;
    });

    // Convert to array and sort by date
    const salesData = Object.values(dailySales).sort((a, b) => 
      new Date(a.date) - new Date(b.date)
    );

    // Calculate total sales and count
    const totalSales = orders.reduce((sum, order) => {
      const orderTotal = order.totalWithTax || order.total || 0;
      return sum + orderTotal;
    }, 0);
    const salesCount = orders.length;

    res.status(200).json({
      success: true,
      salesData,
      totalSales: parseFloat(totalSales.toFixed(2)),
      salesCount,
      orders
    });
  } catch (error) {
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

// fetch orders api (all orders – admin only; members use GET /order/me)
router.get('/', auth, async (req, res) => {
  try {
    if (req.user.role !== ROLES.Admin) {
      return res.status(403).json({
        error: 'Access denied. Admin only.'
      });
    }

    const { page = 1, limit = 10 } = req.query;
    const ordersDoc = await Order.find()
      .sort('-created')
      .populate({
        path: 'cart',
        populate: {
          path: 'products.product',
          populate: {
            path: 'brand'
          }
        }
      })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Order.countDocuments();
    const orders = store.formatOrders(ordersDoc);

    res.status(200).json({
      orders,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      count
    });
  } catch (error) {
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

// fetch my orders api
router.get('/me', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const user = req.user._id;
    const query = { user };

    const ordersDoc = await Order.find(query)
      .sort('-created')
      .populate({
        path: 'cart',
        populate: {
          path: 'products.product',
          populate: {
            path: 'brand'
          }
        }
      })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Order.countDocuments(query);
    const orders = store.formatOrders(ordersDoc);

    res.status(200).json({
      orders,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      count
    });
  } catch (error) {
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

// fetch order api – returns full order including guest/customer fields for Order details page
router.get('/:orderId', auth, async (req, res) => {
  try {
    const orderId = req.params.orderId;

    if (!Mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(404).json({
        message: `Cannot find order with the id: ${orderId}.`
      });
    }

    const orderDoc = await Order.findOne({ _id: orderId })
      .populate('user', 'email firstName lastName phoneNumber')
      .populate({
        path: 'cart',
        populate: {
          path: 'products.product',
          populate: {
            path: 'brand'
          }
        }
      });

    if (!orderDoc) {
      return res.status(404).json({
        message: `Cannot find order with the id: ${orderId}.`
      });
    }

    const isAdmin = req.user.role === ROLES.Admin;
    if (!isAdmin) {
      const viewerId = String(req.user._id);
      let ownedByAccount = false;
      if (orderDoc.user) {
        const ou = orderDoc.user._id || orderDoc.user;
        ownedByAccount = String(ou) === viewerId;
      }
      const guestEmailNorm = orderDoc.guestEmail
        ? String(orderDoc.guestEmail).trim().toLowerCase()
        : '';
      const viewerEmailNorm = req.user.email
        ? String(req.user.email).trim().toLowerCase()
        : '';
      const ownedByGuestEmail =
        !orderDoc.user &&
        guestEmailNorm &&
        viewerEmailNorm &&
        guestEmailNorm === viewerEmailNorm;

      if (!ownedByAccount && !ownedByGuestEmail) {
        return res.status(403).json({
          message: 'You do not have permission to view this order.'
        });
      }
    }

    // Cart may be missing (deleted); still return order with guest/contact fields and empty line items
    const hasCart = orderDoc.cart && typeof orderDoc.cart === 'object';

    const ud = orderDoc.user;
    const userObj = ud && typeof ud === 'object' && 'email' in ud
      ? { email: ud.email, firstName: ud.firstName, lastName: ud.lastName, phoneNumber: ud.phoneNumber }
      : null;

    const cartId = hasCart ? orderDoc.cart._id || orderDoc.cart : null;
    const products = hasCart && orderDoc.cart.products ? orderDoc.cart.products : [];

    let order = {
      _id: orderDoc._id,
      total: orderDoc.total,
      created: orderDoc.created,
      totalTax: 0,
      products,
      cartId: cartId && (cartId._id || cartId),
      guestEmail: orderDoc.guestEmail ?? null,
      guestFirstName: orderDoc.guestFirstName ?? null,
      guestLastName: orderDoc.guestLastName ?? null,
      guestAddress: orderDoc.guestAddress ?? null,
      guestPhone: orderDoc.guestPhone ?? null,
      user: userObj,
      shippingOption: orderDoc.shippingOption ? { ...orderDoc.shippingOption } : null
    };

    order = store.caculateTaxAmount(order);

    const cartDoc = orderDoc.cart && typeof orderDoc.cart === 'object' ? orderDoc.cart : null;
    // Plain document from DB (avoids any Mongoose path edge cases)
    const plain =
      typeof orderDoc.toObject === 'function'
        ? orderDoc.toObject({ virtuals: false })
        : {};

    const str = v =>
      v != null && String(v).trim() !== '' ? String(v).trim() : null;

    const pickFirst = (...candidates) => {
      for (let i = 0; i < candidates.length; i += 1) {
        const s = str(candidates[i]);
        if (s) return s;
      }
      return null;
    };

    // Re-apply from persisted Order row first (source of truth), then cart, then user
    order.guestEmail = pickFirst(
      plain.guestEmail,
      orderDoc.guestEmail,
      order.guestEmail
    );
    order.guestFirstName = pickFirst(
      plain.guestFirstName,
      orderDoc.guestFirstName,
      order.guestFirstName
    );
    order.guestLastName = pickFirst(
      plain.guestLastName,
      orderDoc.guestLastName,
      order.guestLastName
    );
    order.guestAddress = pickFirst(
      plain.guestAddress,
      orderDoc.guestAddress,
      order.guestAddress
    );
    order.guestPhone = pickFirst(
      plain.guestPhone,
      orderDoc.guestPhone,
      order.guestPhone
    );

    if (cartDoc) {
      if (!order.guestEmail) order.guestEmail = str(cartDoc.customerEmail);
      if (!order.guestFirstName) order.guestFirstName = str(cartDoc.customerFirstName);
      if (!order.guestLastName) order.guestLastName = str(cartDoc.customerLastName);
      if (!order.guestAddress) order.guestAddress = str(cartDoc.customerAddress);
      if (!order.guestPhone) order.guestPhone = str(cartDoc.customerPhone);
    }
    if (userObj) {
      if (!order.guestEmail) order.guestEmail = str(userObj.email);
      if (!order.guestFirstName) order.guestFirstName = str(userObj.firstName);
      if (!order.guestLastName) order.guestLastName = str(userObj.lastName);
      if (!order.guestPhone) order.guestPhone = str(userObj.phoneNumber);
    }

    const shipOpt = orderDoc.shippingOption ?? plain.shippingOption;
    order.shippingOption = shipOpt && typeof shipOpt === 'object'
      ? { name: shipOpt.name, cost: shipOpt.cost, deliveryTime: shipOpt.deliveryTime }
      : null;

    // Single object for admin UI (guest + registered checkout)
    order.customer = {
      email: order.guestEmail,
      firstName: order.guestFirstName,
      lastName: order.guestLastName,
      fullName: [order.guestFirstName, order.guestLastName].filter(Boolean).join(' ') || null,
      phone: order.guestPhone,
      address: order.guestAddress
    };

    res.status(200).json({
      order
    });
  } catch (error) {
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

router.delete('/cancel/:orderId', auth, async (req, res) => {
  try {
    const orderId = req.params.orderId;

    const order = await Order.findOne({ _id: orderId });
    const foundCart = await Cart.findOne({ _id: order.cart });

    increaseQuantity(foundCart.products);

    await Order.deleteOne({ _id: orderId });
    await Cart.deleteOne({ _id: order.cart });

    res.status(200).json({
      success: true
    });
  } catch (error) {
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

router.put('/status/item/:itemId', auth, async (req, res) => {
  try {
    const itemId = req.params.itemId;
    const orderId = req.body.orderId;
    const cartId = req.body.cartId;
    const status = req.body.status || CART_ITEM_STATUS.Cancelled;

    const foundCart = await Cart.findOne({ 'products._id': itemId });
    const foundCartProduct = foundCart.products.find(p => p._id == itemId);

    await Cart.updateOne(
      { 'products._id': itemId },
      {
        'products.$.status': status
      }
    );

    if (status === CART_ITEM_STATUS.Cancelled) {
      await Product.updateOne(
        { _id: foundCartProduct.product },
        { $inc: { quantity: foundCartProduct.quantity } }
      );

      const cart = await Cart.findOne({ _id: cartId });
      const items = cart.products.filter(
        item => item.status === CART_ITEM_STATUS.Cancelled
      );

      // All items are cancelled => Cancel order
      if (cart.products.length === items.length) {
        await Order.deleteOne({ _id: orderId });
        await Cart.deleteOne({ _id: cartId });

        return res.status(200).json({
          success: true,
          orderCancelled: true,
          message: `${
            req.user.role === ROLES.Admin ? 'Order' : 'Your order'
          } has been cancelled successfully`
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Item has been cancelled successfully!'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Item status has been updated successfully!'
    });
  } catch (error) {
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

const increaseQuantity = products => {
  let bulkOptions = products.map(item => {
    return {
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: item.quantity } }
      }
    };
  });

  Product.bulkWrite(bulkOptions);
};

module.exports = router;
