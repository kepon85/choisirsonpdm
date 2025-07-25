// *********** NE PAS MODIFIER LES PARAMETRES PAR DEFAUT CI DESSOUS *********
// *********** MODIFIER settings.js *********
// *********** DO NOT MODIFY DEFAULT SETTINGS DOWN HERE **********

const defaultSettings = {
  "debug":                        false,
  "debugLoadMap":                 false,
  "appShortName":                 "choisirsonpdm",
  "apiBaseTemperature":           "https://choisir.poeledemasse.org/api/baseTemperature.php",
  "apiDju":                       "https://choisir.poeledemasse.org/api/dju.php",
  "apiMateriaux":                 "https://choisir.poeledemasse.org/api/materiaux/index.php",
  "apiContact":                   "https://choisir.poeledemasse.org/api/contact.php",
  "apiLink":                      "https://choisir.poeledemasse.org/api/link.php",
  "apiDebounceTtimeout":           1500,
  "defaultLanguage":              "fr",
  "dju": {           // https://blog.elyotherm.fr/2015/08/dju-degre-jour-unifies-base-18.html
    "η":      0.75,    // https://forum.afpma.pro/t/logiciel-choisir-son-pdm-pour-sa-maison/763/29?u=david.mercereau
    "i":      0.8,   // https://forum.afpma.pro/t/logiciel-choisir-son-pdm-pour-sa-maison/763/29?u=david.mercereau
    "pci": {
      "wood": 4080
    },
    "stere": {
      "hardwoods": 420, // kg/stere
    },
  },
  "form_default": {
    "temp_indor":                 19, 
    "level":                       1,
    "temp_base_nb_years_archive":  20,
    "temp_base_end_years_archive": '',
    "temp_base_nb_days":           5,
    "temp_base_mode":             'contiguousDay',
    "dju_years_archive":           20,
    "ubat_global":                 0.4,
    "venti_global":                0.14,
    "g":                           0.3,
    "livingvolume_auto" :           true,
    "temp_ground":                 11,
    "temp_ground":                 11,
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
  "localSettingDefault": {
    "version": 2, 
    "material": [],
    "wall": []
  },
  "pdmSuggestion": {
    'percentPowerSuper': 8,
    'percentPowerCool': 20,
  },
  "wallType": [
    {
      "text": "RT2012 Toiture",
      "children": [
        {
          "id": "rt2012toit1_5.2",
          "text": "Combles aménageables ou rampants < 60° (H1A, H1B, H1C)"
        },
        {
          "id": "rt2012toit2_4.5",
          "text": "Combles aménageables ou rampants < 60° (H2A, H2B, H2C, H2D H3>800m)"
        },
        {
          "id": "rt2012toit3_4",
          "text": "Combles aménageables ou rampants < 60° (H3<800m)"
        },
        {
          "id": "rt2012toit4_4",
          "text": "Combles perdus"
        },
        {
          "id": "rt2012toit5_4.5",
          "text": "Toitures-terrasses (H1A, H1B, H1C)"
        },
        {
          "id": "rt2012toit6_4.3",
          "text": "Toitures-terrasses (H2A, H2B, H2C, H2D H3>800m)"
        },
        {
          "id": "rt2012toit7_4",
          "text": "Toitures-terrasses (H3<800m)"
        }
      ]
    },
    {
      "text": "RT2012 Mur",
      "children": [
        {
          "id": "rt2012mur1_3.2",
          "text": "Murs et rampants > 60° (H1A, H1B, H1C)"
        },
        {
          "id": "rt2012mur2_3.2",
          "text": "Murs et rampants > 60° (H2A, H2B, H2C, H2D H3>800m)"
        },
        {
          "id": "rt2012mur3_2.2",
          "text": "Murs et rampants > 60° (H3<800m)"
        },
        {
          "id": "rt2012mur4_3.5",
          "text": "Murs sur volume non chauffé"
        }
      ]
    },
    {
      "text": "RT2012 Planchers",
        "children": [
          {
            "id": "rt2012planc1_3",
            "text": "Planchers bas donnant sur parking collectif, sur extérieur, vide sanitaire ou volume non chauffé  (H1A, H1B, H1C)"
          },
          {
            "id": "rt2012planc2_3",
            "text": "Planchers bas donnant sur parking collectif, sur extérieur, vide sanitaire ou volume non chauffé  (H2A, H2B, H2C, H2D H3>800m)"
          },
          {
            "id": "rt2012planc3_2.1",
            "text": "Planchers bas donnant sur parking collectif, sur extérieur, vide sanitaire ou volume non chauffé  (H3<800m)"
          }
      ]
    },
    {
      "text": "RE2020 Mur",
        "children": [
          {
            "id": "re2020mur1_2.9",
            "text": "Mur en contact avec l’extérieur (H1A, H1B, H1C)"
          },
          {
            "id": "re2020mur2_2.9",
            "text": "Mur en contact avec l’extérieur (H2A, H2B, H2C, H2D H3>800m)"
          },
          {
            "id": "re2020mur3_2.2",
            "text": "Mur en contact avec l’extérieur (H3<800m)"
          },
          {
            "id": "re2020mur4_2",
            "text": "Murs sur volume non chauffé"
          }
      ]
    },
    {
      "text": "RE2020 Toiture",
        "children": [
          {
            "id": "re2020toit1_4.4",
            "text": "Combles aménagés (isolation dans le rampant sous toiture) (H1A, H1B, H1C)"
          },
          {
            "id": "re2020toit2_4.3",
            "text": "Combles aménagés (isolation dans le rampant sous toiture) (H2A, H2B, H2C, H2D H3>800m)"
          },
          {
            "id": "re2020toit3_4",
            "text": "Combles aménagés (isolation dans le rampant sous toiture) (H3<800m)"
          },
          {
            "id": "re2020toit4_4.8",
            "text": "Combles perdus (isolation sur le plancher des combles)"
          }
      ]
    },
    {
      "text": "RE2020 Planchers",
        "children": [
          {
            "id": "re2020planc1_2.7",
            "text": "Planchers bas donnant sur l’extérieur ou sur un local non chauffé (H1A, H1B, H1C)"
          },
          {
            "id": "re2020planc2_2.7",
            "text": "Planchers bas donnant sur l’extérieur ou sur un local non chauffé (H2A, H2B, H2C, H2D H3>800m)"
          },
          {
            "id": "re2020planc3_2.1",
            "text": "Planchers bas donnant sur l’extérieur ou sur un local non chauffé (H3<800m)"
          }
      ]
    }
  ],
  "winType": [
    {
      "text": "Fenêtres",
      "children": [
        {
          "id": "5.7",
          "text": "Simple Vitrage, Uw=5.7"
        },
        {
          "id": "2.8",
          "text": "Vitrage isolant jusqu'en 1990, Uw=2.8"
        },
        {
          "id": "1.7",
          "text": "Double Vitrage, Uw=1.7"
        },
        {
          "id": "1.5",
          "text": "Double Vitrage, Uw=1.5"
        },
        {
          "id": "1.3",
          "text": "Double Vitrage, Uw=1.3 (RT2012 Minimum)"
        },
        {
          "id": "1.2",
          "text": "Double Vitrage, Uw=1.2"
        },
        {
          "id": "1.1",
          "text": "(Double) Triple Vitrage, Uw=1.1"
        },
        {
          "id": "1.0",
          "text": "Triple Vitrage, Uw=1.0"
        },
        {
          "id": "0.9",
          "text": "Triple Vitrage, Uw=0.9"
        },
        {
          "id": "0.85",
          "text": "Triple Vitrage, Uw=0.85"
        },
        {
          "id": "0.8",
          "text": "Triple Vitrage, Uw=0.8 (RE2020 Minimum)"
        },
        {
          "id": "0.75",
          "text": "Triple Vitrage, Uw=0.75"
        },
        {
          "id": "0.7",
          "text": "Triple Vitrage, Uw=0.7"
        },
        {
          "id": "0.65",
          "text": "Triple Vitrage, Uw=0.65"
        }
      ]
    },
    {
      "text": "Portes",
      "children": [
        {
          "id": "3.5",
          "text": "[Bois|PVC] Porte opaque pleine, Uporte=3.5"
        },
        {
          "id": "4",
          "text": "[Bois|PVC] Porte avec moins de 30% de vitrage simple, Uporte=4"
        },
        {
          "id": "4.5",
          "text": "[Bois|PVC] Porte avec 30-60% de vitrage simple, Uporte=4.5"
        },
        {
          "id": "3.3",
          "text": "[Bois|PVC] Porte avec double vitrage, Uporte=3.3"
        },
        {
          "id": "5.8",
          "text": "[Métal] Porte opaque pleine ou vitrage simple, Uporte=5.8"
        },
        {
          "id": "5.5",
          "text": "[Métal] Porte avec moins de 30% de double vitrage, Uporte=5.5"
        },
        {
          "id": "4.8",
          "text": "[Métal] Porte avec 30-60% de double vitrage, Uporte=4.8"
        },
        {
          "id": "2",
          "text": "[Toute menuiserie] Porte opaque pleine isolée, Uporte=2"
        },
        {
          "id": "1.5",
          "text": "[Toute menuiserie] Porte précédée d’un SAS, Uporte=1.5"
        }
      ]
    }
  ],
  // Pont thermique https://www.rt-batiment.fr/fileadmin/documents/RT2012/RT2012-BBC-Exe/RT2012-BBC-Exe-Annexe-thermique-2013-09-30.pdf
  "pontThermique": {
    "floor_lower_wall": {
      "no": {
        "no": 0.39,
        "ITI": 0.47,
        "ITE": 0.8,
        "ITI+ITE": 0.47
      },
      "ITI": {
        "no": 0.31,
        "ITI": 0.08,
        "ITE": 0.71,
        "ITI+ITE": 0.08
      },
      "ITE": {
        "no": 0.49,
        "ITI": 0.48,
        "ITE": 0.64,
        "ITI+ITE": 0.48
      },
      "ITR": {
        "no": 0.35,
        "ITI": 0.01,
        "ITE": 0.45,
        "ITI+ITE": 0.1
      },
      "ITI+ITE": {
        "no": 0.31,
        "ITI": 0.08,
        "ITE": 0.45,
        "ITI+ITE": 0.08
      },
      "ITI+ITR": {
        "no": 0.31,
        "ITI": 0.08,
        "ITE": 0.45,
        "ITI+ITE": 0.08
      },
      "ITE+ITR": {
        "no": 0.35,
        "ITI": 0.01,
        "ITE": 0.45,
        "ITI+ITE": 0.1
      }
    },
    "floor_inter_wall": {
      "no": 0.86,
      "ITI": 0.92,
      "ITE": 0.13,
      "ITR": 0.24,
      "ITI+ITE": 0.13,
      "ITI+ITR": 0.24,
      "ITE+ITR": 0.1
    },
    "floor_high_wall": {
      "no": {
        "no": 0.3,
        "ITI": 0.83,
        "ITE": 0.4,
        "ITI+ITE": 0.4
      },
      "ITI": {
        "no": 0.27,
        "ITI": 0.07,
        "ITE": 0.75,
        "ITI+ITE": 0.07
      },
      "ITE": {
        "no": 0.55,
        "ITI": 0.76,
        "ITE": 0.58,
        "ITI+ITE": 0.58
      },
      "ITR": {
        "no": 0.4,
        "ITI": 0.3,
        "ITE": 0.48,
        "ITI+ITE": 0.3
      },
      "ITI+ITE": {
        "no": 0.27,
        "ITI": 0.07,
        "ITE": 0.58,
        "ITI+ITE": 0.07
      },
      "ITI+ITR": {
        "no": 0.27,
        "ITI": 0.07,
        "ITE": 0.48,
        "ITI+ITE": 0.07
      },
      "ITE+ITR": {
        "no": 0.4,
        "ITI": 0.3,
        "ITE": 0.48,
        "ITI+ITE": 0.3
      }
    },
    "partition_wall": {
      "no": 0.73,
      "ITI": 0.82,
      "ITE": 0.13,
      "ITR": 0.2,
      "ITI+ITE": 0.13,
      "ITI+ITR": 0.2,
      "ITE+ITR": 0.13
    }
  },
  // NF P52-612/CN décembre 2010
  "temperatureBaseData": {
    "a": [
        { "altitudeMin": 0, "altitudeMax": 200, "temperature": -2 },
        { "altitudeMin": 201, "altitudeMax": 400, "temperature": -3 },
        { "altitudeMin": 401, "altitudeMax": 500, "temperature": -4 },
        { "altitudeMin": 501, "altitudeMax": 600, "temperature": -4 },
        { "altitudeMin": 601, "altitudeMax": 700, "temperature": -5 },
        { "altitudeMin": 701, "altitudeMax": 800, "temperature": -6 },
    ], "b": [
        { "altitudeMin": 0, "altitudeMax": 200, "temperature": -4 },
        { "altitudeMin": 201, "altitudeMax": 400, "temperature": -5 },
        { "altitudeMin": 401, "altitudeMax": 500, "temperature": -6 },
    ], "c": [
        { "altitudeMin": 0, "altitudeMax": 200, "temperature": -5 },
        { "altitudeMin": 201, "altitudeMax": 400, "temperature": -6 },
        { "altitudeMin": 401, "altitudeMax": 500, "temperature": -7 },
        { "altitudeMin": 501, "altitudeMax": 600, "temperature": -7 },
        { "altitudeMin": 601, "altitudeMax": 700, "temperature": -8 },
        { "altitudeMin": 701, "altitudeMax": 800, "temperature": -8 },
        { "altitudeMin": 801, "altitudeMax": 900, "temperature": -9 },
        { "altitudeMin": 901, "altitudeMax": 1000, "temperature": -9 },
        { "altitudeMin": 1001, "altitudeMax": 1100, "temperature": -10 },
        { "altitudeMin": 1101, "altitudeMax": 1200, "temperature": -10 },
        { "altitudeMin": 1201, "altitudeMax": 1300, "temperature": -11 },
        { "altitudeMin": 1301, "altitudeMax": 1400, "temperature": -11 },
        { "altitudeMin": 1401, "altitudeMax": 1500, "temperature": -12 },
        { "altitudeMin": 1501, "altitudeMax": 1600, "temperature": -12 },
        { "altitudeMin": 1601, "altitudeMax": 1700, "temperature": -12 },
        { "altitudeMin": 1701, "altitudeMax": 1800, "temperature": -13 },
        { "altitudeMin": 1801, "altitudeMax": 1900, "temperature": -14 },
        { "altitudeMin": 1901, "altitudeMax": 2000, "temperature": -14 },
    ], "d": [
        { "altitudeMin": 0, "altitudeMax": 200, "temperature": -6 },
        { "altitudeMin": 201, "altitudeMax": 400, "temperature": -7 },
        { "altitudeMin": 401, "altitudeMax": 500, "temperature": -8 },
        { "altitudeMin": 501, "altitudeMax": 600, "temperature": -9 },
        { "altitudeMin": 601, "altitudeMax": 700, "temperature": -10 },
        { "altitudeMin": 701, "altitudeMax": 800, "temperature": -11 },
        { "altitudeMin": 801, "altitudeMax": 900, "temperature": -12 },
        { "altitudeMin": 901, "altitudeMax": 1000, "temperature": -13 },
        { "altitudeMin": 1001, "altitudeMax": 1100, "temperature": -14 },
    ], "e": [
        { "altitudeMin": 0, "altitudeMax": 200, "temperature": -7 },
        { "altitudeMin": 201, "altitudeMax": 400, "temperature": -8 },
        { "altitudeMin": 401, "altitudeMax": 500, "temperature": -9 },
    ], "f": [
        { "altitudeMin": 0, "altitudeMax": 200, "temperature": -8 },
        { "altitudeMin": 201, "altitudeMax": 400, "temperature": -9 },
        { "altitudeMin": 401, "altitudeMax": 500, "temperature": -10 },
        { "altitudeMin": 501, "altitudeMax": 600, "temperature": -11 },
        { "altitudeMin": 601, "altitudeMax": 700, "temperature": -12 },
        { "altitudeMin": 701, "altitudeMax": 800, "temperature": -13 },
        { "altitudeMin": 801, "altitudeMax": 900, "temperature": -14 },
        { "altitudeMin": 901, "altitudeMax": 1000, "temperature": -15 },
        { "altitudeMin": 1001, "altitudeMax": 1100, "temperature": -16 },
        { "altitudeMin": 1101, "altitudeMax": 1200, "temperature": -17 },
        { "altitudeMin": 1201, "altitudeMax": 1300, "temperature": -18 },
        { "altitudeMin": 1301, "altitudeMax": 1400, "temperature": -19 },
    ], "g": [
        { "altitudeMin": 0, "altitudeMax": 200, "temperature": -10 },
        { "altitudeMin": 201, "altitudeMax": 400, "temperature": -11 },
        { "altitudeMin": 401, "altitudeMax": 500, "temperature": -12 },
        { "altitudeMin": 501, "altitudeMax": 600, "temperature": -13 },
        { "altitudeMin": 601, "altitudeMax": 700, "temperature": -14 },
        { "altitudeMin": 701, "altitudeMax": 800, "temperature": -15 },
        { "altitudeMin": 801, "altitudeMax": 900, "temperature": -16 },
        { "altitudeMin": 901, "altitudeMax": 1000, "temperature": -17 },
        { "altitudeMin": 1001, "altitudeMax": 1100, "temperature": -18 },
        { "altitudeMin": 1101, "altitudeMax": 1200, "temperature": -19 },
        { "altitudeMin": 1201, "altitudeMax": 1300, "temperature": -20 },
        { "altitudeMin": 1301, "altitudeMax": 1400, "temperature": -21 },
        { "altitudeMin": 1401, "altitudeMax": 1500, "temperature": -22 },
        { "altitudeMin": 1501, "altitudeMax": 1600, "temperature": -23 },
        { "altitudeMin": 1601, "altitudeMax": 1700, "temperature": -24 },
        { "altitudeMin": 1701, "altitudeMax": 1800, "temperature": -25 },
        { "altitudeMin": 1801, "altitudeMax": 1900, "temperature": -26 },
        { "altitudeMin": 1901, "altitudeMax": 2000, "temperature": -27 },
    ], "h": [
        { "altitudeMin": 0, "altitudeMax": 200, "temperature": -12 },
        { "altitudeMin": 201, "altitudeMax": 400, "temperature": -13 },
        { "altitudeMin": 401, "altitudeMax": 500, "temperature": -14 },
        { "altitudeMin": 501, "altitudeMax": 600, "temperature": -15 },
        { "altitudeMin": 601, "altitudeMax": 700, "temperature": -16 },
        { "altitudeMin": 701, "altitudeMax": 800, "temperature": -17 },
        { "altitudeMin": 801, "altitudeMax": 900, "temperature": -18 },
        { "altitudeMin": 901, "altitudeMax": 1000, "temperature": -19 },
        { "altitudeMin": 1001, "altitudeMax": 1100, "temperature": -20 },
        { "altitudeMin": 1101, "altitudeMax": 1200, "temperature": -21 },
        { "altitudeMin": 1201, "altitudeMax": 1300, "temperature": -22 },
        { "altitudeMin": 1301, "altitudeMax": 1400, "temperature": -23 },
        { "altitudeMin": 1401, "altitudeMax": 1500, "temperature": -24 },
    ], "i": [
        { "altitudeMin": 0, "altitudeMax": 200, "temperature": -15 },
        { "altitudeMin": 201, "altitudeMax": 400, "temperature": -15 },
        { "altitudeMin": 401, "altitudeMax": 500, "temperature": -16 },
        { "altitudeMin": 501, "altitudeMax": 600, "temperature": -17 },
        { "altitudeMin": 601, "altitudeMax": 700, "temperature": -18 },
        { "altitudeMin": 701, "altitudeMax": 800, "temperature": -19 },
        { "altitudeMin": 801, "altitudeMax": 900, "temperature": -20 },
        { "altitudeMin": 901, "altitudeMax": 1000, "temperature": -21 },
        { "altitudeMin": 1001, "altitudeMax": 1100, "temperature": -22 },
        { "altitudeMin": 1101, "altitudeMax": 1200, "temperature": -23 },
        { "altitudeMin": 1201, "altitudeMax": 1300, "temperature": -24 },
        { "altitudeMin": 1301, "altitudeMax": 1400, "temperature": -25 },
        { "altitudeMin": 1401, "altitudeMax": 1500, "temperature": -25 },
    ]
  },
  "pdmData": [
    {
      // https://wiki.lowtech.fr/s/Poele_de_Masse.Petit_Habitat:Doc:Pr%C3%A9sentation
      "name": "[Agir Low-Tech] MiniMasse",
      "dalyPower": [ 
        { "fire": 1, "woodLoad": 2.5, "power": 325, "use": "normal" },
        { "fire": 2, "woodLoad": 2.5, "power": 650, "use": "normal" },
        { "fire": 3, "woodLoad": 2.5, "power": 975, "use": "critical" },
        { "fire": 1, "woodLoad": 5, "power": 650, "use": "normal" },
        { "fire": 2, "woodLoad": 5, "power": 1300, "use": "normal" },
        { "fire": 3, "woodLoad": 5, "power": 1950, "use": "critical"},
      ],
      "weight": 450,
      "link": "https://agir.lowtech.fr/minimasse/",
      "comment": "",
    },
    {
      "name": "[Oxa-libre] S",
      "dalyPower": [
        { "fire": 1, "woodLoad": "6.4", "power": 1000, "use": "normal" },
        { "fire": 2, "woodLoad": "6.4", "power": 2000, "use": "critical" },
        { "fire": 3, "woodLoad": "6,4", "power": 3000, "use": "critical" },
      ],
      "weight": 2000,
      "link": "https://www.poeleoxalibre.org/les-plans/",
      "comment": "",
    },
    {
      "name": "[Oxa-libre] M",
      "dalyPower": [
        { "fire": 1, "woodLoad": "8.35", "power": 1500, "use": "normal" },
        { "fire": 2, "woodLoad": "8.35", "power": 3000, "use": "critical" },
        { "fire": 3, "woodLoad": "8.35", "power": 4500, "use": "critical" },
      ],
      "weight": 2300,
      "link": "https://www.poeleoxalibre.org/les-plans/",
      "comment": "Sans boîte à feu",
    },
    {
      "name": "[Oxa-libre] L",
      "dalyPower": [
        { "fire": 1, "woodLoad": "12.2", "power": 2000, "use": "normal" },
        { "fire": 2, "woodLoad": "12.2", "power": 4000, "use": "critical" },
        { "fire": 3, "woodLoad": "12.2", "power": 6000, "use": "critical" },
      ],
      "weight": 2650,
      "link": "https://www.poeleoxalibre.org/les-plans/",
      "comment": "",
    },
    {
      // https://www.uzume.fr/quelle-puissance-pour-mon-poele-de-masse
      "name": "[Uzume] Mini Batchblock",
      "dalyPower": [ 
        { "fire": 1, "woodLoad": 12, "power": 1600, "use": "normal" },
        { "fire": 2, "woodLoad": 12, "power": 3300, "use": "critical" },
        { "fire": 3, "woodLoad": 12, "power": 4900, "use": "critical" }
      ],
      "weight": 1200,
      "link": "https://www.uzume.fr/plans-poeles-de-masse/Mini-Batchblock",
      "comment": "",
    },
    {
      // https://www.uzume.fr/quelle-puissance-pour-mon-poele-de-masse
      "name": "[Uzume] Cuisinière Batchblock ",
      "dalyPower": [ 
        { "fire": 1, "woodLoad": 12, "power": 1600, "use": "normal" },
        { "fire": 2, "woodLoad": 12, "power": 3300, "use": "critical" },
        { "fire": 3, "woodLoad": 12, "power": 4900, "use": "critical" }
      ],
      "weight": 1200,
      "link": "https://www.uzume.fr/plans-poeles-de-masse/Cuisiniere-Batchblock",
      "comment": "",
    },
    {
      // https://www.uzume.fr/quelle-puissance-pour-mon-poele-de-masse
      "name": "[Uzume] Medi Batchblock",
      "dalyPower": [ 
        { "fire": 1, "woodLoad": 18, "power": 2500, "use": "normal" },
        { "fire": 2, "woodLoad": 18, "power": 5000, "use": "critical" },
        { "fire": 3, "woodLoad": 18, "power": 7500, "use": "critical" }
      ],
      "weight": 1550,
      "link": "https://www.uzume.fr/plans-poeles-de-masse/Medi-Batchblock",
      "comment": "",
    }
  ],
  // https://meta.discourse.org/t/create-a-link-to-start-a-new-topic-with-pre-filled-information/28074
  "help": {
    'url': "https://forum.poeledemasse.org/new-topic",
    'title': "Partage de mon dimensionnement",
    'category' : "general/dimensionnement",
    'body': 'Bonjour, \n Je vous partage ici le résultat de mon [dimensionnement a cette adresse](___URL___ )'  
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
//console.log(settings);
