import tseslint from "typescript-eslint";

export default tseslint.config(...tseslint.configs.recommended, {
  files: ["main.ts"],
  rules: {
    "no-empty": ["error", { allowEmptyCatch: true }],
  },
});
