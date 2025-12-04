# Script para criar ícones temporários para o projeto
# Este é um PNG válido 1024x1024 com fundo roxo (#6B21A8)

$base64Icon = @"
iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==
"@

$base64Splash = @"
iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==
"@

# Criar icon.png
$bytes = [Convert]::FromBase64String($base64Icon)
[IO.File]::WriteAllBytes("$PSScriptRoot\icon.png", $bytes)

# Criar splash.png
$bytes = [Convert]::FromBase64String($base64Splash)
[IO.File]::WriteAllBytes("$PSScriptRoot\splash.png", $bytes)

# Criar adaptive-icon.png
$bytes = [Convert]::FromBase64String($base64Icon)
[IO.File]::WriteAllBytes("$PSScriptRoot\adaptive-icon.png", $bytes)

# Criar favicon.png
$bytes = [Convert]::FromBase64String($base64Icon)
[IO.File]::WriteAllBytes("$PSScriptRoot\favicon.png", $bytes)

Write-Host "✓ Arquivos de assets criados com sucesso!" -ForegroundColor Green
Write-Host "  - icon.png" -ForegroundColor Gray
Write-Host "  - splash.png" -ForegroundColor Gray
Write-Host "  - adaptive-icon.png" -ForegroundColor Gray
Write-Host "  - favicon.png" -ForegroundColor Gray
Write-Host ""
Write-Host "NOTA: Estes são ícones temporários (1x1px)." -ForegroundColor Yellow
Write-Host "Para produção, substitua por imagens reais:" -ForegroundColor Yellow
Write-Host "  - icon.png: 1024x1024px" -ForegroundColor Cyan
Write-Host "  - splash.png: 2048x2732px" -ForegroundColor Cyan
Write-Host "  - adaptive-icon.png: 1024x1024px" -ForegroundColor Cyan
Write-Host "  - favicon.png: 48x48px" -ForegroundColor Cyan
