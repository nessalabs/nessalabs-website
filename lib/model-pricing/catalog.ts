import type { ModelPricingCatalog, ModelQuote, PriceTier } from "./types";
import { claude, contextBands, joinTiers, price, scaleTier, tokens } from "./money";

const MINUTE = "per_minute" as const;
const HOUR = "per_hour" as const;
const IMAGE = "per_image" as const;
const SECOND = "per_second" as const;
const CALLS = "per_thousand_calls" as const;
const MESSAGE = "per_message" as const;
const CHARS = "per_thousand_characters" as const;
const MCHARS = "per_million_characters" as const;
const GIB = "per_gib_day" as const;

function quote(
  partial: Pick<ModelQuote, "id" | "name" | "category" | "standard"> &
    Partial<Omit<ModelQuote, "id" | "name" | "category" | "standard">>,
): ModelQuote {
  return partial;
}

const openaiLong = {
  shortWhen: "≤272k",
  longWhen: ">272k",
  context: "1.05M",
  batch: 0.5,
  fast: 2,
} as const;

/**
 * List prices checked against provider documentation on 2026-09-27.
 * Regional uplifts, taxes and negotiated discounts are described in `billing`
 * rather than folded into the row.
 */
export const modelPricing: ModelPricingCatalog = {
  updated: "2026-09-27",
  currency: "USD",
  providers: [
    {
      id: "anthropic",
      name: "Anthropic",
      docsUrl: "https://docs.anthropic.com/en/docs/about-claude/pricing",
      line: "Cache reads are 0.1× input, or 0.025× on Fable 5.1.",
      billing:
        "Claude bills input, output and prompt-cache tokens per million. A five-minute cache write is 1.25× input and a one-hour write is 2×. Cache reads are 0.1× input, or 0.025× on Fable 5.1. The Batch API is half price. Fast mode, where listed, is 2× and is not available on the Batch API. US-only inference on Claude 4.6 and later is 1.1×. Claude 4.6 and later keep one rate out to 1M tokens.",
      models: [
        claude({
          id: "claude-fable-5-1",
          name: "Claude Fable 5.1",
          context: "1M",
          input: 10,
          output: 50,
          read: 0.025,
          note: "Cache reads are 0.025× input. Max output 128k.",
        }),
        claude({
          id: "claude-fable-5",
          name: "Claude Fable 5",
          context: "1M",
          input: 10,
          output: 50,
          note: "Cache reads stay at 0.1× input. Max output 128k.",
        }),
        claude({
          id: "claude-opus-5",
          name: "Claude Opus 5",
          context: "1M",
          input: 5,
          output: 25,
          fast: true,
          note: "Fast mode is 2× across the full window. Max output 128k.",
        }),
        claude({
          id: "claude-opus-4-8",
          name: "Claude Opus 4.8",
          context: "1M",
          input: 5,
          output: 25,
          fast: true,
          note: "Same token rates as Opus 5, including fast mode.",
        }),
        claude({
          id: "claude-opus-4-6",
          name: "Claude Opus 4.6",
          context: "1M",
          input: 5,
          output: 25,
          note: "Opus 4.5 and Opus 4.7 use this rate. Fast mode is not available on either.",
        }),
        claude({
          id: "claude-sonnet-5",
          name: "Claude Sonnet 5",
          context: "1M",
          input: 2,
          output: 10,
          note: "The $2 / $10 rate is the standard price. The scheduled rise to $3 / $15 was cancelled. Max output 128k.",
        }),
        claude({
          id: "claude-sonnet-4-6",
          name: "Claude Sonnet 4.6",
          context: "1M",
          input: 3,
          output: 15,
          note: "Sonnet 4.5 uses this rate.",
        }),
        claude({
          id: "claude-haiku-4-5",
          name: "Claude Haiku 4.5",
          context: "200k",
          input: 1,
          output: 5,
          note: "API id claude-haiku-4-5-20251001. Max output 64k.",
        }),
      ],
    },
    {
      id: "openai",
      name: "OpenAI",
      docsUrl: "https://developers.openai.com/api/docs/pricing",
      line: "A prompt over 272k input tokens is billed at the long-context rate for every token in the request.",
      billing:
        "Flagship GPT-6 and GPT-5.6 rates below are the standard tier. A prompt over 272k input tokens is repriced for the whole request, not only the tokens past the line: 2× input and cache, 1.5× output. Cache writes are 1.25× input. On GPT-6, Batch and Flex are half of standard and Fast mode is 2×. Data-residency endpoints add 10% on models released on or after 5 March 2026. FedRAMP endpoints add 10%.",
      models: [
        contextBands({
          id: "gpt-6-astra",
          name: "GPT-6 Astra",
          ...openaiLong,
          short: { input: 10, cached: 1, write: 12.5, output: 50 },
          long: { input: 20, cached: 2, write: 25, output: 75 },
          note: "Text and image input. Max output 128k.",
        }),
        contextBands({
          id: "gpt-6-sol",
          name: "GPT-6 Sol",
          ...openaiLong,
          short: { input: 2, cached: 0.2, write: 2.5, output: 10 },
          long: { input: 4, cached: 0.4, write: 5, output: 15 },
          note: "EU data residency is standard processing only.",
        }),
        contextBands({
          id: "gpt-6-luna",
          name: "GPT-6 Luna",
          ...openaiLong,
          short: { input: 0.1, cached: 0.01, write: 0.125, output: 0.5 },
          long: { input: 0.2, cached: 0.02, write: 0.25, output: 0.75 },
          note: "EU data residency is standard processing only.",
        }),
        contextBands({
          id: "gpt-5.6-sol",
          name: "GPT-5.6 Sol",
          context: "1.05M",
          short: { input: 4, cached: 0.4, write: 5, output: 20 },
          long: { input: 8, cached: 0.8, write: 10, output: 30 },
          note: "Promotional standard rate, published through at least 21 November 2026.",
        }),
        contextBands({
          id: "gpt-5.6-terra",
          name: "GPT-5.6 Terra",
          context: "1.05M",
          short: { input: 2, cached: 0.2, write: 2.5, output: 12 },
          long: { input: 4, cached: 0.4, write: 5, output: 18 },
          note: "Long context is 2× input and 1.5× output for the full request. Cache writes are 1.25× input.",
        }),
        contextBands({
          id: "gpt-5.6-luna",
          name: "GPT-5.6 Luna",
          context: "1.05M",
          short: { input: 0.2, cached: 0.02, write: 0.25, output: 1.2 },
          long: { input: 0.4, cached: 0.04, write: 0.5, output: 1.8 },
          note: "Long context is 2× input and 1.5× output for the full request.",
        }),
        contextBands({
          id: "gpt-5.6-cyber",
          name: "GPT-5.6 Cyber",
          shortWhen: undefined,
          short: { input: 12.5, cached: 1.25, write: 15.625, output: 75 },
          note: "No separate long-context tier on the pricing page.",
        }),
        contextBands({
          id: "gpt-5.3-codex",
          name: "GPT-5.3 Codex",
          shortWhen: undefined,
          fast: 2,
          short: { input: 1.75, cached: 0.175, output: 14 },
          note: "Fast mode is 2×. Listed under Codex on the pricing page.",
        }),
        contextBands({
          id: "gpt-5",
          name: "GPT-5",
          context: "400k",
          shortWhen: undefined,
          short: { input: 1.25, cached: 0.125, output: 10 },
          retiring: "API shutdown 11 December 2026",
          note: "Replacement on the deprecation schedule is gpt-5.6-sol.",
        }),
        contextBands({
          id: "gpt-4.1",
          name: "GPT-4.1",
          context: "1M",
          shortWhen: undefined,
          short: { input: 2, cached: 0.5, output: 8 },
        }),
        contextBands({
          id: "gpt-4.1-mini",
          name: "GPT-4.1 mini",
          context: "1M",
          shortWhen: undefined,
          short: { input: 0.4, cached: 0.1, output: 1.6 },
        }),
        contextBands({
          id: "gpt-4.1-nano",
          name: "GPT-4.1 nano",
          context: "1M",
          shortWhen: undefined,
          short: { input: 0.1, cached: 0.025, output: 0.4 },
        }),
        contextBands({
          id: "gpt-4o",
          name: "GPT-4o",
          context: "128k",
          shortWhen: undefined,
          short: { input: 2.5, cached: 1.25, output: 10 },
        }),
        contextBands({
          id: "gpt-4o-mini",
          name: "GPT-4o mini",
          context: "128k",
          shortWhen: undefined,
          short: { input: 0.15, cached: 0.075, output: 0.6 },
        }),
        contextBands({
          id: "o3",
          name: "o3",
          context: "200k",
          shortWhen: undefined,
          short: { input: 2, cached: 0.5, output: 8 },
          retiring: "API shutdown 11 December 2026",
          note: "Replacement on the deprecation schedule is gpt-5.6-sol.",
        }),
        quote({
          id: "gpt-realtime-2.1",
          name: "GPT-Realtime 2.1",
          category: "voice",
          standard: joinTiers([
            {
              input: [price(32, "per_million_tokens", "audio"), price(4, "per_million_tokens", "text"), price(5, "per_million_tokens", "image")],
              cachedInput: [price(0.4, "per_million_tokens", "audio"), price(0.4, "per_million_tokens", "text"), price(0.5, "per_million_tokens", "image")],
              output: [price(64, "per_million_tokens", "audio"), price(24, "per_million_tokens", "text")],
            },
          ]),
          note: "Speech-to-speech on the Realtime API. Text and image in the same session are metered separately.",
        }),
        quote({
          id: "gpt-realtime-2.1-mini",
          name: "GPT-Realtime 2.1 mini",
          category: "voice",
          standard: {
            input: [price(10, "per_million_tokens", "audio"), price(0.6, "per_million_tokens", "text"), price(0.8, "per_million_tokens", "image")],
            cachedInput: [price(0.3, "per_million_tokens", "audio"), price(0.06, "per_million_tokens", "text"), price(0.08, "per_million_tokens", "image")],
            output: [price(20, "per_million_tokens", "audio"), price(2.4, "per_million_tokens", "text")],
          },
        }),
        quote({
          id: "gpt-live-1",
          name: "GPT-Live 1",
          category: "voice",
          standard: { input: [price(0.05, MINUTE)] },
          note: "Billed per second, without rounding up to a minute. The backend model and tools are charged separately.",
        }),
        quote({
          id: "gpt-realtime-translate",
          name: "GPT-Realtime Translate",
          category: "voice",
          standard: { input: [price(0.034, MINUTE)] },
          note: "Live speech translation. Duration priced, not tokens.",
        }),
        quote({
          id: "gpt-realtime-whisper",
          name: "GPT-Realtime Whisper",
          category: "voice",
          standard: { input: [price(0.017, MINUTE)] },
          note: "Streaming transcription.",
        }),
        quote({
          id: "gpt-live-transcribe",
          name: "GPT-Live Transcribe",
          category: "voice",
          standard: { input: [price(0.017, MINUTE)] },
          note: "Live transcription.",
        }),
        quote({
          id: "gpt-transcribe",
          name: "GPT-Transcribe",
          category: "voice",
          standard: { input: [price(0.0045, MINUTE)] },
          note: "Batch transcription.",
        }),
        quote({
          id: "gpt-4o-transcribe",
          name: "GPT-4o Transcribe",
          category: "voice",
          standard: tokens(2.5, 10),
          note: "About $0.006 per minute at the published estimate.",
        }),
        quote({
          id: "gpt-4o-mini-transcribe",
          name: "GPT-4o mini Transcribe",
          category: "voice",
          standard: tokens(1.25, 5),
          note: "About $0.003 per minute at the published estimate.",
        }),
        quote({
          id: "gpt-image-2.5",
          name: "GPT Image 2.5",
          category: "image",
          standard: {
            input: [price(8, "per_million_tokens", "image"), price(5, "per_million_tokens", "text")],
            cachedInput: [price(2, "per_million_tokens", "image"), price(1.25, "per_million_tokens", "text")],
            output: [price(30, "per_million_tokens", "image")],
          },
          note: "gpt-image-2.5-sunburst and gpt-image-2.5-flare share this rate. Cached image input applies to the Responses API.",
        }),
        quote({
          id: "gpt-image-2",
          name: "GPT Image 2",
          category: "image",
          standard: {
            input: [price(4, "per_million_tokens", "image"), price(2.5, "per_million_tokens", "text")],
            cachedInput: [price(1, "per_million_tokens", "image"), price(0.625, "per_million_tokens", "text")],
            output: [price(15, "per_million_tokens", "image")],
          },
        }),
        quote({
          id: "text-embedding-3-large",
          name: "text-embedding-3-large",
          category: "embedding",
          context: "8k",
          standard: { input: [price(0.13)] },
        }),
        quote({
          id: "text-embedding-3-small",
          name: "text-embedding-3-small",
          category: "embedding",
          context: "8k",
          standard: { input: [price(0.02)] },
        }),
        quote({
          id: "web-search",
          name: "Web search",
          category: "tool",
          standard: { input: [price(10, CALLS)] },
          note: "Search content tokens are billed at the model rate. The preview tool on non-reasoning models is $25 / 1k calls, with search-content tokens free.",
        }),
        quote({
          id: "file-search",
          name: "File search",
          category: "tool",
          standard: {
            input: [price(2.5, CALLS, "tool call"), price(0.1, GIB, "storage")],
          },
          note: "Tool-call fee applies to the Responses API. Storage is $0.10 / GB-day after 1 GB free. OpenAI's GB is a binary gigabyte.",
        }),
      ],
    },
    {
      id: "google",
      name: "Google",
      docsUrl: "https://ai.google.dev/gemini-api/docs/pricing",
      line: "Gemini 3.8 Flash is on an introductory rate through 31 December 2026.",
      billing:
        "Gemini Developer API paid tier, per million tokens. Thinking tokens are billed as output. Gemini 3.8 Flash, 3.7 Flash and 3.6 Flash are on an introductory rate through 31 December 2026. Batch is half of standard on the models that list it. Priority is the higher of the two published schedules. Search grounding is 5,000 requests a month free across Gemini 3.x, then $14 per 1,000.",
      models: [
        (() => {
          const standard: PriceTier = {
            input: [price(0.75)],
            cachedInput: [price(0.075)],
            output: [price(3.75)],
          };
          const fast: PriceTier = {
            input: [price(1.35)],
            cachedInput: [price(0.135)],
            output: [price(6.75)],
          };
          return quote({
            id: "gemini-3.8-flash",
            name: "Gemini 3.8 Flash",
            category: "language",
            standard,
            batch: scaleTier(standard, 0.5),
            fast,
            note: "Introductory rate through 31 December 2026. From 1 January 2027: input $1.50, cache read $0.15, output $7.50. Cache storage is $0.50 / MTok-hour during the intro, then $1.00.",
          });
        })(),
        quote({
          id: "gemini-3.1-pro-preview",
          name: "Gemini 3.1 Pro",
          category: "language",
          context: "1M",
          standard: joinTiers([
            tokens(2, 12, 0.2, "≤200k"),
            tokens(4, 18, 0.4, ">200k"),
          ]),
          batch: joinTiers([
            tokens(1, 6, 0.2, "≤200k"),
            tokens(2, 9, 0.4, ">200k"),
          ]),
          fast: joinTiers([
            tokens(3.6, 21.6, 0.36, "≤200k"),
            tokens(7.2, 32.4, 0.72, ">200k"),
          ]),
          note: "Batch cache reads stay at the standard cache rate. The long-context band applies to prompts over 200k tokens. Also the id gemini-3.1-pro-preview-customtools.",
        }),
        quote({
          id: "gemini-3.5-flash-lite",
          name: "Gemini 3.5 Flash Lite",
          category: "language",
          standard: tokens(0.3, 2.5, 0.03),
          note: "One rate for text, image, video and audio input. Cache storage is $1 / MTok-hour.",
        }),
        quote({
          id: "gemini-3-flash-preview",
          name: "Gemini 3 Flash",
          category: "language",
          context: "1M",
          standard: {
            input: [price(0.5, "per_million_tokens", "text"), price(1, "per_million_tokens", "audio")],
            cachedInput: [price(0.05, "per_million_tokens", "text"), price(0.1, "per_million_tokens", "audio")],
            output: [price(3)],
          },
          note: "Previous Flash generation. Text input also covers image and video.",
        }),
        quote({
          id: "gemini-3.1-flash-live-preview",
          name: "Gemini 3.1 Flash Live",
          category: "voice",
          standard: {
            input: [
              price(0.75, "per_million_tokens", "text"),
              price(3, "per_million_tokens", "audio"),
              price(0.005, MINUTE, "audio"),
              price(1, "per_million_tokens", "image"),
            ],
            output: [
              price(4.5, "per_million_tokens", "text"),
              price(12, "per_million_tokens", "audio"),
              price(0.018, MINUTE, "audio"),
            ],
          },
          note: "Audio-to-audio live dialogue. The per-minute figures are the published equivalent of the audio token rate.",
        }),
        quote({
          id: "gemini-3.5-live-translate-preview",
          name: "Gemini 3.5 Live Translate",
          category: "voice",
          standard: {
            input: [price(3.5, "per_million_tokens", "audio"), price(0.0053, MINUTE, "audio")],
            output: [price(21, "per_million_tokens", "audio"), price(0.0315, MINUTE, "audio")],
          },
          note: "About $0.0368 per minute of two-way audio at 25 tokens per second.",
        }),
        quote({
          id: "gemini-3.5-transcribe-live",
          name: "Gemini 3.5 Transcribe Live",
          category: "voice",
          standard: {
            input: [price(3.5, "per_million_tokens", "audio"), price(0.005, MINUTE, "audio")],
            output: [price(21, "per_million_tokens", "text"), price(0.004, MINUTE, "text")],
          },
          note: "About $0.009 per minute blended.",
        }),
        quote({
          id: "gemini-3.5-transcribe",
          name: "Gemini 3.5 Transcribe",
          category: "voice",
          standard: {
            input: [price(2, "per_million_tokens", "audio"), price(0.003, MINUTE, "audio")],
            output: [price(12, "per_million_tokens", "text"), price(0.002, MINUTE, "text")],
          },
          note: "About $0.005 per minute blended. Supports diarization and word timestamps.",
        }),
        quote({
          id: "gemini-2.5-flash-native-audio",
          name: "Gemini 2.5 Flash Live Audio",
          category: "voice",
          standard: {
            input: [price(0.5, "per_million_tokens", "text"), price(3, "per_million_tokens", "audio")],
            output: [price(2, "per_million_tokens", "text"), price(12, "per_million_tokens", "audio")],
          },
          note: "API id gemini-2.5-flash-native-audio-preview-12-2025. Audio input also covers video.",
        }),
        quote({
          id: "gemini-3.1-flash-tts-preview",
          name: "Gemini 3.1 Flash TTS",
          category: "voice",
          standard: tokens(1, 20),
          batch: tokens(0.5, 10),
          note: "Input is text. Output is audio tokens, 25 per second.",
        }),
        quote({
          id: "gemini-2.5-flash-preview-tts",
          name: "Gemini 2.5 Flash TTS",
          category: "voice",
          standard: {
            input: [price(0.5, "per_million_tokens", "text")],
            output: [price(10, "per_million_tokens", "audio")],
          },
        }),
        quote({
          id: "gemini-embedding-001",
          name: "Gemini Embedding",
          category: "embedding",
          standard: { input: [price(0.15)] },
          batch: { input: [price(0.075)] },
        }),
        quote({
          id: "google-search-grounding",
          name: "Search grounding",
          category: "tool",
          standard: { input: [price(14, CALLS)] },
          note: "5,000 search requests a month are free, shared across Gemini 3.x. A prompt can issue more than one search.",
        }),
      ],
    },
    {
      id: "xai",
      name: "xAI",
      docsUrl: "https://docs.x.ai/developers/pricing",
      line: "A prompt of 200k tokens or more is billed at the higher rate for every token in the request.",
      billing:
        "Text models with two rows bill every token in the request at the higher rate once the prompt reaches 200k tokens. Priority processing is 2× after the cache discount. The US regional endpoint is 1.1× and currently serves grok-4.7 and grok-4.6. Batch is 20% off for grok-4.3 and the grok-4.20 snapshots only. Voice, image and server-side tools are separate meters.",
      models: [
        contextBands({
          id: "grok-4.7",
          name: "Grok 4.7",
          context: "500k",
          shortWhen: "<200k",
          longWhen: "≥200k",
          fast: 2,
          short: { input: 2, cached: 0.5, output: 6 },
          long: { input: 4, cached: 1, output: 12 },
          note: "Grok 4.7 Fast on Cursor and Grok Build is a different meter: $4 / $1 / $12 below 200k and $6 / $1.50 / $18 above. It is not on the public API.",
        }),
        contextBands({
          id: "grok-4.6",
          name: "Grok 4.6",
          context: "500k",
          shortWhen: "<200k",
          longWhen: "≥200k",
          fast: 2,
          short: { input: 2, cached: 0.5, output: 6 },
          long: { input: 4, cached: 1, output: 12 },
        }),
        contextBands({
          id: "grok-4.5",
          name: "Grok 4.5",
          context: "500k",
          shortWhen: "<200k",
          longWhen: "≥200k",
          fast: 2,
          short: { input: 2, cached: 0.3, output: 6 },
          long: { input: 4, cached: 0.6, output: 12 },
        }),
        contextBands({
          id: "grok-4.3",
          name: "Grok 4.3",
          context: "1M",
          shortWhen: "<200k",
          longWhen: "≥200k",
          batch: 0.8,
          fast: 2,
          short: { input: 1.25, cached: 0.2, output: 2.5 },
          long: { input: 2.5, cached: 0.4, output: 5 },
          note: "grok-4.20-0309-reasoning, grok-4.20-0309-non-reasoning and grok-4.20-multi-agent-0309 use this rate, including the 20% batch discount.",
        }),
        contextBands({
          id: "grok-build-0.1",
          name: "Grok Build 0.1",
          context: "256k",
          shortWhen: "<200k",
          longWhen: "≥200k",
          fast: 2,
          short: { input: 1, cached: 0.2, output: 2 },
          long: { input: 2, cached: 0.4, output: 4 },
        }),
        quote({
          id: "grok-voice-think-fast-2.0",
          name: "Grok Voice Think Fast 2.0",
          category: "voice",
          standard: {
            input: [price(0.08, MINUTE, "audio"), price(0.004, MESSAGE, "text")],
          },
          note: "Speech-to-speech. $4.80 per audio hour. grok-voice-latest currently points here. Each non-audio conversation.item.create is $0.004.",
        }),
        quote({
          id: "grok-stt",
          name: "Grok Speech to Text",
          category: "voice",
          standard: {
            input: [price(0.1, HOUR, "REST"), price(0.2, HOUR, "streaming")],
          },
        }),
        quote({
          id: "grok-tts",
          name: "Grok Text to Speech",
          category: "voice",
          standard: { input: [price(15, MCHARS)] },
        }),
        quote({
          id: "grok-imagine-image",
          name: "Grok Imagine Image",
          category: "image",
          standard: { output: [price(0.02, IMAGE)] },
        }),
        quote({
          id: "grok-imagine-image-2.0",
          name: "Grok Imagine Image 2.0",
          category: "image",
          standard: { output: [price(0.04, IMAGE)] },
        }),
        quote({
          id: "grok-imagine-image-quality",
          name: "Grok Imagine Image Quality",
          category: "image",
          standard: { output: [price(0.05, IMAGE)] },
        }),
        quote({
          id: "grok-imagine-video",
          name: "Grok Imagine Video",
          category: "image",
          standard: { output: [price(0.05, SECOND)] },
        }),
        quote({
          id: "grok-imagine-video-1.5",
          name: "Grok Imagine Video 1.5",
          category: "image",
          standard: { output: [price(0.08, SECOND)] },
        }),
        quote({
          id: "web-search",
          name: "Web search",
          category: "tool",
          standard: { input: [price(5, CALLS)] },
          note: "Server-side tool. Image search is billed as web search. Tokens are still charged at the model rate.",
        }),
        quote({
          id: "x-search",
          name: "X search",
          category: "tool",
          standard: {
            input: [price(5, CALLS, "posts"), price(10, CALLS, "profiles")],
          },
          note: "Billed per post or profile returned, including parent and quoted posts.",
        }),
        quote({
          id: "code-execution",
          name: "Code execution",
          category: "tool",
          standard: { input: [price(5, CALLS)] },
          note: "Also the tool name code_interpreter on the Responses API.",
        }),
        quote({
          id: "collections-search",
          name: "Collections search",
          category: "tool",
          standard: { input: [price(2.5, CALLS)] },
          note: "File search over uploaded collections. File storage is $0.025 / GiB-day and collection storage is $0.10 / GiB-day.",
        }),
      ],
    },
    {
      id: "moonshot",
      name: "Moonshot",
      docsUrl: "https://platform.kimi.ai/docs/pricing/chat-k26",
      billing:
        "Kimi prices are per million tokens on the Moonshot platform, before tax. Context caching is automatic. Kimi K2.7 Code is the coding model. The highspeed id is the same model with a higher output rate.",
      models: [
        quote({
          id: "kimi-k2.6",
          name: "Kimi K2.6",
          category: "language",
          context: "262k",
          standard: tokens(0.95, 4, 0.16),
          note: "Text, image and video input. Thinking and non-thinking.",
        }),
        quote({
          id: "kimi-k2.7-code",
          name: "Kimi K2.7 Code",
          category: "language",
          context: "262k",
          standard: tokens(0.95, 4, 0.19),
          note: "Coding model. Thinking mode. Docs: platform.kimi.ai/docs/pricing/chat-k27-code.",
        }),
        quote({
          id: "kimi-k2.7-code-highspeed",
          name: "Kimi K2.7 Code Highspeed",
          category: "language",
          context: "262k",
          standard: tokens(1.9, 8, 0.38),
          note: "Same model as K2.7 Code. About 180 tokens/s, up to about 260 tokens/s on short context.",
        }),
      ],
    },
    {
      id: "deepseek",
      name: "DeepSeek",
      docsUrl: "https://api-docs.deepseek.com/quick_start/pricing",
      line: "Peak hours are 01:00–04:00 and 06:00–10:00 UTC, Monday to Friday. Other hours are half price.",
      billing:
        "Off-peak is half of peak. Peak hours are 01:00–04:00 and 06:00–10:00 UTC, Monday to Friday, excluding Chinese public holidays. Weekends and those holidays are off-peak all day. Cache hits are automatic. Both models take a 1M context and up to 384k output. Base URL https://api.deepseek.com, or https://api.deepseek.com/anthropic for the Anthropic format.",
      models: [
        quote({
          id: "deepseek-flash",
          name: "DeepSeek Flash",
          category: "language",
          context: "1M",
          standard: joinTiers([
            tokens(0.15, 0.6, 0.003, "off-peak"),
            tokens(0.3, 1.2, 0.006, "peak"),
          ]),
          note: "Model version DeepSeek-V4.1-Flash. deepseek-v4-flash and deepseek-v4-flash-vision-exp still route here and bill at this rate. Vision input is supported. Thinking is the default.",
        }),
        quote({
          id: "deepseek-v4-pro",
          name: "DeepSeek V4 Pro",
          category: "language",
          context: "1M",
          standard: joinTiers([
            tokens(0.66, 1.98, 0.022, "off-peak"),
            tokens(1.32, 3.96, 0.044, "peak"),
          ]),
          note: "Model version DeepSeek-V4-Pro-0813. Still served after 14 September 2026. No vision input.",
        }),
      ],
    },
    {
      id: "alibaba",
      name: "Alibaba",
      docsUrl: "https://www.alibabacloud.com/help/en/model-studio/model-qwen3-max",
      billing:
        "Qwen3-Max on Model Studio. Beijing and the international deployments (Singapore and Frankfurt) publish different USD rates, and each deployment has three prompt-length bands. The figures are list prices, before limited-time discounts. Context is 262k tokens.",
      models: [
        quote({
          id: "qwen3-max",
          name: "Qwen3-Max",
          category: "language",
          context: "262k",
          standard: joinTiers([
            tokens(1.2, 6, 0.24, "international ≤32k"),
            tokens(2.4, 12, 0.48, "international ≤128k"),
            tokens(3, 15, 0.6, "international ≤256k"),
          ]),
          note: "Singapore (international) and Frankfurt (EU) share this card. Explicit cache creation is 1.25× input and explicit cache reads are 0.1× input.",
        }),
        quote({
          id: "qwen3-max-beijing",
          name: "Qwen3-Max Beijing",
          category: "language",
          context: "262k",
          standard: joinTiers([
            tokens(0.359, 1.434, 0.072, "≤32k"),
            tokens(0.574, 2.294, 0.115, "≤128k"),
            tokens(1.004, 4.014, 0.201, "≤256k"),
          ]),
          note: "China (Beijing) deployment, billed in USD on the Model Studio price card. Batch file input is half of the realtime input rate.",
        }),
      ],
    },
    {
      id: "mistral",
      name: "Mistral",
      docsUrl: "https://mistral.ai/pricing/api/",
      billing:
        "La Plateforme list prices. Language rates are per million tokens. Voxtral transcription and speech use their own meters. Enterprise regional processing is listed at 75% above these rates on the APIs that offer it.",
      models: [
        quote({
          id: "mistral-large-3",
          name: "Mistral Large 3",
          category: "language",
          standard: tokens(0.5, 1.5),
          note: "Open-weight flagship. Output on the current price card is $1.50 / MTok.",
        }),
        quote({
          id: "mistral-medium-3.5",
          name: "Mistral Medium 3.5",
          category: "language",
          context: "256k",
          standard: tokens(1.5, 7.5),
          note: "Output on the current price card is $7.50 / MTok.",
        }),
        quote({
          id: "mistral-small-4",
          name: "Mistral Small 4",
          category: "language",
          standard: tokens(0.15, 0.6),
          note: "Output on the current price card is $0.60 / MTok.",
        }),
        quote({
          id: "voxtral-mini-transcribe-realtime",
          name: "Voxtral Mini Transcribe Realtime",
          category: "voice",
          standard: { input: [price(0.006, MINUTE, "audio")] },
        }),
        quote({
          id: "voxtral-tts",
          name: "Voxtral TTS",
          category: "voice",
          standard: { input: [price(0.016, CHARS)] },
          note: "Text to speech, including voice cloning.",
        }),
        quote({
          id: "voxtral-small",
          name: "Voxtral Small",
          category: "voice",
          standard: {
            input: [price(0.004, MINUTE, "audio")],
            output: [price(0.4)],
          },
          note: "Audio understanding on /v1/chat/completions. Audio input is also quoted per million tokens on the price card.",
        }),
      ],
    },
  ],
  gateways: [
    {
      id: "openrouter",
      name: "OpenRouter",
      docsUrl: "https://openrouter.ai/docs/faq",
      summary:
        "One OpenAI-compatible endpoint in front of the providers above. Token rates are passed through. The fee is on buying credits, and on bring-your-own-key usage past a monthly allowance. The listed price for a model is the cheapest endpoint, and routing is price-weighted unless you pin a provider.",
      fees: [
        {
          name: "Inference",
          detail: "No markup. You pay the underlying provider's listed token rate.",
        },
        {
          name: "Credit purchase, card",
          detail: "5.5% of the top-up, minimum $0.80.",
        },
        {
          name: "Credit purchase, crypto",
          detail: "5% of the top-up, no minimum.",
        },
        {
          name: "Bring your own key",
          detail: "Free through $25,000 of list-price inference a month, then 5% of the excess.",
        },
        {
          name: "Prompt logging",
          detail: "1% discount on usage if prompts may be retained.",
        },
      ],
    },
  ],
};
