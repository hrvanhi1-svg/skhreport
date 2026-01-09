
export enum UserRole {
  SYS = "SYS",   // System Admin
  DM = "DM",     // Director
  DDM = "DDM",   // Deputy Director
  TL = "TL",     // Team Leader / Head of Department
  EMP = "EMP"    // Employee
}

// Added TaskCategory enum to solve missing member error
export enum TaskCategory {
  I = "I",
  II = "II",
  III = "III",
  IV = "IV",
  V = "V"
}

export enum ReportStatus {
  DRAFT = "draft",
  SUBMITTED = "submitted",
  REVIEWED = "reviewed",
  APPROVED = "approved",
  REJECTED = "rejected"
}

export enum ReviewDecision {
  APPROVE = "approve",
  REVISE = "revise",
  REJECT = "reject"
}

export interface SubTask {
  id: string;
  name: string;
  result: string;
}

export interface ManagerReview {
  id: string;
  managerId: string;
  managerName: string;
  managerRole: UserRole;
  comment: string;
  score: number;
  decision: ReviewDecision;
  reviewedAt: string;
}

export interface Task {
  id: string;
  category: TaskCategory; // Added to resolve errors in constants.ts
  name: string;
  weight: number; 
  startDate: string;
  deadline: string;
  actualFinish: string;
  collaboration: string; // Added to resolve errors in constants.ts
  resultDescription: string; 
  subTasks?: SubTask[]; 
  selfScore: number; 
  managerScore: number; 
  note: string;
}

export interface KPIResult {
  totalScore: number;
  rank: 'A' | 'B' | 'C' | 'D' | 'E';
}

export interface UserAccount {
  email: string;
  password?: string;
  name: string;
  role: UserRole;
  department: string;
  age: string;
  joinDate: string;
  managerEmails: string[]; // List of manager emails for this user
}

export interface StaffReport {
  id: string;
  userId: string;
  userName: string;
  department: string;
  tasks: Task[];
  status: ReportStatus;
  submittedAt: string;
  reviews: ManagerReview[];
}