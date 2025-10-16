#!/bin/bash

# FIT5032 Assessment 3 - 部署脚本
# 支持部署到 Firebase Hosting 和 Cloudflare Pages

set -e

echo "🚀 开始部署 FIT5032 Assessment 3..."

# 检查 Node.js 版本
echo "📋 检查环境..."
node_version=$(node --version)
echo "Node.js 版本: $node_version"

# 安装依赖
echo "📦 安装依赖..."
npm install

# 构建项目
echo "🔨 构建项目..."
npm run build

# 检查构建是否成功
if [ ! -d "dist" ]; then
    echo "❌ 构建失败，dist 目录不存在"
    exit 1
fi

echo "✅ 构建成功！"

# 选择部署目标
echo "🎯 选择部署目标:"
echo "1) Firebase Hosting"
echo "2) Cloudflare Pages"
echo "3) 两者都部署"
read -p "请选择 (1-3): " choice

case $choice in
    1)
        echo "🔥 部署到 Firebase Hosting..."
        if command -v firebase &> /dev/null; then
            firebase deploy --only hosting
        else
            echo "❌ Firebase CLI 未安装，请先安装: npm install -g firebase-tools"
            exit 1
        fi
        ;;
    2)
        echo "☁️ 部署到 Cloudflare Pages..."
        if command -v wrangler &> /dev/null; then
            wrangler pages deploy dist --project-name fit5032-assessment-3
        else
            echo "❌ Wrangler CLI 未安装，请先安装: npm install -g wrangler"
            exit 1
        fi
        ;;
    3)
        echo "🔥 部署到 Firebase Hosting..."
        if command -v firebase &> /dev/null; then
            firebase deploy --only hosting
        else
            echo "⚠️ Firebase CLI 未安装，跳过 Firebase 部署"
        fi
        
        echo "☁️ 部署到 Cloudflare Pages..."
        if command -v wrangler &> /dev/null; then
            wrangler pages deploy dist --project-name fit5032-assessment-3
        else
            echo "⚠️ Wrangler CLI 未安装，跳过 Cloudflare 部署"
        fi
        ;;
    *)
        echo "❌ 无效选择"
        exit 1
        ;;
esac

# 部署云函数
echo "☁️ 部署 Firebase Cloud Functions..."
if command -v firebase &> /dev/null; then
    cd functions
    npm install
    npm run build
    cd ..
    firebase deploy --only functions
else
    echo "⚠️ Firebase CLI 未安装，跳过云函数部署"
fi

echo "🎉 部署完成！"
echo "📱 应用已部署并可访问"
echo "🔗 Firebase Hosting: https://mens-health-app-b7749.web.app"
echo "🔗 Cloudflare Pages: https://fit5032-assessment-3.pages.dev"

