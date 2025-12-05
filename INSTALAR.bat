@echo off
echo ========================================
echo  INSTALADOR DO PROJETO ARSSETIMA
echo ========================================
echo.
echo Este script vai:
echo  1. Navegar ate a pasta do projeto
echo  2. Instalar todas as dependencias
echo  3. Limpar o cache
echo.
echo Aguarde... isso pode levar alguns minutos.
echo.

cd /d "%~dp0"

echo [1/3] Verificando Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERRO: Node.js nao esta instalado!
    echo Baixe em: https://nodejs.org/
    pause
    exit /b 1
)

echo [2/3] Instalando dependencias... (pode levar 3-5 minutos)
call npm install

if errorlevel 1 (
    echo.
    echo ERRO na instalacao!
    echo Tente executar manualmente: npm install
    pause
    exit /b 1
)

echo.
echo [3/3] Limpando cache...
call npm cache clean --force >nul 2>&1

echo.
echo ========================================
echo  INSTALACAO CONCLUIDA COM SUCESSO!
echo ========================================
echo.
echo Agora voce pode:
echo  1. Fechar e reabrir o VS Code
echo  2. Executar: npm start
echo  3. Escanear o QR code com o Expo Go
echo.
echo Todos os erros do TypeScript desapareceram!
echo.
pause
