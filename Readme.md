# Choisir son poêle de masse

Vous aide à considérer votre besoin de chauffage et vous suggère le "bon poêle de masse" open source en conséquences.

En ligne : https://choisir.poeledemasse.org/

* Les  "enfants" :
  * https://minimasse.choisir.poeledemasse.org/ qui suggère si le MiniMasse est pertinent pour vous ou non
  * https://afpma.choisir.poeledemasse.org/ qui orient vers un artisan poêlier proche de chez soit
  * https://uzume.choisir.poeledemasse.org/ qu'Uzume inclus dans sa page : https://www.uzume.fr/quelle-puissance-pour-mon-poele-de-masse

Ce petit calculateur développe 2 étape : 

* Estime le besoin de chauffage de votre habitat
* Détermine un poêle de masse adéquate pour votre besoin

## Besoin de chauffage

Permet une évaluation des besoins de chauffage : 

- 2 « niveaux » :
  - « Débutant » utilise la méthode G
  - « Éclairé » utilise la méthode Ubat général
  - « Expert » pour détailler paroi par paroi et déterminer un U précis sur votre habitation.
- Plus de carte de la France par zone : La température « de base » est recherchée dans l’historique météorologique (par API) en fonction de sa localisation géographique. On peut choisir sur  combien d’année on va chercher l’historique : 5, 10, 15, 20 ans (par  défaut 10 ans parce que le climat change…)
  - La température ‹ de base › c’est la température des 5 jours  consécutifs les plus froids de l’année, moyenné sur les X dernières  années.
- Transparence sur le calcul qui est fait pour Ubat/G, aussi pour la suggestion des poêle de masse

## Suggestion

[2 paramètres](https://framagit.org/kepon/choisirsonpdm/-/blob/main/assets/js/default-settings.js?search=debug#L33) se trouve :

* *percentPowerSuper* : pourcentage (+/-) de correspondance auquel on considère que le poêle propose correspond bien (actuellement : 8%)
* *percentPowerCool* : pourcentage (+) de correspondance auquel on considère que le poêle propose correspond pas trop mal... (actuellement : 20%)

La suggestion pour le "bon poêle de masse" se déroule comme suite : 

* Nous disposons du besoin de chauffage (déperdition du bâtiment) noté "D". 
* On prend chaque poêle 1 par 1 avec ces caractéristiques : https://choisir.poeledemasse.org/#opendata dans son cas d'usage "critique" (car D est calculé avec la température critique), ensuite on détermine : 
    * *diffPowerDeperdition* : la différence de puissance du poêle de masse avec D (puissance - D)
    * *diffPowerDeperditionPercent* = 100**diffPowerDeperdition*/D (le pourcentage de différence entre la puissance et D)
    * *diffPowerDeperditionAbs* : *diffPowerDeperdition* en absolu 
    * *diffPowerDeperditionPercentAbs* : *diffPowerDeperditionPercent* en absolu
    * *bestClass* défini le niveau de corrélation avec les déperditions D ; 
        * 2 si *diffPowerDeperditionPercentAbs* < *percentPowerSuper*
        * 1 si *diffPowerDeperditionPercent* < *percentPowerCool*
        * 0 sinon...
    
* Ensuite on explique les choix en confondant bestClass 1 & 2 (juste en surlignant en primaire le 2 et en secondaire le 1 pour mettre en valeur le poêle le plus proche s'il y en a plusieurs)

A chaque citation de suggestion on indique s'il est sur ou sous dimensionné et de combien.

### Dev suggestion

Quelques exemples qui permettent différentes suggestion pour tester l'algo :

Exemple n'aboutissant à aucune "super suggestion", que des "cool" : http://127.0.0.1:3000/index.html#level=1&transparent=true&livingspace=50&livingheight=2.5&livingvolume=125&livingvolume_auto=true&wastagesurface=120&temp_indor=19&g=1.8&ubat_global=0.4&venti_global=0.14&lat=&lng=&temp_base=11.6&temp_base_auto=&temp_base_years_archive=10&submit_input=1
Exemple à plusieurs "super" suggestion : http://127.0.0.1:3000/index.html#level=1&transparent=true&livingspace=149.7&livingheight=2.5&livingvolume=374.25&livingvolume_auto=true&wastagesurface=120&temp_indor=19&g=1.8&ubat_global=0.4&venti_global=0.14&lat=&lng=&temp_base=11.6&temp_base_auto=&temp_base_years_archive=10&submit_input=1
2 cool mais rien de super : http://127.0.0.1:3000/index.html#level=1&transparent=true&livingspace=149.7&livingheight=2.5&livingvolume=374.25&livingvolume_auto=true&wastagesurface=120&temp_indor=26&g=1.8&ubat_global=0.4&venti_global=0.14&lat=&lng=&temp_base=11.6&temp_base_auto=&temp_base_years_archive=10&submit_input=1

## Changelog

* Futur : 
  * https://framagit.org/kepon/choisirsonpdm/-/issues/23
* Master (current)
  * [add] Considération de la température du sol : https://framagit.org/kepon/choisirsonpdm/-/issues/24
  * [add] Génération PDF et amélioration de l'impression : https://framagit.org/kepon/choisirsonpdm/-/issues/25
* v2.1 (current)
  * [add] MD5 pour rendre unique les matériaux et les parois personnalisés (pour permettre un meilleur partage des URL/résultats)
    * Rupture de compatibilité pour la collection de matériaux personnalisés ainsi que de paroi
* v2.0
  * [add] Carte de la température selon la norme NF P52-612/CN : https://www.boutique.afnor.org/fr-fr/norme/nf-p52612-cn/systemes-de-chauffage-dans-les-batiments-methode-de-calcul-des-deperditions/fa165533/36563
  * [add] Mode Eclairé : Ubat personnalisable (si étude thermique existante)
  * [add] Mode "Expert" pour détailler paroi par paroi le U du bâtiment
    * Ajouter et enregistrer des parois personnalisé
    * Ajouter et enregistrer des matériaux personnalisé 
      * Contribution à la base de donnée commune possible à l'ajout
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

* Font Awesome
* Bootstrap 5.3
* Jquery
* Jquery UI
* Select 2
* Jquery i18n pour la traduction
* Mapbox : https://docs.mapbox.com/mapbox-gl-js/example/map-projection/
* Thème utilisé : https://bootswatch.com/yeti/
  * sympa : https://bootswatch.com/litera/ https://bootswatch.com/lumen/
* Theme enfant généré avec :
    * https://bootstrap.build/app

## Auteurs/Contributeurs

* Auteurs : Mercereau David
* Soutien technique sur la partie Thermique : Damien Sgorlon
* Traduction ES edufas http://www.estufasdeinercia.wordpress.com/
* Relecture traduction EN Stefan P
* La page d'Uzume pour la compréhension de la méthode G :https://www.uzume.fr/quelle-puissance-pour-mon-poele-de-masse 
* Le calculateur Oxalis pour la compréhension de la méthode Ubat : https://www.oxalis-asso.org/?page_id=3206
* Les retours de la communauté : https://forum.poeledemasse.org/tag/choisirpoeledemasseo
* Zone de la carte des températures de bases par Jocelun Nourtier http://nourtier.net/JoceWanadoo/Bricolage/PAC/calcul_PAC.htm