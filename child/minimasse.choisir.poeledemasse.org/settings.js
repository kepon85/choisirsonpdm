const userSettings = {
  "help": {
    'url': "https://forum.poeledemasse.org/new-topic",
    'title': "Partage de mon dimensionnement",
    'category' : "agir-lowtech",
    'body': 'Bonjour, \n Je vous partage ici le résultat de mon [dimensionnement a cette adresse](___URL___ )'
  },
  "form_default": {
    "level":     2,
    "ubat_global":                 0.4,
    "venti_global":                0.14,
    "g":                           0.3,
    "temp_base_nb_years_archive":  20,
    "temp_base_end_years_archive": '',
    "temp_base_nb_days":           5,
    "temp_base_mode":             'contiguousDay',
    "livingvolume_auto" :           false,
    "livingvolume":                 92,
    "livingspace":                  40,
    "livingheight":               2.3,
    "wastagesurface":             120,
    "temp_indor":                 18, 
    "temp_base_auto":             true,
  },
  "pdmData": [
    {
      // https://wiki.lowtech.fr/s/Poele_de_Masse.Petit_Habitat:Doc:Pr%C3%A9sentation
      "name": "[Agir Low-Tech] MiniMasse",
      "dalyPower": [ 
        { "fire": 1, "woodLoad": 2.5, "power": 325 },
        /*{ "fire": 2, "woodLoad": 2.5, "power": 650 },
        { "fire": 3, "woodLoad": 2.5, "power": 975 },*/
        { "fire": 1, "woodLoad": 5, "power": 650 },
        { "fire": 2, "woodLoad": 5, "power": 1300 },
        { "fire": 3, "woodLoad": 5, "power": 1950 },
      ],
      "weight": 450,
      "link": "https://agir.lowtech.fr/minimasse/",
      "comment": "",
    }
  ],
}
