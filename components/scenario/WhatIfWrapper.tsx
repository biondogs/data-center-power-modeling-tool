"use client";

import { WhatIfDialog } from "@/components/whatif/WhatIfDialog";

interface WhatIfWrapperProps {
    scenario: any;
    catalogItems: any[];
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onApply: (changes: any[]) => void;
}

export function WhatIfWrapper({
    scenario,
    catalogItems,
    open,
    onOpenChange,
    onApply,
}: WhatIfWrapperProps) {
    return (
        <WhatIfDialog
            scenario={scenario}
            catalogItems={catalogItems}
            open={open}
            onOpenChange={onOpenChange}
            onApply={onApply}
        />
    );
}