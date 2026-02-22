export interface IUser {
  _id: string;
  name: string;
  profilePicture?: string;
  auth0Id: string; // Тепер обов'язкове, щоб задовольнити ReviewCard
}

export interface EnrichedJob {
  jobType: any;
  location: ReactNode;
  applicantsDetails: any;
  applicants: any;
  _id: string;
  title: string;
  createdAt: string;
  likes: IUser[]; // Масив об'єктів, а не string[]
}

// Ваш основний інтерфейс Job (якщо він потрібен в інших місцях)
export interface Job {
  _id: string;
  title: string;
  description: string;
  location: string;
  salary: number;
  jobType: string[];
  skills: string[];
  tags: string[];
  salaryType: string;
  negotiable: boolean;
  createdBy: {
    _id: string;
    name: string;
    profilePicture?: string;
  };
  likes: string[]; // Тут залишаються string[], як на бекенді
  applicants: string[];
  createdAt: string;
  updatedAt?: string;
}

export interface IJob {
  _id: string;
  title: string;
  createdAt: string;
  auth0Id: string;
  likes: IUser[];
}


