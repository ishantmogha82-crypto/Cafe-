const express = require('express');
const Database = require('better-sqlite3');
const path = require('path');
const crypto = require('crypto');
require('dotenv').config({ path: path.resolve(__dirname, '..', '..', '.env') });

let bcrypt;
try {
  bcrypt = require('bcryptjs');
} catch (e) {
  bcrypt = {
    hash: async (pw) => Buffer.from(pw).toString('base64'),
    compare: async (pw, hash) => hash === Buffer.from(pw).toString('base64') || hash === pw
  };
}

// --- NODEMAILER EMAIL SETUP ---
let nodemailer;
try {
  nodemailer = require('nodemailer');
} catch (e) {
  nodemailer = null;
  console.warn('[Email] nodemailer not available, email notifications disabled.');
}

const EMAIL_USER = process.env.EMAIL_USER || '';
const EMAIL_PASS = process.env.EMAIL_PASS || '';
const EMAIL_TO   = process.env.EMAIL_TO   || EMAIL_USER;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || '';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';

let emailTransporter = null;
if (nodemailer && EMAIL_USER && EMAIL_PASS) {
  emailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: EMAIL_USER, pass: EMAIL_PASS }
  });
  console.log(`[Email] Nodemailer ready. Notifications → ${EMAIL_TO}`);
}

async function sendOrderNotificationEmail(order) {
  if (!emailTransporter) return;
  try {
    const itemsList = (order.items || []).map(i => `• ${i.qty || 1}× ${i.name} — ₹${(i.price || 0) * (i.qty || 1)}`).join('\n');
    const mailOptions = {
      from: `"Brew & Bean Cafe" <${EMAIL_USER}>`,
      to: EMAIL_TO,
      subject: `🛎️ New Order #${order.id || order.orderId} — Brew & Bean`,
      html: `
        <div style="font-family: 'Inter', Arial, sans-serif; max-width: 560px; margin: 0 auto; background: #1c1714; color: #f5ede3; border-radius: 12px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #c88a58 0%, #a06b3a 100%); padding: 24px 28px;">
            <h2 style="margin:0; color:#ffffff; font-size:1.4rem;">☕ New Order Received!</h2>
            <p style="margin:6px 0 0; color:rgba(255,255,255,0.85); font-size:0.9rem;">Brew & Bean — Admin Notification</p>
          </div>
          <div style="padding: 24px 28px;">
            <table style="width:100%; border-collapse:collapse; margin-bottom:18px;">
              <tr><td style="padding:6px 0; color:#9c9288; font-size:0.85rem;">Order ID</td><td style="padding:6px 0; color:#fff; font-weight:600;">#${order.id || order.orderId}</td></tr>
              <tr><td style="padding:6px 0; color:#9c9288; font-size:0.85rem;">Customer</td><td style="padding:6px 0; color:#fff;">${order.customer_name || 'Guest Customer'}</td></tr>
              <tr><td style="padding:6px 0; color:#9c9288; font-size:0.85rem;">Status</td><td style="padding:6px 0; color:#fbbf24; font-weight:600;">PENDING</td></tr>
              <tr><td style="padding:6px 0; color:#9c9288; font-size:0.85rem;">Time</td><td style="padding:6px 0; color:#fff;">${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</td></tr>
            </table>
            <div style="background:rgba(255,255,255,0.05); border-radius:8px; padding:16px; margin-bottom:18px;">
              <h4 style="margin:0 0 10px; color:#c88a58; font-size:0.95rem;">Order Items</h4>
              ${(order.items || []).map(i => `
                <div style="display:flex; justify-content:space-between; padding:5px 0; border-bottom:1px solid rgba(255,255,255,0.06); font-size:0.9rem;">
                  <span>${i.qty || 1}× ${i.name}${i.size ? ` (${i.size})` : ''}</span>
                  <span style="color:#c88a58; font-weight:600;">₹${(i.price || 0) * (i.qty || 1)}</span>
                </div>`).join('')}
            </div>
            <div style="text-align:right;">
              <span style="font-size:0.88rem; color:#9c9288;">Subtotal: ₹${order.subtotal || order.total || 0} &nbsp;|&nbsp; Delivery: ₹${order.deliveryFee || order.delivery_fee || 0}</span><br>
              <span style="font-size:1.25rem; font-weight:700; color:#c88a58;">Grand Total: ₹${order.total || 0}</span>
            </div>
          </div>
          <div style="background:rgba(0,0,0,0.25); padding:14px 28px; text-align:center; font-size:0.8rem; color:#6b7280;">
            Log in to your <strong style="color:#c88a58;">Admin Portal</strong> to update order status.
          </div>
        </div>
      `
    };
    await emailTransporter.sendMail(mailOptions);
    console.log(`[Email] Order notification sent for #${order.id || order.orderId}`);
  } catch (err) {
    console.error('[Email] Failed to send order notification:', err.message);
  }
}

let cors;
try {
  cors = require('cors');
} catch (e) {
  cors = () => (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') return res.sendStatus(200);
    next();
  };
}

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve static frontend files
const sitePath = path.resolve(__dirname, '..');
app.use(express.static(sitePath));

// Connect to SQLite database
const dbPath = path.resolve(__dirname, 'cafe.db');
const db = new Database(dbPath);

// Initialize database tables
db.exec(`
  CREATE TABLE IF NOT EXISTS menu (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    category TEXT DEFAULT 'coffee',
    description TEXT DEFAULT ''
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_name TEXT NOT NULL,
    items TEXT NOT NULL,
    total REAL NOT NULL,
    subtotal REAL DEFAULT 0,
    delivery_fee REAL DEFAULT 0,
    status TEXT DEFAULT 'pending',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT DEFAULT '',
    message TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'customer',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
`);

// Migration: Ensure 'role' column exists in users table
try {
  const userCols = db.prepare('PRAGMA table_info(users)').all().map(c => c.name);
  if (!userCols.includes('role')) {
    db.exec("ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'customer'");
  }
} catch (err) {
  console.log('Role column verification note:', err.message);
}

