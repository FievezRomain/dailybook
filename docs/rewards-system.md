# Système de récompenses

Le nom affiché de la monnaie est défini uniquement dans les fichiers
translation/fr/rewards.json et translation/en/rewards.json. Le code et l’API
utilisent des noms neutres Reward et rewards. Changer « Pattounes » ne nécessite
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
| Événement terminé | 10 | Passage d’un état non terminé à terminé, à une date non future |
| Suivi de soin renseigné | 15 | Soin ou rendez-vous terminé avec commentaire, note ou traitement |
| Mesure enregistrée | 8 | Poids ou taille strictement positif, maximum deux par semaine et par animal |
| Étape d’objectif terminée | 10 | Passage de la sous-étape de non terminée à terminée |
| Objectif terminé | 40 | Toutes les sous-étapes deviennent terminées |
| Bilan hebdomadaire | 20 | Deux types de suivi vérifiés dans la semaine, puis validation explicite du bilan |

Le backend conserve le montant et la version de règle dans un ledger immuable.
L’unicité par utilisateur, action et source rend les retries idempotents. Les
annulations futures devront écrire une transaction compensatoire et ne jamais
modifier l’historique.

## Interface

Le solde est visible dans la top bar à côté des notifications. Le hub contient
le récapitulatif, le niveau, les actions encore récompensables sur le compte,
l’historique et la boutique. Cette liste vient du résumé serveur : le mobile ne
recalcule ni les quotas ni l’éligibilité à partir de données locales. La boutique reste vide
tant qu’aucune récompense complète et finançable n’a été validée par le produit ;
aucun accès Premium partiel n’est simulé.

Les niveaux sont Compagnon (0), Attentionné (500), Protecteur (1500) et Gardien
(3500). Ils sont calculés sur le total gagné, pas sur le solde dépensable.
