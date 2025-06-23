@echo off
REM Script de gestion tout-en-un pour CityZenBot
REM Usage: manage.bat [action]

setlocal EnableDelayedExpansion

echo.
echo ============================================
echo     🚀 CityZenBot Management Tool 🚀
echo ============================================
echo.

REM Vérifier si Node.js est installé
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js n'est pas installé ou pas dans le PATH
    echo 💡 Téléchargez Node.js sur https://nodejs.org/
    pause
    exit /b 1
)

REM Vérifier si nous sommes dans le bon répertoire
if not exist "package.json" (
    echo ❌ Ce script doit être exécuté depuis le répertoire du projet CityZenBot
    pause
    exit /b 1
)

REM Fonction pour afficher le menu
:menu
echo 🔧 Que voulez-vous faire ?
echo.
echo [1] 🏗️  Installation et configuration initiale
echo [2] 🧪 Tester le bot localement
echo [3] 🚀 Déployer sur Raspberry Pi
echo [4] 📢 Créer une présentation Discord
echo [5] 🔄 Mettre à jour les dépendances
echo [6] 📋 Déployer les commandes slash
echo [7] ▶️  Démarrer le bot
echo [8] 📊 Voir les logs
echo [9] ❓ Aide et documentation
echo [0] 🚪 Quitter
echo.
set /p choice="Votre choix (0-9): "

if "%choice%"=="1" goto install
if "%choice%"=="2" goto test
if "%choice%"=="3" goto deploy
if "%choice%"=="4" goto presentation
if "%choice%"=="5" goto update
if "%choice%"=="6" goto commands
if "%choice%"=="7" goto start
if "%choice%"=="8" goto logs
if "%choice%"=="9" goto help
if "%choice%"=="0" goto exit
echo ❌ Choix invalide
goto menu

:install
echo.
echo 🏗️  Installation et configuration...
echo.

REM Installer les dépendances
echo 📦 Installation des dépendances Node.js...
call npm install
if %errorlevel% neq 0 (
    echo ❌ Échec de l'installation des dépendances
    pause
    goto menu
)

REM Créer le fichier .env si nécessaire
if not exist ".env" (
    echo ⚙️  Création du fichier de configuration...
    copy ".env.example" ".env"
    echo.
    echo ⚠️  IMPORTANT : Configurez votre .env avec :
    echo    - DISCORD_TOKEN : Token de votre bot Discord
    echo    - GUILD_ID : ID de votre serveur Discord
    echo.
    echo 📝 Ouvrir le fichier .env maintenant ? (O/n)
    set /p openenv=
    if /i "!openenv!"=="O" (
        notepad .env
    ) else if /i "!openenv!"=="" (
        notepad .env
    )
)

REM Créer les répertoires nécessaires
if not exist "database" mkdir database
if not exist "logs" mkdir logs

echo ✅ Installation terminée !
echo.
pause
goto menu

:test
echo.
echo 🧪 Test du bot...
echo.
call node test.js
echo.
pause
goto menu

:deploy
echo.
echo 🚀 Déploiement sur Raspberry Pi...
echo.
echo Choisissez votre méthode :
echo [1] PowerShell (Windows)
echo [2] WSL/Bash (Linux)
set /p deploymethod="Méthode (1-2): "

if "%deploymethod%"=="1" (
    call powershell -ExecutionPolicy Bypass -File deploy-to-pi.ps1
) else if "%deploymethod%"=="2" (
    bash deploy-to-pi.sh --auto
) else (
    echo ❌ Méthode invalide
)
echo.
pause
goto menu

:presentation
echo.
echo 📢 Création de présentation Discord...
echo.
echo Choisissez le type de présentation :
echo [1] Embed (recommandé)
echo [2] Message complet
echo [3] Message court
echo [4] Afficher les messages à copier-coller
set /p prestype="Type (1-4): "

if "%prestype%"=="1" (
    call node post-presentation.js embed bot
) else if "%prestype%"=="2" (
    call node post-presentation.js full bot
) else if "%prestype%"=="3" (
    call node post-presentation.js short bot
) else if "%prestype%"=="4" (
    echo.
    echo 📋 Consultez le fichier discord-presentation.md pour les messages à copier-coller
    start discord-presentation.md
) else (
    echo ❌ Type invalide
)
echo.
pause
goto menu

:update
echo.
echo 🔄 Mise à jour des dépendances...
echo.
call npm update
call npm audit fix
echo ✅ Mise à jour terminée !
echo.
pause
goto menu

:commands
echo.
echo 📋 Déploiement des commandes slash...
echo.
call node deploy-commands.js
echo.
pause
goto menu

:start
echo.
echo ▶️  Démarrage du bot...
echo.
echo Choisissez le mode :
echo [1] Mode normal
echo [2] Mode développement (avec logs détaillés)
echo [3] Mode production
set /p startmode="Mode (1-3): "

if "%startmode%"=="1" (
    call node src/index.js
) else if "%startmode%"=="2" (
    set NODE_ENV=development
    call node src/index.js
) else if "%startmode%"=="3" (
    set NODE_ENV=production
    call node src/index.js
) else (
    echo ❌ Mode invalide
    goto menu
)
echo.
pause
goto menu

:logs
echo.
echo 📊 Affichage des logs...
echo.
if exist "logs" (
    echo Fichiers de logs disponibles :
    dir /b logs\*.log
    echo.
    echo Tapez le nom du fichier à afficher (sans extension) :
    set /p logfile=
    if exist "logs\!logfile!.log" (
        type "logs\!logfile!.log" | more
    ) else (
        echo ❌ Fichier de log introuvable
    )
) else (
    echo ℹ️  Aucun fichier de log trouvé
    echo Le dossier logs sera créé au premier démarrage du bot
)
echo.
pause
goto menu

:help
echo.
echo ❓ Aide et documentation
echo.
echo 📚 Documentation disponible :
echo.
if exist "README.md" echo    📄 README.md - Guide principal
if exist "INSTALLATION.md" echo    📄 INSTALLATION.md - Guide d'installation
if exist "CONFIGURATION.md" echo    📄 CONFIGURATION.md - Guide de configuration
if exist "RASPBERRY_PI.md" echo    📄 RASPBERRY_PI.md - Guide Raspberry Pi
if exist "DEPLOYMENT_GUIDE.md" echo    📄 DEPLOYMENT_GUIDE.md - Guide de déploiement
if exist "discord-presentation.md" echo    📄 discord-presentation.md - Présentations Discord
echo.
echo Ouvrir un fichier de documentation ? (tapez le nom ou appuyez sur Entrée pour continuer)
set /p docfile=
if not "%docfile%"=="" (
    if exist "%docfile%" (
        start %docfile%
    ) else (
        echo ❌ Fichier non trouvé
    )
)
echo.
pause
goto menu

:exit
echo.
echo 👋 Merci d'avoir utilisé CityZenBot Management Tool !
echo.
echo 🌌 May the verse be with you, Citizen!
echo.
pause
exit /b 0
