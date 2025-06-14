declare module 'lowdb' {
  interface LowdbInstance {
    defaults: (data: any) => LowdbInstance;
    get: (key: string) => any;
    set: (key: string, value: any) => LowdbInstance;
    write: () => LowdbInstance;
    value: () => any;
  }

  function low(adapter: any): LowdbInstance;
  export default low;
}

declare module 'lowdb/adapters/FileSync' {
  class FileSync {
    constructor(file: string);
  }
  export default FileSync;
} 