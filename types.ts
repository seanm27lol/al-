
export interface Story {
  id: string;
  videoUrl: string;
  title: string;
  source: string;
  transcript: string;
}

export interface Claim {
  claim: string;
  verification: 'Verified' | 'Unverified' | 'Misleading';
  reasoning: string;
}

export interface Analysis {
  bias: {
    score: number; // -10 (left) to 10 (right)
    summary: string;
  };
  perspective: string;
  claims: Claim[];
}

export interface ChatMessage {
    role: 'user' | 'model';
    content: string;
}
