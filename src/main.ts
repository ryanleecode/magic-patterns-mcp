#!/usr/bin/env node
import { McpServer } from "@effect/ai"
import { BunRuntime, BunSink, BunStream } from "@effect/platform-bun"
import { Config, Effect, Layer, Logger, Redacted } from "effect"
import { MagicPatterns } from "./MagicPatterns.js"

// Configure environment variables using Effect Config
const apiKeyConfig = Config.redacted("MAGIC_PATTERNS_API_KEY")

const program = Effect.gen(function* () {
  const apiKey = yield* apiKeyConfig

  yield* Effect.log(`🔧 Starting Magic Patterns MCP server with stdio...`)

  // Create the server layer using stdio transport
  const ServerLayer = Layer.mergeAll(
    MagicPatterns(Redacted.value(apiKey))
  ).pipe(
    Layer.provide(McpServer.layerStdio({
      name: "magic-patterns-mcp",
      version: "1.0.0",
      stdin: BunStream.stdin,
      stdout: BunSink.stdout
    })),
    Layer.provide(Logger.add(Logger.prettyLogger({ stderr: true })))
  )

  yield* Effect.log(`🚀 Magic Patterns MCP server running on stdio`)

  return yield* Layer.launch(ServerLayer)
})

BunRuntime.runMain(program)