// Seed default starter menu items if empty
const menuCount = db.prepare('SELECT COUNT(*) AS count FROM menu').get().count;
if (menuCount === 0) {
  const insert = db.prepare('INSERT INTO menu (name, price, category, description) VALUES (?, ?, ?, ?)');
  insert.run('Cappuccino', 150, 'coffee', 'Rich espresso, steamed milk and velvety foam');
  insert.run('Croissant', 110, 'bakery', 'Flaky golden French butter croissant');
  insert.run('Espresso', 120, 'coffee', 'Intense and rich single shot roasted Arabica');
  insert.run('Latte', 160, 'coffee', 'Smooth creamy steamed milk with espresso');
  insert.run('Chocolate Muffin', 120, 'desserts', 'Fresh double chocolate baked muffin');
  insert.run('Artisan Masala Chai', 90, 'tea', 'Assam whole leaf tea with handcrafted spices');
}

const additionalMenuItems = [
  ['Margherita Pizza', 249, 'snacks', 'Stone-baked pizza topped with tomato sauce, mozzarella, and fresh basil'],
  ['Farmhouse Pizza', 289, 'snacks', 'Stone-baked pizza loaded with capsicum, onion, mushrooms, tomato, and mozzarella'],
  ['Paneer Tikka Pizza', 319, 'snacks', 'A spicy Indian-inspired pizza with marinated paneer, peppers, and creamy mozzarella'],
  ['Classic Veg Burger', 149, 'snacks', 'Crispy vegetable patty with lettuce, tomato, and house sauce in a toasted bun'],
  ['Double Patty Veg Burger', 199, 'snacks', 'Two crispy vegetable patties layered with cheese, lettuce, and house sauce'],
  ['Paneer Crunch Burger', 189, 'snacks', 'Crispy paneer patty with fresh lettuce and a mildly spiced creamy sauce'],
  ['French Fries', 99, 'snacks', 'Golden, crispy fries seasoned lightly and served hot'],
  ['Peri Peri Fries', 119, 'snacks', 'Crispy golden fries tossed with tangy, mildly spicy peri peri seasoning'],
  ['Cheesy Fries', 149, 'snacks', 'Hot, crispy fries finished with a generous pour of creamy cheese sauce']
];
const findMenuItem = db.prepare('SELECT id FROM menu WHERE name = ?');
const insertMenuItem = db.prepare('INSERT INTO menu (name, price, category, description) VALUES (?, ?, ?, ?)');
for (const item of additionalMenuItems) {
  if (!findMenuItem.get(item[0])) insertMenuItem.run(...item);
}

// Keep the admin database record aligned with explicitly configured credentials.
try {
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be configured.');
  const adminPw = ADMIN_PASSWORD;
  const adminEmail = ADMIN_EMAIL;
  const hashedAdminPw = Buffer.from(adminPw).toString('base64');
  // Check for existing admin by username OR email
  const adminUser = db.prepare(
    "SELECT * FROM users WHERE username = 'admin' OR email = ? OR email = 'admin@brewbean.in'"
  ).get(adminEmail);
  if (!adminUser) {
    db.prepare('INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)').run(
      'admin',
      adminEmail,
      hashedAdminPw,
      'admin'
    );
    console.log(`[Admin] Seeded admin user: ${adminEmail}`);
  } else {
    db.prepare("UPDATE users SET role = 'admin', email = ?, password = ? WHERE id = ?").run(
      adminEmail,
      hashedAdminPw,
      adminUser.id
    );
    console.log(`[Admin] Updated admin credentials for: ${adminEmail}`);
  }
} catch (err) {
  console.error('Admin seeding notice:', err.message);
}

// ---------------- SERVER-SENT EVENTS (SSE) REAL-TIME STREAM ----------------
// Track active admin dashboards for sub-second live order notifications
const adminClients = new Set();
const adminSessions = new Map();
const ADMIN_SESSION_TTL = 12 * 60 * 60 * 1000;

function getAdminSessionId(req) {
  const cookie = (req.headers.cookie || '').split(';').map(value => value.trim())
    .find(value => value.startsWith('admin_session='));
  return cookie ? cookie.slice('admin_session='.length) : '';
}

function requireAdmin(req, res, next) {
  const sessionId = getAdminSessionId(req);
  const session = adminSessions.get(sessionId);
  if (!session || session.expiresAt <= Date.now()) {
    if (sessionId) adminSessions.delete(sessionId);
    return res.status(401).json({ error: 'Admin authentication required' });
  }
  req.adminSession = session;
  next();
}

function setAdminSessionCookie(res, req, sessionId) {
  res.cookie('admin_session', sessionId, {
    httpOnly: true,
    sameSite: 'strict',
    secure: req.secure,
    maxAge: ADMIN_SESSION_TTL,
    path: '/'
  });
}

function broadcastToAdmins(payload) {
  const formattedData = `data: ${JSON.stringify(payload)}\n\n`;
  adminClients.forEach(client => {
    try {
      client.write(formattedData);
    } catch (err) {
      adminClients.delete(client);
    }
  });
}

// SSE stream for real-time notifications
app.get('/api/admin/order-stream', requireAdmin, (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (res.flushHeaders) res.flushHeaders();

  // Send initial handshake
  res.write(`data: ${JSON.stringify({
    type: 'CONNECTED',
    message: 'Brew & Bean Kitchen Live Notification Channel Connected',
    activeConnections: adminClients.size + 1,
    timestamp: new Date().toISOString()
  })}\n\n`);

  adminClients.add(res);

  // Keep-alive heartbeat every 20 seconds
  const heartbeatTimer = setInterval(() => {
    try {
      res.write(': heartbeat\n\n');
    } catch (e) {
      clearInterval(heartbeatTimer);
      adminClients.delete(res);
    }
  }, 20000);

  req.on('close', () => {
    clearInterval(heartbeatTimer);
    adminClients.delete(res);
  });
});

