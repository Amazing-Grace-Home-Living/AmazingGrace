#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Define directories and naming conventions
APP_NAME="signature-tool"
SRC_DIR="../src/main/java"
BUILD_DIR="../build"
BIN_DIR="${BUILD_DIR}/bin"
DIST_DIR="${BUILD_DIR}/dist"
MAIN_CLASS="com.nexus.crypto.SignatureToolApp"

echo "============================================="
echo "🚀 Starting Deployment Build for ${APP_NAME}"
echo "============================================="

# 1. Clean up old build artifacts
echo "🧹 Cleaning previous build directories..."
rm -rf "${BUILD_DIR}"

# 2. Recreate directory structure
mkdir -p "${BIN_DIR}"
mkdir -p "${DIST_DIR}"

# 3. Find and compile all Java files
echo "⚙️ Compiling Java source files..."
find "${SRC_DIR}" -name "*.java" > "${BUILD_DIR}/sources.txt"
javac -d "${BIN_DIR}" @"${BUILD_DIR}/sources.txt"
echo "✔ Compilation successful."

# 4. Package into an executable JAR file
echo "📦 Packaging into an executable JAR..."
jar --create --file="${DIST_DIR}/${APP_NAME}.jar" \
    --main-class="${MAIN_CLASS}" \
    -C "${BIN_DIR}" .

echo "✔ JAR package created at: ${DIST_DIR}/${APP_NAME}.jar"

# 5. Optional verification run
echo "============================================="
echo "🚀 Deployment package ready. Verifying build execution:"
echo "============================================="
java -jar "${DIST_DIR}/${APP_NAME}.jar"

echo "============================================="
echo "🟩 Build complete. Runnable asset is staged in build/dist/"
echo "============================================="
