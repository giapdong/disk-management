export enum ScanMode {
	SaveToDisk = 1,
	ReturnResult = 2
}

export interface ScanResult {
	time: Date;
	total: number;
	threshold: number;
	bigDirectory: Array<BigNode>;
	root: Hierachy;
}

export type DiskScanResult = ScanResult | null;

export async function Scan(root?: string): Promise<DiskScanResult>;
export async function Scan(root?: string, threshold?: number): Promise<DiskScanResult>;
export async function Scan(root?: string, threshold?: number, mode?: ScanMode): Promise<DiskScanResult>;

export async function Compare(threshold?: number): Promise<void>;
export async function Compare(threshold?: number, pathToSourceFile?: string): Promise<void>;
export async function Compare(threshold?: number, pathToSourceFile?: string, pathToTargetFile?: string): Promise<void>;

export function readSystemPartition(): Promise<any>;
