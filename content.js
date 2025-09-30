(function() {
  'use strict';

  // Prevent multiple executions
  if (window.translationBlockersRemoved) return;
  window.translationBlockersRemoved = true;

  // Skip chrome:// pages, extension pages, and iframes
  if (location.protocol === 'chrome:' || 
      location.protocol === 'chrome-extension:' ||
      location.protocol === 'moz-extension:' ||
      window.self !== window.top) {
    return;
  }

  let pageFullyLoaded = false;
  let translationAttempted = false;
  let initializationComplete = false;

  // Define foreignTexts at top level to avoid scoping issues
  const foreignTexts = {
    'zh': ['这是一个需要翻译的中文网页', '请翻译这个页面到英文', '中文内容需要翻译', '自动翻译系统激活'],
    'ru': ['Это веб-страница на русском языке', 'Пожалуйста переведите эту страницу', 'Русский контент нуждается в переводе', 'Система автоматического перевода активирована'],
    'ja': ['これは翻訳が必要な日本語のウェブページです', 'このページを英語に翻訳してください', '日本語のコンテンツを翻訳する必要があります', '自動翻訳システム起動'],
    'ko': ['이것은 번역이 필요한 한국어 웹페이지입니다', '이 페이지를 영어로 번역해 주세요', '한국어 콘텐츠 번역 필요', '자동 번역 시스템 활성화'],
    'ar': ['هذه صفحة ويب باللغة العربية تحتاج إلى ترجمة', 'يرجى ترجمة هذه الصفحة إلى الإنجليزية', 'المحتوى العربي يجب أن يترجم', 'نظام الترجمة الآلية مفعل']
  };

  console.log('🌍 Auto Translate Extension: Silent Mode - Complete Feature Set + Right-Click Enabled');

  function detectLanguage() {
    try {
      // Method 1: <html lang> attribute
      const htmlLang = document.documentElement.lang;
      if (htmlLang && htmlLang.trim()) {
        const lang = htmlLang.toLowerCase().split('-')[0];
        console.log(`Language detected via HTML lang: ${lang}`);
        return lang;
      }
      
      // Method 2: meta tag
      const metaLang = document.querySelector('meta[http-equiv="content-language"]');
      if (metaLang && metaLang.content) {
        const lang = metaLang.content.toLowerCase().split('-')[0];
        console.log(`Language detected via meta tag: ${lang}`);
        return lang;
      }
      
      // Method 3: Text-based script detection
      const text = document.body?.textContent?.substring(0, 1000) || '';
      
      if (/[\u4e00-\u9fff]/.test(text)) {
        console.log('Language detected via text analysis: zh (Chinese)');
        return 'zh';
      }
      if (/[\u0400-\u04ff]/.test(text)) {
        console.log('Language detected via text analysis: ru (Russian)');
        return 'ru';
      }
      if (/[\u3040-\u309f\u30a0-\u30ff]/.test(text)) {
        console.log('Language detected via text analysis: ja (Japanese)');
        return 'ja';
      }
      if (/[\uac00-\ud7af]/.test(text)) {
        console.log('Language detected via text analysis: ko (Korean)');
        return 'ko';
      }
      if (/[\u0600-\u06ff]/.test(text)) {
        console.log('Language detected via text analysis: ar (Arabic)');
        return 'ar';
      }
      if (/[\u0590-\u05ff]/.test(text)) {
        console.log('Language detected via text analysis: he (Hebrew)');
        return 'he';
      }
      if (/[\u0e00-\u0e7f]/.test(text)) {
        console.log('Language detected via text analysis: th (Thai)');
        return 'th';
      }
      
      console.log('No foreign language detected');
      return null;
    } catch (error) {
      console.error('Language detection failed:', error);
      return null;
    }
  }

  function getBrowserLanguage() {
    try {
      const lang = (navigator.language || navigator.userLanguage || 'en').toLowerCase().split('-')[0];  
      console.log(`Browser language: ${lang}`);
      return lang;
    } catch (error) {
      return 'en';
    }
  }

  function enableRightClick() {
    try {
      console.log('🖱️ Enabling right-click functionality...');
      
      // Remove all contextmenu event blockers
      document.removeEventListener('contextmenu', function() {}, true);
      document.body.removeEventListener('contextmenu', function() {}, true);
      window.removeEventListener('contextmenu', function() {}, true);
      
      // Override contextmenu handlers
      document.oncontextmenu = null;
      document.body.oncontextmenu = null;
      window.oncontextmenu = null;
      
      // Create a new contextmenu event handler that always allows the menu
      const enableContextMenu = function(e) {
        e.stopPropagation();
        e.stopImmediatePropagation();
        return true;
      };
      
      // Add our enabling handler with highest priority
      document.addEventListener('contextmenu', enableContextMenu, true);
      document.body.addEventListener('contextmenu', enableContextMenu, true);
      
      // Override the addEventListener method to prevent new contextmenu blockers
      const originalAddEventListener = EventTarget.prototype.addEventListener;
      EventTarget.prototype.addEventListener = function(type, listener, options) {
        if (type === 'contextmenu' && typeof listener === 'function') {
          // Replace contextmenu blockers with our enabler
          return originalAddEventListener.call(this, type, enableContextMenu, true);
        }
        return originalAddEventListener.call(this, type, listener, options);
      };
      
      // Remove text selection restrictions
      document.onselectstart = null;
      document.ondragstart = null;
      document.onmousedown = null;
      document.body.onselectstart = null;
      document.body.ondragstart = null;
      document.body.onmousedown = null;
      
      // Override CSS that prevents selection and right-click
      const rightClickStyle = document.createElement('style');
      rightClickStyle.id = 'enable-right-click-style';
      rightClickStyle.textContent = `
        *, *:before, *:after {
          -webkit-user-select: text !important;
          -moz-user-select: text !important;
          -ms-user-select: text !important;
          user-select: text !important;
          -webkit-touch-callout: default !important;
          -webkit-context-menu: default !important;
          -moz-context-menu: default !important;
          context-menu: default !important;
        }
        body, html {
          -webkit-user-select: text !important;
          -moz-user-select: text !important;
          user-select: text !important;
          -webkit-touch-callout: default !important;
        }
        /* Remove any pointer-events restrictions */
        * {
          pointer-events: auto !important;
        }
      `;
      document.head.appendChild(rightClickStyle);
      
      console.log('✅ Right-click functionality enabled');
      return true;
    } catch (error) {
      console.error('Failed to enable right-click:', error);
      return false;
    }
  }

  function removeBlockers() {
    try {
      console.log('🚫 Removing translation blockers...');
      
      // Remove CSP restrictions
      document.querySelectorAll('meta[http-equiv*="Content-Security-Policy"], meta[http-equiv*="content-security-policy"], meta[name*="csp"], meta[name*="Content-Security-Policy"]').forEach((meta, index) => {
        try {
          const content = meta.content || meta.getAttribute('content') || '';
          console.log(`Removing CSP meta tag ${index + 1}: ${content.substring(0, 50)}...`);
          meta.remove();
        } catch (e) {
          console.warn(`Could not remove CSP meta tag ${index + 1}:`, e);
        }
      });

      // Your proven method that works
      const html_tag = document.getElementsByTagName("html")[0];
      if (html_tag) {
        html_tag.setAttribute("translate", "yes");
        html_tag.classList.remove("notranslate");
        html_tag.removeAttribute('data-translate');
        html_tag.removeAttribute('data-notranslate');
        html_tag.oncontextmenu = null; // Remove right-click blockers from HTML
        console.log('✅ Set HTML translate="yes" and removed notranslate classes/attributes');
      }
      
      // Comprehensive blocker removal
      const blockingSelectors = [
        '.notranslate', 
        '.skiptranslate', 
        '[translate="no"]', 
        '[class*="notrans"]',
        '[data-translate="no"]',
        '[data-notranslate]',
        '.no-translate',
        '.dont-translate'
      ];
      
      blockingSelectors.forEach(selector => {
        try {
          const elements = document.querySelectorAll(selector);
          console.log(`Found ${elements.length} elements with selector: ${selector}`);
          elements.forEach(element => {
            try {
              // Remove classes
              element.classList.remove('notranslate', 'skiptranslate', 'no-translate', 'dont-translate');
              
              // Remove attributes
              element.removeAttribute('translate');
              element.removeAttribute('data-translate');
              element.removeAttribute('data-notranslate');
              
              // Clean up class names with notrans variants
              if (element.className) {
                element.className = element.className.replace(/\bnotrans\w*\b/g, '').trim();
              }
              
              // Force translate attribute and remove right-click blockers
              element.setAttribute('translate', 'yes');
              element.oncontextmenu = null;
            } catch (e) {
              console.warn('Could not modify element:', e);
            }
          });
        } catch (e) {
          console.warn(`Error processing selector ${selector}:`, e);
        }
      });
      
      console.log('✅ Translation blockers removal completed');
      return true;
    } catch (error) {
      console.error('❌ Failed to remove blockers:', error);
      return false;
    }
  }

  function triggerChromeTranslation() {
    if (translationAttempted) return;
    translationAttempted = true;

    console.log('🔄 Triggering Chrome built-in translation with all methods...');

    try {
      const sourceLanguage = detectLanguage();
      const targetLanguage = getBrowserLanguage();
      
      console.log(`Attempting translation: ${sourceLanguage} → ${targetLanguage}`);
      
      // Step 1: Language attribute manipulation
      const html = document.documentElement;
      html.removeAttribute('lang');
      html.removeAttribute('xml:lang');
      html.removeAttribute('data-lang');
      
      console.log('Cleared existing language attributes');
      
      setTimeout(() => {
        const langToSet = sourceLanguage || 'zh';
        html.lang = langToSet;
        html.setAttribute('xml:lang', langToSet);
        
        console.log(`Set document language to: ${langToSet}`);
        
        // Step 2: Create translation trigger elements
        setTimeout(() => {
          try {
            const textsArray = foreignTexts[sourceLanguage] || foreignTexts.zh;
            
            textsArray.forEach((text, index) => {
              // Create multiple copies for better detection
              for (let i = 0; i < 3; i++) {
                const triggerElement = document.createElement('div');
                triggerElement.style.cssText = 'position:absolute!important;left:-9999px!important;top:-9999px!important;width:1px!important;height:1px!important;overflow:hidden!important;opacity:0!important;pointer-events:none!important;';
                triggerElement.setAttribute('translate', 'yes');
                triggerElement.setAttribute('lang', sourceLanguage || 'zh');
                triggerElement.textContent = text;
                triggerElement.id = `translate-trigger-${index}-${i}-${Date.now()}`;
                
                try {
                  document.body.appendChild(triggerElement);
                  console.log(`Created trigger element ${index + 1}-${i + 1}: ${text.substring(0, 20)}...`);
                } catch (e) {
                  console.warn(`Failed to create trigger element ${index + 1}-${i + 1}:`, e);
                }
              }
            });
            
          } catch (e) {
            console.warn('Failed to create trigger elements:', e);
          }
          
          // Step 3: Massive event dispatching
          setTimeout(() => {
            console.log('Dispatching comprehensive translation trigger events...');
            
            const eventSequence = [
              { name: 'DOMContentLoaded', target: document },
              { name: 'load', target: window },
              { name: 'resize', target: window },
              { name: 'focus', target: window },
              { name: 'blur', target: window },
              { name: 'focus', target: window },
              { name: 'visibilitychange', target: document },
              { name: 'pageshow', target: window },
              { name: 'pagehide', target: window },
              { name: 'pageshow', target: window },
              { name: 'scroll', target: window },
              { name: 'wheel', target: window },
              { name: 'mousemove', target: document },
              { name: 'mouseenter', target: document.body },
              { name: 'mouseleave', target: document.body },
              { name: 'keydown', target: document },
              { name: 'keyup', target: document },
              { name: 'input', target: document },
              { name: 'change', target: document },
              { name: 'hashchange', target: window }
            ];
            
            // Fire events in multiple rounds
            for (let round = 0; round < 7; round++) {
              eventSequence.forEach((eventConfig, index) => {
                setTimeout(() => {
                  try {
                    let event;
                    if (eventConfig.name === 'mousemove') {
                      event = new MouseEvent('mousemove', {
                        bubbles: true, cancelable: true,
                        clientX: Math.random() * 100 + 100,
                        clientY: Math.random() * 100 + 100
                      });
                    } else if (eventConfig.name === 'keydown' || eventConfig.name === 'keyup') {
                      event = new KeyboardEvent(eventConfig.name, {
                        bubbles: true, cancelable: true,
                        key: 'Tab', code: 'Tab'
                      });
                    } else {
                      event = new Event(eventConfig.name, { 
                        bubbles: true, 
                        cancelable: true 
                      });
                    }
                    
                    eventConfig.target.dispatchEvent(event);
                    console.log(`✅ Round ${round + 1}: Dispatched ${eventConfig.name} event`);
                  } catch (e) {
                    console.warn(`❌ Failed to dispatch ${eventConfig.name} event:`, e);
                  }
                }, (round * eventSequence.length + index) * 100);
              });
            }
            
            // Step 4: Additional Chrome-specific triggers
            setTimeout(() => {
              try {
                const originalTitle = document.title;
                const foreignTitleText = foreignTexts[sourceLanguage] ? foreignTexts[sourceLanguage][0] : '翻译页面';
                document.title = `${foreignTitleText} - ${originalTitle}`;
                
                // Force visibility changes
                Object.defineProperty(document, 'hidden', { value: true, configurable: true });
                document.dispatchEvent(new Event('visibilitychange'));
                
                setTimeout(() => {
                  Object.defineProperty(document, 'hidden', { value: false, configurable: true });
                  document.dispatchEvent(new Event('visibilitychange'));
                  document.title = originalTitle;
                }, 1000);
                
                console.log('Applied title change and visibility triggers');
                
                // Context menu simulation (now that right-click is enabled)
                setTimeout(() => {
                  try {
                    for (let i = 0; i < 5; i++) {
                      setTimeout(() => {
                        const contextMenuEvent = new MouseEvent('contextmenu', {
                          bubbles: true,
                          cancelable: true,
                          button: 2,
                          clientX: window.innerWidth / 2 + (i * 20),
                          clientY: window.innerHeight / 2 + (i * 20)
                        });
                        
                        document.body.dispatchEvent(contextMenuEvent);
                        console.log(`✅ Context menu simulation ${i + 1}`);
                      }, i * 300);
                    }
                  } catch (e) {
                    console.warn('❌ Context menu simulation failed:', e);
                  }
                }, 500);
                
              } catch (e) {
                console.warn('Additional triggers failed:', e);
              }
              
              // Silent completion - no UI elements created
              console.log('🎯 Translation triggering completed silently');
            }, eventSequence.length * 7 * 100 + 1000);
            
          }, 400);
        }, 300);
      }, 200);
      
    } catch (error) {
      console.error('❌ Chrome translation triggering failed:', error);
    }
  }

  function waitForPageFullyLoaded() {
    console.log('⏳ Waiting for page to fully load...');
    
    const checkLoaded = () => {
      const readyStateComplete = document.readyState === 'complete';
      const hasBody = !!document.body;
      const hasContent = document.body && document.body.textContent.length > 100;
      
      if (readyStateComplete && hasBody && hasContent) {
        console.log('✅ Page fully loaded');
        pageFullyLoaded = true;
        return true;
      }
      return false;
    };

    if (checkLoaded()) {
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      const checkInterval = setInterval(() => {
        if (checkLoaded()) {
          clearInterval(checkInterval);
          resolve();
        }
      }, 500);

      setTimeout(() => {
        clearInterval(checkInterval);
        pageFullyLoaded = true;
        console.log('⏰ Page load timeout, proceeding');
        resolve();
      }, 8000);
    });
  }

  function saveDomain() {
    try {
      chrome.runtime.sendMessage({ action: 'saveDomain' }, (response) => {
        if (chrome.runtime.lastError) {
          console.error('Failed to save domain:', chrome.runtime.lastError);
        } else {
          console.log('✅ Domain saved for future visits');
        }
      });
    } catch (error) {
      console.error('Save domain failed:', error);
    }
  }

  // Main execution with all features - SILENT MODE
  async function init() {
    if (initializationComplete) {
      console.log('Initialization already completed');
      return;
    }
    
    try {
      console.log('🚀 Initializing Complete Auto Translate Extension (Silent Mode)...');
      
      const pageLanguage = detectLanguage();
      const browserLanguage = getBrowserLanguage();
      
      if (!pageLanguage || pageLanguage === browserLanguage) {
        console.log('❌ No translation needed');
        return;
      }
      
      console.log('✅ Foreign language detected - Activating all features silently');
      initializationComplete = true;

      // Wait for page to be fully loaded
      await waitForPageFullyLoaded();
      
      // Enable right-click functionality FIRST
      enableRightClick();
      
      // Remove translation blockers
      if (!removeBlockers()) {
        console.error('❌ Failed to remove translation blockers');
        return;
      }
      
      // Check domain for domain memory feature
      try {
        chrome.runtime.sendMessage({ action: 'checkDomain' }, (response) => {
          if (chrome.runtime.lastError) {
            console.warn('⚠️ Background script communication failed');
            setTimeout(() => triggerChromeTranslation(), 1000);
            return;
          }
          
          if (response?.shouldProcess) {
            console.log('🔄 Domain remembered - processing immediately');
            setTimeout(() => triggerChromeTranslation(), 800);
          } else {
            console.log('🆕 New domain - processing and remembering');
            setTimeout(() => triggerChromeTranslation(), 1000);
            saveDomain();
          }
        });
      } catch (error) {
        console.error('❌ Runtime error:', error);
        setTimeout(() => triggerChromeTranslation(), 1000);
      }
      
    } catch (error) {
      console.error('❌ Initialization failed:', error);
    }
  }

  // Start initialization with all timing strategies
  function startInit() {
    console.log(`🔧 Starting silent init (readyState: ${document.readyState})`);
    
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else if (document.readyState === 'interactive') {
      setTimeout(init, 600);
    } else {
      setTimeout(init, 400);
    }
  }

  startInit();

  // Backup initialization strategies
  window.addEventListener('load', () => {
    if (!pageFullyLoaded && !initializationComplete) {
      console.log('🔄 Window load backup initialization');
      setTimeout(init, 1200);
    }
  });

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && !initializationComplete) {
      console.log('👁️ Page visible backup initialization');
      setTimeout(init, 1500);
    }
  });

  // Additional backup for dynamic pages
  setTimeout(() => {
    if (!initializationComplete) {
      console.log('🕐 Final backup initialization');
      init();
    }
  }, 5000);

  console.log('🎉 Complete Auto Translate Extension Loaded (Silent Mode - All Features + Right-Click Enabled)');

})();
