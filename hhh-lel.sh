#!/bin/bash
zip = $1
out = $2
# on vérifie que l'archive existe
if [ ! -f $zip ]
then
    echo archive inexistante
    exit 3
fi
# on vérifie que le dossier n'existe pas déjà
if [ -f $out ]
then
    echo le dossier existe deja
    exit 4
fi
# c'est parti pour le dézippage
unzip -j $zip -d $out
# maintenant, c'est au tour des miniatures à être créées
cd $out
for i in *.jpg *.JPG *.png *.PNG; do
convert $i -thumbnail 150x -quality 85 -scene 01 mini/$i
done
fi
