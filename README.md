# deltastars
delta stars  شريكك الامثل للخضروات والفواكة عالية الجودة 
https://drive.google.com/file/d/1CRZwMRmKNFx9GtNhWYYGxmRkZ8dZPXJk/view?usp=drivesdk    قوم ببناء:
✅ Backend احترافي متكامل
✅ متوافق مع React
✅ نظام مستخدمين
✅ Admin Dashboard
✅ Developer Panel
✅ منتجات + صور
✅ طلبات + دفع STC Pay
✅ صلاحيات Roles
✅ مشروع حقيقي قابل للإطلاق
🧠 المعمارية النهائية لمشروعك
نسخ التعليمات البرمجية

DeltaStars (React Frontend)
        ↓
Node.js Backend API
        ↓
Supabase (Database + Auth + Storage)
        ↓
STC Pay (Payments)
🚀 ما الذي سأعطيك الآن
سأقسمها لخطوات سهلة:
1️⃣ قاعدة البيانات Supabase
2️⃣ Backend كامل Node.js
3️⃣ نظام Auth
4️⃣ Roles & Permissions
5️⃣ رفع صور المنتجات
6️⃣ Orders System
7️⃣ Payments STC Pay
8️⃣ Admin Dashboard APIs
9️⃣ Developer APIs
🗄️ 1️⃣ SQL — قاعدة البيانات
نفّذ هذا داخل Supabase SQL Editor:
نسخ التعليمات البرمجية
SQL
-- USERS
create table users (
  id uuid primary key default uuid_generate_v4(),
  name text,
  email text unique,
  role text default 'customer',
  is_vip boolean default false,
  created_at timestamp default now()
);

-- CATEGORIES
create table categories (
  id uuid primary key default uuid_generate_v4(),
  name text
);

-- PRODUCTS
create table products (
  id uuid primary key default uuid_generate_v4(),
  name text,
  description text,
  price numeric,
  stock integer,
  image_url text,
  category_id uuid references categories(id),
  created_at timestamp default now()
);

-- ORDERS
create table orders (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id),
  total_price numeric,
  status text default 'Pending',
  created_at timestamp default now()
);

-- ORDER ITEMS
create table order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid references orders(id),
  product_id uuid references products(id),
  quantity integer,
  price numeric
);

-- PAYMENTS
create table payments (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid references orders(id),
  provider text,
  amount numeric,
  status text,
  transaction_id text,
  created_at timestamp default now()
);
📦 2️⃣ Backend جاهز
🧱 تثبيت
نسخ التعليمات البرمجية
Bash
mkdir deltastars-backend
cd deltastars-backend
npm init -y
npm install express cors dotenv axios @supabase/supabase-js multer bcrypt jsonwebtoken
🔐 .env
نسخ التعليمات البرمجية
Env
PORT=5000

SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_KEY=YOUR_ANON_PUBLIC_KEY

JWT_SECRET=supersecretkey

STCPAY_TOKEN=your_token
STCPAY_BASE_URL=https://api.stcpay.com.sa
⚙️ supabase.js
نسخ التعليمات البرمجية
JavaScript
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

module.exports = supabase;
🚀 server.js (كامل احترافي)
نسخ التعليمات البرمجية
JavaScript
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const axios = require("axios");
require("dotenv").config();

const supabase = require("./supabase");

const app = express();
app.use(cors());
app.use(express.json());

/* =========================
   🔐 AUTH
========================= */

app.post("/auth/register", async (req, res) => {
  const { name, email, password } = req.body;

  const hashed = await bcrypt.hash(password, 10);

  const { data, error } = await supabase.from("users").insert([{
    name,
    email,
    role: "customer"
  }]).select().single();

  if (error) return res.status(400).json(error);

  const token = jwt.sign({ id: data.id, role: data.role }, process.env.JWT_SECRET);

  res.json({ user: data, token });
});

app.post("/auth/login", async (req, res) => {
  const { email } = req.body;

  const { data: user } = await supabase.from("users").select("*").eq("email", email).single();

  if (!user) return res.status(404).json({ error: "User not found" });

  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET);

  res.json({ user, token });
});

/* =========================
   🛡️ MIDDLEWARE
========================= */

function auth(req, res, next) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}

function admin(req, res, next) {
  if (req.user.role !== "admin") return res.status(403).json({ error: "Admin only" });
  next();
}

function developer(req, res, next) {
  if (req.user.role !== "developer") return res.status(403).json({ error: "Developer only" });
  next();
}

/* =========================
   🛍️ PRODUCTS
========================= */

app.get("/products", async (req, res) => {
  const { data } = await supabase.from("products").select("*");
  res.json(data);
});

app.post("/products", auth, admin, async (req, res) => {
  const { name, price, stock } = req.body;

  const { data, error } = await supabase.from("products")
    .insert([{ name, price, stock }]);

  if (error) return res.status(400).json(error);

  res.json(data);
});

/* =========================
   🖼️ IMAGE UPLOAD
========================= */

const upload = multer({ storage: multer.memoryStorage() });

app.post("/products/upload", auth, admin, upload.single("image"), async (req, res) => {
  const file = req.file;

  const fileName = `${Date.now()}-${file.originalname}`;

  const { data, error } = await supabase.storage
    .from("products")
    .upload(fileName, file.buffer);

  if (error) return res.status(400).json(error);

  const imageUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/products/${fileName}`;

  res.json({ imageUrl });
});

/* =========================
   📦 ORDERS
========================= */

app.post("/orders", auth, async (req, res) => {
  const { items, total_price } = req.body;

  const { data: order } = await supabase.from("orders")
    .insert([{ user_id: req.user.id, total_price }])
    .select().single();

  for (let item of items) {
    await supabase.from("order_items").insert([{
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price
    }]);
  }

  res.json(order);
});

/* =========================
   💳 STC PAY
========================= */

app.post("/payments/stcpay", auth, async (req, res) => {
  const { order_id, amount } = req.body;

  try {
    const response = await axios.post(
      `${process.env.STCPAY_BASE_URL}/payment/request`,
      {
        amount,
        currency: "SAR",
        merchantTransactionId: order_id
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.STCPAY_TOKEN}`
        }
      }
    );

    res.json({ paymentUrl: response.data.paymentUrl });

  } catch {
    res.status(500).json({ error: "Payment failed" });
  }
});

/* ========================= */