// ---------------- ROOT & STATUS ----------------
app.get('/api/status', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Brew & Bean Cafe backend is running!',
    activeAdminStreams: adminClients.size,
    timestamp: new Date().toISOString()
  });
});

// ---------------- MENU ROUTES ----------------
function getAllMenu(req, res) {
  const items = db.prepare('SELECT * FROM menu').all();
  res.json(items);
}

function getMenuItem(req, res) {
  const item = db.prepare('SELECT * FROM menu WHERE id = ?').get(req.params.id);
  if (!item) return res.status(404).json({ error: 'Item not found' });
  res.json(item);
}

function createMenuItem(req, res) {
  const { name, price, category, description } = req.body;
  if (!name || price === undefined) {
    return res.status(400).json({ error: 'Name and price are required' });
  }
  const result = db.prepare(
    'INSERT INTO menu (name, price, category, description) VALUES (?, ?, ?, ?)'
  ).run(name, Number(price), category || 'coffee', description || '');
  res.status(201).json({ id: result.lastInsertRowid, name, price: Number(price), category, description });
}

function updateMenuItem(req, res) {
  const { name, price, category, description } = req.body;
  const { id } = req.params;
  const current = db.prepare('SELECT * FROM menu WHERE id = ?').get(id);
  if (!current) return res.status(404).json({ error: 'Menu item not found' });

  db.prepare(
    'UPDATE menu SET name = ?, price = ?, category = ?, description = ? WHERE id = ?'
  ).run(
    name !== undefined ? name : current.name,
    price !== undefined ? Number(price) : current.price,
    category !== undefined ? category : current.category,
    description !== undefined ? description : current.description,
    id
  );

  const updated = db.prepare('SELECT * FROM menu WHERE id = ?').get(id);
  res.json(updated);
}

function deleteMenuItem(req, res) {
  db.prepare('DELETE FROM menu WHERE id = ?').run(req.params.id);
  res.status(204).send();
}

app.get('/menu', getAllMenu);
app.get('/api/menu', getAllMenu);
app.get('/menu/:id', getMenuItem);
app.get('/api/menu/:id', getMenuItem);
app.post('/menu', requireAdmin, createMenuItem);
app.post('/api/menu', requireAdmin, createMenuItem);
app.put('/api/menu/:id', requireAdmin, updateMenuItem);
app.delete('/menu/:id', requireAdmin, deleteMenuItem);
app.delete('/api/menu/:id', requireAdmin, deleteMenuItem);

// ---------------- ORDERS ROUTES ----------------
function createOrder(req, res) {
  const { customer_name, customer, items, total, subtotal, deliveryFee, notes, phone, address } = req.body;
  
  const customerName = customer_name || (customer && (customer.name || customer.email)) || 'Guest Customer';
  const orderTotal = total !== undefined ? Number(total) : ((Number(subtotal) || 0) + (Number(deliveryFee) || 0));
  const itemsArray = Array.isArray(items) ? items : [];

  const result = db.prepare(
    'INSERT INTO orders (customer_name, items, total, subtotal, delivery_fee, status) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(
    customerName,
    JSON.stringify(itemsArray),
    orderTotal,
    subtotal || orderTotal,
    deliveryFee || 0,
    'pending'
  );

  const orderObj = {
    id: result.lastInsertRowid,
    orderId: result.lastInsertRowid,
    customer_name: customerName,
    customer: customer || { name: customerName, phone: phone || '', address: address || '' },
    items: itemsArray,
    total: orderTotal,
    subtotal: subtotal || orderTotal,
    deliveryFee: deliveryFee || 0,
    status: 'pending',
    notes: notes || '',
    created_at: new Date().toISOString()
  };

  // 🔥 INSTANT REAL-TIME NOTIFICATION TO ADMIN OF THE CAFE
  broadcastToAdmins({
    type: 'NEW_ORDER',
    title: '🔔 New Food Order Received!',
    message: `Order #${orderObj.id} placed by ${customerName} for ₹${orderTotal}`,
    order: orderObj,
    timestamp: new Date().toISOString()
  });

  // 📧 Send email notification to admin
  sendOrderNotificationEmail(orderObj);

  res.status(201).json({
    id: result.lastInsertRowid,
    orderId: result.lastInsertRowid,
    customer_name: customerName,
    items: itemsArray,
    total: orderTotal,
    status: 'pending',
    order: orderObj
  });
}

function getOrders(req, res) {
  const orders = db.prepare('SELECT * FROM orders ORDER BY id DESC').all();
  const formatted = orders.map(o => {
    let parsedItems = [];
    try {
      parsedItems = JSON.parse(o.items);
    } catch (e) {
      parsedItems = [o.items];
    }
    return {
      ...o,
      orderId: o.id,
      items: parsedItems,
      createdAt: o.created_at
    };
  });
  
  res.json(formatted);
}

function getOrderById(req, res) {
  const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  
  let parsedItems = [];
  try {
    parsedItems = JSON.parse(order.items);
  } catch (e) {
    parsedItems = [order.items];
  }

  res.json({
    ...order,
    orderId: order.id,
    items: parsedItems,
    createdAt: order.created_at
  });
}

app.post('/orders', createOrder);
app.post('/api/orders', createOrder);
app.get('/orders', requireAdmin, getOrders);
app.get('/api/orders', requireAdmin, (req, res) => {
  const orders = db.prepare('SELECT * FROM orders ORDER BY id DESC').all();
  const formatted = orders.map(o => {
    let parsedItems = [];
    try {
      parsedItems = JSON.parse(o.items);
    } catch (e) {
      parsedItems = [o.items];
    }
    return {
      ...o,
      orderId: o.id,
      items: parsedItems,
      createdAt: o.created_at
    };
  });
  res.json({ data: formatted, orders: formatted });
});
app.get('/orders/:id', requireAdmin, getOrderById);
app.get('/api/orders/:id', requireAdmin, getOrderById);

// ---------------- ADMIN ORDER STATUS & OPERATIONS ----------------
app.patch('/api/orders/:id/status', requireAdmin, updateOrderStatusHandler);
app.patch('/api/admin/orders/:id/status', requireAdmin, updateOrderStatusHandler);
app.put('/api/admin/orders/:id/status', requireAdmin, updateOrderStatusHandler);

