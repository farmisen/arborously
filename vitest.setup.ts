/* eslint-disable @typescript-eslint/no-empty-function */
import { beforeEach, vi } from "vitest"

beforeEach(() => {
  vi.spyOn(console, "log").mockImplementation(() => {})
  vi.spyOn(console, "error").mockImplementation(() => {})
  vi.spyOn(console, "warn").mockImplementation(() => {})
})
