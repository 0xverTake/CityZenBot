# Script de déploiement vers Raspberry Pi
# Usage: .\deploy-to-pi.ps1

param(
    [string]$PiHost = "",
    [string]$PiUser = "",
    [string]$PiPassword = "",
    [string]$RemotePath = "/home/trn/CityZenBot"
)

Write-Host "🚀 Déploiement du bot CityZen vers Raspberry Pi..." -ForegroundColor Green
Write-Host "📡 Cible: $PiUser@$PiHost:$RemotePath" -ForegroundColor Cyan

# Vérifier si pscp (PuTTY SCP) est disponible
$pscpPath = Get-Command pscp -ErrorAction SilentlyContinue
if (-not $pscpPath) {
    Write-Host "❌ pscp (PuTTY SCP) n'est pas installé." -ForegroundColor Red
    Write-Host "💡 Veuillez installer PuTTY ou utiliser le script Bash avec WSL." -ForegroundColor Yellow
    Write-Host "💡 Téléchargement PuTTY: https://www.putty.org/" -ForegroundColor Yellow
    exit 1
}

# Créer le répertoire distant si nécessaire
Write-Host "📁 Création du répertoire distant..." -ForegroundColor Yellow
$createDirCommand = "mkdir -p $RemotePath && cd $RemotePath"
echo "y" | plink -ssh -pw $PiPassword $PiUser@$PiHost $createDirCommand

if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Attention: Impossible de créer le répertoire distant" -ForegroundColor Yellow
}

# Liste des fichiers et dossiers à exclure
$excludePatterns = @(
    "node_modules",
    ".git",
    "*.log",
    "bot.db",
    "deploy-to-pi.*",
    ".env"
)

# Créer un fichier temporaire avec la liste des fichiers à transférer
$tempFileList = "temp_file_list.txt"
Get-ChildItem -Recurse -File | Where-Object {
    $file = $_
    $shouldExclude = $false
    foreach ($pattern in $excludePatterns) {
        if ($file.FullName -like "*$pattern*") {
            $shouldExclude = $true
            break
        }
    }
    return -not $shouldExclude
} | ForEach-Object { $_.FullName } | Out-File -FilePath $tempFileList -Encoding UTF8

# Transférer les fichiers principaux
Write-Host "📦 Transfert des fichiers..." -ForegroundColor Yellow

# Transférer package.json en premier
Write-Host "  📄 package.json..." -ForegroundColor Gray
pscp -pw $PiPassword package.json "$PiUser@$PiHost`:$RemotePath/"

# Transférer les fichiers de configuration
Write-Host "  ⚙️  Fichiers de configuration..." -ForegroundColor Gray
pscp -pw $PiPassword .env.example "$PiUser@$PiHost`:$RemotePath/"
pscp -pw $PiPassword .env.pi "$PiUser@$PiHost`:$RemotePath/.env"
pscp -pw $PiPassword .gitignore "$PiUser@$PiHost`:$RemotePath/"

# Transférer les scripts
Write-Host "  🔧 Scripts..." -ForegroundColor Gray
pscp -pw $PiPassword start.sh "$PiUser@$PiHost`:$RemotePath/"
pscp -pw $PiPassword test.js "$PiUser@$PiHost`:$RemotePath/"
pscp -pw $PiPassword deploy-commands.js "$PiUser@$PiHost`:$RemotePath/"

# Transférer la documentation
Write-Host "  📚 Documentation..." -ForegroundColor Gray
pscp -pw $PiPassword *.md "$PiUser@$PiHost`:$RemotePath/"
pscp -pw $PiPassword LICENSE "$PiUser@$PiHost`:$RemotePath/"

# Transférer le dossier src
Write-Host "  💻 Code source..." -ForegroundColor Gray
pscp -r -pw $PiPassword src "$PiUser@$PiHost`:$RemotePath/"

# Nettoyer le fichier temporaire
Remove-Item $tempFileList -ErrorAction SilentlyContinue

# Installer les dépendances sur le Pi
Write-Host "📥 Installation des dépendances sur le Pi..." -ForegroundColor Yellow
$installCommand = "cd $RemotePath && npm install --production"
echo "y" | plink -ssh -pw $PiPassword $PiUser@$PiHost $installCommand

# Rendre le script start.sh exécutable
Write-Host "🔐 Configuration des permissions..." -ForegroundColor Yellow
$chmodCommand = "cd $RemotePath && chmod +x start.sh"
echo "y" | plink -ssh -pw $PiPassword $PiUser@$PiHost $chmodCommand

# Test de connectivité
Write-Host "🧪 Test de l'installation..." -ForegroundColor Yellow
$testCommand = "cd $RemotePath && node test.js"
echo "y" | plink -ssh -pw $PiPassword $PiUser@$PiHost $testCommand

Write-Host "" -ForegroundColor White
Write-Host "✅ Déploiement terminé!" -ForegroundColor Green
Write-Host "🎯 Le bot est maintenant installé sur votre Raspberry Pi" -ForegroundColor Cyan
Write-Host "" -ForegroundColor White
Write-Host "📋 Prochaines étapes:" -ForegroundColor Yellow
Write-Host "   1. Connectez-vous au Pi: ssh $PiUser@$PiHost" -ForegroundColor White
Write-Host "   2. Allez dans le dossier: cd $RemotePath" -ForegroundColor White
Write-Host "   3. Configurez le .env avec votre token Discord" -ForegroundColor White
Write-Host "   4. Déployez les commandes: node deploy-commands.js" -ForegroundColor White
Write-Host "   5. Démarrez le bot: ./start.sh" -ForegroundColor White
Write-Host "" -ForegroundColor White
Write-Host "💡 Pour un démarrage automatique, consultez RASPBERRY_PI.md" -ForegroundColor Cyan
