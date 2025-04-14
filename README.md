# ![logo](./public/icon/tree-arborously-24.png) Arborously [![CI](https://github.com/farmisen/arborously/actions/workflows/ci.yml/badge.svg)](https://github.com/farmisen/arborously/actions/workflows/ci.yml)

A browser extension that automatically generates standardized git branch names from ticket information across various ticketing systems.

## Features

- **Multi-platform Issue Tracking Support**:
  - Automatically extracts ticket information from:
    - Trello cards
    - GitHub Issues
    - Linear issues
  
- **Intelligent Content Generation**:
  - Generates standardized git branch names using customizable templates
  - Creates PR titles that follow consistent formatting
  - Extracts and formats ticket URLs for easy sharing
  
- **Powerful Templating System**:
  - Custom templates with placeholder support (`{id}`, `{title}`, `{category}`, `{username}`)
  - Case handling (uppercase/lowercase) via template syntax (`{Title}` vs `{title}`)
  - Configurable word separators (dash, underscore, etc.)
  
- **Category Management**:
  - Organize and categorize your branches (feature, bugfix, hotfix, etc.)
  - Quick category switching with keyboard shortcuts
  - Remembers your last selected category

- **Intuitive UX**:
  - One-click copy to clipboard
  - Toggle between branch name, PR title, and ticket URL modes
  - Keyboard shortcuts for efficient workflow
  - Maintains state between uses

- **Cross-browser Support**:
  - Works seamlessly in Chrome, Firefox, and Edge

## Installation

### Easy Installation (Recommended)

### Chrome/Edge

1. Download the latest Chrome release from [GitHub Releases](https://github.com/farmisen/arborously/releases)
2. Open Chrome/Edge and navigate to `chrome://extensions` or `edge://extensions`
3. Enable "Developer mode"
4. Drag and drop the downloaded `arborously-x.y.z-chrome.zip` file onto the extensions page

### Firefox

1. Download the latest Firefox release from [GitHub Releases](https://github.com/farmisen/arborously/releases)
2. Open Firefox and navigate to `about:debugging`
3. Click "This Firefox" in the left sidebar
4. Click "Load Temporary Add-on..." and select the downloaded `arborously-x.y.z-firefox.zip` file
5. The extension will be loaded temporarily until you restart Firefox

### Firefox Nightly

1. In Firefox Nightly go to `about:config`
2. Set `xpinstall.signatures.required` to false
3. Download the latest Firefox release from [GitHub Releases](https://github.com/farmisen/arborously/releases)
4. Go to `about:addons`
5. Click the cogwheel icon
6. Select "Install Add-on From File..." and select the downloaded `arborously-x.y.z-firefox.zip` file
7. The extension will persist across restarts

### Manual Build (For Development)

If you prefer to build the extension yourself, please see the [Development](#development) section below.

## Usage

### Basic Usage

1. Navigate to a supported ticket (Trello card, GitHub issue, or Linear issue)
2. Click on the Arborously extension icon in your browser toolbar
3. The extension will automatically:
   - Extract ticket information (ID, title, etc.)
   - Generate a branch name based on your template and selected category
4. Click the copy button to copy the content to your clipboard

### Advanced Features

- **Switching Modes**: Press the `Space` key to toggle between:
  - **Branch Name**: Formatted branch name for git operations
  - **PR Title**: Properly formatted pull request title 
  - **Ticket URL**: Clean URL for the current ticket

- **Category Selection** (in Branch Name mode):
  - Use `A` key to cycle to the previous category
  - Use `D` key to cycle to the next category
  - The extension remembers your last selected category

- **Template Customization**:
  - Go to the extension options page (right-click the extension icon and select "Options")
  - Customize branch name and PR title templates with placeholders:
    - `{id}` - The ticket ID (e.g., "SPE-342")
    - `{title}` - The ticket title
    - `{category}` - The selected category name (feature, bugfix, etc.)
    - `{username}` - Your username
  - Use capitalized placeholders (e.g., `{Title}`) for capitalized values

## Development

Arborously is built with [WXT](https://wxt.dev/), React, TypeScript, and Tailwind CSS.

### Prerequisites

- Node.js 22
- pnpm

### Setup

```bash
# Clone the repositor
git clone https://github.com/yourusername/arborously.git
cd arborously

# Install dependencies
pnpm install
```

### Development Commands

```bash
# Start development mode for Chrome
pnpm dev

# Start development mode for Firefox
pnpm dev:firefox

# Build for Chrome
pnpm build

# Build for Firefox
pnpm build:firefox

# Run TypeScript typecheck
pnpm compile

# Create distributable zip
pnpm zip
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[MIT](LICENSE)
