// import.meta is a syntax error within Jest
// so put it in a module that can be mocked

export function importMeta(): ImportMeta {
  return import.meta;
}
