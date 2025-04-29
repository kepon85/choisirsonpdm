# API Température de base / DJU

## Condition

Identique à l'API source des infos : https://open-meteo.com/en/docs/historical-weather-api (Usage non commercial)

## API Température de base

La température "de base" est une donnée d'entrée pour la méthode G & ubat

C'est la température des 5 jours consécutif les plus froid de l'année, moyenné sur les X année (X étant souhaité paramétrable)

### GET : baseTemperature.php

| Paramètre        | Format  | Requis ? | Exemple                        | Description                                                  |
| ---------------- | ------- | -------- | ------------------------------ | ------------------------------------------------------------ |
| lat              | Float   | Oui      | 47.22                          | Localisation géographique                                    |
| lng              | Float   | Oui      | -1.55                          | Localisation géographique                                    |
| nbYearsArchive   | Float   | Non      | 20                             | Nombre d'année d'analyse météo entre 1-40                    |
| endYearArchive   | Float   | Non      | 2017                           | Dernière année pour les données météo (par défaut l'année courante-1) |
| nbDays           | Float   | Non      | 5                              | Nombre de jour utilisé pour le calcul de la moyenne (5 par défaut) |
| mode             | String  | Non      | contiguousDay\|uncontiguousDay | Nombre de jour consécutif ou non consécutif (utilisé pour la moyenne) par défaut "contiguousDay" |
| temperature_unit | String  | Non      | celsius\|fahrenheit            | (par défaut celsius)                                         |
| verbose          | Booléen | Non      | true                           | Pour avoir du détail dans les valeurs                        |
| debug            | Booléen | Non      | true                           | Pour lire le debug (change de format de retour de Json à TXT) |

**Exemple** : 

* baseTemperature.php?lat=47.22&lng=-1.55&nbYearsArchive=30&mode=uncontiguousDay&nbDays=5
  * Affiche la moyenne des 5 jours les plus froids non consécutif moyenné sur 30 ans
* baseTemperature.php?lat=47.22&lng=-1.55&nbYearsArchive=20&mode=contiguousDay&nbDays=3&endYearArchive=2017
  * Affiche la moyenne des 3 jours consécutif les plus froids moyenné sur 20 ans (avec pour dernière année 2017)

**Exemple** : baseTemperature.php?lat=47.22&lng=-1.55&nbYearsArchive=3

Cette requête permet de déterminer la température de base sur les 3 dernières années, elle retournes : 

```json
{
	"base": -0.65,             # Température de base demandé, moyenne des x années
    "2019": {                  # année
		"record": {
			"temperatire_min_contiguous": 0.34,       # Temperature de base de l année
			"temperatire_min_contiguous_nb_day": 5,   # Nombre de jour consécutif de recherche du record
			"temperatire_min_contiguous_days": "2019-12-02 2019-12-03 2019-12-04 2019-12-05 2019-12-06"             # Jours contigus au cours desquelles on eut lieu les record
		}
	},
	"2020": {
		"record": {
			"temperatire_min_contiguous": 0.96,
			"temperatire_min_contiguous_nb_day": 5,
			"temperatire_min_contiguous_days": "2020-01-19 2020-01-20 2020-01-21 2020-01-22 2020-01-23"
		}
	},
	"2021": {
		"record": {
			"temperatire_min_contiguous": -2.05,
			"temperatire_min_contiguous_nb_day": 5,
			"temperatire_min_contiguous_days": "2021-02-10 2021-02-11 2021-02-12 2021-02-13 2021-02-14"
		}
	},
	"2022": {
		"record": {
			"temperatire_min_contiguous": -1.86,
			"temperatire_min_contiguous_nb_day": 5,
			"temperatire_min_contiguous_days": "2022-12-09 2022-12-10 2022-12-11 2022-12-12 2022-12-13"
		}
	}
}
```

Démonstration

L'API est accessible :  https://choisir.poeledemasse.org/api/baseTemperature.php

* Exemple de données https://choisir.poeledemasse.org/api/baseTemperature.php?lat=47.22&lng=-1.55&nbYearsArchive=3

## API DJU

Le DJU ou Degré Jour Unifié) est utilisé pour estimer (entre autre) pour estimer la consommation du foyer.

