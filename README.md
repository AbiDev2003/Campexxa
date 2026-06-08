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

![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
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

### Testings

![Artillery](https://img.shields.io/badge/Artillery-FF6F00?style=for-the-badge)
![Jest](https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white)
![Supertest](https://img.shields.io/badge/Supertest-000000?style=for-the-badge&logo=testinglibrary&logoColor=white)
![MongoDB Memory Server](https://img.shields.io/badge/MongoDB%20Memory%20Server-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Postman](https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white)
![OWASP ZAP](https://img.shields.io/badge/OWASP%20ZAP-000000?style=for-the-badge&logo=owasp&logoColor=white)

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

## Project Architecture Diagram

```mermaid
flowchart TD

subgraph group_core["HTTP Core"]
  node_app["App entry<br/>express composition<br/>[app.js]"]
  node_middleware["Middleware<br/>request guards<br/>[middleware.js]"]
  node_routes_campgrounds["Campground routes<br/>route layer<br/>[campgrounds.js]"]
  node_routes_reviews["Review routes<br/>route layer<br/>[reviews.js]"]
  node_routes_users["User routes<br/>route layer<br/>[users.js]"]
  node_routes_dashboard["Dashboard routes<br/>route layer<br/>[dashboard.js]"]
  node_routes_api["API routes<br/>route layer<br/>[api.js]"]
end

subgraph group_domain["Domain Layer"]
  node_campgrounds_ctrl["Campgrounds<br/>controller<br/>[campgrounds.js]"]
  node_reviews_ctrl["Reviews<br/>controller<br/>[reviews.js]"]
  node_users_ctrl["Users<br/>controller<br/>[users.js]"]
  node_dashboard_ctrl["Dashboard<br/>controller<br/>[dashboard.js]"]
  node_api_ctrl["API<br/>controller<br/>[api.js]"]
  node_campground_model[("Campground model<br/>mongoose model<br/>[campground.js]")]
  node_review_model[("Review model<br/>mongoose model<br/>[review.js]")]
  node_user_model[("User model<br/>mongoose model<br/>[user.js]")]
end

subgraph group_data["Data & Services"]
  node_schemas["Validation<br/>joi schemas<br/>[schemas.js]"]
  node_passport["Passport<br/>auth config<br/>[passport.js]"]
  node_oauth_utils["OAuth helpers<br/>oauth utility<br/>[oauth.js]"]
  node_oauth_handler["OAuth handler<br/>oauth utility<br/>[oauthHandler.js]"]
  node_cloudinary["Cloudinary<br/>upload adapter<br/>[index.js]"]
  node_paginate_resp["Paginated response<br/>response utility"]
  node_sanitize["Sanitize<br/>security utility<br/>[mongoSanitizeV5.js]"]
  node_render_partial["Partial render<br/>view utility<br/>[renderPartial.js]"]
end

subgraph group_views["Server Views"]
  node_layout["Boilerplate<br/>ejs layout<br/>[boilerplate.ejs]"]
  node_camp_cards["Camp cards<br/>ejs partials<br/>[campCardList.ejs]"]
  node_reviews_view["Review views<br/>ejs partials<br/>[reviewList.ejs]"]
  node_dashboard_view["Dashboard views<br/>ejs pages<br/>[index.ejs]"]
  node_auth_views["Auth views<br/>ejs pages<br/>[login.ejs]"]
end

subgraph group_client["Client Enhancements"]
  node_index_page["Index page<br/>browser module<br/>[indexPage.js]"]
  node_search_ui["Search & filters<br/>browser module<br/>[dynamicSearch.js]"]
  node_load_more["Infinite scroll<br/>browser module<br/>[loadMore.js]"]
  node_maps_ui["Maps & geo<br/>browser module<br/>[map.js]"]
  node_profile_ui["Profile UI<br/>browser module<br/>[profilePage.js]"]
end

node_app -->|"uses"| node_middleware
node_app -->|"mounts"| node_routes_campgrounds
node_app -->|"mounts"| node_routes_reviews
node_app -->|"mounts"| node_routes_users
node_app -->|"mounts"| node_routes_dashboard
node_app -->|"mounts"| node_routes_api
node_app -->|"configures"| node_passport
node_app -->|"integrates"| node_cloudinary
node_routes_campgrounds -->|"delegates"| node_campgrounds_ctrl
node_routes_reviews -->|"delegates"| node_reviews_ctrl
node_routes_users -->|"delegates"| node_users_ctrl
node_routes_dashboard -->|"delegates"| node_dashboard_ctrl
node_routes_api -->|"delegates"| node_api_ctrl
node_campgrounds_ctrl -->|"queries"| node_campground_model
node_campgrounds_ctrl -->|"validates"| node_schemas
node_campgrounds_ctrl -->|"formats"| node_paginate_resp
node_campgrounds_ctrl -->|"renders"| node_render_partial
node_campgrounds_ctrl -->|"uploads"| node_cloudinary
node_campgrounds_ctrl -->|"sanitizes"| node_sanitize
node_reviews_ctrl -->|"queries"| node_review_model
node_reviews_ctrl -->|"validates"| node_schemas
node_users_ctrl -->|"queries"| node_user_model
node_users_ctrl -->|"authenticates"| node_passport
node_users_ctrl -->|"uses"| node_oauth_utils
node_users_ctrl -->|"uses"| node_oauth_handler
node_dashboard_ctrl -->|"aggregates"| node_campground_model
node_dashboard_ctrl -->|"aggregates"| node_review_model
node_dashboard_ctrl -->|"reads"| node_user_model
node_api_ctrl -->|"queries"| node_campground_model
node_api_ctrl -->|"renders"| node_render_partial
node_api_ctrl -->|"formats"| node_paginate_resp
node_campground_model -.->|"constrained by"| node_schemas
node_users_ctrl -->|"validates"| node_schemas
node_reviews_ctrl -->|"protected by"| node_middleware
node_campgrounds_ctrl -->|"protected by"| node_middleware
node_layout -.->|"includes"| node_camp_cards
node_layout -.->|"includes"| node_reviews_view
node_dashboard_view -.->|"reuses"| node_camp_cards
node_dashboard_view -.->|"reuses"| node_reviews_view
node_auth_views -.->|"wraps"| node_layout
node_index_page -->|"enhances"| node_search_ui
node_index_page -->|"enhances"| node_load_more
node_index_page -->|"enhances"| node_maps_ui
node_profile_ui -->|"enhances"| node_auth_views
node_maps_ui -.->|"pairs with"| node_cloudinary

click node_app "https://github.com/abidev2003/campexxa/blob/main/app.js"
click node_middleware "https://github.com/abidev2003/campexxa/blob/main/middleware.js"
click node_routes_campgrounds "https://github.com/abidev2003/campexxa/blob/main/routes/campgrounds.js"
click node_routes_reviews "https://github.com/abidev2003/campexxa/blob/main/routes/reviews.js"
click node_routes_users "https://github.com/abidev2003/campexxa/blob/main/routes/users.js"
click node_routes_dashboard "https://github.com/abidev2003/campexxa/blob/main/routes/dashboard.js"
click node_routes_api "https://github.com/abidev2003/campexxa/blob/main/routes/api.js"
click node_campgrounds_ctrl "https://github.com/abidev2003/campexxa/blob/main/controllers/campgrounds.js"
click node_reviews_ctrl "https://github.com/abidev2003/campexxa/blob/main/controllers/reviews.js"
click node_users_ctrl "https://github.com/abidev2003/campexxa/blob/main/controllers/users.js"
click node_dashboard_ctrl "https://github.com/abidev2003/campexxa/blob/main/controllers/dashboard.js"
click node_api_ctrl "https://github.com/abidev2003/campexxa/blob/main/controllers/api.js"
click node_campground_model "https://github.com/abidev2003/campexxa/blob/main/models/campground.js"
click node_review_model "https://github.com/abidev2003/campexxa/blob/main/models/review.js"
click node_user_model "https://github.com/abidev2003/campexxa/blob/main/models/user.js"
click node_schemas "https://github.com/abidev2003/campexxa/blob/main/schemas.js"
click node_passport "https://github.com/abidev2003/campexxa/blob/main/config/passport.js"
click node_oauth_utils "https://github.com/abidev2003/campexxa/blob/main/utils/oauth.js"
click node_oauth_handler "https://github.com/abidev2003/campexxa/blob/main/utils/oauthHandler.js"
click node_cloudinary "https://github.com/abidev2003/campexxa/blob/main/cloudinary/index.js"
click node_paginate_resp "https://github.com/abidev2003/campexxa/blob/main/utils/sendPaginatedResponse.js"
click node_sanitize "https://github.com/abidev2003/campexxa/blob/main/utils/mongoSanitizeV5.js"
click node_render_partial "https://github.com/abidev2003/campexxa/blob/main/utils/renderPartial.js"
click node_layout "https://github.com/abidev2003/campexxa/blob/main/views/layouts/boilerplate.ejs"
click node_camp_cards "https://github.com/abidev2003/campexxa/blob/main/views/partials/campCardList.ejs"
click node_reviews_view "https://github.com/abidev2003/campexxa/blob/main/views/partials/reviewList.ejs"
click node_dashboard_view "https://github.com/abidev2003/campexxa/blob/main/views/dashboard/index.ejs"
click node_auth_views "https://github.com/abidev2003/campexxa/blob/main/views/users/login.ejs"
click node_index_page "https://github.com/abidev2003/campexxa/blob/main/public/javascripts/indexPage.js"
click node_search_ui "https://github.com/abidev2003/campexxa/blob/main/public/javascripts/dynamicSearch.js"
click node_load_more "https://github.com/abidev2003/campexxa/blob/main/public/javascripts/loadMore.js"
click node_maps_ui "https://github.com/abidev2003/campexxa/blob/main/public/javascripts/map.js"
click node_profile_ui "https://github.com/abidev2003/campexxa/blob/main/public/javascripts/profilePage.js"

classDef toneNeutral fill:#f8fafc,stroke:#334155,stroke-width:1.5px,color:#0f172a
classDef toneBlue fill:#dbeafe,stroke:#2563eb,stroke-width:1.5px,color:#172554
classDef toneAmber fill:#fef3c7,stroke:#d97706,stroke-width:1.5px,color:#78350f
classDef toneMint fill:#dcfce7,stroke:#16a34a,stroke-width:1.5px,color:#14532d
classDef toneRose fill:#ffe4e6,stroke:#e11d48,stroke-width:1.5px,color:#881337
classDef toneIndigo fill:#e0e7ff,stroke:#4f46e5,stroke-width:1.5px,color:#312e81
classDef toneTeal fill:#ccfbf1,stroke:#0f766e,stroke-width:1.5px,color:#134e4a
class node_app,node_middleware,node_routes_campgrounds,node_routes_reviews,node_routes_users,node_routes_dashboard,node_routes_api toneBlue
class node_campgrounds_ctrl,node_reviews_ctrl,node_users_ctrl,node_dashboard_ctrl,node_api_ctrl,node_campground_model,node_review_model,node_user_model toneAmber
class node_schemas,node_passport,node_oauth_utils,node_oauth_handler,node_cloudinary,node_paginate_resp,node_sanitize,node_render_partial toneMint
class node_layout,node_camp_cards,node_reviews_view,node_dashboard_view,node_auth_views toneRose
class node_index_page,node_search_ui,node_load_more,node_maps_ui,node_profile_ui toneIndigo
```

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

| Metric              | Standard Routes | /campgrounds (Heavy Route) |
| ------------------- | --------------- | -------------------------- |
| Performance         | 95+             | 58–60 (avg)                |
| SEO                 | 100             | 100                        |
| Accessibility       | 100             | 100                        |
| Best Practices      | 100             | 100                        |
| FCP                 | —               | 1.7s                       |
| LCP                 | —               | 2.6–2.7s                   |
| CLS                 | —               | 0                          |
| Total Blocking Time | —               | ~700ms                     |

> Audited across 10 consecutive tests on the live deployment.

### 5.2 🧪 Integration Testing (Jest & Supertest)

- **Achieved 100% Pass Consistency:** Engineered a deterministic test suite with zero flaky tests across consecutive runs, ensuring high reliability and deployment readiness.
- **Comprehensive Route Coverage:** Implemented 52 test cases across 8 suites, validating full lifecycles for Authentication, CRUD operations, Review systems, and Dashboard actions.
- **Realistic Integration Testing:** Utilized **MongoMemoryServer** to simulate real-world database behavior, enabling isolated CRUD validation and faster execution without production dependencies.
- **External Dependency Isolation:** Orchestrated full mocking for third-party services including **Mapbox**, **Cloudinary**, **Multer**, and Email APIs to ensure controlled, deterministic results.
- **Robust Edge Case Validation:** Strengthened backend resilience by explicitly testing unauthorized access, malformed request bodies, ownership-based authorization, and **ObjectId CastError** handling.
- **Optimized Test Infrastructure:** Leveraged `supertest.agent()` for persistent sessions and implemented security bypasses for CSRF and rate-limiting, maintaining a total suite runtime of ~16.5 seconds.

### 5.3 🛡️ Security Audit (OWASP ZAP)

- **Vulnerability Remediation:** Resolved 100% of medium & high-risk vulnerabilities detected by OWASP ZAP, achieving a clean security scan.
- **Strict Security Policies:** Enforced strict Content Security Policy (CSP) via **Helmet**, eliminating all inline scripts and mitigating XSS risks.
- **CSRF Hardening:** Implemented custom CSRF protection for `multipart/form-data` (file uploads) using `csurf` without breaking functionality.
- **Brute-Force Protection:** Secured authentication flows with `express-rate-limit` to mitigate automated abuse.
- **Input Sanitization:** Prevented NoSQL injection and XSS by applying **Joi** validation and MongoDB sanitize middleware.

### 5.4 💣 Load Testing (Artillery)

- **Query Optimization:** Reduced query payload significantly by using `.lean({ virtuals: true })` and selective `populate()` with field-level selection.
- **Caching Strategy:** Implemented an in-memory cache with a 30-second TTL, reducing failed requests on the campgrounds index by **~99%** under load.
- **Stress Test Results:** Load tested 4 major public routes at 5 req/sec over 60 seconds:
  - `/campgrounds` — 99.3% success (mean 3.9s)
  - `/campgrounds/:id` — 100% success (mean 659ms)
- **Capacity Mapping:** Identified a server threshold of ~7 req/sec on the Render free-tier, documenting performance degradation points for future scaling.

### 5.5 🔍 API Validation (Postman)

Verified core REST API endpoints for status codes (200, 302, 401), authentication-protected routes, and response times (<2s):

- **Auth:** Login, Register, Logout
- **Business Logic:** Campground CRUD, Review System (Create/Delete)
- **User Management:** Dashboard aggregation and profile updates

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
