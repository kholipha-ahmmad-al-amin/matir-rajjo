# Matir Rajjo: The Engineering Manifesto

<div align="center">
  <img src="./public/icon.png" alt="Matir Rajjo Logo" width="120" />
  <br />
  <h3>Where Bengali Heritage Meets World Class Software Engineering</h3>
  <p>
    <strong>Designed & Engineered by</strong><br />
    <a href="https://kholipha-ahmmad-al-amin.equisaas-bd.com/">Kholipha Ahmmad Al-Amin</a><br />
    <em>Founder & CEO, EquiSaaS BD | Principal Consultant, AR IT Consultancy</em>
  </p>
</div>

## The Problem

Bangladesh's pottery industry spans thousands of years of cultural heritage. Yet today, it faces extinction. The root cause is not a lack of craftsmanship but a lack of digital infrastructure. Local artisans create world class products but cannot reach urban consumers. Existing ecommerce platforms are too generic, visually disconnected from the handcrafted aesthetic, and fail to build the trust required for purchasing fragile, premium clay goods. The result: masterpieces collect dust in rural workshops while city dwellers buy imported plastic decor.

## The Solution

Matir Rajjo is not an ecommerce store. It is a digital preservation system for Bengali heritage, engineered with the rigor of a Silicon Valley product. We bridge the artisan to consumer gap through a stack designed for speed, trust, and conversion. Every pixel, every micro interaction, every loading state is deliberately engineered using behavioral psychology principles to maximize completion rates and customer satisfaction.

## Live Demo & Tech Stack

