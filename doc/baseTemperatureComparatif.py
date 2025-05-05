import requests
import json
import csv
import time

# Configuration de l'API
api_url = "https://choisir.poeledemasse.org/api/baseTemperature.php"

# Liste des villes avec leurs coordonnées
villes = {
    "Nice": {"latitude": 43.7034, "longitude": 7.2663},
    "Ajaccio": {"latitude": 41.9222, "longitude": 8.7389},
    "Brest": {"latitude": 48.3903, "longitude": -4.4861},
    "Saint-Brieuc": {"latitude": 48.5127, "longitude": -2.7652},
    "Lille": {"latitude": 50.6292, "longitude": 3.0573},
    "Amiens": {"latitude": 49.8941, "longitude": 2.2959},
    "Paris": {"latitude": 48.8566, "longitude": 2.3522},
    "Reims": {"latitude": 49.2583, "longitude": 4.0321},
    "Limoges": {"latitude": 45.8342, "longitude": 1.2627},
    "Clermont-Ferrand": {"latitude": 45.7772, "longitude": 3.0870},
    "Poitiers": {"latitude": 46.5801, "longitude": 0.3405},
    "Bordeaux": {"latitude": 44.8378, "longitude": -0.5792},
    "Troyes": {"latitude": 48.2974, "longitude": 4.0720},
    "Orléans": {"latitude": 47.9029, "longitude": 1.9092},
    "Strasbourg": {"latitude": 48.5734, "longitude": 7.7521},
    "Nancy": {"latitude": 48.6921, "longitude": 6.1844},
    "Besançon": {"latitude": 47.2378, "longitude": 6.0244},
    "Mulhouse": {"latitude": 47.7508, "longitude": 7.3359},
}

# Paramètres à tester
parametres = [
    {"nbYearsArchive": 30, "nbDays": 3, "mode": "contiguousDay", "endYearArchive": None},
    {"nbYearsArchive": 30, "nbDays": 3, "mode": "uncontiguousDay", "endYearArchive": None},
    {"nbYearsArchive": 30, "nbDays": 5, "mode": "contiguousDay", "endYearArchive": None},
    {"nbYearsArchive": 30, "nbDays": 5, "mode": "uncontiguousDay", "endYearArchive": None},
    {"nbYearsArchive": 20, "nbDays": 3, "mode": "contiguousDay", "endYearArchive": None},
    {"nbYearsArchive": 20, "nbDays": 3, "mode": "uncontiguousDay", "endYearArchive": None},
    {"nbYearsArchive": 20, "nbDays": 5, "mode": "contiguousDay", "endYearArchive": None},
    {"nbYearsArchive": 20, "nbDays": 5, "mode": "uncontiguousDay", "endYearArchive": None},
    {"nbYearsArchive": 30, "nbDays": 3, "mode": "contiguousDay", "endYearArchive": 2010},
    {"nbYearsArchive": 30, "nbDays": 3, "mode": "uncontiguousDay", "endYearArchive": 2010},
    {"nbYearsArchive": 30, "nbDays": 5, "mode": "contiguousDay", "endYearArchive": 2010},
    {"nbYearsArchive": 30, "nbDays": 5, "mode": "uncontiguousDay", "endYearArchive": 2010},
    {"nbYearsArchive": 20, "nbDays": 3, "mode": "contiguousDay", "endYearArchive": 2010},
    {"nbYearsArchive": 20, "nbDays": 3, "mode": "uncontiguousDay", "endYearArchive": 2010},
    {"nbYearsArchive": 20, "nbDays": 5, "mode": "contiguousDay", "endYearArchive": 2010},
    {"nbYearsArchive": 20, "nbDays": 5, "mode": "uncontiguousDay", "endYearArchive": 2010},
]

# Nom du fichier CSV
csv_file = "baseTemperatureComparatif.csv"

# En-tête du fichier CSV
header = ["Ville", "Latitude", "Longitude"]
for p in parametres:
    header.append(f"Base ({p['nbYearsArchive']} ans, {p['nbDays']} jours, {p['mode']}, endYearArchive={p['endYearArchive']})")

# Écriture des données dans le fichier CSV
with open(csv_file, mode="w", newline="") as file:
    writer = csv.writer(file)
    writer.writerow(header)

    for ville, coords in villes.items():
        row = [ville, coords["latitude"], coords["longitude"]]
        for p in parametres:
            params = {
                "lat": coords["latitude"],
                "lng": coords["longitude"],
                "nbYearsArchive": p["nbYearsArchive"],
                "nbDays": p["nbDays"],
                "mode": p["mode"]
            }
            if p["endYearArchive"]:
                params["endYearArchive"] = p["endYearArchive"]

            try:
                response = requests.get(api_url, params=params)
                response.raise_for_status()  # Lève une exception pour les erreurs HTTP
                data = response.json()
                base_temperature = data.get("base", "N/A")  # "N/A" si la clé "base" est absente
            except requests.exceptions.RequestException as e:
                base_temperature = f"Erreur de requête: {e}"
            except json.JSONDecodeError:
                base_temperature = "Erreur de décodage JSON"

            time.sleep(1)
            
            row.append(base_temperature)
        writer.writerow(row)

print(f"Les données ont été écrites dans le fichier {csv_file}")

