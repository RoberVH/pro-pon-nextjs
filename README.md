# Pro-pon

> **Status:** Archived – Desgined for Production (2022–2023)  

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

- **eMail services**  
  Built with Mailjet API

- **Contracts**  
  [Solidity contracts Repo](https://github.com/RoberVH/pro-pon-splited-contracts)  
  Polygon Data Contract: ``0xedD7Ac427925b9FB47Fc2DE15fc4fcBf38a0a528``  
  Polygon Logic Contract: ``0x0460eF91b96be3a5ab6Ee31BeBd41CF77Ff5188D``  
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

## 📌 Notes

- Project reached the **pre-beta stage**, with full deployment to testnet and mainnet.  
- Challenges encountered:  
  - Difficulty generating an initial user base, which paused further adoption.  
  - Migration from **Bundlr → Irys** stalled since, at that time, there was no clear path for esential feature server side payment.  
  - Breaking changes with **ethers.js v6**, which required rewriting major parts of the code.  
- Despite these challenges, the project showcases a **production-oriented design** and end-to-end Web3 stack implementation.  
- This repository is **archived** as a milestone in development.
- Prod deployed to Vercel [propon.me](http://propon.me) / Smart Contracts deployed to Polygon

---

## 🚀 Getting Started

Clone the repo and run locally:

```bash
yarn install
yarn dev
```

rovicher
July 2022
