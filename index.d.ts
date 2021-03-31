export enum ScanMode {
  Normal = 1,
  OnlyBigDirectory = 2
}

export async function Scan(root?: string, threshold?: number, mode?: ScanMode);

export async function Compare(threshold?: number): Promise<void>;
export async function Compare(threshold?: number, pathToSourceFile?: string): Promise<void>;
export async function Compare(threshold?: number, pathToSourceFile?: string, pathToTargetFile?: string): Promise<void>;

export function readSystemPartition(): Promise<any>;
