import { useMemo, useRef } from "react";
import { usePageContext } from 'vike-react/usePageContext';

export const useQuery = <T extends string[]>(..._targetQueries: T) => {
  const { current: targetQueries } = useRef(_targetQueries);
  const pageContext = usePageContext();
  const query = useMemo(() => new URLSearchParams(pageContext.urlParsed.search), [pageContext.urlParsed.search]);
  const retrunQueries = useMemo(() => {
    return targetQueries.reduce(
      (queries, targetQueryString) => ({ ...queries, [`${targetQueryString}Query`]: query.get(targetQueryString) }),
      {} as Record<`${(typeof targetQueries)[number]}Query`, string | null>,
    );
  }, [query, targetQueries]);
  const all = useMemo(() => Object.fromEntries(query.entries()), [query]);
  return { ...retrunQueries, all };
};
