export type RiskLevel = 'HIGH' | 'MEDIUM' | 'LOW';
export type SubmissionStatus = 'SUBMITTED' | 'PREPROCESSING' | 'ANALYZING' | 'PENDING_REVIEW' | 'REVIEWED' | 'ESCALATED' | 'FALSE_ALERT';
export type SignalStatus = 'MATCH' | 'MISMATCH' | 'NOT_FOUND' | 'SUSPICIOUS' | 'NORMAL' | 'UNREADABLE' | 'POSTED_AFTER_EXAM' | 'PASS' | 'FAIL';

export interface Submission {
  id: string;
  submittedAt: string;
  source: string;
  postTimestamp: string;
  examName: string;
  examDate: string;
  centreId: string;
  paperCode: string;
  setNumber: string;
  caption?: string;
  postId?: string;
  status: SubmissionStatus;
  riskLevel: RiskLevel;
  riskScore: number;
  pHash: string;
  duplicateCount: number;
  imageUrl: string;
  processedImageUrl: string;
  analyst: string;
}

export interface Signal {
  id: string;
  name: string;
  weight: number;
  score: number;
  maxScore: number;
  status: SignalStatus;
  reason: string;
  detail?: string;
}

export interface OcrResult {
  submissionId: string;
  examName: string;
  paperCode: string;
  serialNumber: string;
  setNumber: string;
  centreCode: string;
  barcodeText: string;
  watermarkId: string;
  extractedQuestions: string[];
  ocrConfidence: number;
}

export interface ReviewAction {
  id: string;
  submissionId: string;
  action: string;
  actor: string;
  timestamp: string;
  notes?: string;
}

export interface DuplicateRelation {
  id: string;
  submissionId: string;
  matchedSubmissionId: string;
  hashDistance: number;
  relationshipType: 'EXACT_DUPLICATE' | 'COMPRESSED_COPY' | 'CROPPED_VARIANT' | 'MODIFIED_COPY';
  matchedSource: string;
  matchedAt: string;
}

export interface AlertFeedItem {
  id: string;
  submissionId: string;
  examName: string;
  paperCode: string;
  riskScore: number;
  riskLevel: RiskLevel;
  ingestedAt: string;
  centreId: string;
  source: string;
  assignedTo?: string;
}

export interface Examination {
  id: string;
  name: string;
  code: string;
  date: string;
  status: string;
}

export interface UserReport {
  id: string;
  submittedAt: string;
  userName: string;
  userEmail: string;
  source: string;
  postTimestamp: string;
  examId: string;
  examDate: string;
  centreId: string;
  paperCode: string;
  setNumber: string;
  caption?: string;
  postId?: string;
  imageName: string;
  imageData?: string;
  status: SubmissionStatus;
  reviewNote?: string;
}

// Local fixtures keep the prototype usable until API endpoints are connected.
export const submissions: Submission[] = [
  {
    id: 'sub-001', submittedAt: '2026-09-23T07:12:00Z', source: 'WhatsApp', postTimestamp: '2026-09-23T06:48:00Z',
    examName: 'Mathematics Class XII', examDate: '2026-09-23', centreId: 'CTR-1042', paperCode: 'MTH-042', setNumber: 'SET-A',
    status: 'PENDING_REVIEW', riskLevel: 'HIGH', riskScore: 84, pHash: 'demo-a3f9c12e', duplicateCount: 2,
    imageUrl: '/assets/images/no_image.svg', processedImageUrl: '/assets/images/no_image.svg', analyst: 'Shivam Giri',
  },
  {
    id: 'sub-002', submittedAt: '2026-09-23T07:31:00Z', source: 'Telegram', postTimestamp: '2026-09-23T06:55:00Z',
    examName: 'Mathematics Class XII', examDate: '2026-09-23', centreId: 'CTR-1042', paperCode: 'MTH-042', setNumber: 'SET-B',
    status: 'PENDING_REVIEW', riskLevel: 'HIGH', riskScore: 91, pHash: 'demo-b7d2e441', duplicateCount: 1,
    imageUrl: '/assets/images/no_image.svg', processedImageUrl: '/assets/images/no_image.svg', analyst: 'Shivam Giri',
  },
  {
    id: 'sub-003', submittedAt: '2026-09-22T14:22:00Z', source: 'Email Tip', postTimestamp: '2026-09-22T14:15:00Z',
    examName: 'Physics Class XII', examDate: '2026-09-24', centreId: 'CTR-1098', paperCode: 'PHY-019', setNumber: 'SET-A',
    status: 'ANALYZING', riskLevel: 'MEDIUM', riskScore: 58, pHash: 'demo-c8e1f903', duplicateCount: 0,
    imageUrl: '/assets/images/no_image.svg', processedImageUrl: '/assets/images/no_image.svg', analyst: 'Shivam Giri',
  },
];

