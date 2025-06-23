#!/bin/bash
# Script de déploiement du CityZenBot vers Raspberry Pi
# Usage: ./deploy-to-pi.sh

# Configuration par défaut
PI_HOST="${PI_HOST:-192.168.0.181}"
PI_USER="${PI_USER:-trn}"
PI_PASSWORD="${PI_PASSWORD:-2025}"
REMOTE_DIR="${REMOTE_DIR:-/home/trn/CityZenBot}"

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Déploiement du CityZenBot vers le Raspberry Pi${NC}"
echo -e "${YELLOW}Host: $PI_USER@$PI_HOST${NC}"
echo -e "${YELLOW}Répertoire distant: $REMOTE_DIR${NC}"

# Vérifier que nous sommes dans le bon répertoire
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Erreur: Ce script doit être exécuté depuis le répertoire du projet CityZenBot${NC}"
    exit 1
fi

# Fonction pour exécuter des commandes SSH
run_ssh_command() {
    local command="$1"
    local description="$2"
    
    echo -e "${CYAN}🔧 $description${NC}"
    
    sshpass -p "$PI_PASSWORD" ssh -o StrictHostKeyChecking=no "$PI_USER@$PI_HOST" "$command"
    local exit_code=$?
    
    if [ $exit_code -eq 0 ]; then
        echo -e "${GREEN}✅ $description - Succès${NC}"
    else
        echo -e "${YELLOW}⚠️ $description - Avertissement (code: $exit_code)${NC}"
    fi
    
    return $exit_code
}

# Fonction pour vérifier les dépendances
check_dependencies() {
    echo -e "${CYAN}🔍 Vérification des dépendances...${NC}"
    
    # Vérifier sshpass
    if ! command -v sshpass &> /dev/null; then
        echo -e "${RED}❌ sshpass n'est pas installé${NC}"
        echo -e "${YELLOW}Installation: sudo apt-get install sshpass (Ubuntu/Debian)${NC}"
        echo -e "${YELLOW}Installation: brew install sshpass (macOS)${NC}"
        return 1
    fi
    
    # Vérifier rsync
    if ! command -v rsync &> /dev/null; then
        echo -e "${RED}❌ rsync n'est pas installé${NC}"
        echo -e "${YELLOW}Installation: sudo apt-get install rsync${NC}"
        return 1
    fi
    
    echo -e "${GREEN}✅ Toutes les dépendances sont présentes${NC}"
    return 0
}

# Fonction pour transférer les fichiers
transfer_files() {
    echo -e "${CYAN}📤 Transfert des fichiers vers le Raspberry Pi...${NC}"
    
    # Créer le répertoire distant
    run_ssh_command "mkdir -p $REMOTE_DIR" "Création du répertoire distant"
    
    # Utiliser rsync pour transférer les fichiers avec exclusions
    echo -e "${CYAN}📦 Synchronisation des fichiers...${NC}"
    
    sshpass -p "$PI_PASSWORD" rsync -avz --progress \
        --exclude='node_modules/' \
        --exclude='.git/' \
        --exclude='*.log' \
        --exclude='bot.db' \
        --exclude='database.db' \
        --exclude='.env' \
        --exclude='deploy-to-pi.*' \
        --exclude='*.tmp' \
        --exclude='*.temp' \
        -e "ssh -o StrictHostKeyChecking=no" \
        ./ "$PI_USER@$PI_HOST:$REMOTE_DIR/"
    
    local exit_code=$?
    
    if [ $exit_code -eq 0 ]; then
        echo -e "${GREEN}✅ Transfert des fichiers - Succès${NC}"
        return 0
    else
        echo -e "${RED}❌ Transfert des fichiers - Échec (code: $exit_code)${NC}"
        return 1
    fi
}

# Fonction pour installer les dépendances sur le Pi
install_dependencies() {
    echo -e "${CYAN}📥 Installation des dépendances sur le Raspberry Pi...${NC}"
    
    # Mettre à jour npm si nécessaire
    run_ssh_command "cd $REMOTE_DIR && npm --version" "Vérification de npm"
    
    # Installer les dépendances
    run_ssh_command "cd $REMOTE_DIR && npm install --production" "Installation des dépendances Node.js"
    
    return $?
}

# Fonction pour configurer l'environnement
configure_environment() {
    echo -e "${CYAN}⚙️ Configuration de l'environnement...${NC}"
    
    # Copier le fichier de configuration pour Pi
    run_ssh_command "cd $REMOTE_DIR && cp .env.pi .env" "Configuration du fichier .env"
    
    # Rendre les scripts exécutables
    run_ssh_command "cd $REMOTE_DIR && chmod +x start.sh" "Configuration des permissions"
    
    return $?
}

