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
			const sectionPath = section
				? `/api/site-content/${SECTION_PATHS[section] ?? section}`
				: null;
			const res = await fetch(apiUrl(sectionPath || "/api/site-content"));
			if (!res.ok) {
				throw new Error("Failed to load site content.");
			}

			const data = await res.json();
			if (section) {
				const nextContent = mergeSiteContent({ [section]: data });
				setContent((prev) => ({
					...prev,
					[section]: nextContent[section],
				}));
			} else {
				setContent(mergeSiteContent(data));
			}
		} catch {
			if (section) {
				try {
					const res = await fetch(apiUrl("/api/site-content"));
					if (!res.ok) throw new Error("Failed to load site content.");
					const nextContent = mergeSiteContent(await res.json());
					setContent((prev) => ({
						...prev,
						[section]: nextContent[section],
					}));
					return;
				} catch {
					setContent((prev) => ({
						...prev,
						[section]: defaultContent[section],
					}));
				}
			} else {
				setContent(defaultContent);
			}
		} finally {
			setLoading(false);
		}
	}, [section, defaultContent]);

	useEffect(() => {
		loadSiteContent();
	}, [loadSiteContent]);

	return { content, loading, loadSiteContent };
}