export const signals: Signal[] = [
  { id: 'sig-ocr', name: 'OCR identifiers', weight: 25, score: 22, maxScore: 25, status: 'MATCH', reason: 'Paper code and set identifiers match the registered examination.', detail: 'Demo signal pending backend OCR.' },
  { id: 'sig-time', name: 'Timeline verification', weight: 20, score: 18, maxScore: 20, status: 'SUSPICIOUS', reason: 'Submission timestamp precedes the scheduled examination window.', detail: 'Demo signal pending source metadata.' },
  { id: 'sig-duplicate', name: 'Duplicate detection', weight: 20, score: 17, maxScore: 20, status: 'MATCH', reason: 'A similar perceptual hash was found in the local comparison set.', detail: 'Demo signal pending image analysis.' },
];

export const ocrResult: OcrResult = {
  submissionId: 'sub-002', examName: 'Mathematics Class XII', paperCode: 'MTH-042', serialNumber: 'SER-DEMO-042', setNumber: 'SET-B',
  centreCode: 'CTR-1042', barcodeText: 'BARCODE-PENDING', watermarkId: 'WM-DEMO-2026', extractedQuestions: ['Question extraction pending backend OCR.'], ocrConfidence: 0,
};

export const duplicates: DuplicateRelation[] = [{
  id: 'dup-001', submissionId: 'sub-002', matchedSubmissionId: 'sub-001', hashDistance: 4,
  relationshipType: 'COMPRESSED_COPY', matchedSource: 'WhatsApp', matchedAt: '2026-09-23T07:35:00Z',
}];

export const reviewActions: ReviewAction[] = [{
  id: 'audit-001', submissionId: 'sub-002', action: 'SUBMITTED', actor: 'System', timestamp: '2026-09-23T07:31:00Z', notes: 'Case created for review.',
}];

export const alertFeed: AlertFeedItem[] = submissions.filter((submission) => submission.riskLevel === 'HIGH').map((submission) => ({
  id: `alert-${submission.id}`, submissionId: submission.id, examName: submission.examName, paperCode: submission.paperCode,
  riskScore: submission.riskScore, riskLevel: submission.riskLevel, ingestedAt: submission.submittedAt, centreId: submission.centreId,
  source: submission.source, assignedTo: submission.analyst,
}));

export const alertsOverTimeData = [
  { date: '18 Sep', high: 1, medium: 0, low: 1 }, { date: '19 Sep', high: 0, medium: 1, low: 0 },
  { date: '20 Sep', high: 1, medium: 1, low: 0 }, { date: '21 Sep', high: 2, medium: 0, low: 1 },
  { date: '22 Sep', high: 1, medium: 1, low: 0 }, { date: '23 Sep', high: 2, medium: 1, low: 0 },
];

export const riskDistributionData = [
  { name: 'High risk', value: 2, color: 'var(--risk-high)' },
  { name: 'Medium risk', value: 1, color: 'var(--risk-medium)' },
  { name: 'Low risk', value: 0, color: 'var(--risk-low)' },
];

export const examinations: Examination[] = [
  { id: 'exam-mth-042', name: 'Mathematics Class XII', code: 'MTH-042', date: '2026-09-23', status: 'UPCOMING' },
  { id: 'exam-phy-019', name: 'Physics Class XII', code: 'PHY-019', date: '2026-09-24', status: 'UPCOMING' },
  { id: 'exam-chm-031', name: 'Chemistry Class XII', code: 'CHM-031', date: '2026-09-25', status: 'UPCOMING' },
  { id: 'exam-neet', name: 'NEET', code: 'NEET', date: '2026-05-03', status: 'UPCOMING' },
  { id: 'exam-jee', name: 'JEE Main', code: 'JEE', date: '2026-04-02', status: 'UPCOMING' },
  { id: 'exam-other', name: 'Other / Local examination', code: 'OTHER', date: '', status: 'MANUAL' },
];
