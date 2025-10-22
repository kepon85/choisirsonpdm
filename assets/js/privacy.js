(function(window, document) {
  'use strict';

  const CONSENT_VERSION = 1;
  const STORAGE_KEY = 'privacy-consent';
  const DEFAULT_PREFERENCES = {
    functional: false,
    thirdParty: false
  };
  const KNOWN_FUNCTIONAL_KEYS = [
    'setting',
    'lngLat',
    'theme',
    'i18n',
    'choisirsonpdm.savedStudies',
    'choisirsonpdm.contactReturn'
  ];
  const THIRD_PARTY_ASSETS = [
    {
      type: 'link',
      rel: 'stylesheet',
      href: 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css'
    },
    {
      type: 'link',
      rel: 'stylesheet',
      href: 'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/v5.0.0/mapbox-gl-geocoder.css'
    },
    {
      type: 'script',
      src: 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js'
    },
    {
      type: 'script',
      src: 'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/v5.0.0/mapbox-gl-geocoder.min.js'
    }
  ];

  const memoryStore = {};
  const trackedKeys = new Set();
  KNOWN_FUNCTIONAL_KEYS.forEach(function(key) {
    trackedKeys.add(key);
  });

  const changeListeners = [];
  const thirdPartyAllowListeners = [];
  const thirdPartyRevokeListeners = [];

  let storageAvailable = isLocalStorageAvailable();
  let state = {
    preferences: clonePreferences(DEFAULT_PREFERENCES),
    consentRecorded: false,
    version: CONSENT_VERSION,
    recordedAt: null
  };

  let bannerElement = null;
  let modalElement = null;
  let modalCheckboxFunctional = null;
  let modalCheckboxThirdParty = null;
  let feedbackElement = null;
  let thirdPartyAssetsPromise = null;
  let initialized = false;

  function isLocalStorageAvailable() {
    try {
      if (!('localStorage' in window)) {
        return false;
      }
      const testKey = '__privacy_test__' + Date.now();
      window.localStorage.setItem(testKey, '1');
      window.localStorage.removeItem(testKey);
      return true;
    } catch (error) {
      return false;
    }
  }

  function clonePreferences(preferences) {
    const source = preferences || {};
    return {
      functional: !!source.functional,
      thirdParty: !!source.thirdParty
    };
  }

  function resolveStoredPreferences() {
    if (!storageAvailable) {
      return null;
    }
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return null;
      }
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object') {
        return null;
      }
      if (parsed.version !== CONSENT_VERSION) {
        return null;
      }
      return parsed;
    } catch (error) {
      return null;
    }
  }

  function persistConsent() {
    if (!storageAvailable) {
      return;
    }
    try {
      const payload = {
        version: CONSENT_VERSION,
        preferences: state.preferences,
        recordedAt: state.recordedAt || Date.now()
      };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (error) {
      // If we cannot persist, we keep the consent only for the current session.
    }
  }

  function flushMemoryToStorage() {
    if (!storageAvailable || !state.preferences.functional) {
      return;
    }
    Object.keys(memoryStore).forEach(function(key) {
      try {
        window.localStorage.setItem(key, memoryStore[key]);
      } catch (error) {
        // Ignore write errors and keep the value in memory.
        return;
      }
      delete memoryStore[key];
    });
  }

  function transferStorageToMemory() {
    if (!storageAvailable) {
      return;
    }
    trackedKeys.forEach(function(key) {
      if (!key || key === STORAGE_KEY) {
        return;
      }
      try {
        const value = window.localStorage.getItem(key);
        if (value !== null) {
          memoryStore[key] = value;
        }
        window.localStorage.removeItem(key);
      } catch (error) {
        // ignore
      }
    });
  }

  function clearFunctionalData() {
    let removed = 0;
    trackedKeys.forEach(function(key) {
      if (!key || key === STORAGE_KEY) {
        return;
      }
      if (Object.prototype.hasOwnProperty.call(memoryStore, key)) {
        delete memoryStore[key];
        removed += 1;
      }
      if (storageAvailable) {
        try {
          if (window.localStorage.getItem(key) !== null) {
            window.localStorage.removeItem(key);
            removed += 1;
          }
        } catch (error) {
          // ignore remove failure
        }
      }
    });
    return removed;
  }

  function getFunctionalItem(key) {
    if (!key) {
      return null;
    }
    if (state.preferences.functional && storageAvailable) {
      try {
        const value = window.localStorage.getItem(key);
        if (value !== null) {
          return value;
        }
      } catch (error) {
        // fallback to memory store
      }
    }
    if (Object.prototype.hasOwnProperty.call(memoryStore, key)) {
      return memoryStore[key];
    }
    return null;
  }

  function setFunctionalItem(key, value) {
    if (!key) {
      return;
    }
    trackedKeys.add(key);
    const stringValue = value === undefined ? 'undefined' : String(value);
    if (state.preferences.functional && storageAvailable) {
      try {
        window.localStorage.setItem(key, stringValue);
        delete memoryStore[key];
        return;
      } catch (error) {
        // fallback to memory store
      }
    }
    memoryStore[key] = stringValue;
  }

  function removeFunctionalItem(key) {
    if (!key) {
      return;
    }
    trackedKeys.add(key);
    delete memoryStore[key];
    if (storageAvailable) {
      try {
        window.localStorage.removeItem(key);
      } catch (error) {
        // ignore
      }
    }
  }

  function isFunctionalAllowed() {
    return !!state.preferences.functional;
  }

  function isThirdPartyAllowed() {
    return !!state.preferences.thirdParty;
  }

  function onPreferencesChange(callback) {
    if (typeof callback === 'function') {
      changeListeners.push(callback);
    }
  }

  function onThirdPartyAllowed(callback) {
    if (typeof callback === 'function') {
      thirdPartyAllowListeners.push(callback);
      if (isThirdPartyAllowed()) {
        ensureThirdPartyAssets().then(function() {
          callback(clonePreferences(state.preferences));
        });
      }
    }
  }

  function onThirdPartyRevoked(callback) {
    if (typeof callback === 'function') {
      thirdPartyRevokeListeners.push(callback);
      if (!isThirdPartyAllowed()) {
        callback(clonePreferences(state.preferences));
      }
    }
  }

  function notifyChange(previousPreferences, nextPreferences) {
    changeListeners.forEach(function(listener) {
      try {
        listener(clonePreferences(previousPreferences), clonePreferences(nextPreferences));
      } catch (error) {
        // ignore listener errors
      }
    });
  }

  function handleFunctionalChange(previousPreferences, nextPreferences) {
    if (previousPreferences.functional !== nextPreferences.functional) {
      if (nextPreferences.functional) {
        flushMemoryToStorage();
      } else {
        transferStorageToMemory();
      }
    }
  }

  function handleThirdPartyChange(previousPreferences, nextPreferences) {
    if (previousPreferences.thirdParty === nextPreferences.thirdParty) {
      return;
    }
    if (nextPreferences.thirdParty) {
      ensureThirdPartyAssets().then(function() {
        thirdPartyAllowListeners.forEach(function(listener) {
          try {
            listener(clonePreferences(nextPreferences));
          } catch (error) {
            // ignore listener errors
          }
        });
      });
    } else {
      thirdPartyRevokeListeners.forEach(function(listener) {
        try {
          listener(clonePreferences(nextPreferences));
        } catch (error) {
          // ignore listener errors
        }
      });
    }
  }

  function ensureThirdPartyAssets() {
    if (thirdPartyAssetsPromise) {
      return thirdPartyAssetsPromise;
    }
    thirdPartyAssetsPromise = new Promise(function(resolve) {
      var index = 0;
      function loadNext() {
        if (index >= THIRD_PARTY_ASSETS.length) {
          resolve();
          return;
        }
        const asset = THIRD_PARTY_ASSETS[index++];
        if (asset.type === 'link') {
          const link = document.createElement('link');
          link.rel = asset.rel || 'stylesheet';
          if (asset.href) {
            link.href = asset.href;
          }
          link.addEventListener('load', loadNext, { once: true });
          link.addEventListener('error', loadNext, { once: true });
          document.head.appendChild(link);
        } else if (asset.type === 'script') {
          const script = document.createElement('script');
          script.src = asset.src;
          script.async = false;
          script.addEventListener('load', loadNext, { once: true });
          script.addEventListener('error', loadNext, { once: true });
          document.body.appendChild(script);
        } else {
          loadNext();
        }
      }
      loadNext();
    });
    return thirdPartyAssetsPromise;
  }

  function translate(key, fallback) {
    try {
      if (window.jQuery && typeof window.jQuery.i18n === 'function') {
        const translated = window.jQuery.i18n(key);
        if (translated) {
          return translated;
        }
      } else if (window.$ && typeof window.$.i18n === 'function') {
        const translated = window.$.i18n(key);
        if (translated) {
          return translated;
        }
      }
    } catch (error) {
      // ignore translation errors
    }
    return fallback;
  }

  function showFeedback(message, type) {
    if (!feedbackElement) {
      return;
    }
    feedbackElement.textContent = message || '';
    feedbackElement.hidden = !message;
    feedbackElement.classList.remove('alert-info', 'alert-success', 'alert-danger');
    if (type === 'success') {
      feedbackElement.classList.add('alert-success');
    } else if (type === 'danger') {
      feedbackElement.classList.add('alert-danger');
    } else {
      feedbackElement.classList.add('alert-info');
    }
  }

  function updateUI() {
    if (bannerElement) {
      const shouldShowBanner = !state.consentRecorded;
      bannerElement.hidden = !shouldShowBanner;
      bannerElement.classList.toggle('privacy-banner--hidden', !shouldShowBanner);
    }
    if (modalElement) {
      if (modalCheckboxFunctional) {
        modalCheckboxFunctional.checked = !!state.preferences.functional;
      }
      if (modalCheckboxThirdParty) {
        modalCheckboxThirdParty.checked = !!state.preferences.thirdParty;
      }
    }
  }

  function openModal() {
    if (!modalElement) {
      return;
    }
    modalElement.hidden = false;
    document.body.classList.add('privacy-modal-open');
    showFeedback('', 'info');
    updateUI();
  }

  function closeModal() {
    if (!modalElement) {
      return;
    }
    modalElement.hidden = true;
    document.body.classList.remove('privacy-modal-open');
    showFeedback('', 'info');
  }

  function isModalOpen() {
    return modalElement && !modalElement.hidden;
  }

  function setPreferences(preferences) {
    const previousPreferences = clonePreferences(state.preferences);
    const nextPreferences = clonePreferences(preferences);
    state.preferences = nextPreferences;
    state.consentRecorded = true;
    state.recordedAt = Date.now();
    persistConsent();
    updateUI();
    notifyChange(previousPreferences, nextPreferences);
    handleFunctionalChange(previousPreferences, nextPreferences);
    handleThirdPartyChange(previousPreferences, nextPreferences);
  }

  function applyStoredPreferences() {
    const stored = resolveStoredPreferences();
    if (stored) {
      state.preferences = clonePreferences(stored.preferences);
      state.consentRecorded = true;
      state.recordedAt = stored.recordedAt || Date.now();
    }
  }

  function handleAction(action) {
    switch (action) {
      case 'accept-all':
        setPreferences({ functional: true, thirdParty: true });
        closeModal();
        break;
      case 'reject':
        setPreferences({ functional: false, thirdParty: false });
        closeModal();
        break;
      case 'save':
        if (modalCheckboxFunctional && modalCheckboxThirdParty) {
          setPreferences({
            functional: modalCheckboxFunctional.checked,
            thirdParty: modalCheckboxThirdParty.checked
          });
        }
        closeModal();
        break;
      case 'customize':
        openModal();
        break;
      case 'close':
        closeModal();
        break;
      case 'delete':
        clearFunctionalData();
        showFeedback(translate('privacy-modal-feedback-cleared', 'Les données locales ont été supprimées.'), 'success');
        break;
      default:
        break;
    }
  }

  function handleDocumentClick(event) {
    const trigger = event.target && event.target.closest ? event.target.closest('[data-privacy-action]') : null;
    if (!trigger) {
      return;
    }
    const action = trigger.getAttribute('data-privacy-action');
    if (!action) {
      return;
    }
    event.preventDefault();
    handleAction(action);
  }

  function handleModalClick(event) {
    if (event.target === modalElement) {
      closeModal();
    }
  }

  function handleKeyDown(event) {
    if (event.key === 'Escape' && isModalOpen()) {
      closeModal();
    }
  }

  function initUI() {
    if (initialized) {
      return;
    }
    initialized = true;
    bannerElement = document.getElementById('privacy-banner');
    modalElement = document.getElementById('privacy-modal');
    modalCheckboxFunctional = document.getElementById('privacy-consent-functional');
    modalCheckboxThirdParty = document.getElementById('privacy-consent-thirdparty');
    feedbackElement = document.getElementById('privacy-modal-feedback');

    if (modalElement) {
      modalElement.addEventListener('click', handleModalClick);
    }

    applyStoredPreferences();
    if (state.preferences.functional) {
      flushMemoryToStorage();
    }
    updateUI();
  }

  applyStoredPreferences();

  document.addEventListener('DOMContentLoaded', initUI);
  document.addEventListener('click', handleDocumentClick);
  document.addEventListener('keydown', handleKeyDown);

  window.PrivacyConsent = {
    hasRecordedConsent: function() {
      return !!state.consentRecorded;
    },
    isFunctionalAllowed: isFunctionalAllowed,
    isThirdPartyAllowed: isThirdPartyAllowed,
    getFunctionalItem: getFunctionalItem,
    setFunctionalItem: setFunctionalItem,
    removeFunctionalItem: removeFunctionalItem,
    clearFunctionalData: clearFunctionalData,
    onPreferencesChange: onPreferencesChange,
    onThirdPartyAllowed: onThirdPartyAllowed,
    onThirdPartyRevoked: onThirdPartyRevoked,
    ensureThirdPartyAssets: ensureThirdPartyAssets,
    openModal: openModal,
    closeModal: closeModal
  };
})(window, document);
