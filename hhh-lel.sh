#!/bin/bash
zip = $1
out = $2
# on v�rifie que l'archive existe
if [ ! -f $zip ]
then
    echo archive inexistante
    exit 3
fi
# on v�rifie que le dossier n'existe pas d�j�
if [ -f $out ]
then
    echo le dossier existe deja
    exit 4
fi
# c'est parti pour le d�zippage
unzip -j $zip -d $out
# maintenant, c'est au tour des miniatures � �tre cr��es
cd $out
for i in *.jpg *.JPG *.png *.PNG; do
convert $i -thumbnail 150x -quality 85 -scene 01 mini/$i
done
fi
