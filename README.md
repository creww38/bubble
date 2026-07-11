# 🫧 BUBBLE - Bias Understanding Based Blended Learning Environment

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

Platform pembelajaran interaktif berbasis simulasi untuk meningkatkan literasi digital dan kemampuan berpikir kritis siswa SMA di Indonesia.

## ✨ Fitur Utama

- 📱 **Simulasi Media Sosial Realistis** - Instagram, Twitter, WhatsApp, Portal Berita
- 🤖 **AI Mentor** - Pembelajaran dengan metode Socratic
- 🎯 **Fact Checking** - Identifikasi 12 jenis bias kognitif
- 🎮 **Gamifikasi** - XP, Level, Badge, Leaderboard
- 📊 **Learning Analytics** - Dashboard komprehensif
- 🧠 **Critical Thinking Score** - 6 dimensi penilaian
- 🌓 **Dark/Light Mode** - UI Glassmorphism modern

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- Docker & Docker Compose (opsional)
- PostgreSQL 16+ (jika tanpa Docker)

### Development Setup

```bash
# Clone repository
git clone https://github.com/your-org/bubble-platform.git
cd bubble-platform

# Backend setup
cd backend
cp .env.example .env
npm install
npx prisma migrate dev
npm run start:dev

# Frontend setup (new terminal)
cd frontend
cp .env.example .env.local
npm install
npm run dev