# Identifiants de Test - Stilles Auto Frontend

## Mode Développement (Sans Backend)

En développement, les authentifications sont gérées en frontend avec des données mockées.

### Comptes Prédéfinis

#### 👤 Compte Utilisateur Standard
- **Email:** `user@example.com`
- **Mot de passe:** `password123`
- **Rôle:** USER

#### 🔐 Compte Administrateur
- **Email:** `admin@stillesauto.com`
- **Mot de passe:** `admin123`
- **Rôle:** ADMIN

---

## Comment Se Connecter

### 1. **Connexion avec un compte existant**
   - Allez sur `/auth/login`
   - Utilisez l'un des identifiants ci-dessus
   - Vous serez redirigé vers `/dashboard` (USER) ou `/admin` (ADMIN)

### 2. **Créer un nouveau compte**
   - Allez sur `/auth/register`
   - Remplissez le formulaire
   - Le compte sera créé localement (stocké en localStorage)
   - Un code OTP vous sera demandé (entrez n'importe quel code à 6 chiffres)
   - Vous serez redirigé vers `/dashboard`

---

## Pages Accessibles

### Pour les Utilisateurs Non Connectés
- `/` - Page d'accueil
- `/auth/login` - Connexion
- `/auth/register` - Inscription
- `/auth/forgot-password` - Réinitialisation
- `/vehicles` - Liste des véhicules publics
- `/accessories` - Liste des accessoires publics
- `/about`, `/contact` - Pages statiques

### Pour les Utilisateurs Connectés
- `/dashboard` - Tableau de bord utilisateur
- `/dashboard/profile` - Profil utilisateur
- `/dashboard/favorites` - Favoris
- `/dashboard/orders` - Mes commandes
- `/dashboard/notifications` - Notifications
- `/cart` - Panier
- `/checkout` - Paiement

### Pour les Administrateurs
- `/admin` - Dashboard admin
- `/admin/vehicles` - Gestion des véhicules
- `/admin/vehicles/new` - Ajouter un véhicule
- `/admin/accessories` - Gestion des accessoires
- `/admin/reviews` - Modération des avis
- `/admin/users` - Gestion des utilisateurs
- `/admin/analytics` - Analytiques

---

## Notes de Développement

- Les données d'authentification sont stockées en **localStorage**
- Les utilisateurs créés via le formulaire d'inscription sont sauvegardés localement
- Chaque actualisation de page conserve l'authentification (tokens en localStorage)
- Pour réinitialiser les données: <br>
  ```javascript
  // Dans la console du navigateur:
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('registered_users');
  ```

---

## Configuration Futur Backend

Quand vous connecterez le backend:

1. Modifiez `process.env.NEXT_PUBLIC_API_URL` pour pointer vers votre API
2. Les appels API utiliseront alors le vrai backend
3. La structure de données reste compatible

Fichier à modifier: `lib/api.ts` - remplacer les mock returns par des appels `fetchWithAuth()`
