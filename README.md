# 🇮🇳 GovScheme India – Eligibility Checker

A professional, high-performance web application designed to help Indian citizens quickly identify government schemes they are eligible for based on their unique demographic profile.

![Hero Preview](https://github.com/muzamilaminmir/gov-scheme-eligibility-checker/raw/main/hero_preview.png) *(Note: Replace with actual screenshot after push)*

## ✨ Key Features

- **🎯 Smart Rule Engine**: Automatically validates eligibility across Age, Income, State, Occupation, Gender, and Education.
- **🎓 Education-Aware**: Features hierarchical education logic (e.g., Graduate satisfies 12th Pass requirements).
- **🎨 Premium UI**: Modern glassmorphism design, sticky navigation, and professional micro-animations.
- **🔍 Real-time Search & Filter**: Instant searching by scheme name and one-click Central vs. State filtering.
- **📱 Responsive Design**: Fully optimized for mobile, tablet, and desktop viewing.
- **📤 Result Sharing**: One-click "Copy Summary" feature to share eligibility results.
- **🔒 Privacy First**: No personal data is stored; all checks are processed in real-time.

## 🛠️ Tech Stack

- **Backend**: FastAPI (Python), Pydantic
- **Frontend**: Tailwind CSS, Vanilla JavaScript, CSS3 Animations
- **Server**: Uvicorn

## 🚀 Getting Started

### Prerequisites
- Python 3.8+
- pip (Python package manager)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/muzamilaminmir/gov-scheme-eligibility-checker.git
   cd gov-scheme-eligibility-checker
   ```

2. **Setup the Backend**:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

3. **Run the Application**:
   ```bash
   python main.py
   ```

4. **Access the App**:
   Open your browser and navigate to `http://localhost:8000`.

## 📁 Project Structure

```text
├── backend/
│   ├── main.py            # FastAPI Application & Static Serving
│   ├── eligibility.py     # Hierarchical Rule Engine Logic
│   ├── schemes.json       # Database of Government Schemes
│   └── requirements.txt   # Python Dependencies
├── frontend/
│   ├── index.html         # Main UI Structure
│   ├── styles.css         # Premium Aesthetics & Animations
│   └── script.js          # API Integration & UI Logic
└── README.md              # Project Documentation
```

## 📝 Disclaimer
This tool provides information based on publicly available criteria for government schemes. Users are advised to verify details on official government portals before applying.

---
Created as part of the **30 Days 30 Projects** challenge (Day 2).
