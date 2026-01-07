#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json
import pandas as pd
import geopandas as gpd
import matplotlib.pyplot as plt
import matplotlib.colors as mcolors
import matplotlib.patches as mpatches
from shapely.geometry import shape, LineString, MultiLineString
from shapely.ops import unary_union

# --- 1. Charger le GeoJSON des départements, projeter en Lambert-93 ---
with open("departements.geojson", "r", encoding="utf-8") as f:
    data = json.load(f)

gdf = gpd.GeoDataFrame(
    [{
        "code": feat["properties"]["code"],
        "nom":  feat["properties"].get("nom", ""),
        "geometry": shape(feat["geometry"])
    } for feat in data["features"]],
    crs="EPSG:4326"
).to_crs(epsg=2154)

# --- 2. Températures de site (D.1a) ---
base_temps = {
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
gdf["temp_site"] = gdf["code"].map(base_temps)

# --- 3. Extraire les segments de côte (boundary minus voisins) ---
coast_segments = []
for idx, row in gdf.iterrows():
    # frontière du département
    bnd = row.geometry.boundary
    # voisins terrestres
    voisins = gdf[gdf.geometry.touches(row.geometry)]
    if not voisins.empty:
        voisins_union = voisins.geometry.unary_union
        # retirer segments en contact avec voisins
        coast = bnd.difference(voisins_union)
    else:
        coast = bnd
    # conserver uniquement LineString/MultiLine
    if isinstance(coast, (LineString, MultiLineString)):
        coast_segments.append(coast)
# union de tous les segments de côte
coast_line = unary_union(coast_segments)

# --- 4. Créer la zone littorale 25 km ---
union = unary_union(gdf.geometry)
coast_zone = coast_line.buffer(25_000).intersection(union)

# --- 4.1. Simplification pour réduire le poids du SVG ---
# Tolérance en mètres (ajustez entre quelques dizaines et quelques milliers)
tolerance = 500
# on simplifie chaque polygone (conserve la topologie)
gdf["geometry"] = gdf["geometry"].simplify(tolerance, preserve_topology=True)
# on simplifie aussi la zone littorale
coast_zone = coast_zone.simplify(tolerance, preserve_topology=True)

# --- 5. Finaliser température (sans correction) ---
gdf["temp_finale"] = gdf["temp_site"]

# --- 6. Tracé de la carte ---
fig, ax = plt.subplots(1,1,figsize=(12,12))
fig.patch.set_alpha(0)
ax.set_facecolor('none')

# carte départements
cmap = plt.get_cmap("coolwarm")
norm = mcolors.Normalize(vmin=min(base_temps.values()), vmax=max(base_temps.values()))
gdf.plot(
    column="temp_finale", cmap=cmap, norm=norm,
    linewidth=0.2, edgecolor="black", ax=ax, legend=False
)
# zone littorale
gpd.GeoDataFrame(geometry=[coast_zone], crs=gdf.crs).plot(
    ax=ax, facecolor='none', edgecolor='#2ca02c', linewidth=1.5
)

# --- 7. Légende carrés couleur en bas-gauche ---
temps_vals = sorted(set(base_temps.values()))
patches = [mpatches.Patch(color=cmap(norm(t)), label=f"{t}°C") for t in temps_vals]
ax.legend(handles=patches, title="Température", loc='lower left', frameon=False)

ax.axis('off')
fig.savefig("carte_temperature_cote_seule.svg", format="svg",
            transparent=True, bbox_inches="tight", pad_inches=0)
print("✅ carte_temperature_cote_seule.svg générée.")

# --- 8. Affichage console ---
df = pd.DataFrame({ 'code': gdf.code, 'nom': gdf.nom, 'temp': gdf.temp_finale })
print("\n🔀 Départements regroupés par température :\n")
for t, grp in df.groupby('temp'):
    print(f"{t:>3}°C : " + ", ".join(grp['code'] + ' ' + grp['nom']))
