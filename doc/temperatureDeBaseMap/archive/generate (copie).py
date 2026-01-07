#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json
import pandas as pd
import geopandas as gpd
import matplotlib.pyplot as plt
import matplotlib.colors as mcolors
from shapely.geometry import shape

# 1. Chargement du GeoJSON
with open("departements.geojson", "r", encoding="utf-8") as f:
    geojson = json.load(f)

records = []
for feat in geojson["features"]:
    code = feat["properties"]["code"]
    nom  = feat["properties"].get("nom", "")
    geom = shape(feat["geometry"])
    records.append((code, nom, geom))

gdf = gpd.GeoDataFrame(
    records,
    columns=["code", "nom", "geometry"],
    crs="EPSG:4326"
)

# 2. Tableau des températures (NF P52-612 / D.1a)
temps = {
    "01": -10, "02": -7,  "03": -8,  "04": -8,  "05": -10, "06": -6,
    "07": -6,  "08": -10, "09": -5,  "10": -10, "11": -5,  "12": -8,
    "13": -5,  "14": -7,  "15": -8,  "16": -5,  "17": -5,  "18": -7,
    "19": -8,  "2A": -2,  "2B": -2,  "21": -10, "22": -4,  "23": -8,
    "24": -8,  "25": -12, "26": -6,  "27": -7,  "28": -7,  "29": -4,
    "30": -5,  "31": -5,  "32": -5,  "33": -5,  "34": -5,  "35": -4,
    "36": -7,  "37": -7,  "38": -10, "39": -10, "40": -5,  "41": -7,
    "42": -10, "43": -8,  "44": -5,  "45": -7,  "46": -6,  "47": -5,
    "48": -8,  "49": -7,  "50": -4,  "51": -10, "52": -12, "53": -7,
    "54": -15, "55": -12, "56": -4,  "57": -15, "58": -10, "59": -9,
    "60": -7,  "61": -7,  "62": -9,  "63": -8,  "64": -5,  "65": -5,
    "66": -5,  "67": -15, "68": -15, "69": -10, "70": -10, "71": -10,
    "72": -7,  "73": -10, "74": -10, "75": -5,  "76": -7,  "77": -7,
    "78": -7,  "79": -7,  "80": -9,  "81": -5,  "82": -5,  "83": -5,
    "84": -6,  "85": -5,  "86": -7,  "87": -8,  "88": -15, "89": -10,
    "90": -15, "91": -7,  "92": -7,  "93": -7,  "94": -7,  "95": -7
}

# 3. Fusionner température dans le GeoDataFrame
gdf["température"] = gdf["code"].map(temps)

# 4. Génération de la carte SVG
cmap = plt.get_cmap("coolwarm_r")
vmin, vmax = min(temps.values()), max(temps.values())
norm = mcolors.Normalize(vmin=vmin, vmax=vmax)

fig, ax = plt.subplots(1, 1, figsize=(12, 12))
gdf.plot(column="température",
         cmap=cmap,
         norm=norm,
         linewidth=0.5,
         edgecolor="grey",
         ax=ax,
         legend=True)
ax.set_title("Températures de base NF P52-612 par département", fontsize=16)
ax.axis("off")

fig.savefig("carte_temperature_departements.svg", format="svg", bbox_inches="tight")
print("✅ Carte SVG générée : carte_temperature_departements.svg")

# 5. Affichage du tableau double entrée : température → départements
print("\n🔀 Départements regroupés par température :\n")
# On construit un DataFrame minimal pour l'affichage
df = pd.DataFrame({
    "code":  gdf["code"],
    "nom":   gdf["nom"],
    "temp":  gdf["température"]
})
# On regroupe et on affiche
for temp, grp in df.groupby("temp"):
    liste = (grp["code"] + " " + grp["nom"]).tolist()
    print(f"{temp:>3}°C : " + ", ".join(liste))