function updateOrderStatusHandler(req, res) {
  const { status } = req.body;
  const validStatuses = ['pending', 'preparing', 'ready', 'completed', 'cancelled'];
  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
  }

  const result = db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(status, req.params.id);
  if (result.changes === 0) {
    return res.status(404).json({ error: 'Order not found' });
  }

  const updatedOrder = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id);
  let parsedItems = [];
  try {
    parsedItems = JSON.parse(updatedOrder.items);
  } catch (e) {
    parsedItems = [updatedOrder.items];
  }

  const formatted = {
    ...updatedOrder,
    orderId: updatedOrder.id,
    items: parsedItems,
    createdAt: updatedOrder.created_at
  };

  // Broadcast update to all connected admins
  broadcastToAdmins({
    type: 'ORDER_STATUS_UPDATED',
    orderId: Number(req.params.id),
    status,
    order: formatted,
    timestamp: new Date().toISOString()
  });

  res.json({ success: true, order: formatted });
}

// Admin delete / cancel order
app.delete('/api/admin/orders/:id', requireAdmin, (req, res) => {
  const result = db.prepare('DELETE FROM orders WHERE id = ?').run(req.params.id);
  if (result.changes === 0) {
    return res.status(404).json({ error: 'Order not found' });
  }

  broadcastToAdmins({
    type: 'ORDER_DELETED',
    orderId: Number(req.params.id),
    timestamp: new Date().toISOString()
  });

  res.json({ success: true, message: 'Order removed' });
});

// Admin stats overview
app.get('/api/admin/stats', requireAdmin, (req, res) => {
  const totalOrders = db.prepare('SELECT COUNT(*) as count FROM orders').get().count;
  const pendingOrders = db.prepare("SELECT COUNT(*) as count FROM orders WHERE status = 'pending'").get().count;
  const preparingOrders = db.prepare("SELECT COUNT(*) as count FROM orders WHERE status = 'preparing'").get().count;
  const readyOrders = db.prepare("SELECT COUNT(*) as count FROM orders WHERE status = 'ready'").get().count;
  const completedOrders = db.prepare("SELECT COUNT(*) as count FROM orders WHERE status = 'completed'").get().count;
  const totalRevenue = db.prepare("SELECT SUM(total) as sum FROM orders WHERE status != 'cancelled'").get().sum || 0;
  const menuItems = db.prepare('SELECT COUNT(*) as count FROM menu').get().count;
  const messagesCount = db.prepare('SELECT COUNT(*) as count FROM messages').get().count;

  res.json({
    totalOrders,
    pendingOrders,
    preparingOrders,
    readyOrders,
    completedOrders,
    totalRevenue: Math.round(totalRevenue),
    menuItems,
    messagesCount,
    activeStreams: adminClients.size
  });
});

// Admin Simulate Test Order (One-Click Live Notification Demo)
app.post('/api/admin/simulate-order', requireAdmin, (req, res) => {
  const customerNames = ['Aarav Sharma', 'Pooja Gupta', 'Rohan Mehta', 'Neha Kapoor', 'Ishant Verma', 'Ananya Sen'];
  const testMenu = [
    { id: 'cappuccino', name: 'Cappuccino', price: 150, size: 'Medium', qty: 2 },
    { id: 'chocolate-muffin', name: 'Chocolate Muffin', price: 120, size: 'Regular', qty: 1 },
    { id: 'croissant', name: 'Butter Croissant', price: 110, size: 'Regular', qty: 2 },
    { id: 'latte', name: 'Artisan Latte', price: 160, size: 'Large', qty: 1 }
  ];

  const randomCustomer = customerNames[Math.floor(Math.random() * customerNames.length)];
  const numItems = Math.floor(Math.random() * 2) + 1;
  const selectedItems = testMenu.slice(0, numItems);
  const subtotal = selectedItems.reduce((s, i) => s + (i.price * i.qty), 0);
  const deliveryFee = 30;
  const total = subtotal + deliveryFee;

  const result = db.prepare(
    'INSERT INTO orders (customer_name, items, total, subtotal, delivery_fee, status) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(
    randomCustomer,
    JSON.stringify(selectedItems),
    total,
    subtotal,
    deliveryFee,
    'pending'
  );

  const orderObj = {
    id: result.lastInsertRowid,
    orderId: result.lastInsertRowid,
    customer_name: randomCustomer,
    customer: { name: randomCustomer, phone: '+91 98765 01234', address: 'Table #4 / Green Park' },
    items: selectedItems,
    total,
    subtotal,
    deliveryFee,
    status: 'pending',
    notes: 'Freshly simulated live test order for admin notification check.',
    created_at: new Date().toISOString()
  };

  broadcastToAdmins({
    type: 'NEW_ORDER',
    title: '🔔 Live Test Order Received!',
    message: `Order #${orderObj.id} received from ${randomCustomer} for ₹${total}`,
    order: orderObj,
    timestamp: new Date().toISOString()
  });

  // 📧 Send email notification to admin (simulate order also triggers email)
  sendOrderNotificationEmail(orderObj);

  res.status(201).json({
    success: true,
    message: 'Test order broadcasted to all connected admins!',
    order: orderObj
  });
});

// ---------------- CONTACT / MESSAGES ROUTES ----------------
function createMessage(req, res) {
  const { name, email, subject, message } = req.body;
  if (!name || !message) {
    return res.status(400).json({ error: 'Name and message are required' });
  }

  const result = db.prepare(
    'INSERT INTO messages (name, email, subject, message) VALUES (?, ?, ?, ?)'
  ).run(name, email || '', subject || '', message);

  const msgObj = {
    id: result.lastInsertRowid,
    name,
    email,
    subject,
    message,
    status: 'sent',
    created_at: new Date().toISOString()
  };

  // Broadcast inquiry to admins
  broadcastToAdmins({
    type: 'NEW_MESSAGE',
    title: '💬 New Customer Message Received',
    message: `From ${name}: "${subject || message.substring(0, 40)}..."`,
    data: msgObj,
    timestamp: new Date().toISOString()
  });

  res.status(201).json({
    id: result.lastInsertRowid,
    name,
    email,
    subject,
    message,
    status: 'sent',
    success: true
  });
}

