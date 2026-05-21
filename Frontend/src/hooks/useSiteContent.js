import { useCallback, useEffect, useState } from "react";
import { apiUrl } from "../lib/api";
import { mergeSiteContent } from "../lib/siteContentDefaults";

export function useSiteContent() {
	const [content, setContent] = useState(() => mergeSiteContent(null));
	const [loading, setLoading] = useState(true);

	const loadSiteContent = useCallback(async () => {
		setLoading(true);
		try {
			const res = await fetch(apiUrl("/api/site-content"));
			if (!res.ok) {
				setContent(mergeSiteContent(null));
				return;
			}
			setContent(mergeSiteContent(await res.json()));
		} catch {
			setContent(mergeSiteContent(null));
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		loadSiteContent();
	}, [loadSiteContent]);

	return { content, loading, loadSiteContent };
}
