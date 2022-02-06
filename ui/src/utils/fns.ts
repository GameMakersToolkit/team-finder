export function sortArrayImmutably<T>(input: T[]): T[] {
  const newArray = [...(input as T[])];
  newArray.sort();
  return newArray;
}