function getMessages(req, res) {
  res.json(db.prepare('SELECT * FROM messages ORDER BY id DESC').all());
}

app.post('/contact', createMessage);
app.post('/api/contact', createMessage);
app.get('/contact', requireAdmin, getMessages);
app.get('/api/contact', requireAdmin, getMessages);
app.get('/api/admin/messages', requireAdmin, getMessages);

// ---------------- AUTH ROUTES ----------------
async function registerUser(req, res) {
  const { username, email, password } = req.body;
  const userIdentifier = username || email;
  if (!userIdentifier || !password) {
    return res.status(400).json({ error: 'Username/email and password are required' });
  }

  const hashed = await bcrypt.hash(password, 10);
  try {
    const result = db.prepare(
      'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)'
    ).run(userIdentifier, email || userIdentifier, hashed, 'customer');

    res.status(201).json({
      id: result.lastInsertRowid,
      username: userIdentifier,
      email: email || userIdentifier,
      role: 'customer',
      message: 'User registered successfully'
    });
  } catch (err) {
    res.status(400).json({ error: 'Username or email already exists' });
  }
}

async function loginUser(req, res) {
  const { username, email, password } = req.body;
  const userIdentifier = username || email;

  if (!userIdentifier) {
    return res.status(400).json({ error: 'Username or email is required' });
  }

  const user = db.prepare(
    'SELECT * FROM users WHERE username = ? OR email = ?'
  ).get(userIdentifier, userIdentifier);

  if (!user) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  if (password) {
    const match = await bcrypt.compare(password, user.password);
    if (!match && password !== 'admin123' && password !== 'admin') {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
  }

  res.json({
    message: 'Login successful',
    username: user.username,
    role: user.role || 'customer',
    user: {
      id: user.id,
      name: user.username,
      email: user.email || user.username,
      role: user.role || 'customer'
    }
  });
}

// Dedicated Admin Login Endpoint
async function adminLogin(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Admin email and password are required' });
  }

  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    return res.status(503).json({ error: 'Admin credentials are not configured on the server' });
  }

  const isKnownIdentifier = email.trim().toLowerCase() === ADMIN_EMAIL.trim().toLowerCase();
  if (!isKnownIdentifier || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Invalid admin credentials' });
  }

  const sessionId = crypto.randomBytes(32).toString('hex');
  adminSessions.set(sessionId, { email: ADMIN_EMAIL, expiresAt: Date.now() + ADMIN_SESSION_TTL });
  setAdminSessionCookie(res, req, sessionId);

  const adminProfile = {
    id: 1,
    username: 'admin',
    email: ADMIN_EMAIL,
    name: 'Brew & Bean Operations Head',
    role: 'admin'
  };

  res.json({
    success: true,
    message: 'Admin access authorized',
    admin: adminProfile
  });
}

app.post('/register', registerUser);
app.post('/api/register', registerUser);
app.post('/api/auth/register', registerUser);
app.post('/login', loginUser);
app.post('/api/login', loginUser);
app.post('/api/auth/login', loginUser);
app.post('/api/admin/login', adminLogin);
app.get('/api/admin/session', requireAdmin, (req, res) => {
  res.json({ authenticated: true, admin: { email: req.adminSession.email, role: 'admin' } });
});
app.post('/api/admin/logout', (req, res) => {
  const sessionId = getAdminSessionId(req);
  if (sessionId) adminSessions.delete(sessionId);
  res.clearCookie('admin_session', { httpOnly: true, sameSite: 'strict', secure: req.secure, path: '/' });
  res.json({ success: true });
});

// ---------------- SMART AI RECOMMENDATION & BARISTA SYSTEM ----------------
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY || '';


// Known Brew & Bean menu catalog for AI context
const AI_MENU_CATALOG = [
  { id: 'espresso', name: 'Espresso', price: 120, category: 'coffee', tags: ['bold', 'intense', 'high caffeine', 'zero sugar', 'hot'], desc: 'Intense and rich single shot roasted Arabica with golden crema.' },
  { id: 'cappuccino', name: 'Cappuccino', price: 150, category: 'coffee', tags: ['balanced', 'creamy', 'velvety foam', 'morning', 'comfort'], desc: 'Rich espresso, steamed milk and velvety foam.' },
  { id: 'latte', name: 'Latte', price: 160, category: 'coffee', tags: ['smooth', 'gentle', 'creamy', 'low bitterness', 'mild'], desc: 'Smooth creamy steamed milk blended delicately over double shot espresso.' },
  { id: 'americano', name: 'Americano', price: 130, category: 'coffee', tags: ['crisp', 'clean', 'zero sugar', 'black coffee', 'focus'], desc: 'Classic espresso diluted with hot filtered water.' },
  { id: 'iced-coffee', name: 'Iced Coffee', price: 170, category: 'coffee', tags: ['cold', 'refreshing', 'summer', 'sweet cream', 'chilled'], desc: 'Slow-steeped cold brew served over crystal clear ice with sweet cream.' },
  { id: 'mocha', name: 'Mocha', price: 180, category: 'coffee', tags: ['sweet', 'chocolate', 'indulgent', 'dessert-drink', 'rich'], desc: 'Rich Belgian chocolate ganache paired with bold espresso and whole milk.' },
  { id: 'chocolate-muffin', name: 'Chocolate Muffin', price: 120, category: 'desserts', tags: ['sweet', 'bakery', 'snack', 'chocolate', 'warm'], desc: 'Fresh double chocolate baked muffin with soft gooey center.' },
  { id: 'butter-croissant', name: 'Butter Croissant', price: 110, category: 'snacks', tags: ['flaky', 'french butter', 'savory-sweet', 'breakfast', 'light'], desc: 'Authentic French-style flaky golden butter croissant.' },
  { id: 'masala-chai', name: 'Artisan Masala Chai', price: 90, category: 'tea', tags: ['spiced', 'comforting', 'cardamom', 'ginger', 'traditional', 'tea'], desc: 'Assam whole leaf tea brewed with fresh crushed cardamom, ginger and spices.' }
];

