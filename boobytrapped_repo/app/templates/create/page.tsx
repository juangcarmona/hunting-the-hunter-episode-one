"use client";

import Loader from "@/components/common/Loader";
import TemplateContent from "@/components/templates_form/TemplateContent";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import useSWR from "swr";

const CreateTemplate = () => {
    const searchParams = useSearchParams();

    const params = useMemo(() => {
        const templateId = searchParams.get("templateId");
        //const projectId = searchParams.get("projectId");
        // if (!templateId || !projectId) return null;
        if (!templateId) return null;
        return { templateId };
        // return { templateId, projectId };
    }, [searchParams]);
    const { data } = useSWR(params ? `/templates` : null);
    const selectedTemplate = useMemo(
        () =>
            data && params
                ? data.data.json.find(
                      (template: any) => template.id === params.templateId,
                  )
                : null,
        [data, params],
    );
    return !data && params ? (
        <Loader />
    ) : (
        <TemplateContent {...selectedTemplate} />
    );
};
export default CreateTemplate;
