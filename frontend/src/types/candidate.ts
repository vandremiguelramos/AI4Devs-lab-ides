export type Education = 'HIGH_SCHOOL' | 'BACHELORS' | 'MASTERS' | 'PHD';

export const EDUCATION_OPTIONS: Education[] = [
  'HIGH_SCHOOL',
  'BACHELORS',
  'MASTERS',
  'PHD'
];

export interface Candidate {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  education: Education;
  workExperience: string;
  cvUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ErrorState {
  title: string;
  message: string;
  type: 'error' | 'warning' | 'info' | 'success';
} 