#!/bin/bash

fichiers=(
    'assets/js/app-suggestion.js'
    'assets/js/app-custom.js'
    'assets/css/bootstrap.css'
    'assets/img/logo.png'
    'assets/img/favicon-32.png'
    'assets/img/favicon-180.png'
    'assets/img/favicon-192.png'
    'settings.js'
)
pwd=`pwd`
htaccess="$pwd/.htaccess"

if [ "$1" == "" ]; then
    echo "Configuration par default"
    child="default"
else 
    child="$1"
fi 

if ! [ -d "$pwd/child/$child" ] ; then
    echo "Cette enfant ($child) n'existe pas, exit"
    exit 1
fi

echo 'Header set X-Frame-Options "ALLOW-FROM *"' > $htaccess
echo "RewriteCond %{QUERY_STRING} ^s=([^&]+)$" >> $htaccess
echo "RewriteRule ^$ /api/link.php?link=%1 [L,R=301]" >> $htaccess
echo "RewriteEngine on" >> $htaccess

for fichier in ${fichiers[@]}
do
    echo -n "Pour $fichier : "
    rm $pwd/$fichier
    #cp $pwd/child/$child/$fichier $pwd/$fichier
    if [ -f "$pwd/child/$child/$fichier" ] ; then
        echo "Child Use !"
        ln $pwd/child/$child/$fichier $pwd/$fichier
    else 
        echo "Default Use !"
        ln $pwd/child/default/$fichier $pwd/$fichier
    fi
    echo "RewriteCond %{DOCUMENT_ROOT}/child/%{HTTP_HOST}/$fichier -f" >> $htaccess
    echo "RewriteRule ^$fichier$ child/%{HTTP_HOST}/$fichier [NC,QSA]" >> $htaccess
done

