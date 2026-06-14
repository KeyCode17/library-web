#!/usr/bin/env node
// Semver bump applied on push (push-flow-convention skill).
//
// Precedence:
//   1. ANY `feat(...)` / `feat:` commit being pushed  -> major
//   2. else >= 5 changed files across pushed commits  -> minor
//   3. else                                           -> patch
//
// At M0 this is NOT wired into a hook (the M0 lefthook gate is biome/typecheck/
// contract-drift/test/e2e per the task); it activates with the full push flow.
import { execFileSync } from "node:child_process"
import { readFileSync, writeFileSync } from "node:fs"
import { fileURLToPath } from "node:url"

const pkgPath = fileURLToPath(new URL("../package.json", import.meta.url))

function git(args) {
	try {
		return execFileSync("git", args, { encoding: "utf8" }).trim()
	} catch {
		return ""
	}
}

function range() {
	const upstream = git(["rev-parse", "--abbrev-ref", "--symbolic-full-name", "@{push}"])
	if (upstream) return `${upstream}...HEAD`
	return ""
}

function decideBump(rev) {
	const subjects = rev ? git(["log", "--format=%s", rev]) : ""
	if (/^feat(\(|!|:)/m.test(subjects)) return "major"
	const files = rev ? git(["diff", "--name-only", rev]) : ""
	const count = files ? files.split("\n").filter(Boolean).length : 0
	return count >= 5 ? "minor" : "patch"
}

function next(version, bump) {
	const [major, minor, patch] = version.split(".").map((n) => Number.parseInt(n, 10))
	if (bump === "major") return `${major + 1}.0.0`
	if (bump === "minor") return `${major}.${minor + 1}.0`
	return `${major}.${minor}.${patch + 1}`
}

const pkg = JSON.parse(readFileSync(pkgPath, "utf8"))
const rev = range()
if (!rev) {
	console.log("bump: no upstream tracking ref; skipping")
	process.exit(0)
}
const bump = decideBump(rev)
const updated = next(pkg.version, bump)
pkg.version = updated
writeFileSync(pkgPath, `${JSON.stringify(pkg, null, "\t")}\n`)
console.log(`bump: ${bump} -> ${updated}`)
