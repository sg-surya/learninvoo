
export enum ViewType {
    DASHBOARD = 'DASHBOARD',
    LIBRARY = 'LIBRARY',
    WORKSPACE = 'WORKSPACE',
    CALENDAR = 'CALENDAR',
    NOTES = 'NOTES',
    SCHEDULE = 'SCHEDULE',
    CLASSES = 'CLASSES',
    REPORTS = 'REPORTS',
    ASSIGNMENTS = 'ASSIGNMENTS',
    CLASS_DETAIL = 'CLASS_DETAIL'
}

export interface Student {
    id: string;
    firstName: string;
    lastName: string;
    age: number;
    interests: string[];
    score: number;
    grade: string;
}

export interface ClassInfo {
    id: string;
    name: string;
    studentsCount: number;
    grade: string;
    startDate: string;
}

export interface PerformanceData {
    month: string;
    value: number;
}
