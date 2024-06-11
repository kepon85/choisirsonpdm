const userSettings = {
  "debug": true,
  "debugLoadMap": false,
  "form_default": {
    "level":     2,
    "temp_indor":                 20, 
    "livingvolume_auto": false,
  },
  "pdmData": [
    {
      "name": "[Oxa-libre] 2kW",
      "dalyPower": [
        { "fire": 1, "woodLoad": "6.4", "power": 1000, "use": "normal" },
        { "fire": 2, "woodLoad": "6.4", "power": 2000, "use": "critical" },
      ],
      "weight": 2000,
      "link": "https://www.oxalis-asso.org/?page_id=3202",
      "comment": "",
    },
    {
      "name": "[Oxa-libre] 3kW",
      "dalyPower": [
        { "fire": 1, "woodLoad": "8.35", "power": 1500, "use": "normal" },
        { "fire": 2, "woodLoad": "8.35", "power": 3000, "use": "critical" },
      ],
      "weight": 2300,
      "link": "https://www.oxalis-asso.org/?page_id=3202",
      "comment": "Sans boîte à feu",
    },
    {
      "name": "[Oxa-libre] 4kW",
      "dalyPower": [
        { "fire": 1, "woodLoad": "12.2", "power": 2000, "use": "normal" },
        { "fire": 2, "woodLoad": "12.2", "power": 4000, "use": "critical" },
      ],
      "weight": 2650,
      "link": "https://www.oxalis-asso.org/?page_id=3202",
      "comment": "",
    },
  ],
}
