import fs from "fs/promises";

async function getConfig(path) {
    const rawFile = await fs.readFile(path, "utf-8");

    return JSON.parse(rawFile);
}

export { getConfig }