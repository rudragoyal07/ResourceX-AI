# 🏥 ResourceX AI
> **Where Emergency Resources Flow & Grow**  
> An Intelligent Resource Matchmaking & Logistics Coordination Network designed to optimize disaster relief and emergency supplies routing.

🌐 **Live Deployed App:** [https://resource-x-ai.vercel.app/](https://resource-x-ai.vercel.app/)

## 📄 Project Report

[📥 View Project Report](./ResourceX%20AI%20project%20report.pdf)

---

## 💡 The Problem (Why We Need ResourceX AI)
In times of crisis (natural disasters, pandemics, or localized accidents), medical and emergency supplies are often available but critically misallocated:
* **Siloed Inventories:** Hospitals facing shortages cannot easily see nearby NGO or supply warehouse surpluses.
* **Critical Waste:** Expensive medicines, blood reserves, and equipment sit idle and expire in one facility, while another nearby facility faces acute shortages.
* **Logistics Bottlenecks:** Slow dispatch times, uncoordinated routing, and a lack of real-time transit visibility delay life-saving deliveries.
* **Trust Deficit:** Agencies hesitate to coordinate during crises due to concerns over inventory accuracy and delivery fulfillment.

---

## 🚀 The Solution (What ResourceX AI is For)
**ResourceX AI** solves emergency misallocation by establishing a unified, cooperative coordination network that connects supply warehouses, trauma clinics, NGOs, and hospitals in real-time.

### Key Capabilities:
1. **Interactive Mapping & Geo-Location (Leaflet.js):** 
   * Pinpoint coordinates, visual route traces, and live simulated drone/vehicle transit animations.
2. **AI-Powered Matchmaking Engine:**
   * Automatically pairs surplus nodes with deficit nodes, matching critical shortages (e.g., ICU Ventilators, Oxygen Cylinders) with available regional stock.
3. **Trust Certified Rating system:**
   * Tracks listing accuracy and successful emergency handovers. Reliable nodes are awarded a **"Trust Certified" badge**, prioritizing them in the automated AI matching queue.
4. **User Profile Popover Panel:**
   * Quick-edit facility details, update role configurations, and upload custom avatars (saved persistently via Base64).
5. **Real-time Alert Ticker:**
   * A dynamic banner showing live network events, pending shortage alarms, and active logistics transfers.
6. **AI Assistant Copilot:**
   * An on-screen assistant providing suggestions, safety warnings, and logistics optimization insights.

---

## 🛠️ Technical Stack
The platform is built using modern, fast, and light-weight technologies to ensure high performance and accessibility:

* **Core Framework:** [Next.js 15](https://nextjs.org/) (React 19) inside a Server/Client structure.
* **Styling & Layout:** [Tailwind CSS v4](https://tailwindcss.com/) with a custom sky-blue and white card theme, dynamic gradients, and modern premium animations.
* **Interactive Maps:** [Leaflet](https://leafletjs.com/) and [React-Leaflet](https://react-leaflet.js.org/) for rendering geographic coordinates and route lines.
* **Animations:** [Framer Motion](https://www.framer.com/motion/) for smooth modal transitions, profile popovers, and slide-up assistant widgets.
* **State Management & Database:** Custom React `AppContext` coupled with persistent browser caching via `localStorage`.

---


## 💎 Design System & Aesthetic Customization
The application adopts a **premium sky blue and white card** visual language:
* **Background:** Soft sky-blue layout (`bg-[#e0f2fe]`) for maximum visual comfort.
* **Containers:** Clean, crisp white cards (`bg-slate-900`) with rounded edges and soft borders (`border-slate-200`).
* **Header Navbar:** Floating light frosted-glass nav bar with a dark accent button and responsive logo branding.
* **Onboarding Modal:** Fully responsive 3-step wizard (Authentication, Profile Map Picking, Stock Seeding) aligned with the light mode palette.

---

## 🏆 Project Recognition
Built for the **E-Cell IIT Roorkee Hackathon** as an intelligent logistics coordinator for emergency relief.
