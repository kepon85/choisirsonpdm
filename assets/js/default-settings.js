// *********** NE PAS MODIFIER LES PARAMETRES PAR DEFAUT CI DESSOUS *********
// *********** MODIFIER settings.js *********
// *********** DO NOT MODIFY DEFAULT SETTINGS DOWN HERE **********

const defaultSettings = {
  "debug":                        false,
  "debugLoadMap":                 false,
  "apiBaseTemperature":           "https://choisirson.zici.fr/api/baseTemperature.php",
  "apiDebounceTtimeout":           1500,
  "defaultLanguage":              "fr",
  "domains": {
    "domain":                     "choisirson.zici.fr"
  },
  "form_default": {
    "temp_base_years_archive":     10,
    "ubat_global":                 0.3,
    "venti_global":                0.14,
    "g":                           0.3,
    "livingvolume_auto" :           true,
  },
  "includeJavascript" : {},
}

// make settings global
settings = {};
//console.log('settings');
// create settings from default
let keys = Object.keys(defaultSettings);
for (let key of keys){
  settings[key] = defaultSettings[key];
}

if (typeof userSettings == 'undefined') {
  alert("Copy settings.js_default to settings.js en edit this")
}

//console.log(settings);
// override from user prefs
keys = Object.keys(userSettings);
for (let key of keys){
  settings[key] = userSettings[key];
}

console.log(settings);
