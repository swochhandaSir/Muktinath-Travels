import { useCallback, useEffect, useRef, useState } from "react";
import { apiUrl } from "../lib/api";
import { parseApiError } from "../lib/parseApiError";

export function emptyItineraryDay(index = 0) {
	const n = String(index + 1).padStart(2, "0");
	return { dayNumber: `Day ${n}`, description: "" };
}

export function emptyPackageDraft() {
	return {
		title: "",
		location: "",
		duration: "",
		groupSize: "",
		price: "",
		exploreLink: "",
		itinerary: [emptyItineraryDay(0)],
	};
}

export function packageToDraft(pkg) {
	return {
		title: pkg.title,
		location: pkg.location,
		duration: pkg.duration,
		groupSize: String(pkg.groupSize),
		price: String(pkg.price),
		exploreLink: pkg.exploreLink || "",
		itinerary:
			pkg.itinerary?.length > 0
				? pkg.itinerary.map((d) => ({
						dayNumber: d.dayNumber,
						description: d.description,
					}))
				: [emptyItineraryDay(0)],
	};
}

function validateDraft(draft) {
	const title = draft.title.trim();
	const location = draft.location.trim();
	const duration = draft.duration.trim();
	const groupSize = Number.parseInt(draft.groupSize, 10);
	const priceNum = Number.parseFloat(draft.price);
	const itinerary = draft.itinerary
		.map((d) => ({
			dayNumber: d.dayNumber.trim(),
			description: d.description.trim(),
		}))
		.filter((d) => d.dayNumber && d.description);

	if (!title) return "Title is required.";
	if (!location) return "Location is required.";
	if (!duration) return "Duration is required.";
	if (!Number.isFinite(groupSize) || groupSize < 1) {
		return "Enter a valid group size (at least 1).";
	}
	if (!Number.isFinite(priceNum) || priceNum < 0) {
		return "Enter a valid price.";
	}
	if (itinerary.length === 0) {
		return "Add at least one itinerary day with a description.";
	}
	return null;
}

export function usePackagesAdmin() {
	const [packages, setPackages] = useState([]);
	const [loading, setLoading] = useState(true);
	const [listError, setListError] = useState("");
	const [formModal, setFormModal] = useState(null);
	const [draft, setDraft] = useState(emptyPackageDraft);
	const [formError, setFormError] = useState("");
	const [formSubmitting, setFormSubmitting] = useState(false);
	const [deleteTarget, setDeleteTarget] = useState(null);
	const [deleteSubmitting, setDeleteSubmitting] = useState(false);
	const imageInputRef = useRef(null);

	const loadPackages = useCallback(async () => {
		setListError("");
		setLoading(true);
		try {
			const res = await fetch(apiUrl("/api/packages"));
			if (!res.ok) throw new Error(await parseApiError(res));
			setPackages(await res.json());
		} catch (err) {
			setListError(err.message || "Failed to load packages.");
			setPackages([]);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		loadPackages();
	}, [loadPackages]);

	useEffect(() => {
		if (!formModal) return;
		const onKey = (e) => {
			if (e.key === "Escape") {
				setFormModal(null);
				setFormError("");
			}
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [formModal]);

	useEffect(() => {
		if (!deleteTarget) return;
		const onKey = (e) => {
			if (e.key === "Escape") setDeleteTarget(null);
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [deleteTarget]);

	const resetImageInput = () => {
		if (imageInputRef.current) imageInputRef.current.value = "";
	};

	const openAdd = () => {
		setDraft(emptyPackageDraft());
		setFormError("");
		resetImageInput();
		setFormModal({ mode: "add" });
	};

	const openEdit = (pkg) => {
		setDraft(packageToDraft(pkg));
		setFormError("");
		resetImageInput();
		setFormModal({ mode: "edit", pkg });
	};

	const closeForm = () => {
		setFormModal(null);
		setFormError("");
	};

	const submitForm = async (e) => {
		e.preventDefault();
		const errMsg = validateDraft(draft);
		if (errMsg) {
			setFormError(errMsg);
			return;
		}

		const file = imageInputRef.current?.files?.[0];
		if (formModal.mode === "add" && !file) {
			setFormError("Choose an image file.");
			return;
		}

		const itinerary = draft.itinerary
			.map((d) => ({
				dayNumber: d.dayNumber.trim(),
				description: d.description.trim(),
			}))
			.filter((d) => d.dayNumber && d.description);

		const fd = new FormData();
		fd.append("title", draft.title.trim());
		fd.append("location", draft.location.trim());
		fd.append("duration", draft.duration.trim());
		fd.append("groupSize", String(Number.parseInt(draft.groupSize, 10)));
		fd.append("price", String(Number.parseFloat(draft.price)));
		fd.append("exploreLink", draft.exploreLink.trim());
		fd.append("itinerary", JSON.stringify(itinerary));
		if (file) fd.append("image", file);

		setFormSubmitting(true);
		setFormError("");
		try {
			const url =
				formModal.mode === "add"
					? apiUrl("/api/packages")
					: apiUrl(`/api/packages/${formModal.pkg.id}`);
			const res = await fetch(url, {
				method: formModal.mode === "add" ? "POST" : "PUT",
				body: fd,
			});
			if (!res.ok) throw new Error(await parseApiError(res));
			await loadPackages();
			closeForm();
		} catch (err) {
			setFormError(err.message || "Something went wrong.");
		} finally {
			setFormSubmitting(false);
		}
	};

	const confirmDelete = async () => {
		if (!deleteTarget) return;
		setDeleteSubmitting(true);
		try {
			const res = await fetch(apiUrl(`/api/packages/${deleteTarget.id}`), {
				method: "DELETE",
			});
			if (!res.ok) throw new Error(await parseApiError(res));
			await loadPackages();
			setDeleteTarget(null);
		} catch (err) {
			setListError(err.message || "Failed to delete package.");
			setDeleteTarget(null);
		} finally {
			setDeleteSubmitting(false);
		}
	};

	return {
		packages,
		loading,
		listError,
		loadPackages,
		formModal,
		draft,
		setDraft,
		formError,
		formSubmitting,
		imageInputRef,
		deleteTarget,
		setDeleteTarget,
		deleteSubmitting,
		openAdd,
		openEdit,
		closeForm,
		submitForm,
		confirmDelete,
	};
}
