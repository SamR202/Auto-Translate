# Auto Translate - Complete Browser Extension

A powerful Chrome extension that automatically translates foreign language web pages using Google Translate, removes translation blockers, enables right-click/text selection on restricted sites, and remembers processed domains for faster subsequent translations.

## Features

### 🌐 Automatic Translation
- **Smart Language Detection**: Detects page language through HTML attributes, meta tags, and Unicode script analysis
- **Multi-language Support**: Chinese, Russian, Japanese, Korean, Arabic, Hebrew, Thai, and more
- **Translation Blocker Removal**: Automatically removes CSP restrictions, notranslate classes, and blocking attributes
- **Native Chrome Integration**: Leverages Chrome's built-in Google Translate for seamless translation

### 🖱️ Right-Click & Selection Enablement
- **Context Menu Restoration**: Removes right-click blockers on websites that disable context menus
- **Text Selection Freedom**: Enables text selection on sites with copy-protection or selection blocking
- **CSS Override System**: Forces enable user interactions through comprehensive style overrides

### 💾 Domain Memory System
- **Smart Domain Tracking**: Remembers websites that have been translated
- **Faster Re-processing**: Automatically retranslates remembered domains with optimized timing
- **Persistent Storage**: Domain memory persists across browser sessions

### ⚡ Performance Optimization
- **Multiple Initialization Strategies**: Adapts to different page loading scenarios
- **Backup Triggers**: Ensures activation even on dynamic or slow-loading pages
- **Silent Operation**: Runs completely in the background without UI interruptions

## Installation

### From Source

1. Clone or download this repository:
\`\`\`bash
git clone https://github.com/yourusername/auto-translate-extension.git
cd auto-translate-extension
\`\`\`

2. Open Chrome/Edge browser and navigate to:
   - Chrome: `chrome://extensions/`
   - Edge: `edge://extensions/`

3. Enable **Developer mode** (toggle in top-right corner)

4. Click **Load unpacked** and select the extension directory

5. The extension icon should appear in your browser toolbar

### Installing the Icon (Optional)

Place an `icon.png` file (128x128 pixels recommended) in the extension directory for proper visual appearance.

## Usage

### Automatic Operation

The extension works automatically once installed:

1. Visit any foreign language website
2. The extension detects the language automatically
3. Translation triggers within 1 second (or 800ms for remembered domains)
4. Right-click and text selection are enabled automatically

### No Configuration Required

- No settings to adjust
- No buttons to click
- Works silently in the background
- Completely automatic operation

### Supported Websites

- Works on all websites (except browser internal pages like `chrome://`)
- Bypasses translation blockers on restrictive sites
- Enables functionality on copy-protected content sites

## File Structure

\`\`\`
auto-translate-extension/
│
├── manifest.json          # Extension configuration
├── content.js            # Main content script with translation logic
├── background.js         # Service worker for domain memory
├── icon.png             # Extension icon (add your own)
└── README.md            # This file
\`\`\`

## Technical Details

### Permissions

- **storage**: Required for domain memory persistence
- **host_permissions (all_urls)**: Required to work on any website

### Architecture

- **Manifest V3**: Built using the latest Chrome extension standard
- **Service Worker**: Background script for persistent domain tracking
- **Content Script**: Injected at `document_idle` for optimal timing

### Browser Compatibility

- ✅ Google Chrome (v88+)
- ✅ Microsoft Edge (v88+)
- ✅ Brave Browser
- ✅ Other Chromium-based browsers

## How It Works

### Translation Triggering Process

1. **Detection Phase**: Checks HTML lang attribute, meta tags, and text content for language
2. **Blocker Removal**: Removes CSP, notranslate attributes, and blocking classes
3. **Event Dispatch**: Triggers comprehensive DOM events to activate Chrome's translation
4. **Verification**: Monitors for translation widget appearance
5. **Domain Save**: Stores successful domain for faster future processing

### Right-Click Enablement

1. Removes contextmenu event listeners
2. Overrides addEventListener for contextmenu events
3. Injects CSS rules to force enable selection and context menus
4. Prevents event propagation blocking

### Domain Memory

1. Background service worker maintains a dictionary of processed domains
2. Each domain entry includes first-added and last-processed timestamps
3. Stored in Chrome's local storage API for persistence
4. Content script queries background for domain status on each page load

## Privacy

- **No Data Collection**: This extension does not collect any user data
- **Local Storage Only**: Domain memory is stored locally on your device
- **No External Servers**: All processing happens within your browser
- **No Analytics**: No tracking or analytics code included

## Troubleshooting

### Translation Not Working

- Ensure Chrome's built-in translation feature is enabled in settings
- Check that the website is not a browser internal page (`chrome://`, `edge://`)
- Some sites may require a page refresh after extension installation

### Right-Click Still Blocked

- Try refreshing the page after extension installation
- Some sites use iframe isolation that may bypass the extension
- Check browser console for any error messages

### Domain Not Remembered

- Verify storage permission is granted in `chrome://extensions/`
- Check browser console for storage-related errors
- Clear browser cache and reload extension if issues persist

## Development

### Building from Source

No build process required - this is pure JavaScript:

1. Make changes to `content.js`, `background.js`, or `manifest.json`
2. Go to `chrome://extensions/`
3. Click the refresh icon on the extension card
4. Test on target websites

### Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

### Future Enhancements

- [ ] Add popup UI for manual translation control
- [ ] Implement translation language preferences
- [ ] Add whitelist/blacklist domain management
- [ ] Create keyboard shortcuts for manual triggering
- [ ] Add support for Firefox with WebExtensions API

## License

MIT License - See LICENSE file for details

## Credits

Developed for automatic translation and accessibility enhancement on foreign language websites.

## Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check existing issues for solutions
- Review browser console logs for debugging

---

**Note**: This extension leverages Chrome's built-in Google Translate feature and does not provide its own translation engine. Ensure Chrome's translation functionality is enabled in browser settings for optimal performance.