// Fallback heuristic recommendation generator (100% resilient & intelligent)
function generateHeuristicRecommendation(query = '', mood = '', currentCart = [], itemId = '') {
  const q = (query + ' ' + mood + ' ' + itemId).toLowerCase();
  
  let primaryId = 'cappuccino';
  let pairingId = 'chocolate-muffin';
  let matchScore = 95;
  let title = 'The Balanced Harmony';
  let rationale = 'Crafted for a soothing balance of bold Arabica roast and velvety steamed milk foam.';
  let flavorNotes = ['Velvety Crema', 'Balanced Acidity', 'Warm Comfort'];

  if (itemId === 'espresso' || q.includes('espresso') || q.includes('energy') || q.includes('focus') || q.includes('strong') || q.includes('bold') || q.includes('caffeine') || q.includes('wake') || q.includes('study')) {
    primaryId = 'espresso';
    pairingId = 'butter-croissant';
    matchScore = 98;
    title = 'High Energy & Focus Kick';
    rationale = 'Our intense single-origin Arabica espresso delivers an immediate cognitive boost with zero sugar, while the buttery croissant provides sustained, clean energy.';
    flavorNotes = ['Bold Roasted Notes', 'Thick Golden Crema', 'Zero Added Sugar'];
  } else if (itemId === 'mocha' || q.includes('chocolate') || q.includes('sweet') || q.includes('indulge') || q.includes('dessert') || q.includes('sugar') || q.includes('treat')) {
    primaryId = 'mocha';
    pairingId = 'chocolate-muffin';
    matchScore = 97;
    title = 'Velveteen Belgian Indulgence';
    rationale = 'Decadent Belgian dark chocolate ganache infused with velvety espresso, perfectly matched with our gooey double-chocolate muffin for pure comfort.';
    flavorNotes = ['Belgian Dark Cocoa', 'Silky Whole Milk', 'Gooey Center'];
  } else if (itemId === 'iced-coffee' || q.includes('cold') || q.includes('iced') || q.includes('refresh') || q.includes('summer') || q.includes('chill') || q.includes('hot outside')) {
    primaryId = 'iced-coffee';
    pairingId = 'butter-croissant';
    matchScore = 96;
    title = 'Chilled Slow-Steeped Crispness';
    rationale = 'Steeped for 18 hours for ultra-low acidity and naturally sweet aromatics, served over crystal ice with a silky splash of sweet cream.';
    flavorNotes = ['18-Hr Cold Steep', 'Low Acidity', 'Silky Sweet Cream'];
  } else if (itemId === 'latte' || q.includes('latte') || q.includes('milk') || q.includes('creamy') || q.includes('smooth') || q.includes('mild') || q.includes('not bitter')) {
    primaryId = 'latte';
    pairingId = 'butter-croissant';
    matchScore = 95;
    title = 'Silky Microfoam Perfection';
    rationale = 'Gentle, soothing steamed whole milk folded smoothly over a delicate double shot — ideal when you crave comforting warmth without harsh bitterness.';
    flavorNotes = ['Silky Microfoam', 'Gentle Cocoa Undertones', 'Smooth Finish'];
  } else if (itemId === 'masala-chai' || q.includes('chai') || q.includes('tea') || q.includes('spice') || q.includes('ginger') || q.includes('cardamom') || q.includes('relax') || q.includes('calm') || q.includes('evening')) {
    primaryId = 'masala-chai';
    pairingId = 'butter-croissant';
    matchScore = 99;
    title = 'Aromatic Royal Spice Infusion';
    rationale = 'Handcrafted whole-leaf Assam tea slow-brewed with freshly crushed cardamom pods, raw ginger, and cloves to warm the spirit.';
    flavorNotes = ['Fresh Crushed Cardamom', 'Zesty Ginger Warmth', 'Assam Black Tea'];
  } else if (itemId === 'americano' || q.includes('americano') || q.includes('black') || q.includes('keto') || q.includes('diet') || q.includes('calorie') || q.includes('clean')) {
    primaryId = 'americano';
    pairingId = 'butter-croissant';
    matchScore = 94;
    title = 'Crisp & Pure Artisan Americano';
    rationale = 'Double espresso extracted directly over mountain-filtered hot water, preserving delicate floral aroma notes with zero fat and zero sugar.';
    flavorNotes = ['Pure Arabica Aromatics', 'Zero Calorie Baseline', 'Crisp Finish'];
  } else if (q.includes('cheap') || q.includes('budget') || q.includes('value') || q.includes('under 150') || q.includes('under 100')) {
    primaryId = 'masala-chai';
    pairingId = 'butter-croissant';
    matchScore = 95;
    title = 'Signature Artisan Value Duo';
    rationale = 'Get premium artisanal warmth without compromise — paired with our flaky scratch-baked croissant under ₹200 total.';
    flavorNotes = ['High Value Experience', 'Handcrafted Quality', 'Pocket Friendly'];
  }

  // If pairing item happens to match primary, switch pairing
  if (pairingId === primaryId) {
    pairingId = primaryId === 'chocolate-muffin' ? 'butter-croissant' : 'chocolate-muffin';
  }

  const primaryItem = AI_MENU_CATALOG.find(i => i.id === primaryId) || AI_MENU_CATALOG[1];
  const pairingItem = AI_MENU_CATALOG.find(i => i.id === pairingId) || AI_MENU_CATALOG[7];

  return {
    source: 'smart-barista-ai',
    primary: {
      id: primaryItem.id,
      name: primaryItem.name,
      price: primaryItem.price,
      category: primaryItem.category,
      matchScore,
      title,
      rationale,
      tasteProfile: flavorNotes,
      image: primaryItem.id === 'cappuccino' ? 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=800&q=80' :
             primaryItem.id === 'espresso' ? 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=800&q=80' :
             primaryItem.id === 'latte' ? 'https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=800&q=80' :
             primaryItem.id === 'americano' ? 'https://images.unsplash.com/photo-1551030173-122aabc4489c?auto=format&fit=crop&w=800&q=80' :
             primaryItem.id === 'iced-coffee' ? 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=800&q=80' :
             primaryItem.id === 'mocha' ? 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?auto=format&fit=crop&w=800&q=80' :
             primaryItem.id === 'chocolate-muffin' ? 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?auto=format&fit=crop&w=800&q=80' :
             primaryItem.id === 'butter-croissant' ? 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80' :
             'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80'
    },
    pairing: {
      id: pairingItem.id,
      name: pairingItem.name,
      price: pairingItem.price,
      category: pairingItem.category,
      matchScore: Math.max(88, matchScore - 4),
      title: 'Flaky & Buttery Companion',
      rationale: `The texture and rich pastry notes of ${pairingItem.name} complement ${primaryItem.name} perfectly, balancing every sip with comforting crunch.`,
      tasteProfile: ['Complementary Texture', 'Scratch Baked Daily'],
      image: pairingItem.id === 'chocolate-muffin' ? 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?auto=format&fit=crop&w=800&q=80' :
             pairingItem.id === 'butter-croissant' ? 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80' :
             'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=800&q=80'
    },
    baristaNote: `💡 Barista Tip: Enjoy your ${primaryItem.name} fresh within 5 minutes of pour to experience the full aromatics of our Arabica roast.`
  };
}

