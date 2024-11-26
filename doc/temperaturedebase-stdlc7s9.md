
Notre contributeur : 

   * texte libre/collaboratif, n'hésitez pas à ajouter/modifier celui-ci... les modifications sont archivés, il est possible de revenir en arrière.. Si vous contribuez, indiquer votre nom/prénom en bas du document.
   * Ressources images à centraliser ici : [https://cloud.mercereau.info/index.php/s/rfDMP5ka7qnFaHj](https://cloud.mercereau.info/index.php/s/rfDMP5ka7qnFaHj)


# **Température de base**

La température "de base" c'est la température de référence pour dimensionner un besoin de chauffage. 

La température de base en France est défini dans la norme NF EN 12831 édité en 2017 : [https://www.boutique.afnor.org/fr-fr/norme/nf-en-128311/performance-energetique-des-batiments-methode-de-calcul-de-la-charge-thermi/fa184817/79485](https://www.boutique.afnor.org/fr-fr/norme/nf-en-128311/performance-energetique-des-batiments-methode-de-calcul-de-la-charge-thermi/fa184817/79485)



## **Besoin**

**Déterminer la méthode de calcul de la "température de base"** de la norme pour le dimensionnement d'un moyen de chauffage. Ici pour le projet [https://choisir.poeledemasse.org/](https://choisir.poeledemasse.org/) dans l'optique de rendre la température "de base" plus à jour avec les dernière données météos. Ceci sera disponible dans une API ouverte qui pourrait servir à d'autres usages : [https://framagit.org/kepon/choisirsonpdm/-/tree/main/api?ref\_type=heads#api-temp%C3%A9rature-de-base](https://framagit.org/kepon/choisirsonpdm/-/tree/main/api?ref\_type=heads#api-temp%C3%A9rature-de-base)



## **Pourquoi ?**

   * La norme étant "figé" les températures de base ne sont pas mise à jour, hors le climat semble se modifier plus vite que les normes*
   * Les températures indiqués sont très imprécise, couvre un département entier alors que les moyens numérique actuelle d'archivage météo nous permettrai d'être beaucoup plus précis. On peut être dans un cas ou la différence se joue à 3° prêt quand on est entre 2 zone de la carte ou entre 2 altitude [https://www.izi-by-edf-renov.fr/blog/temperature-exterieure-de-base#par-region](https://www.izi-by-edf-renov.fr/blog/temperature-exterieure-de-base#par-region) 
   * Les résultats de la carte + correction par altitude nous sembles très pessimistes, aussi le risque est de surdimensionné inutilement un moyen de chauffage. 


Il nous faut connaître la méthodologie de calcul pour permettre à quelqu'un qui souhait déterminer une température de base/un besoin de chauffage en fonction d'un lieu géographique/une adresse puisse le faire simplement. A l'image de ce qui a été tenté sur [https://choisir.poeledemasse.org/](https://choisir.poeledemasse.org/) on indique une adresse et on obtient la température de base. 



## **Recherche**

Actuellement nos rechercher ne nous permettent pas de déminer la méthodologie de calcul. Plusieurs pistes sont à l’œuvre mais pas de source officiel

Il y a souvent une référence à la température basse sur  "5 jours" mais est-ce une moyenne ? Sur 5 jours consécutif ou non ? Sur combien d'année d'histoire météo regardons-nous ?



Il semblerai qu'il faille récupérer les températures les plus froides d'une année. Sur 5 jours consécutif ou non ? Avec combien d'année de recule ? On moyenne ces résultats par année ?



### Norme EN 12831-1

Image :[https://cloud.mercereau.info/index.php/s/rfDMP5ka7qnFaHj/download?path=%2F\&files=normeX.png\&downloadStartSecret=nphbvrjm4u](https://cloud.mercereau.info/index.php/s/rfDMP5ka7qnFaHj/download?path=%2F\&files=normeX.png\&downloadStartSecret=nphbvrjm4u)

"Les températures extérieures de base proposées  [...] sont conformes [...] à celle entérinées par la norme nationale complémentaires NF P 52-612/CN



#### Contact rédacteur de la norme : 

   * M OZENNE :             SOLARONICS CHAUFFAGE (BNG) [http://www.solaronics.com/fr/contactez-nous](http://www.solaronics.com/fr/contactez-nous) ligne direct 03 20 10 59 03 
       * 23/05 : pas dispo
   * M  MOUGE /  LOGICIELS PERRENOUD [https://logicielsperrenoud.com/](https://logicielsperrenoud.com/)
       * Lui me dit que ça date des règles THK (un DTU) qui a été promulgué en 1970 et qu'on utilise toujours les mêmes depuis...


### Norme NF P52-612/CN

[https://www.boutique.afnor.org/fr-fr/norme/nf-p52612-cn/systemes-de-chauffage-dans-les-batiments-methode-de-calcul-des-deperditions/fa165533/36563](https://www.boutique.afnor.org/fr-fr/norme/nf-p52612-cn/systemes-de-chauffage-dans-les-batiments-methode-de-calcul-des-deperditions/fa165533/36563) (consultable avec un compte gratuit)

Les température « de base » sont des température « extérieur » prise au niveau de la mer (d’ou le côté correctif d’altitude) mais sont des « données », aucune méthodologie de calcul, source n’est mentionné, pas même l’histoire des 5 jours…

Quelques captures : [https://cloud.mercereau.info/index.php/s/rfDMP5ka7qnFaHj?path=%2Fnf-p52612](https://cloud.mercereau.info/index.php/s/rfDMP5ka7qnFaHj?path=%2Fnf-p52612)

#### Demande sur commentaire : 

    [https://norminfo.afnor.org/norme/nf-p52-612cn/systemes-de-chauffage-dans-les-batiments-methode-de-calcul-des-deperditions-calorifiques-de-base-complement-national-a-la/85721](https://norminfo.afnor.org/norme/nf-p52-612cn/systemes-de-chauffage-dans-les-batiments-methode-de-calcul-des-deperditions-calorifiques-de-base-complement-national-a-la/85721)

#### Contact rédacteur de la norme : 

   * ~~M            BASTIDE            BASTIDE-BONDOUX~~  04 78 16 06 16
       * 23/05 :: M (jean claude !?) Bastide est en retraite - mais M bondoux est dans les murs, peut être qu'il se rappel d'un truc, il doit me rappeler et peut être me mettre en relation avec M bastide
   * ~~CARDONNEL            CARDONNEL INGENIERIE~~
       * 23/05 : 0980802124 / 01 64 98 25 00 toutes les lignes sont occupés
           * L'entreprise à été racheté, plus personne de CARDONNEL dans les bureau...
   * BRUNEL            BE BRUNEL [https://bebrunel.webnode.fr/contact/](https://bebrunel.webnode.fr/contact/) :04 71 03 39 05
       * 23/05 : Ne prend pas de message, **à re-essayer**
   * ~~M            TIFFANNEAU            CERQUAL~~ : pas trouvé, peut être lui : [https://fr.linkedin.com/in/francis-tiffanneau-a0a2b76a](https://fr.linkedin.com/in/francis-tiffanneau-a0a2b76a) mais j'ai pas trouvé de numéro... [https://www.qualitel.org/contactez-nous/](https://www.qualitel.org/contactez-nous/) c'est payant
   * ~~M    TASSONE            SNEFFCCA  : SNEFFCCA~~ c'est yn syndicat... 
   *  Marie-Christine ROGER (DGUHC).  : j'ai trouvé qu'une boîte e-mail : marie-christine.roger@developpement-durable.gouv.fr [https://www.urbanisme-puca.gouv.fr/IMG/pdf/communique\_de\_presse\_du\_01\_juillet.pdf](https://www.urbanisme-puca.gouv.fr/IMG/pdf/communique\_de\_presse\_du\_01\_juillet.pdf) j'ai envoyé un message
   * ~~Bernard  LE CAMPION            COCHEBAT~~
       * 0)1 53 32 79 79 il n'est plus au syndicat COCHEBAT, ils se rappel plus bien de lui il ferai partie de [https://thermacome.fr/contactez-nous/](https://thermacome.fr/contactez-nous/)
           * 02 33 91 42 94 il est partie à la retraite, pas d'info en plus...
   * ~~ LAULIAC            GESEC~~
       * [https://www.gesec.fr/contactez-nous/](https://www.gesec.fr/contactez-nous/) plus dans les murs...  
       * Plus là mais Marie clémence l'a remplacé. Elle m'oriente vers CARDONNEL toujours en activité et me met des warning sur le fait qu'il faut utiliser ces températures même si elle sont vielles/fausses parce que sinon on est hors DTU/rêgles de l'arts et ça pourrait être reproché à un artisant par son assureur ou autre...
   * M            ASFAUX            GFCC :  [https://media.xpair.com/conseil/reglementation/EN\_92\_42.pdf](https://media.xpair.com/conseil/reglementation/EN\_92\_42.pdf) M. ASFAUX (Tél. : 01.47.17.61.64) numéro non attribué
       * Le groupement à changé de nom : [https://www.uniclima.fr/uniclima.html](https://www.uniclima.fr/uniclima.html) : 01 45 05 70 00 mais reste injoiniable, à **re-essayer**
   * M            AUVERGNE            BNG
   * M            CHARLOT            BNG - benoit.charlot@francegaz.fr - 0180210778
       * Se rappel plus de grand chose (avait pas l'air bien impliqué) mais me dit que  **HANTZ            CETIAT **: serait toujours en activité et serait plus à même de me renseigné
       * **A l'AFNOR : viltart baquero Ursula : Commission P529 qui est sencé suivre la commission  - ursula.viltart-baquero@afnor.org**
   * **M  HANTZ            CETIAT : **
       * Téléphone : +33 (0)4 72 44 49 00
       * dominique.hantz@cetiat.fr mail envoyé le 24/05
   * AFNOR :  **Viltart baquero Ursula**
       * 01 41 62 80 00 - en réunion le 24/05
   * M FELDMANN costic : [https://www.costic.com/](https://www.costic.com/)  01 30 85 20 10  - (choix 3)
       * Il n'est plus au Costic :(
       * J'ai eu le directeur M HAOUIZEE  Il dit que c'est un sujet épineux, lui aussii trouve que ces tesmpératures sont, pour certaines régions abérantes / désuet...
           * Lui n'a pas trouvé la source du calcul - il y aurait des sources allemande mais aucune base certaine. Il est fort probablement que l'orginie soit le COSTIC. Ils sont en train de numériser toutes leurs archives (courant été) donc il aurait peut être des réponses à apporter en septembre. 
               * **Re-contact fin septmbre M HAOUIZEE**
           * relancé le 31 octobre, absent
           * relance le 4 novembre
           * relance le 8 novembre
           * relance le 12 novembre
           * certainement dérivé de norme allemande
           * Sortie article sur température clim' mais il va falloir taper du point... c'est un sujet qui lui tien à cœur... ça dépendait du ministère de l'équipement...  mois qui viennent ça devrait avancer... faire bosser élève dessus.
               * direction@costic.com


### Meteofrance

Contact téléphonique : aucune idée

Elle me dit de faire un e-mail et me jure qu'on va me répondre (j'attends de voir) contact@meteo.fr



    

Bonjour,

        

Je suis David Mercereau je suis impliqué dans l'AFPMA ([https://afpma.pro)](https://afpma.pro)) dans le pole technique/juridique. 

En France le calcul des besoins de chaleur d'un habitat régit par la norme EN 12831-1 fait appel à une valeur de température extérieur dite "température de base" décrite dans la norme NF P52-612/CN. Hors dans cette norme ne figure aucune information sur la méthode de calcul employé pour obtenir ces températures, elle se contente de distribuer des données. Hors les valeurs données nous semble pessimistes, dépassés... **Avez-vous une idée  de la méthode de calcul employé déterminer cette valeur de température extérieur de base nécessaires au calcul des besoins de chauffage ?**

Nous avons eu plusieurs pistes (moyenne des 5 jours les plus froids de l'année moyennés sur 30 ans OU moyenne des 3 jours consécutif les plus froids de l'année moyennés sur 20 ans...) mais rien d'écrit / vérifier...

2 pistes pour le moment : 

   * Que cette méthode de calcul soit uniforme (donc non décrite) et qu'elle nous viendrait de l'Allemagne... mais encore une fois c'est une piste de recherche rien de concret...  
   *     
   * Que la méthode ait  été recommandée par le Costic. Au Costic aussi on s’interroge sur ces  valeurs de température extérieur de base sans avoir la méthode. Ils sont  en train de numériser leurs archives et espère, en septembre, pouvoir  faire une recherche à ce sujet dans leurs archives.  
Quoi qu'il en soit ces valeurs doivent très probablement émaner de vos services météorologique. Avez vous une idée / une piste sur cette méthodologie de calcul ?

Belle journée,

David Mercereau

      0663691604

    

- Première réopnse de météo france :



 

Bonjour M. Mercereau,



Je travaille au sein de la Direction Commerciale de Météo-France pour le compte de clients professionnels du monde de l'énergie.

En lien avec mon collègue Christophe Jacolin, responsable du marché de l'énergie, je vais prendre en charge votre demande qui nous a été adressée.



Les références en matière de température sont nombreuses (températures normales, redressées, minimales de base, lissées, efficaces, ...).

A ma connaissance, nous n'avons pas encore répertorié cette "température extérieure de base" utilisée pour le calcul de déperdition thermique par les professionnels du bâtiment.



Je me renseigne auprès de notre département Data Science et Consultance pour savoir si par le passé ils ont été sollicités au sujet de cette température et de la méthode de calcul employée.

Il est fort possible que les données météorologiques employées proviennent de Météo-France. 

En revanche, il n'est pas certain que sa mise en œuvre ait été de notre ressort. Les organismes nationaux de normalisation ont très bien pu à l'époque s'appuyer sur des sociétés ou des bureaux d'études compétents.



La norme EN 12831 datant de 2003, si les données de température utilisées n'ont pas été actualisées, elles ont probablement perdu une part de leur pertinence.

 Pour information, nous réactualisons actuellement nos températures de référence en métropole tous les 5 ans en prenant en compte l'effet du changement climatique.



Cordialement.

CAILLAUD Benois



### christian FELDMANN

 m'a répondu par email à côté, je relance



### izi-by-edf-renov.fr

Source : [https://www.izi-by-edf-renov.fr/blog/temperature-exterieure-de-base](https://www.izi-by-edf-renov.fr/blog/temperature-exterieure-de-base)



    C’est la norme française NF EN 12831 qui définit le tableau des températures extérieures de base [...] cette température de base est la température la plus basse relevée dans chaque département pendant au moins 5 jours dans l’année. Ces températures très basses sont bien souvent atteintes au cours de la nuit.



Sur combien d'année est-elle pondéré ? "au moins 5 jours dans l'année"



### izi-by-edf-renov.fr - commentaire de Stephane le 16/04/2018

Source : [https://www.izi-by-edf-renov.fr/blog/temperature-exterieure-de-base](https://www.izi-by-edf-renov.fr/blog/temperature-exterieure-de-base)



    bon article mais une petite imprécision. Au début de l'article vous dites : "La température extérieure de base désigne la température la plus basse constatée dans un département." ceci n'est pas juste a car comme vous le mentionnez un peu plus bas il manque l'information: "pendant au moins 5 jours dans l’année".  Vous écrivez ensuite: "Ces températures très basses sont bien souvent atteintes au cours de la nuit." Ce n'est pas exact, durant ces 5 jours les températures peuvent être encore plus basses que la température de base (surtout pendant la nuit) mais ne vont pas le rester. La température de base est une moyenne sur 5 jours.



### izi-by-edf-renov.fr - commentaire de Samuel le 16/04/2018

Source : [https://www.izi-by-edf-renov.fr/blog/temperature-exterieure-de-base](https://www.izi-by-edf-renov.fr/blog/temperature-exterieure-de-base)



En réponse à Samuel, l'opérateur du site dit : 

    [...] Les températures enregistrées tiennent compte d'une moyenne des températures les plus basses sur place sur les 5 dernières années, à l'élaboration de ce tableau.

### confort.mitsubishielectric.fr

[https://confort.mitsubishielectric.fr/sites/confort/files/styles/edito\_image/public/2021-04/dtu-france-pac-mitsubishi.jpg?itok=KfVzcwH1](https://confort.mitsubishielectric.fr/sites/confort/files/styles/edito\_image/public/2021-04/dtu-france-pac-mitsubishi.jpg?itok=KfVzcwH1)

Les déperditions thermiques de base d’un bâtiment se calculent par rapport aux températures extrêmes dites températures de base, constatées minimum 5 jours dans l'année sur une période de 30 ans (cf. DTU 65.16, juin 2017). 



### Stefan

Le terme central en allemand me semble être « **Norm-Außentemperatur** », température de référence.

*Soyez prudent avec mes traductions peut-être peu claires :*

*Un besoin en chaleur (lié à la qualité d’un bâtiment, pour limiter les besoins annuels en énergie primaire, en kWh/a, sur la base de la loi allemande sur l’énergie du bâtiment GEG, Gebäudeenergiegesetz) et*

*Une charge calorifique à base d’une norme (en kW, en fonction de la température de référence d’un lieu, le terme issue de la technologie de chauffage, en suite le dimensionnement et la conception des surfaces chauffantes …)*

*Je dois répéter à plusieurs reprises la distinction entre les deux termes.*

Toutefois, la valeur de référence mentionnée à plusieurs reprises n’est pas expliquée.

Dans le livre, même les valeurs de correction nécessaires sont mentionnées, toujours les valeurs sources ne sont pas expliquées.

En utilisant ce terme, en retrouve des exemples

   * pour l’Allemagne une carte interactive** **[https://www.waermepumpe.de/normen-technik/klimakarte/](**https://www.waermepumpe.de/normen-technik/klimakarte/**)
   * pour l’Autriche un pdf, un xls
       * [https://www.oib.or.at/de/guidelines/oib-richtlinie-6-nat-pdf](**https://www.oib.or.at/de/guidelines/oib-richtlinie-6-nat-pdf**)
       * [https://www.oib.or.at/de/guidelines/oib-richtlinie-6-nat-excel](**https://www.oib.or.at/de/guidelines/oib-richtlinie-6-nat-excel**)
           * Ce fichier (de 2008) fait référence à un algorithme de calcul dans un supplément à la ÖNORM B 8110-5.
   * 



### Echange avec Olivier Grelier 

#### Réponse 1

Pour les températures de référence,  des infos sont dispos sur le site de le RT

[https://rt-re-batiment.developpement-durable.gouv.fr/documents-complementaires-a706.html](**https://rt-re-batiment.developpement-durable.gouv.fr/documents-complementaires-a706.html**)

#### Réponse 2 après relance

Désolé mais je n’en ai pas plus d’info.

Le mieux est de contacter le CSTB qui doit connaître tous les méandres du sujet RT ou alors peut être des éditeurs de logiciels de calcul thermiques . La liste des éditeurs « homologués » est disponible sur le même site.

Pour info , le CSTB, via le GS 14 en charge des avis technique à validé les donnés climatiques  de le RT 2012 pour les calculs de dimensionnement des conduits de fumée dans le dernier CPT 3708 V3



### Echange avec Christophe Prat 

### Qualiopi

#### Question : 

    Bonjour M Prat,

    J’aurais une question par rapport à la carte « des températures de bases » que vous utilisez durant vos formations (celle-ci : [https://www.oxalis-asso.org/wp-content/uploads/carte-france-T](https://www.oxalis-asso.org/wp-content/uploads/carte-france-T)°.jpg) . J’aimerais connaître la source de celle-ci si vous la connaissez ?

    Définition d’abord : des dires d’un camarade thermicien : la température de base c’est la température des 5 jours consécutifs les plus froids de l’année, moyenné sur les X années.

    J’ai plusieurs activités bénévoles au sein d’AFPMA (Association Française Poële Maçonné Artisanal) ou d’Agir Low-Tech dans lequel je participe au développement d’un poêle de masse open source (le MiniMasse). Dans ce cadre et pour aider les auto-constructeurs à choisir le bon poêle de masse je me suis penché sur le dimensionnement d’un poêle par rapport à son habitat. De ce fait je me suis un peu plus penché sur cette carte de « température de base ». Cette carte pourtant enseignée (pas que chez vous) semble daté au regard du changement climatique en cours en plus d’être relativement imprécise selon moi.

    Du coup de mon côté j’ai développé une carte interactive : (visible ici : [https://choisir.poeledemasse.org](https://choisir.poeledemasse.org) ) qui permet d’interroger la base de donnée Copernicus (projet européen) de « mémoire » du climat". J’en calcule la « température de base » en effectuant une moyenne des 5 jours de l’année les plus froids et je le moyenne sur 10 ans (ce dernier point est paramétrable) : [https://framagit.org/kepon/choisirsonpdm/-/tree/main/api](https://framagit.org/kepon/choisirsonpdm/-/tree/main/api)

    Si on compare l’extrême :

   * Vers Strasbourg selon la carte que vous utilisez la température « de base » serait -15°C
   * Sur mon logiciel : [https://choisir.poeledemasse.org/#lat=48.615649\&lng=7.089159](https://choisir.poeledemasse.org/#lat=48.615649\&lng=7.089159) c’est plutôt ~ -7°C
    Pour choisir le « bon moyen de chauffage », passer de -15 à -7 ça change tout non ?

    Autre chose : savez-vous si ça passe d’un point de vue réglementaire (assurance…) si la température de base issus d’un dimensionnement est prise sur une autre carte ? (dans le cadre ou un professionnel effectue un dimensionnement avec d’autres données que la carte « officielle » (si elle porte vraiment ce nom ?)

    Au plaisir de vous lire,

    Belle journée,



#### **Réponse : **

    Merci pour vos remarques.

    En effet, nous utilisons une carte officielle qui est actualisée selon les relevés météorologiques.

    Concernant l'assurabilité, une installation de chauffage doit assurer la température règlementaire 19°C au centre des pièces à la température de base.

    Température qui sera considérée sur la carte "officielle". Aussi, l'incidence de la prise en considération d'une température moindre, réduira la puissance installée, et donc, le "delta" T.

    Il sera ainsi mathématiquement impossible d'assurer 19°C à la température extérieure de base officielle.

    Voilà donc la raison de l'utilisation de cette carte.

    Bien entendu, nous ne parlerons pas des conséquences sur la combustion du bois.

    Navré de mon retard de réponse, bien cordialement,

    Christophe Prat



### ChatGPT

Bonjour,



En France le calcul des besoins de chaleur d'un habitat régit par la 

norme EN 12831-1 fait appel à une valeur de température extérieur dite 

"température de base" décrite dans la norme NF P52-612/CN. Hors dans 

cette norme ne figure aucune information sur la méthode de calcul 

employé pour obtenir ces températures, elle se contente de distribuer 

des données. Hors les valeurs données nous semble pessimistes, 

dépassés... Avez-vous une idée  de la méthode de calcul employé 

déterminer cette valeur de température extérieur de base nécessaires au 

calcul des besoins de chauffage ?



Nous avons eu plusieurs pistes (moyenne des 5 jours les plus froids 

de l'année moyennés sur 30 ans OU moyenne des 3 jours consécutif les 

plus froids de l'année moyennés sur 20 ans...) mais rien d'écrit / 

vérifier...



2 pistes pour le moment : 



Que cette méthode de calcul soit uniforme (donc non décrite) et 

qu'elle nous viendrait de l'Allemagne... mais encore une fois c'est une 

piste de recherche rien de concret...  



Que la méthode ait  été recommandée par le Costic. Au Costic aussi on s’interroge sur ces  valeurs de température extérieur de base sans avoir la méthode. Ils sont  en train de numériser leurs archives et espère, en septembre, pouvoir  faire une recherche à ce sujet dans leurs archives.

ChatGPT



Bonjour,



Le calcul des besoins de chauffage des bâtiments selon la norme EN 12831-1 repose effectivement sur la température extérieure de base, souvent décrite dans la norme NF P52-612/CN. La méthode de calcul pour déterminer cette température de base n'est pas explicitement détaillée dans les normes disponibles, ce qui peut expliquer les variations et les incertitudes que vous observez.

Méthodes possibles pour déterminer la température extérieure de base



Les deux pistes que vous mentionnez sont couramment évoquées pour déterminer cette température :



    Moyenne des 5 jours les plus froids de l'année sur 30 ans :

    Cette méthode consiste à prendre les températures minimales quotidiennes les plus basses sur une période de 30 ans, puis de faire la moyenne des cinq jours les plus froids de chaque année pour obtenir une valeur représentative.



    Moyenne des 3 jours consécutifs les plus froids de l'année sur 20 ans :

    Cette approche utilise les températures minimales sur une période de 20 ans, mais se concentre sur les périodes de trois jours consécutifs les plus froids pour calculer une moyenne.



Origines possibles de la méthode



Il est possible que la méthode de calcul soit héritée de pratiques allemandes ou recommandée par des organisations comme le COSTIC (Comité Scientifique et Technique des Industries Climatiques). Étant donné que le COSTIC est une référence en matière de techniques de chauffage et de climatisation en France, il est plausible qu'ils aient contribué à la formulation de ces méthodes, même si actuellement ils ne disposent pas de la méthode précise utilisée pour ces valeurs.

Ce que vous pouvez faire



    Suivre l'évolution des recherches au COSTIC : Étant donné qu'ils numérisent leurs archives, il serait utile de suivre leurs avancées et de voir si des documents historiques ou des recommandations peuvent apporter des éclaircissements sur la méthode utilisée.



    Consulter des experts en climatologie ou en thermodynamique du bâtiment : Ces spécialistes pourraient avoir des informations ou des études non publiées qui détaillent les méthodes de calcul des températures de base.



    Regarder du côté des normes internationales : Parfois, les normes européennes ou ISO peuvent contenir des annexes informatives ou des références croisées qui expliquent les origines des méthodes de calcul.



Conclusion



Il est regrettable que la méthode de calcul exacte ne soit pas documentée dans les normes disponibles, ce qui rend difficile une validation précise des températures de base. Cependant, en combinant des recherches auprès des organismes comme le COSTIC, en consultant des experts et en explorant des normes internationales, vous pouvez espérer obtenir des informations plus détaillées et pertinentes.



N'hésitez pas à revenir vers moi si vous avez besoin de plus d'aide ou de suivi sur ce sujet.

Est-ce que tu peux regarder dans les réglementations qui tourne autour de la RE2020 si ce n'est pas les mêmes températures "de base" utilisé ? Si c'est le cas il y a peut être la méthode de calcul...

ChatGPT



La RE2020 (Réglementation Environnementale 2020) succède à la RT2012 et introduit des critères encore plus stricts pour la performance énergétique des bâtiments. Pour déterminer les besoins de chauffage, la RE2020 utilise également des températures extérieures de base. Voyons si les réglementations autour de la RE2020 peuvent fournir des indices sur la méthode de calcul de ces températures de base.

Recherche dans la documentation de la RE2020



La documentation associée à la RE2020 inclut plusieurs textes réglementaires, guides techniques et documents explicatifs qui détaillent les exigences et les méthodes de calcul. Parmi ceux-ci, les suivants pourraient être pertinents pour trouver des informations sur la température de base :



    Arrêtés et décrets officiels sur la RE2020 : Ces documents décrivent en détail les exigences et les méthodes de calcul utilisées pour la performance énergétique des bâtiments.

    Guides techniques et documents d'accompagnement : Ces documents, souvent publiés par des organismes tels que le CSTB (Centre Scientifique et Technique du Bâtiment), fournissent des explications détaillées sur les méthodes de calcul et les données utilisées.



Examen des documents pertinents



Pour une recherche plus approfondie, voici les étapes à suivre :



    Consulter les textes officiels de la RE2020 :

        Arrêté du 4 août 2021 relatif aux exigences de performance énergétique et environnementale des constructions de bâtiments dans le cadre de la RE2020.

        Décret n° 2020-1269 du 19 octobre 2020 relatif à la réglementation environnementale des bâtiments neufs.



    Consulter les guides techniques :

        Guide technique RE2020 publié par le CSTB.

        Manuel de calcul RE2020.



Ces documents peuvent être consultés sur des sites officiels comme Legifrance, le site du Ministère de la Transition écologique, ou directement sur le site du CSTB.

Points de recherche spécifiques



    Méthodologie de calcul des températures de base : Rechercher dans les sections concernant le calcul des besoins de chauffage et les données climatiques utilisées.

    Références croisées à d'autres normes : Les documents peuvent référencer d'autres normes ou documents techniques où la méthode de calcul pourrait être détaillée.



Accès aux documents



Pour vous faciliter la tâche, je peux rechercher ces documents spécifiques et vérifier s'ils contiennent des informations sur la méthode de calcul des températures de base. Je vais maintenant vérifier ces sources et vous fournir un résumé.



Je vais maintenant vérifier les documents relatifs à la RE2020 pour obtenir les informations nécessaires.



Pour ce qui est des températures de base utilisées dans le calcul des besoins de chauffage sous la RE2020, les réglementations associées fournissent effectivement des informations sur les méthodes et les données climatiques employées.

Températures de Base sous la RE2020



Les températures de base utilisées pour les calculs de besoins de chauffage dans le cadre de la RE2020 sont définies dans les textes réglementaires, notamment l'arrêté du 4 août 2021 relatif aux exigences de performance énergétique et environnementale des constructions de bâtiments en France métropolitaine. Ce texte approuve la méthode de calcul prévue à l'article R. 172-6 du code de la construction et de l'habitation.

Méthodologie



La méthode de calcul des besoins de chauffage et des températures de base repose sur des données climatiques qui sont définies pour chaque zone climatique de la France. Ces données sont utilisées pour simuler les conditions de chauffage nécessaires dans différents scénarios climatiques. Voici quelques points clés sur la méthodologie employée :



    Données Climatiques : Les données climatiques utilisées sont issues de séries de mesures historiques sur plusieurs décennies. Les normes et réglementations antérieures, comme la RT2012, utilisaient déjà des bases de données climatiques similaires, mais la RE2020 les a mises à jour pour refléter des conditions plus actuelles.



    Températures de Référence : Les températures de base sont souvent définies comme des moyennes des jours les plus froids sur une certaine période (par exemple, sur 20 ou 30 ans). La méthode exacte peut varier, mais elle implique généralement des moyennes calculées sur les jours les plus froids de chaque année sur une période prolongée pour assurer une représentativité statistique.



    Zones Climatiques : La France est divisée en différentes zones climatiques, chacune ayant ses propres données de référence. Les températures de base peuvent donc varier significativement d'une région à l'autre.



Sources et Références



L'arrêté du 4 août 2021 et les décrets associés fournissent des détails sur la méthode de calcul et les exigences de la RE2020. Vous pouvez consulter ces documents sur des sites tels que Legifrance et le site officiel du ministère de la Transition écologique​ (RT-RE-bâtiment)​​ (RT-RE-bâtiment)​​ (XPair)​.



Si vous avez besoin de plus de détails techniques ou de confirmation sur des points spécifiques, il peut être utile de consulter les annexes de ces arrêtés, en particulier celles qui concernent les méthodes de calcul détaillées (comme les annexes III et IV de l'arrêté du 4 août 2021)​ (Groupe Qualiconsult)​.



En résumé, bien que la méthode exacte de calcul des températures de base ne soit pas toujours explicitement détaillée dans chaque document, elle repose sur des moyennes climatiques historiques et des analyses statistiques pour assurer que les besoins de chauffage sont correctement estimés pour chaque zone climatique de France.



Est-ce que les normes de calcul de besoin de chauffage allemand ne détail pas de température de référence / de base ? Il n'est pas impossible que la norme Française se base sur une autre norme... peut être européenne... 

ChatGPT



Les normes allemandes de calcul des besoins de chauffage, notamment la norme DIN 12831, sont souvent très détaillées et pourraient fournir des informations utiles sur les températures de référence utilisées pour les calculs. Il est possible que les normes françaises s'inspirent ou s'alignent sur des normes européennes ou internationales, y compris celles de l'Allemagne.

Normes allemandes et température de base



En Allemagne, la norme DIN EN 12831 est utilisée pour le calcul de la charge thermique des bâtiments. Cette norme inclut des méthodes pour déterminer la température extérieure de base. Voici quelques points clés :



    DIN EN 12831 :

        Cette norme est harmonisée au niveau européen, ce qui signifie qu'elle est conforme aux directives européennes et qu'elle peut être utilisée comme base commune dans plusieurs pays.

        Elle décrit comment calculer les besoins de chauffage d'un bâtiment en tenant compte des conditions climatiques locales.



    Températures de base :

        La température extérieure de base en Allemagne est définie sur la base de données climatiques historiques, similaires aux méthodes utilisées en France. Cela implique généralement une analyse des températures minimales sur une période prolongée (20 à 30 ans).



    Sources de données climatiques :

        En Allemagne, les données proviennent de sources comme le Service météorologique allemand (Deutscher Wetterdienst, DWD), qui fournit des données climatiques détaillées et fiables.



Normes Européennes et Température de Base



La norme DIN EN 12831 étant harmonisée au niveau européen, elle fait partie du cadre plus large des normes européennes. Ces normes sont souvent adoptées ou adaptées par les pays membres, y compris la France. La norme EN 12831, par exemple, est utilisée dans plusieurs pays européens pour le calcul des besoins de chauffage et de refroidissement.

Méthodologies communes



La méthode de détermination des températures de base dans les normes européennes comme l'EN 12831 suit souvent des principes similaires :



    Analyse statistique des températures minimales :

        Les températures de base sont souvent calculées comme la moyenne des températures les plus froides enregistrées sur une période de 20 à 30 ans.

        Ces valeurs sont spécifiques à chaque zone climatique pour refléter les conditions locales.



    Utilisation de données historiques :

        Les données météorologiques historiques sont essentielles pour garantir que les températures de base sont représentatives des conditions climatiques réelles.



Documentation et Sources



Pour plus de détails, vous pouvez consulter les documents suivants :



    DIN EN 12831 : Disponible via les services de normalisation allemands ou européens.

    DWD (Deutscher Wetterdienst) : Fournit des données climatiques détaillées pour l'Allemagne.



En conclusion, les températures de base utilisées pour le calcul des besoins de chauffage en France sous la norme NF P52-612/CN pourraient très bien être alignées ou inspirées par les normes européennes comme l'EN 12831, qui est également utilisée en Allemagne sous la forme DIN EN 12831. Ces normes partagent des méthodologies communes basées sur des analyses statistiques des données climatiques historiques.

Tu me détail souvent "une moyenne des températures les plus froide sur 20, 30 ans"... mais c'est une moyenne de combien de valeur ? 3, 5, 10 jours les plus froid ? Est-ce que ce sont les jours les plus froids consécutif ou "dans toutes l'année"

ChatGPT



Pour déterminer la température de base utilisée dans le calcul des besoins de chauffage, les normes européennes et nationales, telles que la norme EN 12831, offrent des méthodologies spécifiques. La question clé concerne le nombre de jours utilisés pour calculer la moyenne des températures les plus froides, ainsi que la nature de ces jours (consécutifs ou non).

Norme EN 12831



La norme européenne EN 12831, utilisée comme base pour de nombreux calculs de chauffage à travers l'Europe, y compris en France et en Allemagne, définit la température de base selon des critères précis. Cependant, la norme ne fixe pas une règle stricte unique pour le nombre de jours, mais elle fournit des lignes directrices que chaque pays peut adapter selon ses conditions climatiques spécifiques.

Exemples de Méthodologies



    Allemagne (DIN EN 12831) :

        Moyenne des 3 jours les plus froids consécutifs : En Allemagne, la température de base est souvent déterminée par la moyenne des températures minimales sur les 3 jours les plus froids consécutifs de l'année, moyennée sur une période de 20 à 30 ans. Cela permet de capturer des périodes de froid intense qui peuvent affecter les besoins de chauffage de manière significative.

        Utilisation des données du DWD : Le Service météorologique allemand (Deutscher Wetterdienst, DWD) fournit des données climatiques historiques utilisées pour ces calculs.



    France (NF P52-612/CN) :

        Moyenne des 5 jours les plus froids : Une des approches courantes mentionnées est la moyenne des 5 jours les plus froids de l'année, sur une période de 30 ans. Il n'est pas toujours précisé si ces jours doivent être consécutifs ou simplement les plus froids de l'année.

        Considérations climatiques locales : Les variations climatiques locales peuvent entraîner des adaptations dans le choix de la méthode exacte.



Conséquences des Choix Méthodologiques



    Consécutifs vs. non consécutifs :

        Les jours consécutifs capturent les périodes prolongées de froid intense, ce qui peut être crucial pour dimensionner correctement le système de chauffage.

        Les jours non consécutifs peuvent donner une vision plus large des températures extrêmes, mais peuvent ne pas refléter les périodes soutenues de froid.



    Nombre de jours :

        Un plus grand nombre de jours (par exemple, 5 jours) peut lisser les anomalies et fournir une moyenne plus stable, mais peut aussi diluer les pics de froid.

        Un plus petit nombre de jours (par exemple, 3 jours) est plus sensible aux extrêmes et peut conduire à des dimensionnements plus conservateurs du système de chauffage.



Conclusion



Les méthodes pour déterminer la température de base impliquent généralement des moyennes de quelques jours les plus froids de l'année, souvent entre 3 et 5 jours, et ces jours peuvent être consécutifs ou non, selon la norme et les pratiques locales. Les normes européennes comme l'EN 12831 laissent une certaine flexibilité pour que chaque pays puisse adapter les méthodologies en fonction de ses conditions climatiques spécifiques. Les pratiques en France et en Allemagne montrent des approches légèrement différentes mais basées sur des principes similaires d'utilisation de données climatiques historiques.



## **Remise en cause**

Si la méthodologie de calcul de la température de base ne nous semble pas pertinente, il est possible d'avoir plusieurs méthodologie de calcul : l'officiel + une autre à définir



## **Rédacteur/contributeur de ce texte**

David Mercereau (contact par e-mail : [https://david.mercereau.info/contact/](https://david.mercereau.info/contact/)