Ici seul la méthode "Météo" (méthode simplifiée) (différentes méthode de calcul : https://dju.cloud-grdf.fr/latest/assets/methode-calcul.pdf)

### GET : dju.php

| Paramètre        | Format  | Requis ? | Exemple             | Description                                                  |
| ---------------- | ------- | -------- | ------------------- | ------------------------------------------------------------ |
| lat              | Float   | Oui      | 47.22               | Localisation géographique                                    |
| lng              | Float   | Oui      | -1.55               | Localisation géographique                                    |
| nbYearsArchive   | Float   | Non      | 20                  | Nombre d'année d'analyse météo entre 1-40                    |
| temperature_unit | String  | Non      | celsius\|fahrenheit | (par défaut celsius)                                         |
| s                | Float   | Non      | 18                  | Température de référence de l'habitat                        |
| verbose          | Booléen | Non      | true                | Pour avoir du détail dans les valeurs                        |
| debug            | Booléen | Non      | true                | Pour lire le debug (change de format de retour de Json à TXT) |

Exemple : dju.php?lat=47.22&lng=-1.55&nbYearsArchive=2

Cette requête permet de déterminer la température de base sur les 3 dernières années, elle retournes : 

```json
{
    "latitude": 47.205624,
    "longitude": 1.6150081,
    "generationtime_ms": 6.821990013122559,
    "utc_offset_seconds": 7200,
    "timezone": "Europe\/Paris",
    "timezone_abbreviation": "CEST",
    "elevation": 111,
    "daily_units": {
        "time": "iso8601",
        "temperature_2m_mean": "\u00b0C"
    },
    "monthly": {
        "2022-01": 445,
        "2022-02": 316,
        "2022-03": 273,
[...]
        "2023-08": 16,
        "2023-09": 17,
        "2023-10": 102,
        "2023-11": 258,
        "2023-12": 326
    },
    "yearly": {
        "2022": 2074,
        "2023": 2068
    },
    "yearly_average": 2071
}
```

Démonstration

L'API est accessible :  https://choisir.poeledemasse.org/api/dju.php

* Exemple de données https://choisir.poeledemasse.org/api/dju.php?lat=47.22&lng=-1.55&nbYearsArchive=2

## Source des données

* https://open-meteo.com/en/docs/historical-weather-api

Zippenfenig, P. (2023). Open-Meteo.com Weather API [Computer software]. Zenodo. https://doi.org/10.5281/ZENODO.7970649

Hersbach, H., Bell, B., Berrisford, P., Biavati, G., Horányi, A., Muñoz Sabater, J., Nicolas, J., Peubey, C., Radu, R., Rozum, I., Schepers, D., Simmons, A., Soci, C., Dee, D., Thépaut, J-N. (2023). ERA5 hourly data on single levels from 1940 to present [Data set]. ECMWF. https://doi.org/10.24381/cds.adbb2d47

Muñoz Sabater, J. (2019). ERA5-Land hourly data from 2001 to present [Data set]. ECMWF. https://doi.org/10.24381/CDS.E2161BAC

Schimanke S., Ridal M., Le Moigne P., Berggren L., Undén P., Randriamampianina R., Andrea U., Bazile E., Bertelsen A., Brousseau P., Dahlgren P., Edvinsson L., El Said A., Glinton M., Hopsch S., Isaksson L., Mladek R., Olsson E., Verrelle A., Wang Z.Q. (2021). CERRA sub-daily regional reanalysis data for Europe on single levels from 1984 to present [Data set]. ECMWF. https://doi.org/10.24381/CDS.622A565A

## Dépendance du script

* php curl