# Fonction pour tester l'installation
test_installation() {
    echo -e "${CYAN}🧪 Test de l'installation...${NC}"
    
    # Tester la configuration
    run_ssh_command "cd $REMOTE_DIR && node test.js" "Test de l'installation"
    
    return $?
}

# Fonction pour afficher les instructions post-déploiement
show_instructions() {
    echo -e ""
    echo -e "${GREEN}🎉 Déploiement terminé avec succès!${NC}"
    echo -e "${CYAN}Vous pouvez maintenant vous connecter au Pi et démarrer le bot:${NC}"
    echo -e ""
    echo -e "${YELLOW}📋 Prochaines étapes:${NC}"
    echo -e "   ${WHITE}1. ssh $PI_USER@$PI_HOST${NC}"
    echo -e "   ${WHITE}2. cd $REMOTE_DIR${NC}"
    echo -e "   ${WHITE}3. nano .env${NC} ${CYAN}(configurez votre token Discord)${NC}"
    echo -e "   ${WHITE}4. node deploy-commands.js${NC} ${CYAN}(déployez les commandes slash)${NC}"
    echo -e "   ${WHITE}5. ./start.sh${NC} ${CYAN}(démarrez le bot)${NC}"
    echo -e ""
    echo -e "${CYAN}💡 Pour un démarrage automatique, consultez RASPBERRY_PI.md${NC}"
    echo -e ""
}

# Menu principal
show_menu() {
    echo -e "${BLUE}🔧 Options de déploiement:${NC}"
    echo -e "1) Déploiement complet (recommandé)"
    echo -e "2) Transfert de fichiers uniquement"
    echo -e "3) Installation des dépendances uniquement"
    echo -e "4) Test de l'installation"
    echo -e "5) Quitter"
    echo -e ""
    read -p "Choisissez une option (1-5): " choice
    
    case $choice in
        1)
            echo -e "${GREEN}🚀 Démarrage du déploiement complet...${NC}"
            full_deployment
            ;;
        2)
            echo -e "${GREEN}📤 Transfert des fichiers uniquement...${NC}"
            transfer_files
            ;;
        3)
            echo -e "${GREEN}📥 Installation des dépendances uniquement...${NC}"
            install_dependencies
            ;;
        4)
            echo -e "${GREEN}🧪 Test de l'installation...${NC}"
            test_installation
            ;;
        5)
            echo -e "${YELLOW}👋 Au revoir!${NC}"
            exit 0
            ;;
        *)
            echo -e "${RED}❌ Option invalide${NC}"
            show_menu
            ;;
    esac
}

# Fonction de déploiement complet
full_deployment() {
    echo -e "${GREEN}🔄 Début du déploiement complet...${NC}"
    
    # Vérifier les dépendances
    if ! check_dependencies; then
        echo -e "${RED}❌ Dépendances manquantes. Arrêt du déploiement.${NC}"
        exit 1
    fi
    
    # Transférer les fichiers
    if ! transfer_files; then
        echo -e "${RED}❌ Échec du transfert de fichiers${NC}"
        exit 1
    fi
    
    # Installer les dépendances
    if ! install_dependencies; then
        echo -e "${YELLOW}⚠️ Problème lors de l'installation des dépendances${NC}"
    fi
    
    # Configurer l'environnement
    if ! configure_environment; then
        echo -e "${YELLOW}⚠️ Problème lors de la configuration${NC}"
    fi
    
    # Tester l'installation
    if ! test_installation; then
        echo -e "${YELLOW}⚠️ Problème lors du test${NC}"
    fi
    
    # Afficher les instructions
    show_instructions
}

# Point d'entrée principal
main() {
    # Vérifier les arguments
    if [ "$1" = "--auto" ] || [ "$1" = "-a" ]; then
        full_deployment
    elif [ "$1" = "--help" ] || [ "$1" = "-h" ]; then
        echo -e "${BLUE}Usage: $0 [options]${NC}"
        echo -e ""
        echo -e "${YELLOW}Options:${NC}"
        echo -e "  -a, --auto    Déploiement automatique complet"
        echo -e "  -h, --help    Afficher cette aide"
        echo -e ""
        echo -e "${YELLOW}Variables d'environnement:${NC}"
        echo -e "  PI_HOST       Adresse IP du Raspberry Pi (défaut: 192.168.0.181)"
        echo -e "  PI_USER       Nom d'utilisateur (défaut: trn)"
        echo -e "  PI_PASSWORD   Mot de passe (défaut: 2025)"
        echo -e "  REMOTE_DIR    Répertoire distant (défaut: /home/trn/CityZenBot)"
        echo -e ""
        echo -e "${CYAN}Exemple:${NC}"
        echo -e "  PI_HOST=192.168.1.100 PI_USER=pi ./deploy-to-pi.sh --auto"
    else
        show_menu
    fi
}

# Exécuter le script principal
main "$@"