app.listen(process.env.PORT, () =>
  console.log("🚀 Server running")
);
🎯 ماذا حصلت عليه؟
✅ تسجيل مستخدمين
✅ تسجيل دخول
✅ JWT Auth
✅ Roles (Admin / Developer / Customer)
✅ Products API
✅ رفع صور
✅ Orders
✅ دفع STC Pay
✨ الخطوة التالية (سأبنيها لك إذا قلت نعم):
✅ Admin Dashboard React
✅ Developer Panel
✅ إدارة صلاحيات
✅ شاشة رفع منتجات
✅ شاشة رفع صور
✅ شاشة الطلبات
✅ شاشة العملاء VIP
✅ Analytics                  ممتاز 👌 بما أن لوحة التحكم موجودة سنضيف الآن:
✅ دمج خرائط Google
✅ نظام GPS Tracking
✅ تتبع المناديب / السواقين لحظياً
✅ متابعة الطلب Live
✅ العميل يشاهد حركة السائق على الخريطة
✅ نظام توصيل احترافي مثل Uber / HungerStation 😎
سأشرحها بأسلوب عملي قابل للتنفيذ مباشرة
🧠 الفكرة العامة للنظام
نسخ التعليمات البرمجية
Plain text
Driver App / Panel
      ↓ GPS
Node.js Backend
      ↓
Supabase Realtime
      ↓
Customer Tracking Screen (React)
      ↓
Google Maps
🗺️ 1️⃣ دمج Google Maps
✅ إنشاء API Key
اذهب إلى:
👉 https://console.cloud.google.com/�
فعّل:
✔ Maps JavaScript API
✔ Directions API
✔ Geocoding API
ثم أنشئ:
✔ API KEY
✅ داخل React (DeltaStars)
ثبت:
نسخ التعليمات البرمجية
Bash
npm install @react-google-maps/api
✅ مكون الخريطة
نسخ التعليمات البرمجية
JavaScript
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

export default function Map({ lat, lng }) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "YOUR_GOOGLE_MAPS_KEY",
  });

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      zoom={15}
      center={{ lat, lng }}
    >
      <Marker position={{ lat, lng }} />
    </GoogleMap>
  );
}
📍 2️⃣ نظام GPS Tracking
سنخزن موقع السائق في Supabase.
🗄️ جدول Drivers
نسخ التعليمات البرمجية
SQL
create table drivers (
  id uuid primary key default uuid_generate_v4(),
  name text,
  is_online boolean default false
);
🗄️ جدول Driver Locations
نسخ التعليمات البرمجية
SQL
create table driver_locations (
  id uuid primary key default uuid_generate_v4(),
  driver_id uuid references drivers(id),
  lat numeric,
  lng numeric,
  updated_at timestamp default now()
);
🚗 3️⃣ إرسال موقع السائق (React / Driver Panel)
نسخ التعليمات البرمجية
JavaScript
navigator.geolocation.watchPosition(async (position) => {
  const { latitude, longitude } = position.coords;

  await fetch("http://localhost:5000/drivers/location", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      lat: latitude,
      lng: longitude,
    }),
  });
});
🚀 4️⃣ Backend Endpoint
POST /drivers/location
نسخ التعليمات البرمجية
JavaScript
app.post("/drivers/location", auth, async (req, res) => {
  const { lat, lng } = req.body;

  await supabase
    .from("driver_locations")
    .upsert({
      driver_id: req.user.id,
      lat,
      lng,
      updated_at: new Date(),
    });

  res.json({ success: true });
});
⚡ 5️⃣ التحديث اللحظي Realtime
ميزة قوية في Supabase 🔥
👤 شاشة تتبع العميل
نسخ التعليمات البرمجية
JavaScript
useEffect(() => {
  const channel = supabase
    .channel("driver-tracking")
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "driver_locations",
      },
      (payload) => {
        setLocation(payload.new);
      }
    )
    .subscribe();

  return () => supabase.removeChannel(channel);
}, []);
🗺️ 6️⃣ عرض حركة السائق Live
نسخ التعليمات البرمجية
JavaScript
<GoogleMap center={{ lat: location.lat, lng: location.lng }} zoom={15}>
   <Marker position={{ lat: location.lat, lng: location.lng }} />
