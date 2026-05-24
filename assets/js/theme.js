/* theme */

function applyLayoutSettings() {
    document.body.classList.remove('selector-top', 'selector-bottom');

    if (THEME_SELECTOR_POSITION === 'bottom') {
      document.body.classList.add('selector-bottom');
    } else {
      document.body.classList.add('selector-top');
    }
  }


function changeTheme(themeName) {
    document.body.classList.remove(
      'theme-green',
      'theme-milktea',
      'theme-cinnamoroll',
      'theme-kuromi',
      'theme-dark',
      'theme-pompom'
    );

    const themeMap = {
      green: 'theme-green',
      milktea: 'theme-milktea',
      cinnamoroll: 'theme-cinnamoroll',
      kuromi: 'theme-kuromi',
      dark: 'theme-dark',
      pompom: 'theme-pompom'
    };

    if (themeMap[themeName]) {
      document.body.classList.add(themeMap[themeName]);
    }

    updateCuteStickers(themeName);
    localStorage.setItem('healing_theme', themeName);
    updateButtonStyle();
    applyLayoutSettings();
  }


function updateCuteStickers(themeName) {
    const stickers = document.querySelectorAll('.cute-sticker');

    const stickerSets = {
      pink: ['🎀', '💗', '✨', '🍑'],
      green: ['🍵', '🌿', '🍀', '🤍'],
      milktea: ['🧋', '🍪', '🍮', '🤎'],
      cinnamoroll: ['☁️', '🫧', '⭐', '🤍'],
      kuromi: ['🖤', '💜', '🌙', '✨'],
      dark: ['🌙', '🖤', '✨', '⭐'],
      pompom: ['🍮', '💛', '🍯', '☁️']
    };

    const selectedSet = stickerSets[themeName] || stickerSets.pink;

    stickers.forEach((el, index) => {
      el.textContent = selectedSet[index % selectedSet.length];
    });
  }


function loadTheme() {
    let savedTheme = localStorage.getItem('healing_theme') || 'pink';

    if (!THEME_VALUES.includes(savedTheme)) {
      savedTheme = 'pink';
      localStorage.setItem('healing_theme', 'pink');
    }

    document.getElementById('theme-select').value = savedTheme;
    changeTheme(savedTheme);
  }


function updateButtonStyle() {
    const submitBtn = document.getElementById('submit-btn');

    if (!submitBtn) return;

    if (currentType === 'income') {
      submitBtn.style.background = 'var(--green-bg)';
      submitBtn.style.color = 'var(--green-tx)';
      submitBtn.style.borderColor = 'var(--green)';
    } else {
      submitBtn.style.background = 'var(--accent-bg)';
      submitBtn.style.color = 'var(--accent-tx)';
      submitBtn.style.borderColor = 'var(--accent)';
    }
  }

