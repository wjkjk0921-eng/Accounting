/* 全域設定、預設分類、圖示選項與狀態變數 */
const THEME_SELECTOR_POSITION = 'top';

  const THEME_VALUES = [
    'pink',
    'green',
    'milktea',
    'cinnamoroll',
    'kuromi',
    'dark',
    'pompom'
  ];

  const DEFAULT_CATS = [
    { id: 'food', label: '餐飲', icon: '🍜', type: 'expense' },
    { id: 'drink', label: '飲品', icon: '🧋', type: 'expense' },
    { id: 'transport', label: '交通', icon: '🚇', type: 'expense' },
    { id: 'shop', label: '購物', icon: '🎁', type: 'expense' },
    { id: 'fun', label: '娛樂', icon: '🎠', type: 'expense' },
    { id: 'home', label: '居家', icon: '🛋️', type: 'expense' },
    { id: 'health', label: '健康', icon: '🌿', type: 'expense' },
    { id: 'beauty', label: '美妝', icon: '💄', type: 'expense' },
    { id: 'pet', label: '寵物', icon: '🐾', type: 'expense' },
    { id: 'study', label: '學習', icon: '📚', type: 'expense' },
    { id: 'travel', label: '旅行', icon: '✈️', type: 'expense' },
    { id: 'gift', label: '送禮', icon: '🎀', type: 'expense' },
    { id: 'other_exp', label: '其他', icon: '✨', type: 'expense' },

    { id: 'salary', label: '薪資', icon: '💼', type: 'income' },
    { id: 'bonus', label: '獎金', icon: '🧧', type: 'income' },
    { id: 'invest', label: '投資', icon: '📈', type: 'income' },
    { id: 'pocket', label: '零用錢', icon: '👛', type: 'income' },
    { id: 'refund', label: '退款', icon: '↩️', type: 'income' },
    { id: 'other_inc', label: '其他', icon: '✨', type: 'income' }
  ];

  const ICON_OPTIONS = [
    '🍜', '🍱', '🍛', '🍔', '🍟',
    '🧋', '☕', '🍵', '🍰', '🧁',
    '🍪', '🍮', '🍓', '🍫', '🥐',
    '🍎', '🍇', '🍉', '🥗', '🍙',

    '🚇', '🚌', '🚕', '🚗', '🛵',
    '🚲', '🚄', '✈️', '🧳', '⛽',

    '🎁', '🛍️', '👗', '👟', '💄',
    '📱', '💻', '⌚', '🎧', '🧸',

    '🎠', '🎬', '🎮', '🎤', '🎵',
    '🎨', '📷', '🏀', '⚽', '🎯',

    '🏠', '🛋️', '💡', '🧺', '🛒',
    '🧻', '🧼', '🪴', '🔧', '📦',

    '🌿', '💊', '🏥', '💪', '🧘',
    '🦷', '👓', '😴', '💆', '🧴',

    '🐾', '🐶', '🐱', '🐰', '🐹',
    '📚', '📝', '📖', '💼', '🧧',
    '📈', '👛', '↩️', '💰', '🏦',

    '🍑', '✨', '🎀', '🤎', '💗',
    '⭐', '☁️', '🌙', '🖤', '💜', '💛',
    '🫧', '🌊', '🍮', '🍯'
  ];

  let selectedNewIcon = '✨';

  let categories = [];
  let editingCategories = [];

  let records = [];
  let currentMonth = new Date().toISOString().slice(0, 7);
  let currentType = 'expense';
  let selectedCat = null;
  let currentPage = 'record';
  let compareType = 'expense';
  let compareMode = 'month';
