#!/usr/bin/env bun
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';

// Read the original package.json
const packageJsonPath = 'package.json';
const originalPackageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));

// Create a new package.json with only the necessary fields
const newPackageJson = {
  name: originalPackageJson.name,
  version: originalPackageJson.version,
  description: originalPackageJson.description,
  bin: {
    'magic-patterns-mcp': './magic-patterns-mcp',
  },
  engines: originalPackageJson.engines,
  repository: originalPackageJson.repository,
  author: originalPackageJson.author,
  license: originalPackageJson.license,
  bugs: originalPackageJson.bugs,
  homepage: originalPackageJson.homepage,
  tags: originalPackageJson.tags,
  keywords: originalPackageJson.keywords,
};

// Write the new package.json to the dist directory
const distPath = join('dist', 'package.json');
console.log(`copying package.json to ${distPath}...`);

// Create the dist directory if it doesn't exist
mkdirSync(dirname(distPath), { recursive: true });

writeFileSync(distPath, JSON.stringify(newPackageJson, null, 2));
