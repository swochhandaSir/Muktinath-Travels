import { useCallback, useEffect, useRef, useState } from "react";
import { apiUrl } from "../lib/api";
import { parseApiError } from "../lib/parseApiError";

export function emptyBikeDraft() {
	return { name: "", price: "" };
}

export function bikeToDraft(bike) {
	return {
		name: bike.name,
		price: String(bike.price),
	};
}

export function useBikesAdmin() {
	const [bikes, setBikes] = useState([]);
	const [loading, setLoading] = useState(true);
	const [listError, setListError] = useState("");
	const [formModal, setFormModal] = useState(null);
	const [draft, setDraft] = useState(emptyBikeDraft);
	const [formError, setFormError] = useState("");
	const [formSubmitting, setFormSubmitting] = useState(false);
	const [deleteTarget, setDeleteTarget] = useState(null);
	const [deleteSubmitting, setDeleteSubmitting] = useState(false);
	const imageInputRef = useRef(null);

	const loadBikes = useCallback(async () => {
		setListError("");
		setLoading(true);
		try {
			const res = await fetch(apiUrl("/api/bikes"));
			if (!res.ok) throw new Error(await parseApiError(res));
			setBikes(await res.json());
		} catch (err) {
			setListError(err.message || "Failed to load bikes.");
			setBikes([]);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		loadBikes();
	}, [loadBikes]);

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
		setDraft(emptyBikeDraft());
		setFormError("");
		resetImageInput();
		setFormModal({ mode: "add" });
	};

	const openEdit = (bike) => {
		setDraft(bikeToDraft(bike));
		setFormError("");
		resetImageInput();
		setFormModal({ mode: "edit", bike });
	};

	const closeForm = () => {
		setFormModal(null);
		setFormError("");
	};

	const submitForm = async (e) => {
		e.preventDefault();
		const name = draft.name.trim();
		const priceNum = Number.parseFloat(draft.price);
		const file = imageInputRef.current?.files?.[0];

		if (!name) {
			setFormError("Name is required.");
			return;
		}
		if (!Number.isFinite(priceNum) || priceNum < 0) {
			setFormError("Enter a valid price per day.");
			return;
		}
		if (formModal.mode === "add" && !file) {
			setFormError("Choose an image file.");
			return;
		}

		const fd = new FormData();
		fd.append("name", name);
		fd.append("price", String(priceNum));
		if (file) fd.append("image", file);

		setFormSubmitting(true);
		setFormError("");
		try {
			const url =
				formModal.mode === "add"
					? apiUrl("/api/bikes")
					: apiUrl(`/api/bikes/${formModal.bike.id}`);
			const res = await fetch(url, {
				method: formModal.mode === "add" ? "POST" : "PUT",
				body: fd,
			});
			if (!res.ok) throw new Error(await parseApiError(res));
			await loadBikes();
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
			const res = await fetch(apiUrl(`/api/bikes/${deleteTarget.id}`), {
				method: "DELETE",
			});
			if (!res.ok) throw new Error(await parseApiError(res));
			await loadBikes();
			setDeleteTarget(null);
		} catch (err) {
			setListError(err.message || "Failed to delete bike.");
			setDeleteTarget(null);
		} finally {
			setDeleteSubmitting(false);
		}
	};

	return {
		bikes,
		loading,
		listError,
		loadBikes,
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
