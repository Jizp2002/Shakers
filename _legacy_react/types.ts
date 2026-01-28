export interface NavLink {
  label: string;
  href: string;
}

export interface FeatureItem {
  title: string;
  description: string;
  icon: 'users' | 'trending-up' | 'smile';
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
  maps?: {
    uri: string;
    title: string;
    placeAnswerSources?: {
      reviewSnippets?: {
        reviewText: string;
      }[];
    };
  };
}

export interface GroundingMetadata {
  groundingChunks?: GroundingChunk[];
}

export interface GenerationResponse {
  text: string;
  groundingMetadata?: GroundingMetadata;
}