// Re-encode supplied artwork without changing its composition or its source files.
const sharp = require(process.env.KEMZ_NODE_MODULES + "/sharp");
const fs = require("node:fs/promises");
const path = require("node:path");

async function main() {
  const directory = path.resolve("public/media/generated");
  for (const name of await fs.readdir(directory)) {
    if (!name.endsWith(".png")) continue;
    const source = path.join(directory, name);
    const base = source.slice(0, -4);
    await sharp(source)
      .resize({ width: 1680, withoutEnlargement: true })
      .webp({ quality: 85 })
      .toFile(base + ".webp");
    await sharp(source)
      .resize({ width: 720, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(base + "-720.webp");
    console.log(name);
  }
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
