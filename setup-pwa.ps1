# PowerShell script to setup Algorithmic Insights PWA

Write-Host "🚀 Setting up Algorithmic Insights PWA..." -ForegroundColor Green

# Check if npm is available
try {
    $npmVersion = npm --version
    Write-Host "✅ npm version: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm is not installed. Please install Node.js and npm first." -ForegroundColor Red
    exit 1
}

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm install

# Check if public directory exists
if (!(Test-Path "public")) {
    New-Item -ItemType Directory -Path "public"
    Write-Host "📁 Created public directory" -ForegroundColor Green
}

# Check for required icon files
Write-Host "🖼️  Checking for PWA icons..." -ForegroundColor Yellow
$missingIcons = @()

$requiredIcons = @(
    "pwa-192x192.png",
    "pwa-512x512.png", 
    "apple-touch-icon.png",
    "favicon.ico"
)

foreach ($icon in $requiredIcons) {
    if (!(Test-Path "public\$icon")) {
        $missingIcons += $icon
    }
}

if ($missingIcons.Count -gt 0) {
    Write-Host "⚠️  Missing PWA icons:" -ForegroundColor Yellow
    foreach ($icon in $missingIcons) {
        Write-Host "   - public\$icon" -ForegroundColor Red
    }
    Write-Host ""
    Write-Host "📖 Please see PWA_ICONS_SETUP.md for instructions on creating these icons." -ForegroundColor Cyan
    Write-Host ""
}

# Run type check
Write-Host "🔍 Running TypeScript check..." -ForegroundColor Yellow
npx tsc --noEmit

# Display PWA info
Write-Host "🌐 Starting development server..." -ForegroundColor Green
Write-Host "📱 Your PWA will be available at: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "✨ PWA Features enabled:" -ForegroundColor Green
Write-Host "   - 📱 Installable as native app" -ForegroundColor White
Write-Host "   - 🔄 Automatic updates" -ForegroundColor White
Write-Host "   - 📶 Offline functionality" -ForegroundColor White
Write-Host "   - 🎯 Caching strategies for performance" -ForegroundColor White
Write-Host "   - 🤖 AI explanations caching" -ForegroundColor White
Write-Host ""

# Start development server
npm run dev
