import { createHash } from 'node:crypto';
import type { Payload } from 'payload';
import type { ContactLead, TechnicalLeadDetails } from './contact-validation';

export type StoredLeadInput = ContactLead & { technical?: TechnicalLeadDetails; sourcePath: string; requestId: string };
export type LeadStore = {
  reserve: (input: StoredLeadInput) => Promise<{ id: number; created: boolean }>;
  finish: (id: number, status: 'sent' | 'failed') => Promise<void>;
};

/** Trusted form service only; public collection create remains denied. No raw IP is stored. */
export function createLeadStore(cms: Payload): LeadStore {
  return {
    async reserve(input) {
      const requestHash = createHash('sha256').update(JSON.stringify({ ...input, technical: input.technical ?? null })).digest('hex');
      const existing = async () => {
        const result = await cms.find({ collection: 'leads', overrideAccess: true, depth: 0, limit: 1, where: { requestId: { equals: input.requestId } } });
        const doc = result.docs[0];
        if (!doc) return null;
        if (doc.requestHash !== requestHash) throw new Error('Request ID already used for other content');
        return { id: doc.id, created: false };
      };
      const found = await existing();
      if (found) return found;
      try {
        const doc = await cms.create({ collection: 'leads', overrideAccess: true, depth: 0, data: {
          ...input, status: 'new', requestHash, mailStatus: 'pending',
          consentAt: new Date().toISOString(), consentVersion: '/legal#consent',
        } });
        return { id: doc.id, created: true };
      } catch (error) {
        // Unique requestId also resolves concurrent retries across separate processes.
        const raced = await existing();
        if (raced) return raced;
        throw error;
      }
    },
    async finish(id, status) {
      await cms.update({ collection: 'leads', id, overrideAccess: true, depth: 0,
        data: { mailStatus: status, ...(status === 'sent' ? { mailSentAt: new Date().toISOString() } : {}) } });
    },
  };
}
