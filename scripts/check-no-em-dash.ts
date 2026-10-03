import { readFileSync } from "node:fs";

const emDash = /—|\\u2014|\\u\{2014\}|&mdash;|&#(?:0*8212|x0*2014);/i;
const problems = ["README.md", "package.json"].flatMap((file) =>
    readFileSync(file, "utf8")
        .split("\n")
        .flatMap((line, index) =>
            emDash.test(line) ? [`${file}:${index + 1}: ${line.trim()}`] : [],
        ),
);

if (problems.length) {
    console.error(
        "Em dash found in public copy. Use a period, comma, colon or parentheses:\n" +
            problems.join("\n"),
    );
    process.exit(1);
}
console.log("Public copy has no em dashes.");
