#!/bin/bash

# Build vanilla package first
echo "Building vanilla package..."
cd packages/vanilla
npm run build

# Link vanilla package
echo "Linking vanilla package..."
npm link

# Build react package
echo "Building react package..."
cd ../react
npm link wawa-vfx-vanilla
npm run build

echo "Local linking complete!"
echo "Vanilla package can now be used with: npm link wawa-vfx-vanilla"
echo "React package can now be used with: npm link wawa-vfx"