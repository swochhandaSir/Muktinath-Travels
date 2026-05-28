import { useCallback, useEffect, useMemo, useState } from "react";
import { apiUrl } from "../lib/api";
import { mergeSiteContent } from "../lib/siteContentDefaults";

const SECTION_PATHS = {
	homeHero: "home-hero",
	about: "about",
	process: "process",
	service: "service",
};

export function useSiteContent(section) {
	const defaultContent = useMemo(() => mergeSiteContent(null), []);
	const [content, setContent] = useState(defaultContent);
	const [loading, setLoading] = useState(true);

	const loadSiteContent = useCallback(async () => {
		setLoading(true);
		try {
			const path = section
				? `/api/site-content/${SECTION_PATHS[section] ?? section}`
				: "/api/site-content";
			const res = await fetch(apiUrl(path));
			if (!res.ok) {
				if (section) {
					setContent((prev) => ({
						...prev,
						[section]: defaultContent[section],
					}));
				} else {
					setContent(defaultContent);
				}
				return;
			}

			const data = await res.json();
			if (section) {
				setContent((prev) => ({
					...prev,
					[section]: { ...defaultContent[section], ...data },
				}));
			} else {
				setContent(mergeSiteContent(data));
			}
		} catch {
			if (section) {
				setContent((prev) => ({
					...prev,
					[section]: defaultContent[section],
				}));
			} else {
				setContent(defaultContent);
			}
		} finally {
			setLoading(false);
		}
	}, [section, defaultContent]);

	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		loadSiteContent();
	}, [loadSiteContent]);

	return { content, loading, loadSiteContent };
}
