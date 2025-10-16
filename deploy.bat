@echo off
setlocal

echo 🚀 开始部署 FIT5032 Assessment 3...

REM 检查 Node.js 版本
echo 📋 检查环境...
node --version
if %errorlevel% neq 0 (
    echo ❌ Node.js 未安装或不在 PATH 中
    exit /b 1
)

REM 安装依赖
echo 📦 安装依赖...
call npm install
if %errorlevel% neq 0 (
    echo ❌ 依赖安装失败
    exit /b 1
)

REM 构建项目
echo 🔨 构建项目...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ 构建失败
    exit /b 1
)

REM 检查构建是否成功
if not exist "dist" (
    echo ❌ 构建失败，dist 目录不存在
    exit /b 1
)

echo ✅ 构建成功！

REM 选择部署目标
echo 🎯 选择部署目标:
echo 1) Firebase Hosting
echo 2) Cloudflare Pages
echo 3) 两者都部署
set /p choice="请选择 (1-3): "

if "%choice%"=="1" goto firebase
if "%choice%"=="2" goto cloudflare
if "%choice%"=="3" goto both
echo ❌ 无效选择
exit /b 1

:firebase
echo 🔥 部署到 Firebase Hosting...
firebase --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Firebase CLI 未安装，请先安装: npm install -g firebase-tools
    exit /b 1
)
firebase deploy --only hosting
goto deploy_functions

:cloudflare
echo ☁️ 部署到 Cloudflare Pages...
wrangler --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Wrangler CLI 未安装，请先安装: npm install -g wrangler
    exit /b 1
)
wrangler pages deploy dist --project-name fit5032-assessment-3
goto deploy_functions

:both
echo 🔥 部署到 Firebase Hosting...
firebase --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️ Firebase CLI 未安装，跳过 Firebase 部署
) else (
    firebase deploy --only hosting
)

echo ☁️ 部署到 Cloudflare Pages...
wrangler --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️ Wrangler CLI 未安装，跳过 Cloudflare 部署
) else (
    wrangler pages deploy dist --project-name fit5032-assessment-3
)

:deploy_functions
echo ☁️ 部署 Firebase Cloud Functions...
firebase --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️ Firebase CLI 未安装，跳过云函数部署
) else (
    cd functions
    call npm install
    call npm run build
    cd ..
    firebase deploy --only functions
)

echo 🎉 部署完成！
echo 📱 应用已部署并可访问
echo 🔗 Firebase Hosting: https://mens-health-app-b7749.web.app
echo 🔗 Cloudflare Pages: https://fit5032-assessment-3.pages.dev

pause

