Test sur : carte_temperature_cote_seule_cool (copie).svg avec test.html ça fonctionne impec !

qui est généré avec generate.py



> Il fonctionne bien. Il génère une carte de la France avec pour limite des départements et des températures (avec des couleurs différentes) dites "de bases" qui correspondent à une norme Française. Puis une zone à 25km de la mer. Ne touche aucunement à tout ça, ça fonctionne bien, le rendu est TOP !
>
> J'aimerai ajouter une fonctionnalité. J'aimerai que chaque département soit un lien "a"  clicable (c'est pour une interface html/Js après) et que dans ce lien figure en attribut : 
>
> * title : le numéro du département 
> * data-temp : la température "de base" de la zone



Il faut essayer de faire ajouter "data-temp" par chatgpt" 

    <path
       d="m 124.80015,238.27698 -0.0182,-0.0665 0.0852,-0.026 0.0596,-0.12442 0.084,0.12635 -0.10085,0.0201 -0.0302,0.0506 -0.0795,0.0198"
       clip-path="url(#p28fe1dba70)"
       style="fill:#f29274;stroke:#000000;stroke-width:0.2"
       id="path1048" />
    <a
       id="a3887"
       depnum="44"
       data-temp="-123"
       xlink:title="44"
       xlink:href="http:://nantes"
       target="azer">
      <path data-temp="44-1"
         d="m 13[...]07"
         clip-path="url(#p28fe1dba70)"
         style="fill:#f29274;stroke:#000000;stroke-width:0.2"
         id="path1050" />
    </a>

Sinon faudra le faire à la mai...



De toute façon il va falloir couper les département côtéier à la mano...





https://github.com/gregoiredavid/france-geojson/blob/master/departements.geojson



Dans inskap, se mettre en editeur de noeur

sélectionner le trai des 25km, sélectionner le département, faire division

copier le résultat

revenir en arrière

supprimer l'ancien département

coller le nouveau

renommer les ID





@todo : 

* gestion correction altimétrique (donner en console) du coup on retire la legende ? ou on met des zones ?
* Vérifier les données
  * Corriger : https://chatgpt.com/g/g-p-680fc9cb59848191ae8ef8b1417adad6-pdm/c/695d8271-3b1c-8332-b367-1864558f019f
    * **Frontière côtière nord**
    * alpe maritime (en bas à droite)
* intégration
