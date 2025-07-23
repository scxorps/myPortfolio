# 📘 Guide de Déploiement GitHub - MyPortfolio

## 🚀 Étapes pour créer votre repository GitHub

### 1. Préparation des fichiers

Votre portfolio est maintenant prêt avec :
- ✅ Nom changé de "simplefolio" à "myportfolio"
- ✅ Informations personnelles mises à jour
- ✅ Workflow GitHub Actions configuré
- ✅ README personnalisé
- ✅ Licence MIT mise à jour

### 2. Création du repository sur GitHub

1. **Allez sur [GitHub.com](https://github.com)**
2. **Cliquez sur le bouton "New repository"** (bouton vert)
3. **Remplissez les informations :**
   - Repository name: `myportfolio`
   - Description: `Portfolio personnel - Mehadji Mohamed El Habib`
   - ☑️ Public (pour GitHub Pages gratuit)
   - ❌ Ne pas initialiser avec README (on a déjà le nôtre)
   - ❌ Ne pas ajouter .gitignore (on a déjà le nôtre)
   - ❌ Ne pas ajouter de licence (on a déjà la nôtre)

4. **Cliquez sur "Create repository"**

### 3. Connexion du dossier local au repository

Dans votre terminal, dans le dossier du portfolio :

```bash
# Initialiser Git (si pas déjà fait)
git init

# Ajouter tous les fichiers
git add .

# Premier commit
git commit -m "🎉 Initial commit: Mon Portfolio - Mehadji Mohamed El Habib"

# Connecter au repository GitHub
git remote add origin https://github.com/scxorps/myportfolio.git

# Renommer la branche principale
git branch -M main

# Pousser vers GitHub
git push -u origin main
```

### 4. Activation GitHub Pages

1. **Dans votre repository GitHub, allez dans "Settings"**
2. **Scrollez jusqu'à "Pages" dans la sidebar gauche**
3. **Dans "Source", sélectionnez "GitHub Actions"**
4. **Cliquez sur "Save"**

### 5. Attendre le déploiement

- Le workflow se lance automatiquement
- Attendez quelques minutes que le build se termine
- Votre portfolio sera disponible sur : `https://scxorps.github.io/myportfolio`

## 🔧 Personnalisation finale

### Mettre à jour les URLs dans package.json

Après avoir créé le repository, mettez à jour :

```json
{
  "repository": {
    "url": "git+https://github.com/scxorps/myportfolio"
  },
  "bugs": {
    "url": "https://github.com/scxorps/myportfolio/issues"
  },
  "homepage": "https://scxorps.github.io/myportfolio"
}
```

### Variables à remplacer

✅ **Déjà fait !** Toutes les URLs ont été mises à jour avec votre GitHub `scxorps`

## 📝 Commandes utiles pour la suite

```bash
# Voir le statut des fichiers
git status

# Ajouter des modifications
git add .
git commit -m "✨ Description de vos changements"
git push

# Voir l'historique
git log --oneline

# Créer une nouvelle branche pour des expérimentations
git checkout -b nouvelle-fonctionnalite
```

## 🎯 Résultat final

Votre portfolio sera disponible publiquement sur :
`https://scxorps.github.io/myportfolio`

## 🆘 Dépannage

### Si le déploiement échoue :
1. Vérifiez les Actions dans l'onglet "Actions" de votre repository
2. Assurez-vous que GitHub Pages est activé
3. Vérifiez que le workflow a les bonnes permissions

### Si vous voulez forcer un redéploiement :
```bash
git commit --allow-empty -m "🔄 Force redeploy"
git push
```

Votre portfolio est maintenant prêt pour GitHub ! 🎉
