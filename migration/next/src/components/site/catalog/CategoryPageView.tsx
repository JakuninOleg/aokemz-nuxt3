'use client';

import { useState, type ReactNode } from 'react';
import type { CategoryEquipmentItem, CategorySpecOption } from '@/lib/catalog-content';
import { CategoryEquipment } from './CategoryEquipment';
import { CategorySpecifications } from './CategorySpecifications';

type Props = {
  equipment: CategoryEquipmentItem[];
  hasDocuments: boolean;
  specOptions: CategorySpecOption[];
  specPanels: ReactNode;
};

export function CategoryPageView({ equipment, hasDocuments, specOptions, specPanels }: Props) {
  const [inspectId, setInspectId] = useState('');
  return (
    <>
      <CategoryEquipment products={equipment} hasDocuments={hasDocuments} onInspect={setInspectId} />
      {specOptions.length > 0 && (
        <CategorySpecifications options={specOptions} selectedId={inspectId || undefined}>
          {specPanels}
        </CategorySpecifications>
      )}
    </>
  );
}