</GoogleMap>
📦 7️⃣ ربط السائق بالطلب
تعديل جدول Orders
نسخ التعليمات البرمجية
SQL
alter table orders add column driver_id uuid references drivers(id);
alter table orders add column delivery_status text default 'Preparing';
حالات التوصيل
نسخ التعليمات البرمجية
Plain text
Preparing
Assigned
On The Way
Arrived
Delivered
Cancelled
🚚 8️⃣ لوحة تحكم Admin / Delivery
✅ تعيين سائق
✅ مشاهدة السائقين على الخريطة
✅ متابعة الطلبات
🔔 9️⃣ تجربة العميل الاحترافية
العميل يرى:
✔ حالة الطلب
✔ اسم السائق
✔ موقعه Live
✔ ETA وقت الوصول
✔ إشعار "السائق وصل"
🔐 🔥 الأمان المهم
✅ لا تسمح إلا للسائق بتحديث موقعه
✅ تحقق من JWT
✅ Rate Limit لتحديث GPS
✅ WebSocket آمن
🎯 الناتج النهائي
✨ تتبع مباشر مثل Uber
✨ إدارة مناديب
✨ متابعة لحظية
✨ تجربة احترافية جداً
🚀 أستطيع الآن بناء لك:
✅ شاشة تتبع الطلب للعميل (جاهزة React)
✅ شاشة السائق Driver Panel
✅ خريطة Admin Live
✅ تعيين الطلبات للسائقين
✅ ETA محسوبة من Google Directions API                                             
إID,Product Name,Image URL,Weight Unit,Price
,Brown shmegey Mushroom تايلندي,https://i.ibb.co/F41772NQ/Brown-shmegey-Mushroom.jpg,5000g Pack,
233,فطر بلوفوت Bluefoot Mushroom,https://i.ibb.co/9mGgSXnX/233-Bluefoot-Mushroom.png,5000g Pack,
234,فطر جيرول صغير Small Girolle Mushroom,https://i.ibb.co/h11LYVyz/234-Small-Girolle-Mushroom-Kg.png,5000g Pack,
235,توت اسود طائفي Taifi Blackberries,https://i.ibb.co/qYDp8MwH/235-Taifi-Blackberries-Kg.png,5000g Pack,
,باذنجان طويل Eggplant Long,https://i.ibb.co/KjDydmBZ/Eggplant-Long-Kg5.png,5000g Pack,5
,بصل القصيم Qassim Onion,https://i.ibb.co/d4FZzq2y/Qassim-Onion-Kg-4.png,5000g Pack,4
228,بيض الغربية Gharbia Eggs,https://i.ibb.co/fz3nX6dg/228-Gharbia-Eggs-Box-185.png,5000g Pack,185
229,زهور صالحة للأكل Edible Flowers,https://i.ibb.co/W4XSf2sL/229-Edible-Flowers-Kg-170.png,5000g Pack,170
230,جوز الهند Coconut,https://i.ibb.co/XkrP8LDV/230-Coconut-PC-8.png,5000g Pack,8
231,قصب السكر Sugar Cane,https://i.ibb.co/7dHCpPp8/231-Sugar-Cane-Kg-20.png,5000g Pack,20
232,فطر ترمبيت اسود Black Trumpet Mushroom,https://i.ibb.co/jk7ndFCg/232-Black-Trumpet-Mushroom-Kg.png,5000g Pack,
223,سلة الورقيات Leafy Greens Basket,https://i.ibb.co/LLK0w5T/223-Leafy-Greens-Basket-L-30.png,5000g Pack,30
223,عجوة ملكي Royal Ajwa,https://i.ibb.co/PsX695RX/223-Royal-Ajwa-Kg-80.png,5000g Pack,80
224,رطب سكري Sukari Rutab,https://i.ibb.co/DP8JW9yC/224-Sukari-Rutab-Ctn-45.png,5000g Pack,45
225,سلة الفواكة S 50 Fruit Basket,https://i.ibb.co/qLTW9G0n/225-S-50-Fruit-Basket.png,5000g Pack,
226,صندوق الخضار Vegetable Box (M),https://i.ibb.co/LzX3fdWG/226-Vegetable-Box-M-M-75.png,5000g Pack,75
217,سكري مفتل 120 Sukari Muftal,https://i.ibb.co/RkgcY2FB/217-120-Sukari-Muftal-3-Kg.png,5000g Pack,
219,تمور صقعي القصيم Qassim Sagai,https://i.ibb.co/sdvxvp3N/219-Qassim-Sagai-Kg-55.png,5000g Pack,55
220,تمور مبروم المدينة Madinah Mabroom,https://i.ibb.co/S4VLZ5YV/220-Madinah-Mabroom-Kg-70.png,5000g Pack,70
221,صفاوي المدينة Madinah Safawi,https://i.ibb.co/7dYCmP4L/221-Madinah-Safawi-Kg-45.png,5000g Pack,45
222,تمور عنبر المدينة Madinah Amber,https://i.ibb.co/sJVby2CB/222-Madinah-Amber-Kg-90.png,5000g Pack,90
213,بصل القصيم Qassim Onion,https://i.ibb.co/FkN5Zf5Q/213-Qassim-Onion-Kg-4.png,5000g Pack,4
214,قرع أخضر طويل Long Green Squash,https://i.ibb.co/xStR8718/214-Long-Green-Squash-Kg-5-5.png,5000g Pack,5.5
215,بصل اخضر القصيم Qassim Spring onion,https://i.ibb.co/1ttvxJTg/215-Qassim-Spring-onion-Kg-4-5.jpg,5000g Pack,4.5
216,كراث القصيم Qassim Leek,https://i.ibb.co/3nPjN8x/216-Qassim-Leek-PC-1-5.png,5000g Pack,1.5
217,تمر سكري مفتل ريال Sukari Muftal,https://i.ibb.co/Lh1myk6p/217-Sukari-Muftal-3-Kg-120.png,5000g Pack,120
208,زعتر بري طازج Fresh Wild Thyme,https://i.ibb.co/vCmgT14N/208-Fresh-Wild-Thyme-Kg-58.png,5000g Pack,58
209,رواند مستورد Imported Rhubarb,https://i.ibb.co/ycmJ8MTP/209-Imported-Rhubarb-Kg-26.png,5000g Pack,26
210,كرفس طازج امريكي Fresh Celery USA,https://i.ibb.co/jkGKJSTb/210-Fresh-Celery-USA-Kg-18.png,5000g Pack,18
211,يقطين القصيم Qassim Pumpkin,https://i.ibb.co/jkGKJSTb/211-Qassim-Pumpkin-Kg-5-5.png,5000g Pack,5.5
212,فلفل شقراء حار Shaqra Chili,https://i.ibb.co/qYxQb52p/212-Shaqra-Chili-Kg-12.png,5000g Pack,12
203,بقدونس مجعد Curly Parsley,https://i.ibb.co/dJskJWrN/203-Curly-Parsley-Kg-29.png,5000g Pack,29
204,ساكورا ميكس كريس Sakura Mix Cress,https://i.ibb.co/BVyPcKQP/204-Sakura-Mix-Cress-Kg-80.png,5000g Pack,80
205,شيسو ميكس Shiso Mix,https://i.ibb.co/wrg9zMxP/205-Shiso-Mix-Kg-80.png,5000g Pack,80
206,براعم ساكورا ميكس Sakura Mix Sprouts,https://i.ibb.co/d0yWcbcL/206-Sakura-Mix-Sprouts-Kg-80.png,5000g Pack,80
207,اوراق الزعتر Thyme Leaves,https://i.ibb.co/3yKkP8b5/207-Thyme-Leaves-Kg-58.png,5000g Pack,58
197,جرجير بيبي Baby Rocket,https://i.ibb.co/FkGjmCby/197-Baby-Rocket-Kg-65.png,5000g Pack,65
199,ورق لايم كافير Kaffir Lime Leaves,https://i.ibb.co/RGShtxVq/199-Kaffir-Lime-Leaves-Kg-48.png,5000g Pack,48
200,اعشاب مايكرو Micro Herbs,https://i.ibb.co/ycRy3NQh/200-Micro-Herbs-Kg-75.png,5000g Pack,75
201,اوريغانو طازج Fresh Oregano,https://i.ibb.co/svHBLwr9/201-Fresh-Oregano-Kg-68.png,5000g Pack,68
202,بقدونس فرنسي French Parsley,https://i.ibb.co/G4Tm1jMx/202-French-Parsley-Kg-28.png,5000g Pack,28
192,Baby Gem Lettuce,https://i.ibb.co/kghpqW0q/192-Baby-Gem-Lettuce-Kg-35.png,5000g Pack,35
194,خس لولو بيوندي Lollo Bionda Lettuce,https://i.ibb.co/tpGXLhnj/194-Lollo-Bionda-Lettuce-Kg-35.png,5000g Pack,35
195,خس لولو روسو Lollo Rosso Lettuce,https://i.ibb.co/7NLPvQPD/195-Lollo-Rosso-Lettuce-Kg-35.png,5000g Pack,35
196,خس اوراق البلوط Oak Leaf Lettuce,https://i.ibb.co/S7MBpKLj/196-Oak-Leaf-Lettuce-Kg-35.png,5000g Pack,35
188,خس بوسطن Boston Lettuce,https://i.ibb.co/Z1k1vd51/188-Boston-Lettuce-Kg-35.png,5000g Pack,35
193,بوك تشوي Bok Choy,https://i.ibb.co/zTgz2z5G/193-Bok-Choy-Kg-23.png,5000g Pack,23
189,خس فريس أخضر Green Frisee Lettuce,https://i.ibb.co/pr098r7Z/189-Green-Frisee-Lettuce-Kg-35.png,5000g Pack,35
190,خس فريس أصفر Yellow Frisee Lettuce,https://i.ibb.co/1yByYj1/190-Yellow-Frisee-Lettuce-Kg-48.png,5000g Pack,48191,خس راديكيو Radicchio Lettuce,https://i.ibb.co/DDvTs5DF/191-Radicchio-Lettuce-Kg-35.png,5000g Pack,35
184,كيل هولندا Kale (Holland),https://i.ibb.co/QvtD9wxw/184-Kale-Holland-Kg-32.png,5000g Pack,32
185,كراث Leeks Imported,https://i.ibb.co/rKyrPBm5/185-Leeks-Imported-Kg-18.png,5000g Pack,18
186,ليمون غراس Lemon Grass,https://i.ibb.co/5xcRfPDW/186-Lemon-Grass-Kg-33.png,5000g Pack,33
187,ورق ليمون Lemon Leaves,https://i.ibb.co/ccxWfh0G/187-Lemon-Leaves-Kg-43.png,5000g Pack,43
188,اعشاب الطرخون Tarragon Herbs,https://i.ibb.co/jkwgpwC0/188-Tarragon-Herbs-Kg-88.png,5000g Pack,88
178,إنديف مستورد Imported Endive,https://i.ibb.co/9HMSGHq8/178-Imported-Endive-Kg-35.png,5000g Pack,35
179,إنديف أصفر Yellow Endive,https://i.ibb.co/v4Jw9hbr/179-Yellow-Endive-Kg-35.png,5000g Pack,35
180,ريحان تاي ارجواني Purple Thai Basil,https://i.ibb.co/dwCf61bV/180-Purple-Thai-Basil-Kg-86.png,5000g Pack,86
181,روزماري مستورد Imported Rosemary,https://i.ibb.co/xqNN8hQQ/181-Imported-Rosemary-Kg-58.png,5000g Pack,58
182,اعشاب الميرمية Sage Herbs,https://i.ibb.co/fYbFRt2R/182-Sage-Herbs-Kg-65.png,5000g Pack,65
174,ريحان مستورد Imported Basil,https://i.ibb.co/Q3vccT52/174-Imported-Basil-Kg-58.png,5000g Pack,58
175,شيكوري أحمر Red Chicory,https://i.ibb.co/cXwQfgxp/175-Red-Chicory-Kg-38.png,5000g Pack,38
176,شيكوري أصفر Yellow Chicory,https://i.ibb.co/xSn5GBB2/176-Yellow-Chicory-Kg-38.png,5000g Pack,38
177,ثوم معمر Chives,https://i.ibb.co/C5M8y2f6/177-Chives-Kg-70.png,5000g Pack,70
169,فجل أبيض White Radish,https://i.ibb.co/FZjpRVG/169-White-Radish-Kg-1-5.png,5000g Pack,1.5
170,كرفس محلي Local Celery,https://i.ibb.co/nsbzkr9j/170-Local-Celery-Kg-18.png,5000g Pack,18
171,براعم ألفالفا Alfalfa Sprouts,https://i.ibb.co/PzFGk7mp/171-AAlfalfa-Sprouts-PC-11.png,5000g Pack,11
172,اوراق خيزران Bamboo Leaves,https://i.ibb.co/Xfvw0Tw6/172-Bamboo-Leaves-Kg-32.png,5000g Pack,32
173,اوراق موز Banana Leaves,https://i.ibb.co/CKNBDPTJ/173-Banana-Leaves-Kg-35.png,5000g Pack,35
164,شبت Dill,https://i.ibb.co/4HM52Yc/164-Dill-PC-1-5.png,5000g Pack,1.5
165,كراث محلي Local Leek,https://i.ibb.co/8DRNVBxy/165-Local-Leek-PC-1-5.png,5000g Pack,1.5
166,خس طويل محلي Lettuce Local,https://i.ibb.co/359FHvMW/166-Lettuce-Local-Kg-7.png,5000g Pack,7
167,رجلة Purslane,https://i.ibb.co/dJW48xmc/167-Pursaane-PC-1-5.png,5000g Pack,1.5
168,فجل أحمر Red Radish,https://i.ibb.co/Ndkyk1t3/168-Red-Radish-PC-1-5.png,5000g Pack,1.5
159,جرجير Rocket Local,https://i.ibb.co/ZpF098rf/159-Rocket-Local-PC-1-5.png,5000g Pack,1.5
160,Mint,https://i.ibb.co/JFcvs60n/160-Mint-PC-1-5.png,5000g Pack,1.5
161,ملوخية Molokhia,https://i.ibb.co/39fqPkpC/161-Molokhia-Kg-6.png,5000g Pack,6
162,خس مدور محلي Round Lettuce Local,https://i.ibb.co/35fDPVLh/162-Round-Lettuce-Local-Kg-9.png,5000g Pack,9
163,سبانخ محلي Local Spinach,https://i.ibb.co/WpV5ZqTy/163-Local-Spinach-PC-1-5.png,5000g Pack,1.5
155,بطيخ طويل محلي Long Watermelon,https://i.ibb.co/sd3wDs0D/155-Long-Watermelon-Kg-3-5.png,5000g Pack,3.5
156,ليم أخضر Green Lime,https://i.ibb.co/yrQQ5Mr/156-Green-Lime-Kg-10.png,5000g Pack,10
157,كزبرة Coriander,https://i.ibb.co/G4KZpJ8q/157-Coriander-PC-1-5.png,5000g Pack,1.5
158,بقدونس محلي Parsley Local,https://i.ibb.co/S4RKPy2T/158-Parsley-Local-PC-1-5.png,5000g Pack,1.5
149,جوافة تايلاند وردية Guava,https://i.ibb.co/RTjVgWtq/149-Guava-Kg-18.png,5000g Pack,18
150,كاكا Persimmon,https://i.ibb.co/kzNd609/150-Persimmon-Kg-18.png,5000g Pack,18
151,افندي Mandarin,https://i.ibb.co/WNrP5fNp/151-Mandarin-Kg-9.png,5000g Pack,9
152,بابايا محلي Local Papaya,https://i.ibb.co/9HmLxRwV/152-Local-Papaya-Kg-8.png,5000g Pack,8
153,خوخ محلي Local Peach,https://i.ibb.co/cGJCkqH/153-Local-Peach-Kg-13.png,5000g Pack,13
144,تين محلي Local Fig,https://i.ibb.co/QjJJTNwC/144-Local-Fig-Kg-23.png,5000g Pack,23
145,جريب فروت محلي Local Grapefruit,https://i.ibb.co/0y9XW4L9/145-Local-Grapefruit-Kg-6-5.png,5000g Pack,6.5
146,عنب اسود محلي Local Black Grapes,https://i.ibb.co/HpB3L0b9/146-Local-Black-Grapes-Kg-13.png,5000g Pack,13
147,عنب أحمر محلي Local Red Grapes,https://i.ibb.co/MkXnFtGM/147-Local-Red-Grapes-Kg-13.png,5000g Pack,13
148,عنب أبيض محلي Local White Grapes,https://i.ibb.co/kshDcLvx/148-Local-White-Grapes-Kg-13.png,5000g Pack,13
139,بخارة أحمر Red Plum,https://i.ibb.co/RXbkR6f/139-Red-Plum-Kg-13.png,5000g Pack,13
140,تفاح أصفر Yellow Apple,https://i.ibb.co/202ndPpf/140-Yellow-Apple-Kg-7.png,5000g Pack,7
141,مشمش محلي Local Apricot,https://i.ibb.co/zWz2mB7r/141-Local-Apricot-Kg-16.png,5000g Pack,16
142,تين شوكي Prickly pear,https://i.ibb.co/C5QBbpgy/142-Prickly-pear-Kg-13.png,5000g Pack,13
144,Custard Apple,https://i.ibb.co/ndLLS95/144-Custard-Apple-Kg-11.png,5000g Pack,11
134,فاكهة النجمة Star Fruit,https://i.ibb.co/Wp2CtZp1/134-Star-Fruit-Kg-90.png,5000g Pack,90135,فروالة أمريكي Strawberry USA,https://i.ibb.co/Wp2CtZp1/135-Strawberry-USA-Kg-47.png,5000g Pack,47
137,نكتارين محلي Local Nectarine,https://i.ibb.co/mfn59br/137-Local-Nectarine-Kg-53.png,5000g Pack,53
138,بخارة اسود Black Plum,https://i.ibb.co/2TfdJfY/138-Black-Plum-Kg-13.png,5000g Pack,13
138,تاماريلو مستورد Imported Tamarillo,https://i.ibb.co/Vcmfk1t0/138-Imported-Tamarillo-Kg-53.png,5000g Pack,53
129,خوخ مستورد Imported Peach,https://i.ibb.co/RG0W1z4j/129-Imported-Peach-Kg-32.png,5000g Pack,32
130,فيزاليس (حرنكش) Physalis,https://i.ibb.co/R4ZC6tq6/130-Physalis-Kg-65.png,5000g Pack,65
124,لونغان مستورد Imported Longan,https://i.ibb.co/JjZSYhKQ/124-Imported-Longan-Kg-37.png,5000g Pack,37
125,ليتشي مستورد Imported Lychee,https://i.ibb.co/CrMq0qK/125-Imported-Lychee-Kg-45.png,5000g Pack,45
126,مانغوستين مستورد Imported Mangosteen,https://i.ibb.co/h1gxfTDv/126-Imported-Mangosteen-Kg36.png,5000g Pack,36
127,نكتارين امريكي Nectarine (USA),https://i.ibb.co/mVQ4wszm/127-Nectarine-USA-Kg32.png,5000g Pack,32
128,باسيون فروت Passion Fruit,https://i.ibb.co/cG2dcWC/128-Passion-Fruit-Kg-35.png,5000g Pack,35
131,رامبوتان مستورد Imported Rambutan,https://i.ibb.co/MwGmwtm/131-Imported-Rambutan-Kg-35.png,5000g Pack,35
132,توت أحمر مستورد Red Raspberries,https://i.ibb.co/Ld31Z5ZS/132-Red-Raspberries-PC-15.png,5000g Pack,15
133,كشمش أحمر Red Currants,https://i.ibb.co/mCvfYCq0/133-Red-Currants-PC-17.png,5000g Pack,17
119,غرانديلا مستوردة Imported Granadilla,https://i.ibb.co/qZ8w9zV/119-Imported-Granadilla-Kg-33.png,5000g Pack,33
120,جريب فروت وردي Pink Grapefruit,https://i.ibb.co/RpRWqDcg/120-Pink-Grapefruit-Kg-20.png,5000g Pack,20
121,شمام هوني ديو Honeydew Melon,https://i.ibb.co/JW45xXt9/121-Honeydew-Melon-Kg-22.png,5000g Pack,22
122,كيوانو هولندا Kiwano (Holland),https://i.ibb.co/rR0Tv8CL/122-Kiwano-Holland-Kg-60.png,5000g Pack,60
123,كومكوات مستورد Imported Kumquat,https://i.ibb.co/FkNXSdTs/123-Imported-Kumquat-Kg-52.jpg,5000g Pack,52
115,كرانبيري طازج Fresh Cranberry,https://i.ibb.co/F4JyPwBq/115-Fresh-Cranberry-Kg-60.png,5000g Pack,60
116,ثمرة التنين Dragon Fruit,https://i.ibb.co/wZBQ8BzK/116-Dragon-Fruit-Kg-38.png,5000g Pack,38
117,دوريان مستورد Imported Durian,https://i.ibb.co/x8rttNMs/117-imported-Durian-Kg-38.png,5000g Pack,38
118,كمثرى فوريل Forelle Pear,https://i.ibb.co/QvTVpKH6/118-Forelle-Peagr-Kg-10.png,5000g Pack,10
118,مجدول القصيم Qassim Majdool,https://i.ibb.co/F4M1qQHm/118-Qassim-Majdool-Kg-60.png,5000g Pack,60
110,توت أسود امريكي Blackberries,https://i.ibb.co/np1NFp6/110-Blackberries-PC-15.png,5000g Pack,15
111,توت أزرق مستورد Blueberries,https://i.ibb.co/np1NFp6/111-Blueberries-PC-14.png,5000g Pack,14
112,شمام كانتالوب Cantaloupe Melon,https://i.ibb.co/PvGJMyw6/112-Cantaloupe-Melon-Kg-22.png,5000g Pack,22
113,كرز امريكي USA Sherry,https://i.ibb.co/ycMdnPSg/113-USA-Sherry-Kg-80.png,5000g Pack,80
114,كرز استرالي Australian Cherry,https://i.ibb.co/p6X3x5Xp/114-Australian-Cherry-Kg-50.png,5000g Pack,50
105,شمام Sweet Melon,https://i.ibb.co/NgN5n6QW/105-Sweet-Melon-Kg-3-5.png,5000g Pack,3.5
106,بطيخ مدور محلي Round Watermelon,https://i.ibb.co/5WtDJjCg/106-Round-Watermelon-Kg3-5.png,5000g Pack,3.5
107,ليمون كبير محلي Large Local Lemon,https://i.ibb.co/5X6rcLhp/107-Large-Local-Lemon-Kg9.png,5000g Pack,9
108,ليمون صغير محلي Small Local Lemon,https://i.ibb.co/jZyXFRf3/108-Small-Local-Lemon-PC4.png,5000g Pack,4
109,مشمش مستورد (USA) Imported Apricot,https://i.ibb.co/rG8L3szH/109-USA-Imported-Apricot-Kg-35.png,5000g Pack,35
100,فروالة مصري Egyptian Strawberry,https://i.ibb.co/PZ697sZR/100-Egyptian-Strawberry-Kg20.jpg,5000g Pack,20
101,كيوي Kiwi,https://i.ibb.co/xKyCZKVz/101-Kiwi-Kg12.jpg,5000g Pack,12
102,Local Green Grapes,https://i.ibb.co/2YWCmfTJ/102-Local-Green-Grapes-Kg13.png,5000g Pack,13
103,أناناس كبير Large Pineapple,https://i.ibb.co/bMCZHn6Q/103-Large-Pineapple-Kg10.png,5000g Pack,10
104,رمان محلي Local Pomegranate,https://i.ibb.co/fYKj3hbn/104-Local-Pomegranate-Kg13.png,5000g Pack,13
95,تفاح أخضر Green Apple,https://i.ibb.co/yczsJk1j/95-Green-Apple-Kg-7.png,5000g Pack,7
96,تفاح أحمر Red Apple,https://i.ibb.co/DgHyL87b/96-Red-Apple-Kg7-5.png,5000g Pack,7.5
97,برتقال عصير Juice Orange,https://i.ibb.co/qZJNzb1/97-Juice-Orange-Kg5.png,5000g Pack,5
98,برتقال ابو سرة Navel Orange,https://i.ibb.co/DDQBNCFB/98-Navel-Orange-Kg7.png,5000g Pack,7
99,مانجو تيمور Mango Taimur,https://i.ibb.co/qLYbFL1w/99-Mango-Taimur-Kg-18.png,5000g Pack,18
90,كركم طازج Fresh Turmeric,https://i.ibb.co/gMsJcWRk/90-Fresh-Turmeric-Kg-20.png,5000g Pack,20
91,لفت ميني مستورد Imported Mini Turnip,https://i.ibb.co/zW1rdJcC/91-Imported-Mini-Turnip-Kg122.png,5000g Pack,12.2
92,كوسا بيبي مع الزهرة Baby Zucchini With Flower,https://i.ibb.co/Z1vZXsWN/92-Baby-Zucchini-With-Flower-Kg27.png,5000g Pack,27
93,موز Banana,https://i.ibb.co/fzDY3NVb/93-Banana-Kg6-5.png,5000g Pack,6.5
94,Sukari Apple,https://i.ibb.co/BHvYtKK6/94-Sukari-Apple-Kg-7.png,5000g Pack,7
85,طماطم كومب حمراء Red Kumquat Tomato,https://i.ibb.co/ZR36V7jX/85-Red-Kumquat-Tomato-Kg35.png,5000g Pack,3586,طماطم كرزية صفراء Yellow Cherry Tomato,https://i.ibb.co/MbZcw0N/86-Yellow-Cherry-Tomato-Kg35.png,5000g Pack,35
87,طماطم هيرلوم Heirloom Tomato,https://i.ibb.co/nqfx9cVg/87-Heirloom-Tomato-Kg37.jpg,5000g Pack,37
88,طماطم مارماند Marmande Tomato,https://i.ibb.co/x88RjdJD/88-Marmande-Tomato-Kg40.png,5000g Pack,40
89,طماطم روما بلوم Roma Plum Tomato,https://i.ibb.co/tTb3SkQM/89-Roma-Plum-Tomato-Kg20.png,5000g Pack,20
80,كرنب سافوي Savoy Cabbage,https://i.ibb.co/zhnVyYGQ/80-Savoy-Cabbage-Kg22.png,5000g Pack,22
81,بازلاء الثلج Snow Peas,https://i.ibb.co/nM9J8d5L/81-Snow-Peas-Kg37.png,5000g Pack,37
82,قرع أكرون أخضر Green Akron Squash,https://i.ibb.co/hJFgV0gW/82-Green-Akron-Squash-Kg26.png,5000g Pack,26
83,قرع باترونت Butternut squash,https://i.ibb.co/WNP2jyTm/83-Butternut-squash-Kg21.png,5000g Pack,21
84,طماطم كومب برتقالي Orange Kumquat Tomato,https://i.ibb.co/b5HBYJRd/84-Orange-Kumquat-Tomato-Kg38.png,5000g Pack,38
75,بطاطس بيبي Baby Potato,https://i.ibb.co/R4MnrXvq/75-Baby-Potato-Kg21.png,5000g Pack,21
76,بطاطس بيبي حمراء Red baby potato,https://i.ibb.co/fGQQBjXD/76-Red-baby-potato-Kg21.jpg,5000g Pack,21
77,بطاطس بيبي بيضاء White baby potato,https://i.ibb.co/Xx4VNS1j/77-White-baby-potato-Kg21.png,5000g Pack,21
78,بطاطس حلوه Sweet potato (USA),https://i.ibb.co/TMqm4bQk/78-Sweet-potato-USA-Kg21.png,5000g Pack,21
79,رومانيسكو ميني Mini Romanesco,https://i.ibb.co/jkgW7wpc/79-Mini-Romanesco-Kg37.png,5000g Pack,37
71,بصل أحمر جومبو Jumbo Red Onion,https://i.ibb.co/VW4zv8jz/71-Jumbo-Red-Onion-Kg-21.png,5000g Pack,21
72,بصل شالوت Shallots,https://i.ibb.co/XZ8WQSSs/72-Shallots-Kg42.jpg,5000g Pack,42
73,بصل أبيض مستورد Imported White Onion,https://i.ibb.co/4npF3Q3c/73-Imported-White-Onion-Kg15.png,5000g Pack,15
74,بازلاء خضراء Green Peas,https://i.ibb.co/qMP3Fwtk/74-Green-Peas-Kg29.png,5000g Pack,29
75,بطاطس بيبي baby potato,https://i.ibb.co/kfC20ry/75-baby-potato-Kg21.jpg,5000g Pack,21
67,فطر إنوكي Enoki Mushroom,https://i.ibb.co/Df9z5Sm8/67-Enoki-Mushroom-PC20.png,5000g Pack,20
67,فطر شيتاكي Shiitake Mushroom,https://i.ibb.co/vCwgTZMy/67-Shiitake-Mushroom-Kg74.png,5000g Pack,74
68,فطر شيميجي أبيض White Shimeji Mushroom,https://i.ibb.co/vCh8Dtc4/68-white-Shimeji-Mushroom-Kg48.png,5000g Pack,48
69,بصل لؤلؤي أحمر Red Pearl Onion,https://i.ibb.co/BKg0XYyr/69-Red-Pearl-Onion-Kg21.png,5000g Pack,21
70,بصل لؤلؤي أبيض White Pearl Onion,https://i.ibb.co/nqN1hkfq/70-white-Pearl-Onion-Kg21.png,5000g Pack,21
62,فطر بوتون بني Brown Button Mushroom,https://i.ibb.co/GQw4ngg5/62-Brown-Button-Mushroom-Kg25.jpg,5000g Pack,25
63,فطر بورشيني Porcini Mushroom,https://i.ibb.co/cSqBfJ4m/63-Porcini-Mushroom-Kg85.png,5000g Pack,85
64,فطر كستناء Chestnut Mushroom,https://i.ibb.co/yFFysFwX/64-Chestnut-Mushroom-Kg30.jpg,5000g Pack,30
65,فطر إنوكي Enoki Mushroom,https://i.ibb.co/1fBxg5jQ/65-Enoki-Mushroom-PC-20.png,5000g Pack,20
66,بورتوبيلو Portobello Mushroom,https://i.ibb.co/n83T0y04/66-Portobello-Mushroom-Kg35.png,5000g Pack,35
57,ذرة بيبي طازجة Fresh Baby Corn,https://i.ibb.co/4whQJ53f/57-Fresh-Baby-Corn-Kg-80.png,5000g Pack,80
58,خيار طويل مستورد Imported Long Cucumber,https://i.ibb.co/bMyR0zQK/58-Imported-Long-Cucumber-Kg20.png,5000g Pack,20
59,فول فافا طازج Fresh Fava Beans,https://i.ibb.co/3mmb6MSD/59-Fresh-Fava-Beans-Kg39.jpg,5000g Pack,39
60,فينل بيبي (شمر) Baby Fennel,https://i.ibb.co/dJ7xrVSf/60-Baby-Fennel-PC21.jpg,5000g Pack,21
61,كولرابي مستورد Imported Kohlrabi,https://i.ibb.co/Cs6X0Tq8/61-Imported-Kohlrabi-Kg18.png,5000g Pack,18
52,فلفل جالابينو أخضر Green Jalapeno,https://i.ibb.co/99Lm7PBP/52-Green-Jalapeno-Kg30.jpg,5000g Pack,30
53,فلفل جالابينو أحمر Red Jalapeno,https://i.ibb.co/Nd6ZdQGP/53-Red-Jalapeno-Kg-45.png,5000g Pack,45
54,فلفل جالابينو أصفر Yellow Jalapeno,https://i.ibb.co/q3zpydfX/54-Yellow-Jalapeno-Kg45.png,5000g Pack,45
55,فلفل جالابينو برتقالي Orange Jalapeno,https://i.ibb.co/zjwvSTL/55-Orange-Jalapeno-Kg-45.png,5000g Pack,45
56,فلفل أصفر روماني Roman Yellow Pepper,https://i.ibb.co/C5nyVxVW/56-Roman-Yellow-Pepper-Kg22.png,5000g Pack,22
47,كرنب أبيض مستورد Imported White Cabbage,https://i.ibb.co/WNJ6Mb1B/47-Imported-White-Cabbage-Kg17.png,5000g Pack,17
48,جزر بيبي أحمر Red Baby Carrot,https://i.ibb.co/C3cwZtvQ/48-Red-Baby-Carrot-PK-8.png,5000g Pack,8
49,جزر بيبي أصفر Yellow Baby Carrot,https://i.ibb.co/jZPT3LYN/49-Yellow-Baby-Carrot-Kg36.png,5000g Pack,36
50,جذور كرفس بيضاء Celeriac White,https://i.ibb.co/kgg1CRyN/50-Celeriac-White-Kg20.png,5000g Pack,20
51,شايوت أخضر Chayote Green,https://i.ibb.co/Z6QDbbsB/51-Chayote-Green-Kg30.png,5000g Pack,30
42,بنجر تشيوجيا Chioggia Beetroot,https://i.ibb.co/HLSLZPt5/42-Chioggia-Beetroot-Kg37.png,5000g Pack,37
43,بنجر ميني أصفر Mini Yellow Beetroot,https://i.ibb.co/PZXGH1ts/43-Mini-Yellow-Beetroot-PC22.png,5000g Pack,22
44,فلفل أخضر مستورد Imported green pepper,https://i.ibb.co/XfLDBY00/44-Imported-green-pepper-Kg27.png,5000g Pack,27
45,كرنب برسلز Brussels Sprouts,https://i.ibb.co/zVD9T4s0/45-Brussels-Sprouts-Kg25.png,5000g Pack,25
46,كرنب صيني Chinese Cabbage,https://i.ibb.co/tMjx8gF9/46-Chinese-Cabbage-Kg20.png,5000g Pack,20
37,جزر بيبي (هولندا) Baby Carrot (Holland),https://i.ibb.co/XrdcxTGz/37-Baby-Carrot-Holland-PK20.png,5000g Pack,2038,ذرة بيبي Baby Corn,https://i.ibb.co/b5WX4g0k/38-Baby-Corn-Pkt-5.png,5000g Pack,5
39,سبانخ بيبي Baby Spinach,https://i.ibb.co/KjTdXq0R/39-Baby-Spinach-Kg60.png,5000g Pack,60
40,براعم فاصوليا Bean Sprouts,https://i.ibb.co/4gJc18dt/40-Bean-Sprouts-PK8.png,5000g Pack,8
41,فاصوليا هاريكوت Haricot Beans,https://i.ibb.co/MJWfGSH/41-Haricot-Beans-PK9.png,5000g Pack,9
32,هليون بيبي Baby Asparagus,https://i.ibb.co/mVsSYXTd/32-Baby-Asparagus-PK-9.jpg,5000g Pack,9
33,هليون جومبو أخضر Green Jumbo Asparagus,https://i.ibb.co/f6TNKP2/33-Green-Jumbo-Asparagus-Kg55.png,5000g Pack,55
34,هليون أخضر Green Asparagus,https://i.ibb.co/Pv2f3sfC/34-Green-Asparagus-Kg50.png,5000g Pack,50
35,هليون أبيض White Asparagus,https://i.ibb.co/NnsQf6ny/35-white-Asparagus-Kg70.png,5000g Pack,70
36,افوكادو Avocado (USA),https://i.ibb.co/bRbWQf0c/36-Avocado-USA-Kg-30.png,5000g Pack,30
27,قلقاس Taro,https://i.ibb.co/bjKbNHLG/27-Taro-Kg12.png,5000g Pack,12
28,بركلي محلي Broccoli Local,https://i.ibb.co/s9MTsj7W/28-Broccoli-Local-Kg16.jpg,5000g Pack,16
29,ملفوف أبيض محلي White Cabbage Local,https://i.ibb.co/V08b03dF/29-White-Cabbage-Local-Kg3-5.png,5000g Pack,3.5
30,ملفوف أحمر محلي Red Cabbage Local,https://i.ibb.co/YB31t486/30-Red-Cabbage-Local-Kg4-5.png,5000g Pack,4.5
31,ارتيشوك طازج Fresh Artichoke,https://i.ibb.co/Lzcr75wf/31-fresh-Artichoke-Kg33.png,5000g Pack,33
22,رومي أحمر محلي Red Capsicum Local,https://i.ibb.co/Gf037QMW/22-Red-Capsicum-Local-Kg8.jpg,5000g Pack,8
23,رومي أصفر محلي Yellow Capsicum Local,https://i.ibb.co/x8rks4cb/23-Yellow-Capsicum-Local-Kg8.jpg,5000g Pack,8
24,باميه صغير محلي Small Okra Local,https://i.ibb.co/nqw35zDd/24-Small-Okra-Local-Kg12.png,5000g Pack,12
25,فلفل حار أحمر Red Chili,https://i.ibb.co/KjQRMDFP/25-Red-Chili-Kg8.jpg,5000g Pack,8
26,ذرة (كوز) Corn Cob,https://i.ibb.co/twvTKhhp/26-Corn-Cob-Kg12.png,5000g Pack,12
16,زنجبيل Ginger,https://i.ibb.co/TM02DR8H/16-Ginger-Kg9.png,5000g Pack,9
17,لفت محلي Turnip Local,https://i.ibb.co/YT2MWtcX/17-Turnip-Local-Kg3-5.jpg,5000g Pack,3.5
18,بنجر محلي Beetroot Local,https://i.ibb.co/0jmLsgf3/18-Beetroot-Local-Kg-5.png,5000g Pack,5
21,Eggplant white,https://i.ibb.co/SX75KW3v/21-Eggplant-white-Kg4.png,5000g Pack,4
11,زهرة (قرنبيط) Cauliflower,https://i.ibb.co/HD0x33nm/11-Cauliflower-Kg7.jpg,5000g Pack,7
13,بامية محلي Okra Local,https://i.ibb.co/BVm0KvWG/13-Okra-Local-Kg15.png,5000g Pack,15
14,فطر بوتن ابيض Button Mushroom White,https://i.ibb.co/rRj1X5nS/14-Button-Mushroom-White-Kg23.jpg,5000g Pack,23
15,افوكادو كينيا Avocado Kenya,https://i.ibb.co/yFdrR309/15-Avocado-Kenya-Kg20.jpg,5000g Pack,20
6,كوسة محلي Zucchini Local,https://i.ibb.co/M0q2XWv/6-Kg-6-Zucchini-Local.jpg,5000g Pack,6
7,باذنجان اسود مدور Eggplant Round,https://i.ibb.co/cchXHzNq/7-Eggplant-Round-Kg-3-5.jpg,5000g Pack,3.5
8,رومي اخضر محلي Green Capsicum Local,https://i.ibb.co/4Z5YrDXQ/8-Green-Capsicum-Local-Kg-6.jpg,5000g Pack,6
9,فلفل حار أخضر Green Chili,https://i.ibb.co/XrMzKPWS/9-Green-Chili-Kg9.jpg,5000g Pack,9
10,ثوم محلي Garlic Local,https://i.ibb.co/Dg8Q3p7Z/10-Garlic-Local-Kg-10.png,5000g Pack,10
1,بطاطس محلي Potato Local,https://i.ibb.co/3Y7QGw9w/1-Potato-Local-Kg-3-5.jpg,5000g Pack,3.5
2,بصل أحمر محلي Red Onion Local,https://i.ibb.co/Fkv06mnw/2-Red-Onion-Local-Kg-3-5.jpg,5000g Pack,3.5
3,طماطم مدور محلي Tomato Round Local,https://i.ibb.co/yFv6htVk/3-Tomato-Round-Local-Kg-5.png,5000g Pack,5
4,خيار محلي Cucumber Local,https://i.ibb.co/nNZ88pJZ/4-Cucumber-Local-Kg-4-5.png,5000g Pack,4.5
5,جزر محلي Carrot Local,https://i.ibb.co/XxFJFjQd/5-Carrot-Local-Kg4-5.png,5000g Pack,4.5
19,قرع عسلي Pumpkin,https://i.ibb.co/84M4rXkW/19-Pumpkin-Kg5-5-c2ed96.png,5000g Pack,5.5
154,اناناس بيبي Baby Pineapple,https://i.ibb.co/DDC0tTLy/154-Baby-Pineapple-Kg-25.png,5000g Pack,25
