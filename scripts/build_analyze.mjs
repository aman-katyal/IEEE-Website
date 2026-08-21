import { spawn } from "child_process";

process.env.ANALYZE = "true";
const child = spawn("npx", ["vite", "build"], {
  stdio: "inherit",
  shell: true,
  env: process.env,
});

child.on("exit", (code) => {
  process.exit(code || 0);
});
