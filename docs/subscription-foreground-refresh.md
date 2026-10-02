# Rafraîchissement des droits au premier plan — Vasco Admin US-013

## Comportement

Le retour de l’application depuis l’arrière-plan déclenchait déjà une
synchronisation du token de notification par `POST /auth/session`. Le résultat
`subscription` était ignoré : un cadeau administratif ou une révocation pouvait
donc rester invisible jusqu’à une autre actualisation du profil.

`useForegroundSubscriptionSync` réutilise cet appel, sans requête supplémentaire.
Il met à jour uniquement l’abonnement du profil courant lorsque la valeur change,
puis invalide les requêtes actives pour rafraîchir notamment les groupes et vues
Premium. Le backend reste l’autorité pour toute action protégée.

- Appel seulement pour une identité connectée et vérifiée.
- Une seule synchronisation en vol ; événements `active` répétés ignorés.
- Réponse ignorée si la session a changé ou si le hook a été démonté.
- Échec réseau : dernière valeur conservée, sans message de réussite ni nouveau
  droit supposé ; reprise lors d’un prochain retour au premier plan.
- Aucun token, email ou contenu du profil dans la trace technique minimale.

Le parcours de démarrage, Firebase et les contrats historiques ne changent pas.
Cette modification ne nécessite aucun endpoint administratif dans le mobile.

## Vérifications

Quatre tests automatisés passent : attribution, révocation, réseau indisponible,
réponse après déconnexion. `npm run typecheck` passe.

À effectuer sur binaires candidats iOS **et** Android : mettre l’application en
arrière-plan, attribuer/prolonger/révoquer un cadeau depuis l’admin sur un compte
de recette autorisé, revenir au premier plan et vérifier profil, statistiques,
groupes et refus serveur des actions devenues interdites. Vérifier également le
retour hors ligne puis le rétablissement réseau. Ces recettes ne sont pas déclarées
réalisées. Aucun binaire, OTA ou déploiement de production n’a été publié.
