import { useCallback, useEffect, useState } from "react";
import { apiUrl } from "../lib/api";
import { parseApiError } from "../lib/parseApiError";
import { mergeSiteContent } from "../lib/siteContentDefaults";

function htmlToText(value) {
	return String(value || "")
		.replace(/<[^>]*>/g, " ")
		.replace(/\s+/g, " ")
		.trim();
}

function featuresToEditorHtml(features) {
	if (!Array.isArray(features) || features.length === 0) return "";
	return `<ul>${features.map((item) => `<li>${item}</li>`).join("")}</ul>`;
}

function featuresEditorHtmlToArray(value) {
	const html = String(value || "").trim();
	if (!html) return [];

	const parser = new DOMParser();
	const doc = parser.parseFromString(html, "text/html");
	const itemNodes = doc.body.querySelectorAll("li");
	const nodes = itemNodes.length ? itemNodes : doc.body.querySelectorAll("p");
	const items = Array.from(nodes)
		.map((node) => node.innerHTML.trim())
		.filter((item) => htmlToText(item));

	if (items.length) return items;

	return html
		.split(/\r?\n/)
		.map((item) => item.trim())
		.filter(Boolean);
}

function toDraft(content) {
	const merged = mergeSiteContent(content);
	return {
		homeHero: { ...merged.homeHero },
		about: {
			...merged.about,
			featuresText: featuresToEditorHtml(merged.about.features),
		},
	};
}

function draftToPayload(draft) {
	return {
		homeHero: { ...draft.homeHero },
		about: {
			...draft.about,
			features: featuresEditorHtmlToArray(draft.about.featuresText),
		},
	};
}

export function useSiteContentAdmin() {
	const [content, setContent] = useState(() => mergeSiteContent(null));
	const [draft, setDraft] = useState(() => toDraft(null));
	const [loading, setLoading] = useState(true);
	const [listError, setListError] = useState("");
	const [formError, setFormError] = useState("");
	const [submitting, setSubmitting] = useState(false);

	const loadSiteContent = useCallback(async () => {
		setListError("");
		setLoading(true);
		try {
			const res = await fetch(apiUrl("/api/site-content"));
			if (!res.ok) throw new Error(await parseApiError(res));
			const nextContent = mergeSiteContent(await res.json());
			setContent(nextContent);
			setDraft(toDraft(nextContent));
		} catch (err) {
			setListError(err.message || "Failed to load page content.");
			const fallback = mergeSiteContent(null);
			setContent(fallback);
			setDraft(toDraft(fallback));
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		loadSiteContent();
	}, [loadSiteContent]);

	const resetDraft = () => {
		setDraft(toDraft(content));
		setFormError("");
	};

	const saveDraft = async (section, files = {}) => {
		setSubmitting(true);
		setFormError("");
		try {
			const payload = draftToPayload(draft);
			const fd = new FormData();
			fd.append(
				"content",
				JSON.stringify({
					...content,
					...payload,
					[section]: payload[section],
				}),
			);
			for (const [field, file] of Object.entries(files)) {
				if (file) fd.append(field, file);
			}
			const res = await fetch(apiUrl("/api/site-content"), {
				method: "PUT",
				body: fd,
			});
			if (!res.ok) throw new Error(await parseApiError(res));
			const nextContent = mergeSiteContent(await res.json());
			setContent(nextContent);
			setDraft(toDraft(nextContent));
			return true;
		} catch (err) {
			setFormError(err.message || "Failed to save page content.");
			return false;
		} finally {
			setSubmitting(false);
		}
	};

	return {
		content,
		draft,
		setDraft,
		loading,
		listError,
		formError,
		submitting,
		loadSiteContent,
		resetDraft,
		saveDraft,
	};
}
