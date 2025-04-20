import path from 'path'

const buildEslintCommand = (filenames) => `nx affected:lint --fix --files=${filenames.map((f) => path.relative(process.cwd(), f)).join(',')}`

const lintStaged = {
  '**/*.{js,jsx,ts,tsx}': ['prettier --write --ignore-unknown', buildEslintCommand],
  '**/*.{json,md,yaml,yml}': ['prettier --write --ignore-unknown'],
  '**/*.{tf,tfvars}': ['terraform fmt -write=true'],
}

export default lintStaged
