LeLA - Lecture en Ligne Anesis - Anesis Online Reader
===
[![LICENSE](https://img.shields.io/badge/license-CC0-blue.svg)](LICENSE.md)

**[LeLA sur la HHH (NSFW)](https://lel.hhh-world.com/)**

Documentation
===

Code source de LeLA, la Lecture en Ligne officielle de la team de scantrad Hardcore Hentai Headquarter.
Les images doivent être placées dans le dossier `volumes/Nom de la Série/`, les miniatures de 150px de long dans `volumes/Nom de la Série/mini/`
Le script hhh-lel.sh permet une semi-automatisation en utilisant le fichier zip: il décompresse la release et crée automatiquement les miniatures.
Utilisation: `hhh-lel.sh release.zip /dossier/de/la/lel/volumes/Nom de la Série`

Source code of LeLA, the official Online Reader of the Hardcore Hentai Headquarter scanlation team.
Pictures must be placed in the `volumes/Serie Name/` folder, it's 150px long miniatures in `volumes/Serie Name/mini/`
The hhh-lel.sh script ca be used as a semi-automation by using the release zip file: it unzip the release and create automatically it's miniatures.
Usage: `hhh-lel.sh release.zip /folder/of/online/reader/volumes/Serie Name`

ToDo
===

 * Frontend
   * Menu plus simple et complet
   * Gestion de téléchargement (via HTML5 FileSystem API ou IndexedDB storage selon le navigateur)
   * Page "À propos"
 * Backend
   * Gestion de comptes
   * Gestion de releases
   * Gestion de miniatures
   * Gestion de chapitres
   * Boite à erreurs

Changelog
===

 * Version 0.1
   * Import initial sur GitHub

License
===

Les projets Anesis-HHH sont, sauf si spécifié, distribués sous la licence Creative Common Zero.
Pour plus d'informations, veuillez vous reporter au fichier LICENSE.md.

Unless specified, all Anesis-HHH projects are released under the Creative Common Zero license.
For further informations, please look at the LICENSE.md file.
