import { AiTool, AiToolkit, McpServer } from "@effect/ai"
import {
  HttpClient,
  HttpClientResponse,
  HttpBody,
  FetchHttpClient,
} from "@effect/platform"
import { Effect, Layer, Schema, pipe } from "effect"

// Response schemas
const SourceFile = Schema.Struct({
  id: Schema.String.annotations({
    description: "Unique identifier for the source file",
  }),
  name: Schema.String.annotations({
    description: "Name of the source file",
  }),
  code: Schema.String.annotations({
    description: "The actual source code content",
  }),
  type: Schema.Literal("javascript", "css", "asset").annotations({
    description: "The type of source file",
  }),
})

const CompiledFile = Schema.Struct({
  id: Schema.String.annotations({
    description: "Unique identifier for the compiled file",
  }),
  fileName: Schema.String.annotations({
    description: "Name of the compiled file",
  }),
  hostedUrl: Schema.String.annotations({
    description: "URL where the compiled file is hosted",
  }),
  type: Schema.Literal("javascript", "css", "font").annotations({
    description: "The type of compiled file",
  }),
})

const ContentBlock = Schema.Struct({
  type: Schema.Literal('text').annotations({
    description: "The type of content block",
  }),
  text: Schema.String.annotations({
    description: "The text content of the block",
  }),
})

const ChatMessage = Schema.Struct({
  role: Schema.String.annotations({
    description: "The role of the message sender (e.g. user, assistant)",
  }),
  content: Schema.Union(Schema.String, Schema.Array(ContentBlock)).annotations({
    description:
      "The content of the message - can be a string or array of content blocks",
  }),
})

const CreateDesignResponse = Schema.Struct({
  id: Schema.String.annotations({
    description: "The unique ID of the created design",
  }),
  sourceFiles: Schema.Array(SourceFile).annotations({
    description: "The source files for the design",
  }),
  compiledFiles: Schema.Array(CompiledFile).annotations({
    description: "The compiled/processed files for the design",
  }),
  editorUrl: Schema.String.annotations({
    description: "URL to access the editor interface",
  }),
  previewUrl: Schema.String.annotations({
    description: "URL to preview the generated design",
  }),
  chatMessages: Schema.Array(ChatMessage).annotations({
    description: "The conversation history for this design",
  }),
})

// Create the toolkit factory function
const createToolkit = () =>
  AiToolkit.make(
    AiTool.make("create_design", {
      description:
        "Creates a new design pattern using the Magic Patterns API based on the provided prompt, design system, and styling preferences.",
      parameters: {
        prompt: Schema.String.annotations({
          description:
            "The prompt for the new design. BE AGGRESSIVE with your prompt - provide as much context and detail as possible! Include full React code if modifying existing components, detailed specifications, styling requirements, behavior descriptions, or any other relevant context. The more information you provide, the better the result. No prompt is too long or too detailed.",
        }),
        mode: Schema.optional(Schema.Literal("fast", "best")).annotations({
          description:
            "The mode to use for the new design. 'best' provides higher quality results and should be preferred unless you need a quick fix for simple changes. 'fast' is for time-sensitive, easy design fixes only. Defaults to 'best'.",
        }),
        presetId: Schema.optional(Schema.String).annotations({
          description:
            "If nothing is provided, then html-tailwind is used. Can be either a default combination ('html-tailwind', 'shadcn-tailwind', 'chakraUi-inline', 'mantine-inline') or a custom configuration ID.",
        }),
      },
      success: CreateDesignResponse,
    })
      .annotate(AiTool.Readonly, false)
      .annotate(AiTool.Destructive, false),
  )

// Implementation layer factory function
const createToolkitLayer = (
  apiKey: string,
  toolkitInstance: ReturnType<typeof createToolkit>,
) =>
  pipe(
    toolkitInstance.toLayer(
      Effect.gen(function* () {
        const client = yield* HttpClient.HttpClient

        return toolkitInstance.of({
          create_design: Effect.fn(function* ({ prompt, mode, presetId }) {
            // Create form data using Effect's HttpBody.formDataRecord
            const formData = {
              prompt,
              mode: mode || "best",
              presetId: presetId || "html-tailwind",
              images: "[]",
            }

            const response = yield* pipe(
              client.post("https://api.magicpatterns.com/api/v2/pattern", {
                headers: {
                  "x-mp-api-key": apiKey,
                },
                body: HttpBody.formDataRecord(formData),
              }),
              Effect.flatMap(
                HttpClientResponse.schemaBodyJson(CreateDesignResponse),
              ),
              Effect.orDie,
            )

            return response
          }),
        })
      }),
    ),
    Layer.provide(FetchHttpClient.layer),
  )

// Export the main layer factory function
export const MagicPatterns = (apiKey: string) => {
  const toolkitInstance = createToolkit()
  return McpServer.toolkit(toolkitInstance).pipe(
    Layer.provide(createToolkitLayer(apiKey, toolkitInstance)),
  )
}
