import YAML from "js-yaml";
import type { Character } from "./types";

export function toYaml(obj: Character): string {
  return YAML.dump(obj, { noRefs: true, lineWidth: -1 });
}

export function fromYaml(text: string): unknown {
  return YAML.load(text);
}
