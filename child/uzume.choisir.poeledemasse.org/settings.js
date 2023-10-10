const userSettings = {
  "debug": true,
  "debugLoadMap": false,
  "form_default": {
    "level":     1,
    "g":                           0.3,
    "temp_base_years_archive":     10,
    "temp_indor":                 19, 
    "temp_base_auto":             true,
  },
  "pdmData": [
    {
      // https://www.uzume.fr/quelle-puissance-pour-mon-poele-de-masse
      "name": "[Uzume] Mini Batchblock",
      "dalyPower": [ 
        { "fire": 1, "woodLoad": 12, "power": 1600, "use": "normal" },
        { "fire": 2, "woodLoad": 12, "power": 3300, "use": "normal" },
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
        { "fire": 2, "woodLoad": 12, "power": 3300, "use": "normal" },
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
        { "fire": 2, "woodLoad": 18, "power": 5000, "use": "normal" },
        { "fire": 3, "woodLoad": 18, "power": 7500, "use": "critical" }
      ],
      "weight": 1550,
      "link": "https://www.uzume.fr/plans-poeles-de-masse/Medi-Batchblock",
      "comment": "",
    },
    {
      // https://www.uzume.fr/quelle-puissance-pour-mon-poele-de-masse
      "name": "[Uzume] Maxi Batchblock avec banc",
      "dalyPower": [ 
        { "fire": 1, "woodLoad": 28, "power": 3900, "use": "normal" },
        { "fire": 2, "woodLoad": 28, "power": 7700, "use": "normal" },
        { "fire": 3, "woodLoad": 28, "power": 11600, "use": "critical" }
      ],
      "weight": 2000,
      "link": "https://www.uzume.fr/plans-poeles-de-masse/Maxi-Batchblock",
      "comment": "",
    }
  ]
}