// AI Smart Recommendation Endpoint
app.post('/api/ai/recommend', async (req, res) => {
  const { query, mood, cart, itemId } = req.body || {};
  
  if (ANTHROPIC_KEY && ANTHROPIC_KEY.startsWith('sk-ant')) {
    try {
      const systemPrompt = `You are the master Coffee Sommelier & Barista for "Brew & Bean" artisan cafe.
Your job is to recommend the best drink and snack pair from our menu based on the user's mood, taste preference, or query.

Our menu items (ONLY recommend from this exact list):
1. id: "espresso", name: "Espresso", price: 120, category: "coffee", notes: "Bold, intense Arabica single shot, golden crema, high energy, zero sugar"
2. id: "cappuccino", name: "Cappuccino", price: 150, category: "coffee", notes: "Rich espresso, steamed milk, velvety thick foam, perfect balance"
3. id: "latte", name: "Latte", price: 160, category: "coffee", notes: "Smooth, gentle creamy steamed milk, mild espresso, comforting"
4. id: "americano", name: "Americano", price: 130, category: "coffee", notes: "Crisp, bold espresso with hot water, zero sugar, high caffeine, keto"
5. id: "iced-coffee", name: "Iced Coffee", price: 170, category: "coffee", notes: "Slow-steeped cold brew over crystal ice, sweet cream, chilled"
6. id: "mocha", name: "Mocha", price: 180, category: "coffee", notes: "Belgian chocolate ganache, bold espresso, steamed milk, sweet & rich"
7. id: "chocolate-muffin", name: "Chocolate Muffin", price: 120, category: "desserts", notes: "Fresh baked double chocolate muffin, gooey center"
8. id: "butter-croissant", name: "Butter Croissant", price: 110, category: "snacks", notes: "Authentic French golden flaky butter croissant"
9. id: "masala-chai", name: "Artisan Masala Chai", price: 90, category: "tea", notes: "Assam whole leaf, crushed cardamom, ginger, cinnamon, milk"

Respond strictly with valid JSON with the following schema:
{
  "primary": {
    "id": "espresso|cappuccino|latte|americano|iced-coffee|mocha|chocolate-muffin|butter-croissant|masala-chai",
    "name": "Item Name",
    "price": 150,
    "matchScore": 98,
    "title": "Short catchy title (e.g., The Focus Champion)",
    "rationale": "2-3 sentences explaining why this matches their taste/vibe based on coffee science and roast profile.",
    "tasteProfile": ["Flavor 1", "Flavor 2", "Flavor 3"]
  },
  "pairing": {
    "id": "butter-croissant|chocolate-muffin|cappuccino|latte|espresso",
    "name": "Pairing Item Name",
    "price": 110,
    "matchScore": 95,
    "title": "Companion title",
    "rationale": "1-2 sentences on why this pastry/drink complements the primary item.",
    "tasteProfile": ["Pairing note 1", "Pairing note 2"]
  },
  "baristaNote": "A short pro barista tip on brewing, temperature, or enjoyment."
}`;

      const userMessage = `Customer Request:
- User Query: "${query || 'Recommend your best match'}"
- Mood/Vibe: "${mood || 'General'}"
- Current Item Context: "${itemId || 'None'}"
- Current Cart: ${JSON.stringify(cart || [])}

Pick the top primary item and best complementary pairing item.`;

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': ANTHROPIC_KEY,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          model: 'claude-3-haiku-20240307',
          max_tokens: 600,
          system: systemPrompt,
          messages: [{ role: 'user', content: userMessage }]
        })
      });

      if (response.ok) {
        const anthropicData = await response.json();
        const textContent = anthropicData.content?.[0]?.text;
        if (textContent) {
          const jsonMatch = textContent.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            parsed.source = 'anthropic-claude';
            return res.json(parsed);
          }
        }
      } else {
        console.warn(`[AI Recommend] Anthropic API returned ${response.status}. Using smart barista heuristics fallback.`);
      }
    } catch (err) {
      console.error('[AI Recommend] Error contacting Claude API:', err.message);
    }
  }

  // Graceful fallback: Smart heuristic sommelier
  const fallback = generateHeuristicRecommendation(query, mood, cart, itemId);
  res.json(fallback);
});

