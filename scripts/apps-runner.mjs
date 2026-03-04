import { execSync } from "node:child_process";
import { getApps } from "./apps-config.mjs";

function runNpm(args) {
  const escaped = args
    .map((arg) => (arg.includes(" ") ? `"${arg}"` : arg))
    .join(" ");
  execSync(`npm ${escaped}`, { stdio: "inherit" });
}

async function main() {
  const command = process.argv[2];
  const appArg = process.argv[3];
  const apps = await getApps();

  if (!command || command === "help") {
    console.log("Usage:");
    console.log("  node scripts/apps-runner.mjs list");
    console.log("  node scripts/apps-runner.mjs build");
    console.log("  node scripts/apps-runner.mjs install");
    console.log("  node scripts/apps-runner.mjs ci");
    console.log("  node scripts/apps-runner.mjs dev <app-name>");
    process.exit(0);
  }

  if (command === "list") {
    for (const app of apps) {
      console.log(`${app.name}  ->  ${app.path}  (mount: ${app.mount})`);
    }
    return;
  }

  if (["build", "install", "ci"].includes(command)) {
    for (const app of apps) {
      console.log(`Running '${command}' in ${app.path}...`);
      runNpm(["--prefix", app.path, command]);
    }
    return;
  }

  if (command === "dev") {
    if (!appArg) {
      throw new Error("Specify an app name. Example: npm run dev -- portal");
    }

    const app = apps.find((item) => item.name === appArg);
    if (!app) {
      throw new Error(`App '${appArg}' not found in apps.manifest.json`);
    }

    runNpm(["--prefix", app.path, "run", "dev"]);
    return;
  }

  throw new Error(`Unsupported command: ${command}`);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
