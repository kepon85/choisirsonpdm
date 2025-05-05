# Étude comparative méthode calcul de la température de base

## Contexte

La "température de base" est la température extérieur qu'on prend comme référence dans la norme française pour dimensionner un besoin de chauffage. Jusqu'ici je n'ai jamais réussi à connaître la méthodologie de calcul de celle-ci malgré mes recherches auprès des institutions ([publié en grande partie ici](https://forum.poeledemasse.org/t/methode-de-calcul-de-la-temperature-de-base/2819/5)). 

Le point de départ de cette petite étude : je ne parvient pas à connaître la méthode de calcul, la norme [NF P52-612/CN](https://www.boutique.afnor.org/fr-fr/norme/nf-p52612-cn/systemes-de-chauffage-dans-les-batiments-methode-de-calcul-des-deperditions/fa165533/36563)  de cite que des données qui apparaissent parfois lointaine. Ne sâchant plus trop vers qui me trouver pour connaître la source de ces données j'ai tenté d'une analyse inversé : reproduire différentes méthodes pouvoir quel méthode s'approche le plus de la norme. 

Ayant constitué un jeu de donnée j'ai ensuite creuser dans d'autres directions.

Je me suis appuyé sur le logiciel que j'ai développé pour les poêles de masses ([choisirsonpdm](https://choisir.poeledemasse.org/)) Pour cette étude il a fallu ajouté de nouvelle fonctionnalité à l'API de température de base (démo : https://framagit.org/kepon/choisirsonpdm/-/blob/main/doc/demo-temperatureBasePlus.mp4) Une version "seule" est disponible ici pour vérifier les données présentes ici : https://temperature-de-base.zici.fr/

Plus loin, quand il est mentionné "norme NF" on fait référence à la [NF P52-612/CN](https://www.boutique.afnor.org/fr-fr/norme/nf-p52612-cn/systemes-de-chauffage-dans-les-batiments-methode-de-calcul-des-deperditions/fa165533/36563) 

Nous ne parlerons ici que du territoire Français.

## Préambule

Quel impact, la variation d'1°C de température de base à sur le calcul du besoin de chauffage :

* Logiciel utilisé : https://etude.poeledemasse.org
* Méthode Ubat
* Variation surface de déperdition + Ubat sinon température de consigne et autre constant...

| Surface | Ubat (W/m²·K) | Besoin à 0 °C (kW) | Besoin à 1 °C (kW) | Écart kW | Variation % |
| ------- | ------------- | ------------------ | ------------------ | -------- | ----------- |
| 40 m²   | 0.15          | 0.779              | 0.738              | 0.041    | **5.26 %**  |
| 40 m²   | 1.8           | 5.17               | 4.90               | 0.27     | **5.22 %**  |
| 200 m²  | 0.15          | 3.44               | 3.26               | 0.18     | **5.23 %**  |
| 200 m²  | 1.8           | 20.40              | 19.33              | 1.07     | **5.25 %**  |

La variation d'1°C de température de base fait varier de **~5,2% le besoin de chauffage.**

## Données

### Météo

Les données météos sont extraites du site open-meteo publie l'historique de donnée météo issus des données Copernicus  https://open-meteo.com/en/docs/historical-weather-api elle le sont pas l'API créé ici : https://framagit.org/kepon/choisirsonpdm/-/tree/main/api pour les besoin du logiciel https://choisir.poeledemasse.org/

### Villes

On prends 2 villes par zone de la carte de la  NF P52-612/CN : https://choisir.poeledemasse.org/assets/img/carte-temperature-de-base.png

* **Zone A (Rouge)** : Nice (43.7034 / 7.2663 - Altitude ≈ 10 m) ; Ajaccio (41.9222 / 8.7389 - Altitude ≈ 20 m)
* **Zone B (Magenta)** : Brest (48.3903 / ‑4.4861 - Altitude ≈ 34 m) ; Saint‑Brieuc (48.5127 / ‑2.7652 - Altitude ≈ 100 m)
* **Zone C (Jaune)** : Lille (50.6292 / 3.0573 - Altitude ≈ 21 m) ; Amiens (49.8941 / 2.2959 - Altitude ≈ 61 m)
* **Zone D (Gris)** : Paris (48.8566 / 2.3522 - Altitude ≈ 35 m) ; Reims (49.2583 / 4.0321 - Altitude ≈ 80 m)
* **Zone E (Vert foncé)** : Limoges (45.8342 / 1.2627 - Altitude ≈ 200 m) ; Clermont‑Ferrand (45.7772 / 3.0870 - Altitude ≈ 358 m)
* **Zone F (Orange)** : Poitiers (46.5801 / 0.3405 - Altitude ≈ 100 m) ; Bordeaux (44.8378 / ‑0.5792 - Altitude ≈ 6 m)
* **Zone G (Bleu)** : Troyes (48.2974 / 4.0720 - Altitude ≈ 110 m) ; Orléans (47.9029 / 1.9092 - Altitude ≈ 112 m)
* **Zone H (Vert clair)** : Strasbourg (48.5734 / 7.7521 - Altitude ≈ 142 m) ; Nancy (48.6921 / 6.1844 - Altitude ≈ 220 m)
* **Zone I (Cyan)** : Besançon (47.2378 / 6.0244 - Altitude ≈ 240 m) ; Mulhouse (47.7508 / 7.3359 - Altitude ≈ 240 m)

### Récupération des données

Avec l'aide d'un script python ([baseTemperatureComparatif.py](./baseTemperatureComparatif.py)) on va explorer différentes variables qui on été envisagé dans mes différents échanges : 

* Les 3 ou 5 jours les plus froids de l'année
* Le fait que ces jours soient contigus ou non
* Des données sur 20 ou 30 ans 
* Que la date de fin soit en 2010 (date de publication de la norme) ou l'année courante (2025). 
  * Ceci afin de mesurer quel est l'impact d'un dimensionnement de chauffage avec des données anciennes

Qui génère le tableau de valeur : [baseTemperatureComparatif.csv](./baseTemperatureComparatif.csv)

Un tableur xlsx à ensuite été généré avec d'une colonne "norme NF" :  [baseTemperatureComparatif.xlsx](./baseTemperatureComparatif.xlsx)

![](baseTemperatureComparatif.assets/95954e48-f2f0-4bf6-ae57-01c7371b60a0.png)

Chaque point coloré correspond à l’une des recettes, la ligne épaisse représente la valeur NF par ville, et la bande beige indique la plage min–max de toutes les méthodes autour de la NF.

## Analyses

### Comparaison et rétro-ingénierie de la « température de base NF »

Nous allons tenté de retrouver la méthode utilisé (que personne ne semble connaître) par la norme NF. Pour ça nous allons comparer les résultats, les données avec la températures de base de ces villes données par la normes

Ne seront utilisé ici que les données ayant pour date de fin 2010 (comme la norme NF)

| Rang  | Recette candidate                  | MAE (°C) | RMSE (°C) | Corr     |
| ----- | ---------------------------------- | -------- | --------- | -------- |
| **1** | **20 ans – 3 jours, non contigus** | **2.54** | **3.19**  | **0.87** |
| 2     | 30 ans – 3 jours, non contigus     | 2.55     | 3.21      | 0.87     |
| 3     | 30 ans – 3 jours, contigus         | 2.56     | 3.25      | 0.86     |
| 4     | 20 ans – 3 jours, contigus         | 2.61     | 3.28      | 0.87     |
| 5     | 30 ans – 5 jours, non contigus     | 2.58     | 3.29      | 0.86     |
| 6     | 20 ans – 5 jours, non contigus     | 2.66     | 3.37      | 0.86     |
| 7     | 30 ans – 5 jours, contigus         | 2.87     | 3.58      | 0.86     |
| 8     | 20 ans – 5 jours, contigus         | 2.99     | 3.71      | 0.86     |

**Indicateurs**
 • **MAE** (*Mean Absolute Error*) : écart moyen absolu avec la NF.
 • **RMSE** (*Root Mean Square Error*) : idem, mais pénalise davantage les grosses erreurs.
 • **Corr** : corrélation de Pearson (1 = profil identique).

#### Lecture & rétro‑ingénierie

- Les quatre premières recettes tiennent dans un mouchoir de poche  (Δ RMSE < 0,1 °C). Éléments discriminants :
  - Contigu vs non‑contigu : les versions contiguës sont ≈ 0,5 °C plus chaudes que leurs homologues non contigus.
     → or la NF est un peu plus froide : on privilégie donc non‑contigu.
  - Fenêtre 20 ans vs 30 ans : ne change quasi rien (MAE 2,54 ↔ 2,55).
     → difficile de trancher avec ce seul critère.

- Indice réglementaire : les textes  ici et là citent couramment « température extérieure de base issue des 30 dernières années ».
   - 30 ans – 3 jours – non contigus reste la candidate « classique ».
   

#### NF V.S. meilleur méthode 

En considérant que la méthode qui se rapproche le plus de la NF c'est "20 ans – 3 jours, non contigus" voici l'écart par ville : 

![](baseTemperatureComparatif.assets/NF_vs_meilleurMethodeCandidate.png)

On constat des écart très inconstants entre ~0 et ~6°C. Ceci s'explique probablement par le faible détail de la norme NF qui considère une température par département alors que la méthode par API permet d'être plus précis.

#### Conclusion — Hypothèse NF

> [!IMPORTANT]
>
> Au vu des faibles écarts il me semble difficile de privilégier une méthode à une autre au vu de la moyenne des écarts (MAE) qui se situe entre 2.54 et 2.99°C. 

Des hypothèses :

* Aucune méthode testé n'est bonne
* Les données météos sont différentes (non issus du projet Copernicus)
* Les dates de fin du jeux de donnée est bien plus ancienne que 2010

> [!IMPORTANT]
>
> **Conséquence pratique**
> Garder la température de base NF 2010 revient à supposer un hiver plus froid qu’il ne l’est aujourd’hui : on **sur‑dimensionne la puissance de chauffage d’environ 12 – 15 %** selon la région et la recette utilisée.

### Impact de la non mise à jour de la norme depuis 2010

Ici c'est un exercice, nous ne considérons plus les températures de la norme NF mais la différence entre les températures du jeux de donnée se terminant en 2010 et 2025. Ce qui revient à considérer quel réchauffement climatique en comparant des période allant jusqu'à 2010 ou 2025 et en retournant -20 ou -30 ans en arrière.

Nous comparerons les données avec la date de fin à 2010 et celle avec la date de fin en 2025 pour voir quel impact sur la température de base nous avons du fait que la norme NF n'a pas été mise à jour depuis 2010.

| **Recette**               | **Δ moyen (°C)** | **MAE (°C)** | **Min** | **Max** |
| ------------------------- | ---------------- | ------------ | ------- | ------- |
| 30 ans – 3 j non contigus | **+1.01**        | 1.01         | +0.21   | +1.90   |
| 30 ans – 3 j contigus     | +0.96            | 0.96         | +0.22   | +1.65   |
| 30 ans – 5 j non contigus | +0.92            | 0.92         | +0.17   | +1.74   |
| 20 ans – 3 j contigus     | +0.87            | 0.89         | +0.16   | +1.49   |
| 30 ans – 5 j contigus     | +0.86            | 0.86         | +0.27   | +1.49   |
| 20 ans – 3 j non contigus | +0.86            | 0.88         | −0.24   | +1.64   |
| 20 ans – 5 j contigus     | +0.77            | 0.78         | −0.03   | +1.28   |
| 20 ans – 5 j non contigus | +0.77            | 0.79         | −0.25   | +1.52   |

> [!NOTE]
>
> Tableau par rapport à la température NF

**La Δ moyen (°C) global est autour de +0.8°C.** Avec des variation entre -0.03 et +1.9°C  

#### Lecture rapide & hypothèse

- Réchauffement moyen : ≈ +0.8 °C entre 2010 et 2025, quelle que soit la recette.
  - Pic à +1 °C pour *30 ans – 3 j non contigus*.
  - Valeur la plus faible +0.77 °C pour *20 ans – 5 j* (contigu ou non contigu).
- Dispersion géographique : le gain varie de –0.25 °C (quelques stations côtières) à +1.9 °C (vallée du Rhône / Est).

#### Conclusion / conséquence

Sur les 12-15% de sur-dimensionnement de puissance de chauffage imputable au jeux de donnée de la norme (qui est à ce jour inconnu donc pour moi considéré comme non sûr)  5 à 10% de ce sur-dimensionnement est imputable à la non mise à jour (depuis 2010) de la norme. 

### Impact de la recette "jours contigus" vs "jour non contigus"

Autant dans les approches sur le nombre d'année de jeux de données on pouvait discuter mais le fait de considérer les X jours les plus froids de l'année continue ou non continues il y avait souvent des avis tranché. 

| Fenêtre (hist., jours) | Δ moyen (contig − non) | MAE  | Min   | Max   |
| ---------------------- | ---------------------- | ---- | ----- | ----- |
| 30 ans – 3 jours       | **+0.52 °C**           | 0.52 | +0.29 | +0.75 |
| 30 ans – 5 jours       | **+0.84 °C**           | 0.84 | +0.65 | +1.27 |
| 20 ans – 3 jours       | **+0.55 °C**           | 0.55 | +0.32 | +0.84 |
| 20 ans – 5 jours       | **+0.88 °C**           | 0.88 | +0.59 | +1.47 |

**Δ moyen (contig − non) global : +0.69°C** (données 2025 uniquement, colonne `endYearArchive=None`)

#### **Lecture rapide**

- Passer à des jours contigus élève la température de base :
  - +0.5 °C pour les fenêtres 3 jours,
  - +0.8 à +0.9 °C pour les fenêtres 5 jours.
- L’écart est toujours positif (contigu plus chaud) et atteint jusqu’à +1.5 °C pour certaines villes.

#### Conclusion

C'était attendu, la température moyennes des records non contigus est plus élevés mais c'est vérifié.  La moyenne de ~+0.7

## Auteur

David Mercereau

## Licence

Beerware : https://fr.wikipedia.org/wiki/Beerware





* [ ] publier
* [ ] discuter forum
* [ ] brève de poêlier
