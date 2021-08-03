export function ArrayToRecord<T, V>(arr: T[], cb: (x:T, i:number) => [string, V]): Record<string, V> {
  const rtn: Record<string, V> = {};
  for(let i = 0; i < arr.length; i++){
    const x = arr[i];
    const [index, value] = cb(x, i);
    rtn[index] = value;
  }
  return rtn;
}