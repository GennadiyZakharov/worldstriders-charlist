# Manual Validation Scenarios

## YAML Import/Export

1. Fill several fields (meta, skills, perks).
2. Export YAML.
3. Reset state.
4. Import exported YAML.
5. Verify values are restored as expected.

## Invalid YAML Safety

1. Attempt to import malformed YAML.
2. Verify app shows error.
3. Verify existing character data remains intact.

## Numeric Clamping

1. Import YAML with out-of-range numeric values.
2. Verify values clamp to expected limits.

## Language Coverage

1. Switch between EN and RU.
2. Verify changed labels are translated in both languages.

## Responsiveness

1. Check layout at desktop width.
2. Check layout around mobile breakpoint (~900px).
