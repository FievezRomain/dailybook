# Système de récompenses

Le nom affiché de la monnaie est défini uniquement dans les fichiers
translation/fr/rewards.json et translation/en/rewards.json. Le code et l’API
utilisent des noms neutres Reward et rewards. Changer « Vascor » ne nécessite
donc aucune migration ni modification métier.

## Attribution

Le mobile et le web envoient uniquement la mutation métier normale. Le backend
évalue l’éligibilité dans la même transaction de base de données et renvoie les
gains dans le tableau racine rewards. Le client ne demande jamais séparément si
une action mérite des points.

L’unique appel spécifique est POST /rewards/check-ins/daily, déclenché une fois
à l’ouverture d’une session applicative. Le backend garantit une seule attribution
par jour local de l’utilisateur.

| Action vérifiée par le serveur | Gain | Définition |
| --- | ---: | --- |
| Ouverture quotidienne | 2 | Première ouverture du jour dans le fuseau enregistré |
| Profil animal complété | 50 | Nom, espèce, sexe et date de naissance présents |
| Événement créé | 5 | Création réussie d’un événement ou d’une série |
| Événement terminé | 10 | Passage d’un état non terminé à terminé, à une date non future |
| Suivi de soin renseigné | 15 | Soin ou rendez-vous terminé avec commentaire, note ou traitement |
| Mesure enregistrée | 8 | Poids ou taille strictement positif, maximum deux par semaine et par animal |
| Photo d’évolution ajoutée | 12 | Première photo physique du mois pour un animal ; fonctionnalité Premium |
| Étape d’objectif terminée | 10 | Passage de la sous-étape de non terminée à terminée |
| Objectif terminé | 40 | Toutes les sous-étapes deviennent terminées |

Un boost est sélectionné de manière déterministe pour chaque période locale :

- jour : création ou fin d’événement, ou suivi de soin, avec +5 ;
- semaine : étape d’objectif, objectif ou profil animal, avec +10 ;
- mois : mesure ou photo d’évolution, avec +15.

La photo d’évolution reste visible pour un compte gratuit mais le boost est
verrouillé Premium. Le bonus n’est attribué qu’une fois par période, sous forme
d’une transaction distincte. Un abonnement Premium ajoute aussi 10 % au gain
habituel de chaque action, arrondi à l’entier supérieur.

Le backend conserve le montant et la version de règle dans un ledger immuable.
L’unicité par utilisateur, action et source rend les retries idempotents. Les
annulations futures devront écrire une transaction compensatoire et ne jamais
modifier l’historique.

## Interface

Le solde est visible dans la top bar à côté des notifications. Le hub commence
par un tableau de progression commun, puis sépare la consultation en quatre
espaces : Défis, Grades, Activité et Boutique. Les boosts du jour, de la semaine
et du mois sont présentés comme des missions prioritaires ; les autres actions
encore récompensables viennent ensuite. Ces données viennent du résumé serveur :
le mobile ne recalcule ni les quotas ni l’éligibilité à partir de données
locales. L’historique n’est chargé qu’à l’ouverture de l’onglet Activité. La
boutique reste vide tant qu’aucune récompense complète et finançable n’a été
validée par le produit ; aucun accès Premium partiel n’est simulé.

Le signe Vascor est une pièce ancienne forgée dans un or passé accordé aux tons
chauds de Vasco : tranche sombre, double frappe, lumière directionnelle, patine
et traces d’oxydation discrètes. Le logo cheval officiel est repris depuis
assets/logo.png et superposé en deux tons pour simuler une gravure dans le métal.
La face reste volontairement dégagée autour du cheval.
Son anneau représente la progression entre le seuil du grade actuel et celui du
grade suivant. Lors d’un gain, l’emblème et le compteur changent temporairement
de couleur, grandissent, puis reviennent à leur état initial pendant que le solde
s’incrémente. Les gains multiples sont joués dans l’ordre et la réduction des
animations du système ou de l’application est respectée.

Les niveaux sont Compagnon (0), Attentionné (500), Protecteur (1500) et Gardien
(3500). Ils sont calculés sur le total gagné, pas sur le solde dépensable. Les
quatre paliers sont directement visibles dans l’espace Grades, sans bouton
d’ouverture intermédiaire.
