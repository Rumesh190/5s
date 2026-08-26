export type VerificationResult = "Pending" | "Passed" | "Failed"

export interface VerificationRecord {
  result: VerificationResult
  verifiedBy: string | null
  verifiedAt: string | null
  comments: string
  failureReason: string
}