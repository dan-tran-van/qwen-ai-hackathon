import {
  DocumentStatus,
  Confidentiality,
  statusColors,
  confidentialityColors,
} from "@/data/mock-data";

export function StatusBadge({ status }: { status: DocumentStatus }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${statusColors[status]}`}
    >
      {status}
    </span>
  );
}

export function ConfidentialityBadge({ level }: { level: Confidentiality }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${confidentialityColors[level]}`}
    >
      {level}
    </span>
  );
}
