# Lyhong Peou - Developer Portfolio

A modern, terminal-inspired portfolio website showcasing my projects and skills as a developer. Built with React, TypeScript, and featuring a sleek dark/light mode toggle.

## ✨ Features

- **Terminal-Inspired Design**: Interactive command-line interface showcasing personal information
- **Dark/Light Mode**: Seamless theme switching with smooth transitions
- **Project Showcase**: Modal-based project browser with detailed descriptions
- **Responsive Design**: Optimized for both desktop and mobile devices
- **Modern Tech Stack**: Built with React 18, TypeScript, and Vite

## 🚀 Live Demo

Visit the live portfolio: [Your Portfolio URL]

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript
- **Build Tool**: Vite
- **Styling**: CSS3 with CSS Variables for theming
- **Icons**: Custom SVG icons and React SVG components
- **Design**: Mobile-first responsive design

## 📁 Project Structure

```
src/
├── assets/
│   ├── data/
│   │   └── portfolio.json      # Portfolio data (projects, contact info)
│   └── image/                  # SVG icons
├── component/
│   ├── Contact.tsx             # Contact section component
│   ├── Hero.tsx                # Hero/intro section
│   ├── Recent.tsx              # Projects showcase with modals
│   ├── Terminal.tsx            # Terminal-style about section
│   └── *.css                   # Component styles
├── App.tsx                     # Main app component
├── App.css                     # Global app styles
├── index.css                   # CSS variables and theming
└── main.tsx                    # App entry point
```

## 🎨 Design Features

### Terminal Interface
- Interactive command-line style presentation
- Animated cursor with blinking effect
- Realistic terminal commands showcasing:
  - Current directory (`pwd`)
  - Resume download link
  - Programming languages
  - Contact information

### Project Browser
- File explorer-inspired project display
- Modal popups with detailed project information
- GitHub integration for source code links
- Technology tags for each project

### Theming System
- CSS custom properties for consistent theming
- OKLCH color space for better color consistency
- Smooth transitions between themes
- High contrast ratios for accessibility

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/peoul/portfolio.git
cd portfolio
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and visit `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## 📝 Customization

### Personal Information
Edit `src/assets/data/portfolio.json` to update:
- Personal details (name, title, tagline)
- Project information
- Contact details

### Styling
- Global theme variables: `src/index.css`
- Component-specific styles: Individual CSS files in `src/component/`

### Adding Projects
Add new projects to the `projects` array in `portfolio.json`:

```json
{
  "title": "Project Name",
  "description": "Project description with features",
  "tags": ["React", "TypeScript", "CSS"],
  "github": "https://github.com/username/repo"
}
```

## 🎯 Current Projects Featured

- **Slow Typer**: Minimalist typing speed test with real-time WPM tracking
- **Streak**: GitHub-style habit tracker with contribution graphs  
- **Clue-Less**: Multiplayer web version of the classic Clue board game

## 📱 Responsive Design

The portfolio is fully responsive with breakpoints at:
- Mobile: < 768px
- Desktop: ≥ 768px

Features adaptive layouts, font sizes, and spacing for optimal viewing on all devices.

## 🌟 Performance Features

- Vite for fast development and optimized builds
- Efficient component architecture
- Optimized SVG icons
- CSS custom properties for minimal runtime calculations

## 📧 Contact

- **Email**: lyhongpeou.lp@gmail.com
- **LinkedIn**: [linkedin.com/in/lyhong-peou](https://www.linkedin.com/in/lyhong-peou/)
- **GitHub**: [github.com/peoul](https://github.com/peoul)

## 🙏 Acknowledgments

Inspired by [Justin Chi](https://www.justinchi.me) - Thanks for the design inspiration!

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

⭐ If you found this portfolio interesting, please consider giving it a star on GitHub!
