#!/usr/bin/env node
import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { homedir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const dryRun = process.argv.includes("--dry-run");
const repo = dirname(fileURLToPath(import.meta.url));
const home = homedir();
const piDir = join(home, ".pi");
const agentDir = join(piDir, "agent");
const localDir = join(agentDir, "local");
const destinations = {
  cc: join(localDir, "claude-coder"),
  usage: join(localDir, "pi-usage-bars-safe"),
  auto: join(agentDir, "extensions", "auto-thinking"),
};

function log(message) { console.log(`${dryRun ? "would " : ""}${message}`); }
function copy(source, destination) {
  log(`copy ${source} -> ${destination}`);
  if (!dryRun) {
    mkdirSync(dirname(destination), { recursive: true });
    cpSync(source, destination, { recursive: true, force: true });
  }
}
function readJson(path) {
  if (!existsSync(path)) return {};
  return JSON.parse(readFileSync(path, "utf8"));
}
function mergeSettings(target, template, localPackages = []) {
  const current = readJson(target);
  const incoming = readJson(template);
  const packages = [...new Set([...(current.packages ?? []), ...(incoming.packages ?? [])])]
    .filter((entry) => {
      const normalized = String(entry).replaceAll("\\", "/");
      return !/\/\.pi\/agent\/local\/(?:cc-my-pi-safe|claude-coder|pi-usage-bars-safe)$/.test(normalized);
    })
    .concat(localPackages);
  const merged = { ...current, ...incoming };
  if (packages.length) merged.packages = packages;
  log(`merge settings into ${target}`);
  if (!dryRun) {
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, JSON.stringify(merged, null, 2) + "\n");
  }
}

copy(join(repo, "packages", "claude-coder"), destinations.cc);
copy(join(repo, "packages", "pi-usage-bars-safe"), destinations.usage);
copy(join(repo, "extensions", "auto-thinking"), destinations.auto);
mergeSettings(join(piDir, "settings.json"), join(repo, "settings", "ui.json"));
mergeSettings(join(agentDir, "settings.json"), join(repo, "settings", "agent.json"), [
  resolve(destinations.usage),
  resolve(destinations.cc),
]);

if (!dryRun) {
  const npm = process.platform === "win32" ? "npm.cmd" : "npm";
  console.log("installing claude-coder dependencies…");
  execFileSync(npm, ["install", "--omit=dev"], { cwd: destinations.cc, stdio: "inherit" });
}
console.log(dryRun ? "Dry run complete." : "Installed. Restart Pi or run /reload.");
