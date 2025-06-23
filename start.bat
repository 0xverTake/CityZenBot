@echo off
echo Démarrage du bot Star Citizen Discord...

REM Vérifier si Node.js est installé
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERREUR: Node.js n'est pas installé ou n'est pas dans le PATH
    echo Veuillez installer Node.js depuis https://nodejs.org/
    pause
    exit /b 1
)

REM Vérifier si le fichier .env existe
if not exist .env (
    echo ERREUR: Fichier .env non trouvé
    echo Copiez .env.example vers .env et configurez vos tokens
    pause
    exit /b 1
)

REM Installer les dépendances si nécessaire
if not exist node_modules (
    echo Installation des dépendances...
    npm install
)

REM Déployer les commandes slash
echo Déploiement des commandes slash...
node deploy-commands.js

REM Démarrer le bot
echo Démarrage du bot...
npm start

pause
