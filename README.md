# TechStore — Ecommerce Frontend (React + Vite)

مشروع تدريبي: واجهة متجر إلكتروني متجاوبة مبنية باستخدام **React** و **Vite** و **React Router**،
باستخدام بيانات تجريبية (Mock Data) فقط. **لا يوجد أي اتصال حقيقي بالـ API أو بقاعدة بيانات Neon
في هذه المرحلة** — سيتم الربط الفعلي في المهمة التالية.

## الأدوات والمكتبات المستخدمة
- React 19 + Vite
- react-router-dom (التنقل بين الصفحات)
- CSS عادي مع CSS Variables (Design System) — بدون أي مكتبة UI جاهزة
- Context API + useState/useEffect لإدارة الحالة
- Local Storage لحفظ السلة وبيانات تسجيل الدخول التجريبي

## متطلبات التشغيل
- Node.js 18+ و npm

## أوامر التثبيت والتشغيل والبناء
```bash
npm install
npm run dev        # تشغيل بيئة التطوير
npm run build       # بناء نسخة الإنتاج (dist/)
npm run preview     # معاينة نسخة الإنتاج محليًا
```

## بنية المجلدات
```
src/
  assets/          # صور وأيقونات
  components/
    common/        # Button, FormField, Modal, ConfirmDialog, Loader, Alert, EmptyState, Pagination, ProtectedRoute
    layout/        # Navbar, Footer
    products/      # ProductCard, CategoryCard, SearchBar
    cart/          # CartItemRow
    admin/         # AdminSidebar
  pages/           # كل صفحات العميل + مجلد admin/ لصفحات لوحة التحكم
  context/         # CartContext, AuthContext
  data/            # بيانات تجريبية: products, categories, orders, users
  hooks/           # useLocalStorage
  utils/           # format.js (تنسيق الأسعار وحالة المخزون)
  styles/          # layout.css, components.css, pages.css
  App.jsx
  main.jsx
```

## الصفحات والمسارات
| المسار | الصفحة |
|---|---|
| `/` | الصفحة الرئيسية |
| `/products` | صفحة المنتجات (بحث + تصفية + ترتيب) |
| `/products/:id` | تفاصيل المنتج |
| `/cart` | سلة المشتريات |
| `/checkout` | إتمام الطلب |
| `/login` | تسجيل الدخول |
| `/register` | إنشاء حساب |
| `/profile` | حساب المستخدم (محمي — يتطلب تسجيل دخول) |
| `/admin` + `/admin/products` + `/admin/categories` + `/admin/orders` | لوحة تحكم الأدمن (محمية — دور admin فقط) |
| `/unauthorized` | صفحة منع الوصول |
| `*` | صفحة 404 |

## المكونات الرئيسية
Navbar, Footer, ProductCard, CategoryCard, SearchBar, Button, FormField (Input),
Modal, ConfirmDialog, Loader, Alert, EmptyState, Pagination, ProtectedRoute, AdminSidebar, CartItemRow.

## حسابات الدخول التجريبية
| الدور | البريد | كلمة المرور |
|---|---|---|
| Customer | customer@demo.com | 123456 |
| Admin | admin@demo.com | admin123 |

> لا توجد أي أسرار أو كلمات مرور حقيقية — هذه بيانات تجريبية محلية فقط لأغراض العرض.

## ملاحظة مهمة
هذا المشروع يستخدم **Mock Data** بالكامل (ملفات داخل `src/data/`)، ولا يتصل بأي API حقيقي.
في المهمة التالية سيتم استبدال هذه البيانات باستدعاءات فعلية لـ REST API المبني على Neon.

## رابط النسخة المنشورة
_(أضف هنا رابط Preview بعد نشر المشروع، مثلاً عبر Vercel أو Netlify)_

## رابط المستودع
_(أضف هنا رابط GitHub الخاص بك)_
