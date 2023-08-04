// *********** NE PAS MODIFIER LES PARAMETRES PAR DEFAUT CI DESSOUS *********
// *********** MODIFIER settings.js *********
// *********** DO NOT MODIFY DEFAULT SETTINGS DOWN HERE **********

const defaultSettings = {
  "debug":                        false,
  "debugLoadMap":                 false,
  "apiBaseTemperature":           "https://choisirsonpdm.zici.fr/api/baseTemperature.php",
  "apiDebounceTtimeout":           1500,
  "defaultLanguage":              "fr",
  "domains": {
    "domain":                     "choisirsonpdm.zici.fr"
  },
  "form_default": {
    "temp_base_years_archive":     10,
    "ubat_global":                 0.3,
    "venti_global":                0.14,
    "g":                           0.3,
    "livingvolume_auto" :           true,
  },
  "pdmData": [
    {
      // https://wiki.lowtech.fr/s/Poele_de_Masse.Petit_Habitat:Doc:Pr%C3%A9sentation
      "name": "[Agir Low-Tech] MiniMasse",
      "dalyPower": [ 
        { "fire": 1, "woodLoad": 2.5, "power": 325 },
        { "fire": 2, "woodLoad": 2.5, "power": 650 },
        { "fire": 3, "woodLoad": 2.5, "power": 975 },
        { "fire": 1, "woodLoad": 5, "power": 650 },
        { "fire": 2, "woodLoad": 5, "power": 1300 },
        { "fire": 3, "woodLoad": 5, "power": 1950 },
      ],
      "weight": 450,
      "link": "https://agir.lowtech.fr/minimasse/",
      "comment": "",
    },
    {
      // https://www.uzume.fr/quelle-puissance-pour-mon-poele-de-masse
      "name": "[Uzume] Medi Batchblock semi-masse",
      "dalyPower": [ 
        { "fire": 1, "woodLoad": 18, "power": 2800 },
        { "fire": 2, "woodLoad": 18, "power": 5600 },
        { "fire": 3, "woodLoad": 18, "power": 8400 }
      ],
      "weight": 1400,
      "link": "https://www.uzume.fr/plans-poeles-de-masse/Medi-Batchblock",
      "comment": "",
    },
    {
      // https://www.uzume.fr/quelle-puissance-pour-mon-poele-de-masse
      "name": "[Uzume] Medi Batchblock semi-masse avec banc",
      "dalyPower": [ 
        { "fire": 1, "woodLoad": 18, "power": 2800 },
        { "fire": 2, "woodLoad": 18, "power": 5600 },
        { "fire": 3, "woodLoad": 18, "power": 8400 }
      ],
      "weight": 1660,
      "link": "https://www.uzume.fr/plans-poeles-de-masse/Medi-Batchblock-avec-banc",
      "comment": "",
    },
    {
      // https://www.uzume.fr/quelle-puissance-pour-mon-poele-de-masse
      "name": "[Uzume] Medi Batchblock semi-masse avec mur de chauffe",
      "dalyPower": [ 
        { "fire": 1, "woodLoad": 18, "power": 2800 },
        { "fire": 2, "woodLoad": 18, "power": 5600 },
        { "fire": 3, "woodLoad": 18, "power": 8400 }
      ],
      "weight": 1750,
      "link": "https://www.uzume.fr/plans-poeles-de-masse/Medi-Batchblock-avec-mur-de-chauffe",
      "comment": "",
    },
    {
      // https://www.uzume.fr/quelle-puissance-pour-mon-poele-de-masse
      "name": "[Uzume] Maxi Batchblock avec banc",
      "dalyPower": [ 
        { "fire": 1, "woodLoad": 28, "power": 4300 },
        { "fire": 2, "woodLoad": 28, "power": 8600 },
        { "fire": 3, "woodLoad": 28, "power": 12800 }
      ],
      "weight": 1830,
      "link": "https://www.uzume.fr/plans-poeles-de-masse/Maxi-Batchblock-avec-banc",
      "comment": "",
    },
    {
      // https://www.uzume.fr/quelle-puissance-pour-mon-poele-de-masse
      "name": "[Uzume] Maxi Batchblock si chargement de type Batchblock. ",
      "dalyPower": [ 
        { "fire": 1, "woodLoad": 28, "power": 3800 },
        { "fire": 2, "woodLoad": 28, "power": 7700 },
        { "fire": 3, "woodLoad": 28, "power": 11500 }
      ],
      "weight": 2000,
      "link": "https://www.uzume.fr/plans-poeles-de-masse/Maxi-Batchblock",
      "comment": "",
    },
    {
      // https://www.uzume.fr/quelle-puissance-pour-mon-poele-de-masse
      "name": "[Uzume] Cuisinière Batchblock ",
      "dalyPower": [ 
        { "fire": 1, "woodLoad": 8, "power": 1200 },
        { "fire": 2, "woodLoad": 8, "power": 2500 },
        { "fire": 3, "woodLoad": 8, "power": 3700 }
      ],
      "weight": 1050,
      "link": "https://www.uzume.fr/plans-poeles-de-masse/Cuisini%C3%A8re-Batchblock-",
      "comment": "",
    },
    {
      // https://www.uzume.fr/quelle-puissance-pour-mon-poele-de-masse
      "name": "[Uzume] Mini Batchblock avec banc",
      "dalyPower": [ 
        { "fire": 1, "woodLoad": 8, "power": 1200 },
        { "fire": 2, "woodLoad": 8, "power": 2500 },
        { "fire": 3, "woodLoad": 8, "power": 3700 }
      ],
      "weight": 1250,
      "link": "https://www.uzume.fr/plans-poeles-de-masse/Mini-Batchblock-avec-banc",
      "comment": "",
    },
    {
      // https://www.oxalis-asso.org/?page_id=3202
      // Nombre de flambée / poids du bois à confirmer
      "name": "[Oxalis] 4kW",
      "dalyPower": [ 
        { "fire": 1, "woodLoad": "?", "power": 4000 },
      ],
      "weight": 2000,
      "link": "https://www.oxalis-asso.org/?page_id=3202",
      "comment": "",
    },
    {
      // https://www.oxalis-asso.org/?page_id=3202
      // Nombre de flambée / poids du bois à confirmer
      "name": "[Oxalis] 6kW",
      "dalyPower": [ 
        { "fire": 1, "woodLoad": "?", "power": 6000 },
      ],
      "weight": 2300,
      "link": "https://www.oxalis-asso.org/?page_id=3202",
      "comment": "",
    },
    {
      // https://www.oxalis-asso.org/?page_id=3202
      // Nombre de flambée / poids du bois à confirmer
      "name": "[Oxalis] 8kW",
      "dalyPower": [ 
        { "fire": 1, "woodLoad": "?", "power": 8000 },
      ],
      "weight": 2650,
      "link": "https://www.oxalis-asso.org/?page_id=3202",
      "comment": "",
    },
  ],
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

//console.log(settings);
