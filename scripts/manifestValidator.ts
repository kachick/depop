import { Ajv } from 'ajv';
// Do not include from https://json.schemastore.org/chrome-manifest, current official stored has wrong definitions
// See https://github.com/SchemaStore/schemastore/issues/2861 for further detail
import manifestJson from '../src/manifest.json' with {
  type: 'json',
};
import manifestSchema from '../src/manifestSchemaAdjusted.json' with {
  type: 'json',
};

// BE CAREFUL: ajv has some traps
//   - {strict: true} option makes false positive
//   - the ajv instance changes the error field after calling each validate()
//   - ajv.errorsText() has small information, use ajv.errors instead
const ajv = new Ajv({ allErrors: true });

const ok = await ajv.validate(manifestSchema, manifestJson);
if (!ok) {
  console.info(ajv.errors);
  Deno.exit(1);
}
