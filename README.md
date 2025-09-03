# Pro-pon

> **Status:** Archived – Desgined for PRoduction (2022–2023)  

A **decentralized application (DApp)** to manage **RFPs & tenders** with **encrypted document storage on the blockchain**.  
Pro-pon was designed to ensure **fair, transparent, and tamper-proof procurement processes** by leveraging smart contracts and decentralized storage.

---

## ✨ Features

- **Publish RFPs on-chain**  
  Issue RFPs with deadlines enforced by smart contracts. Proposals remain encrypted until the closing date, preventing collusion and ensuring fair competition.

- **Encrypted storage**  
  RFP/Tenders documents stored using **Bundlr → Irys migration** for permanence and security.

- **Upgradeable contract architecture**  
  - `proponData`: stores historical data  
  - `proponLogic`: manages business logic and upgrades without altering existing records  
  This split-contract design solved **EVM contract size limits** on Polygon.

- **Frontend**  
  Built with **Next.js**, deployed on **Vercel**, connected to Polygon testnets (Mumbai → Amoy) and Polygon mainnet.

---

## 🌐 Demo

🔗 [pro-pon.vercel.app](https://pro-pon.vercel.app)  
*(Domain originally registered: [propon.me](http://propon.me))*  

---

## ⚙️ Tech Stack

- **Frontend:** Next.js, React, TailwindCSS  
- **Smart Contracts:** Solidity (Polygon Mumbai / Amoy testnets & Polygon Mainnet)  
- **Web3:** Ethers.js v5 → v6 migration  
- **Storage:** Bundlr → Irys  
- **Deployment:** Vercel  

---

## 🚀 Getting Started

Clone the repo and run locally:

```bash
yarn install
yarn dev


rovicher
July 2022
