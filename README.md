# Folyo

**Professional Cryptocurrency Portfolio Tracker**

![License](https://img.shields.io/badge/license-Proprietary-red.svg)
![Version](https://img.shields.io/badge/version-2.1-blue.svg)

---

## About

Folyo is a comprehensive cryptocurrency portfolio management platform that helps you track your digital assets, monitor market movements, and analyze DEX trading pairs across multiple blockchain networks.

**🚀 Live Platform**: [https://folyo.tech](https://folyo.tech)

---

## Key Features

### Portfolio Management
- Track unlimited cryptocurrency holdings across multiple portfolios
- Real-time portfolio valuation in 93+ fiat currencies
- Detailed profit & loss analysis with historical performance tracking
- Transaction history with buy/sell tracking
- Portfolio-level and asset-level analytics

### Market Data
- Live price data for 100+ cryptocurrencies
- Historical price charts with interactive visualization
- 1-hour, 24-hour, and 7-day price change indicators
- Market cap, volume, and circulating supply metrics
- Multi-currency support with automatic conversion

### DEX Trading Analytics
- Real-time DEX pair tracking across 8+ blockchain networks
- Liquidity pool analysis with volume and TVL metrics
- Trading pair price movements and volatility indicators
- Support for major DEXs: Uniswap, PancakeSwap, SushiSwap, and more
- Contract address verification with blockchain explorer integration

---

## Technology Stack

### Backend
- **PHP 8.2+** - Modern server-side logic
- **MariaDB** - Robust relational database
- **Redis** - High-performance caching layer (6x speed improvement)

### Frontend
- **Vanilla JavaScript (ES6+)** - No framework dependencies
- **HTML5/CSS3** - Responsive modern design
- **Canvas API** - Smooth chart rendering

### Architecture
- RESTful API design
- Prepared statements for SQL security
- bcrypt password hashing
- CSRF protection
- Session-based authentication
- HttpOnly secure cookies

### External APIs
- CoinMarketCap Pro API for comprehensive market data
- DEX data integration for decentralized exchange analytics

---

## Project Structure

```
folyo/
├── api/                    # Backend API endpoints
│   ├── auth.php           # Authentication logic
│   ├── crypto.php         # Cryptocurrency data
│   ├── portfolio.php      # Portfolio management
│   └── dex.php            # DEX trading data
├── css/                   # Stylesheets
├── js/                    # Frontend JavaScript modules
├── pages/                 # HTML pages
│   ├── home.html         # Portfolio overview
│   ├── currency.html     # Currency detail page
│   ├── portfolio.html    # Portfolio management
│   └── dex/              # DEX analytics pages
└── .env.example          # Environment configuration template
```

---

## Getting Started

### Prerequisites

- PHP 8.2 or higher
- MariaDB 10.5+
- Redis 6.0+
- CoinMarketCap API key

### Configuration

1. Copy `.env.example` to `.env`
2. Configure your database credentials
3. Add your CoinMarketCap API key
4. Set up Redis connection details

**Note**: Self-hosting this software is prohibited under the license terms. See [LICENSE](LICENSE) for details.

---

## Contributing

We welcome contributions from the community! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to submit pull requests, report issues, and contribute to the project.

By contributing, you agree that your contributions will be licensed under the same license as this project.

---

## License

**⚠️ This is NOT open source software**

This project is licensed under a proprietary source-available license. You may view and study the code for educational purposes and contribute via pull requests, but you may NOT:

- Self-host or deploy this software
- Use this code for commercial purposes
- Redistribute this code or derivatives
- Create competing services

See [LICENSE](LICENSE) for full terms.

**Official Service**: The only authorized instance of Folyo is available at [https://folyo.tech](https://folyo.tech)

---

## Security

Security is a top priority. If you discover a security vulnerability, please email:

**security@folyo.tech**

Do not open public issues for security vulnerabilities. See [SECURITY.md](SECURITY.md) for our security policy.

---

## Contact

- **Website**: [https://folyo.tech](https://folyo.tech)
- **Support**: contact@folyo.tech
- **Legal**: legal@folyo.tech
- **Security**: security@folyo.tech

---

## Acknowledgments

Built with data from CoinMarketCap API and various blockchain explorers.

---

**© 2025 Folyo. All rights reserved.**
