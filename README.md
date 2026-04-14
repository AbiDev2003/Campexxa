# 🏕️ Campexxa

Campexxa is a full-stack web application for discovering, creating, and reviewing outdoor and leisure spots such as campgrounds, hiking spots, and food destinations. It is built with a scalable architecture and focuses on usability, personalization, and performance.

---

## 🗺️ Overview

Campexxa enables users to explore and share "spots" for travel and leisure. Users can create listings, upload images, leave reviews, and manage their activity through a personalized dashboard.

The platform is designed with modular backend architecture, reusable frontend components, and optimized data handling techniques such as pagination and infinite scrolling.

---

## 🛠️ Tech Stack

### Backend
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express&logoColor=white)
 
### Database
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white)
 
### Frontend
![EJS](https://img.shields.io/badge/EJS-B4CA65?style=for-the-badge&logo=ejs&logoColor=black)
![Bootstrap](https://img.shields.io/badge/Bootstrap_5-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
 
### Authentication
![Passport.js](https://img.shields.io/badge/Passport.js-34E27A?style=for-the-badge&logo=passport&logoColor=white)
![Google OAuth](https://img.shields.io/badge/Google_OAuth-4285F4?style=for-the-badge&logo=google&logoColor=white)
![GitHub OAuth](https://img.shields.io/badge/GitHub_OAuth-181717?style=for-the-badge&logo=github&logoColor=white)
![Facebook OAuth](https://img.shields.io/badge/Facebook_OAuth-1877F2?style=for-the-badge&logo=facebook&logoColor=white)
 
### Cloud & Storage
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)
 
### Maps & Geolocation
![Mapbox](https://img.shields.io/badge/Mapbox-000000?style=for-the-badge&logo=mapbox&logoColor=white)
 
### Tools & Libraries
![Multer](https://img.shields.io/badge/Multer-FF6C37?style=for-the-badge&logo=npm&logoColor=white)
![Fuse.js](https://img.shields.io/badge/Fuse.js-FF6B6B?style=for-the-badge&logo=npm&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)
 

---

## ✨ Features

- Full CRUD functionality for spots
- Dynamic search with fuzzy matching
- Advanced filtering and sorting system on price, location, distance, and ratings
- Interactive maps using Mapbox
- Review and rating system
- User dashboard with tabs (spots, saved, reviews, profile)
- **Authentication:**
  - Local (username/password)
  - OAuth (Google, GitHub, Facebook)
- Image upload and management via Cloudinary and Multer
- Pagination and infinite scroll system
- Reusable EJS components for scalability
- Geolocation-based features
- Single-currency pricing system

---

## ⚙️ Engineering Highlights

### 5.1 🔧 Key Engineering Decisions

- Implemented reusable pagination + infinite scroll system using partial rendering and AJAX
- Designed modular API response handler (`sendPaginatedResponse`) for consistent frontend updates
- Abstracted OAuth logic into reusable middleware to avoid duplication across providers
- Used `lean()` + virtuals for performance optimization in MongoDB queries
- Reduced DOM re-renders using partial updates
- Implemented debounced search for better UX
- Structured dashboard with tab-based rendering to reduce route complexity

### 5.2 🔐 Security Practices

- Input validation using Joi
- Protection against NoSQL injection (`mongoSanitize`)
- Authentication with Passport.js
- Rate limiting for sensitive routes (login, forgot password)
- Session-based authentication with secure cookies

### 5.3 📈 Scalability Considerations

- Modular MVC architecture
- Reusable utility functions
- Separation of concerns (routes, controllers, utils)
- Designed to easily plug in frontend frameworks (React-ready backend)

---

## 🏗️ Architecture Highlights

- Modular MVC structure (controllers, routes, models)
- Reusable utility functions and EJS:
  - Pagination handling
  - Partial rendering for infinite scroll
  - API abstraction
- Clean separation of concerns
- Optimized rendering with partials and AJAX
- OAuth flow handled with reusable middleware

---

## 📸 Screenshots

<table>
  <tr>
    <td><img src="./screenshots/homepage.png" alt="Homepage" width="100%"/></td>
    <td><img src="./screenshots/dashboard01.png" alt="Dashboard 01" width="100%"/></td>
    <td><img src="./screenshots/dashboard02.png" alt="Dashboard 02" width="100%"/></td>
  </tr>
  <tr>
    <td align="center"><b>Homepage</b></td>
    <td align="center"><b>Dashboard 01</b></td>
    <td align="center"><b>Dashboard 02</b></td>
  </tr>
  <tr>
    <td><img src="./screenshots/dashboard03.png" alt="Dashboard 03" width="100%"/></td>
    <td><img src="./screenshots/filter.png" alt="Filter" width="100%"/></td>
    <td><img src="./screenshots/footer.png" alt="Footer" width="100%"/></td>
  </tr>
  <tr>
    <td align="center"><b>Dashboard 03</b></td>
    <td align="center"><b>Filter</b></td>
    <td align="center"><b>Footer</b></td>
  </tr>
  <tr>
    <td><img src="./screenshots/listing01.png" alt="Listing 01" width="100%"/></td>
    <td><img src="./screenshots/listing02.png" alt="Listing 02" width="100%"/></td>
    <td><img src="./screenshots/login.png" alt="Login" width="100%"/></td>
  </tr>
  <tr>
    <td align="center"><b>Listing 01</b></td>
    <td align="center"><b>Listing 02</b></td>
    <td align="center"><b>Login</b></td>
  </tr>
  <tr>
    <td><img src="./screenshots/mobile_navbar.png" alt="Mobile Navbar" width="100%"/></td>
    <td><img src="./screenshots/newform.png" alt="New Form" width="100%"/></td>
    <td><img src="./screenshots/register01.png" alt="Register 01" width="100%"/></td>
  </tr>
  <tr>
    <td align="center"><b>Mobile Navbar</b></td>
    <td align="center"><b>New Form</b></td>
    <td align="center"><b>Register 01</b></td>
  </tr>
  <tr>
    <td><img src="./screenshots/register02.png" alt="Register 02" width="100%"/></td>
    <td><img src="./screenshots/reviewPage01.png" alt="Review Page 01" width="100%"/></td>
    <td><img src="./screenshots/reviewPage02.png" alt="Review Page 02" width="100%"/></td>
  </tr>
  <tr>
    <td align="center"><b>Register 02</b></td>
    <td align="center"><b>Review Page 01</b></td>
    <td align="center"><b>Review Page 02</b></td>
  </tr>
  <tr>
    <td><img src="./screenshots/searching01.png" alt="Searching 01" width="100%"/></td>
    <td><img src="./screenshots/searching02.png" alt="Searching 02" width="100%"/></td>
    <td><img src="./screenshots/showPage.png" alt="Show Page" width="100%"/></td>
  </tr>
  <tr>
    <td align="center"><b>Searching 01</b></td>
    <td align="center"><b>Searching 02</b></td>
    <td align="center"><b>Show Page</b></td>
  </tr>
</table>

---

## 🚀 Live Link

[View Live App](https://campexxa.onrender.com)

---

## ⚡ Testings

### 5.1 🚀 Performance (Lighthouse)
Lighthouse audit results across all routes:

| Metric | Standard Routes | /campgrounds (Heavy Route) |
|---|---|---|
| Performance | 95+ | 58–60 (avg) |
| SEO | 100 | 100 |
| Accessibility | 100 | 100 |
| Best Practices | 100 | 100 |
| FCP | — | 1.7s |
| LCP | — | 2.6–2.7s |
| CLS | — | 0 |
| Total Blocking Time | — | ~700ms |

> Audited across 10 consecutive tests on the live deployment.

### 5.2 🧪 Integration Testing (Jest & Supertest)
* **Achieved 100% Pass Consistency:** Engineered a deterministic test suite with zero flaky tests across consecutive runs, ensuring high reliability and deployment readiness.
* **Comprehensive Route Coverage:** Implemented 52 test cases across 8 suites, validating full lifecycles for Authentication, CRUD operations, Review systems, and Dashboard actions.
* **Realistic Integration Testing:** Utilized **MongoMemoryServer** to simulate real-world database behavior, enabling isolated CRUD validation and faster execution without production dependencies.
* **External Dependency Isolation:** Orchestrated full mocking for third-party services including **Mapbox**, **Cloudinary**, **Multer**, and Email APIs to ensure controlled, deterministic results.
* **Robust Edge Case Validation:** Strengthened backend resilience by explicitly testing unauthorized access, malformed request bodies, ownership-based authorization, and **ObjectId CastError** handling.
* **Optimized Test Infrastructure:** Leveraged `supertest.agent()` for persistent sessions and implemented security bypasses for CSRF and rate-limiting, maintaining a total suite runtime of ~16.5 seconds.

### 5.3 🛡️ Security Audit (OWASP ZAP)
* **Vulnerability Remediation:** Resolved 100% of medium & high-risk vulnerabilities detected by OWASP ZAP, achieving a clean security scan.
* **Strict Security Policies:** Enforced strict Content Security Policy (CSP) via **Helmet**, eliminating all inline scripts and mitigating XSS risks.
* **CSRF Hardening:** Implemented custom CSRF protection for `multipart/form-data` (file uploads) using `csurf` without breaking functionality.
* **Brute-Force Protection:** Secured authentication flows with `express-rate-limit` to mitigate automated abuse.
* **Input Sanitization:** Prevented NoSQL injection and XSS by applying **Joi** validation and MongoDB sanitize middleware.

### 5.4 💣 Load Testing (Artillery)
* **Query Optimization:** Reduced query payload significantly by using `.lean({ virtuals: true })` and selective `populate()` with field-level selection.
* **Caching Strategy:** Implemented an in-memory cache with a 30-second TTL, reducing failed requests on the campgrounds index by **~99%** under load.
* **Stress Test Results:** Load tested 4 major public routes at 5 req/sec over 60 seconds:
    * `/campgrounds` — 99.3% success (mean 3.9s)
    * `/campgrounds/:id` — 100% success (mean 659ms)
* **Capacity Mapping:** Identified a server threshold of ~7 req/sec on the Render free-tier, documenting performance degradation points for future scaling.

### 5.5 🔍 API Validation (Postman)
Verified core REST API endpoints for status codes (200, 302, 401), authentication-protected routes, and response times (<2s):
* **Auth:** Login, Register, Logout
* **Business Logic:** Campground CRUD, Review System (Create/Delete)
* **User Management:** Dashboard aggregation and profile updates

> Audited across 10 consecutive tests on the live deployment.

> **Production-Ready Backend:** This comprehensive testing architecture ensures high reliability and 100% functional coverage. 
> 📂 **View Test Implementation:** [Jest & Supertest](https://github.com/AbiDev2003/Campexxa/tree/main/tests) | [Artillery Config](https://github.com/AbiDev2003/Campexxa/tree/main/artillery-tests) | [Postman Collections](https://github.com/AbiDev2003/Campexxa/tree/main/docs)

## 🔮 Future Improvements

- Improved UI using Tailwind CSS
- Migration to a modern frontend framework (e.g., React)
- Caching layer for faster response times
- Real-time chat between users
- Multi-currency pricing system
- Real-time email notifications for login and other web app activities

---

## 💡 Technical Learnings and blogs

This project includes practical solutions to real-world issues such as:

- Preserving `returnTo` across OAuth flows using `res.locals`
- Handling session persistence during redirects
- Implementing reusable infinite scroll architecture
- Managing dynamic UI updates without frontend frameworks. 
- Mongo virtuals disappear after using lean() in backend.

Here are a few blogs which i published on hashnode, during development of this project. 
- [Blog 1 – OAuth returnTo fix](https://redirect-after-login-bug-in-express.hashnode.dev/fixing-the-redirect-after-login-bug-in-expressjs-passportjs)
- [Blog 2 – Pagination Vs Infinite scroll architecture](https://pagination-vs-infinite-scroll.hashnode.dev/pagination-vs-infinite-scroll-which-ui-should-you-implement)
- [Blog 3 – Dynamic Searching](https://dynamicsearch.hashnode.dev/normal-search-vs-dynamic-search-how-modern-apps-actually-do-it)
- [Blog 4 – Mongoose virtual disappear after .lean()](https://mongo-virtuals-disappear-bug.hashnode.dev/when-mongoose-virtuals-disappear-understanding-the-lean-tradeoff)

---

## 👤 Author

**Abinash Dash**

- GitHub: [AbiDev2003](https://github.com/AbiDev2003)
- LinkedIn: [abinashdev](https://www.linkedin.com/in/abinashdev/)