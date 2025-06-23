#!/usr/bin/env node

/**
 * 🏆 FINAL RELEASE VALIDATOR - CityZenBot v2.0.0
 * 
 * Script de validation finale avant release
 * Vérifie tous les aspects critiques du bot
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🏆 VALIDATION FINALE - CityZenBot v2.0.0');
console.log('========================================\n');

let validationResults = {
    passed: 0,
    failed: 0,
    warnings: 0,
    tests: []
};

function addTest(name, status, message) {
    const result = { name, status, message };
    validationResults.tests.push(result);
    validationResults[status]++;
    
    const icon = status === 'passed' ? '✅' : status === 'failed' ? '❌' : '⚠️';
    console.log(`${icon} ${name}: ${message}`);
}

// Test 1: Structure du projet
console.log('📁 Vérification de la structure...');
const requiredFiles = [
    'package.json',
    'README.md',
    'QUICKSTART.md', 
    'src/index.js',
    'src/services/DatabaseService.js',
    'src/commands/ships/ship.js',
    'quick-setup.js',
    'check-config.js'
];

let missingFiles = [];
requiredFiles.forEach(file => {
    if (!fs.existsSync(path.join(__dirname, file))) {
        missingFiles.push(file);
    }
});

if (missingFiles.length === 0) {
    addTest('Structure', 'passed', `${requiredFiles.length} fichiers essentiels présents`);
} else {
    addTest('Structure', 'failed', `Fichiers manquants: ${missingFiles.join(', ')}`);
}

// Test 2: Package.json
console.log('\n📦 Vérification du package.json...');
try {
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    
    if (pkg.version === '2.0.0') {
        addTest('Version', 'passed', 'Version 2.0.0 confirmée');
    } else {
        addTest('Version', 'failed', `Version incorrecte: ${pkg.version}`);
    }
    
    const requiredScripts = ['start', 'test', 'setup', 'deploy'];
    const missingScripts = requiredScripts.filter(script => !pkg.scripts[script]);
    
    if (missingScripts.length === 0) {
        addTest('Scripts NPM', 'passed', `${Object.keys(pkg.scripts).length} scripts disponibles`);
    } else {
        addTest('Scripts NPM', 'failed', `Scripts manquants: ${missingScripts.join(', ')}`);
    }
    
} catch (error) {
    addTest('Package.json', 'failed', error.message);
}

// Test 3: Tests unitaires
console.log('\n🧪 Exécution des tests...');
try {
    execSync('npm test', { stdio: 'pipe', timeout: 30000 });
    addTest('Tests unitaires', 'passed', 'Tous les tests passent');
} catch (error) {
    addTest('Tests unitaires', 'failed', 'Échec des tests');
}

// Test 4: Base de données
console.log('\n💾 Diagnostic base de données...');
try {
    const output = execSync('npm run diagnose-db', { encoding: 'utf8', stdio: 'pipe' });
    if (output.includes('Base de données OK !')) {
        addTest('Base de données', 'passed', 'Diagnostic OK, toutes les tables présentes');
    } else {
        addTest('Base de données', 'warnings', 'Diagnostic partiel');
    }
} catch (error) {
    addTest('Base de données', 'failed', 'Erreur de diagnostic');
}

// Test 5: Configuration
console.log('\n⚙️ Vérification configuration...');
try {
    const output = execSync('npm run check', { encoding: 'utf8', stdio: 'pipe' });
    if (output.includes('Configuration COMPLÈTE')) {
        addTest('Configuration', 'passed', 'Configuration complète et valide');
    } else {
        addTest('Configuration', 'warnings', 'Configuration partielle');
    }
} catch (error) {
    addTest('Configuration', 'failed', 'Erreur de configuration');
}

// Test 6: Documentation
console.log('\n📚 Vérification documentation...');
const docs = [
    'README.md',
    'QUICKSTART.md',
    'CHANGELOG.md',
    'TROUBLESHOOTING.md',
    'API_DOCUMENTATION.md'
];

let docSize = 0;
let missingDocs = [];

docs.forEach(doc => {
    if (fs.existsSync(doc)) {
        docSize += fs.statSync(doc).size;
    } else {
        missingDocs.push(doc);
    }
});

if (missingDocs.length === 0 && docSize > 50000) {
    addTest('Documentation', 'passed', `${docs.length} documents, ${Math.round(docSize/1024)}KB`);
} else if (missingDocs.length > 0) {
    addTest('Documentation', 'failed', `Documents manquants: ${missingDocs.join(', ')}`);
} else {
    addTest('Documentation', 'warnings', 'Documentation légère');
}

// Test 7: Sécurité
console.log('\n🔒 Vérification sécurité...');
const sensitiveFiles = ['.env', 'config.json'];
let exposedFiles = [];

sensitiveFiles.forEach(file => {
    if (fs.existsSync(file)) {
        exposedFiles.push(file);
    }
});

if (exposedFiles.length === 0) {
    addTest('Sécurité', 'passed', 'Aucun fichier sensible exposé');
} else {
    addTest('Sécurité', 'warnings', `Fichiers sensibles: ${exposedFiles.join(', ')}`);
}

// Résumé
console.log('\n' + '='.repeat(50));
console.log('🏆 RÉSUMÉ DE LA VALIDATION');
console.log('='.repeat(50));

console.log(`✅ Tests réussis: ${validationResults.passed}`);
console.log(`⚠️  Avertissements: ${validationResults.warnings}`);
console.log(`❌ Échecs: ${validationResults.failed}`);

const totalTests = validationResults.passed + validationResults.warnings + validationResults.failed;
const successRate = Math.round((validationResults.passed / totalTests) * 100);

console.log(`\n📊 Taux de réussite: ${successRate}%`);

if (validationResults.failed === 0 && successRate >= 85) {
    console.log('\n🎉 VALIDATION RÉUSSIE !');
    console.log('✨ CityZenBot v2.0.0 est PRÊT pour la release !');
    console.log('\n🚀 Prochaines étapes:');
    console.log('   1. npm run deploy (commandes Discord)');
    console.log('   2. npm start (lancement du bot)');
    console.log('   3. Publication GitHub/npm (optionnel)');
    
    // Sauvegarde du rapport
    const report = {
        timestamp: new Date().toISOString(),
        version: '2.0.0',
        status: 'READY',
        successRate: successRate,
        results: validationResults
    };
    
    fs.writeFileSync('FINAL_VALIDATION_REPORT.json', JSON.stringify(report, null, 2));
    console.log('\n📄 Rapport sauvegardé: FINAL_VALIDATION_REPORT.json');
    
    process.exit(0);
} else {
    console.log('\n❌ VALIDATION ÉCHOUÉE');
    console.log('🔧 Corrigez les erreurs avant la release');
    process.exit(1);
}
