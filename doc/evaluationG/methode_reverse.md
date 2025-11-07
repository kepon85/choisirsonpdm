# Conversion méthode paroi à méthode G

La méthode G applique la relation classique :

> $$\Phi = G \times V \times \Delta T$$
>
> avec \(\Phi\) la puissance de chauffage (W), \(G\) le coefficient global (W·m⁻³·K⁻¹), \(V\) le volume chauffé (m³) et \(\Delta T = T_{\mathrm{int}} - T_{\mathrm{base}}\).

Pour chaque étude paroi-par-paroi (niveau 3), nous avons :

1. Récupéré la puissance calculée \(\Phi_3\).
2. Calculé le volume chauffé \(V\) à partir des dimensions données dans l’énoncé (surface × hauteur ou volume fourni).
3. Déduit le coefficient \(G = \Phi_3 / (V \times \Delta T)\).
4. Sélectionné la valeur de \(G\) disponible dans le sélecteur niveau 1 la plus proche du \(G\) calculé.
5. Estimé la puissance \(\Phi_1\) obtenue avec ce \(G\) retenu pour évaluer l’écart par rapport au calcul détaillé.

| Projet | \(\Phi_3\) (kW) | V (m³) | \(\Delta T\) (°C) | \(G\) calculé (W/m³·K) | \(G\) retenu | \(\Phi_1\) (kW) | \(\Delta \Phi\) (kW) |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Chalet fuste | 3.130 | 151.2 | 25 | 0.828 | 0.80 | 3.024 | -0.106 |
| Maison année 90 | 8.180 | 351.0 | 25 | 0.932 | 0.90 | 7.898 | -0.282 |
| Maison paille avec serre | 3.950 | 510.0 | 25 | 0.310 | 0.30 | 3.825 | -0.125 |
| Rénovation ancienne bergerie | 6.540 | 270.0 | 24 | 1.009 | 1.10 | 7.128 | 0.588 |
| Rénovation ITE | 7.290 | 351.0 | 25 | 0.831 | 0.80 | 7.020 | -0.270 |
| Rénovation ITE isolé au sol | 2.150 | 351.0 | 25 | 0.245 | 0.22 | 1.931 | -0.219 |
| Rénovation ITI avec étage | 4.196 | 300.0 | 24 | 0.583 | 0.50 | 3.600 | -0.596 |
| Rénovation maison de bourg mitoyenneté | 4.050 | 350.0 | 24 | 0.482 | 0.50 | 4.200 | 0.150 |

Les volumes de référence proviennent des fiches d’exercices décrivant surfaces et hauteurs.

- Chalet fuste : 56 m² × 2,70 m.【F:doc/Exercices/Chalet fuste.md†L7-L19】
- Maison année 90 : 130 m² × 2,70 m.【F:doc/Exercices/Maison année 90.md†L7-L19】
- Maison paille avec serre : 170 m² × 3,00 m.【F:doc/Exercices/Maison Paille avec serre.md†L7-L21】
- Rénovation ancienne bergerie : volume 270 m³ (100 m² × 2,70 m).【F:doc/Exercices/Rénovation ancienne bergerie.md†L7-L20】
- Rénovation ITE / ITE isolé : 130 m² × 2,70 m.【F:doc/Exercices/Rénovation ITE.md†L7-L26】【F:doc/Exercices/Rénovation ITE isolé au sol.md†L11-L32】
- Rénovation ITI avec étage : 2 × 60 m² × 2,50 m.【F:doc/Exercices/Rénovation ITI avec étage.md†L7-L34】
- Rénovation maison de bourg : 2 × 70 m² × 2,50 m.【F:doc/Exercices/Rénovation maison de bourg avec mitoyenneté.md†L5-L31】

Les puissances \(\Phi_3\) issues des études niveau 3 sont reprises lorsque disponibles dans les corrections détaillées (ex. Rénovation ITE et ITI).【F:doc/Exercices corrigés/Rénovation ITE.md†L37-L179】【F:doc/Exercices corrigés/Rénovation ITI avec étage.md†L48-L222】
