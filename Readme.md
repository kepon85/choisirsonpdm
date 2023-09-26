# Choisir son poêle de masse

Vous aide à considérer votre besoin de chauffage et vous suggère le "bon poêle de masse" open source en conséquences.

En ligne : https://choisir.poeledemasse.org/

* Les  "enfants" :
  * https://minimasse.choisir.poeledemasse.org/ qui suggère si le MiniMasse est pertinent pour vous ou non
  * https://afpma.choisir.poeledemasse.org/ qui orient vers un artisan poêlier proche de chez soit

Ce petit calculateur développe 2 étape : 

* Estime le besoin de chauffage de votre habitat
* Détermine un poêle de masse adéquate pour votre besoin

## Besoin de chauffage

Permet une évaluation des besoins de chauffage : 

- 2 « niveaux » :
  - « Débutant » utilise la méthode G
  - « Éclairé » utilise la méthode Ubat général
- Plus de carte de la France par zone : La température « de base » est recherchée dans l’historique météorologique (par API) en fonction de sa localisation géographique. On peut choisir sur  combien d’année on va chercher l’historique : 5, 10, 15, 20 ans (par  défaut 10 ans parce que le climat change…)
  - La température ‹ de base › c’est la température des 5 jours  consécutifs les plus froids de l’année, moyenné sur les X dernières  années.
- Transparence sur le calcul qui est fait pour Ubat/G, aussi pour la suggestion des PDM’s

## Suggestion

[2 paramètres](https://framagit.org/kepon/choisirsonpdm/-/blob/main/assets/js/default-settings.js?search=debug#L33) se trouve :

* *percentPowerSuper* : pourcentage de correspondance auquel on considère que le poêle propose correspond bien (actuellement : 10%)
* *percentPowerCool* : pourcentage de correspondance auquel on considère que le poêle propose correspond pas trop mal... (actuellement : 24%)

La suggestion pour le "bon poêle de masse" se déroule comme suite : 

* Nous disposons du besoin de chauffage (déperdition du bâtiment) noté "D". 
* On prend chaque poêle 1 par 1 avec ces caractéristiques : https://choisir.poeledemasse.org/#opendata dans son cas d'usage "critique" (car D est calculé avec la température critique), ensuite on détermine : 
    * *diffPowerDeperdition* : la différence de puissance du poêle de masse avec D (puissance - D)
    * *diffPowerDeperditionPercent* = 100**diffPowerDeperdition*/D (le pourcentage de différence entre la puissance et D)
    * *diffPowerDeperditionAbs* : *diffPowerDeperdition* en absolu 
    * *diffPowerDeperditionPercentAbs* : *diffPowerDeperditionPercent* en absolu
    * *bestClass* défini le niveau de corrélation avec les déperditions D ; 
        * 2 si *diffPowerDeperditionPercentAbs* < *percentPowerSuper*
        * 1 si *diffPowerDeperditionPercentAbs* < *percentPowerCool*
        * 0 sinon...
    

* Ensuite on explique les choix
  * S'il n'y a aucun poêle en *bestClass* à 2 : Aucune correspondance parfaite
    * On cherche les bestClass à 1 et on liste les poêle imparfait mais qui se rapproche quand même...
  * S'il y a 1 poêle en *bestClass* à 12: On dit que le poêle qui correspond le mieux est ....
  * S'il y a plus de 1 poêle en bestClass à 2 : on dit qu'on a trouvé plusieurs qui pourraient correspondre

A chaque citation de suggestion on indique s'il est sur ou sous dimensionné et de combien.

### Dev suggestion

Quelques exemples qui permettent différentes suggestion pour tester l'algo :

Exemple n'aboutissant à aucune "super suggestion", que des "cool" : http://127.0.0.1:3000/index.html#level=1&transparent=true&livingspace=50&livingheight=2.5&livingvolume=125&livingvolume_auto=true&wastagesurface=120&temp_indor=19&g=1.8&ubat_global=0.4&venti_global=0.14&lat=&lng=&temp_base=11.6&temp_base_auto=&temp_base_years_archive=10&submit_input=1
Exemple à plusieurs "super" suggestion : http://127.0.0.1:3000/index.html#level=1&transparent=true&livingspace=149.7&livingheight=2.5&livingvolume=374.25&livingvolume_auto=true&wastagesurface=120&temp_indor=19&g=1.8&ubat_global=0.4&venti_global=0.14&lat=&lng=&temp_base=11.6&temp_base_auto=&temp_base_years_archive=10&submit_input=1
2 cool mais rien de super : http://127.0.0.1:3000/index.html#level=1&transparent=true&livingspace=149.7&livingheight=2.5&livingvolume=374.25&livingvolume_auto=true&wastagesurface=120&temp_indor=26&g=1.8&ubat_global=0.4&venti_global=0.14&lat=&lng=&temp_base=11.6&temp_base_auto=&temp_base_years_archive=10&submit_input=1

## Changelog

* v1.0
  * 2 « niveaux » :
    - « Débutant » utilise la méthode G
    - « Éclairé » utilise la méthode Ubat général
  * API pour la température de base
  * Transparence sur le calcul qui est fait pour Ubat/G, aussi pour la suggestion des PDM’s
  * Des « déclinaisons » (enfant) sont possibles, on peut changer le  design, supprimer, ajouter des fonctionnalités. Exemple : [https://minimasse.choisir.poeledemasse.org/ 1](https://minimasse.choisir.poeledemasse.org/) qui vérifie si le MiniMasse correspond au besoin, si c’est pas le cas on élargit aux autres poêle de masse…
  * Suggestion du meilleur poêle de masse (open source)
  * Multi-langue

## Dépendances / Utilisations

Quelques projets open sources utilisé dans celui-ci :

* Bootstrap 5.3
* Mapbox : https://docs.mapbox.com/mapbox-gl-js/example/map-projection/
* Thème build https://themestr.app https://huemint.com/bootstrap-basic/ ? 
    * https://huemint.com/bootstrap-basic/#palette=e0eec5-ffffff-030303-fec568-9a5520-9466a9
* Theme enfant généré avec :
    * https://pikock.github.io/bootstrap-magic/app/index.html#!/editor
    * https://bootstrap.build/app

## Auteurs/Contributeurs

* Auteurs : Mercereau David
* Soutien technique sur la partie Thermique : Damien Sgorlon
* La page d'Uzume pour la compréhension de la méthode G :https://www.uzume.fr/quelle-puissance-pour-mon-poele-de-masse 
* Le calculateur Oxalis pour la compréhension de la méthode Ubat : https://www.oxalis-asso.org/?page_id=3206
* Les retours de la communauté : https://forum.poeledemasse.org/tag/choisirpoeledemasseo