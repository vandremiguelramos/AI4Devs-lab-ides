export type Education = 
  | 'High School'
  | 'Associate Degree'
  | 'Bachelor\'s Degree'
  | 'Master\'s Degree'
  | 'Ph.D.'
  | 'Technical Certificate'
  | 'Other';

export const EDUCATION_OPTIONS: Education[] = [
  'High School',
  'Associate Degree',
  'Bachelor\'s Degree',
  'Master\'s Degree',
  'Ph.D.',
  'Technical Certificate',
  'Other'
];

export interface Candidate {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string | null;
  address: string | null;
  education: Education | null;
  workExperience: string | null;
  cvUrl: string | null;
  createdAt: string;
} 