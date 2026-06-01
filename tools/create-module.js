#!/usr/bin/env node
import fs from "fs";
import path from "path";

const name = process.argv[2];
if (!name) {
  console.error("Usage: create-module <module-name>");
  process.exit(1);
}

const moduleId = name.toLowerCase().replace(/[^a-z0-9]/g, "-");
const moduleDir = path.join("arcade/external", moduleId);

fs.mkdirSync(moduleDir, { recursive: true });

const manifest = `manifest:
  id: "${moduleId}"
  name: "${name}"
  version: "1.0.0"
  description: "Describe what ${name} does."
  entrypoint: "${moduleId}.sys"
  capabilities:
    hud_overlay: true
    xp_rewards: true
    virtue_rewards: false
    pwr_rewards: true
  sandbox: true
`;

fs.writeFileSync(path.join(moduleDir, "manifest.yaml"), manifest);
fs.writeFileSync(path.join(moduleDir, `${moduleId}.sys`), "// executable placeholder");

fs.mkdirSync(path.join(moduleDir, "assets"), { recursive: true });
fs.mkdirSync(path.join(moduleDir, "data"), { recursive: true });

console.log(`✓ Module created at: ${moduleDir}`);
