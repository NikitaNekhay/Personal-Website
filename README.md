# NEKHAY NIKITA - Personal Portfolio & E-Commerce Platform

A full-stack web application combining a photography portfolio with an integrated online clothing store. Built for fashion designer and photographer Nikita Nekhay.

## Description

This platform serves as both a creative portfolio showcasing photography work and a fully functional e-commerce system for selling designer clothing collections. The application provides a seamless experience for visitors to browse the portfolio, view collections, purchase items, and manage their orders through a personalized user account system.

---

## Key Features & Components

### **Photography Portfolio & Gallery**
Interactive photo gallery with optimized image loading and responsive layouts.<br>
*Implementation:* Firebase Storage for image hosting, lazy loading, custom image metadata handling using piexifjs and xmp-js for EXIF data preservation.

### **E-Commerce Shop**
Complete online store with product catalog, shopping cart, and checkout system.<br>
*Implementation:* Firebase Firestore for product database, real-time inventory management, cart persistence across sessions, multi-currency support.

### **User Authentication & Profiles**
Secure user registration, login, and profile management with role-based access control.<br>
*Implementation:* Firebase Authentication with email/password, protected routes, admin/user role separation, profile editing with country selection using country-flag-icons.

### **Shopping Cart & Checkout**
Full-featured cart with multiple payment and delivery options.<br>
*Implementation:* Reactive state management using Svelte stores, contact options (Telegram, Instagram, WhatsApp, Facebook), delivery methods (EMS, CDEK, Evropochta, Self-delivery), payment types (Cash, Full payment, Installments).

### **Blog System with Comments**
Dynamic blog posts with commenting functionality and user engagement.<br>
*Implementation:* Firestore for posts/comments storage, real-time updates, markdown support, drag-and-drop image uploads for post creation.

### **Admin Dashboard**
Comprehensive admin panel for managing users, orders, and content.<br>
*Implementation:* Protected admin routes, user management table, cart monitoring, order fulfillment tracking, user statistics.

### **Multi-language Support (i18n)**
Full internationalization with English and Russian language support.<br>
*Implementation:* svelte-i18n library, language switcher in navigation, locale-based content rendering, SEO meta tags per language.

### **Email Notifications**
Automated email system for account creation, order confirmations, and updates.<br>
*Implementation:* Nodemailer integration with custom domain email (nekhaymikita@gmail.com), server-side API endpoints, templated email content for various scenarios (account creation, order processing, payment confirmations).

### **Responsive Design**
Mobile-first responsive design with custom breakpoints.<br>
*Implementation:* Tailwind CSS with custom screen sizes (sm: 374-414px, md: 415-1023px, lg: 1024-1279px, xl: 1280-1536px, 2xl: 1537px+, 3xl: 1920px+), adaptive components for different viewports.

### **SEO Optimization**
Search engine optimization with meta tags, Open Graph, and prerendering.<br>
*Implementation:* SvelteKit SSR/prerendering for key pages, dynamic meta tags, sitemap generation using generate-robotstxt.

### **Analytics & Performance Monitoring**
Integrated analytics and performance tracking.<br>
*Implementation:* Vercel Speed Insights integration, Google Analytics (gtag.js), performance monitoring.

---

## Technology Stack

| Technology | Purpose |
|-----------|---------|
| **SvelteKit 2.18** | Full-stack framework for SSR, routing, and API endpoints |
| **Svelte 5.21** | Reactive UI component framework with modern runes API |
| **TypeScript 5.7** | Type-safe development with strict null checking |
| **Firebase 11.0** | Backend services (Authentication, Firestore database, Storage) |
| **Tailwind CSS 3.3** | Utility-first CSS framework with custom design system |
| **Vite 6.0** | Build tool and development server |
| **Vercel** | Serverless deployment platform with Edge Functions |
| **Node.js 22.x** | Runtime environment (configured for Vercel deployment) |
| **ESLint 9.18** | Code linting with Svelte 5 support |
| **Prettier 3.1** | Code formatting with Svelte plugin |

### Key Libraries & Tools

| Library | Use Case |
|---------|----------|
| **svelte-i18n 4.0** | Internationalization (English/Russian) |
| **Nodemailer 7.0** | Server-side email sending |
| **country-flag-icons 1.5** | Country selection UI with flags |
| **piexifjs 1.0** | EXIF metadata handling for images |
| **xmp-js 0.0.5** | XMP metadata processing |
| **ScrollMagic 2.0** | Scroll-based animations |
| **svelte-routing 2.13** | Client-side navigation |
| **@vercel/speed-insights 1.0** | Performance monitoring |
| **Autoprefixer 10.4** | CSS vendor prefixing |
| **PostCSS 8.4** | CSS processing pipeline |

---

## Development Setup

### Prerequisites
- Node.js 22.x or higher
- npm or yarn package manager
- Firebase project with Firestore, Auth, and Storage enabled


## Project Architecture

### State Management
- `authStore`: User authentication state
- `isAdmin`: Admin role status
- Global cart state with persistence

### Database Schema (Firestore)
- **users**: User profiles with cart data
- **posts**: Blog posts with metadata
- **comments**: Post comments linked to users
- **products**: Product catalog with inventory
- **orders**: Purchase history and order tracking

### Authentication Flow
1. Firebase Authentication with email/password
2. Firestore user profile creation
3. Role-based route protection
4. Admin privilege checking

---

## Recent Updates (2025)

### Dependency Migration
- ✅ Upgraded to Svelte 5 with modern runes API
- ✅ TypeScript 5.7 with strict type checking
- ✅ ESLint 9 with flat config for Svelte 5 compatibility
- ✅ Vite 6 build system
- ✅ Updated all Firebase SDKs to v11

### Configuration Improvements
- ✅ Removed platform-specific package-lock.json
- ✅ Added `.npmrc` for better dependency resolution
- ✅ Enhanced TypeScript configuration
- ✅ Modern ESLint flat config format