**Production Environment:** [https://matir-rajjo.equisaas-bd.com/](https://matir-rajjo.equisaas-bd.com/)

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | Next.js 14+ (App Router) | SSR capable React metaframework |
| **Language** | TypeScript (strict mode) | Type safety across the entire codebase |
| **State** | Zustand + persist middleware | Lightweight global state with localStorage hydration |
| **Styling** | Tailwind CSS v4 + shadcn/ui | Utility first design system with CSS variables |
| **Animation** | Framer Motion | Physics based micro interactions and page transitions |
| **3D Rendering** | React Three Fiber + Drei | Interactive 3D pot model on the landing page |
| **Backend** | Firebase Auth + Firestore | Serverless BaaS with real time capabilities |
| **Media** | Cloudinary CDN | Image optimization and delivery |
| **Deployment** | Firebase Hosting (static export) | Global CDN with zero cold starts |
| **Analytics** | Firebase Google Analytics | User behavior tracking |

## Local Setup & Run Instructions

Execute the following commands in your terminal to initialize the environment locally.

```bash
git clone https://github.com/kholipha-ahmmad-al-amin/matir-rajjo.git
cd "matir-rajjo/web"
npm install
cp .env.example .env.local
npm run dev
```
Open `http://localhost:3000` in your browser. Ensure your `.env.local` contains valid Firebase and Cloudinary credentials.

## System Documentation

### System Architecture Diagram

```mermaid
graph TD
    subgraph Client["Client Next.js (Static SPA)"]
        UI["React Components + Framer Motion"]
        Store["Zustand Global State (Auth + Cart)"]
        UI <--> Store
    end

    subgraph Firebase["Firebase Cloud"]
        Auth["Firebase Authentication (Google OAuth)"]
        DB["(Firestore Database)"]
        Hosting["Firebase Hosting (Global CDN)"]
        Analytics["Google Analytics"]
    end

    subgraph ThirdParty["Third Party Services"]
        Cloudinary["Cloudinary CDN"]
        WhatsApp["WhatsApp API (wa.me)"]
        Google["Google Identity Platform"]
    end

    Client -->|Deployed as static export| Hosting
    Client <-->|OAuth 2.0| Auth
    Auth <-->|Verify tokens| Google
    Client <-->|CRUD operations| DB
    Client -->|Upload images| Cloudinary
    Client -->|Checkout redirect| WhatsApp
    Client -->|Track events| Analytics
```

### Entity Relationship Diagram (Firebase)

```mermaid
erDiagram
    USERS ||--o{ ORDERS : places
    USERS {
        string uid PK
        string email "Firebase Auth UID"
        string displayName
        string photoURL
        string phone
        string address
        string role "admin | user"
    }

    PRODUCTS {
        string id PK
        string name
        string description
        number price
        string category
        string imageUrl
        number stock "Inventory tracking"
        boolean isFeatured
        number createdAt "Timestamp"
        number updatedAt "Timestamp"
    }

    ORDERS {
        string id PK
        string userId FK
        array items "Product snapshots"
        number totalAmount
        string status "pending | confirmed | shipped | delivered | cancelled"
        string shippingAddress
        string phone
        number createdAt
        number updatedAt
    }

    CONTACTS {
        string id PK
        string name
        string email
        string phone
        string message
        string uid "Optional auth ref"
        number createdAt
    }
```

### Data Flow Diagram (Level 0)

```mermaid
flowchart LR
    Customer((Customer))
    Admin((Admin))

    subgraph System["Matir Rajjo System"]
        Shop["Product Catalog"]
        Cart["Shopping Cart"]
        Auth["Auth Gateway"]
        Profile["User Profile"]
        Checkout["WhatsApp Checkout"]
    end

    Customer --> Auth
    Customer --> Shop
    Customer --> Cart
    Customer --> Profile
    Customer --> Checkout

    Admin --> Auth
    Admin --> AdminPanel["Admin Panel"]

    AdminPanel --> ProductMgmt["Product CRUD"]
    AdminPanel --> OrderMgmt["Order Management"]
    AdminPanel --> MessageView["Contact Messages"]

    System --> Firestore[("Firestore")]
    System --> Cloudinary[("Cloudinary")]
    System --> WhatsAppAPI["WhatsApp (wa.me)"]
```

### Data Flow Diagram (Level 1)

```mermaid
flowchart TD
    Customer((Customer))
    
    subgraph DFD1["Level 1 DFD: Checkout Process"]
        direction TB
        P1("1.0 Authenticate User")
        P2("2.0 Manage Cart")
        P3("3.0 Validate Profile")
        P4("4.0 Generate Order Payload")
        P5("5.0 Dispatch to WhatsApp")
    end

    DB[("Firestore Users")]
    Local[("Zustand State")]

    Customer -->|OAuth Credentials| P1
    P1 <-->|Token Validation| DB
    
    Customer -->|Add/Remove Items| P2
    P2 <-->|Persist State| Local
    
    P2 -->|Checkout Request| P3
    P3 <-->|Fetch Address| DB
    
    P3 -->|Valid Profile| P4
    P2 -->|Cart Data| P4
    
    P4 -->|Order String| P5
    P5 -->|Redirect| Customer
```

### Use Case Diagram

```mermaid
flowchart LR
    Customer((Customer))
    Admin(("Admin (matirrajjo@gmail.com)"))

    subgraph Platform["Matir Rajjo Platform"]
        direction TB
        UC1["Login with Google"]
        UC2["Browse Pottery Catalog"]
        UC3["Search & Filter Products"]
        UC4["Manage Shopping Cart"]
        UC5["WhatsApp Checkout"]
        UC6["Update Profile"]
        UC7["View Order History"]
        UC8["Add/Edit/Delete Products"]
        UC9["Manage Orders (Status)"]
        UC10["View Contact Messages"]
    end

    Customer --> UC1
    Customer --> UC2
    Customer --> UC3
    Customer --> UC4
    Customer --> UC5
    Customer --> UC6
    Customer --> UC7

    Admin --> UC1
    Admin --> UC8
    Admin --> UC9
    Admin --> UC10

    UC8 -.->|includes| Cloudinary[Cloudinary Upload]
```

### Sequence Diagram

```mermaid
sequenceDiagram
    actor User
    participant App as Next.js Client
    participant AuthStore as Zustand AuthStore
    participant CartStore as Zustand CartStore
    participant WA as WhatsApp

    User->>App: Clicks Order via WhatsApp

    Note over App: Labor Illusion begins
    App->>App: Show Verifying Stock... state
    Note over App: 800ms artificial delay

    App->>App: Show Preparing Order... state
    Note over App: 800ms artificial delay

    App->>AuthStore: Get user profile data
    AuthStore-->>App: {name, phone, address}

    App->>CartStore: Get cart items and total
    CartStore-->>App: [{items}, totalPrice]

    App->>App: Generate formatted message text
    Note over App: Includes order summary, delivery info, total

    App->>WA: window.open(wa.me/8801352492238?text=...)
    WA-->>User: Opens WhatsApp with pre filled order

    Note over User,App: Goal Gradient: progress bar shows completion
    Note over User,App: Zeigarnik: profile completeness reminder if incomplete
```
