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

1. Build the extension for Firefox: `pnpm wxt zip`
2. Open Chrome/Edge and navigate to `chrome://extensions` or `edge://extensions`
3. Enable "Developer mode"
4. Click "Load unpacked" and select `.output/chrome-mv3` folder

### Firefox

1. Build the extension for Firefox: `pnpm wxt zip -b firefox`
2. Open Firefox and navigate to `about:debugging`
3. Click "This Firefox" in the left sidebar
4. Click "Load Temporary Add-on..." and select `.output/arborously-x-y-z-firefoz.zip
6. The extension will be loaded temporarily until you restart Firefox 

### Firefox Nightly

1. In the Firefox Nightly go to `about:config`
2. Set `xpinstall.signatures.required` to false
3. Build the extension for Firefox: `pnpm wxt zip -b firefox`
4. Go to  `about:addons`
5. Click the cogwheel icon
6. Select "Install Add-on From File..."  and select `.output/arborously-x-y-z-firefoz.zip
7. The extension will persist across restarts


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