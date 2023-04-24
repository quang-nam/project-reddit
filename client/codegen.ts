
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: "http://localhost:4000/graphql",
  documents: "graphql-client/**/*.graphql",
  generates: {
    "src/gql/": {
      preset: "client",
      plugins: ["typescript",
      "typescript-operations",
      "typescript-react-apollo"
    ]
    }
  }
};

export default config;
