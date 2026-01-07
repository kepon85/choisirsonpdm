#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json
import pandas as pd
import geopandas as gpd
import matplotlib.pyplot as plt
import matplotlib.colors as mcolors
from shapely.geometry import shape, LineString, MultiLineString
from shapely.ops import unary_union
from descartes import PolygonPatch

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

# Supprimer les géométries invalides/vides
gdf = gdf[~gdf.geometry.is_empty & gdf.geometry.is_valid]

# --- 2. Températures de site ---
base_temps = {
    "01": -10, "02": -7,  "03": -8, "04": -8, "05": -10, "06": -6,
    # ... (garde tes valeurs complètes ici)
}
gdf["temp_site"] = gdf["code"].map(base_temps)

# --- 3. Extraction côtière ---
coast_segments = []
for idx, row in gdf.iterrows():
    bnd = row.geometry.boundary
    voisins = gdf[gdf.geometry.touches(row.geometry)]
    if not voisins.empty:
        coast = bnd.difference(voisins.geometry.unary_union)
    else:
        coast = bnd
    if isinstance(coast, (LineString, MultiLineString)):
        coast_segments.append(coast)

coast_line = unary_union(coast_segments)

# --- 4. Créer la zone littorale 25 km ---
union = unary_union(gdf.geometry)
coast_zone = coast_line.buffer(25_000).intersection(union)

# --- 4.1. Simplification ---
tolerance = 500
gdf["geometry"] = gdf["geometry"].simplify(tolerance, preserve_topology=True)
coast_zone = coast_zone.simplify(tolerance, preserve_topology=True)

# --- 5. Finaliser température ---
gdf["temp_finale"] = gdf["temp_site"]

# --- 6. Tracé interactif ---
# --- 6. Tracé interactif simplifié via GeoPandas ---
fig, ax = plt.subplots(figsize=(12,12))
fig.patch.set_alpha(0)
ax.set_facecolor('none')

cmap = plt.get_cmap("coolwarm")
norm = mcolors.Normalize(vmin=min(base_temps.values()), vmax=max(base_temps.values()))

# Utilisation directe de GeoPandas pour la robustesse
gdf.plot(
    column="temp_finale",
    cmap=cmap,
    norm=norm,
    linewidth=0.2,
    edgecolor="black",
    ax=ax,
    legend=False
)

# Tracer la zone littorale (si nécessaire)
gpd.GeoDataFrame(geometry=[coast_zone], crs=gdf.crs).plot(
    ax=ax, facecolor='none', edgecolor='#2ca02c', linewidth=1.5
)

ax.axis('off')
fig.savefig("carte_temperature_interactive.svg", format="svg",
            transparent=True, bbox_inches="tight", pad_inches=0)
print("✅ SVG interactif généré : carte_temperature_interactive.svg")
