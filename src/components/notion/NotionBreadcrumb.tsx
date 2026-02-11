import { ChevronRight, GraduationCap } from "lucide-react";
import { TabeIconRenderer } from "./TabeIcons";

interface NotionBreadcrumbProps {
    subjectCode?: string;
    subjectName?: string;
    documentTitle?: string;
    documentEmoji?: string;
    onClickSubject?: () => void;
}

export function NotionBreadcrumb({
    subjectCode,
    subjectName,
    documentTitle,
    documentEmoji,
    onClickSubject,
}: NotionBreadcrumbProps) {
    return (
        <nav className="notion-breadcrumb">
            {subjectCode && (
                <>
                    <span
                        className="notion-breadcrumb-item"
                        onClick={onClickSubject}
                        title={subjectName}
                    >
                        <GraduationCap className="w-3.5 h-3.5" style={{ flexShrink: 0 }} />
                        {subjectCode}
                    </span>
                    <ChevronRight className="w-3 h-3 notion-breadcrumb-separator" />
                </>
            )}
            <span className="notion-breadcrumb-item" style={{ cursor: "default" }}>
                <TabeIconRenderer iconId={documentEmoji || "book"} size={16} />
                {documentTitle || "Sin título"}
            </span>
        </nav>
    );
}
