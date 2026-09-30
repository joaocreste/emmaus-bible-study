import { SourcesContent } from '../sources/SourcesContent';
import { StudySection } from '../StudySection';
import type { SectionProps } from '../types';

/**
 * Sources — the last dashboard section: every work cited in the study, grouped and
 * licensed, with the provenance legend ("How to read the labels").
 */
export function SourcesSection({ study, index }: SectionProps) {
  return (
    <StudySection id="sources" index={index}>
      <SourcesContent study={study} />
    </StudySection>
  );
}
