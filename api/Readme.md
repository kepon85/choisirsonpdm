# API Température de base

La température "de base" est une donnée d'entrée pour la méthode G & ubat

C'est la température des 5 jours consécutif les plus froid de l'année, moyenné sur les X année (X étant souhaité paramétrable)

## Utilisation

### GET : baseTemperature.php

| Paramètre        | Format  | Requis ? | Exemple             | Description                               |
| ---------------- | ------- | -------- | ------------------- | ----------------------------------------- |
| latitude         | Float   | Oui      | 47.22               | Localisation géographique                 |
| longitude        | Float   | Oui      | -1.55               | Localisation géographique                 |
| nbYearsArchive   | Float   | Non      | 10                  | Nombre d'année d'analyse météo entre 1-20 |
| temperature_unit | String  | Non      | celsius\|fahrenheit | (par défaut celsius)                      |
| debug            | Booléen | Non      | true                | Pour lire le debug                        |

Exemple : baseTemperature.php?latitude=47.22&longitude=-1.55&nbYearsArchive=10

Cette requête permet de déterminer la température de base sur les 10 dernières années 

## Source des données

* https://open-meteo.com/en/docs/historical-weather-api

## Dépendance du script

* php curl