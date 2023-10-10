# API Température de base

La température "de base" est une donnée d'entrée pour la méthode G & ubat

C'est la température des 5 jours consécutif les plus froid de l'année, moyenné sur les X année (X étant souhaité paramétrable)

## Utilisation

### Condition

Identique à l'API source : https://open-meteo.com/en/docs/historical-weather-api (Usage non commercial)

### GET : baseTemperature.php

| Paramètre        | Format  | Requis ? | Exemple             | Description                                                  |
| ---------------- | ------- | -------- | ------------------- | ------------------------------------------------------------ |
| lat              | Float   | Oui      | 47.22               | Localisation géographique                                    |
| lng              | Float   | Oui      | -1.55               | Localisation géographique                                    |
| nbYearsArchive   | Float   | Non      | 10                  | Nombre d'année d'analyse météo entre 1-20                    |
| temperature_unit | String  | Non      | celsius\|fahrenheit | (par défaut celsius)                                         |
| verbose          | Booléen | Non      | true                | Pour avoir du détail dans les valeurs                        |
| debug            | Booléen | Non      | true                | Pour lire le debug (change de format de retour de Json à TXT) |

Exemple : baseTemperature.php?lat=47.22&lng=-1.55&nbYearsArchive=3

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

## Démonstration

L'API est accessible :  https://choisir.poeledemasse.org/api/baseTemperature.php

* Exemple de données https://choisir.poeledemasse.org/api/baseTemperature.php?lat=47.22&lng=-1.55&nbYearsArchive=3

## Source des données

* https://open-meteo.com/en/docs/historical-weather-api

Zippenfenig, P. (2023). Open-Meteo.com Weather API [Computer software]. Zenodo. https://doi.org/10.5281/ZENODO.7970649

Hersbach, H., Bell, B., Berrisford, P., Biavati, G., Horányi, A., Muñoz Sabater, J., Nicolas, J., Peubey, C., Radu, R., Rozum, I., Schepers, D., Simmons, A., Soci, C., Dee, D., Thépaut, J-N. (2023). ERA5 hourly data on single levels from 1940 to present [Data set]. ECMWF. https://doi.org/10.24381/cds.adbb2d47

Muñoz Sabater, J. (2019). ERA5-Land hourly data from 2001 to present [Data set]. ECMWF. https://doi.org/10.24381/CDS.E2161BAC

Schimanke S., Ridal M., Le Moigne P., Berggren L., Undén P., Randriamampianina R., Andrea U., Bazile E., Bertelsen A., Brousseau P., Dahlgren P., Edvinsson L., El Said A., Glinton M., Hopsch S., Isaksson L., Mladek R., Olsson E., Verrelle A., Wang Z.Q. (2021). CERRA sub-daily regional reanalysis data for Europe on single levels from 1984 to present [Data set]. ECMWF. https://doi.org/10.24381/CDS.622A565A

## Dépendance du script

* php curl