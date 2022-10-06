interface StackArguments {
  p?: string;
  u?: string;
  t?: string;
  inspect?: string;
  nc?: string;
  LOADRES?: string;
  [key: string]: string | undefined;
}

interface StackIniFile {
  'SQL-mode'?: {
    Driver?: string;
    Server?: string;
    Base?: string;
    Schema?: string;
  };
  AppConfig?: {
    ProgramName?: string;
    ResourcePath?: string;
    LookPrgInSubDirectories?: string;
  };
  AppPath?: {
    [index: string]: string[];
  };
  JavaClient?: {
    JCPort?: string;
    JCPath?: string;
    JREPath?: string;
    JCUpdatePath?: string;
  };
  Log?: {
    LogPath?: string;
  };
  BirtStarter?: {
    Port?: number;
    BSPort?: number;
    PublicPath?: string;
  };
  DotNetCore?: {
    Port?: number;
    PublicPath?: string;
  };
  LibPath?: {
    Path?: string;
  };
  API?: {
    UploadedFilesPath?: string;
    PublicFilesPath?: string;
  };
  'PostgreSQL options'?: {
    AddConnectionString?: string
  };
}