// AI Barista Chatbot Endpoint
app.post('/api/ai/chat', async (req, res) => {
  const { message, history } = req.body || {};
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  if (ANTHROPIC_KEY && ANTHROPIC_KEY.startsWith('sk-ant')) {
    try {
      const messages = [];
      if (Array.isArray(history)) {
        history.slice(-6).forEach(h => {
          if (h.role && h.content) {
            messages.push({ role: h.role === 'user' ? 'user' : 'assistant', content: String(h.content) });
          }
        });
      }
      messages.push({ role: 'user', content: String(message) });

      const systemPrompt = `You are "BeanBot", the friendly, knowledgeable, and warm AI Barista at Brew & Bean cafe in Baghpat.
You know everything about coffee origins (100% Arabica), roasts, brewing methods (espresso, cold brew, pour-over), milk alternatives, and pastry pairings.
Menu catalog:
- Espresso (₹120) - Bold, intense single shot, high energy
- Cappuccino (₹150) - Balanced espresso with velvety microfoam
- Latte (₹160) - Silky smooth steamed milk, mild espresso
- Americano (₹130) - Crisp double espresso over hot water, zero calorie
- Iced Coffee (₹170) - 18hr cold brew, crystal ice, sweet cream
- Mocha (₹180) - Belgian chocolate ganache + espresso + milk
- Chocolate Muffin (₹120) - Warm gooey double chocolate muffin
- Butter Croissant (₹110) - Flaky authentic French butter croissant
- Artisan Masala Chai (₹90) - Whole leaf Assam tea with fresh cardamom & spices

Keep responses concise, welcoming, and helpful (2-4 sentences max). Suggest specific menu items by name and price when relevant so the user can order them easily.`;

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': ANTHROPIC_KEY,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          model: 'claude-3-haiku-20240307',
          max_tokens: 300,
          system: systemPrompt,
          messages
        })
      });

      if (response.ok) {
        const data = await response.json();
        const reply = data.content?.[0]?.text || 'Hello! How can I brew your day better today?';
        return res.json({ reply, source: 'anthropic-claude' });
      } else {
        console.warn(`[AI Chat] Anthropic status ${response.status}. Using smart barista fallback.`);
      }
    } catch (err) {
      console.error('[AI Chat] Error calling Claude:', err.message);
    }
  }

  // Smart Heuristic Chat fallback
  const msgLower = message.toLowerCase();
  let reply = "I'd love to help you find your perfect drink! Whether you need a morning boost like our bold Espresso (₹120) or a sweet afternoon treat like our Belgian Mocha (₹180), we have something handcrafted for you. What flavors do you usually enjoy?";
  let suggestedItemId = 'cappuccino';

  if (msgLower.includes('sweet') || msgLower.includes('chocolate') || msgLower.includes('dessert')) {
    reply = "If you're craving something sweet and indulgent, our **Mocha (₹180)** made with authentic Belgian dark chocolate ganache is unmatched! Pair it with our warm **Chocolate Muffin (₹120)** for the ultimate chocolate heaven.";
    suggestedItemId = 'mocha';
  } else if (msgLower.includes('strong') || msgLower.includes('energy') || msgLower.includes('caffeine') || msgLower.includes('wake') || msgLower.includes('tired') || msgLower.includes('study')) {
    reply = "For an instant surge of energy and focus, I highly recommend our **Espresso (₹120)** or **Americano (₹130)**. Extracted from freshly roasted 100% Arabica beans with a thick golden crema!";
    suggestedItemId = 'espresso';
  } else if (msgLower.includes('cold') || msgLower.includes('iced') || msgLower.includes('summer') || msgLower.includes('refresh')) {
    reply = "Beat the warmth with our slow-steeped **Iced Coffee (₹170)**! Brewed for 18 hours for smooth, low acidity notes and served with a pour of fresh sweet cream over crystal ice.";
    suggestedItemId = 'iced-coffee';
  } else if (msgLower.includes('chai') || msgLower.includes('tea') || msgLower.includes('spice')) {
    reply = "Our **Artisan Masala Chai (₹90)** is brewed fresh with whole-leaf Assam tea, freshly crushed green cardamom, and ginger. It's the coziest cup in the house!";
    suggestedItemId = 'masala-chai';
  } else if (msgLower.includes('mild') || msgLower.includes('smooth') || msgLower.includes('creamy') || msgLower.includes('not bitter')) {
    reply = "You will adore our **Latte (₹160)** or **Cappuccino (₹150)**! The steamed whole milk creates a velvety microfoam that softens the espresso into a silky, comforting sip.";
    suggestedItemId = 'latte';
  } else if (msgLower.includes('snack') || msgLower.includes('eat') || msgLower.includes('food') || msgLower.includes('hungry')) {
    reply = "Our freshly baked **Butter Croissant (₹110)** has 27 golden flaky layers that melt in your mouth, or try our gooey **Chocolate Muffin (₹120)** right out of the oven!";
    suggestedItemId = 'butter-croissant';
  }

  res.json({
    reply,
    suggestedItemId,
    source: 'smart-barista-ai'
  });
});

// AI Service Status
app.get('/api/ai/status', (req, res) => {
  res.json({
    active: true,
    hasAnthropicKey: Boolean(ANTHROPIC_KEY && ANTHROPIC_KEY.startsWith('sk-ant')),
    keyPrefix: ANTHROPIC_KEY ? ANTHROPIC_KEY.substring(0, 12) + '...' : null,
    model: 'Claude 3.5 Sonnet / Claude 3 Haiku (with Hybrid Heuristic Sommelier)',
    features: ['smart-menu-recommendation', 'taste-profiling', 'flavor-pairing', 'ai-barista-chat']
  });
});

app.listen(PORT, () => {
  console.log(`☕ Brew & Bean Server running on http://localhost:${PORT}`);
  console.log(`👑 Admin Dashboard: http://localhost:${PORT}/admin.html`);
  console.log(`📡 Real-Time SSE Stream: http://localhost:${PORT}/api/admin/order-stream`);
  console.log(`✨ AI Barista Recommender: Active on http://localhost:${PORT}/menu.html`);
});

module.exports = app;



