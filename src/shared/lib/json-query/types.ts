export interface Contract<Raw, Data extends Raw> {
  isData: (prepared: Raw) => prepared is Data;
  getErrorMessages: (prepared: Raw) => string[];
}

type Json =
  | null
  | undefined
  | string
  | number
  | boolean
  | { [x: string]: Json }
  | Array<Json>;

export interface QueryConfig<Params, Data, TransformedData> {
  params?: Params;
  request: {
    url: string | ((params: Params) => string);
    method:
      | 'HEAD'
      | 'GET'
      | 'POST'
      | 'PUT'
      | 'PATCH'
      | 'DELETE'
      | 'QUERY'
      | 'OPTIONS';
    headers?: Record<string, string>;
    query?:
      | Record<string, string>
      | ((params: Params) => Record<string, string>);
    body?: Json | ((params: Params) => Json);
  };
  response: {
    contract: Contract<unknown, Data>;
    mapData: (data: { result: Data; params: Params }) => TransformedData;
  };
}