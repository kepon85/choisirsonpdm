// *********** NE PAS MODIFIER LES PARAMETRES PAR DEFAUT CI DESSOUS *********
// *********** MODIFIER settings.js *********
// *********** DO NOT MODIFY DEFAULT SETTINGS DOWN HERE **********

const defaultSettings = {
  "debug":                        false,
  "debugLoadMap":                 false,
  "apiBaseTemperature":           "https://choisir.poeledemasse.org/api/baseTemperature.php",
  "apiDebounceTtimeout":           1500,
  "defaultLanguage":              "fr",
  "form_default": {
    "temp_base_years_archive":     10,
    "ubat_global":                 0.4,
    "venti_global":                0.14,
    "g":                           0.3,
    "livingvolume_auto" :           true,
  },
  'sharingButton': {
    'facebook': 'https://facebook.com/sharer/sharer.php?u=__URL__',
    'twitter': 'https://twitter.com/intent/tweet/?text=__TITLE__&url=__URL__',
    'tumblr': 'https://www.tumblr.com/widgets/share/tool?posttype=link&title=Choisir%20son%20po%C3%AAle%20de%20masse...&caption=__TITLE__&content=__URL__&canonicalUrl=__URL__&shareSource=tumblr_share_button',
    'email': 'mailto:?subject=__TITLE__&body=__URL__',
    'pinterest': 'https://pinterest.com/pin/create/button/?url=__URL__&media=__URL__&description=__TITLE__',
    'linkedin': 'https://www.linkedin.com/shareArticle?mini=true&url=https%3A%2F%2Fchoisir.poeledemasse.org%2F&title=__TITLE__&summary=__TITLE__&source=__URL__',
    'reddit': 'https://reddit.com/submit/?url=__URL__&resubmit=true&title=__TITLE__',
    'xing': 'https://www.xing.com/app/user?op=share;url=__URL__;title=__TITLE__',
    'whatsapp': 'whatsapp://send?text=__TITLE__%20__URL__',
    'hackernews': 'https://news.ycombinator.com/submitlink?u=__URL__&t=__TITLE__',
    'vk': 'http://vk.com/share.php?title=__TITLE__&url=__URL__',
    'telegram': 'https://telegram.me/share/url?text=__TITLE__&url=__URL__',
  },
  "pdmSuggestion": {
    'percentPowerSuper': 10,
    'percentPowerCool': 24,
  },
  "pdmData": [
    {
      // https://wiki.lowtech.fr/s/Poele_de_Masse.Petit_Habitat:Doc:Pr%C3%A9sentation
      "name": "[Agir Low-Tech] MiniMasse",
      "dalyPower": [ 
        { "fire": 1, "woodLoad": 2.5, "power": 325 },
        //{ "fire": 2, "woodLoad": 2.5, "power": 650 },
        //{ "fire": 3, "woodLoad": 2.5, "power": 975 },
        { "fire": 1, "woodLoad": 5, "power": 650 },
        { "fire": 2, "woodLoad": 5, "power": 1300 },
        { "fire": 3, "woodLoad": 5, "power": 1950 },
      ],
      "weight": 450,
      "link": "https://agir.lowtech.fr/minimasse/",
      "comment": "",
    },
    {
      // https://forum.poeledemasse.org/t/donnee-differents-modeles-4-6-8kw-qte-de-bois-nombre-de-flambee/2106/18
      "name": "[Oxalis] 4kW sans BAF",
      "dalyPower": [ 
        { "fire": 1, "woodLoad": "10.2", "power": 1450 },
        { "fire": 2, "woodLoad": "10.2", "power": 2900 },
        { "fire": 3, "woodLoad": "10.2", "power": 4360 },
      ],
      "weight": 2000,
      "link": "https://www.oxalis-asso.org/?page_id=3202",
      "comment": "Avec boîte à feu",
    },
    {
      // https://forum.poeledemasse.org/t/donnee-differents-modeles-4-6-8kw-qte-de-bois-nombre-de-flambee/2106/18
      "name": "[Oxalis] 4kW avec BAF",
      "dalyPower": [ 
        { "fire": 1, "woodLoad": "6.4", "power": 900 },
        { "fire": 2, "woodLoad": "6.4", "power": 1810 },
        { "fire": 3, "woodLoad": "6.4", "power": 2710 },
      ],
      "weight": 2000,
      "link": "https://www.oxalis-asso.org/?page_id=3202",
      "comment": "Avec boîte à feu",
    },
    {
      // https://forum.poeledemasse.org/t/donnee-differents-modeles-4-6-8kw-qte-de-bois-nombre-de-flambee/2106/18
      "name": "[Oxalis] 6kW sans BAF",
      "dalyPower": [ 
        { "fire": 1, "woodLoad": "14.4", "power": 2000 },
        { "fire": 2, "woodLoad": "14.4", "power": 4000 },
        { "fire": 3, "woodLoad": "14.4", "power": 6100 },
      ],
      "weight": 2300,
      "link": "https://www.oxalis-asso.org/?page_id=3202",
      "comment": "Sans boîte à feu",
    },
    {
      // https://forum.poeledemasse.org/t/donnee-differents-modeles-4-6-8kw-qte-de-bois-nombre-de-flambee/2106/18
      "name": "[Oxalis] 6kW avec BAF",
      "dalyPower": [ 
        { "fire": 1, "woodLoad": "8.35", "power": 1180 },
        { "fire": 2, "woodLoad": "8.35", "power": 2370 },
        { "fire": 3, "woodLoad": "8.35", "power": 3550 },
      ],
      "weight": 2300,
      "link": "https://www.oxalis-asso.org/?page_id=3202",
      "comment": "Sans boîte à feu",
    },
    {
      // https://forum.poeledemasse.org/t/donnee-differents-modeles-4-6-8kw-qte-de-bois-nombre-de-flambee/2106/18
      "name": "[Oxalis] 8kW sans BAF",
      "dalyPower": [ 
        { "fire": 1, "woodLoad": "20", "power": 2850 },
        { "fire": 2, "woodLoad": "20", "power": 5700 },
        { "fire": 3, "woodLoad": "20", "power": 8500 },
      ],
      "weight": 2650,
      "link": "https://www.oxalis-asso.org/?page_id=3202",
      "comment": "",
    },
    {
      // https://forum.poeledemasse.org/t/donnee-differents-modeles-4-6-8kw-qte-de-bois-nombre-de-flambee/2106/18
      "name": "[Oxalis] 8kW avec BAF",
      "dalyPower": [ 
        { "fire": 1, "woodLoad": "12.2", "power": 1720 },
        { "fire": 2, "woodLoad": "12.2", "power": 3440 },
        { "fire": 3, "woodLoad": "12.2", "power": 5200 },
      ],
      "weight": 2650,
      "link": "https://www.oxalis-asso.org/?page_id=3202",
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
    }
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
