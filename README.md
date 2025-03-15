# Arborously 🌳

A browser extension that automatically generates standardized git branch names from ticket information across various ticketing systems.

## Features

- Automatically extracts ticket information from Trello cards
- Generates git branch names based on customizable templates
- One-click copy to clipboard
- Support for common git branch naming conventions
- Cross-browser compatibility (Chrome, Firefox, Edge)

## Installation

### Chrome/Edge

1. Download the latest release from the [Releases page](https://github.com/yourusername/arborously/releases)
2. Unzip the file
3. Open Chrome/Edge and navigate to `chrome://extensions` or `edge://extensions`
4. Enable "Developer mode"
5. Click "Load unpacked" and select the unzipped folder

### Firefox

1. Download the latest Firefox release from the [Releases page](https://github.com/yourusername/arborously/releases)
2. Open Firefox and navigate to `about:addons`
3. Click the gear icon and select "Install Add-on From File..."
4. Select the downloaded `.xpi` file

## Development

Arborously is built with [WXT](https://wxt.dev/), React, TypeScript, and Tailwind CSS.

### Prerequisites

- Node.js 16+
- pnpm

### Setup

```bash
# Clone the repository
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

## Usage

1. Navigate to a Trello card
2. Click on the Arborously extension icon in your browser toolbar
3. Select a template and tag for your branch
4. Click "Copy to Clipboard" to copy the generated branch name

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[MIT](LICENSE)