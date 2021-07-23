/*
These functions are made to work similarly to the Rust match expression, or the Kotlin when expression.

Example uses:

let status: "loading" | "loaded" | "error"
let data: {} | null

// match<T, RT>(val:T, ...matches: [T, RT][]): RT | undefined
Takes a value, followed by a list of tuples.
If the value matches the first item in one of the tuples, then the second item from that tuple is returned.

status = "error";

// returns "Uh oh..."
match(status,
  ["loading", "Loading..."],
  ["error", "Uh oh..."],
)



// matchFunc<T, RT>(val:T, ...matches: [T, ()=>RT][]): RT | undefined
Pretty much the same as `match`, except requires a function as the second item in the tuples.
This is useful for when you don't want the expression to evaluate until it's returned.

Consider this use case, with `match`

status = "loading"
data = null

match(status,
  ["loading", "Loading..."],
  // Error! Cannot read property toString of null
  ["loaded", data.toString()],
)

This use case is solved with `matchFunc`

matchFunc(status,
  ["loading", ()=> "Loading..."],
  ["loaded", ()=> data.toString()],
)



// matchif<RT>(...matches: [unknown, RT][]): RT | undefined
Pretty much the same as `match`, except it only matches the first tuple value based on truthyness
ie. it's the same as if you plugged the value into an `if` statment.
This means there's no need for the value to match against, either.

status = "loaded"
data = {}

matchif(
  // data is truthy, so it's returned
  [data, data],
  [status == "loading", "Loading..."]
)



// matchifFunc<RT>(...matches: [unknown, ()=>RT][]): RT | undefined
Same thing to `matchif` that `matchFunc` is to `match`.
Pretty much the same as `matchif`, except requires a function as the second item in the tuples.
This is useful for when you don't want the expression to evaluate until it's returned.

Consider this use case, with `matchif`

status = "loading"
data = null

matchif(
  [status == "loading", "Loading..."],
  // Error! Cannot read property toString of null
  [data, data.toString()],
)

This use case is solved with `matchifFunc`

matchifFunc(
  [status == "loading", ()=> "Loading..."],
  ["loaded", ()=> data.toString()],
)
*/

export function match<T, RT>(val:T, ...matches: [T, RT][]): RT | undefined {
  for(const [match, rtn] of matches) if(val == match) return rtn;
}
export function matchFunc<T, RT>(val:T, ...matches: [T, ()=>RT][]): RT | undefined {
  for(const [match, rtn] of matches) if(val == match) return rtn();
}
export function matchif<RT>(...matches: [unknown, RT][]): RT | undefined {
  for(const [val, rtn] of matches) if(val) return rtn;
}
export function matchifFunc<RT>(...matches: [unknown, ()=>RT][]): RT | undefined {
  for(const [val, rtn] of matches) if(val) return rtn();
}