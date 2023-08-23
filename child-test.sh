#!/bin/bash

fichiers=(
    'assets/js/app-befor.js'
    'assets/css/bootstrap.css'
    'assets/img/logo.png'
)

pwd=`pwd`

if [ "$1" == "" ]; then
    echo "Configuration par default"
    child="default"
else 
    child="$1.choisir.poeledemasse.org"
fi 

if ! [ -d "$pwd/child/$child" ] ; then
    echo "Cette enfant ($child) n'existe pas, exit"
    exit 1
fi

for fichier in ${fichiers[@]}
do
    echo "Pour $fichier"
    rm $pwd/$fichier
    cp $pwd/child/$child/$fichier $pwd/$fichier
done

