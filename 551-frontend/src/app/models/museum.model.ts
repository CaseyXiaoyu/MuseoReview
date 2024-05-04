export interface Museum {
    id: string;
    MuseumName: string;
    
    Location: string;
    PhoneNum: string;
    Description: string;
    Fee: string;
    LengthOfVisit: string;
    AverageRating: number;
    ReviewCount: number;

    showDialog?: boolean;

    // rating: string;
    // totalreviews: string;
    // reviews: Review[];
}

export interface MuseumAdd {
  MuseumName: string;
  Location: string;
  PhoneNum: string;
  Description: string;
  Fee: string;
  LengthOfVisit: string;
  // AverageRating: number;
  // ReviewCount: number;
}


export interface addReview {
  comment: string;
  rating: number;
}



export interface Review {
    id: number;
    comment: string;
    rating: number;
    showDialog: boolean;
}