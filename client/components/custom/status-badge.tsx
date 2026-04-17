import {
  DOCUMENT_CONFIDENTIALITY_LABEL,
  DOCUMENT_STATUS_LABEL,
} from "@/app/(protected)/incoming/constants";
import {
  DocumentStatus,
  Confidentiality,
  statusColors,
  confidentialityColors,
} from "@/data/mock-data";

export function StatusBadge({ status }: { status?: DocumentStatus }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${statusColors[status || "NEW"]}`}
    >
      {DOCUMENT_STATUS_LABEL[status || "NEW"]}
    </span>
  );
}

export function ConfidentialityBadge({ level }: { level: Confidentiality }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${confidentialityColors[level]}`}
    >
      {DOCUMENT_CONFIDENTIALITY_LABEL[level]}
    </span>
  );
}
