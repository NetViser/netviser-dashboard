export interface SampleNetworkFile {
  name: string;
  featuredAttacks: string[]
}

export interface FetchSampleNetworkFileResponse {
  sample_files: SampleNetworkFile[];
}