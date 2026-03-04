export interface Resource {
  id: string;
  title: string;
  description: string;
  subject: string;
  date: string;
  type: "Game" | "Video" | "Worksheet" | "Book" | "Website";
  thumbnail: string;
  downloadUrl: string;
  rating: number;
  tags: string[];
}

export interface ResourceInput {
  id?: string;
  title: string;
  description: string;
  subject: string;
  date?: string;
  type?: "Game" | "Video" | "Worksheet" | "Book" | "Website";
  thumbnail: string;
  downloadUrl?: string;
  path?: string;
  rating?: number;
  tags?: string[];
}

export enum ViewMode {
  Grid = "grid",
  List = "list"
}
