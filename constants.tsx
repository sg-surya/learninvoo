
import { PerformanceData, ClassInfo, Student } from './types';

export const PERFORMANCE_DATA: PerformanceData[] = [
  { month: 'JAN', value: 30 },
  { month: 'FEB', value: 45 },
  { month: 'MAR', value: 35 },
  { month: 'APR', value: 50 },
  { month: 'MAY', value: 48 },
  { month: 'JUN', value: 65 },
  { month: 'JUL', value: 76.30 },
  { month: 'AUG', value: 60 },
  { month: 'SEP', value: 55 },
  { month: 'OCT', value: 70 },
  { month: 'NOV', value: 72 },
  { month: 'DEC', value: 85 },
];

export const CLASSES_DATA: ClassInfo[] = [
  { id: '1', name: 'Mathematic', studentsCount: 30, grade: 'A', startDate: '12 Sep 2023' },
  { id: '2', name: 'Science', studentsCount: 15, grade: 'B', startDate: '15 Oct 2023' },
  { id: '3', name: 'History', studentsCount: 39, grade: 'A', startDate: '01 Nov 2023' },
  { id: '4', name: 'Business Management', studentsCount: 45, grade: 'C', startDate: '10 Dec 2023' },
];

export const TOP_STUDENTS = [
  { name: 'Robert Fox', class: 'Class 11th', score: 97.76, image: 'https://picsum.photos/seed/rob/100/100' },
  { name: 'Cody Fisher', class: 'Class 10th', score: 98.66, image: 'https://picsum.photos/seed/cod/100/100' },
  { name: 'Jenny Wilson', class: 'Class 9th', score: 98.42, image: 'https://picsum.photos/seed/jen/100/100' },
  { name: 'Jacob Jones', class: 'Class 8th', score: 97.12, image: 'https://picsum.photos/seed/jac/100/100' },
  { name: 'Devon Lane', class: 'Class 11th', score: 95.12, image: 'https://picsum.photos/seed/dev/100/100' },
];

export const CLASS_STUDENTS: Student[] = [
  { id: '1', firstName: 'Victoria', lastName: 'Hawkins', age: 15, interests: ['Mural Painting', 'Yoga'], score: 92, grade: 'A' },
  { id: '2', firstName: 'Leslie', lastName: 'Warren', age: 14, interests: ['Mural Painting', 'Yoga'], score: 88, grade: 'A' },
  { id: '3', firstName: 'Arlene', lastName: 'Edwards', age: 13, interests: ['Music', 'Reading'], score: 75, grade: 'B' },
  { id: '4', firstName: 'Shawn', lastName: 'Richards', age: 15, interests: ['NFL', 'Yoga'], score: 82, grade: 'B' },
  { id: '5', firstName: 'Darlene', lastName: 'Lane', age: 14, interests: ['Mural Painting', 'Yoga'], score: 95, grade: 'A' },
];
