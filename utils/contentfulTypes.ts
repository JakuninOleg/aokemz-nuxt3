/** Resolved entries returned by the site's Contentful adapter, not SDK field skeletons. */
export interface ContentfulEntries<T> {
  items: T[];
  total: number;
  skip: number;
  limit: number;
}
