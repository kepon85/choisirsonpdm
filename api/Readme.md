# API Température de base

https://archive-api.open-meteo.com/v1/archive

## Utilisation

### GET : baseTemperature.php

| Paramètre      | Format  | Requis ? | Exemple | Description                               |
| -------------- | ------- | -------- | ------- | ----------------------------------------- |
| latitude       | Float   | Oui      | 47.22   | Localisation géographique                 |
| longitude      | Float   | Oui      | -1.55   | Localisation géographique                 |
| nbYearsArchive | Float   | Non      | 10      | Nombre d'année d'analyse météo (max 1940) |
| debug          | Booléen | Non      | true    | Pour lire le debug                        |

Exemple : baseTemperature.php?latitude=47.22&longitude=-1.55&nbYearsArchive=10

Cette requête permet de déterminer la température de base sur les 10 dernières années 

## Source des données

* https://open-meteo.com/en/docs/historical-weather-api

## Dépendance du script

* php curl