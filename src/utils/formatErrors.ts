import { type ZodFormattedError } from "zod";

export default function FormatErrors(errors: ZodFormattedError<Map<string,string>,string>) {
  return Object.entries(errors)
  .map(([name, value]) => {
    if (value && "_errors" in value) {
      return `${name}: ${value._errors.join(", ")}\n`;
    }
  })
  .filter(Boolean);
}